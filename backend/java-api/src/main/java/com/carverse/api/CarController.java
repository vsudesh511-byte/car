package com.carverse.api;

import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * Cars REST API.
 *   GET    /api/cars          list all cars
 *   GET    /api/cars/{id}     one car
 *   POST   /api/cars          add a car          (admin)
 *   PUT    /api/cars/{id}     edit a car         (admin)
 *   DELETE /api/cars/{id}     delete a car       (admin)
 *   POST   /api/cars/reset    reload sample cars (admin)
 */
@RestController
@RequestMapping("/api/cars")
@CrossOrigin(origins = "*")
public class CarController {

    private static final String TOKEN_HEADER = "X-Admin-Token";

    private final CarRepository cars;
    private final AdminTokenService admin;

    public CarController(CarRepository cars, AdminTokenService admin) {
        this.cars = cars;
        this.admin = admin;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("service", "java-api", "status", "ok");
    }

    @GetMapping
    public List<Car> list() {
        return cars.findAll();
    }

    @GetMapping("/{id}")
    public Car get(@PathVariable String id) {
        return cars.findById(id).orElseThrow(() -> notFound(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Car create(@RequestHeader(value = TOKEN_HEADER, required = false) String token,
                      @RequestBody Car body) {
        admin.requireAdmin(token);
        validate(body);
        Car car = body.withId("car-" + System.currentTimeMillis());
        cars.insert(car);
        return car;
    }

    @PutMapping("/{id}")
    public Car update(@RequestHeader(value = TOKEN_HEADER, required = false) String token,
                      @PathVariable String id, @RequestBody Car body) {
        admin.requireAdmin(token);
        validate(body);
        Car car = body.withId(id);
        if (!cars.update(car)) {
            throw notFound(id);
        }
        return car;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@RequestHeader(value = TOKEN_HEADER, required = false) String token,
                       @PathVariable String id) {
        admin.requireAdmin(token);
        if (!cars.delete(id)) {
            throw notFound(id);
        }
    }

    @PostMapping("/reset")
    public List<Car> reset(@RequestHeader(value = TOKEN_HEADER, required = false) String token) {
        admin.requireAdmin(token);
        cars.resetToSampleData();
        return cars.findAll();
    }

    private static void validate(Car car) {
        if (car.name() == null || car.name().isBlank() || car.brand() == null || car.brand().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Car name and brand are required.");
        }
        if (car.price() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter a price greater than 0 (in lakh).");
        }
    }

    private static ResponseStatusException notFound(String id) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "No car with id " + id);
    }
}
