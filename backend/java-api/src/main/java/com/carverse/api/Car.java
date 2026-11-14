package com.carverse.api;

import java.util.List;

/** One car, exactly as the React frontend expects it (price is in lakh rupees). */
public record Car(
        String id,
        String name,
        String brand,
        double price,
        String mileage,
        String fuel,
        String transmission,
        String engine,
        int seating,
        String horsepower,
        String description,
        List<String> features,
        String image) {

    /** Missing optional fields get the same defaults as the database columns. */
    public Car {
        mileage = mileage == null ? "" : mileage;
        fuel = fuel == null || fuel.isBlank() ? "Petrol" : fuel;
        transmission = transmission == null || transmission.isBlank() ? "Manual" : transmission;
        engine = engine == null ? "" : engine;
        seating = seating <= 0 ? 5 : seating;
        horsepower = horsepower == null ? "" : horsepower;
        description = description == null ? "" : description;
        features = features == null ? List.of() : features;
        image = image == null ? "" : image;
    }

    public Car withId(String newId) {
        return new Car(newId, name, brand, price, mileage, fuel, transmission, engine,
                seating, horsepower, description, features, image);
    }
}
