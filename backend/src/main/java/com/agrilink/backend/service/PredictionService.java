package com.agrilink.backend.service;

import com.agrilink.backend.dto.PredictionRequest;
import com.agrilink.backend.dto.PredictionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Locale;

@Service
public class PredictionService {

    @Value("${app.ml.python-command}")
    private String pythonCommand;

    @Value("${app.ml.script-path}")
    private String scriptPath;

    @Value("${app.ml.model-path}")
    private String modelPath;

    public PredictionResponse predict(PredictionRequest request) {
        try {
            Process process = new ProcessBuilder(
                    pythonCommand,
                    scriptPath,
                    "--crop", request.cropName(),
                    "--district", request.district(),
                    "--quantity", request.quantityKg().toString(),
                    "--model", modelPath
            ).start();

            String output;
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
                output = reader.readLine();
            }
            int exit = process.waitFor();
            if (exit == 0 && output != null && output.contains(",")) {
                String[] parts = output.split(",");
                return new PredictionResponse(
                        Double.parseDouble(parts[0]),
                        Double.parseDouble(parts[1]),
                        parts.length > 2 ? parts[2] : "python-model"
                );
            }
        } catch (Exception ignored) {
        }

        double fallback = Math.max(18.0,
                request.quantityKg() * 0.15 + request.cropName().toLowerCase(Locale.ROOT).hashCode() % 20 + 28.0);
        return new PredictionResponse(fallback, 55.0, "fallback-heuristic");
    }
}
