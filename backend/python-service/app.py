"""
CarVerse Python service (Flask).

Reads the cars from the shared SQLite database and adds the "smart" features:
  GET /api/py/health                     service check
  GET /api/py/compare?ids=a,b,c          winners per spec + a short verdict for the compare page
  GET /api/py/recommend?budget=30&fuel=Petrol&seating=5&priority=mileage
                                         top 3 cars that match what the user wants
  GET /api/py/stats                      numbers for the admin dashboard
"""

import json
import os
import re
import sqlite3

from flask import Flask, jsonify, request

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.environ.get("CARVERSE_DB", os.path.join(BASE_DIR, "..", "database", "carverse.db"))
SCHEMA_PATH = os.path.join(BASE_DIR, "..", "database", "schema.sql")

app = Flask(__name__)


# ---------------------------------------------------------------- database

def get_db():
    conn = sqlite3.connect(DB_PATH, timeout=5)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db() as conn, open(SCHEMA_PATH, encoding="utf-8") as f:
        conn.executescript(f.read())


def load_cars():
    with get_db() as conn:
        rows = conn.execute("SELECT * FROM cars ORDER BY created_at DESC, rowid ASC").fetchall()
    cars = []
    for row in rows:
        car = dict(row)
        car["features"] = json.loads(car["features"] or "[]")
        car.pop("created_at", None)
        cars.append(car)
    return cars


# ---------------------------------------------------------------- helpers

def first_number(text):
    """'18.5 kmpl' -> 18.5, '184 hp' -> 184.0, '' -> 0.0"""
    match = re.search(r"\d+(\.\d+)?", str(text or ""))
    return float(match.group()) if match else 0.0


def fuel_efficiency(text):
    """'18.5 kmpl' -> 18.5; an electric range like '400 km' isn't comparable, so 0.0."""
    if not re.search(r"km\s*(pl|/\s*l|/\s*kg)", str(text or ""), re.IGNORECASE):
        return 0.0
    return first_number(text)


def specs(car):
    return {
        "price": car["price"],
        "mileage": fuel_efficiency(car["mileage"]),
        "power": first_number(car["horsepower"]),
        "seating": car["seating"],
    }


def winners(cars, key, lowest=False):
    """Ids of the car(s) with the best value for one spec (ties share the win)."""
    values = [specs(c)[key] for c in cars]
    usable = [v for v in values if v > 0]
    if len(cars) < 2 or not usable:
        return []
    best = min(usable) if lowest else max(usable)
    return [c["id"] for c, v in zip(cars, values) if v == best]


def price_text(price):
    return f"₹{price:g}L"


# ---------------------------------------------------------------- routes

@app.after_request
def allow_cors(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response


@app.get("/api/py/health")
def health():
    return jsonify(service="python-service", status="ok")


@app.get("/api/py/compare")
def compare():
    ids = [i for i in request.args.get("ids", "").split(",") if i]
    by_id = {c["id"]: c for c in load_cars()}
    cars = [by_id[i] for i in ids if i in by_id]

    best = {
        "Price": winners(cars, "price", lowest=True),
        "Mileage": winners(cars, "mileage"),
        "Power": winners(cars, "power"),
        "Seating": winners(cars, "seating"),
    }

    verdict = []
    if len(cars) >= 2:
        name = {c["id"]: c["name"] for c in cars}

        def names(ids_):
            return " & ".join(name[i] for i in ids_)

        if best["Price"]:
            verdict.append(f"Best value: {names(best['Price'])} at {price_text(by_id[best['Price'][0]]['price'])}.")
        if best["Mileage"]:
            verdict.append(f"Most fuel-efficient: {names(best['Mileage'])} ({by_id[best['Mileage'][0]]['mileage']}).")
        if best["Power"]:
            verdict.append(f"Most powerful: {names(best['Power'])} ({by_id[best['Power'][0]]['horsepower']}).")
        if best["Seating"] and len(best["Seating"]) < len(cars):
            verdict.append(f"Most spacious: {names(best['Seating'])} ({by_id[best['Seating'][0]]['seating']} seats).")

        # Overall pick = the car that wins the most specs (cheaper car breaks a tie).
        wins = {c["id"]: sum(c["id"] in w for w in best.values()) for c in cars}
        overall = max(cars, key=lambda c: (wins[c["id"]], -c["price"]))
        verdict.append(f"Overall pick: {overall['name']} wins {wins[overall['id']]} of 4 categories.")

    return jsonify(cars=cars, best=best, verdict=verdict)


@app.get("/api/py/recommend")
def recommend():
    budget = request.args.get("budget", type=float) or 0
    fuel = request.args.get("fuel", "any")
    seating = request.args.get("seating", type=int) or 0
    priority = request.args.get("priority", "value")

    cars = load_cars()
    matches = [
        c for c in cars
        if (not budget or c["price"] <= budget)
        and (fuel in ("", "any") or c["fuel"] == fuel)
        and (not seating or c["seating"] >= seating)
    ]
    if not matches:
        return jsonify(results=[], message="No car matches all your choices. Try a bigger budget or another fuel type.")

    # Score each spec from 0 to 1 against the other matches, then weight what the user cares about.
    def scale(values, lowest=False):
        lo, hi = min(values), max(values)
        if hi == lo:
            return [1.0] * len(values)
        return [(hi - v) / (hi - lo) if lowest else (v - lo) / (hi - lo) for v in values]

    s = [specs(c) for c in matches]
    price_score = scale([x["price"] for x in s], lowest=True)
    mileage_score = scale([x["mileage"] for x in s])
    power_score = scale([x["power"] for x in s])

    weights = {
        "value": (0.6, 0.2, 0.2),
        "mileage": (0.2, 0.6, 0.2),
        "power": (0.2, 0.2, 0.6),
    }.get(priority, (0.34, 0.33, 0.33))

    reasons = {"value": "great value for money", "mileage": "excellent fuel efficiency", "power": "strong performance"}

    results = []
    for car, p, m, w in zip(matches, price_score, mileage_score, power_score):
        score = weights[0] * p + weights[1] * m + weights[2] * w
        results.append({
            "car": car,
            "score": round(score * 100),
            "reason": f"{price_text(car['price'])}, {car['mileage']}, {car['horsepower']} — {reasons.get(priority, 'a balanced choice')}.",
        })
    results.sort(key=lambda r: r["score"], reverse=True)
    return jsonify(results=results[:3], message=f"{len(matches)} car(s) match. Here are the best {min(3, len(matches))}.")


@app.get("/api/py/stats")
def stats():
    cars = load_cars()
    by_fuel, by_brand = {}, {}
    for c in cars:
        by_fuel[c["fuel"]] = by_fuel.get(c["fuel"], 0) + 1
        by_brand[c["brand"]] = by_brand.get(c["brand"], 0) + 1
    prices = [c["price"] for c in cars]
    return jsonify(
        total=len(cars),
        brands=len(by_brand),
        average_price=round(sum(prices) / len(prices), 1) if prices else 0,
        cheapest=min(cars, key=lambda c: c["price"])["name"] if cars else None,
        most_expensive=max(cars, key=lambda c: c["price"])["name"] if cars else None,
        by_fuel=by_fuel,
        by_brand=by_brand,
    )


init_db()

if __name__ == "__main__":
    app.run(
        host=os.environ.get("HOST", "127.0.0.1"),
        port=int(os.environ.get("PORT", 5000)),
        debug=os.environ.get("FLASK_DEBUG") == "1",
    )
