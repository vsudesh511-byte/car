import { useEffect, useState } from "react";
import { imageKey, imageUrl, type Car } from "./cars";
import { ApiError, JAVA_API, PHP_API, errorMessage, getToken, request, setToken } from "./api";

const COMPARE_KEY = "carverse_compare";

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l());
}

function useLocalValue<T>(read: () => T, fallback: T): T {
  const [value, setValue] = useState<T>(fallback);
  useEffect(() => {
    const sync = () => setValue(read());
    sync();
    listeners.add(sync);
    window.addEventListener("storage", sync);
    return () => {
      listeners.delete(sync);
      window.removeEventListener("storage", sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return value;
}

/* ---------------- cars (Java API) ---------------- */

type CarsStatus = { loading: boolean; error: string | null };

let carsCache: Car[] = [];
let carsStatus: CarsStatus = { loading: true, error: null };
let carsRequested = false;

const fromApi = (car: Car): Car => ({ ...car, image: imageUrl(car.image) });
const toApi = (car: Omit<Car, "id">) => ({ ...car, image: imageKey(car.image) });

export async function loadCars() {
  try {
    const cars = await request<Car[]>(JAVA_API);
    carsCache = cars.map(fromApi);
    carsStatus = { loading: false, error: null };
  } catch (e) {
    carsStatus = { loading: false, error: errorMessage(e) };
  }
  notify();
}

function useLoadCarsOnce() {
  useEffect(() => {
    if (!carsRequested) {
      carsRequested = true;
      void loadCars();
    }
  }, []);
}

export function useCars(): Car[] {
  useLoadCarsOnce();
  return useLocalValue(() => carsCache, []);
}

export function useCarsStatus(): CarsStatus {
  useLoadCarsOnce();
  return useLocalValue(() => carsStatus, { loading: true, error: null });
}

/** Admin calls: if the token has expired, log out so the UI shows the login page. */
async function adminRequest<T>(url: string, options: Parameters<typeof request>[1] = {}) {
  try {
    return await request<T>(url, { ...options, admin: true });
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      setToken(null);
      notify();
    }
    throw e;
  }
}

export async function addCar(car: Omit<Car, "id">): Promise<Car> {
  const created = await adminRequest<Car>(JAVA_API, { method: "POST", body: toApi(car) });
  await loadCars();
  return fromApi(created);
}

export async function updateCar(id: string, patch: Omit<Car, "id">) {
  await adminRequest(`${JAVA_API}/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: toApi(patch),
  });
  await loadCars();
}

export async function deleteCar(id: string) {
  await adminRequest(`${JAVA_API}/${encodeURIComponent(id)}`, { method: "DELETE" });
  writeCompare(readCompare().filter((cid) => cid !== id));
  await loadCars();
}

export async function resetCars() {
  await adminRequest(`${JAVA_API}/reset`, { method: "POST" });
  await loadCars();
}

/* ---------------- compare (kept in the browser) ---------------- */

export const MAX_COMPARE = 3;

export function readCompare(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(COMPARE_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeCompare(ids: string[]) {
  window.localStorage.setItem(COMPARE_KEY, JSON.stringify(ids));
  notify();
}

export function useCompare(): string[] {
  return useLocalValue(readCompare, []);
}

/** Adds or removes a car from the comparison list. Returns a status message. */
export function toggleCompare(id: string): string {
  const current = readCompare();
  if (current.includes(id)) {
    writeCompare(current.filter((c) => c !== id));
    return "Removed from compare";
  }
  if (current.length >= MAX_COMPARE) {
    return `You can compare up to ${MAX_COMPARE} cars`;
  }
  writeCompare([...current, id]);
  return "Added to compare";
}

/* ---------------- admin session (PHP service) ---------------- */

export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "admin123";

let tokenChecked = false;

export function readAuth(): boolean {
  return Boolean(getToken());
}

export function useAuth() {
  const loggedIn = useLocalValue(readAuth, false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
    if (!tokenChecked && getToken()) {
      tokenChecked = true;
      adminRequest(`${PHP_API}/me.php`).catch(() => {});
    }
  }, []);
  return { loggedIn, ready };
}

/** Returns false for a wrong username/password; throws if the PHP service is down. */
export async function login(username: string, password: string): Promise<boolean> {
  try {
    const res = await request<{ token: string }>(`${PHP_API}/login.php`, {
      method: "POST",
      body: { username: username.trim(), password },
    });
    setToken(res.token);
    tokenChecked = true;
    notify();
    return true;
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) return false;
    throw e;
  }
}

export function logout() {
  const token = getToken();
  setToken(null);
  notify();
  if (token) request(`${PHP_API}/logout.php`, { method: "POST", token }).catch(() => {});
}
