package com.carverse.api;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Optional;
import javax.sql.DataSource;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.FileSystemResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/** All SQL for the cars table lives here. */
@Repository
public class CarRepository {

    private final JdbcTemplate jdbc;
    private final DataSource dataSource;
    private final ObjectMapper json;

    public CarRepository(JdbcTemplate jdbc, DataSource dataSource, ObjectMapper json) {
        this.jdbc = jdbc;
        this.dataSource = dataSource;
        this.json = json;
    }

    private final RowMapper<Car> carMapper = (rs, rowNum) -> new Car(
            rs.getString("id"),
            rs.getString("name"),
            rs.getString("brand"),
            rs.getDouble("price"),
            rs.getString("mileage"),
            rs.getString("fuel"),
            rs.getString("transmission"),
            rs.getString("engine"),
            rs.getInt("seating"),
            rs.getString("horsepower"),
            rs.getString("description"),
            readFeatures(rs.getString("features")),
            rs.getString("image"));

    /** Newest cars first; sample cars keep their original order. */
    public List<Car> findAll() {
        return jdbc.query("SELECT * FROM cars ORDER BY created_at DESC, rowid ASC", carMapper);
    }

    public Optional<Car> findById(String id) {
        return jdbc.query("SELECT * FROM cars WHERE id = ?", carMapper, id).stream().findFirst();
    }

    public void insert(Car car) {
        jdbc.update("""
                INSERT INTO cars (id, name, brand, price, mileage, fuel, transmission, engine,
                                  seating, horsepower, description, features, image)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                car.id(), car.name(), car.brand(), car.price(), car.mileage(), car.fuel(),
                car.transmission(), car.engine(), car.seating(), car.horsepower(),
                car.description(), writeFeatures(car.features()), car.image());
    }

    public boolean update(Car car) {
        int rows = jdbc.update("""
                UPDATE cars SET name = ?, brand = ?, price = ?, mileage = ?, fuel = ?,
                       transmission = ?, engine = ?, seating = ?, horsepower = ?,
                       description = ?, features = ?, image = ?
                WHERE id = ?""",
                car.name(), car.brand(), car.price(), car.mileage(), car.fuel(),
                car.transmission(), car.engine(), car.seating(), car.horsepower(),
                car.description(), writeFeatures(car.features()), car.image(), car.id());
        return rows > 0;
    }

    public boolean delete(String id) {
        return jdbc.update("DELETE FROM cars WHERE id = ?", id) > 0;
    }

    /** Loads the sample cars on first start, so cars an admin deletes stay deleted after a restart. */
    @EventListener(ApplicationReadyEvent.class)
    public void seedIfEmpty() {
        Integer count = jdbc.queryForObject("SELECT COUNT(*) FROM cars", Integer.class);
        if (count == null || count == 0) {
            loadSampleData();
        }
    }

    /** Deletes every car and loads the sample cars from database/seed.sql again. */
    @Transactional
    public void resetToSampleData() {
        jdbc.update("DELETE FROM cars");
        loadSampleData();
    }

    private void loadSampleData() {
        new ResourceDatabasePopulator(new FileSystemResource("../database/seed.sql")).execute(dataSource);
    }

    private List<String> readFeatures(String text) {
        try {
            return json.readValue(text == null ? "[]" : text, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            return List.of();
        }
    }

    private String writeFeatures(List<String> features) {
        try {
            return json.writeValueAsString(features == null ? List.of() : features);
        } catch (JsonProcessingException e) {
            return "[]";
        }
    }
}
