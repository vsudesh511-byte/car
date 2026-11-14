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

    public Car withId(String newId) {
        return new Car(newId, name, brand, price, mileage, fuel, transmission, engine,
                seating, horsepower, description, features, image);
    }
}
