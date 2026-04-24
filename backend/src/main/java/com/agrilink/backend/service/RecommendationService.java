package com.agrilink.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class RecommendationService {

    @Value("${app.ml.python-command:python}")
    private String pythonPath;

    @Value("${app.ml.recommend-script-path:ml/recommend.py}")
    private String recommendScriptPath;

    @Value("${app.ml.rainfall-csv-path:}")
    private String rainfallCsvPath;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, Object> recommend(
            String district,
            String season,
            String commodity,
            double landSize,
            Integer year
    ) {
        try {
            List<String> command = new ArrayList<>();
            command.add(pythonPath);
            command.add(recommendScriptPath);
            command.add("--district");
            command.add(district);
            command.add("--season");
            command.add(season);
            command.add("--commodity");
            command.add(commodity);
            command.add("--land_size");
            command.add(String.valueOf(landSize));
            if (year != null) {
                command.add("--year");
                command.add(String.valueOf(year));
            }
            command.add("--rainfall_csv");
            command.add(rainfallCsvPath);

            ProcessBuilder pb = new ProcessBuilder(command);
            pb.redirectErrorStream(false);
            Process process = pb.start();

            BufferedReader stdout = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder out = new StringBuilder();
            String line;
            while ((line = stdout.readLine()) != null) {
                out.append(line);
            }

            BufferedReader stderr = new BufferedReader(new InputStreamReader(process.getErrorStream()));
            StringBuilder err = new StringBuilder();
            while ((line = stderr.readLine()) != null) {
                err.append(line).append("\n");
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new RuntimeException("Python recommend failed: " + err);
            }

            return objectMapper.readValue(out.toString(), Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate recommendation: " + e.getMessage(), e);
        }
    }
}