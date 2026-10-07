import { useEffect, useState } from "react";
import { defaultCars, type Car } from "./cars";

const CARS_KEY = "carverse_cars";
const COMPARE_KEY = "carverse_compare";
const AUTH_KEY = "carverse_admin";

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

/* ---------------- cars ---------------- */

export function readCars(): Car[] {
  if (typeof window === "undefined") return defaultCars;
  try {
    const raw = window.localStorage.getItem(CARS_KEY);
    if (!raw) return defaultCars;
    const parsed = JSON.parse(raw) as Car[];
    return Array.isArray(parsed) ? parsed : defaultCars;
  } catch {
    return defaultCars;
  }
}

export function writeCars(cars: Car[]) {
  window.localStorage.setItem(CARS_KEY, JSON.stringify(cars));
  notify();
}

export function useCars(): Car[] {
  return useLocalValue(readCars, defaultCars);
}

export function addCar(car: Omit<Car, "id">): Car {
  const created: Car = { ...car, id: `car-${Date.now()}` };
  writeCars([created, ...readCars()]);
  return created;
}

export function updateCar(id: string, patch: Omit<Car, "id">) {
  writeCars(readCars().map((c) => (c.id === id ? { ...patch, id } : c)));
}

export function deleteCar(id: string) {
  writeCars(readCars().filter((c) => c.id !== id));
  writeCompare(readCompare().filter((cid) => cid !== id));
}

export function resetCars() {
  writeCars(defaultCars);
}

/* ---------------- compare ---------------- */

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

/* ---------------- admin session ---------------- */

export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "admin123";

export function readAuth(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(AUTH_KEY) === "true";
}

export function useAuth() {
  const loggedIn = useLocalValue(readAuth, false);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return { loggedIn, ready };
}

export function login(username: string, password: string): boolean {
  if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    window.localStorage.setItem(AUTH_KEY, "true");
    notify();
    return true;
  }
  return false;
}

export function logout() {
  window.localStorage.removeItem(AUTH_KEY);
  notify();
}
