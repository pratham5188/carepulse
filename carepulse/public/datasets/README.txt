# CarePulse Datasets

## Files

1. hospitals_india_sample.csv — 15 representative India hospitals (full DB has 70,000)
   Columns: id, name, country, state, city, area, location, latitude, longitude, specialized_departments, bed_capacity, icu_capacity, current_occupancy, contact_number, email

2. ml_symptom_disease_training_data.csv — 41 symptom-disease clinical training records
   Columns: symptoms, diagnosis, category, severity_score
   Used for: Naive Bayes + TF-IDF disease prediction model

3. patients_sample_dataset.csv — 500 synthetic patient records
   Columns: id, name, age, gender, condition, risk_level, heart_rate, blood_pressure, oxygen_level, temperature_celsius, hospital_id
   Note: Synthetic data for demonstration only — no real patient data

4. disease_trends_india.csv — 4800 disease trend records (2022-2025)
   Columns: id, disease_name, state, case_count, month, year, severity
   Used for: Predictive analytics and outbreak detection
