package com.agrilink.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
public class PredictionService {

    @Value("${app.ml.model-path:}")
    private String modelPath;

    @Value("${app.ml.encoders-path:}")
    private String encodersPath;

    @Value("${app.ml.features-path:}")
    private String featuresPath;

    @Value("${app.ml.history-path:}")
    private String historyPath;

    @Value("${app.ml.python-command:python3}")
    private String pythonPath;

    @Value("${app.ml.script-path:ml/predict.py}")
    private String scriptPath;

    public PredictionResult predict(String district, String market, String commodity, 
                                   String variety, String season, int year, int month) {
        try {
            List<String> command = new ArrayList<>();
            command.add(pythonPath);
            command.add(scriptPath);
            command.add("--district");
            command.add(district);
            command.add("--market");
            command.add(market);
            command.add("--commodity");
            command.add(commodity);
            command.add("--variety");
            command.add(variety);
            command.add("--season");
            command.add(season);
            command.add("--year");
            command.add(String.valueOf(year));
            command.add("--month");
            command.add(String.valueOf(month));
            
            if (!modelPath.isEmpty()) {
                command.add("--model");
                command.add(modelPath);
            }
            if (!encodersPath.isEmpty()) {
                command.add("--encoders");
                command.add(encodersPath);
            }
            if (!featuresPath.isEmpty()) {
                command.add("--features");
                command.add(featuresPath);
            }
            if (!historyPath.isEmpty()) {
                command.add("--history");
                command.add(historyPath);
            }

            ProcessBuilder pb = new ProcessBuilder(command);
            pb.redirectErrorStream(false);
            Process process = pb.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
            StringBuilder errors = new StringBuilder();
            while ((line = errorReader.readLine()) != null) {
                System.err.println("Python stderr: " + line);
                errors.append(line).append("\n");
            }

            int exitCode = process.waitFor();
            
            if (exitCode != 0) {
                System.err.println("Python process failed with exit code: " + exitCode);
                System.err.println("Errors: " + errors.toString());
                throw new RuntimeException("Python prediction failed: " + errors.toString());
            }

            String result = output.toString().trim();
            String lastLine = result.substring(result.lastIndexOf('\n') + 1);
            String[] parts = lastLine.split(",");
            
            if (parts.length != 3) {
                throw new RuntimeException("Invalid prediction output format: " + lastLine);
            }

            return new PredictionResult(
                Double.parseDouble(parts[0]),
                Double.parseDouble(parts[1]),
                parts[2]
            );

        } catch (Exception e) {
            System.err.println("Prediction service error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to get prediction: " + e.getMessage(), e);
        }
    }

    public static class PredictionResult {
        private final double price;
        private final double confidence;
        private final String model;

        public PredictionResult(double price, double confidence, String model) {
            this.price = price;
            this.confidence = confidence;
            this.model = model;
        }

        public double getPrice() { return price; }
        public double getConfidence() { return confidence; }
        public String getModel() { return model; }
    }
}