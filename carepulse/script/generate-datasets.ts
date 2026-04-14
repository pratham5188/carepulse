import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const outputDir = join(process.cwd(), "public/datasets");
mkdirSync(outputDir, { recursive: true });

// === 1. Sample Hospital Dataset ===
let hospitalCSV = "id,name,country,state,city,area,location,latitude,longitude,specialized_departments,bed_capacity,icu_capacity,current_occupancy,contact_number,email\n";
const sampleHospitals = [
  [1,"AIIMS New Delhi","India","Delhi","New Delhi","Ansari Nagar","Sri Aurobindo Marg New Delhi 110029",28.5672,77.2100,"Cardiology|Neurology|Orthopedics|Oncology",2478,300,2100,"+91 11 2658 8500","info@aiims.edu"],
  [2,"Safdarjung Hospital","India","Delhi","New Delhi","Ring Road","Ansari Nagar West New Delhi 110029",28.5685,77.2066,"General Surgery|Pediatrics|Obstetrics",1531,150,1350,"+91 11 2616 5060","info@safdarjung.nic.in"],
  [3,"Sir Ganga Ram Hospital","India","Delhi","New Delhi","Rajinder Nagar","Sir Ganga Ram Hospital Marg New Delhi 110060",28.6381,77.1854,"Gastroenterology|Nephrology|Pulmonology",675,100,560,"+91 11 2575 0000","info@sgrh.com"],
  [4,"Max Super Speciality Hospital","India","Delhi","New Delhi","Saket","1 2 Press Enclave Road Saket New Delhi 110017",28.5274,77.2153,"Cardiac Sciences|Neurosciences|Oncology",500,80,400,"+91 11 2651 5050","info@maxhealthcare.in"],
  [5,"Fortis Hospital Shalimar Bagh","India","Delhi","New Delhi","Shalimar Bagh","A/B Block Shalimar Bagh New Delhi 110088",28.7161,77.1575,"Orthopedics|Urology|Gynecology",262,40,210,"+91 11 4530 2222","info@fortishealthcare.com"],
  [6,"Narayana Health City","India","Karnataka","Bengaluru","Bommasandra","258/A Bommasandra Industrial Area Bengaluru 560099",12.8161,77.6891,"Cardiac Surgery|Pediatric Heart Surgery|Vascular Surgery",3000,400,2500,"+91 80 7122 2222","info@narayanahealth.org"],
  [7,"NIMHANS","India","Karnataka","Bengaluru","Hosur Road","Hosur Road Lakkasandra Bengaluru 560029",12.9384,77.5962,"Psychiatry|Neurology|Neurosurgery",800,100,700,"+91 80 2699 5000","info@nimhans.ac.in"],
  [8,"Manipal Hospitals Bengaluru","India","Karnataka","Bengaluru","HAL Airport Road","98 HAL Airport Road Bengaluru 560017",12.9591,77.6466,"Organ Transplant|Oncology|Bariatric Surgery",650,120,520,"+91 80 2502 4444","info@manipalhospitals.com"],
  [9,"KEM Hospital","India","Maharashtra","Mumbai","Parel","Acharya Donde Marg Parel Mumbai 400012",18.9944,72.8407,"Emergency Medicine|Burn Unit|Trauma",1800,200,1600,"+91 22 2410 7000","info@kemhospital.org"],
  [10,"Lilavati Hospital","India","Maharashtra","Mumbai","Bandra West","A-791 Bandra Reclamation Bandra West Mumbai 400050",19.0570,72.8243,"Cardiology|Neurology|Gastroenterology",325,50,280,"+91 22 2675 1000","info@lilavatihospital.com"],
  [11,"JIPMER","India","Puducherry","Puducherry","Gorimedu","Dhanvantari Nagar Gorimedu Puducherry 605006",11.9358,79.8155,"Nephrology|Cardiology|Neurosurgery",2000,250,1800,"+91 413 222 7000","info@jipmer.edu.in"],
  [12,"Christian Medical College","India","Tamil Nadu","Vellore","Arni Road","Ida Scudder Road Vellore 632004",12.9241,79.1353,"Transplant Surgery|Rheumatology|Hematology",2700,350,2400,"+91 416 228 1000","info@cmcvellore.ac.in"],
  [13,"Apollo Hospitals Chennai","India","Tamil Nadu","Chennai","Greams Road","21 Greams Lane Off Greams Road Chennai 600006",13.0560,80.2489,"Cardiac Surgery|Oncology|Spine Surgery",600,100,480,"+91 44 2829 0200","info@apollohospitals.com"],
  [14,"PGIMER Chandigarh","India","Punjab","Chandigarh","Sector 12","Sector 12 Chandigarh 160012",30.7643,76.7794,"Medical Oncology|Cardiology|Neurology",2000,300,1800,"+91 172 274 6018","info@pgimer.edu.in"],
  [15,"Tata Memorial Hospital","India","Maharashtra","Mumbai","Parel","Dr E Borges Road Parel Mumbai 400012",19.0048,72.8428,"Oncology|Radiation Therapy|Bone Marrow Transplant",629,80,580,"+91 22 2417 7000","info@tmc.gov.in"],
];
sampleHospitals.forEach(h => {
  hospitalCSV += `${h[0]},"${h[1]}","${h[2]}","${h[3]}","${h[4]}","${h[5]}","${h[6]}",${h[7]},${h[8]},"${h[9]}",${h[10]},${h[11]},${h[12]},"${h[13]}","${h[14]}"\n`;
});
writeFileSync(join(outputDir, "hospitals_india_sample.csv"), hospitalCSV);
console.log("✅ Hospital dataset written");

// === 2. ML Training Dataset ===
const mlData = [
  ["chest pain shortness of breath sweating nausea radiating arm pain","Acute Coronary Syndrome","Cardiovascular",9],
  ["severe chest pain pressure tightness jaw pain left arm numbness","Myocardial Infarction","Cardiovascular",10],
  ["palpitations rapid heartbeat irregular pulse dizziness fainting","Cardiac Arrhythmia","Cardiovascular",7],
  ["high blood pressure headache vision changes dizziness nosebleed","Hypertensive Crisis","Cardiovascular",8],
  ["leg swelling pain redness warmth calf tenderness","Deep Vein Thrombosis","Cardiovascular",8],
  ["sudden breathlessness chest pain coughing blood rapid pulse","Pulmonary Embolism","Cardiovascular",10],
  ["high fever headache body aches fatigue cough sore throat chills","Influenza","Respiratory",4],
  ["persistent cough fever shortness of breath chest pain fatigue","Pneumonia","Respiratory",7],
  ["wheezing breathlessness chest tightness cough night worsening","Asthma Exacerbation","Respiratory",6],
  ["chronic cough sputum production breathlessness exercise intolerance","COPD Exacerbation","Respiratory",7],
  ["persistent cough blood sputum weight loss night sweats fever","Pulmonary Tuberculosis","Respiratory",8],
  ["runny nose sneezing sore throat mild cough congestion low fever","Upper Respiratory Infection","Respiratory",2],
  ["excessive thirst frequent urination blurred vision fatigue weight loss","Diabetes Mellitus","Endocrine",5],
  ["confusion sweating trembling rapid heartbeat hunger irritability","Hypoglycemia","Endocrine",7],
  ["nausea vomiting abdominal pain fruity breath confusion rapid breathing","Diabetic Ketoacidosis","Endocrine",9],
  ["weight gain fatigue cold intolerance dry skin constipation depression","Hypothyroidism","Endocrine",4],
  ["weight loss anxiety tremor heat intolerance rapid heartbeat sweating","Hyperthyroidism","Endocrine",5],
  ["high fever rash behind eyes pain joint pain muscle pain platelet drop","Dengue Fever","Infectious",7],
  ["cyclic fever chills rigors sweating headache anemia spleen enlarged","Malaria","Infectious",8],
  ["high fever abdominal pain rose spots constipation diarrhea headache","Typhoid Fever","Infectious",7],
  ["fever cough loss of taste smell fatigue body aches sore throat","COVID-19","Infectious",6],
  ["fever rash joint pain muscle pain conjunctivitis headache","Chikungunya","Infectious",6],
  ["burning urination frequency urgency cloudy urine pelvic pain","Urinary Tract Infection","Urological",4],
  ["severe flank pain radiating groin blood urine nausea vomiting","Kidney Stones","Urological",7],
  ["severe headache one side throbbing nausea light sensitivity aura","Migraine","Neurological",6],
  ["sudden severe headache worst ever stiff neck confusion vomiting","Subarachnoid Hemorrhage","Neurological",10],
  ["sudden facial droop arm weakness speech difficulty balance loss","Ischemic Stroke","Neurological",10],
  ["tremor rigidity bradykinesia postural instability shuffling gait","Parkinson Disease","Neurological",6],
  ["severe abdominal pain right lower quadrant nausea vomiting fever","Appendicitis","Gastrointestinal",8],
  ["jaundice abdominal pain nausea fatigue dark urine","Hepatitis","Gastrointestinal",7],
  ["upper abdominal pain bloating nausea heartburn worse food","Peptic Ulcer Disease","Gastrointestinal",5],
  ["joint pain swelling stiffness morning worse small joints symmetric","Rheumatoid Arthritis","Musculoskeletal",6],
  ["bone pain fracture height loss stooped posture","Osteoporosis","Musculoskeletal",5],
  ["persistent sadness loss interest sleep changes appetite changes fatigue hopelessness","Major Depressive Disorder","Psychiatric",6],
  ["excessive worry restlessness muscle tension sleep difficulty concentration problems","Generalized Anxiety Disorder","Psychiatric",5],
  ["panic attacks heart racing sweating trembling fear of dying chest pain","Panic Disorder","Psychiatric",6],
  ["irregular periods acne weight gain excess hair growth pelvic pain","PCOS","Gynecological",4],
  ["heavy periods pain cramps fatigue iron deficiency anemia","Menorrhagia","Gynecological",5],
  ["itchy rash red patches scaling dry skin eczema flaking","Dermatitis","Dermatological",3],
  ["fatigue pale skin weakness dizziness cold hands shortness breath","Iron Deficiency Anemia","Hematological",5],
  ["swollen lymph nodes fever night sweats weight loss fatigue","Lymphoma","Oncological",8],
];
let mlCSV = "symptoms,diagnosis,category,severity_score\n";
mlData.forEach(d => { mlCSV += `"${d[0]}","${d[1]}","${d[2]}",${d[3]}\n`; });
writeFileSync(join(outputDir, "ml_symptom_disease_training_data.csv"), mlCSV);
console.log("✅ ML training dataset written");

// === 3. Patient Sample Dataset ===
const conditions = ["Hypertension","Diabetes","Respiratory Infection","Cardiac Arrhythmia","Kidney Disease","Anemia","Dengue Fever","Asthma","Migraine","Malaria"];
const riskLevels = ["Low","Medium","High"];
const genders = ["Male","Female"];
const firstNames = ["Aarav","Priya","Rahul","Anjali","Vikram","Sunita","Rajan","Kavya","Arjun","Pooja","Suresh","Neha","Mohan","Deepa","Anil","Rekha","Sanjay","Meera","Kiran","Lata"];
const lastNames = ["Sharma","Verma","Singh","Patel","Kumar","Gupta","Joshi","Nair","Iyer","Reddy","Chatterjee","Das","Mukherjee","Bose","Sen","Roy","Rao","Pillai","Menon","Tiwari"];
let patientCSV = "id,name,age,gender,condition,risk_level,heart_rate,blood_pressure,oxygen_level,temperature_celsius,hospital_id\n";
let rng = 42;
function rand(max: number) { rng = (rng * 1664525 + 1013904223) & 0xffffffff; return Math.abs(rng) % max; }
for (let i = 1; i <= 500; i++) {
  const fn = firstNames[rand(firstNames.length)];
  const ln = lastNames[rand(lastNames.length)];
  const age = rand(70) + 10;
  const gender = genders[rand(2)];
  const condition = conditions[rand(conditions.length)];
  const risk = riskLevels[rand(3)];
  const hr = rand(60) + 60;
  const sys = rand(60) + 100; const dia = rand(30) + 60;
  const oxy = rand(10) + 90;
  const temp = (36 + (rand(25)/10)).toFixed(1);
  patientCSV += `${i},"${fn} ${ln}",${age},"${gender}","${condition}","${risk}",${hr},"${sys}/${dia}",${oxy},${temp},${rand(15)+1}\n`;
}
writeFileSync(join(outputDir, "patients_sample_dataset.csv"), patientCSV);
console.log("✅ Patient sample dataset written");

// === 4. Disease Trends Dataset ===
const diseases = ["Dengue","Malaria","Influenza","COVID-19","Typhoid","Cholera","Tuberculosis","Chikungunya","Hepatitis A","Japanese Encephalitis"];
const states = ["Delhi","Maharashtra","Karnataka","Tamil Nadu","Rajasthan","Uttar Pradesh","West Bengal","Kerala","Gujarat","Madhya Pradesh"];
let trendCSV = "id,disease_name,state,case_count,month,year,severity\n";
let tid = 1;
for (let year = 2022; year <= 2025; year++) {
  for (let month = 1; month <= 12; month++) {
    diseases.forEach(disease => {
      states.forEach(state => {
        const cases = rand(5000) + 10;
        const severity = cases > 3000 ? "High" : cases > 1000 ? "Medium" : "Low";
        trendCSV += `${tid++},"${disease}","${state}",${cases},${month},${year},"${severity}"\n`;
      });
    });
  }
}
writeFileSync(join(outputDir, "disease_trends_india.csv"), trendCSV);
console.log("✅ Disease trends dataset written");

// === 5. README ===
const readme = `# CarePulse Datasets

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
`;
writeFileSync(join(outputDir, "README.txt"), readme);
console.log("✅ README written\n\nAll datasets saved to:", outputDir);
