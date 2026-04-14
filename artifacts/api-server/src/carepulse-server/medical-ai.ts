interface MedicalCondition {
  name: string;
  keywords: string[];
  bodyAreas: string[];
  description: string;
  causes: string[];
  symptoms: string[];
  riskFactors: string[];
  prevention: string[];
  homeRemedies: string[];
  treatments: string[];
  whenToSeeDoctor: string[];
  urgency: "low" | "moderate" | "high" | "emergency";
  category: string;
}

interface DrugInfo {
  name: string;
  genericName: string;
  aliases: string[];
  category: string;
  uses: string[];
  dosage: string;
  sideEffects: string[];
  warnings: string[];
  interactions: string[];
  pregnancy: string;
}

interface LabTest {
  name: string;
  aliases: string[];
  purpose: string;
  normalRange: string;
  highMeaning: string;
  lowMeaning: string;
  preparation: string;
  frequency: string;
}

const medicalDatabase: MedicalCondition[] = [
  {
    name: "Toothache / Dental Pain",
    keywords: ["tooth pain", "toothache", "teeth pain", "teeth ache", "dental pain", "tooth ache", "molar pain", "tooth hurt", "gum pain", "jaw pain", "tooth decay", "cavity pain", "wisdom tooth", "teeth hurting", "painful tooth", "tooth infection", "broken tooth", "cracked tooth", "dant dard", "dant", "daant dard", "daant"],
    bodyAreas: ["head", "mouth", "jaw", "general"],
    description: "Toothache refers to pain in or around a tooth, often caused by dental decay, infection, gum disease, or a cracked/broken tooth. It is one of the most common dental complaints and can range from mild sensitivity to severe, throbbing pain. Dental infections (abscesses) can spread and become serious if left untreated.",
    causes: ["Tooth decay (dental caries / cavity)", "Dental abscess (bacterial infection at root)", "Cracked or fractured tooth", "Damaged filling or crown", "Exposed root surface (gum recession)", "Gum disease (gingivitis or periodontitis)", "Impacted wisdom tooth", "Teeth grinding (bruxism) causing wear", "Sensitivity from hot/cold foods", "Sinus infection referred pain", "Erupting teeth in children"],
    symptoms: ["Sharp or throbbing pain in one or more teeth", "Pain that worsens with biting or chewing", "Sensitivity to hot or cold foods/drinks", "Swelling around the tooth or jaw", "Fever (if infection is present)", "Bad taste or smell in mouth (abscess)", "Visible hole or dark spot on tooth (cavity)", "Pain radiating to ear, jaw, or head", "Difficulty opening the mouth", "Tender or swollen lymph nodes in neck", "Persistent dull ache", "Pain worse at night"],
    riskFactors: ["Poor oral hygiene (not brushing twice daily)", "High sugar diet", "Dry mouth (reduced saliva protection)", "Smoking or tobacco use", "Diabetes (increases infection risk)", "Acid reflux (erodes enamel)", "Not flossing regularly", "Previous dental work", "Grinding/clenching teeth"],
    prevention: ["Brush teeth twice daily with fluoride toothpaste", "Floss at least once daily", "Rinse with antiseptic mouthwash", "Visit dentist every 6 months for check-up and cleaning", "Reduce sugary and acidic foods/drinks", "Drink fluoridated water", "Wear mouthguard if grinding teeth", "Avoid tobacco/smoking", "Eat a balanced diet rich in calcium"],
    homeRemedies: ["Clove oil (eugenol) — apply with cotton ball to affected tooth (natural anesthetic)", "Saltwater rinse — 1/2 tsp salt in warm water, rinse for 30 seconds", "Cold ice pack on cheek — 15 minutes on, 15 minutes off (reduces swelling)", "Garlic paste — crush garlic clove, apply to tooth (antibacterial)", "Over-the-counter pain relief: Paracetamol or Ibuprofen as directed", "Peppermint tea bag — place warm/cooled tea bag on tooth", "Hydrogen peroxide rinse (3%) diluted with water — antibacterial", "Hing (asafoetida) with lemon juice — apply to cavity", "Onion — chew raw onion or place on affected area (antimicrobial)", "Gua (guava) leaves — chew or boil and use as mouthwash"],
    treatments: ["Dental filling for cavities", "Root canal treatment (RCT) for infection reaching pulp", "Dental crown for broken/weakened tooth", "Tooth extraction for severely damaged tooth", "Antibiotic therapy (Amoxicillin, Metronidazole) for dental abscess", "Pain management: NSAIDs (Ibuprofen) or Paracetamol", "Scaling and root planing for gum disease", "Wisdom tooth surgery for impacted wisdom teeth", "Dental implants or dentures for missing teeth"],
    whenToSeeDoctor: ["Pain lasting more than 1-2 days", "Severe or throbbing pain that prevents sleep", "Fever with dental pain (sign of spreading infection)", "Swelling of face, cheek, or jaw", "Difficulty breathing or swallowing (emergency — abscess spreading)", "Pain after tooth extraction that worsens after 3 days (dry socket)", "Visible abscess or pus", "Numbness in tooth (may indicate nerve damage)", "Tooth pain following trauma/injury"],
    urgency: "moderate",
    category: "Dental / Oral Health"
  },
  {
    name: "Dental Abscess (Tooth Infection)",
    keywords: ["dental abscess", "tooth abscess", "tooth infection", "gum abscess", "pus in tooth", "infected tooth", "root abscess", "periapical abscess", "swollen gum", "gum swelling", "jaw swelling", "tooth pus", "abscess tooth"],
    bodyAreas: ["head", "mouth", "jaw", "general"],
    description: "A dental abscess is a pocket of pus caused by a bacterial infection inside or around a tooth. It can be at the tip of the tooth root (periapical abscess) or in the gums next to a tooth root (periodontal abscess). Left untreated, the infection can spread to the jaw, neck, or even the brain — making it a potentially serious condition requiring prompt dental care.",
    causes: ["Untreated tooth decay reaching the pulp", "Trauma or crack in a tooth allowing bacteria to enter", "Failed root canal treatment", "Severe gum disease (periodontitis)", "Weakened immune system", "Broken or chipped tooth"],
    symptoms: ["Severe, persistent throbbing toothache", "Sensitivity to hot and cold", "Fever and feeling generally unwell", "Swelling in the face, cheek, or neck", "Swollen, tender lymph nodes in jaw or neck", "Foul-smelling or tasting liquid in mouth (if abscess ruptures)", "Difficulty breathing or swallowing (serious — seek emergency care)", "Pain when biting or chewing", "Red, swollen gums", "Loose tooth"],
    riskFactors: ["Untreated cavities", "Poor dental hygiene", "High sugar diet", "Dry mouth", "Diabetes", "Compromised immunity", "Tobacco use"],
    prevention: ["Regular dental check-ups (every 6 months)", "Treat cavities early before they reach the pulp", "Good oral hygiene — brush and floss daily", "Fluoride toothpaste and sealants", "Reduce sugar intake", "Manage diabetes and immune conditions"],
    homeRemedies: ["Saltwater rinse to reduce inflammation", "Over-the-counter pain relievers (Paracetamol, Ibuprofen)", "Cold compress on cheek to reduce swelling", "Clove oil for temporary pain relief", "Rinse with hydrogen peroxide (diluted)", "Garlic — natural antibacterial agent", "NOTE: Home remedies provide ONLY temporary relief — dental abscess REQUIRES professional treatment"],
    treatments: ["Incision and drainage of the abscess", "Root canal treatment to remove infected pulp", "Tooth extraction if tooth cannot be saved", "Antibiotics: Amoxicillin, Clindamycin, or Metronidazole", "Pain management with NSAIDs or Paracetamol", "Follow-up dental care to prevent recurrence"],
    whenToSeeDoctor: ["Any signs of dental abscess require PROMPT dental care", "Difficulty breathing or swallowing — GO TO ER IMMEDIATELY", "Swelling rapidly spreading to face/neck — emergency", "High fever (above 101°F/38.5°C) with dental pain", "Throbbing pain that is worsening and not relieved by pain killers", "Pus discharge from gum"],
    urgency: "high",
    category: "Dental / Oral Health"
  },
  {
    name: "Gum Disease (Gingivitis / Periodontitis)",
    keywords: ["gum disease", "gingivitis", "periodontitis", "bleeding gums", "gum pain", "gum swelling", "gum infection", "receding gums", "sensitive gums", "gum bleeding", "swollen gums", "red gums", "sore gums", "pyorrhea", "piyorea", "dant ke maseede"],
    bodyAreas: ["mouth", "head", "general"],
    description: "Gum disease (periodontal disease) is an infection of the gums and bone that support the teeth. Gingivitis is the mild, reversible form causing gum inflammation. If untreated, it progresses to periodontitis — a serious infection that can damage bone and tissue, leading to tooth loss. Gum disease has also been linked to heart disease, diabetes, and other systemic conditions.",
    causes: ["Bacterial plaque buildup on teeth and gums", "Poor brushing and flossing habits", "Smoking or tobacco use", "Hormonal changes (pregnancy, puberty, menopause)", "Diabetes (impairs healing and immune response)", "Certain medications (calcium channel blockers, phenytoin)", "Vitamin C deficiency (scurvy)", "Genetic predisposition", "Dry mouth", "Stress weakening the immune system"],
    symptoms: ["Red, swollen, or tender gums", "Gums that bleed easily (while brushing or flossing)", "Persistent bad breath (halitosis)", "Gum recession (teeth looking longer)", "Pus between teeth and gums", "Loose or shifting teeth", "Pain when chewing", "Changes in bite alignment", "Sensitive teeth", "Gum pockets (spaces between teeth and gums)"],
    riskFactors: ["Poor oral hygiene", "Smoking or tobacco use", "Diabetes mellitus", "Hormonal changes (pregnancy)", "Medications causing dry mouth", "Nutritional deficiencies (Vitamin C)", "Genetic factors", "Stress", "Crowded or overlapping teeth"],
    prevention: ["Brush teeth at least twice daily with soft-bristled brush", "Floss daily to remove plaque between teeth", "Use antiseptic mouthwash", "Regular professional dental cleaning (every 6 months)", "Quit smoking and tobacco", "Control diabetes through diet and medication", "Eat a balanced diet rich in Vitamin C", "Stay hydrated to prevent dry mouth"],
    homeRemedies: ["Saltwater rinse (1/2 tsp salt in warm water) — antibacterial", "Oil pulling with coconut oil (10-15 minutes, swish and spit)", "Turmeric gel (apply to gums — anti-inflammatory)", "Clove oil application (antiseptic, pain-relieving)", "Neem twigs or neem mouthwash — traditional antibacterial", "Aloe vera gel on gums — soothes inflammation", "Green tea rinse — antioxidant properties", "Vitamin C-rich foods: amla, guava, oranges"],
    treatments: ["Professional teeth cleaning (scaling and root planing)", "Antibiotic therapy (Metronidazole, Doxycycline, Chlorhexidine)", "Antimicrobial mouth rinses (Chlorhexidine gluconate)", "Periodontal surgery for advanced periodontitis", "Bone and tissue grafts for lost bone/tissue", "Guided tissue regeneration", "Laser gum therapy"],
    whenToSeeDoctor: ["Gums bleed every time you brush", "Persistent bad breath not resolved by brushing", "Visible gum recession or loose teeth", "Pus or abscess in gums", "Pain when chewing", "Gums look very red, swollen, or dark purple", "Family history of gum disease"],
    urgency: "moderate",
    category: "Dental / Oral Health"
  },
  {
    name: "Hypertension (High Blood Pressure)",
    keywords: ["blood pressure", "high bp", "hypertension", "bp high", "systolic", "diastolic", "bp", "high blood pressure"],
    bodyAreas: ["chest", "head", "heart"],
    description: "A chronic medical condition where the blood pressure in the arteries is persistently elevated. It is a major risk factor for coronary artery disease, stroke, heart failure, atrial fibrillation, peripheral arterial disease, vision loss, chronic kidney disease, and dementia. High blood pressure is classified as primary (essential) hypertension or secondary hypertension. About 90-95% of cases are primary, defined as high blood pressure due to nonspecific lifestyle and genetic factors.",
    causes: ["Genetics and family history", "High sodium/salt diet", "Obesity and overweight", "Physical inactivity and sedentary lifestyle", "Chronic stress and anxiety", "Excessive alcohol consumption", "Smoking and tobacco use", "Sleep apnea", "Chronic kidney disease", "Adrenal and thyroid disorders", "Certain medications (NSAIDs, birth control pills, decongestants)", "High caffeine intake"],
    symptoms: ["Severe headaches (especially morning headaches)", "Shortness of breath", "Nosebleeds (epistaxis)", "Dizziness and lightheadedness", "Chest pain or tightness", "Visual changes or blurred vision", "Blood in urine (hematuria)", "Facial flushing", "Fatigue", "Irregular heartbeat or palpitations", "Pounding in chest, neck, or ears", "Often asymptomatic (silent killer)"],
    riskFactors: ["Age over 45 (men) or 55 (women)", "Family history of hypertension", "Being overweight or obese (BMI > 25)", "Sedentary lifestyle", "High-salt diet (>5g/day)", "Diabetes mellitus", "High cholesterol", "Chronic kidney disease", "Sleep apnea", "Race (higher in South Asians and Africans)", "Stress", "Excessive alcohol"],
    prevention: ["Regular aerobic exercise (150 min/week of brisk walking, cycling, swimming)", "DASH diet (Dietary Approaches to Stop Hypertension)", "Reduce sodium intake to less than 2,300 mg/day (ideally 1,500 mg)", "Maintain BMI between 18.5-24.9", "Limit alcohol to 1 drink/day (women) or 2 drinks/day (men)", "Quit smoking completely", "Manage stress through meditation, yoga, deep breathing", "Get 7-9 hours of quality sleep", "Regular blood pressure monitoring at home", "Reduce caffeine intake", "Increase potassium-rich foods (bananas, spinach, sweet potatoes)"],
    homeRemedies: ["Garlic (2-3 raw cloves daily can help lower BP)", "Hibiscus tea (2-3 cups daily)", "Beetroot juice (250ml daily)", "Deep breathing exercises (4-7-8 technique)", "Regular walking (30 min/day)", "Reduce salt — use herbs and spices instead", "Dark chocolate (70%+ cocoa, 1-2 squares)", "Flaxseed (2 tablespoons ground daily)", "Meditation and progressive muscle relaxation", "Potassium-rich foods: bananas, coconut water, oranges", "Amla (Indian gooseberry) juice", "Ashwagandha supplements (consult doctor first)"],
    treatments: ["ACE inhibitors (Enalapril, Ramipril, Lisinopril)", "ARBs (Losartan, Telmisartan, Valsartan)", "Calcium channel blockers (Amlodipine, Nifedipine)", "Diuretics (Hydrochlorothiazide, Chlorthalidone)", "Beta-blockers (Atenolol, Metoprolol)", "Combination therapy for resistant hypertension", "Lifestyle modifications (primary treatment)", "Regular monitoring with home BP device"],
    whenToSeeDoctor: ["BP reading consistently above 140/90 mmHg", "Severe headache with vision changes", "Chest pain or difficulty breathing", "Sudden confusion or trouble speaking", "Blood in urine", "Severe nosebleed that won't stop", "Swelling in ankles or feet", "BP above 180/120 (hypertensive crisis — seek emergency care)"],
    urgency: "moderate",
    category: "Cardiovascular"
  },
  {
    name: "Type 2 Diabetes Mellitus",
    keywords: ["diabetes", "blood sugar", "glucose", "insulin", "diabetic", "sugar level", "hba1c", "type 2", "sugar disease", "madhumeh", "high sugar", "sugar patient", "diabetes mellitus"],
    bodyAreas: ["general", "abdomen", "pancreas"],
    description: "A chronic metabolic disorder characterized by high blood sugar levels due to insulin resistance (the body's cells don't respond effectively to insulin) and progressive beta-cell dysfunction (the pancreas produces less insulin over time). India is often called the 'Diabetes Capital of the World' with over 77 million adults living with diabetes. The condition affects virtually every organ system if poorly controlled and is a leading cause of blindness, kidney failure, heart attacks, stroke, and lower limb amputation.",
    causes: ["Insulin resistance in muscle, fat, and liver cells", "Progressive pancreatic beta-cell dysfunction", "Genetic predisposition (stronger in South Asians)", "Obesity (especially visceral/abdominal fat)", "Physical inactivity", "Poor dietary habits (refined carbs, sugary drinks)", "Chronic stress elevating cortisol", "Gestational diabetes history", "Polycystic ovary syndrome (PCOS)", "Metabolic syndrome"],
    symptoms: ["Increased thirst (polydipsia)", "Frequent urination (polyuria)", "Excessive hunger (polyphagia)", "Unexplained weight loss", "Fatigue and weakness", "Blurred vision", "Slow-healing wounds and sores", "Frequent infections (skin, gums, urinary)", "Numbness or tingling in hands/feet (neuropathy)", "Dark patches on skin (acanthosis nigricans)", "Erectile dysfunction in men", "Recurrent yeast infections"],
    riskFactors: ["Obesity (BMI > 25, or > 23 for South Asians)", "Age over 35 (earlier for Indians)", "Family history (first-degree relative)", "Physical inactivity", "Prediabetes (HbA1c 5.7-6.4%)", "Gestational diabetes history", "Polycystic ovary syndrome", "South Asian ethnicity (2-4x higher risk)", "High blood pressure", "Abnormal cholesterol/triglycerides", "History of cardiovascular disease"],
    prevention: ["Weight loss of 5-7% body weight if overweight", "150 minutes/week of moderate exercise (brisk walking, swimming)", "High-fiber diet with whole grains, vegetables, legumes", "Limit refined carbs (white rice, maida, white bread)", "Replace sugary drinks with water, buttermilk, or green tea", "Include millets (ragi, jowar, bajra) in diet", "Regular blood sugar screening after age 35", "Manage stress through yoga and meditation", "Get adequate sleep (7-8 hours)", "Avoid smoking", "Limit alcohol", "Eat meals at regular times"],
    homeRemedies: ["Methi (fenugreek) seeds soaked overnight — drink water in morning", "Bitter gourd (karela) juice — 30ml on empty stomach", "Jamun seeds powder — 1 tsp twice daily", "Cinnamon (dalchini) — 1/2 tsp daily", "Aloe vera juice — 30ml before meals", "Turmeric milk (haldi doodh) — contains curcumin", "Amla (Indian gooseberry) — rich in vitamin C, improves insulin sensitivity", "Neem leaves — chew 4-5 leaves daily", "Regular walking after meals (10-15 min)", "Curry leaves — chew 8-10 fresh leaves morning", "Drumstick (moringa) leaves in diet", "Reduce portion sizes using smaller plates"],
    treatments: ["Metformin (first-line medication)", "Sulfonylureas (Glimepiride, Gliclazide)", "DPP-4 inhibitors (Sitagliptin, Vildagliptin)", "SGLT2 inhibitors (Dapagliflozin, Empagliflozin)", "GLP-1 receptor agonists (Liraglutide, Semaglutide)", "Insulin therapy (for advanced cases)", "Thiazolidinediones (Pioglitazone)", "Regular HbA1c monitoring every 3 months", "Self-monitoring blood glucose (SMBG)", "Comprehensive metabolic panel annually", "Diabetic foot care and screening", "Annual eye examination (retinopathy screening)"],
    whenToSeeDoctor: ["Fasting blood sugar above 126 mg/dL", "HbA1c above 6.5%", "Random blood sugar above 200 mg/dL with symptoms", "Excessive thirst and urination", "Unexplained weight loss", "Numbness or tingling in extremities", "Non-healing wounds or sores", "Recurring infections", "Blurred or changing vision", "Symptoms of diabetic ketoacidosis (nausea, vomiting, abdominal pain, fruity breath)"],
    urgency: "moderate",
    category: "Endocrine/Metabolic"
  },
  {
    name: "Common Cold (Upper Respiratory Infection)",
    keywords: ["cold", "runny nose", "sneezing", "sore throat", "congestion", "common cold", "cough cold", "nasal congestion", "stuffed nose", "blocked nose", "nazla", "sardi"],
    bodyAreas: ["head", "throat", "chest", "nose"],
    description: "A mild viral infection of the upper respiratory tract (nose, throat, sinuses) that is self-limiting, typically resolving within 7-10 days. It is the most common infectious disease in humans, with adults averaging 2-3 colds per year and children 6-8. Over 200 different viruses can cause the common cold, with rhinoviruses being the most frequent culprit.",
    causes: ["Rhinoviruses (30-50% of cases)", "Coronaviruses (non-COVID types, 10-15%)", "Respiratory Syncytial Virus (RSV)", "Parainfluenza viruses", "Adenoviruses", "Enteroviruses", "Human metapneumovirus", "Spread via airborne droplets", "Contact with contaminated surfaces", "Hand-to-face contact after touching contaminated objects"],
    symptoms: ["Runny nose (initially clear, may become thick yellow/green)", "Nasal congestion and stuffiness", "Sore throat (often the first symptom)", "Cough (dry or productive)", "Sneezing", "Mild body aches", "Low-grade fever (99-100.4°F)", "Mild headache", "Watery eyes", "Reduced sense of smell and taste", "Post-nasal drip", "General malaise and fatigue", "Hoarseness"],
    riskFactors: ["Weakened immune system", "Season (fall and winter in India, monsoon season)", "Age (children under 6 most susceptible)", "Smoking or exposure to secondhand smoke", "Close contact with infected person", "Crowded environments (schools, offices, public transport)", "Poor hand hygiene", "Stress and sleep deprivation", "Underlying chronic diseases"],
    prevention: ["Wash hands frequently with soap for 20 seconds", "Avoid touching eyes, nose, and mouth", "Maintain distance from sick individuals", "Disinfect frequently touched surfaces", "Get adequate sleep (7-9 hours)", "Stay physically active", "Eat a balanced diet rich in fruits and vegetables", "Manage stress levels", "Stay hydrated", "Avoid sharing utensils and personal items", "Ventilate indoor spaces", "Consider vitamin C supplementation (500mg daily)"],
    homeRemedies: ["Ginger tea with honey and lemon (adrak chai)", "Turmeric milk (haldi doodh) — warm before bed", "Steam inhalation with eucalyptus oil (2-3 times daily)", "Honey and black pepper (1 tsp each)", "Tulsi (holy basil) tea — 5-6 leaves boiled in water", "Warm salt water gargle (1/2 tsp in warm water, 3-4 times/day)", "Chicken or vegetable soup (warm fluids)", "Jaggery (gur) with black pepper", "Mulethi (licorice root) tea", "Ajwain (carom seeds) steam inhalation", "Rest and adequate sleep", "Stay well hydrated (warm water, herbal teas, soups)", "Saline nasal drops", "Warm compress on sinuses"],
    treatments: ["Rest and adequate fluid intake (primary treatment)", "Acetaminophen/Paracetamol for fever and body aches", "Decongestants (pseudoephedrine, oxymetazoline spray — max 3 days)", "Antihistamines for runny nose and sneezing (Cetirizine, Chlorpheniramine)", "Cough suppressants (Dextromethorphan) for dry cough", "Expectorants (Guaifenesin) for productive cough", "Throat lozenges for sore throat", "Saline nasal spray", "Vitamin C and Zinc supplements", "NOTE: Antibiotics are NOT effective against colds (viral infection)"],
    whenToSeeDoctor: ["Fever above 103°F (39.4°C) or fever lasting more than 3 days", "Symptoms lasting more than 10 days without improvement", "Symptoms that worsen after initial improvement", "Severe sore throat that prevents swallowing", "Severe headache or facial pain (possible sinusitis)", "Persistent high fever in children", "Difficulty breathing or wheezing", "Ear pain (possible ear infection)", "Stiff neck with fever"],
    urgency: "low",
    category: "Respiratory"
  },
  {
    name: "Influenza (Flu)",
    keywords: ["flu", "influenza", "fever", "body aches", "chills", "high fever", "muscle pain flu", "seasonal flu", "h1n1", "swine flu"],
    bodyAreas: ["general", "head", "chest", "throat"],
    description: "A highly contagious respiratory illness caused by influenza viruses (types A and B) that infects the nose, throat, and lungs. Unlike the common cold, flu comes on suddenly and is more severe. Flu season in India typically peaks during monsoon (July-September) and winter (December-February). Influenza can lead to serious complications including pneumonia, especially in high-risk groups.",
    causes: ["Influenza A virus (subtypes H1N1, H3N2 — cause pandemics)", "Influenza B virus (Yamagata, Victoria lineages)", "Airborne transmission via respiratory droplets", "Contact with contaminated surfaces", "Incubation period: 1-4 days"],
    symptoms: ["Sudden onset high fever (100-104°F / 38-40°C)", "Severe body and muscle aches (myalgia)", "Chills and rigors", "Intense headache", "Dry, persistent cough", "Extreme fatigue and weakness (can last 2-3 weeks)", "Sore throat", "Nasal congestion and runny nose", "Watery eyes", "Loss of appetite", "Nausea, vomiting, diarrhea (more common in children)", "Chest discomfort"],
    riskFactors: ["Age (children under 5, adults over 65)", "Chronic lung disease (asthma, COPD)", "Heart disease", "Diabetes", "Kidney or liver disease", "Weakened immune system (HIV, cancer treatment)", "Pregnancy", "Obesity (BMI > 40)", "Neurological conditions", "Living in crowded conditions"],
    prevention: ["Annual influenza vaccination (most effective prevention)", "Frequent hand washing with soap", "Respiratory hygiene (cover coughs and sneezes)", "Avoid close contact with sick individuals", "Clean and disinfect frequently touched surfaces", "Stay home when sick", "Wear masks in crowded places during flu season", "Maintain good immune health", "Adequate sleep and nutrition"],
    homeRemedies: ["Complete bed rest (crucial for recovery)", "Plenty of warm fluids — ginger tea, warm water with honey", "Tulsi and ginger decoction", "Turmeric milk (haldi doodh)", "Warm soup (chicken soup has anti-inflammatory properties)", "Steam inhalation with ajwain or eucalyptus", "Honey with warm water and lemon", "Garlic (natural antiviral — 2-3 cloves daily)", "Warm salt water gargle for sore throat", "Kadha (traditional Indian immunity drink: tulsi, ginger, cinnamon, black pepper, honey)", "Keep room humidified", "Light, easily digestible meals (khichdi, dal rice)"],
    treatments: ["Antiviral medications (most effective within 48 hours of symptom onset)", "Oseltamivir (Tamiflu) — 75mg twice daily for 5 days", "Zanamivir (Relenza) — inhaled", "Paracetamol for fever and body aches", "Ibuprofen for inflammation and pain", "Cough suppressants", "Nasal decongestants", "Adequate rest and hydration", "NOTE: Antibiotics do NOT treat flu (unless bacterial secondary infection)"],
    whenToSeeDoctor: ["Difficulty breathing or shortness of breath", "Persistent chest pain or pressure", "Confusion, altered mental status, or dizziness", "Severe or persistent vomiting", "Flu symptoms that improve then return with fever and worse cough", "High fever not responding to medication", "Symptoms in high-risk individuals", "Bluish lips or face (cyanosis)", "Dehydration signs (no urination for 8+ hours)"],
    urgency: "moderate",
    category: "Respiratory"
  },
  {
    name: "Migraine",
    keywords: ["migraine", "headache", "severe headache", "throbbing head", "aura", "light sensitivity", "head pain", "one side headache", "half head pain", "adhkapari"],
    bodyAreas: ["head"],
    description: "A complex neurological condition characterized by recurrent episodes of moderate-to-severe headache, typically unilateral (one-sided) and pulsating in nature, often accompanied by nausea, vomiting, and extreme sensitivity to light and sound. Migraines affect approximately 15% of the global population and are 3 times more common in women than men. An attack can last from 4 to 72 hours if untreated.",
    causes: ["Genetic predisposition (runs in families)", "Abnormal brain activity affecting nerve signals and blood vessels", "Serotonin level fluctuations", "Trigeminal nerve activation", "Hormonal changes (estrogen fluctuations in women)", "Triggers: stress, certain foods, weather changes, sleep disruption, bright lights, strong smells, physical exertion"],
    symptoms: ["Intense throbbing or pulsing pain (usually one side)", "Pain lasting 4-72 hours if untreated", "Nausea and/or vomiting", "Extreme sensitivity to light (photophobia)", "Extreme sensitivity to sound (phonophobia)", "Sensitivity to smell (osmophobia)", "Visual aura (flashing lights, zigzag lines, blind spots — in 25% of sufferers)", "Tingling or numbness in face, arm, or leg", "Difficulty speaking (in migraine with aura)", "Prodrome symptoms (mood changes, food cravings, neck stiffness — hours/days before)", "Postdrome (feeling drained, confused for up to a day after)"],
    riskFactors: ["Family history (80% have a first-degree relative with migraines)", "Female gender (3:1 ratio)", "Age (peak prevalence 25-55 years)", "Hormonal changes (menstruation, pregnancy, menopause)", "Stress (most common trigger)", "Poor sleep habits", "Skipping meals", "Certain foods (aged cheese, chocolate, MSG, artificial sweeteners, alcohol, red wine)", "Weather changes", "Caffeine (overuse or withdrawal)"],
    prevention: ["Identify and avoid personal triggers (keep a headache diary)", "Maintain regular sleep schedule (same bedtime/wake time)", "Stay well hydrated (at least 8 glasses of water daily)", "Regular moderate exercise (30 min, 5 days/week)", "Stress management (yoga, meditation, deep breathing)", "Don't skip meals, eat at regular times", "Limit caffeine to 200mg/day (about 2 cups of coffee)", "Preventive medications if frequent (>4 migraines/month)", "Avoid bright screens before bedtime", "Regular meal timing", "Magnesium supplementation (400mg daily)"],
    homeRemedies: ["Apply cold pack to forehead (15-20 minutes)", "Rest in a dark, quiet room", "Peppermint oil applied to temples", "Ginger tea (anti-nausea and anti-inflammatory)", "Lavender essential oil inhalation", "Magnesium-rich foods (spinach, almonds, dark chocolate)", "Caffeine in small amounts (can help early in attack)", "Stay hydrated — drink water at onset", "Butterbur extract (Petasites)", "Riboflavin (Vitamin B2) 400mg daily for prevention", "Acupressure — press between thumb and index finger", "Warm compress on neck/shoulders if tension-related"],
    treatments: ["Acute: Triptans (Sumatriptan, Rizatriptan, Zolmitriptan)", "Acute: NSAIDs (Ibuprofen, Naproxen, Aspirin)", "Acute: Combination analgesics (Paracetamol + caffeine)", "Acute: Anti-emetics (Domperidone, Metoclopramide)", "Preventive: Beta-blockers (Propranolol)", "Preventive: Antidepressants (Amitriptyline)", "Preventive: Anticonvulsants (Topiramate, Valproate)", "Preventive: CGRP inhibitors (Erenumab, Fremanezumab — newest class)", "Preventive: Botox injections (for chronic migraine)", "Neuromodulation devices"],
    whenToSeeDoctor: ["Sudden severe headache (thunderclap — worst headache of life)", "Headache with fever, stiff neck, confusion, seizures, double vision", "Headache after head injury or trauma", "New headache pattern after age 50", "Progressively worsening headaches", "Headache with weakness, numbness, or speech difficulty (rule out stroke)", "Migraines occurring more than 15 days/month", "Headache not responding to over-the-counter medications"],
    urgency: "moderate",
    category: "Neurological"
  },
  {
    name: "Gastroesophageal Reflux Disease (GERD) / Acid Reflux",
    keywords: ["acid reflux", "heartburn", "gerd", "stomach acid", "indigestion", "acidity", "burning chest", "acid stomach", "gas", "gastric", "pet me jalan", "seene me jalan", "acid", "reflux"],
    bodyAreas: ["chest", "abdomen", "throat", "stomach"],
    description: "A chronic digestive condition where stomach acid or bile frequently flows back (refluxes) into the esophagus (food pipe), causing irritation to its lining. While occasional heartburn is common, GERD is diagnosed when acid reflux occurs more than twice a week or causes inflammation of the esophagus. It affects approximately 10-20% of the Indian population, with higher prevalence in urban areas due to dietary and lifestyle factors.",
    causes: ["Weakened or dysfunctional lower esophageal sphincter (LES)", "Hiatal hernia", "Obesity (increased abdominal pressure)", "Pregnancy", "Smoking (weakens LES)", "Certain foods (spicy, fatty, citrus, chocolate, coffee)", "Eating large meals or lying down right after eating", "Certain medications (aspirin, ibuprofen, muscle relaxants, blood pressure meds)", "Delayed gastric emptying (gastroparesis)", "Connective tissue disorders (scleroderma)"],
    symptoms: ["Burning sensation in chest/behind breastbone (heartburn) — worse after eating or lying down", "Regurgitation of food or sour/bitter-tasting acid", "Difficulty swallowing (dysphagia)", "Chest pain", "Sensation of lump in throat (globus)", "Chronic cough (especially at night)", "Hoarseness or sore throat (laryngopharyngeal reflux)", "Worsening of asthma symptoms", "Disrupted sleep", "Nausea after eating", "Excessive belching", "Bloating", "Bad breath (halitosis)", "Tooth erosion (from acid)"],
    riskFactors: ["Obesity (especially abdominal)", "Hiatal hernia", "Pregnancy", "Smoking", "Eating large meals late at night", "Spicy Indian food", "Fatty or fried food", "Excessive tea/coffee", "Alcohol consumption", "Certain medications", "Stress and anxiety", "Diabetes (gastroparesis)"],
    prevention: ["Eat smaller, more frequent meals", "Avoid eating 2-3 hours before bedtime", "Maintain healthy weight", "Quit smoking", "Elevate head of bed 6-8 inches", "Avoid trigger foods (spicy, fried, citrus, tomato-based, chocolate, mint)", "Limit coffee and tea (especially on empty stomach)", "Don't lie down immediately after eating", "Wear loose-fitting clothes", "Manage stress (yoga, pranayama)", "Chew food thoroughly", "Avoid carbonated drinks"],
    homeRemedies: ["Cold milk (1 glass) — instant relief for acidity", "Banana — natural antacid", "Fennel seeds (saunf) — chew after meals", "Jaggery (gur) — small piece after meals", "Coconut water — soothes the stomach", "Ginger tea (in moderation)", "Ajwain (carom seeds) with warm water", "Jeera (cumin) water — boil 1 tsp in water, strain, drink", "Aloe vera juice — 30ml before meals", "Buttermilk (chaas) with roasted cumin and rock salt", "Basil (tulsi) leaves — chew 3-4 leaves", "Baking soda — 1/2 tsp in glass of water (occasional use only)", "Chewing gum after meals (stimulates saliva)", "Mulethi (licorice) — DGL supplements"],
    treatments: ["Antacids (Gelusil, Digene, Maalox) — for immediate relief", "H2 receptor blockers (Ranitidine, Famotidine)", "Proton pump inhibitors (Omeprazole, Pantoprazole, Esomeprazole)", "Prokinetics (Domperidone, Metoclopramide) — improve gastric emptying", "Sucralfate — protects esophageal lining", "Baclofen — reduces LES relaxation frequency", "Surgery (Nissen fundoplication) — for severe cases not responding to medication", "Endoscopic treatments for Barrett's esophagus"],
    whenToSeeDoctor: ["Heartburn more than twice per week", "Difficulty swallowing that worsens", "Persistent nausea or vomiting", "Unintended weight loss", "Chest pain (rule out cardiac causes)", "Vomiting blood or coffee-ground material", "Black, tarry stools (melena)", "Symptoms not responding to over-the-counter antacids", "Choking or coughing while lying down"],
    urgency: "low",
    category: "Gastrointestinal"
  },
  {
    name: "Asthma",
    keywords: ["asthma", "wheezing", "breathing difficulty", "shortness of breath", "bronchial", "inhaler", "chest tightness breathing", "dama", "saans phoolna", "breathing problem"],
    bodyAreas: ["chest", "throat", "lungs"],
    description: "A chronic inflammatory disease of the airways that causes recurring episodes of wheezing, breathlessness, chest tightness, and coughing. The airways become narrow and swollen, producing extra mucus, making breathing difficult. Asthma affects approximately 30 million Indians. It can range from a minor nuisance to a life-threatening condition. While asthma cannot be cured, its symptoms can be effectively controlled.",
    causes: ["Genetic predisposition (runs in families)", "Allergens (dust mites, pollen, pet dander, mold, cockroach droppings)", "Respiratory infections (especially in childhood)", "Air pollution (major issue in Indian cities)", "Occupational irritants (chemicals, dust, gases)", "Cold air and weather changes", "Exercise (exercise-induced bronchoconstriction)", "Emotional stress", "Gastroesophageal reflux", "Medications (aspirin, NSAIDs, beta-blockers)", "Sulfites in food and beverages"],
    symptoms: ["Wheezing (whistling sound when breathing, especially exhaling)", "Shortness of breath (dyspnea)", "Chest tightness or pressure", "Persistent coughing (worse at night or early morning)", "Difficulty sleeping due to coughing or wheezing", "Coughing or wheezing attacks worsened by cold air or respiratory infections", "Audible breathing", "Rapid breathing (tachypnea)", "Difficulty speaking in complete sentences during attacks", "Blue lips or fingernails (cyanosis — emergency sign)"],
    riskFactors: ["Family history of asthma or allergies (atopy)", "Personal history of allergies (eczema, hay fever, food allergies)", "Childhood respiratory infections", "Exposure to secondhand smoke", "Air pollution (Delhi, Mumbai, Kolkata — among most polluted cities)", "Occupational chemical or dust exposure", "Obesity", "Low birth weight", "Living in urban areas"],
    prevention: ["Identify and avoid personal triggers", "Use air purifiers at home (especially in polluted cities)", "Keep home clean and dust-free", "Use allergen-proof mattress and pillow covers", "Get annual flu and pneumonia vaccinations", "Regular exercise (controlled, with proper warm-up)", "Monitor air quality index (AQI) before outdoor activities", "Don't smoke and avoid secondhand smoke", "Take preventive (controller) medications as prescribed", "Have an asthma action plan", "Use face mask in polluted conditions"],
    homeRemedies: ["Honey — 1 tsp with warm water or herbal tea", "Ginger tea — natural bronchodilator and anti-inflammatory", "Turmeric milk (haldi doodh) — curcumin reduces airway inflammation", "Eucalyptus oil steam inhalation", "Mustard oil massage on chest (warm)", "Breathing exercises — Buteyko method, pursed-lip breathing", "Pranayama (anulom vilom, kapalbhati)", "Coffee/black tea — caffeine is a mild bronchodilator", "Omega-3 rich foods (fish, flaxseed, walnuts)", "Garlic (anti-inflammatory)", "Fig (anjeer) soaked overnight — eat in morning", "Maintain indoor humidity 30-50%"],
    treatments: ["Quick-relief (rescue): Short-acting beta-agonists (Salbutamol/Albuterol inhaler)", "Quick-relief: Ipratropium bromide", "Controller: Inhaled corticosteroids (Budesonide, Fluticasone, Beclomethasone)", "Controller: Long-acting beta-agonists (Formoterol, Salmeterol)", "Combination inhalers (Budesonide+Formoterol, Fluticasone+Salmeterol)", "Leukotriene modifiers (Montelukast)", "Biologic therapies (Omalizumab for severe allergic asthma)", "Theophylline", "Oral corticosteroids (short courses for acute exacerbations)", "Nebulizer treatments for severe attacks", "Spacer devices for better inhaler delivery"],
    whenToSeeDoctor: ["Using rescue inhaler more than 2 times per week", "Waking up at night due to asthma more than 2 times per month", "Needing to refill rescue inhaler more than twice a year", "Reduced peak flow readings", "Symptoms interfering with daily activities", "EMERGENCY: Severe shortness of breath, lips turning blue, difficulty speaking, rescue inhaler not helping"],
    urgency: "moderate",
    category: "Respiratory"
  },
  {
    name: "Urinary Tract Infection (UTI)",
    keywords: ["uti", "urinary infection", "burning urination", "frequent urination", "urine infection", "bladder infection", "painful urination", "cystitis", "peshab me jalan", "urine problem"],
    bodyAreas: ["abdomen", "pelvis", "general", "kidney"],
    description: "An infection in any part of the urinary system — kidneys (pyelonephritis), ureters, bladder (cystitis), or urethra (urethritis). Most UTIs involve the lower urinary tract (bladder and urethra). Women are at significantly greater risk — nearly 50% of women will experience at least one UTI in their lifetime. UTIs are the second most common type of infection worldwide.",
    causes: ["Escherichia coli (E. coli) bacteria — 80-90% of cases", "Staphylococcus saprophyticus", "Klebsiella pneumoniae", "Proteus mirabilis", "Enterococcus faecalis", "Sexual activity (introduces bacteria)", "Poor hygiene practices", "Catheter use", "Urinary tract abnormalities", "Kidney stones blocking urine flow", "Enlarged prostate (men)", "Diabetes (sugar in urine feeds bacteria)"],
    symptoms: ["Strong, persistent urge to urinate", "Burning sensation during urination (dysuria)", "Passing frequent, small amounts of urine", "Cloudy urine", "Strong-smelling urine", "Pink, red, or cola-colored urine (blood — hematuria)", "Pelvic pain in women (center of pelvis, around pubic bone)", "Rectal pain in men", "KIDNEY INFECTION symptoms: upper back and side pain, high fever, shaking/chills, nausea, vomiting"],
    riskFactors: ["Female anatomy (shorter urethra)", "Sexual activity", "Certain contraceptives (diaphragms, spermicidal agents)", "Menopause (decreased estrogen)", "Urinary tract abnormalities", "Recent urinary procedures", "Catheter use", "Kidney stones", "Enlarged prostate", "Diabetes", "Weakened immune system", "Incomplete bladder emptying", "Dehydration"],
    prevention: ["Drink plenty of water (2-3 liters daily)", "Urinate frequently — don't hold it", "Urinate soon after sexual intercourse", "Wipe front to back after using toilet", "Keep genital area clean and dry", "Avoid potentially irritating feminine products (douches, powders, sprays)", "Take showers instead of baths", "Wear cotton underwear and loose-fitting clothes", "Avoid tight jeans", "Cranberry juice or supplements (some evidence)", "Probiotics (lactobacillus)", "Maintain good blood sugar control if diabetic"],
    homeRemedies: ["Increase water intake significantly (3-4 liters/day)", "Cranberry juice (unsweetened) or cranberry supplements", "Vitamin C supplementation (1000mg/day — acidifies urine)", "Probiotics (curd/yogurt with live cultures)", "D-mannose supplements", "Barley water (jau ka pani)", "Coriander seed (dhaniya) water", "Coconut water", "Avoid bladder irritants: caffeine, alcohol, spicy food, artificial sweeteners", "Heat pad on lower abdomen for pain relief", "Garlic (natural antibacterial)", "Proper rest"],
    treatments: ["Antibiotics (primary treatment — course must be completed)", "Trimethoprim-Sulfamethoxazole (Bactrim)", "Nitrofurantoin (Macrobid)", "Fosfomycin (Monurol) — single dose", "Cephalexin or Cefixime", "Fluoroquinolones (Ciprofloxacin, Levofloxacin — for complicated UTIs)", "Phenazopyridine — urinary pain relief (not antibiotic)", "IV antibiotics for severe kidney infections", "Estrogen cream for post-menopausal women", "Long-term low-dose antibiotics for recurrent UTIs"],
    whenToSeeDoctor: ["Painful urination lasting more than 24 hours", "Blood in urine", "Fever above 101°F with urinary symptoms", "Flank pain (upper back/side) — may indicate kidney infection", "Symptoms in men (UTIs in men often indicate underlying problem)", "Symptoms in pregnant women (risk of complications)", "Recurrent UTIs (3+ per year)", "Symptoms not improving after 2 days of home care", "Nausea and vomiting with urinary symptoms"],
    urgency: "moderate",
    category: "Urological"
  },
  {
    name: "Dengue Fever",
    keywords: ["dengue", "dengue fever", "mosquito fever", "platelet", "bone breaking fever", "aedes", "platelets low", "dengue hemorrhagic"],
    bodyAreas: ["general", "head", "joints", "muscles"],
    description: "A mosquito-borne tropical disease caused by the dengue virus (DENV), transmitted primarily by female Aedes aegypti mosquitoes. India reports over 100,000 cases annually with outbreaks common during and after monsoon season (July-November). Dengue has 4 serotypes (DENV-1 to 4); infection with one provides lifelong immunity to that serotype but subsequent infections with different serotypes increase risk of severe dengue (dengue hemorrhagic fever).",
    causes: ["Dengue virus (4 serotypes: DENV-1, DENV-2, DENV-3, DENV-4)", "Transmitted by Aedes aegypti mosquito (primary vector)", "Aedes albopictus mosquito (secondary vector)", "Mosquitoes bite during daytime (peak: early morning and before dusk)", "NOT transmitted person-to-person (requires mosquito vector)", "Incubation period: 4-10 days after mosquito bite"],
    symptoms: ["Sudden high fever (104°F/40°C) lasting 2-7 days", "Severe headache (retro-orbital — behind the eyes)", "Pain behind the eyes (worsens with eye movement)", "Severe muscle pain (myalgia) — 'breakbone fever'", "Severe joint pain (arthralgia)", "Extreme fatigue", "Nausea and vomiting", "Skin rash (maculopapular rash appearing 2-5 days after fever onset)", "Mild bleeding (nosebleeds, bleeding gums, easy bruising)", "Low platelet count (thrombocytopenia)", "SEVERE DENGUE WARNING SIGNS: severe abdominal pain, persistent vomiting, rapid breathing, bleeding gums/nose, blood in vomit or stool, extreme fatigue, restlessness"],
    riskFactors: ["Living in or traveling to tropical endemic areas", "Monsoon and post-monsoon season in India", "Stagnant water near home (breeding grounds)", "Previous dengue infection (higher risk of severe dengue with second infection)", "Urban and peri-urban areas", "Poor sanitation and waste management", "Areas with high Aedes mosquito density", "Children (more susceptible to severe dengue)", "Open water storage containers"],
    prevention: ["Eliminate mosquito breeding sites (empty standing water weekly)", "Use mosquito repellents containing DEET, picaridin, or oil of lemon eucalyptus", "Wear long-sleeved clothing and long pants", "Use mosquito nets (especially for infants and during daytime sleep)", "Install window and door screens", "Use mosquito coils or electric vaporizers", "Apply larvicides (temephos) to stored water", "Community fogging during outbreaks", "Cover all water storage containers tightly", "Change water in plant trays, coolers, and bird baths regularly", "Support local mosquito control programs", "No vaccine widely available in India yet (Dengvaxia has limited use)"],
    homeRemedies: ["IMPORTANT: Dengue requires medical supervision. Home remedies are supportive only.", "Papaya leaf extract/juice — evidence suggests it may help increase platelet count (grind fresh leaves, extract juice, take 2 tbsp twice daily)", "Giloy (Tinospora cordifolia) juice — traditional immunity booster", "Adequate rest (bed rest during fever)", "Plenty of fluids (water, ORS, coconut water, fresh fruit juices)", "Goat milk — traditionally believed to help platelet recovery", "Kiwi fruit — rich in vitamin C and potassium", "Pomegranate juice — iron and nutrients", "Avoid aspirin and ibuprofen (can worsen bleeding)", "Use paracetamol ONLY for fever", "Light, easily digestible food", "Monitor platelet count daily"],
    treatments: ["No specific antiviral treatment exists", "Supportive care is the mainstay of treatment", "Paracetamol for fever and pain (AVOID aspirin, ibuprofen, NSAIDs — risk of bleeding)", "Oral Rehydration Solution (ORS) for hydration", "IV fluid replacement for severe cases", "Platelet transfusion if count drops below 10,000 or with active bleeding", "Blood transfusion for severe hemorrhaging", "Close monitoring of vital signs and platelet count", "Hospitalization for severe dengue (dengue hemorrhagic fever/dengue shock syndrome)", "Serial monitoring of hematocrit levels", "Nutritional support and rest"],
    whenToSeeDoctor: ["High fever lasting more than 2 days", "IMMEDIATELY if warning signs appear: severe abdominal pain, persistent vomiting, rapid breathing, bleeding gums/nose, blood in vomit or stool, extreme lethargy, restlessness", "Platelet count dropping below 100,000", "Platelet count below 20,000 (emergency)", "Signs of dehydration (dry mouth, reduced urination)", "Rash with fever", "Fever after potential mosquito exposure in endemic area"],
    urgency: "high",
    category: "Infectious Disease"
  },
  {
    name: "Malaria",
    keywords: ["malaria", "mosquito", "chills fever", "plasmodium", "anopheles", "recurring fever", "shivering fever", "malaria fever"],
    bodyAreas: ["general", "head", "abdomen", "liver", "spleen"],
    description: "A life-threatening disease caused by Plasmodium parasites transmitted through bites of infected female Anopheles mosquitoes (which bite primarily between dusk and dawn). India accounts for approximately 2% of global malaria cases. P. vivax and P. falciparum are the most common species in India, with P. falciparum causing the most severe and potentially fatal form.",
    causes: ["Plasmodium falciparum (most dangerous, prevalent in NE India, Odisha, Jharkhand)", "Plasmodium vivax (most common in India overall)", "Plasmodium ovale", "Plasmodium malariae", "Plasmodium knowlesi", "Transmitted by infected female Anopheles mosquito bite", "Can also spread through blood transfusion, organ transplant, shared needles", "Mother to child during pregnancy (congenital malaria)", "Incubation period: 7-30 days (can be longer for P. vivax)"],
    symptoms: ["Cyclic high fever with rigors (shaking chills)", "Classic pattern: cold stage (chills) → hot stage (high fever 104-106°F) → sweating stage", "Fever cycles every 48 hours (P. vivax, P. ovale) or 72 hours (P. malariae)", "Severe headache", "Profuse sweating", "Muscle and joint pain", "Nausea, vomiting, diarrhea", "Fatigue and malaise", "Abdominal pain", "Enlarged spleen (splenomegaly) and liver (hepatomegaly)", "Anemia", "Jaundice (yellow skin/eyes)", "SEVERE/CEREBRAL MALARIA: confusion, seizures, coma, respiratory distress, multi-organ failure"],
    riskFactors: ["Living in or traveling to endemic areas (rural India, tribal areas, forest areas)", "Northeast India, Odisha, Chhattisgarh, Jharkhand, Madhya Pradesh — high burden states", "Monsoon and post-monsoon season", "Lack of mosquito protection", "Outdoor work at dusk and dawn", "Weakened immune system", "Pregnancy (increased susceptibility and severity)", "Children under 5", "Travelers from non-endemic areas (no immunity)"],
    prevention: ["Use insecticide-treated bed nets (ITNs/LLINs)", "Indoor residual spraying (IRS) with insecticides", "Apply DEET-based mosquito repellent on exposed skin", "Wear light-colored, long-sleeved clothing at dusk/dawn", "Take antimalarial prophylaxis if traveling to high-risk areas", "Eliminate stagnant water breeding sites", "Use mosquito coils/vaporizers indoors", "Screen windows and doors", "Community-based vector control programs", "Government malaria control programs (National Vector Borne Disease Control Programme — NVBDCP)"],
    homeRemedies: ["CRITICAL: Malaria REQUIRES proper medical treatment. Home remedies are ONLY supportive.", "Adequate hydration — ORS, coconut water, fresh juices", "Light, nutritious food — khichdi, rice, fruits", "Neem leaves — traditional antimalarial (boil and drink water)", "Cinnamon tea with honey", "Turmeric milk", "Ginger tea for nausea", "Papaya leaf juice (may help platelet count)", "Complete rest", "Cold compress for high fever", "Frequent small meals"],
    treatments: ["Artemisinin-based Combination Therapy (ACT) — first line for P. falciparum", "Artesunate + Sulfadoxine-Pyrimethamine (for uncomplicated P. falciparum)", "Chloroquine — first line for P. vivax (still effective in most of India)", "Primaquine — for P. vivax (14-day course to prevent relapse from liver stages)", "IV Artesunate — for severe malaria (emergency)", "Quinine — alternative for severe malaria", "Supportive care: IV fluids, blood transfusion for severe anemia", "Monitoring for complications: cerebral malaria, renal failure, ARDS", "National treatment guidelines by NVBDCP"],
    whenToSeeDoctor: ["Any fever with chills after potential mosquito exposure", "Recurring fever pattern (every 2-3 days)", "Fever after visiting malaria-endemic area", "Jaundice with fever", "Severe headache with confusion", "Difficulty breathing", "Persistent vomiting", "Dark or reduced urine output", "Seizures or altered consciousness — EMERGENCY", "Pregnant women with fever — immediate medical attention"],
    urgency: "high",
    category: "Infectious Disease"
  },
  {
    name: "Tuberculosis (TB)",
    keywords: ["tuberculosis", "tb", "persistent cough", "coughing blood", "night sweats", "weight loss cough", "tb disease", "kshay rog", "lung infection chronic"],
    bodyAreas: ["chest", "lungs", "general"],
    description: "A serious infectious disease caused by Mycobacterium tuberculosis that primarily affects the lungs (pulmonary TB) but can affect any organ (extrapulmonary TB — lymph nodes, bones, kidneys, brain). India has the HIGHEST TB burden globally, accounting for ~26% of all TB cases worldwide with approximately 2.69 million cases annually. TB is both preventable and curable with proper treatment. India's national program aims to eliminate TB by 2025.",
    causes: ["Mycobacterium tuberculosis (MTB) bacteria", "Airborne transmission — spread when an infected person coughs, sneezes, speaks, or sings", "NOT spread by touching, sharing food, or kissing", "Latent TB: bacteria present but inactive (not contagious, can become active)", "Active TB: bacteria multiplying and causing symptoms (contagious)", "Drug-resistant TB: MDR-TB (Multi-Drug Resistant) and XDR-TB (Extensively Drug Resistant)"],
    symptoms: ["Persistent cough lasting 3+ weeks (hallmark symptom)", "Coughing up blood or blood-tinged sputum (hemoptysis)", "Chest pain during breathing or coughing", "Unintentional weight loss", "Extreme fatigue and weakness", "Fever (typically low-grade, evening rise)", "Drenching night sweats", "Chills", "Loss of appetite", "Swollen lymph nodes", "EXTRAPULMONARY: depends on site — bone pain, blood in urine, headache, back pain"],
    riskFactors: ["Close contact with active TB patient", "Living in crowded conditions (slums, prisons, hostels)", "HIV/AIDS (most significant risk factor — 20-30x higher risk)", "Weakened immune system (malnutrition, diabetes, cancer treatment, immunosuppressive drugs)", "Healthcare workers", "Smokers and tobacco users", "Alcohol abuse", "Malnutrition and poverty", "Age extremes (very young and elderly)", "Certain occupations (mining, silica exposure)", "Diabetes mellitus (2-3x higher risk)"],
    prevention: ["BCG vaccination at birth (part of India's Universal Immunization Programme)", "Early detection and treatment of active cases", "Contact tracing of diagnosed cases", "Good ventilation in living and working spaces", "Respiratory hygiene (cover mouth when coughing)", "DOTS (Directly Observed Treatment, Short-course) — ensures treatment completion", "Nutritional support for malnourished populations", "HIV testing and antiretroviral therapy for co-infected patients", "Isoniazid Preventive Therapy (IPT) for high-risk contacts", "Regular screening for high-risk groups", "Ni-kshay Poshan Yojana (nutritional support for TB patients in India)"],
    homeRemedies: ["CRITICAL: TB REQUIRES proper medical treatment with antibiotics for 6+ months. These are SUPPORTIVE measures only.", "High-protein diet (eggs, fish, chicken, dal, milk, paneer)", "Green leafy vegetables (iron-rich)", "Fresh fruits (vitamin C for immunity)", "Garlic (natural antibacterial — 2-3 cloves daily)", "Green tea (antioxidant support)", "Indian gooseberry (amla) for immunity", "Drumstick (moringa) leaves and pods", "Adequate rest and sleep", "Stay well-hydrated", "Sunlight exposure (natural vitamin D)", "Avoid smoking and alcohol completely", "Tulsi tea for respiratory support"],
    treatments: ["DOTS (Directly Observed Treatment, Short-course) — WHO recommended, India's standard", "Category 1 (new patients): Intensive phase (2 months) — Isoniazid, Rifampicin, Pyrazinamide, Ethambutol; Continuation phase (4 months) — Isoniazid, Rifampicin", "Total treatment duration: 6 months minimum (MUST complete full course)", "MDR-TB treatment: 18-24 months with second-line drugs (Bedaquiline, Delamanid, Linezolid, Cycloserine, etc.)", "XDR-TB: Longer, more complex regimens", "Daily Fixed-Dose Combinations (FDC) as per RNTCP/NTEP", "Pyridoxine (Vitamin B6) supplementation to prevent neuropathy", "Regular sputum tests to monitor treatment response", "Ni-kshay portal for TB notification and monitoring", "Nikshay Mitra — community support for TB patients"],
    whenToSeeDoctor: ["Cough lasting more than 2-3 weeks", "Coughing up blood (even small amounts)", "Unexplained weight loss", "Persistent low-grade fever and night sweats", "Close contact with TB patient — get tested", "Fatigue not explained by other causes", "Swollen lymph nodes", "If on TB treatment: any new symptoms, vision changes, jaundice, joint pain (drug side effects)"],
    urgency: "high",
    category: "Infectious Disease"
  },
  {
    name: "Heart Attack (Myocardial Infarction)",
    keywords: ["heart attack", "chest pain severe", "crushing chest", "heart pain", "cardiac", "myocardial", "arm pain chest", "dil ka daura", "heart failure", "cardiac arrest"],
    bodyAreas: ["chest", "left arm", "jaw", "heart"],
    description: "A life-threatening medical emergency where blood flow to part of the heart muscle is suddenly blocked, usually by a blood clot, causing heart tissue damage or death. Coronary artery disease (atherosclerosis) is the underlying cause in most cases. Heart disease is the leading cause of death in India, accounting for ~28% of all deaths. Indians are genetically more susceptible and tend to have heart attacks 10 years earlier than Western populations.",
    causes: ["Coronary artery disease (atherosclerosis — plaque buildup in arteries)", "Blood clot (thrombus) blocking a coronary artery", "Coronary artery spasm", "Spontaneous coronary artery dissection (SCAD)", "Coronary embolism"],
    symptoms: ["Crushing chest pain or pressure (feels like heavy weight on chest)", "Pain radiating to left arm, shoulder, back, neck, jaw, or teeth", "Shortness of breath (with or without chest pain)", "Cold sweat (diaphoresis)", "Nausea and/or vomiting", "Lightheadedness or sudden dizziness", "Extreme fatigue (especially in women)", "Sense of impending doom", "Rapid or irregular heartbeat", "Women may have ATYPICAL symptoms: unusual fatigue, sleep disturbance, shortness of breath, indigestion, anxiety"],
    riskFactors: ["Age (men over 45, women over 55)", "Smoking (most modifiable risk factor)", "High blood pressure", "High LDL cholesterol and low HDL cholesterol", "Diabetes mellitus", "Obesity (especially abdominal)", "Family history of heart disease (especially before age 55 in male or 65 in female relative)", "Physical inactivity", "Chronic stress", "South Asian ethnicity (genetic predisposition)", "Indian diet high in ghee, fried foods, and refined carbs", "Metabolic syndrome", "Air pollution (significant factor in Indian cities)"],
    prevention: ["Don't smoke — quit if you do (risk drops significantly within 1-2 years)", "Regular cardiovascular exercise (150 min moderate or 75 min vigorous/week)", "Heart-healthy diet (Mediterranean or modified Indian diet with less oil/ghee)", "Maintain healthy weight (BMI 18.5-24.9)", "Control blood pressure (target <130/80)", "Manage cholesterol (LDL < 100 mg/dL)", "Control diabetes (HbA1c < 7%)", "Manage stress (yoga, meditation, pranayama)", "Limit alcohol", "Regular health checkups after age 30", "Know your numbers: BP, cholesterol, blood sugar", "Take prescribed medications (statins, antihypertensives) consistently", "Reduce trans fats, saturated fats, and sodium", "Cardiac rehabilitation if previous event"],
    homeRemedies: ["HEART ATTACK IS A MEDICAL EMERGENCY — CALL 112/108 IMMEDIATELY", "While waiting for emergency services:", "Chew 1 regular aspirin (325mg) or 4 baby aspirin (81mg each) — unless allergic", "Sit or lie down in comfortable position", "Loosen tight clothing", "If prescribed, use nitroglycerin", "Stay calm and take slow, deep breaths", "Do NOT drive yourself to hospital", "PREVENTION home remedies: garlic daily, omega-3 rich foods, green tea, turmeric, nuts (walnuts, almonds), flaxseeds"],
    treatments: ["EMERGENCY: Call 112/108 immediately — 'Time is muscle'", "Aspirin 325mg chewed immediately", "Thrombolysis (clot-busting drugs — Streptokinase, Tenecteplase) if within window", "Primary PCI (Percutaneous Coronary Intervention — angioplasty with stent) — gold standard if available within 90 minutes", "Coronary artery bypass grafting (CABG) for severe multi-vessel disease", "Medications: Dual antiplatelet therapy (Aspirin + Clopidogrel/Ticagrelor), Statins (Atorvastatin/Rosuvastatin), ACE inhibitors, Beta-blockers", "Cardiac rehabilitation program", "Lifestyle modifications (diet, exercise, smoking cessation)", "Ayushman Bharat scheme may cover treatment costs at empaneled hospitals"],
    whenToSeeDoctor: ["ANY chest pain or discomfort — seek emergency care immediately", "Pain spreading to arm, jaw, neck, or back", "Sudden shortness of breath", "Cold sweats with chest discomfort", "Sudden severe fatigue", "Nausea with chest pressure", "REMEMBER: Don't wait — call 112 or 108 immediately", "Golden Hour: Treatment within first hour dramatically improves outcomes"],
    urgency: "emergency",
    category: "Cardiovascular"
  },
  {
    name: "Stroke (Brain Attack)",
    keywords: ["stroke", "brain attack", "face drooping", "arm weakness", "speech difficulty", "paralysis sudden", "brain bleed", "lakwa", "brain stroke"],
    bodyAreas: ["head", "brain", "general"],
    description: "A medical emergency where blood supply to part of the brain is interrupted or severely reduced, depriving brain tissue of oxygen and nutrients. Brain cells begin to die within minutes. There are two main types: ischemic stroke (87% — caused by blocked artery) and hemorrhagic stroke (13% — caused by bleeding). Stroke is the 4th leading cause of death in India. EVERY MINUTE COUNTS — 1.9 million neurons die every minute during a stroke.",
    causes: ["Ischemic stroke: blood clot blocking brain artery (thrombotic or embolic)", "Hemorrhagic stroke: ruptured blood vessel in brain", "Transient Ischemic Attack (TIA/mini-stroke): temporary blockage (warning sign)", "Atherosclerosis of brain arteries", "Atrial fibrillation (blood clots from irregular heartbeat)", "High blood pressure (most important modifiable risk factor)", "Cerebral aneurysm rupture"],
    symptoms: ["SUDDEN numbness or weakness of face, arm, or leg — especially on ONE SIDE", "SUDDEN confusion or trouble speaking/understanding speech", "SUDDEN trouble seeing in one or both eyes", "SUDDEN severe headache with no known cause", "SUDDEN trouble walking, dizziness, loss of balance/coordination", "Use FAST test: Face drooping, Arm weakness, Speech difficulty, Time to call emergency", "Additional: sudden severe fatigue, nausea/vomiting, brief loss of consciousness"],
    riskFactors: ["High blood pressure (single most important risk factor)", "Atrial fibrillation", "Diabetes", "High cholesterol", "Smoking", "Obesity", "Physical inactivity", "Excessive alcohol use", "Age over 55", "Family history", "Previous stroke or TIA", "Heart disease", "Sickle cell disease", "South Asian ethnicity"],
    prevention: ["Control blood pressure (target < 130/80)", "Regular exercise (30 min daily)", "Healthy diet (low sodium, high fiber, fruits, vegetables)", "Don't smoke", "Manage diabetes", "Control cholesterol", "Limit alcohol", "Treat atrial fibrillation (blood thinners if prescribed)", "Maintain healthy weight", "Regular health screenings", "Take medications as prescribed", "Manage stress"],
    homeRemedies: ["STROKE IS A MEDICAL EMERGENCY — CALL 112/108 IMMEDIATELY", "There are NO home remedies for acute stroke", "While waiting for ambulance: Note time symptoms started (critical for treatment decisions), Keep person comfortable, Do NOT give food or water (swallowing may be impaired), Keep head slightly elevated, Monitor breathing, Perform CPR if person stops breathing", "PREVENTION: turmeric, garlic, green tea, omega-3 fatty acids, dark leafy greens"],
    treatments: ["EMERGENCY: Call 112/108 — 'Time is Brain'", "Ischemic stroke: IV tPA (alteplase) — must be given within 4.5 hours of symptom onset", "Ischemic stroke: Mechanical thrombectomy — up to 24 hours in select patients", "Hemorrhagic stroke: Surgical intervention to stop bleeding", "ICU monitoring and supportive care", "Blood pressure management", "Antiplatelet therapy (Aspirin, Clopidogrel)", "Anticoagulation for atrial fibrillation (Warfarin, Dabigatran, Rivaroxaban)", "Stroke rehabilitation: physical therapy, occupational therapy, speech therapy", "Secondary prevention medications"],
    whenToSeeDoctor: ["CALL EMERGENCY SERVICES (112/108) IMMEDIATELY for any stroke symptoms", "Use FAST: Face drooping, Arm weakness, Speech difficulty, Time to call 112", "Do NOT wait to see if symptoms resolve", "TIA (mini-stroke symptoms that resolve) — still seek immediate medical attention (high risk of full stroke within 48 hours)", "Note the exact time symptoms started — this determines treatment options"],
    urgency: "emergency",
    category: "Neurological"
  },
  {
    name: "COVID-19 (SARS-CoV-2 Infection)",
    keywords: ["covid", "coronavirus", "covid-19", "sars-cov-2", "corona", "loss of taste", "loss of smell", "omicron", "delta", "corona virus", "kovid"],
    bodyAreas: ["chest", "throat", "head", "general", "lungs"],
    description: "An infectious disease caused by the SARS-CoV-2 virus, primarily affecting the respiratory system but potentially impacting multiple organs. Severity ranges from asymptomatic to life-threatening. India experienced devastating waves, particularly the Delta variant wave in 2021. While the pandemic has evolved into an endemic phase in most regions, COVID-19 continues to circulate with new variants emerging. Long COVID (post-COVID syndrome) affects some patients for months after initial infection.",
    causes: ["SARS-CoV-2 virus (various variants: Alpha, Beta, Delta, Omicron, subvariants)", "Primarily airborne transmission (respiratory droplets and aerosols)", "Close contact with infected person (within 6 feet)", "Poorly ventilated indoor spaces", "Contaminated surfaces (fomite transmission — less common)", "Incubation period: 1-14 days (average 5 days, shorter for Omicron)"],
    symptoms: ["Fever or chills", "Dry cough (may be persistent)", "Shortness of breath or difficulty breathing", "Fatigue and extreme tiredness", "Body aches and muscle pain", "Loss of taste (ageusia) or smell (anosmia) — more common with Delta", "Sore throat", "Nasal congestion or runny nose", "Headache", "Nausea, vomiting, or diarrhea", "Brain fog and difficulty concentrating", "SEVERE: persistent chest pain, confusion, inability to stay awake, bluish lips/skin, low oxygen (SpO2 < 94%)"],
    riskFactors: ["Older age (risk increases significantly after 60)", "Underlying conditions: diabetes, heart disease, lung disease, kidney disease, liver disease", "Obesity (BMI > 30)", "Immunosuppressed individuals", "Unvaccinated or partially vaccinated", "Smoking", "Cancer (especially during treatment)", "Pregnancy", "Organ transplant recipients", "HIV/AIDS with low CD4 count"],
    prevention: ["Get vaccinated and stay updated with boosters", "Wear well-fitting masks (N95/KN95) in crowded indoor spaces", "Maintain hand hygiene (wash with soap 20 sec or use 60%+ alcohol sanitizer)", "Ensure good ventilation in indoor spaces", "Physical distancing when symptomatic", "Stay home when sick", "Cover coughs and sneezes", "Regular surface disinfection", "Get tested if symptomatic or exposed", "Isolate if positive (5-10 days)"],
    homeRemedies: ["Rest and adequate sleep", "Stay well-hydrated (warm water, soups, herbal teas)", "Steam inhalation (3-4 times daily)", "Kadha (traditional immunity drink: tulsi, ginger, cinnamon, black pepper, turmeric)", "Prone positioning (lying on stomach) — improves oxygen levels", "Honey with warm water for cough", "Gargling with warm salt water", "Vitamin C, D, and Zinc supplementation", "Monitor oxygen levels with pulse oximeter", "Breathing exercises (pursed-lip breathing, diaphragmatic breathing)", "Light meals — khichdi, dal, fruits", "Paracetamol for fever (avoid ibuprofen initially)", "Seek medical help if SpO2 drops below 94%"],
    treatments: ["Mild-Moderate: Symptomatic treatment (paracetamol, hydration, rest)", "Antivirals: Paxlovid (nirmatrelvir/ritonavir), Molnupiravir — within 5 days of symptoms", "Monoclonal antibodies (limited use with newer variants)", "Moderate-Severe: Remdesivir IV (5-day course)", "Dexamethasone 6mg daily for 10 days (for patients requiring oxygen)", "Anticoagulation (to prevent blood clots)", "Oxygen therapy (nasal cannula, high-flow nasal cannula, CPAP/BiPAP)", "Mechanical ventilation for critical cases", "Tocilizumab or Baricitinib for cytokine storm", "Prone positioning in hospital", "Long COVID management: rehabilitation, symptom-specific treatment"],
    whenToSeeDoctor: ["Difficulty breathing or shortness of breath", "Persistent chest pain or pressure", "New confusion or inability to stay awake", "Bluish lips, face, or fingernails (cyanosis)", "Oxygen saturation (SpO2) below 94%", "High fever not responding to paracetamol", "Severe dehydration", "Worsening symptoms after initial improvement", "Persistent loss of taste/smell beyond 4 weeks", "Long COVID symptoms affecting daily life"],
    urgency: "moderate",
    category: "Infectious Disease"
  },
  {
    name: "Anemia (Iron Deficiency)",
    keywords: ["anemia", "low hemoglobin", "iron deficiency", "pale skin", "fatigue weakness", "low blood count", "hb low", "anaemia", "khoon ki kami", "low iron"],
    bodyAreas: ["general"],
    description: "A condition where you lack enough healthy red blood cells or hemoglobin to carry adequate oxygen to your body's tissues. Iron deficiency anemia is the most common type globally and is extremely prevalent in India — affecting approximately 50% of Indian women of reproductive age and 58% of children under 5. It is a major public health concern that contributes significantly to maternal and child mortality.",
    causes: ["Inadequate dietary iron intake", "Poor iron absorption (celiac disease, IBD, H. pylori infection)", "Increased iron requirements (pregnancy, growth, menstruation)", "Blood loss: heavy menstrual periods (menorrhagia), GI bleeding (ulcers, hemorrhoids, cancer), frequent blood donation", "Vitamin B12 deficiency (pernicious anemia)", "Folate deficiency", "Chronic diseases (kidney disease, cancer, autoimmune conditions)", "Bone marrow disorders", "Hemolysis (destruction of red blood cells)", "Genetic: thalassemia (very common in India), sickle cell disease", "Hookworm and parasitic infections (common in rural India)", "Vegetarian diet without adequate iron supplementation"],
    symptoms: ["Fatigue and extreme weakness", "Pale or yellowish skin (pallor)", "Pale conjunctiva (inner eyelids), nail beds, and palms", "Shortness of breath on exertion", "Dizziness or lightheadedness", "Cold hands and feet", "Brittle, spoon-shaped nails (koilonychia)", "Fast or irregular heartbeat (palpitations)", "Headache", "Chest pain (in severe cases)", "Unusual cravings for non-food items (pica — ice, dirt, starch)", "Swollen or sore tongue (glossitis)", "Difficulty concentrating", "Restless legs syndrome", "Frequent infections"],
    riskFactors: ["Women of reproductive age (menstrual blood loss)", "Pregnancy and breastfeeding", "Vegetarian/vegan diet without iron supplementation", "Children (rapid growth, poor diet)", "Elderly", "Frequent blood donors", "Chronic kidney disease", "GI conditions (celiac disease, Crohn's disease)", "Heavy tea/coffee consumption with meals (inhibits iron absorption)", "Low socioeconomic status", "Parasitic infections (hookworm)", "Thalassemia trait (very common in India)"],
    prevention: ["Iron-rich diet daily", "Heme iron sources (meat, fish, poultry — better absorbed)", "Non-heme iron sources: spinach (palak), lentils (dal), beans (rajma, chana), tofu, fortified cereals, jaggery (gur), dates (khajoor), sesame seeds (til), beetroot", "Vitamin C with meals to enhance iron absorption (lemon, amla, orange, tomato)", "Avoid tea/coffee during and 1 hour after meals (tannins inhibit absorption)", "Iron and folic acid supplementation during pregnancy", "Regular deworming (especially in children)", "Government programs: Weekly Iron and Folic Acid Supplementation (WIFS), POSHAN Abhiyaan", "Iron-fortified foods and double-fortified salt (iron + iodine)", "Regular hemoglobin testing"],
    homeRemedies: ["Beetroot and pomegranate juice (rich in iron and folic acid)", "Amla (Indian gooseberry) — excellent vitamin C source, enhances iron absorption", "Jaggery (gur) — iron-rich alternative to sugar", "Dates (khajoor) and black raisins (kali kishmish) — eat 5-6 daily", "Moringa (drumstick) leaves — very high in iron", "Sesame seeds (til) — 1 tablespoon daily", "Soaked black chana (chickpeas) — eat in morning", "Cook in iron cast cookware (leaches iron into food)", "Lemon juice squeezed on dal, salads, and iron-rich foods", "Banana with honey", "Spinach (palak) preparations — palak paneer, palak dal", "Ragi (finger millet) — iron and calcium rich", "Apple and beetroot smoothie", "Avoid calcium supplements at same time as iron-rich meals"],
    treatments: ["Oral iron supplements: Ferrous sulfate 325mg (65mg elemental iron) 1-3 times daily", "Ferrous fumarate or ferrous gluconate (alternatives)", "Take iron on empty stomach with vitamin C for best absorption", "If oral intolerance: Ferrous ascorbinate, Iron polysaccharide complex", "IV iron infusion (Ferric carboxymaltose, Iron sucrose) for severe cases or poor oral absorption", "Treat underlying cause (heavy periods, GI bleeding, parasitic infection)", "Blood transfusion for severe symptomatic anemia (Hb < 7 g/dL or hemodynamically unstable)", "Folic acid supplementation (5mg daily) if folate-deficient", "Vitamin B12 injections if B12-deficient", "Erythropoietin for anemia of chronic kidney disease", "Regular monitoring of hemoglobin and ferritin levels"],
    whenToSeeDoctor: ["Persistent fatigue not improving with rest", "Noticeable pallor (pale skin, pale inner eyelids)", "Shortness of breath on mild exertion", "Rapid heartbeat or chest pain", "Dizziness or fainting", "Blood in stool (black tarry stools) or heavy menstrual bleeding", "Difficulty concentrating", "During pregnancy — regular Hb monitoring essential", "Hemoglobin below 11 g/dL (women), 13 g/dL (men)", "Pica cravings (ice, dirt, starch)"],
    urgency: "moderate",
    category: "Hematological"
  },
  {
    name: "Allergic Rhinitis (Hay Fever)",
    keywords: ["allergy", "allergies", "allergic", "rhinitis", "hay fever", "sneezing", "itchy eyes", "pollen allergy", "dust allergy", "naak behna", "naak band"],
    bodyAreas: ["head", "throat", "nose", "eyes"],
    description: "An allergic response causing cold-like symptoms such as sneezing, itching, nasal congestion, and runny nose triggered by allergens. Unlike a cold, allergic rhinitis isn't caused by a virus — it's caused by the immune system overreacting to harmless substances. It affects 20-30% of the Indian population and significantly impacts quality of life, sleep, and productivity.",
    causes: ["Pollen (trees, grasses, weeds — seasonal)", "Dust mites (year-round)", "Pet dander (cats, dogs)", "Mold spores", "Cockroach droppings", "Air pollution (major trigger in Indian cities)", "Smoke (cigarette, biomass burning, crop burning — especially in North India)", "Strong perfumes and chemical fumes"],
    symptoms: ["Frequent sneezing (paroxysms of 10-20 sneezes)", "Runny nose with clear watery discharge", "Stuffy/congested nose", "Itchy nose, eyes, roof of mouth, throat", "Watery, red eyes (allergic conjunctivitis)", "Post-nasal drip", "Cough", "Facial pressure and headache", "Dark circles under eyes (allergic shiners)", "Fatigue", "Reduced sense of smell", "Snoring and sleep disturbance"],
    riskFactors: ["Family history of allergies or asthma", "Having other allergic conditions (eczema, asthma, food allergies)", "Living in polluted cities (Delhi NCR, Indo-Gangetic plain)", "Exposure to crop burning smoke", "Pet ownership without proper allergy management", "Early childhood antibiotic overuse", "Indoor air pollution from biomass cooking fuel"],
    prevention: ["Identify personal allergens through allergy testing", "Keep windows closed during high pollen days", "Use HEPA air purifiers indoors", "Wash bedding in hot water (60°C) weekly", "Use allergen-proof mattress and pillow covers", "Shower and change clothes after outdoor activities", "Vacuum frequently with HEPA filter", "Control indoor humidity (30-50%)", "Wear mask during high pollution days (check AQI)", "Nasal saline irrigation (neti pot) regularly"],
    homeRemedies: ["Steam inhalation with eucalyptus oil", "Honey — 1 tsp local honey daily (may help build tolerance to local pollen)", "Turmeric with warm milk (anti-inflammatory)", "Ginger tea with honey", "Saline nasal rinse (jal neti) — 1/2 tsp salt in warm water", "Peppermint tea (natural decongestant)", "Apple cider vinegar — 1 tbsp in water with honey", "Nettle tea (natural antihistamine)", "Vitamin C supplementation (natural antihistamine)", "Quercetin-rich foods (onions, apples, berries)", "Keep indoor plants that purify air (money plant, aloe vera, spider plant)"],
    treatments: ["Antihistamines: Cetirizine, Levocetirizine, Fexofenadine, Loratadine (non-drowsy)", "Intranasal corticosteroids: Fluticasone (Flonase), Mometasone (Nasonex), Budesonide — most effective", "Decongestants: Pseudoephedrine, Oxymetazoline nasal spray (max 3 days)", "Leukotriene modifiers: Montelukast", "Nasal antihistamine: Azelastine spray", "Eye drops: Olopatadine, Ketotifen for allergic conjunctivitis", "Immunotherapy (allergy shots or sublingual drops) — for severe cases", "Nasal saline irrigation", "Combination therapy for moderate-severe cases"],
    whenToSeeDoctor: ["Symptoms not controlled by OTC antihistamines", "Symptoms significantly affect sleep, work, or quality of life", "Frequent sinus infections", "Wheezing or difficulty breathing (may indicate asthma)", "Ear pain or hearing changes", "Persistent nasal blockage on one side (rule out polyps)", "Need for allergy testing to identify triggers", "Considering immunotherapy"],
    urgency: "low",
    category: "Allergy/Immunology"
  },
  {
    name: "Lower Back Pain",
    keywords: ["back pain", "lower back", "spine pain", "backache", "lumbar", "sciatica", "slipped disc", "back ache", "kamar dard", "peeth dard", "disc problem", "herniated disc"],
    bodyAreas: ["back", "spine", "legs"],
    description: "Pain in the lower back (lumbar region) that can range from a dull, constant ache to a sudden, sharp, debilitating pain. It is one of the most common reasons for medical visits and missed work globally. About 80% of adults experience lower back pain at some point. Most episodes resolve within 6 weeks with self-care, but chronic back pain (lasting >12 weeks) requires medical evaluation.",
    causes: ["Muscle or ligament strain (most common — from heavy lifting, sudden movement)", "Bulging or herniated (slipped) disc", "Degenerative disc disease", "Spinal stenosis (narrowing of spinal canal)", "Sciatica (compression of sciatic nerve)", "Osteoarthritis of spine (spondylosis)", "Spondylolisthesis (vertebra slipping forward)", "Osteoporosis (compression fractures)", "Poor posture (prolonged sitting, especially at computer)", "Sedentary lifestyle", "Ankylosing spondylitis (autoimmune)", "Kidney stones or infection (can mimic back pain)"],
    symptoms: ["Dull, aching pain in lower back", "Sharp, shooting pain (especially with sciatica — radiates down leg)", "Pain that worsens with bending, lifting, standing, or walking", "Stiffness and limited range of motion", "Muscle spasms", "Pain radiating down one or both legs (sciatica)", "Numbness or tingling in legs or feet", "Difficulty standing up straight", "Pain that improves with lying down", "Pain worse in morning (with stiffness)", "Weakness in legs (serious sign — seek medical attention)"],
    riskFactors: ["Age (30-50 years — degenerative changes begin)", "Sedentary lifestyle and lack of exercise", "Obesity and excess weight", "Poor posture and ergonomics", "Occupational factors (heavy lifting, prolonged sitting, vibration)", "Smoking (reduces blood flow to spine, impairs healing)", "Psychological factors (stress, anxiety, depression)", "Previous back injury", "Pregnancy", "Osteoporosis", "Genetic factors (disc degeneration, ankylosing spondylitis)"],
    prevention: ["Regular exercise (core strengthening — planks, bridges, bird-dogs)", "Maintain healthy weight", "Practice good posture (shoulders back, engage core)", "Ergonomic workspace setup (monitor at eye level, feet flat, lumbar support)", "Lift properly (bend knees, keep back straight, hold load close)", "Take breaks from prolonged sitting (every 30-60 minutes)", "Sleep on firm mattress with proper support", "Yoga and stretching (cat-cow, child's pose, cobra pose)", "Strengthen core muscles", "Quit smoking", "Stay hydrated (spinal discs need hydration)", "Regular walking (30 min daily)"],
    homeRemedies: ["Hot and cold therapy (ice first 48 hours, then heat)", "Epsom salt bath (magnesium relaxes muscles)", "Turmeric milk (anti-inflammatory)", "Ginger tea or ginger paste applied topically", "Mustard oil massage (warm)", "Gentle stretching exercises (knee-to-chest, pelvic tilts)", "Cat-cow yoga pose", "Child's pose (balasana)", "Cobra pose (bhujangasana) — gentle", "Ajwain (carom seed) poultice — warm", "Eucalyptus oil massage", "Over-the-counter pain relievers (ibuprofen, paracetamol)", "Maintain light activity (bed rest > 2 days worsens outcomes)", "Tennis ball self-massage for tight spots", "Swimming or water exercises (low impact)"],
    treatments: ["NSAIDs (Ibuprofen, Naproxen, Diclofenac) — short-term use", "Muscle relaxants (Cyclobenzaprine, Methocarbamol, Chlorzoxazone)", "Physical therapy (most effective long-term treatment)", "Core strengthening exercises", "Spinal manipulation (chiropractic/osteopathic)", "Epidural steroid injections (for severe sciatica/disc herniation)", "Nerve blocks", "Acupuncture", "TENS (Transcutaneous Electrical Nerve Stimulation)", "Cognitive behavioral therapy (for chronic pain)", "Surgery: discectomy, laminectomy, spinal fusion — last resort for specific structural problems", "Yoga therapy", "McKenzie exercises"],
    whenToSeeDoctor: ["Pain lasting more than 4-6 weeks", "Severe pain not improved with rest and OTC medication", "Pain radiating down both legs", "Numbness, tingling, or weakness in legs", "Loss of bladder or bowel control (EMERGENCY — cauda equina syndrome)", "Pain after a fall or injury", "Pain with fever (possible infection)", "Unexplained weight loss with back pain (possible cancer)", "Pain at night that wakes you from sleep", "History of cancer with new back pain"],
    urgency: "low",
    category: "Musculoskeletal"
  },
  {
    name: "Anxiety Disorder",
    keywords: ["anxiety", "panic attack", "worry", "nervous", "anxious", "panic", "heart racing anxiety", "fear", "ghabrahat", "tension", "anxiety attack", "overthinking"],
    bodyAreas: ["head", "chest", "general"],
    description: "A group of mental health conditions characterized by excessive, persistent worry, fear, or apprehension that interferes with daily activities. Anxiety disorders are the most common mental health conditions globally, affecting approximately 45 million Indians. Types include Generalized Anxiety Disorder (GAD), Panic Disorder, Social Anxiety Disorder, Specific Phobias, and Separation Anxiety. Despite high prevalence, mental health carries significant stigma in India, leading to under-diagnosis and under-treatment.",
    causes: ["Brain chemistry imbalance (serotonin, norepinephrine, GABA dysregulation)", "Genetic predisposition (runs in families)", "Traumatic or stressful life events", "Childhood adversity or abuse", "Chronic medical conditions (thyroid disease, heart disease, diabetes)", "Chronic stress (work pressure, financial stress, academic pressure)", "Substance use (caffeine, alcohol, recreational drugs)", "Personality factors (perfectionism, need for control)", "Social and cultural pressures", "Sleep deprivation"],
    symptoms: ["Excessive, uncontrollable worrying", "Restlessness and feeling on edge", "Difficulty concentrating or mind going blank", "Irritability", "Muscle tension (especially neck, shoulders, jaw)", "Sleep disturbance (difficulty falling/staying asleep)", "Rapid heartbeat (palpitations)", "Sweating and trembling", "Shortness of breath or hyperventilation", "Chest tightness", "Dizziness and lightheadedness", "Nausea and stomach upset", "Dry mouth", "Frequent urination", "PANIC ATTACK symptoms: sudden intense fear, feeling of losing control or dying, chest pain, racing heart, trembling, shortness of breath, numbness, derealization — peaks within 10 minutes"],
    riskFactors: ["Family history of anxiety or mental health disorders", "Childhood trauma or adverse experiences", "Female gender (2x more likely)", "Chronic stress (workplace, relationship, financial)", "Personality type (shy, inhibited, or perfectionistic temperament)", "Other mental health conditions (depression, PTSD)", "Chronic illness", "Excessive caffeine or stimulant use", "Substance abuse", "Social isolation", "Academic or competitive pressure (common in Indian students)"],
    prevention: ["Regular physical exercise (30-60 min, 5 days/week — as effective as medication for mild anxiety)", "Mindfulness meditation (10-20 min daily)", "Adequate sleep (7-9 hours, consistent schedule)", "Limit caffeine (< 200mg/day) and avoid alcohol", "Maintain strong social connections", "Time management and setting realistic goals", "Practice saying 'no' to reduce overwhelm", "Journaling — write worries down", "Deep breathing techniques (4-7-8 breathing, box breathing)", "Yoga (especially Hatha yoga, Yin yoga)", "Limit social media exposure", "Seek professional help early — don't wait for crisis", "Progressive muscle relaxation"],
    homeRemedies: ["Deep breathing: 4-7-8 technique (inhale 4 sec, hold 7 sec, exhale 8 sec)", "Progressive muscle relaxation (tense and release each muscle group)", "Warm chamomile tea (mild natural anxiolytic)", "Ashwagandha supplement (adaptogen — evidence for reducing cortisol and anxiety)", "Lavender essential oil aromatherapy", "Meditation apps (Headspace, Calm, Insight Timer)", "Grounding techniques: 5-4-3-2-1 method (5 things you see, 4 touch, 3 hear, 2 smell, 1 taste)", "Journaling — worry journal and gratitude journal", "Regular walking in nature", "Limiting news and social media consumption", "Warm bath with Epsom salt", "Tulsi (holy basil) tea — adaptogenic", "Brahmi (Bacopa monnieri) — traditional Ayurvedic nervine", "Shankhpushpi — traditional anxiety remedy"],
    treatments: ["Cognitive Behavioral Therapy (CBT) — gold standard psychotherapy", "Exposure therapy (for specific phobias and social anxiety)", "Acceptance and Commitment Therapy (ACT)", "Mindfulness-Based Stress Reduction (MBSR)", "SSRIs: Escitalopram, Sertraline, Fluoxetine, Paroxetine (first-line medications)", "SNRIs: Venlafaxine, Duloxetine", "Buspirone (non-addictive anxiolytic)", "Benzodiazepines: Alprazolam, Clonazepam (short-term use ONLY — risk of dependence)", "Beta-blockers (Propranolol) for performance anxiety", "Pregabalin (for GAD)", "Combination of therapy + medication most effective", "Tele-mental health services increasingly available in India"],
    whenToSeeDoctor: ["Worry interferes with work, relationships, or daily functioning", "Anxiety causing physical symptoms (chest pain, digestive issues)", "Panic attacks occurring regularly", "Avoidance behavior limiting your life", "Using alcohol or substances to cope", "Sleep significantly disrupted", "Feeling depressed alongside anxiety", "Thoughts of self-harm or suicide (call AASRA: 9820466726)", "Anxiety in children affecting school performance"],
    urgency: "moderate",
    category: "Mental Health"
  },
  {
    name: "Depression (Major Depressive Disorder)",
    keywords: ["depression", "depressed", "sad", "hopeless", "loss of interest", "mental health", "suicidal", "no motivation", "udasi", "sadness", "feeling low", "worthless"],
    bodyAreas: ["head", "general"],
    description: "A common and serious mood disorder that causes persistent feelings of sadness, emptiness, and loss of interest in activities. It affects how you feel, think, and handle daily activities. Depression is NOT just 'feeling sad' — it is a medical condition involving changes in brain chemistry. It affects over 56 million Indians, yet fewer than 10% receive treatment due to stigma and lack of awareness. Depression is treatable, and with proper help, most people recover significantly.",
    causes: ["Brain chemistry imbalance (serotonin, norepinephrine, dopamine)", "Genetic predisposition (2-3x higher risk with family history)", "Traumatic or stressful life events (loss, abuse, major life changes)", "Chronic medical conditions (thyroid, diabetes, heart disease, chronic pain)", "Hormonal changes (postpartum, menopause, thyroid disorders)", "Certain medications (corticosteroids, interferon, some BP medications)", "Substance abuse (alcohol, drugs)", "Social isolation and loneliness", "Childhood adversity", "Chronic stress and burnout"],
    symptoms: ["Persistent sad, anxious, or 'empty' mood (most days, for at least 2 weeks)", "Loss of interest or pleasure in activities once enjoyed (anhedonia)", "Significant changes in appetite (increased or decreased) and weight", "Sleep disturbances — insomnia or hypersomnia (sleeping too much)", "Fatigue and loss of energy (everything feels exhausting)", "Feelings of worthlessness, excessive guilt, or self-blame", "Difficulty concentrating, remembering, or making decisions", "Psychomotor agitation or retardation (restlessness or slowed movement)", "Recurrent thoughts of death, suicidal thoughts, or suicide attempts", "Unexplained physical symptoms: headaches, digestive issues, body pain", "Social withdrawal and isolation", "Neglecting responsibilities and self-care", "Crying spells or emotional numbness"],
    riskFactors: ["Family history of depression", "Previous depressive episodes", "Female gender (2x more common in women)", "Major life changes, trauma, or loss", "Chronic illness or chronic pain", "Certain medications", "Substance abuse", "Social isolation", "Low socioeconomic status", "Perfectionism and self-critical personality", "Childhood abuse or neglect", "Postpartum period", "Caregiving burden"],
    prevention: ["Regular physical exercise (30 min daily — releases endorphins)", "Strong social connections and support network", "Adequate sleep (7-9 hours, consistent schedule)", "Stress management techniques (meditation, yoga, deep breathing)", "Limiting alcohol and avoiding drugs", "Pursuing meaningful activities and hobbies", "Setting realistic goals", "Practicing gratitude (daily gratitude journal)", "Volunteering and helping others", "Limiting social media (comparison triggers depression)", "Regular routine and structure", "Early intervention — seek help at first signs", "Building resilience through therapy (even without current depression)"],
    homeRemedies: ["Regular exercise — even a 30 min daily walk significantly helps", "Sunlight exposure (at least 15-20 min daily — boosts serotonin and vitamin D)", "Omega-3 fatty acids (fish oil, walnuts, flaxseeds)", "Maintain social connections — resist urge to isolate", "Meditation and mindfulness (even 10 min daily)", "Journaling — express thoughts and feelings", "Establish regular sleep schedule", "Ashwagandha (evidence for mood improvement)", "Saffron (kesar) — some research supports antidepressant effect", "St. John's Wort (only for mild depression, avoid with medications)", "Yoga (especially restorative yoga and yoga nidra)", "Music therapy and art therapy", "Turmeric (curcumin has anti-inflammatory and potential mood benefits)", "Set small, achievable daily goals", "Avoid alcohol and excessive caffeine"],
    treatments: ["Psychotherapy — most effective for mild-moderate depression:", "Cognitive Behavioral Therapy (CBT) — identifies and changes negative thought patterns", "Interpersonal Therapy (IPT)", "Behavioral Activation", "Mindfulness-Based Cognitive Therapy (MBCT) — prevents relapse", "SSRIs (first-line): Escitalopram, Sertraline, Fluoxetine, Paroxetine", "SNRIs: Venlafaxine, Duloxetine", "TCAs: Amitriptyline, Imipramine (older but effective)", "Bupropion (also helps with smoking cessation)", "Mirtazapine (helps with insomnia and appetite)", "Atypical antipsychotics as augmentation (Aripiprazole, Quetiapine)", "Combination therapy (medication + psychotherapy) — most effective", "Electroconvulsive Therapy (ECT) — for severe, treatment-resistant depression", "Transcranial Magnetic Stimulation (TMS)", "NOTE: Antidepressants take 2-6 weeks to show full effect"],
    whenToSeeDoctor: ["Symptoms lasting more than 2 weeks", "Difficulty functioning at work, school, or home", "Withdrawal from social activities and relationships", "Changes in sleep or appetite lasting more than 2 weeks", "Feelings of worthlessness or excessive guilt", "Loss of interest in activities once enjoyed", "IMMEDIATELY: thoughts of self-harm or suicide", "Substance use to cope", "HELPLINES: AASRA: 9820466726 (24/7), Vandrevala Foundation: 1860-2662-345, iCall: 9152987821, NIMHANS: 080-46110007"],
    urgency: "moderate",
    category: "Mental Health"
  },
  {
    name: "Typhoid Fever",
    keywords: ["typhoid", "typhoid fever", "salmonella", "contaminated water", "prolonged fever", "enteric fever", "typhoid test", "widal test"],
    bodyAreas: ["abdomen", "general"],
    description: "A life-threatening bacterial infection caused by Salmonella typhi, spread through contaminated food and water. India has one of the highest typhoid burdens globally with an estimated 4.5 million cases annually. It is particularly common in areas with poor sanitation and limited access to clean drinking water. Typhoid is treatable with antibiotics but drug-resistant strains are an increasing concern.",
    causes: ["Salmonella typhi bacteria", "Contaminated drinking water", "Food handled by infected person or washed with contaminated water", "Poor sanitation and sewage", "Fecal-oral transmission route", "Incubation period: 6-30 days (usually 8-14 days)"],
    symptoms: ["Sustained high fever (103-104°F/39-40°C) — gradually increasing over first week", "Headache (often severe)", "Abdominal pain and tenderness", "Constipation (early) or diarrhea (later)", "Weakness and fatigue", "Loss of appetite", "Rose spots (faint pink rash on chest/abdomen — in some cases)", "Enlarged spleen (splenomegaly) and liver (hepatomegaly)", "Coated tongue", "Relative bradycardia (pulse slower than expected for fever)", "Cough", "Body aches"],
    riskFactors: ["Drinking untreated/unboiled water", "Eating street food", "Poor hand hygiene", "Living in areas with inadequate sanitation", "Travel to endemic areas", "Close contact with infected person (carriers)", "Weakened immune system", "Young children and elderly"],
    prevention: ["Drink only boiled, filtered, or bottled water", "Wash hands thoroughly with soap before eating and after toilet", "Eat freshly cooked, hot food", "Avoid raw vegetables and unpeeled fruits from unknown sources", "Avoid street food (or ensure it's freshly cooked and hot)", "Typhoid vaccination (injectable Vi polysaccharide or oral Ty21a)", "Proper sewage disposal and sanitation", "Food handlers should maintain hygiene", "Wash fruits and vegetables with clean water", "Avoid ice from unknown sources"],
    homeRemedies: ["TYPHOID REQUIRES ANTIBIOTIC TREATMENT — consult doctor immediately", "Supportive care at home:", "Plenty of fluids — ORS, coconut water, buttermilk, boiled water", "Light, easily digestible food — khichdi, dal water, rice porridge (kanji), banana, boiled potatoes", "Complete bed rest", "Cold compress for high fever", "Apple cider vinegar — 1/2 tsp in water (hydration and electrolytes)", "Clove tea (antibacterial properties)", "Basil (tulsi) leaves boiled in water", "Honey with warm water", "Avoid high-fiber and spicy foods during illness", "Gradual return to normal diet after fever subsides"],
    treatments: ["Antibiotics (essential — must complete full course):", "Ceftriaxone (injection) — often first-line in India due to resistance", "Azithromycin — effective oral option", "Cefixime — oral cephalosporin", "Ciprofloxacin/Ofloxacin — where fluoroquinolone sensitivity confirmed", "Treatment duration: typically 10-14 days", "Supportive: IV fluids for dehydration", "Paracetamol for fever", "Surgery for intestinal perforation (rare complication)", "Drug-resistant typhoid (XDR): Azithromycin, Meropenem", "Carrier state treatment: high-dose Ciprofloxacin for 4 weeks"],
    whenToSeeDoctor: ["Fever lasting more than 3-4 days", "High fever not responding to paracetamol", "Severe abdominal pain", "Persistent vomiting unable to keep fluids down", "Blood in stool", "Severe diarrhea leading to dehydration", "Altered consciousness or confusion", "Abdominal distension (possible perforation — EMERGENCY)", "Fever after recent travel to endemic area"],
    urgency: "high",
    category: "Infectious Disease"
  },
  {
    name: "Kidney Stones (Nephrolithiasis)",
    keywords: ["kidney stone", "renal calculi", "kidney pain", "flank pain", "urine block", "stone in kidney", "nephrolithiasis", "pathri", "gurde ki pathri", "renal stone"],
    bodyAreas: ["abdomen", "back", "pelvis", "kidney"],
    description: "Hard mineral and salt deposits that form inside the kidneys. When stones travel through the urinary tract, they can cause excruciating pain (renal colic) — often described as one of the most intense pains a person can experience. India falls in the 'Stone Belt' with higher prevalence in northern and northwestern states (Rajasthan, Gujarat, Maharashtra, Punjab, Haryana, Delhi). About 12% of the Indian population is estimated to have kidney stones.",
    causes: ["Dehydration (most common cause — concentrated urine allows crystals to form)", "High dietary sodium/salt", "High animal protein diet", "High oxalate foods (spinach, chocolate, nuts, tea — in excess)", "Obesity", "Family history (genetic predisposition)", "Recurrent urinary tract infections (struvite stones)", "Metabolic conditions (hyperparathyroidism, gout, cystinuria)", "Certain medications (diuretics, antacids with calcium)", "Climate (hot, arid regions — 'Stone Belt' of India)", "Types: Calcium oxalate (80%), Uric acid, Struvite, Cystine"],
    symptoms: ["Severe, sharp pain in side and back (below ribs) — renal colic", "Pain radiating to lower abdomen, groin, and inner thigh", "Pain that comes in waves and fluctuates in intensity", "Painful urination (dysuria)", "Pink, red, brown, or cloudy urine (hematuria)", "Foul-smelling urine", "Nausea and vomiting", "Frequent urination or urge to urinate", "Small amounts of urine", "Fever and chills if infection present", "Restlessness — unable to find comfortable position", "Pain may be so severe it causes sweating and pallor"],
    riskFactors: ["Dehydration (not drinking enough water)", "Living in hot climate (India's Stone Belt)", "Family/personal history of kidney stones (50% recurrence within 5 years)", "High sodium diet", "High animal protein diet", "Obesity (BMI > 30)", "Digestive diseases (IBD, chronic diarrhea — affects calcium/oxalate absorption)", "Gastric bypass surgery", "Hyperparathyroidism", "Gout", "Recurrent UTIs", "Certain supplements (vitamin C in high doses, calcium without adequate water)"],
    prevention: ["Drink plenty of water — 2.5-3 liters daily (enough to produce 2L of urine)", "Urine should be light yellow/clear", "Reduce sodium intake (< 2,300 mg/day)", "Limit animal protein (reduce uric acid)", "Moderate oxalate intake (don't need to avoid completely, but pair with calcium-rich foods)", "Adequate dietary calcium (low calcium actually INCREASES stone risk)", "Eat citrus fruits (lemons, oranges — citrate prevents stones)", "Limit sugary drinks and sodas", "Maintain healthy weight", "Add lemon juice to water (citrate)", "Potassium citrate supplements if recommended by doctor", "Reduce tea consumption if oxalate stones"],
    homeRemedies: ["IMPORTANT: Large stones or stones with infection need medical treatment", "Lemon water — squeeze 1 lemon in water, drink 4-5 times daily (citric acid)", "Barley water (jau ka pani) — traditional Indian remedy, diuretic", "Coconut water — helps flush stones and provides potassium", "Kulth dal (horse gram) — soak overnight, boil, drink water (traditional stone remedy)", "Banana stem juice — traditional South Indian remedy", "Watermelon — natural diuretic, high water content", "Apple cider vinegar — 2 tbsp in warm water (citric acid)", "Pomegranate juice (antioxidant, reduces stone formation)", "Basil (tulsi) tea with honey — 1 tsp basil juice with honey", "Increase fluid intake significantly", "Warm compress on painful area", "Light activity and movement may help pass small stones", "Avoid excessive oxalate foods during stone episode"],
    treatments: ["Small stones (<5mm): Usually pass on their own with fluids and pain management", "Pain management: NSAIDs (Diclofenac, Ketorolac), opioids for severe pain", "Alpha-blockers (Tamsulosin) — relaxes ureter to help stone pass (medical expulsive therapy)", "ESWL (Extracorporeal Shock Wave Lithotripsy) — for stones 5-20mm, non-invasive", "Ureteroscopy (URS) with laser lithotripsy — for ureteric stones", "PCNL (Percutaneous Nephrolithotomy) — for large stones >20mm", "RIRS (Retrograde Intrarenal Surgery) — minimally invasive", "Stent placement for obstructed ureter", "Antibiotics if associated UTI", "Metabolic evaluation and prevention plan after first stone", "24-hour urine analysis to determine stone type"],
    whenToSeeDoctor: ["Severe pain that prevents sitting still or finding comfortable position", "Pain with nausea and persistent vomiting", "Pain with fever and chills (stone + infection — can be life-threatening)", "Blood in urine", "Difficulty passing urine or complete urinary blockage", "Pain not relieved by OTC pain medications", "Known stone not passing after 4-6 weeks", "Recurrent kidney stones (need metabolic evaluation)", "Single kidney with stone"],
    urgency: "high",
    category: "Urological"
  },
  {
    name: "Gastroenteritis (Stomach Flu / Food Poisoning)",
    keywords: ["stomach flu", "food poisoning", "vomiting", "diarrhea", "gastroenteritis", "stomach bug", "loose motion", "loose stools", "ulti", "dast", "pet kharab", "stomach infection", "food infection"],
    bodyAreas: ["abdomen", "general", "stomach"],
    description: "An intestinal infection causing inflammation of the stomach and intestines, leading to watery diarrhea, abdominal cramps, nausea, vomiting, and sometimes fever. It is extremely common in India, particularly during monsoon season and in areas with poor sanitation. Most cases resolve within a few days without treatment, but dehydration from fluid loss can be dangerous, especially in children and elderly.",
    causes: ["Viruses: Rotavirus (children), Norovirus (adults), Adenovirus", "Bacteria: Salmonella, E. coli, Shigella, Campylobacter, Vibrio cholerae", "Parasites: Giardia, Entamoeba histolytica (amoebiasis), Cryptosporidium", "Contaminated water and food", "Poor hygiene and sanitation", "Street food and unhygienic food preparation", "Contaminated fruits and raw vegetables", "Person-to-person contact"],
    symptoms: ["Watery diarrhea (non-bloody usually in viral, may be bloody in bacterial)", "Nausea and vomiting", "Abdominal cramps and pain", "Low-grade fever", "Headache", "Muscle aches and body pain", "Loss of appetite", "Dehydration signs: dry mouth, decreased urination, dark urine, dizziness, sunken eyes, no tears (children)", "Bloating", "Urgency to defecate"],
    riskFactors: ["Young children (especially under 5)", "Elderly (over 65)", "Weakened immune system", "Monsoon season in India", "Eating street food", "Drinking contaminated water", "Institutional settings (schools, hostels, hospitals)", "Travel (traveler's diarrhea)", "Poor sanitation", "Undercooked meat, seafood, or eggs"],
    prevention: ["Wash hands thoroughly with soap (20 seconds) before eating, after toilet", "Drink only boiled, filtered, or bottled water", "Cook food thoroughly (especially meat, seafood, eggs)", "Wash fruits and vegetables with clean water", "Avoid street food during monsoon season", "Store food properly (refrigerate within 2 hours)", "Separate raw and cooked foods", "Clean cooking surfaces and utensils", "Rotavirus vaccination for infants", "Avoid ice from unknown sources", "When traveling, eat freshly cooked hot food"],
    homeRemedies: ["ORS (Oral Rehydration Solution) — most important treatment for dehydration", "Homemade ORS: 6 level tsp sugar + 1/2 level tsp salt in 1 liter clean water", "BRAT diet: Banana, Rice, Applesauce, Toast (easily digestible)", "Coconut water — natural electrolyte replacement", "Rice water (kanji) — soothing and binding", "Ginger tea — anti-nausea", "Curd rice (dahi chawal) — probiotics help gut recovery", "Pomegranate juice", "Lemon water with salt and sugar", "Jeera (cumin) water — boil cumin in water, strain", "Mint (pudina) tea", "Avoid dairy (except curd), caffeine, alcohol, spicy and fatty foods", "Small, frequent sips of fluids rather than large amounts", "Rest", "Gradually reintroduce normal diet — start with light foods (khichdi, daliya)"],
    treatments: ["Oral Rehydration Therapy (ORT) — cornerstone of treatment", "ORS packets (available at pharmacies — dissolve in water as directed)", "IV fluids for severe dehydration", "Zinc supplements (20mg daily for 10-14 days) in children — WHO recommended", "Antiemetics (Ondansetron) for severe vomiting", "Antidiarrheal (Loperamide/Imodium) — adults only, avoid in bloody diarrhea or fever", "Probiotics (Saccharomyces boulardii, Lactobacillus) — may shorten duration", "Antibiotics ONLY if bacterial cause identified: Azithromycin, Ciprofloxacin, Metronidazole (for parasites)", "Racecadotril (antisecretory — reduces secretory diarrhea)", "DO NOT use antibiotics for viral gastroenteritis"],
    whenToSeeDoctor: ["Unable to keep fluids down for 24 hours", "Vomiting blood or coffee-ground vomit", "Bloody diarrhea", "Severe dehydration (very dry mouth, no urination 8+ hours, dizziness on standing, rapid heartbeat)", "Fever above 104°F (40°C)", "Symptoms lasting more than 3 days", "Severe abdominal pain", "Signs of dehydration in infants/children (no wet diapers 3+ hours, no tears, sunken fontanelle)", "Elderly person with diarrhea and vomiting", "Immunocompromised individuals"],
    urgency: "moderate",
    category: "Gastrointestinal"
  },
  {
    name: "Pneumonia",
    keywords: ["pneumonia", "lung infection", "chest infection", "difficulty breathing fever", "productive cough", "nimoniya", "lungs infection"],
    bodyAreas: ["chest", "lungs", "general"],
    description: "An infection that inflames the air sacs (alveoli) in one or both lungs. The air sacs may fill with fluid or pus, causing cough with phlegm, fever, chills, and difficulty breathing. Pneumonia is a leading cause of death in children under 5 in India and a significant cause of death in the elderly. It can range from mild to life-threatening and is most serious for infants, young children, people over 65, and those with weakened immune systems.",
    causes: ["Bacteria: Streptococcus pneumoniae (most common), Haemophilus influenzae, Mycoplasma pneumoniae, Klebsiella pneumoniae", "Viruses: Influenza, RSV, SARS-CoV-2, Adenovirus", "Fungi: Aspergillus, Pneumocystis (in immunocompromised)", "Aspiration (inhaling food, liquid, or vomit into lungs)", "Hospital-acquired pneumonia (HAP) — more resistant organisms", "Ventilator-associated pneumonia (VAP)"],
    symptoms: ["Chest pain when breathing or coughing (pleuritic)", "Cough with thick phlegm (yellow, green, or rust-colored)", "Fever, sweating, and shaking chills", "Shortness of breath and rapid breathing", "Fatigue and weakness", "Nausea, vomiting, or diarrhea", "Confusion (especially in elderly)", "Rapid pulse", "Lower-than-normal temperature (in older adults or weak immune system)", "Grunting (in children)", "Chest indrawing (children — ribs pull in with breathing)"],
    riskFactors: ["Age: under 2 or over 65", "Chronic lung disease (COPD, asthma, bronchiectasis)", "Smoking", "Weakened immune system (HIV, chemotherapy, organ transplant)", "Hospitalization (especially ICU)", "Heart disease", "Diabetes", "Malnutrition", "Recent respiratory infection (cold, flu)", "Difficulty swallowing (aspiration risk)", "Air pollution exposure"],
    prevention: ["Pneumococcal vaccination (PCV13 for children, PPSV23 for adults 65+)", "Annual influenza vaccination", "COVID-19 vaccination", "Good hand hygiene", "Don't smoke", "Get adequate sleep and exercise", "Eat nutritious food", "Manage chronic conditions", "Avoid close contact with people who have respiratory infections", "Oral hygiene (reduces aspiration pneumonia risk)"],
    homeRemedies: ["PNEUMONIA REQUIRES MEDICAL TREATMENT — antibiotics needed for bacterial pneumonia", "Supportive home care:", "Rest and adequate sleep", "Stay well-hydrated (warm fluids — soups, herbal teas, warm water)", "Steam inhalation (loosens mucus)", "Warm turmeric milk", "Honey with warm water (cough relief)", "Ginger and tulsi tea", "Saltwater gargle for throat irritation", "Use humidifier to moisten air", "Elevate head while sleeping", "Light, nutritious meals", "Avoid exposure to smoke and pollutants"],
    treatments: ["Community-acquired: Oral antibiotics (Amoxicillin, Azithromycin, Doxycycline, Levofloxacin)", "Severe: IV antibiotics (Ceftriaxone + Azithromycin)", "Hospital-acquired: Broad-spectrum antibiotics (Piperacillin-Tazobactam, Meropenem)", "Viral pneumonia: Supportive care, antivirals if indicated (Oseltamivir for influenza)", "Oxygen therapy", "Chest physiotherapy", "Bronchodilators (nebulized)", "Corticosteroids for severe cases", "Mechanical ventilation for respiratory failure", "Adequate nutrition and hydration"],
    whenToSeeDoctor: ["Difficulty breathing or rapid breathing", "Chest pain with breathing or coughing", "Persistent fever above 102°F (39°C)", "Persistent cough producing pus-like sputum", "Confusion (especially in elderly)", "Bluish lips or fingertips", "Symptoms worsening after initial cold/flu improvement", "Children: rapid breathing, chest indrawing, unable to drink, lethargic", "Elderly: any new confusion, falls, or decreased function with respiratory symptoms"],
    urgency: "high",
    category: "Respiratory"
  },
  {
    name: "Thyroid Disorders (Hypothyroidism & Hyperthyroidism)",
    keywords: ["thyroid", "hypothyroid", "hyperthyroid", "goiter", "tsh", "thyroid swelling", "weight gain thyroid", "weight loss thyroid", "thyroid problem", "thyroid gland", "t3", "t4"],
    bodyAreas: ["throat", "general", "neck"],
    description: "Conditions affecting the thyroid gland's ability to produce the right amount of thyroid hormones (T3 and T4). Hypothyroidism (underactive thyroid) occurs when the gland doesn't produce enough hormones, slowing metabolism. Hyperthyroidism (overactive thyroid) occurs when the gland produces too much, speeding metabolism. Thyroid disorders are extremely common in India, affecting approximately 42 million Indians, with women being 5-8 times more likely to be affected than men.",
    causes: ["HYPOTHYROIDISM: Hashimoto's thyroiditis (autoimmune — most common cause), Iodine deficiency (still relevant in parts of India), Thyroid surgery, Radiation therapy, Certain medications (Lithium, Amiodarone), Postpartum thyroiditis", "HYPERTHYROIDISM: Graves' disease (autoimmune — most common cause), Toxic multinodular goiter, Toxic adenoma, Thyroiditis, Excessive iodine intake", "Other: Thyroid nodules, Thyroid cancer, Pituitary gland disorders"],
    symptoms: ["HYPOTHYROIDISM: Fatigue and sluggishness, Weight gain (despite poor appetite), Cold intolerance, Dry skin and hair, Hair loss (including eyebrow thinning), Constipation, Muscle weakness and cramps, Depression and brain fog, Irregular or heavy periods, Slow heart rate, Puffy face and swelling, High cholesterol", "HYPERTHYROIDISM: Unexplained weight loss (despite increased appetite), Rapid/irregular heartbeat (palpitations), Anxiety and nervousness, Trembling hands, Heat intolerance and excessive sweating, Frequent bowel movements, Menstrual changes (lighter/irregular periods), Bulging eyes (Graves' ophthalmopathy), Enlarged thyroid (goiter), Difficulty sleeping, Muscle weakness, Irritability"],
    riskFactors: ["Female gender (5-8x higher risk)", "Age over 60", "Family history of thyroid disease", "Autoimmune disease (Type 1 diabetes, rheumatoid arthritis, celiac disease)", "History of radiation to neck/upper chest", "Previous thyroid surgery", "Pregnancy or recent delivery (postpartum thyroiditis)", "Iodine deficiency or excess", "Certain medications", "Smoking (increases Graves' disease risk)"],
    prevention: ["Adequate iodine intake through iodized salt (major prevention measure in India)", "Regular thyroid screening (especially women over 35, pregnant women, those with family history)", "TSH test as part of routine health checkup", "Manage stress (stress can trigger autoimmune thyroid disease)", "Avoid excessive soy intake (may interfere with thyroid function)", "Selenium-rich foods (Brazil nuts, eggs, fish)", "Avoid excessive iodine supplements", "Prenatal thyroid screening during pregnancy"],
    homeRemedies: ["THYROID DISORDERS REQUIRE MEDICAL MANAGEMENT — these are supportive measures:", "For HYPOTHYROIDISM: coconut oil (1 tbsp daily — medium-chain triglycerides), ashwagandha (may support thyroid function), Brazil nuts (selenium — 2-3 nuts daily), yoga (shoulder stand, fish pose — may stimulate thyroid), seaweed (natural iodine — in moderation), regular exercise (combats fatigue and weight gain), ginger tea, vitamin D-rich foods or supplements", "For HYPERTHYROIDISM: lemon balm tea (may inhibit thyroid hormone), cruciferous vegetables (broccoli, cauliflower — contain goitrogens), bugleweed tea, adequate calcium and vitamin D, stress management, avoid caffeine and stimulants", "GENERAL: regular exercise, balanced diet, adequate sleep, stress management through yoga and meditation"],
    treatments: ["HYPOTHYROIDISM: Levothyroxine (Thyronorm, Eltroxin) — lifelong daily medication, taken on empty stomach 30 min before breakfast, regular TSH monitoring every 6-8 weeks until stable then every 6-12 months", "HYPERTHYROIDISM: Anti-thyroid medications (Methimazole/Carbimazole, PTU), Beta-blockers for symptom control (Propranolol), Radioactive Iodine therapy (RAI) — destroys overactive thyroid tissue, Thyroid surgery (thyroidectomy) for large goiter or if medications fail", "Thyroid nodules: Regular monitoring with ultrasound, Fine-needle aspiration biopsy (FNAC) if suspicious, Surgery if cancerous", "Thyroid cancer: Surgery (thyroidectomy), Radioactive iodine therapy, Thyroid hormone suppression therapy"],
    whenToSeeDoctor: ["Unexplained weight changes (gain or loss)", "Persistent fatigue not explained by lifestyle", "Swelling or lump in neck", "Heart palpitations or rapid heartbeat", "Sensitivity to cold or heat", "Hair loss or skin changes", "Menstrual irregularities", "Mood changes (depression or anxiety)", "During pregnancy (thyroid problems affect fetal development)", "Family history of thyroid disease — get screened", "On thyroid medication but symptoms persisting"],
    urgency: "moderate",
    category: "Endocrine/Metabolic"
  },
  {
    name: "Skin Infections and Dermatitis",
    keywords: ["skin rash", "rash", "eczema", "dermatitis", "skin infection", "itching", "skin irritation", "hives", "skin allergy", "fungal infection", "ringworm", "daad", "khujli", "skin problem", "psoriasis", "acne", "pimples"],
    bodyAreas: ["skin", "general"],
    description: "A broad category of conditions causing inflammation, infection, or irritation of the skin. In India, skin diseases are among the most common reasons for outpatient visits due to the tropical climate, pollution, and environmental factors. Common conditions include eczema (atopic dermatitis), fungal infections (ringworm, tinea), bacterial infections (impetigo, cellulitis), allergic contact dermatitis, urticaria (hives), psoriasis, and acne.",
    causes: ["INFECTIONS: Bacterial (Staphylococcus, Streptococcus), Fungal (dermatophytes — ringworm, candida), Viral (herpes, warts, molluscum)", "INFLAMMATORY: Eczema/Atopic dermatitis (immune-mediated), Psoriasis (autoimmune), Contact dermatitis (irritant or allergic)", "ALLERGIC: Urticaria (hives), Drug reactions, Contact allergy to metals, latex, cosmetics", "ENVIRONMENTAL: Heat rash (prickly heat — very common in Indian summer), Sunburn, Insect bites", "OTHER: Acne (hormonal), Fungal infections (worsened by hot, humid climate in India)"],
    symptoms: ["Redness and inflammation", "Itching (pruritus) — can be intense", "Rash — may be flat, raised, bumpy, or blistered", "Dry, cracked, or scaly skin (eczema, psoriasis)", "Oozing or crusting", "Swelling", "Ring-shaped patches (ringworm/tinea)", "White or discolored patches", "Pus-filled bumps (bacterial infection, acne)", "Burning or stinging sensation", "Hives (raised, itchy welts)", "Thickened, leathery skin (chronic scratching)"],
    riskFactors: ["Hot, humid climate (promotes fungal growth)", "Poor hygiene", "Sharing personal items (towels, razors)", "Weakened immune system", "Diabetes (prone to skin infections)", "Family history of allergies or atopic conditions", "Occupational exposure to chemicals or irritants", "Tight-fitting synthetic clothing", "Excessive sweating", "Contact with animals (ringworm)", "Air pollution (aggravates eczema, acne)"],
    prevention: ["Maintain good personal hygiene — daily bath with mild soap", "Keep skin dry (especially skin folds)", "Wear loose, cotton clothing (especially in hot weather)", "Moisturize regularly (fragrance-free)", "Don't share personal items (towels, combs, razors)", "Use sunscreen (SPF 30+) for sun protection", "Avoid known allergens and irritants", "Manage blood sugar if diabetic", "Treat fungal infections promptly (prevent spread)", "Change socks and undergarments daily", "Avoid scratching (break itch-scratch cycle)", "Use anti-chafing powder in skin folds during summer"],
    homeRemedies: ["Aloe vera gel — soothing and anti-inflammatory (apply fresh gel directly)", "Coconut oil — natural moisturizer and antimicrobial", "Neem (neem) paste or neem water bath — antifungal, antibacterial", "Turmeric paste (haldi) — antiseptic and anti-inflammatory", "Tea tree oil (diluted) — antifungal for ringworm", "Oatmeal bath — soothing for eczema and itching", "Calamine lotion — for itching and rashes", "Apple cider vinegar (diluted 1:1 with water) — for fungal infections", "Tulsi (basil) paste — antimicrobial", "Sandalwood (chandan) paste — cooling and anti-inflammatory", "Multani mitti (Fuller's earth) — for acne and oily skin", "Cold compress for hives and allergic reactions", "Camphor (kapoor) with coconut oil — anti-itch"],
    treatments: ["BACTERIAL: Topical antibiotics (Mupirocin, Fusidic acid), Oral antibiotics (Cephalexin, Cloxacillin, Azithromycin)", "FUNGAL: Topical antifungals (Clotrimazole, Terbinafine, Ketoconazole cream), Oral antifungals (Fluconazole, Itraconazole, Terbinafine tablets) for extensive or nail infections", "ECZEMA: Moisturizers (emollients — multiple times daily), Topical corticosteroids (Hydrocortisone, Mometasone, Betamethasone — use as directed), Calcineurin inhibitors (Tacrolimus, Pimecrolimus), Antihistamines for itch", "PSORIASIS: Topical steroids, Vitamin D analogs (Calcipotriol), Coal tar, Methotrexate (severe), Biologics (severe)", "ACNE: Benzoyl peroxide, Retinoids (Adapalene, Tretinoin), Antibiotics (Clindamycin gel, Doxycycline oral), Isotretinoin (severe cystic acne)", "HIVES: Antihistamines (Cetirizine, Fexofenadine), Oral steroids (short course for severe), Epinephrine for anaphylaxis", "GENERAL: Emollients, Calamine lotion, Cold compresses"],
    whenToSeeDoctor: ["Rash that is painful, widespread, or rapidly spreading", "Rash with fever", "Signs of infection (increasing redness, warmth, pus, red streaks)", "Rash not improving after 1-2 weeks of home care", "Recurring skin problems", "Skin changes that look unusual or concerning (changing moles)", "Severe allergic reaction (hives with swelling of face/throat — EMERGENCY)", "Skin condition affecting quality of life or self-esteem", "Suspected sexually transmitted skin infection"],
    urgency: "low",
    category: "Dermatology"
  },
  {
    name: "Chikungunya",
    keywords: ["chikungunya", "joint pain fever", "mosquito joint", "chikungunya fever", "severe joint pain"],
    bodyAreas: ["joints", "general", "muscles"],
    description: "A viral disease transmitted by Aedes mosquitoes (same mosquitoes that spread dengue), causing fever and severe, debilitating joint pain. The name 'chikungunya' means 'to walk bent' in the Makonde language, referring to the stooped posture caused by severe joint pain. Common in India during and after monsoon season. Unlike dengue, chikungunya rarely fatal but the joint pain can persist for months or even years.",
    causes: ["Chikungunya virus (CHIKV — an alphavirus)", "Transmitted by Aedes aegypti and Aedes albopictus mosquito bites", "Mosquitoes bite during daytime", "Incubation period: 2-12 days (usually 3-7 days)"],
    symptoms: ["Sudden onset high fever (102-104°F)", "Severe, debilitating joint pain (polyarthralgia) — especially wrists, ankles, knees, fingers", "Joint swelling", "Muscle pain (myalgia)", "Headache", "Fatigue", "Maculopapular rash (appears 2-5 days after fever)", "Joint stiffness (especially morning)", "Nausea", "Eye pain and conjunctivitis", "POST-CHIKUNGUNYA: Joint pain can persist for MONTHS to YEARS (chronic arthralgia) in 30-40% of patients"],
    riskFactors: ["Living in tropical endemic areas", "Monsoon and post-monsoon season", "Stagnant water near home", "Urban and semi-urban areas", "Elderly (higher risk of severe disease and chronic joint pain)", "Neonates (mother-to-child transmission during delivery)"],
    prevention: ["Same as dengue prevention — vector control is key", "Eliminate standing water (breeding sites)", "Use mosquito repellent (DEET-based)", "Wear long-sleeved clothing", "Use mosquito nets (daytime sleeping)", "Screen windows and doors", "Use mosquito coils/vaporizers", "Community-level vector control measures", "No vaccine currently available"],
    homeRemedies: ["Rest (complete bed rest during acute phase)", "Plenty of fluids — ORS, coconut water, warm water", "Cold compress on swollen, painful joints", "Turmeric milk — anti-inflammatory", "Ginger tea — pain relief", "Papaya leaf juice (may help with recovery)", "Epsom salt bath for joint pain", "Castor oil massage on joints (warm)", "Giloy (Tinospora cordifolia) juice", "Ashwagandha for joint recovery", "Gentle range-of-motion exercises once fever subsides", "Use Paracetamol ONLY (avoid aspirin and ibuprofen initially)"],
    treatments: ["No specific antiviral treatment available", "Supportive care is mainstay", "Paracetamol for fever and pain", "NSAIDs (Naproxen, Ibuprofen) for joint pain — AFTER acute phase (after ruling out dengue co-infection)", "Rest and hydration", "Physiotherapy for chronic joint symptoms", "Hydroxychloroquine or Methotrexate for persistent joint inflammation (chronic cases)", "Corticosteroids for severe joint inflammation", "Physical rehabilitation"],
    whenToSeeDoctor: ["High fever with severe joint pain", "Joint pain preventing movement", "Symptoms not improving after 1 week", "Persistent joint pain after fever resolves", "Signs of dehydration", "Elderly patients with joint symptoms", "Pregnant women with fever", "Symptoms worsening (rule out dengue co-infection)"],
    urgency: "moderate",
    category: "Infectious Disease"
  },
  {
    name: "Jaundice / Hepatitis",
    keywords: ["jaundice", "yellow skin", "yellow eyes", "hepatitis", "liver", "bilirubin", "liver infection", "peeliya", "hepatitis a", "hepatitis b", "hepatitis c", "liver problem", "liver damage"],
    bodyAreas: ["abdomen", "eyes", "skin", "general", "liver"],
    description: "Jaundice is the yellowing of skin and whites of eyes caused by excess bilirubin in the blood, often indicating underlying liver problems. Hepatitis (liver inflammation) is a common cause. In India, viral hepatitis is a major public health concern with Hepatitis A and E (waterborne) being common due to sanitation issues, and Hepatitis B affecting approximately 40 million Indians (chronic carriers). Hepatitis C also has significant prevalence.",
    causes: ["HEPATITIS A: Contaminated water and food (fecal-oral route) — very common in India", "HEPATITIS B: Blood, sexual contact, mother-to-child transmission — chronic infection possible", "HEPATITIS C: Blood-to-blood contact (unsafe injections, blood transfusions, shared needles)", "HEPATITIS E: Contaminated water — common in India, dangerous in pregnancy", "Alcoholic liver disease", "Drug-induced liver injury (paracetamol overdose, certain medications)", "Autoimmune hepatitis", "Non-alcoholic fatty liver disease (NAFLD)", "Gallstones blocking bile duct", "Hemolytic anemia (increased RBC destruction)", "Newborn jaundice (physiological — common)"],
    symptoms: ["Yellow discoloration of skin and whites of eyes (icterus)", "Dark-colored urine (tea/cola colored)", "Pale or clay-colored stools", "Itching (pruritus)", "Right upper abdominal pain or tenderness", "Nausea, vomiting, loss of appetite", "Fatigue and weakness", "Fever (in acute hepatitis)", "Joint pain (in Hepatitis B)", "Unexplained weight loss", "Enlarged liver (hepatomegaly)", "Swollen abdomen (ascites — in advanced liver disease)", "Easy bruising or bleeding"],
    riskFactors: ["Contaminated water/food (Hep A, E)", "Unprotected sexual activity (Hep B)", "IV drug use or shared needles (Hep B, C)", "Unsafe blood transfusions or medical procedures", "Healthcare workers (needlestick injuries)", "Multiple sexual partners (Hep B)", "Chronic alcohol use", "Obesity and metabolic syndrome (NAFLD)", "Certain medications in excess", "Travel to endemic areas without vaccination", "Mother-to-child transmission (Hep B)"],
    prevention: ["Hepatitis A vaccine (2 doses — highly recommended in India)", "Hepatitis B vaccine (3 doses — part of India's Universal Immunization Programme)", "Drink only clean, boiled or filtered water", "Eat hygienically prepared food", "Practice safe sex (use condoms)", "Don't share needles, razors, or toothbrushes", "Ensure safe blood transfusions", "Use disposable needles for medical procedures", "Limit alcohol consumption", "Maintain healthy weight (prevent fatty liver)", "Avoid unnecessary medications (reduce liver burden)", "Wash hands before eating and after toilet"],
    homeRemedies: ["HEPATITIS REQUIRES MEDICAL EVALUATION AND MONITORING", "Supportive measures:", "Complete rest — avoid strenuous activity", "Light, easily digestible diet — avoid fats, fried food", "Sugarcane juice — traditional Indian remedy for jaundice", "Radish (mooli) juice and leaves — liver detox", "Barley water", "Lemon water with honey", "Papaya leaves — may have hepatoprotective properties", "Amla (Indian gooseberry) — rich in vitamin C", "Avoid alcohol completely", "Adequate hydration", "Bitter gourd (karela) juice", "Triphala powder — Ayurvedic liver tonic", "Turmeric milk", "Plenty of glucose and simple carbohydrates for energy"],
    treatments: ["HEPATITIS A: Supportive care (self-limiting, no specific treatment), rest, hydration, avoid alcohol", "HEPATITIS B: Acute — supportive care; Chronic — antiviral therapy: Tenofovir, Entecavir (long-term/lifelong), Peginterferon alfa (48-week course), regular monitoring (HBV DNA, liver function, fibroscan)", "HEPATITIS C: Direct-acting antivirals (DAAs) — >95% cure rate: Sofosbuvir + Daclatasvir, Sofosbuvir + Velpatasvir, Sofosbuvir + Ledipasvir; Treatment duration: 12-24 weeks", "HEPATITIS E: Supportive care (usually self-limiting), avoid in pregnancy (high mortality)", "Alcoholic hepatitis: Stop alcohol, Prednisolone, nutritional support", "NAFLD: Weight loss, exercise, manage metabolic risk factors", "Acute liver failure: ICU care, possible liver transplant", "Gallstone jaundice: ERCP and cholecystectomy"],
    whenToSeeDoctor: ["Yellow discoloration of skin or eyes", "Dark urine that persists", "Severe fatigue with loss of appetite", "Right-sided abdominal pain", "Persistent nausea and vomiting", "Fever with jaundice", "Itching with jaundice", "Known exposure to hepatitis", "Pregnant women with jaundice — URGENT (Hep E dangerous)", "Confusion or drowsiness with jaundice — EMERGENCY (liver failure)"],
    urgency: "high",
    category: "Hepatic/Gastrointestinal"
  },
  {
    name: "Conjunctivitis (Pink Eye)",
    keywords: ["pink eye", "conjunctivitis", "eye infection", "red eye", "eye discharge", "itchy eye", "watery eye", "aankh aana", "eye flu"],
    bodyAreas: ["eyes", "head"],
    description: "Inflammation or infection of the conjunctiva (transparent membrane lining the eyelid and covering the white part of the eyeball). Very contagious viral and bacterial forms spread rapidly through schools, offices, and communities. India sees periodic outbreaks, especially during monsoon season.",
    causes: ["Viral (adenovirus — most common, very contagious)", "Bacterial (Staphylococcus, Streptococcus, Haemophilus)", "Allergic (pollen, dust, pet dander)", "Chemical/irritant exposure", "Blocked tear duct (newborns)"],
    symptoms: ["Redness in one or both eyes", "Itchiness", "Gritty/sandy feeling in eye", "Discharge (watery in viral, thick yellow/green in bacterial)", "Tearing", "Crusting of eyelids (especially morning)", "Light sensitivity", "Swollen eyelids", "Blurred vision from discharge"],
    riskFactors: ["Close contact with infected person", "Allergies", "Contact lens use", "Exposure to irritants or chemicals", "Crowded environments (schools, offices)"],
    prevention: ["Wash hands frequently", "Don't touch or rub eyes", "Don't share towels, pillowcases, or eye cosmetics", "Replace eye cosmetics regularly", "Proper contact lens hygiene", "Disinfect surfaces", "Stay home if infected (highly contagious)"],
    homeRemedies: ["Cold compress on closed eyes (15-20 minutes)", "Warm compress for bacterial (helps loosen crusts)", "Rose water drops (cooling and soothing)", "Clean eyes with boiled and cooled water", "Honey water (diluted) — antibacterial", "Triphala eye wash (traditional)", "Chamomile tea bags (cooled) on eyes", "Artificial tears for comfort", "Avoid wearing contact lenses until resolved"],
    treatments: ["Viral: Self-limiting (7-14 days), artificial tears for comfort, cold compresses", "Bacterial: Antibiotic eye drops (Moxifloxacin, Ofloxacin, Ciprofloxacin, Tobramycin), Antibiotic ointment (Erythromycin)", "Allergic: Antihistamine drops (Olopatadine, Ketotifen), Mast cell stabilizers, Cold compresses, Oral antihistamines", "Avoid steroid drops unless prescribed by ophthalmologist"],
    whenToSeeDoctor: ["Intense eye pain", "Significant light sensitivity", "Blurred vision that doesn't clear with blinking", "Intense redness", "Symptoms not improving after 24-48 hours", "Thick purulent (pus) discharge", "In newborns — IMMEDIATELY (ophthalmia neonatorum)", "Immunocompromised patients", "Contact lens wearer with symptoms"],
    urgency: "low",
    category: "Ophthalmology"
  },
  {
    name: "Chickenpox (Varicella)",
    keywords: ["chickenpox", "chicken pox", "varicella", "itchy rash blisters", "pox", "chhoti mata"],
    bodyAreas: ["skin", "general"],
    description: "A highly contagious viral infection causing an itchy, blister-like rash. Mostly affects children but can be more severe in adults, pregnant women, and immunocompromised individuals.",
    causes: ["Varicella-zoster virus (VZV)", "Airborne spread and direct contact with rash", "Highly contagious — 90% infection rate in susceptible contacts", "Incubation: 14-16 days"],
    symptoms: ["Itchy blister-like rash (progresses: red spots → fluid-filled blisters → crusted scabs)", "Rash appears in crops (different stages simultaneously)", "Fever", "Fatigue", "Loss of appetite", "Headache", "Rash starts on face/trunk, spreads to limbs"],
    riskFactors: ["Not vaccinated", "No prior infection", "Close contact with infected person", "Weakened immune system", "Pregnancy (risk of complications)", "Adults (more severe than children)"],
    prevention: ["Varicella vaccine (2 doses)", "Avoid contact with infected persons", "Good hygiene", "Isolation of infected individuals until all lesions crusted"],
    homeRemedies: ["Calamine lotion for itching", "Cool oatmeal bath", "Neem leaf bath (antibacterial, soothing)", "Keep fingernails short (prevent scratching and infection)", "Baking soda paste on blisters", "Honey applied on blisters (healing)", "Cool wet compresses", "Loose cotton clothing", "Paracetamol for fever (AVOID aspirin in children — risk of Reye's syndrome)", "Adequate fluids and rest"],
    treatments: ["Supportive care for most children", "Antiviral: Acyclovir (within 24 hours of rash onset — especially for adults, pregnant women, immunocompromised)", "Valacyclovir (alternative)", "Calamine lotion for itching", "Antihistamines (Cetirizine, Hydroxyzine) for severe itching", "Paracetamol for fever (NOT aspirin)", "VZIG (Varicella-Zoster Immune Globulin) for high-risk exposed individuals"],
    whenToSeeDoctor: ["Rash spreads to eyes", "High fever above 102°F lasting more than 4 days", "Rash becomes very red, warm, or tender (secondary bacterial infection)", "Difficulty breathing", "Confusion or stiff neck", "Adults with chickenpox", "Pregnant women exposed or symptomatic", "Immunocompromised individuals", "Newborns with exposure"],
    urgency: "moderate",
    category: "Infectious Disease"
  },
  {
    name: "PCOD/PCOS (Polycystic Ovary Syndrome)",
    keywords: ["pcos", "pcod", "polycystic", "ovary cyst", "irregular periods", "period problem", "hormonal imbalance", "ovarian cyst", "infertility", "irregular menstruation"],
    bodyAreas: ["abdomen", "pelvis", "general"],
    description: "A common hormonal disorder affecting women of reproductive age, characterized by irregular menstrual periods, excess androgen (male hormone) levels, and polycystic ovaries (ovaries may contain many small follicles). PCOS affects 1 in 5 Indian women (20%) and is a leading cause of infertility. It is also associated with metabolic complications including insulin resistance, type 2 diabetes, and cardiovascular disease.",
    causes: ["Exact cause unknown — multifactorial", "Insulin resistance (excess insulin stimulates ovaries to produce androgens)", "Hormonal imbalance (excess androgens)", "Genetic predisposition", "Low-grade chronic inflammation", "Excess weight/obesity (worsens insulin resistance)", "Sedentary lifestyle"],
    symptoms: ["Irregular periods (oligomenorrhea) or absent periods (amenorrhea)", "Heavy bleeding during periods (menorrhagia)", "Excess facial and body hair growth (hirsutism)", "Acne (face, chest, upper back)", "Weight gain (especially around abdomen)", "Difficulty losing weight", "Thinning hair or male-pattern baldness", "Dark patches on skin (acanthosis nigricans) — neck, armpits, groin", "Multiple small cysts on ovaries (on ultrasound)", "Difficulty getting pregnant (anovulation)", "Mood changes, anxiety, depression"],
    riskFactors: ["Family history of PCOS", "Obesity", "Insulin resistance or type 2 diabetes", "Sedentary lifestyle", "South Asian ethnicity (higher prevalence)", "Family history of type 2 diabetes"],
    prevention: ["Maintain healthy weight", "Regular exercise (150 min/week — improves insulin sensitivity)", "Balanced diet low in refined carbohydrates", "Early diagnosis and management", "Manage stress", "Regular health screenings"],
    homeRemedies: ["Regular exercise — 30-45 min daily (walking, yoga, swimming)", "Anti-inflammatory diet: whole grains, fruits, vegetables, lean protein", "Reduce refined carbs and sugar", "Include cinnamon (dalchini) — improves insulin sensitivity", "Spearmint tea — may reduce androgens (2 cups daily)", "Fenugreek (methi) seeds — improves insulin action", "Flaxseeds — 1 tbsp ground daily (reduces androgens)", "Apple cider vinegar — 1 tbsp in water before meals", "Turmeric — anti-inflammatory", "Amla juice — vitamin C and antioxidants", "Manage stress through yoga and meditation", "Maintain regular sleep schedule", "Limit processed and fried foods"],
    treatments: ["Lifestyle modifications (first-line): Weight loss of 5-10% significantly improves symptoms", "Hormonal: Combined oral contraceptive pills (regulate periods, reduce androgens, improve acne)", "Metformin — improves insulin resistance", "Anti-androgens: Spironolactone (for hirsutism and acne)", "Clomiphene citrate or Letrozole — for ovulation induction (fertility treatment)", "Gonadotropin injections for fertility", "IVF for resistant infertility", "Hair removal: Laser therapy, electrolysis, Eflornithine cream", "Acne treatment: Retinoids, antibiotics, hormonal therapy", "Regular screening for diabetes, cardiovascular risk"],
    whenToSeeDoctor: ["Irregular or absent periods", "Difficulty getting pregnant after trying for 12 months", "Excess hair growth on face or body", "Unexplained weight gain", "Severe acne not responding to treatment", "Dark skin patches", "Regular screening if diagnosed — every 6-12 months"],
    urgency: "moderate",
    category: "Gynecology/Endocrine"
  }
];

const drugDatabase: DrugInfo[] = [
  {
    name: "Paracetamol",
    genericName: "Acetaminophen / Paracetamol",
    aliases: ["crocin", "dolo", "tylenol", "calpol", "acetaminophen", "dolo 650", "paracetamol 500"],
    category: "Analgesic / Antipyretic",
    uses: ["Fever reduction", "Mild to moderate pain relief (headache, toothache, body ache)", "Cold and flu symptoms", "Post-surgical pain"],
    dosage: "Adults: 500-1000mg every 4-6 hours. Maximum 4g (4000mg) per day. Children: 10-15mg/kg every 4-6 hours.",
    sideEffects: ["Generally well-tolerated at recommended doses", "Rare: Nausea, allergic skin reaction", "OVERDOSE (>4g/day): Severe liver damage, liver failure (potentially fatal)"],
    warnings: ["Do NOT exceed maximum daily dose (4g)", "Avoid with alcohol (increases liver toxicity risk)", "Check all medications — paracetamol is in many combination products", "Use with caution in liver disease", "Paracetamol overdose is a medical emergency"],
    interactions: ["Alcohol (increased liver risk)", "Warfarin (may increase bleeding risk)", "Isoniazid (increased liver toxicity)", "Carbamazepine"],
    pregnancy: "Generally considered safe in pregnancy (Category B). Preferred painkiller during pregnancy. Use lowest effective dose for shortest duration."
  },
  {
    name: "Ibuprofen",
    genericName: "Ibuprofen",
    aliases: ["brufen", "advil", "motrin", "ibugesic", "combiflam"],
    category: "NSAID (Non-Steroidal Anti-Inflammatory Drug)",
    uses: ["Pain relief (moderate)", "Inflammation reduction", "Fever", "Menstrual cramps", "Headache and migraine", "Arthritis", "Dental pain", "Muscle pain"],
    dosage: "Adults: 200-400mg every 4-6 hours. Maximum 1200mg/day (OTC) or 3200mg/day (prescribed). Take with food.",
    sideEffects: ["Stomach upset, nausea, heartburn", "Stomach ulcers and GI bleeding (with prolonged use)", "Dizziness, headache", "Kidney problems (with long-term use)", "Increased blood pressure", "Fluid retention", "Allergic reactions (rash, asthma exacerbation)"],
    warnings: ["Take with food to reduce stomach issues", "Avoid in last trimester of pregnancy", "Not recommended for dengue or chickenpox", "Avoid if history of stomach ulcers", "Use caution with kidney disease, heart disease, high BP", "Not for children under 6 months"],
    interactions: ["Aspirin (reduces aspirin's cardioprotective effect)", "Blood thinners (Warfarin — increased bleeding)", "ACE inhibitors and ARBs (reduced effectiveness, kidney risk)", "Lithium (increased levels)", "Methotrexate (increased toxicity)", "Other NSAIDs (increased side effects)"],
    pregnancy: "Avoid, especially in third trimester (can cause premature closure of ductus arteriosus). Use paracetamol instead."
  },
  {
    name: "Amoxicillin",
    genericName: "Amoxicillin",
    aliases: ["amoxil", "mox", "novamox", "amoxyclav", "augmentin"],
    category: "Antibiotic (Penicillin class)",
    uses: ["Bacterial infections: ear infections, sinusitis, pneumonia, UTI, skin infections, dental infections", "H. pylori eradication (with other drugs)", "Typhoid fever"],
    dosage: "Adults: 250-500mg every 8 hours or 500-875mg every 12 hours. Duration varies by infection (5-14 days). Complete full course.",
    sideEffects: ["Diarrhea (common)", "Nausea and vomiting", "Skin rash (especially with viral infections)", "Yeast infections (vaginal candidiasis)", "Allergic reaction (rare but can be severe)"],
    warnings: ["MUST complete full prescribed course (even if feeling better)", "Inform doctor of penicillin allergy", "Can reduce effectiveness of oral contraceptives", "Store properly", "NOT effective against viral infections (cold, flu)"],
    interactions: ["Methotrexate (increased toxicity)", "Warfarin (increased bleeding risk)", "Probenecid (increases amoxicillin levels)", "Oral contraceptives (may reduce effectiveness)"],
    pregnancy: "Generally considered safe in pregnancy (Category B). One of the preferred antibiotics during pregnancy."
  },
  {
    name: "Omeprazole",
    genericName: "Omeprazole",
    aliases: ["prilosec", "omez", "ocid", "pantoprazole", "pantop", "pan 40", "ppi"],
    category: "Proton Pump Inhibitor (PPI)",
    uses: ["GERD / Acid reflux", "Stomach ulcers", "Duodenal ulcers", "H. pylori infection (with antibiotics)", "Zollinger-Ellison syndrome", "Prevention of NSAID-induced ulcers"],
    dosage: "Adults: 20-40mg once daily, taken 30 minutes before breakfast. Duration: 4-8 weeks for healing, may be long-term for chronic GERD.",
    sideEffects: ["Headache", "Nausea, diarrhea, stomach pain", "Flatulence", "Long-term: vitamin B12 deficiency, magnesium deficiency, calcium absorption issues, increased fracture risk, C. difficile infection risk"],
    warnings: ["Take 30 minutes before first meal", "Long-term use (>1 year) should be reviewed periodically", "May mask symptoms of gastric cancer", "Increased risk of bone fractures with long-term use", "Rebound acid hypersecretion when stopping — taper gradually"],
    interactions: ["Clopidogrel (Omeprazole reduces effectiveness — use Pantoprazole instead)", "Methotrexate (increased levels)", "Certain antifungals (Ketoconazole — reduced absorption)", "HIV medications (some)"],
    pregnancy: "Category C. Use only if clearly needed. Discuss with doctor."
  },
  {
    name: "Metformin",
    genericName: "Metformin Hydrochloride",
    aliases: ["glucophage", "glycomet", "glyciphage", "obimet", "metformin 500", "metformin 1000"],
    category: "Antidiabetic (Biguanide)",
    uses: ["Type 2 diabetes (first-line medication)", "Prediabetes prevention", "PCOS (insulin resistance)", "Gestational diabetes (in some cases)"],
    dosage: "Start: 500mg once or twice daily with meals. Gradually increase to 1000-2000mg daily. Maximum: 2550mg/day. Always take with food.",
    sideEffects: ["GI effects (most common initially): nausea, diarrhea, bloating, metallic taste", "Vitamin B12 deficiency (long-term — supplement if needed)", "Lactic acidosis (very rare but serious)", "Weight loss (often beneficial)", "NO hypoglycemia when used alone"],
    warnings: ["Take with food to reduce GI side effects", "Stay hydrated", "Hold before contrast dye procedures (48 hours)", "Avoid in severe kidney disease, liver disease, heart failure", "Avoid excessive alcohol", "Report muscle pain, weakness, breathing difficulty (signs of lactic acidosis)", "Check B12 levels annually with long-term use"],
    interactions: ["Alcohol (increased lactic acidosis risk)", "Contrast dye (hold metformin)", "Cimetidine (increases metformin levels)", "Topiramate, Carbonic anhydrase inhibitors (increased lactic acidosis risk)"],
    pregnancy: "Category B. Increasingly used in gestational diabetes. Discuss with doctor."
  },
  {
    name: "Cetirizine",
    genericName: "Cetirizine Hydrochloride",
    aliases: ["zyrtec", "cetzine", "alerid", "allercet", "antihistamine", "levocetirizine", "xyzal"],
    category: "Antihistamine (Second-generation, non-drowsy)",
    uses: ["Allergic rhinitis (hay fever)", "Urticaria (hives)", "Allergic conjunctivitis", "Allergic skin reactions", "Insect bite reactions"],
    dosage: "Adults: 10mg once daily. Levocetirizine: 5mg once daily. Children 6-12: 5mg once or twice daily. Can take with or without food.",
    sideEffects: ["Drowsiness (less than first-generation but still possible)", "Dry mouth", "Headache", "Fatigue", "Dizziness", "Stomach pain (rare)"],
    warnings: ["May cause drowsiness — avoid driving until you know how it affects you", "Use caution with kidney disease (dose adjustment needed)", "Avoid alcohol (increases drowsiness)", "Not a substitute for epinephrine in anaphylaxis"],
    interactions: ["Alcohol (increased sedation)", "CNS depressants (increased drowsiness)", "Theophylline (may increase cetirizine levels)"],
    pregnancy: "Category B. Generally considered safe. Cetirizine and Loratadine are preferred antihistamines in pregnancy."
  },
  {
    name: "Azithromycin",
    genericName: "Azithromycin",
    aliases: ["zithromax", "azithral", "azee", "zpack", "z-pack"],
    category: "Antibiotic (Macrolide)",
    uses: ["Respiratory infections (pneumonia, bronchitis, sinusitis)", "Ear infections (otitis media)", "Typhoid fever", "Traveler's diarrhea", "Chlamydia and other STIs", "Skin infections"],
    dosage: "Typical: 500mg day 1, then 250mg days 2-5. Or 500mg daily for 3 days. Take 1 hour before or 2 hours after meals.",
    sideEffects: ["Nausea, vomiting, diarrhea, stomach pain (common)", "Headache", "Dizziness", "Rare: QT prolongation (heart rhythm issue)", "Rare: liver problems, hearing loss"],
    warnings: ["Complete full course as prescribed", "Report irregular heartbeat", "Take on empty stomach for better absorption (or with food if stomach upset)", "Inform doctor of heart conditions or QT prolongation history", "NOT effective against viral infections"],
    interactions: ["Antacids containing aluminum/magnesium (reduce absorption — take 2 hours apart)", "Warfarin (increased bleeding risk)", "Statins (increased risk of muscle problems)", "QT-prolonging drugs (increased risk of cardiac arrhythmia)"],
    pregnancy: "Category B. Generally considered safe when needed. Discuss with doctor."
  },
  {
    name: "Amlodipine",
    genericName: "Amlodipine Besylate",
    aliases: ["norvasc", "amlong", "amlokind", "stamlo", "amlopress"],
    category: "Calcium Channel Blocker (Antihypertensive)",
    uses: ["High blood pressure (hypertension)", "Angina (chest pain from heart disease)", "Coronary artery disease"],
    dosage: "Adults: Start 5mg once daily, may increase to 10mg daily. Elderly: Start 2.5mg. Take at same time each day.",
    sideEffects: ["Ankle/foot swelling (edema) — most common", "Dizziness", "Flushing and warmth", "Fatigue", "Palpitations", "Nausea", "Headache"],
    warnings: ["Don't stop suddenly (gradual reduction needed)", "Monitor blood pressure regularly", "Report significant swelling", "Use caution with liver disease", "May cause gum swelling (maintain dental hygiene)"],
    interactions: ["Simvastatin (limit simvastatin to 20mg/day)", "CYP3A4 inhibitors (Ketoconazole — increase amlodipine levels)", "Cyclosporine (increased cyclosporine levels)", "Grapefruit (may increase amlodipine levels)"],
    pregnancy: "Category C. Avoid in pregnancy if possible. Use alternatives like Labetalol, Methyldopa, or Nifedipine."
  }
];

const labTestDatabase: LabTest[] = [
  { name: "Complete Blood Count (CBC)", aliases: ["cbc", "blood count", "hemogram", "full blood count", "cbc test"], purpose: "Evaluates overall health and detects a wide range of disorders — anemia, infection, blood cancers, and more. Measures red blood cells, white blood cells, hemoglobin, hematocrit, and platelets.", normalRange: "Hemoglobin: Men 13-17 g/dL, Women 12-15 g/dL | WBC: 4,500-11,000/μL | Platelets: 150,000-400,000/μL | RBC: Men 4.5-5.5 million/μL, Women 4-5 million/μL | Hematocrit: Men 38-50%, Women 36-44%", highMeaning: "High WBC: Infection, inflammation, leukemia. High RBC: Dehydration, polycythemia. High Platelets: Infection, inflammation, iron deficiency, essential thrombocythemia.", lowMeaning: "Low Hb: Anemia (iron deficiency, B12 deficiency, chronic disease). Low WBC: Viral infection, bone marrow problems, autoimmune. Low Platelets: Dengue, viral infections, ITP, bone marrow disorders, medications.", preparation: "No special preparation needed. Fasting not required.", frequency: "Annually as part of routine checkup. More often if monitoring a condition." },
  { name: "Blood Glucose (Fasting & Postprandial)", aliases: ["blood sugar", "fasting sugar", "fbs", "rbs", "ppbs", "glucose test", "sugar test", "fasting glucose", "random blood sugar"], purpose: "Measures blood sugar levels to screen for, diagnose, and monitor diabetes and prediabetes.", normalRange: "Fasting: 70-99 mg/dL (Normal), 100-125 mg/dL (Prediabetes), ≥126 mg/dL (Diabetes) | Postprandial (2-hr): <140 mg/dL (Normal), 140-199 (Prediabetes), ≥200 (Diabetes) | Random: <200 mg/dL with symptoms = Diabetes | HbA1c: <5.7% (Normal), 5.7-6.4% (Prediabetes), ≥6.5% (Diabetes)", highMeaning: "Diabetes mellitus, prediabetes, stress response, Cushing's syndrome, pancreatitis, medications (steroids).", lowMeaning: "Hypoglycemia: Excess insulin, medication effect, liver disease, adrenal insufficiency, insulinoma. Symptoms: sweating, shakiness, confusion, rapid heartbeat.", preparation: "Fasting test: No food/drink (except water) for 8-12 hours before. Postprandial: Test 2 hours after eating. HbA1c: No fasting needed.", frequency: "Annually after age 35. Every 3 months (HbA1c) if diabetic. Fasting + PP if monitoring diabetes." },
  { name: "Lipid Profile", aliases: ["cholesterol", "lipid panel", "cholesterol test", "ldl", "hdl", "triglycerides", "lipid profile"], purpose: "Measures fats and fatty substances in blood to assess cardiovascular disease risk.", normalRange: "Total Cholesterol: <200 mg/dL (desirable) | LDL (bad): <100 mg/dL (optimal), <130 (near optimal) | HDL (good): >40 mg/dL (men), >50 mg/dL (women), >60 (protective) | Triglycerides: <150 mg/dL (normal) | VLDL: <30 mg/dL", highMeaning: "High LDL: Increased risk of heart attack and stroke, atherosclerosis. High Triglycerides: Risk of pancreatitis (if >500), metabolic syndrome. High Total Cholesterol: Cardiovascular risk.", lowMeaning: "Low HDL: Increased cardiovascular risk. Very low cholesterol: Malnutrition, liver disease, hyperthyroidism.", preparation: "Fasting for 9-12 hours before test. Water is allowed. Avoid alcohol 24 hours before.", frequency: "Every 5 years for adults. Annually if risk factors present or on cholesterol medication." },
  { name: "Thyroid Function Tests (TFT)", aliases: ["thyroid test", "tsh", "t3", "t4", "thyroid panel", "thyroid function", "tsh test"], purpose: "Evaluates thyroid gland function. TSH is the most important screening test for thyroid disorders.", normalRange: "TSH: 0.4-4.0 mIU/L (some labs: 0.5-5.0) | Free T4: 0.8-1.8 ng/dL | Free T3: 2.3-4.2 pg/mL | Total T4: 5-12 μg/dL | Total T3: 80-200 ng/dL", highMeaning: "High TSH: Hypothyroidism (underactive thyroid). High T3/T4: Hyperthyroidism, thyroiditis, Graves' disease.", lowMeaning: "Low TSH: Hyperthyroidism (overactive thyroid), excess thyroid medication. Low T3/T4: Hypothyroidism, pituitary problems, severe illness.", preparation: "Early morning test preferred (TSH has diurnal variation). If on thyroid medication, take it after the blood draw. No fasting required.", frequency: "Screen women over 35, pregnant women, those with symptoms. Every 6-8 weeks when adjusting medication, then every 6-12 months when stable." },
  { name: "Liver Function Tests (LFT)", aliases: ["liver test", "lft", "liver function", "sgpt", "sgot", "alt", "ast", "bilirubin", "liver panel", "liver enzyme"], purpose: "Assesses liver health and function. Measures enzymes, proteins, and bilirubin to detect liver damage, inflammation, or disease.", normalRange: "ALT (SGPT): 7-56 U/L | AST (SGOT): 10-40 U/L | ALP: 44-147 U/L | Total Bilirubin: 0.1-1.2 mg/dL | Direct Bilirubin: 0-0.3 mg/dL | Albumin: 3.5-5.5 g/dL | Total Protein: 6-8.3 g/dL | GGT: 9-48 U/L", highMeaning: "High ALT/AST: Liver cell damage (hepatitis, fatty liver, alcohol, medications, cirrhosis). High Bilirubin: Jaundice, liver disease, bile duct obstruction, hemolysis. High ALP: Bile duct obstruction, bone disease, liver disease. High GGT: Alcohol abuse, liver disease.", lowMeaning: "Low Albumin: Liver disease (reduced production), kidney disease (loss), malnutrition, chronic illness.", preparation: "Fasting for 10-12 hours may be recommended. Avoid alcohol 24 hours before. Inform doctor of all medications.", frequency: "Annually in general health check. More frequently if on hepatotoxic medications, liver disease, heavy alcohol use." },
  { name: "Kidney Function Tests (KFT/RFT)", aliases: ["kidney test", "kft", "rft", "creatinine", "urea", "bun", "renal function", "kidney panel", "egfr"], purpose: "Evaluates kidney function and detects kidney disease or damage. Critical for patients with diabetes, hypertension, or on nephrotoxic medications.", normalRange: "Creatinine: Men 0.7-1.3 mg/dL, Women 0.6-1.1 mg/dL | BUN (Blood Urea Nitrogen): 7-20 mg/dL | Urea: 15-40 mg/dL | eGFR: >90 mL/min (Normal), 60-89 (Mild decrease), 30-59 (Moderate), 15-29 (Severe), <15 (Kidney failure) | Uric Acid: Men 3.4-7.0 mg/dL, Women 2.4-6.0 mg/dL", highMeaning: "High Creatinine/BUN: Kidney dysfunction, dehydration, high-protein diet, kidney stones, certain medications. High Uric Acid: Gout, kidney stones, kidney disease.", lowMeaning: "Low Creatinine: Low muscle mass, severe liver disease. Low BUN: Malnutrition, liver disease.", preparation: "Fasting for 8-12 hours. Stay hydrated. Inform doctor of all medications.", frequency: "Annually for adults. Every 3-6 months for diabetics, hypertensives, or those with kidney disease." },
  { name: "HbA1c (Glycated Hemoglobin)", aliases: ["hba1c", "a1c", "glycated hemoglobin", "glycosylated hemoglobin", "average sugar", "3 month sugar"], purpose: "Measures average blood sugar over the past 2-3 months. The most important long-term diabetes monitoring test. Does not require fasting.", normalRange: "Normal: <5.7% | Prediabetes: 5.7-6.4% | Diabetes: ≥6.5% | Target for diabetics: <7% (individualized)", highMeaning: "Poor blood sugar control over past 2-3 months. Increased risk of diabetic complications (kidney, eye, nerve damage).", lowMeaning: "Very low (<4%): May indicate frequent hypoglycemia, hemolytic anemia, blood loss, or blood disorders.", preparation: "No fasting required. Can be done at any time of day.", frequency: "Every 3 months for diabetics. Twice yearly if well-controlled. Once yearly as screening for at-risk individuals." },
  { name: "Vitamin D", aliases: ["vitamin d", "vitamin d3", "25-hydroxyvitamin d", "vit d", "vitamin d test", "sunshine vitamin"], purpose: "Measures vitamin D levels. Vitamin D deficiency is extremely common in India (70-90% of population is deficient) despite abundant sunshine, due to indoor lifestyles, dark skin, and limited dietary sources.", normalRange: "Sufficient: 30-100 ng/mL | Insufficient: 20-29 ng/mL | Deficient: <20 ng/mL | Severely Deficient: <10 ng/mL", highMeaning: "Toxicity (very rare): >100 ng/mL. Symptoms: nausea, vomiting, weakness, kidney problems. Usually from excessive supplementation.", lowMeaning: "Vitamin D deficiency: Bone pain, muscle weakness, fatigue, depression, frequent infections, osteoporosis risk, rickets in children, increased risk of autoimmune diseases, cardiovascular disease.", preparation: "No fasting needed. No special preparation.", frequency: "Once if never tested. Then annually if supplementing. Every 3-6 months if correcting severe deficiency." },
  { name: "Vitamin B12", aliases: ["vitamin b12", "b12", "cobalamin", "vit b12", "b12 test"], purpose: "Measures vitamin B12 levels. Deficiency is very common in India due to predominantly vegetarian diet. B12 is essential for nerve function, red blood cell formation, and DNA synthesis.", normalRange: "Normal: 200-900 pg/mL | Borderline: 200-300 pg/mL | Deficient: <200 pg/mL", highMeaning: "Usually from supplementation (not harmful). Rarely: liver disease, kidney disease, certain blood cancers.", lowMeaning: "Deficiency: Fatigue, weakness, anemia (megaloblastic), numbness/tingling in hands and feet (neuropathy), balance problems, cognitive issues (memory, confusion), depression, mouth sores, glossitis (sore tongue). Can cause irreversible nerve damage if untreated.", preparation: "Fasting for 6-8 hours may be recommended. Inform doctor of supplements.", frequency: "Include in annual health check, especially for vegetarians/vegans, elderly, and those on metformin or PPIs." },
  { name: "Urine Routine & Microscopy", aliases: ["urine test", "urine routine", "urinalysis", "urine analysis", "urine rm", "urine examination"], purpose: "Analyzes physical, chemical, and microscopic properties of urine. Screens for UTI, kidney disease, diabetes, liver disease, and other conditions.", normalRange: "Color: Pale yellow to amber | pH: 4.5-8.0 | Specific Gravity: 1.005-1.030 | Protein: Negative | Glucose: Negative | Blood: Negative | WBC: 0-5/HPF | RBC: 0-2/HPF | Bacteria: Negative | Casts: Negative", highMeaning: "Protein: Kidney disease, UTI. Glucose: Diabetes. Blood: UTI, kidney stones, cancer. WBC: Infection. Bacteria: UTI.", lowMeaning: "Low specific gravity: Excessive water intake, kidney disease (inability to concentrate urine).", preparation: "Midstream clean-catch sample. Morning first void is ideal. Avoid contamination.", frequency: "Annually. More often if diabetic, having kidney problems, or UTI symptoms." }
];

const medicalTopics: Record<string, { title: string; content: string }> = {
  "blood pressure": {
    title: "Understanding Blood Pressure — Complete Guide",
    content: `**Blood Pressure** is the force of blood pushing against the walls of your arteries as your heart pumps blood. It is measured in millimeters of mercury (mmHg) and recorded as two numbers: systolic (when heart beats) over diastolic (when heart rests).

**Blood Pressure Categories:**
| Category | Systolic | Diastolic |
|---|---|---|
| Normal | Less than 120 | Less than 80 |
| Elevated | 120-129 | Less than 80 |
| High (Stage 1) | 130-139 | 80-89 |
| High (Stage 2) | 140+ | 90+ |
| Hypertensive Crisis | Higher than 180 | Higher than 120 |

**How to Measure Correctly:**
- Rest for 5 minutes before measuring
- Sit with back supported, feet flat on floor
- Arm supported at heart level
- Don't talk during measurement
- Take 2-3 readings, 1 minute apart
- Measure at the same time each day

**Lifestyle Management (DASH Approach):**
- **D**ietary changes: Reduce sodium (<2,300mg/day), eat fruits, vegetables, whole grains
- **A**ctivity: 150 minutes of moderate exercise weekly (brisk walking, cycling, swimming)
- **S**tress management: Meditation, yoga, deep breathing, adequate sleep
- **H**abits: Quit smoking, limit alcohol, maintain healthy weight

**Common BP Medications:**
- ACE Inhibitors: Enalapril, Ramipril
- ARBs: Telmisartan, Losartan
- Calcium Channel Blockers: Amlodipine
- Diuretics: Hydrochlorothiazide
- Beta-blockers: Atenolol, Metoprolol

**Indian Context:** Hypertension affects approximately 30% of India's adult population. High salt intake in Indian diets and increasing urbanization are major contributors. Regular monitoring and lifestyle changes are the most effective prevention strategies.`
  },
  "diabetes": {
    title: "Understanding Diabetes — Complete Guide",
    content: `**Diabetes Mellitus** is a group of chronic metabolic diseases characterized by elevated blood sugar levels due to problems with insulin production or function.

**Types of Diabetes:**

**Type 1 Diabetes (5-10% of cases)**
- Autoimmune destruction of insulin-producing beta cells
- Usually diagnosed in childhood/adolescence
- Requires lifelong insulin therapy
- Not preventable

**Type 2 Diabetes (90-95% of cases)**
- Body becomes resistant to insulin OR doesn't produce enough
- Strongly linked to lifestyle factors
- Can be prevented or delayed with lifestyle changes
- Most common in India

**Gestational Diabetes**
- Develops during pregnancy
- Increases risk of Type 2 later in life
- Managed with diet, exercise, sometimes insulin

**Key Numbers to Know:**
| Test | Normal | Prediabetes | Diabetes |
|---|---|---|---|
| Fasting Blood Sugar | 70-99 mg/dL | 100-125 mg/dL | ≥126 mg/dL |
| Post-meal (2hr) | <140 mg/dL | 140-199 mg/dL | ≥200 mg/dL |
| HbA1c | <5.7% | 5.7-6.4% | ≥6.5% |

**Diabetes-Friendly Indian Diet:**
- **Replace:** White rice → Brown rice, millets (ragi, jowar, bajra)
- **Include:** Dal, rajma, chana, vegetables, salads with every meal
- **Avoid:** Maida products, sugary drinks, fruit juices, sweets
- **Smart swaps:** Jaggery (small amounts) instead of sugar, roasted snacks instead of fried
- **Portion control:** Use smaller plates, fill half with vegetables
- **Timing:** Regular meal times, don't skip meals

**Complications to Watch For:**
- **Eyes:** Diabetic retinopathy (annual eye exam)
- **Kidneys:** Diabetic nephropathy (regular urine albumin and creatinine tests)
- **Nerves:** Diabetic neuropathy (numbness, tingling in feet)
- **Heart:** Cardiovascular disease (BP and cholesterol monitoring)
- **Feet:** Diabetic foot (daily foot inspection, proper footwear)

**Indian Government Programs:** Ayushman Bharat scheme covers diabetes treatment at empaneled hospitals.`
  },
  "first aid": {
    title: "Essential First Aid Guide — Complete Reference",
    content: `**First Aid Knowledge Can Save Lives**

**CPR (Cardiopulmonary Resuscitation):**
- Check responsiveness — tap and shout
- Call 112 (All Emergency) or 108 (Ambulance)
- Start chest compressions: Push hard and fast in center of chest
- 30 compressions, 2 rescue breaths (if trained)
- Rate: 100-120 compressions per minute
- Depth: At least 2 inches
- Continue until help arrives

**Choking — Adult:**
- Can the person cough? Encourage coughing
- Unable to cough/breathe: Perform Heimlich Maneuver
- Stand behind, wrap arms around waist
- Place fist above navel, below ribcage
- Quick upward thrusts until object dislodges
- If unconscious: Call 112, start CPR

**Burns:**
- Cool under running water for 10-20 minutes (NOT ice)
- Remove jewelry/clothing (unless stuck to burn)
- Cover with clean, non-fluffy material
- Do NOT apply: butter, toothpaste, ice, oils
- Seek medical help for burns larger than your palm, facial burns, chemical/electrical burns

**Bleeding (Severe):**
- Apply firm, direct pressure with clean cloth
- Don't remove cloth — add more layers if blood soaks through
- Elevate the injured limb above heart level
- Apply tourniquet only if life-threatening and trained
- Call 108 for ambulance

**Fractures:**
- Immobilize the injured area — don't try to realign
- Apply ice pack wrapped in cloth
- Support with padding, splint, or sling
- Seek medical help — X-ray needed

**Snake Bite:**
- Keep the person calm and still
- Remove jewelry near bite area
- Immobilize the bitten limb
- Do NOT: cut the wound, suck venom, apply tourniquet, apply ice
- Rush to nearest hospital with anti-venom
- Try to remember snake appearance (don't chase it)

**Heatstroke (Indian Summers — Critical):**
- Move person to shade/cool area
- Remove excess clothing
- Cool with water, fan, wet cloths
- Apply ice packs to neck, armpits, groin
- Give small sips of cool water if conscious
- Call 108 immediately
- Fan continuously

**Drowning:**
- Call for help immediately
- Don't enter water unless trained
- Throw flotation device or extend object
- If rescuing: approach from behind
- Once on land: Check breathing, start CPR if needed

**Poisoning:**
- Call Poison Control or 112
- Do NOT induce vomiting (unless specifically instructed)
- Note what was ingested, how much, and when
- If chemical on skin: Remove contaminated clothing, flush with water
- If inhaled: Move to fresh air

**Emergency Numbers (India):**
- All Emergency: **112**
- Ambulance: **108**
- Police: **100**
- Fire: **101**
- Women Helpline: **1091**
- Child Helpline: **1098**
- Poison Control: **1066**
- Health Helpline: **104**`
  },
  "nutrition": {
    title: "Nutrition and Healthy Eating — Indian Diet Guide",
    content: `**Building a Balanced Indian Diet**

**Daily Nutritional Requirements (Adults):**
- Calories: 1,800-2,400 (women), 2,200-3,000 (men) — varies by activity level
- Protein: 0.8-1g per kg body weight (higher for athletes, pregnant women)
- Fiber: 25-30g daily
- Water: 2.5-3.5 liters daily

**Balanced Indian Meal Plate:**
- **50% Vegetables and fruits** (salad, sabzi, raita)
- **25% Whole grains** (roti, brown rice, millets)
- **25% Protein** (dal, paneer, chicken, fish, eggs, beans)
- **Small portion** of healthy fats (ghee, nuts, seeds)

**Superfoods Available in India:**
- **Turmeric (Haldi):** Curcumin — powerful anti-inflammatory, antioxidant
- **Amla (Indian Gooseberry):** Highest natural source of Vitamin C
- **Moringa (Drumstick leaves):** Rich in iron, calcium, vitamins
- **Ragi (Finger Millet):** Excellent calcium and iron source
- **Flaxseeds (Alsi):** Omega-3 fatty acids, fiber
- **Coconut:** MCTs, antimicrobial properties
- **Curry Leaves (Kadi Patta):** Iron, antioxidants, helps diabetes
- **Tulsi (Holy Basil):** Adaptogen, immune booster
- **Ashwagandha:** Stress reducer, energy booster
- **Ghee (clarified butter):** Fat-soluble vitamins, butyrate (in moderation)

**Vitamins and Minerals — Indian Sources:**
| Nutrient | Indian Food Sources | Deficiency Signs |
|---|---|---|
| Iron | Spinach, jaggery, dates, ragi, red meat, lentils | Fatigue, pale skin, weakness |
| Vitamin D | Sunlight (15-20 min), fortified milk, eggs, fish | Bone pain, fatigue, weak immunity |
| Calcium | Milk, curd, paneer, ragi, sesame, broccoli | Weak bones, muscle cramps |
| Vitamin B12 | Dairy, eggs, fish, fortified cereals | Numbness, fatigue, anemia |
| Folic Acid | Leafy greens, lentils, chickpeas, beetroot | Anemia (especially in pregnancy) |
| Zinc | Pumpkin seeds, chickpeas, cashews, milk | Weak immunity, hair loss |
| Omega-3 | Fish (salmon, mackerel), flaxseeds, walnuts | Dry skin, poor memory, joint pain |

**Healthy Eating Tips:**
- Cook at home as much as possible
- Use less oil — switch to cold-pressed oils
- Add lemon to meals (enhances iron absorption)
- Include seasonal fruits and vegetables
- Reduce sugar and refined carbohydrates (maida)
- Eat fermented foods (idli, dosa, curd, kanji) for gut health
- Don't skip breakfast
- Practice mindful eating — eat slowly, chew well
- Limit processed and packaged foods
- Read nutrition labels before buying`
  },
  "mental health": {
    title: "Mental Health Awareness — Complete Guide",
    content: `**Mental Health is as Important as Physical Health**

**Mental Health in India:**
- 150 million Indians need mental health care
- Less than 30 million seek help
- India has only 9,000 psychiatrists for 1.4 billion people
- Stigma remains the biggest barrier to treatment
- Mental health conditions are MEDICAL conditions — not weakness

**Common Mental Health Conditions:**

**Depression**
- Persistent sadness, loss of interest (2+ weeks)
- Fatigue, sleep changes, appetite changes
- Feelings of worthlessness, difficulty concentrating
- Thoughts of death or suicide
- Treatment: CBT therapy + medication (SSRIs) — highly effective

**Anxiety Disorders**
- Excessive worry interfering with daily life
- Panic attacks: sudden intense fear, racing heart, shortness of breath
- Social anxiety: intense fear of social situations
- Treatment: CBT, exposure therapy, SSRIs, relaxation techniques

**PTSD (Post-Traumatic Stress Disorder)**
- After experiencing/witnessing traumatic event
- Flashbacks, nightmares, severe anxiety
- Avoidance, emotional numbness
- Treatment: Trauma-focused CBT, EMDR therapy

**OCD (Obsessive-Compulsive Disorder)**
- Unwanted, recurring thoughts (obsessions)
- Repetitive behaviors (compulsions): washing, checking, counting
- Treatment: ERP therapy (Exposure and Response Prevention), SSRIs

**Self-Care Strategies:**
1. **Exercise regularly** — 30 min daily (as effective as mild antidepressants)
2. **Sleep hygiene** — consistent schedule, 7-9 hours, dark quiet room
3. **Mindfulness meditation** — apps like Headspace, Calm, Insight Timer
4. **Social connections** — maintain relationships, join communities
5. **Limit social media** — screen time correlates with anxiety/depression
6. **Hobbies and creativity** — painting, music, gardening, cooking
7. **Yoga and pranayama** — evidence-based for anxiety and depression
8. **Journaling** — write thoughts and feelings
9. **Nature exposure** — spending time outdoors
10. **Gratitude practice** — write 3 things you're grateful for daily

**When to Seek Professional Help:**
- Symptoms lasting more than 2 weeks
- Difficulty functioning at work, school, or home
- Relationship problems due to mental health
- Using substances to cope
- Thoughts of self-harm or suicide — SEEK HELP IMMEDIATELY

**Mental Health Helplines (India) — Free, Confidential:**
- **AASRA:** 9820466726 (24/7 suicide prevention)
- **Vandrevala Foundation:** 1860-2662-345 (24/7, multilingual)
- **iCall (TISS):** 9152987821 (Mon-Sat, 8am-10pm)
- **NIMHANS Helpline:** 080-46110007
- **Snehi:** 044-24640050 (Chennai)
- **Connecting Trust:** 9922001122
- **KIRAN Mental Health Helpline:** 1800-599-0019 (Toll-free, 24/7, government)

**Important:** Seeking help is a sign of STRENGTH, not weakness. Mental health conditions are treatable. With proper care, most people recover and lead fulfilling lives.`
  },
  "pregnancy": {
    title: "Pregnancy Care — Complete Guide for Indian Mothers",
    content: `**Essential Pregnancy Care Information**

**Trimester Overview:**

**First Trimester (Weeks 1-12)**
- Organ formation — most critical period
- Morning sickness common (peaks week 8-10)
- Fatigue and breast tenderness
- Important tests: Blood group, Hb, HIV, Hepatitis B, urine, thyroid, first ultrasound (dating scan)
- Risk of miscarriage highest

**Second Trimester (Weeks 13-26)**
- Baby grows rapidly, movements felt (quickening at 16-20 weeks)
- Energy returns, nausea subsides
- Important: Anomaly scan (18-22 weeks) — checks baby's development
- Glucose tolerance test (24-28 weeks) for gestational diabetes
- Triple/Quadruple test if needed

**Third Trimester (Weeks 27-40)**
- Rapid baby growth, preparation for delivery
- More frequent checkups
- Growth scan, non-stress test
- Hospital bag preparation
- Birth plan discussion

**Essential Nutrients:**
| Nutrient | Daily Need | Sources |
|---|---|---|
| Folic Acid | 400-800 mcg (start before conception) | Spinach, dal, beans, fortified cereals |
| Iron | 27 mg (double normal) | Jaggery, dates, spinach, pomegranate, meat |
| Calcium | 1,000 mg | Milk, curd, paneer, ragi, sesame seeds |
| Vitamin D | 600 IU | Sunlight, fortified milk, eggs |
| DHA/Omega-3 | 200-300 mg | Fish (low mercury), flaxseeds, walnuts |
| Protein | 70-100g | Dal, eggs, milk, chicken, paneer, soy |

**Foods to Avoid:**
- Raw or undercooked meat, eggs, seafood
- Unpasteurized milk and cheese
- Raw papaya (may cause contractions)
- Excess caffeine (limit to 200mg/day — about 1 cup coffee)
- Alcohol — absolutely none
- Excess Vitamin A supplements (retinol form)
- Pineapple in large amounts (first trimester)
- High-mercury fish (shark, swordfish, king mackerel)

**Warning Signs — Seek Immediate Medical Help:**
- Heavy vaginal bleeding
- Severe abdominal pain
- Sudden swelling of face/hands (preeclampsia sign)
- Severe headache with vision changes
- Reduced or absent fetal movements (after 28 weeks)
- Leaking fluid from vagina (possible rupture of membranes)
- High fever (above 101°F)
- Persistent vomiting (hyperemesis)
- Burning urination (UTI risk in pregnancy)

**Government Schemes for Pregnant Women in India:**
- **Pradhan Mantri Matru Vandana Yojana (PMMVY):** ₹5,000 cash incentive for first living child
- **Janani Suraksha Yojana (JSY):** Cash assistance for institutional delivery
- **Janani Shishu Suraksha Karyakram (JSSK):** Free delivery, medications, diagnostics, diet, and transport at government facilities
- **Surakshit Matritva Aashwasan (SUMAN):** Free assured and quality healthcare for pregnant women

**Normal Delivery vs C-Section:**
- Normal delivery is preferred when medically safe
- C-section is needed in certain medical situations (fetal distress, placenta previa, breech, previous C-section)
- Discuss with your doctor — don't feel pressured either way
- Recovery after normal delivery is typically faster`
  },
  "vaccination": {
    title: "Vaccination Guide — India",
    content: `**Vaccinations Save Lives — India's Immunization Programs**

**Children's Vaccination Schedule (National Immunization Schedule):**

| Age | Vaccines |
|---|---|
| At Birth | BCG, OPV-0 (oral polio), Hepatitis B birth dose |
| 6 Weeks | DPT-1, IPV-1, Hep B-2, Rotavirus-1, PCV-1 |
| 10 Weeks | DPT-2, IPV-2, Rotavirus-2, PCV-2 |
| 14 Weeks | DPT-3, IPV-3, Hep B-3, Rotavirus-3, PCV-3 |
| 9-12 Months | MR-1 (Measles-Rubella), JE-1 (Japanese Encephalitis), Vitamin A (1st dose), PCV Booster |
| 16-24 Months | DPT Booster-1, MR-2, OPV Booster, JE-2, Vitamin A (2nd dose) |
| 5-6 Years | DPT Booster-2, OPV Booster |
| 10 Years | Td (Tetanus + Diphtheria) |
| 16 Years | Td Booster |

**Additional Recommended Vaccines (Not in UIP but recommended by IAP):**
- Typhoid vaccine (after 9 months)
- Hepatitis A (after 12 months)
- Varicella (Chickenpox) (after 15 months)
- HPV vaccine (9-14 years — for cervical cancer prevention)
- Influenza (annual, after 6 months)
- Meningococcal (for high-risk groups)

**Adult Vaccinations:**
- **Annual Flu vaccine** — recommended for all adults
- **COVID-19 vaccine and boosters**
- **Hepatitis B** — if not vaccinated in childhood (3 doses)
- **Td/Tdap booster** — every 10 years
- **Pneumococcal vaccine** — adults 65+ (PCV13 + PPSV23)
- **HPV vaccine** — up to age 26 (cervical cancer prevention)
- **Herpes Zoster (Shingles)** — adults 50+ (Shingrix)
- **Hepatitis A** — if at risk

**Pregnancy Vaccinations:**
- **Td/Tdap** — one dose during each pregnancy (27-36 weeks ideal)
- **Influenza vaccine** — safe and recommended during any trimester
- **COVID-19 vaccine** — recommended
- **AVOID:** Live vaccines (MMR, Varicella, BCG) during pregnancy

**Key Points:**
- Vaccines are one of the most effective and safe medical interventions
- India's Universal Immunization Programme (UIP) is one of the world's largest
- All UIP vaccines are FREE at government health centers
- Keep vaccination records safe — you'll need them for school admission
- Mild side effects (fever, soreness) are NORMAL and mean the vaccine is working
- Consult doctor for catch-up schedules if doses were missed`
  },
  "exercise": {
    title: "Physical Activity and Exercise — Complete Guide",
    content: `**Exercise is Medicine — The Best Investment in Your Health**

**WHO Recommendations:**
- **Adults (18-64):** 150-300 min moderate OR 75-150 min vigorous activity/week
- **Children (5-17):** At least 60 min moderate-to-vigorous daily
- **Older adults (65+):** Same as adults + balance and flexibility exercises
- Include muscle-strengthening activities 2+ days/week

**Types of Exercise:**

**1. Aerobic (Cardio):**
- Walking, jogging, running, cycling, swimming, dancing
- Improves heart health, stamina, and mood
- Burns calories for weight management
- Start: 20-30 min, 3-4 times/week → gradually increase

**2. Strength Training:**
- Bodyweight exercises (push-ups, squats, lunges, planks)
- Weight training (dumbbells, barbells, machines)
- Resistance bands
- Builds muscle, increases metabolism, strengthens bones
- 2-3 sessions/week with rest days between

**3. Flexibility:**
- Yoga, stretching, Pilates
- Improves range of motion, reduces injury risk
- Daily stretching recommended (especially after exercise)

**4. Balance:**
- Tai chi, single-leg stands, yoga poses
- Critical for older adults (fall prevention)

**Yoga — India's Gift to World Health:**
- **Surya Namaskar (Sun Salutation):** 12 poses — full-body workout
- **Pranayama:** Breathing exercises (Anulom Vilom, Kapalbhati, Bhramari)
- **Asanas for specific benefits:**
  - Stress: Savasana, Balasana (child's pose)
  - Back pain: Bhujangasana (cobra), Marjaryasana (cat-cow)
  - Diabetes: Mandukasana (frog pose), Ardha Matsyendrasana (seated twist)
  - Heart health: Tadasana (mountain), Vrikshasana (tree)
  - Weight loss: Chaturanga, Navasana (boat pose), Utkatasana (chair)

**Benefits of Regular Exercise:**
- 30% reduced risk of heart disease
- 40% reduced risk of type 2 diabetes
- 30% reduced risk of depression
- 20% reduced risk of cancer (breast, colon)
- Better sleep quality
- Stronger bones and muscles
- Improved memory and brain function
- Enhanced immune function
- Increased energy levels
- Better mood and self-esteem

**Getting Started (Indian Context):**
1. Start with morning walks (5:30-7 AM — cooler, fresh air)
2. Join a yoga class or follow online videos
3. Use stairs instead of elevator
4. Walk or cycle for short distances
5. Exercise with friends or family for motivation
6. Parks and grounds are free gym alternatives
7. Home workouts need no equipment

**Safety Tips:**
- Warm up 5-10 minutes before exercise
- Cool down and stretch after exercise
- Stay hydrated (water, nimbu pani, coconut water)
- Avoid exercising in extreme heat (Indian summers — exercise early morning or evening)
- Listen to your body — stop if you feel pain, dizziness, or chest discomfort
- Wear proper footwear
- Consult doctor before starting if you have chronic conditions
- Gradually increase intensity (10% rule — don't increase more than 10%/week)`
  },
  "sleep": {
    title: "Sleep Health — Why Good Sleep Matters",
    content: `**Sleep is Not a Luxury — It's a Biological Necessity**

**How Much Sleep Do You Need?**
| Age Group | Hours per Night |
|---|---|
| Newborns (0-3 months) | 14-17 hours |
| Infants (4-11 months) | 12-15 hours |
| Toddlers (1-2 years) | 11-14 hours |
| Preschool (3-5 years) | 10-13 hours |
| School age (6-13) | 9-11 hours |
| Teens (14-17) | 8-10 hours |
| Adults (18-64) | 7-9 hours |
| Older adults (65+) | 7-8 hours |

**Sleep Hygiene Tips:**
1. **Consistent schedule:** Same bedtime and wake time daily (even weekends)
2. **Dark room:** Use blackout curtains, remove electronic lights
3. **Cool temperature:** 65-68°F (18-20°C) is ideal
4. **No screens:** Avoid phones, tablets, computers 1 hour before bed (blue light blocks melatonin)
5. **Limit caffeine:** No coffee/tea after 2 PM
6. **Avoid heavy meals:** Don't eat large meals 2-3 hours before bed
7. **Exercise regularly:** But not within 3 hours of bedtime
8. **Wind-down routine:** Reading, warm bath, gentle stretching, meditation
9. **Comfortable bedding:** Good mattress and pillows
10. **Reserve bed for sleep:** Don't work, eat, or watch TV in bed

**Common Sleep Disorders:**
- **Insomnia:** Difficulty falling/staying asleep — most common
- **Sleep Apnea:** Breathing repeatedly stops during sleep (linked to obesity, snoring)
- **Restless Leg Syndrome:** Uncomfortable urge to move legs at night
- **Narcolepsy:** Excessive daytime sleepiness

**Natural Sleep Aids:**
- Warm turmeric milk (haldi doodh) before bed
- Chamomile tea
- Ashwagandha (adaptogen — reduces cortisol)
- Nutmeg (jaiphal) — tiny pinch in warm milk
- Valerian root tea
- Lavender aromatherapy
- Warm water foot soak
- 4-7-8 breathing technique
- Body scan meditation

**When Poor Sleep is a Problem:**
- Taking more than 30 minutes to fall asleep regularly
- Waking up multiple times at night
- Feeling unrefreshed despite adequate hours
- Excessive daytime sleepiness
- Snoring with gasping or pausing (sleep apnea — see doctor)
- Falling asleep uncontrollably during the day`
  },
  "women health": {
    title: "Women's Health — Complete Guide",
    content: `**Comprehensive Women's Health Information**

**Menstrual Health:**
- Normal cycle: 21-35 days
- Normal period duration: 3-7 days
- Period problems to watch: Very heavy bleeding (soaking pad/tampon hourly), Severe pain disrupting daily life, Irregular cycles, Missed periods (not pregnant)
- Track your cycle with apps (Clue, Flo, Period Tracker)

**Common Gynecological Conditions:**
- **PCOD/PCOS:** Affects 1 in 5 Indian women. Irregular periods, acne, weight gain, excess hair. Managed with lifestyle changes and medication.
- **Endometriosis:** Tissue similar to uterine lining grows outside uterus. Causes severe pain, heavy periods, infertility.
- **Fibroids:** Non-cancerous growths in uterus. May cause heavy bleeding, pain, pressure.
- **Cervical Cancer:** Preventable with HPV vaccination and Pap smears. Get screened after age 25.

**Breast Health:**
- Monthly breast self-examination (BSE) after age 20
- Clinical breast examination annually after 30
- Mammography: every 1-2 years after age 40 (or earlier if family history)
- Warning signs: lump, skin changes, nipple discharge, pain

**Bone Health:**
- Women lose bone rapidly after menopause (estrogen decline)
- Osteoporosis affects millions of Indian women
- Prevention: Calcium (1000-1200mg/day), Vitamin D, weight-bearing exercise, avoid smoking

**Cancer Screening for Women:**
- Cervical: Pap smear every 3 years (25-65) or HPV test every 5 years
- Breast: Annual mammogram after 40
- Colorectal: After 45

**Mental Health:**
- Women are 2x more likely to experience depression and anxiety
- Postpartum depression affects 10-15% of new mothers — NOT a character flaw
- Seek help — KIRAN helpline: 1800-599-0019

**Iron Deficiency:**
- 50% of Indian women are anemic
- Eat iron-rich foods with vitamin C
- Iron supplements during pregnancy mandatory`
  },
  "child health": {
    title: "Child Health — Parenting Guide",
    content: `**Keeping Children Healthy — Guide for Indian Parents**

**Growth Milestones:**
| Age | Physical | Social/Communication |
|---|---|---|
| 2 months | Holds head up, smooth movements | Smiles, coos, looks at faces |
| 4 months | Pushes up on elbows | Babbles, laughs, copies sounds |
| 6 months | Sits with support, rolls over | Responds to name, explores with mouth |
| 9 months | Sits without support, crawls | Points, understands "no" |
| 12 months | Pulls to stand, may walk | Says "mama/dada," follows simple directions |
| 18 months | Walks alone, scribbles | Says several words, points to show things |
| 2 years | Runs, kicks ball | 2-word phrases, follows 2-step instructions |
| 3 years | Climbs, pedals tricycle | Conversations, plays with others |

**Common Childhood Illnesses in India:**
- **Diarrhea:** #1 killer of children <5. Prevention: hand washing, clean water, ORS for treatment
- **Pneumonia:** Vaccination (PCV), breastfeeding, nutrition
- **Malnutrition:** Balanced diet, government ICDS/Anganwadi programs
- **Measles:** Vaccination (MR vaccine)
- **Dengue:** Mosquito protection

**Nutrition for Children:**
- Exclusive breastfeeding for 6 months (best start to life)
- Complementary feeding from 6 months (mashed dal-rice, khichdi, fruit purees)
- Include all food groups by 12 months
- Iron-rich foods to prevent anemia
- Avoid junk food, sugary drinks, excessive screen time

**When to Rush to Hospital:**
- High fever not responding to paracetamol
- Difficulty breathing, chest indrawing
- Persistent vomiting/diarrhea with dehydration
- Seizures/fits
- Not eating or drinking
- Rash with fever (could be measles, dengue)
- Injury with significant bleeding or suspected fracture
- Lethargy, not responding normally`
  }
};

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function tokenize(text: string): string[] {
  return normalizeText(text).split(" ").filter(w => w.length > 1);
}

const synonymMap: Record<string, string[]> = {
  "pain": ["ache", "hurt", "sore", "painful", "dard", "discomfort", "tender"],
  "fever": ["temperature", "hot", "bukhar", "febrile", "pyrexia"],
  "headache": ["head pain", "head ache", "sir dard", "sar dard", "migraine"],
  "stomach": ["tummy", "belly", "abdomen", "abdominal", "pet"],
  "vomiting": ["vomit", "throwing up", "ulti", "nausea", "puke"],
  "diarrhea": ["loose motion", "loose stools", "watery stool", "dast", "dysentery"],
  "cough": ["khansi", "coughing", "tussis"],
  "cold": ["sardi", "nazla", "coryza"],
  "breathing": ["breath", "saans", "respiratory", "breathlessness"],
  "tired": ["fatigue", "exhausted", "weakness", "thakan", "kamzori", "weak"],
  "skin": ["dermal", "cutaneous", "chamdi"],
  "heart": ["cardiac", "dil", "cardiovascular"],
  "sugar": ["glucose", "diabetes", "diabetic", "madhumeh"],
  "blood": ["khoon", "hematological", "haem"],
  "urine": ["peshab", "urinary", "pee", "micturition"],
  "eye": ["aankh", "vision", "ocular", "ophthalmic"],
  "pregnant": ["pregnancy", "garbh", "expecting", "prenatal", "maternity"],
  "medicine": ["medication", "drug", "tablet", "pill", "dawai", "dawa"],
  "doctor": ["physician", "clinic", "hospital", "medical"],
  "child": ["children", "kid", "baby", "infant", "bachcha", "pediatric"],
  "woman": ["women", "female", "lady", "mahila", "gynec"],
  "anxiety": ["anxious", "worried", "nervous", "panic", "ghabrahat"],
  "depression": ["depressed", "sad", "hopeless", "udasi"],
  "sleep": ["insomnia", "neend", "sleeping", "rest"],
  "weight": ["wazan", "obesity", "overweight", "motapa", "fat", "slim", "thin"],
  "itching": ["itch", "khujli", "pruritus", "scratching"],
  "swelling": ["swollen", "sooj", "edema", "inflammation", "puffy"],
  "tooth": ["teeth", "dental", "toothache", "dant", "daant", "molar", "gum", "cavity", "tooth pain", "teeth pain"],
  "toothache": ["tooth pain", "teeth pain", "teeth ache", "tooth ache", "dant dard", "daant dard"],
};

function expandQuery(query: string): string {
  let expanded = normalizeText(query);
  for (const [canonical, syns] of Object.entries(synonymMap)) {
    for (const syn of syns) {
      if (expanded.includes(syn)) {
        expanded += ` ${canonical}`;
      }
    }
    if (expanded.includes(canonical)) {
      expanded += ` ${syns.join(" ")}`;
    }
  }
  return expanded;
}

function calculateRelevanceScore(query: string, condition: MedicalCondition): number {
  const expandedQuery = expandQuery(query);
  const queryWords = tokenize(expandedQuery);
  let score = 0;

  const condNameNorm = normalizeText(condition.name);
  if (expandedQuery.includes(condNameNorm) || condNameNorm.includes(expandedQuery)) {
    score += 25;
  }

  for (const keyword of condition.keywords) {
    const normalizedKeyword = normalizeText(keyword);
    if (expandedQuery.includes(normalizedKeyword)) {
      score += 15;
    } else {
      const kwWords = normalizedKeyword.split(" ");
      let kwMatch = 0;
      for (const kw of kwWords) {
        if (queryWords.some(qw => qw === kw || (qw.length > 3 && kw.length > 3 && (qw.includes(kw) || kw.includes(qw))))) {
          kwMatch++;
        }
      }
      if (kwMatch > 0) {
        score += kwMatch * 4;
      }
    }
  }

  for (const symptom of condition.symptoms) {
    const ns = normalizeText(symptom);
    if (expandedQuery.includes(ns)) {
      score += 8;
    } else {
      for (const word of queryWords) {
        if (word.length > 3 && ns.includes(word)) {
          score += 2;
        }
      }
    }
  }

  if (expandedQuery.includes(normalizeText(condition.category))) {
    score += 5;
  }

  return score;
}

function detectEmergency(query: string): boolean {
  const emergencyKeywords = [
    "heart attack", "stroke", "can't breathe", "cannot breathe", "chest pain severe",
    "unconscious", "not breathing", "choking", "seizure", "heavy bleeding",
    "suicidal", "suicide", "want to die", "kill myself", "overdose",
    "severe allergic reaction", "anaphylaxis", "paralysis", "sudden numbness",
    "face drooping", "crushing chest", "brain stroke", "cardiac arrest",
    "snake bite", "poisoning", "drowning", "electrocution", "severe burn",
    "gunshot", "stab wound", "road accident", "head injury severe"
  ];
  const normalizedQuery = normalizeText(query);
  return emergencyKeywords.some(kw => normalizedQuery.includes(kw));
}

function detectDiagnosisRequest(query: string): boolean {
  const diagnosisPatterns = [
    "what do i have", "what is wrong with me", "diagnose me", "what disease do i have",
    "tell me my diagnosis", "what's my condition", "do i have cancer", "am i sick",
    "what medicine should i take", "prescribe me", "what pill", "which medicine for me",
    "what treatment for me", "am i dying", "is it cancer"
  ];
  const normalizedQuery = normalizeText(query);
  return diagnosisPatterns.some(p => normalizedQuery.includes(p));
}

function detectDrugQuery(query: string): DrugInfo | null {
  const normalizedQuery = normalizeText(query);
  for (const drug of drugDatabase) {
    if (normalizedQuery.includes(normalizeText(drug.name)) ||
        normalizedQuery.includes(normalizeText(drug.genericName)) ||
        drug.aliases.some(a => normalizedQuery.includes(normalizeText(a)))) {
      return drug;
    }
  }
  return null;
}

function detectLabTestQuery(query: string): LabTest | null {
  const normalizedQuery = normalizeText(query);
  for (const test of labTestDatabase) {
    if (normalizedQuery.includes(normalizeText(test.name)) ||
        test.aliases.some(a => normalizedQuery.includes(normalizeText(a)))) {
      return test;
    }
  }
  return null;
}

function formatDrugResponse(drug: DrugInfo): string {
  return `## ${drug.name} (${drug.genericName})

**Category:** ${drug.category}

### What is it used for?
${drug.uses.map(u => `- ${u}`).join("\n")}

### Dosage
${drug.dosage}

### Common Side Effects
${drug.sideEffects.map(s => `- ${s}`).join("\n")}

### Important Warnings
${drug.warnings.map(w => `- ⚠️ ${w}`).join("\n")}

### Drug Interactions
${drug.interactions.map(i => `- ${i}`).join("\n")}

### Pregnancy
${drug.pregnancy}

---
**Important:** Always take medications as prescribed by your doctor. Do not self-medicate, change doses, or stop medications without consulting your healthcare provider. This information is for educational purposes only.`;
}

function formatLabTestResponse(test: LabTest): string {
  return `## ${test.name}

### Purpose
${test.purpose}

### Normal Reference Ranges
${test.normalRange}

### What Do Abnormal Results Mean?

**High Values May Indicate:**
${test.highMeaning}

**Low Values May Indicate:**
${test.lowMeaning}

### Preparation for the Test
${test.preparation}

### How Often Should You Get Tested?
${test.frequency}

---
**Important:** Lab results should always be interpreted by your doctor in the context of your complete medical history, symptoms, and other test results. A single abnormal value does not necessarily mean disease. Reference ranges may vary slightly between laboratories.`;
}

function detectGreeting(query: string): boolean {
  const normalized = query.trim().toLowerCase().replace(/[!?.,']+/g, "").trim();
  const words = normalized.split(/\s+/);
  if (words.length > 4) return false;
  const exactGreetings = ["hi", "hello", "hey", "hii", "hiii", "helo", "hola", "namaste", "sup", "yo", "howdy", "greetings", "hy"];
  const phraseGreetings = ["good morning", "good afternoon", "good evening", "good night", "what's up", "whats up", "how are you", "how r u"];
  if (exactGreetings.includes(normalized)) return true;
  if (phraseGreetings.some(g => normalized === g)) return true;
  if (words.length <= 2 && exactGreetings.includes(words[0]) && ["there", "everyone", "all", "doc", "doctor", "medassist", "ai", "carepulse", "buddy", "friend"].includes(words[1] || "")) return true;
  return false;
}

function detectThankYou(query: string): boolean {
  const thanks = ["thank", "thanks", "thanku", "thank you", "thx", "ty", "shukriya", "dhanyavad"];
  const normalized = query.trim().toLowerCase();
  return thanks.some(t => normalized.includes(t));
}

export function searchMedicalKnowledge(query: string): { answer: string; disclaimer: string } {
  const normalizedQuery = normalizeText(query);

  if (detectGreeting(query)) {
    const greetings = [
      "Hey there! I'm **CarePulse MedAssist AI** — your friendly medical knowledge companion.",
      "Hello! Great to hear from you! I'm **MedAssist AI**, your healthcare assistant.",
      "Hi! Welcome to **CarePulse MedAssist AI**! I'm here to help you with health-related questions.",
    ];
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    return {
      answer: `## ${greeting}

I'm here to help you with all kinds of health and medical questions. Think of me as a knowledgeable friend who can explain medical topics in simple language.

### Here's what I can help you with:
- **Medical Conditions** — symptoms, causes, prevention, and home remedies for 100+ conditions
- **Medications** — uses, dosage, side effects, and interactions of common medicines
- **Lab Tests** — what they measure, normal ranges, and what results mean
- **Health Topics** — nutrition, exercise, mental health, pregnancy, first aid, and more
- **Indian Healthcare** — government schemes, emergency numbers, finding doctors

### Try asking me something like:
- "What are the symptoms of dengue?"
- "Tell me about paracetamol"
- "What is a normal blood sugar level?"
- "Home remedies for cold and cough"
- "How to manage stress?"

Go ahead, ask me anything health-related! I'm happy to help.`,
      disclaimer: "Disclaimer: I provide educational health information only. Always consult a qualified doctor for medical advice, diagnosis, or treatment."
    };
  }

  if (detectThankYou(query)) {
    return {
      answer: `You're very welcome! I'm glad I could help.

If you have any more health questions, feel free to ask anytime. I'm always here for you!

**Stay healthy and take care!**`,
      disclaimer: "Disclaimer: This information is for educational purposes only and does not substitute professional medical advice."
    };
  }

  if (detectEmergency(query)) {
    return {
      answer: `## 🚨 EMERGENCY ALERT — SEEK IMMEDIATE HELP

Based on what you've described, this could be a **medical emergency**. Please take immediate action:

### Immediate Steps:
1. **Call Emergency Services NOW:** Dial **112** (All Emergency) or **108** (Ambulance)
2. **Do not delay** — every minute counts in emergency situations
3. If someone is with you, ask them to help while you call
4. Stay calm and follow instructions from emergency dispatchers
5. If the person is unconscious and not breathing, start CPR if trained

### Emergency Numbers (India):
- **All Emergency: 112**
- **Ambulance: 108**
- **Police: 100**
- **Fire: 101**
- **Poison Control: 1066**
- **Women Helpline: 1091**
- **Mental Health Crisis (KIRAN): 1800-599-0019**

### While Waiting for Help:
- Keep the person comfortable and warm
- Don't give food or water (unless instructed)
- Note the time symptoms started
- Gather any medications the person takes
- Clear the path for emergency responders

**This AI system cannot provide emergency medical care. Professional help is essential.**`,
      disclaimer: "EMERGENCY: This information is for educational purposes only. Call emergency services immediately (112 or 108) if you or someone else is in danger."
    };
  }

  if (detectDiagnosisRequest(query)) {
    const relevantConditions = medicalDatabase
      .map(c => ({ condition: c, score: calculateRelevanceScore(query, c) }))
      .filter(r => r.score > 5)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    let answer = `## ⚕️ Important Notice

**I cannot provide a medical diagnosis or prescribe medications.** Only a qualified healthcare professional can diagnose conditions and prescribe treatments after proper examination, testing, and clinical evaluation.

### What I Can Do:
I can provide **educational information** about medical conditions, symptoms, prevention, and general health topics to help you have more informed conversations with your doctor.\n\n`;

    if (relevantConditions.length > 0) {
      answer += `### Related Health Information:\n\n`;
      for (const { condition } of relevantConditions) {
        answer += `**${condition.name}**\n${condition.description.substring(0, 200)}...\n`;
        answer += `Common symptoms include: ${condition.symptoms.slice(0, 5).join(", ")}\n\n`;
      }
    }

    answer += `### Recommended Next Steps:
1. **Schedule an appointment** with a qualified healthcare provider
2. **Keep a symptom diary** — note when symptoms started, severity, triggers, and any patterns
3. **List your medications** — bring a complete list to your appointment
4. **Prepare questions** for your doctor
5. **Get appropriate tests** as recommended by your doctor

### Finding a Doctor in India:
- Visit your nearest **Primary Health Centre (PHC)** or **Community Health Centre (CHC)**
- Use **Practo** or **1mg** apps to find and book doctors online
- Government hospitals provide affordable healthcare
- **Ayushman Bharat** scheme covers treatment for eligible families`;

    return {
      answer,
      disclaimer: "Disclaimer: This information is for educational purposes only and does not substitute professional medical advice. Only a qualified doctor can provide diagnosis and treatment."
    };
  }

  const drugInfo = detectDrugQuery(query);
  if (drugInfo) {
    return {
      answer: formatDrugResponse(drugInfo),
      disclaimer: "Disclaimer: Drug information is for educational purposes only. Always consult your doctor or pharmacist before taking any medication. Do not self-medicate."
    };
  }

  const labTest = detectLabTestQuery(query);
  if (labTest) {
    return {
      answer: formatLabTestResponse(labTest),
      disclaimer: "Disclaimer: Lab test information is for educational purposes. Always have your results interpreted by your doctor in the context of your overall health."
    };
  }

  for (const [topicKey, topic] of Object.entries(medicalTopics)) {
    if (normalizedQuery.includes(topicKey)) {
      return {
        answer: `${topic.content}`,
        disclaimer: "Disclaimer: This information is for educational purposes only and does not substitute professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider."
      };
    }
  }

  const topicKeywordMap: Record<string, string[]> = {
    "blood pressure": ["bp", "systolic", "diastolic", "hypertension", "hypotension", "high bp", "low bp"],
    "diabetes": ["blood sugar", "glucose", "insulin", "hba1c", "diabetic", "sugar level", "madhumeh"],
    "first aid": ["emergency", "burn", "wound", "cut", "choking", "cpr", "first aid", "snake bite", "drowning", "fracture"],
    "nutrition": ["diet", "food", "eating", "vitamin", "mineral", "nutrient", "healthy eating", "nutrition", "superfood", "balanced diet"],
    "mental health": ["depression", "anxiety", "stress", "mental", "therapy", "counseling", "panic", "suicidal", "ocd", "ptsd"],
    "pregnancy": ["pregnant", "pregnancy", "prenatal", "trimester", "fetal", "maternity", "expecting", "garbh", "delivery", "cesarean"],
    "vaccination": ["vaccine", "vaccination", "immunization", "immunize", "booster", "dose", "tika"],
    "exercise": ["exercise", "workout", "fitness", "gym", "yoga", "walking", "running", "physical activity", "surya namaskar", "pranayama"],
    "sleep": ["sleep", "insomnia", "sleeping", "neend", "sleep disorder", "snoring", "sleep apnea"],
    "women health": ["women health", "menstrual", "period", "periods", "menstruation", "pcos", "pcod", "breast", "cervical", "menopause", "gynec"],
    "child health": ["child health", "baby", "infant", "newborn", "pediatric", "vaccination child", "milestone", "breastfeeding"]
  };

  for (const [topicKey, keywords] of Object.entries(topicKeywordMap)) {
    if (keywords.some(kw => normalizedQuery.includes(kw))) {
      const topic = medicalTopics[topicKey];
      if (topic) {
        return {
          answer: `${topic.content}`,
          disclaimer: "Disclaimer: This information is for educational purposes only and does not substitute professional medical advice, diagnosis, or treatment."
        };
      }
    }
  }

  const relevantConditions = medicalDatabase
    .map(c => ({ condition: c, score: calculateRelevanceScore(query, c) }))
    .filter(r => r.score > 5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (relevantConditions.length > 0) {
    let answer = "";

    for (let i = 0; i < relevantConditions.length; i++) {
      const { condition } = relevantConditions[i];
      if (i === 0) {
        answer += `## ${condition.name}\n*Category: ${condition.category}*\n\n`;
        answer += `${condition.description}\n\n`;
        answer += `### Causes\n${condition.causes.map(c => `- ${c}`).join("\n")}\n\n`;
        answer += `### Common Symptoms\n${condition.symptoms.map(s => `- ${s}`).join("\n")}\n\n`;
        answer += `### Risk Factors\n${condition.riskFactors.map(r => `- ${r}`).join("\n")}\n\n`;
        answer += `### Prevention\n${condition.prevention.map(p => `- ${p}`).join("\n")}\n\n`;
        if (condition.homeRemedies.length > 0) {
          answer += `### Home Remedies & Self-Care\n${condition.homeRemedies.map(h => `- ${h}`).join("\n")}\n\n`;
        }
        if (condition.treatments.length > 0) {
          answer += `### Medical Treatments\n${condition.treatments.map(t => `- ${t}`).join("\n")}\n\n`;
        }
        answer += `### When to See a Doctor\n${condition.whenToSeeDoctor.map(w => `- ⚠️ ${w}`).join("\n")}\n\n`;
      } else {
        answer += `---\n\n### Related: ${condition.name}\n*${condition.category}*\n\n`;
        answer += `${condition.description.substring(0, 300)}...\n\n`;
        answer += `**Key Symptoms:** ${condition.symptoms.slice(0, 5).join(", ")}\n\n`;
        if (condition.homeRemedies.length > 0) {
          answer += `**Home Remedies:** ${condition.homeRemedies.slice(0, 3).join("; ")}\n\n`;
        }
      }
    }

    return {
      answer,
      disclaimer: "Disclaimer: This information is for educational purposes only and does not substitute professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns."
    };
  }

  return {
    answer: `## Health Information

Thank you for your health-related question.

While I don't have a specific detailed article on this exact topic in my medical knowledge base, I can help you with information on many health topics. Here are some areas I can assist with:

### Topics I Cover:
- **Conditions:** Hypertension, Diabetes, Dengue, Malaria, TB, Typhoid, COVID-19, Asthma, UTI, Kidney Stones, PCOS, Thyroid, Heart Disease, Stroke, Pneumonia, Anemia, Anxiety, Depression, Back Pain, Skin Infections, Chikungunya, Hepatitis, Chickenpox, and more
- **Medications:** Paracetamol, Ibuprofen, Amoxicillin, Omeprazole, Metformin, Cetirizine, Azithromycin, Amlodipine, and more
- **Lab Tests:** CBC, Blood Sugar, Lipid Profile, Thyroid (TSH/T3/T4), Liver Function, Kidney Function, HbA1c, Vitamin D, Vitamin B12, Urine Test
- **Health Topics:** Blood Pressure, Diabetes, First Aid, Nutrition, Mental Health, Pregnancy, Vaccination, Exercise, Sleep, Women's Health, Child Health

### Try Asking About:
- "What is dengue fever?"
- "Symptoms of diabetes"
- "Home remedies for acidity"
- "What is paracetamol used for?"
- "Normal blood sugar levels"
- "CBC test normal range"
- "Healthy Indian diet"
- "Mental health helplines"

### General Health Tips:
- Stay hydrated (8-10 glasses of water daily)
- Eat a balanced diet rich in fruits, vegetables, and whole grains
- Exercise regularly (30 minutes of moderate activity daily)
- Get 7-9 hours of quality sleep
- Manage stress through yoga, meditation, or hobbies
- Get regular health checkups
- Don't ignore symptoms — see a doctor when needed

### Emergency Numbers (India):
- **All Emergency: 112** | **Ambulance: 108** | **Health Helpline: 104**`,
    disclaimer: "Disclaimer: This information is for educational purposes only and does not substitute professional medical advice, diagnosis, or treatment."
  };
}

export interface SymptomXAIFactor {
  label: string;
  score: number;
  maxScore: number;
  impact: "high" | "moderate" | "low";
  description: string;
}

export interface SymptomXAIData {
  confidence: number;
  factors: SymptomXAIFactor[];
  topConditions: { name: string; score: number; category: string }[];
  decisionSummary: string;
  modelInfo: string;
}

export function analyzeSymptoms(input: {
  symptoms: string;
  bodyArea: string;
  severity: number;
  duration: string;
}): { analysis: string; disclaimer: string; xai: SymptomXAIData } {
  const { symptoms, bodyArea, severity, duration } = input;
  const expandedSymptoms = expandQuery(symptoms);
  const expandedBodyArea = expandQuery(bodyArea);

  if (detectEmergency(symptoms)) {
    return {
      analysis: `## 🚨 EMERGENCY — Seek Immediate Medical Attention

**Based on your reported symptoms, this may be a medical emergency.**

### Immediate Actions Required:
1. **Call Emergency Services NOW:** Dial **112** or **108** (Ambulance)
2. Do NOT wait — go to the nearest emergency room immediately
3. If someone is with you, have them assist while you seek help
4. Do NOT drive yourself if feeling dizzy, confused, or in severe pain
5. Note the time symptoms started — this is critical for treatment decisions

### Emergency Numbers (India):
- **All Emergency: 112**
- **Ambulance: 108**
- **Health Helpline: 104**

**This AI assessment cannot replace emergency medical care. Every minute counts in an emergency.**`,
      disclaimer: "EMERGENCY: This is an AI-assisted preliminary assessment only. Call emergency services immediately.",
      xai: {
        confidence: 99,
        factors: [
          { label: "Emergency Keywords", score: 40, maxScore: 40, impact: "high" as const, description: "Critical emergency keywords detected in symptom description." },
          { label: "Reported Severity", score: Math.round((severity / 10) * 25), maxScore: 25, impact: "high" as const, description: `Severity ${severity}/10 reported.` },
        ],
        topConditions: [],
        decisionSummary: "Emergency keywords detected. Immediate medical attention is required.",
        modelInfo: "CarePulse Emergency Detection v3.0 — Rule-based critical keyword detection.",
      },
    };
  }

  const matchedConditions = medicalDatabase
    .map(condition => {
      let score = 0;
      let symptomScore = 0; // track symptom-driven score separately
      const symptomWords = tokenize(expandedSymptoms);

      for (const keyword of condition.keywords) {
        const nk = normalizeText(keyword);
        if (expandedSymptoms.includes(nk)) {
          score += 15; symptomScore += 15;
        } else {
          for (const word of symptomWords) {
            if (word.length > 3 && nk.includes(word)) {
              score += 3; symptomScore += 3;
            }
          }
        }
      }

      for (const symptom of condition.symptoms) {
        const ns = normalizeText(symptom);
        if (expandedSymptoms.includes(ns)) {
          score += 10; symptomScore += 10;
        } else {
          const matchingWords = symptomWords.filter(w => w.length > 3 && ns.includes(w));
          score += matchingWords.length * 2;
          symptomScore += matchingWords.length * 2;
        }
      }

      // Body area bonus only for specific (non-general) selections
      // "General / Full Body" means we don't know the area, so symptoms alone must drive results
      const isGeneralArea = bodyArea === "general" || bodyArea === "";
      if (!isGeneralArea && condition.bodyAreas.some(area =>
        expandedBodyArea.includes(area) || area.includes(normalizeText(bodyArea))
      )) {
        score += 5; // reduced from 8, body area is a hint not a driver
      }

      return { condition, score, symptomScore };
    })
    // Require meaningful symptom match — body area alone cannot push a condition into results
    .filter(r => r.symptomScore >= 6 && r.score > 8)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  let urgencyLevel = "Low";
  let urgencyDescription = "Your symptoms suggest a condition that can likely wait for a regular doctor's appointment.";
  let urgencyColor = "🟢";

  if (severity >= 9 || matchedConditions.some(m => m.condition.urgency === "emergency")) {
    urgencyLevel = "Emergency";
    urgencyDescription = "Your symptoms suggest you should seek emergency medical care immediately. Call 112 (All Emergency) or 108 (Ambulance) or go to the nearest ER.";
    urgencyColor = "🔴";
  } else if (severity >= 7 || matchedConditions.some(m => m.condition.urgency === "high")) {
    urgencyLevel = "High";
    urgencyDescription = "Your symptoms suggest you should seek medical attention today. Visit a doctor or urgent care center as soon as possible.";
    urgencyColor = "🟠";
  } else if (severity >= 4 || matchedConditions.some(m => m.condition.urgency === "moderate")) {
    urgencyLevel = "Moderate";
    urgencyDescription = "Your symptoms suggest you should see a doctor within 24-48 hours. Monitor your symptoms closely for any worsening.";
    urgencyColor = "🟡";
  }

  const durationLower = normalizeText(duration);
  if ((durationLower.includes("week") || durationLower.includes("month") || durationLower.includes("year")) && urgencyLevel === "Low") {
    urgencyLevel = "Moderate";
    urgencyDescription = "Given the duration of your symptoms, it would be advisable to see a doctor within 24-48 hours for proper evaluation.";
    urgencyColor = "🟡";
  }

  let analysis = `## Symptom Analysis Report
*Powered by CarePulse AI*

---

**Reported Information:**
- **Body Area:** ${bodyArea}
- **Symptoms:** ${symptoms}
- **Severity:** ${severity}/10
- **Duration:** ${duration}

---

### 1. ${urgencyColor} URGENCY LEVEL: **${urgencyLevel}**

${urgencyDescription}

---

### 2. POSSIBLE CONDITIONS

`;

  if (matchedConditions.length > 0) {
    analysis += `Based on your reported symptoms, the following conditions *may* be related. **This is NOT a diagnosis** — only a qualified doctor can diagnose after proper examination.\n\n`;
    for (const { condition, score } of matchedConditions) {
      const matchingSymptoms = condition.symptoms.filter(s => {
        const ns = normalizeText(s);
        return tokenize(expandedSymptoms).some(w => w.length > 3 && ns.includes(w));
      });
      const relevance = matchingSymptoms.length >= 4 ? "Higher relevance" :
        matchingSymptoms.length >= 2 ? "Moderate relevance" : "Possible relevance";

      analysis += `#### ${condition.name}\n`;
      analysis += `*${condition.category} — ${relevance}*\n\n`;
      analysis += `${condition.description.substring(0, 250)}...\n\n`;
      if (matchingSymptoms.length > 0) {
        analysis += `**Matching symptoms:** ${matchingSymptoms.slice(0, 5).join(", ")}\n\n`;
      }
      if (condition.homeRemedies.length > 0) {
        analysis += `**Self-care tips:** ${condition.homeRemedies.slice(0, 3).join("; ")}\n\n`;
      }
    }
  } else {
    analysis += `Based on the information provided, I could not identify specific matching conditions in my database. This does NOT mean your symptoms aren't significant — it means you should consult a healthcare professional for proper evaluation.\n\n`;
  }

  analysis += `---

### 3. RECOMMENDED ACTIONS

`;

  if (urgencyLevel === "Emergency") {
    analysis += `1. **Call Emergency Services immediately** — Dial **112** or **108**
2. Go to the nearest emergency room
3. Do NOT attempt to self-treat
4. Have someone accompany you if possible
5. Bring a list of current medications and allergies
6. Note the exact time symptoms started\n\n`;
  } else if (urgencyLevel === "High") {
    analysis += `1. **Visit a doctor or urgent care center today**
2. Document your symptoms (timing, triggers, intensity changes)
3. List all current medications and known allergies
4. Avoid self-medication without professional guidance
5. Stay hydrated and rest
6. If symptoms worsen suddenly, call **112** (All Emergency) or **108** (Ambulance) for emergency help\n\n`;
  } else if (urgencyLevel === "Moderate") {
    analysis += `1. **Schedule a doctor's appointment within 24-48 hours**
2. Keep a symptom diary — note when symptoms worsen or improve
3. Stay hydrated and get adequate rest
4. Try appropriate home remedies (see above)
5. Avoid strenuous activities if experiencing pain or weakness
6. Take over-the-counter medications as appropriate (consult pharmacist)
7. If symptoms suddenly worsen, seek immediate medical attention\n\n`;
  } else {
    analysis += `1. **Schedule a routine doctor's appointment** when convenient
2. Monitor your symptoms at home and note any changes
3. Practice general wellness: hydration, rest, balanced diet
4. Try recommended home remedies
5. Use over-the-counter remedies as appropriate (consult pharmacist)
6. Seek immediate care if symptoms suddenly worsen or new symptoms develop\n\n`;
  }

  analysis += `---

### 4. WARNING SIGNS — Seek Immediate Help If You Experience:

`;

  const warningSigns = new Set<string>();
  if (matchedConditions.length > 0) {
    for (const { condition } of matchedConditions.slice(0, 2)) {
      for (const sign of condition.whenToSeeDoctor.slice(0, 3)) {
        warningSigns.add(sign);
      }
    }
  }
  warningSigns.add("Difficulty breathing or shortness of breath");
  warningSigns.add("Severe chest pain or pressure");
  warningSigns.add("Sudden confusion, difficulty speaking, or vision changes");
  warningSigns.add("Loss of consciousness or unresponsiveness");
  warningSigns.add("Uncontrolled bleeding");
  warningSigns.add("High fever (above 103°F / 39.4°C) not responding to medication");

  const warningList = Array.from(warningSigns).slice(0, 8);
  for (const sign of warningList) {
    analysis += `- ⚠️ ${sign}\n`;
  }

  analysis += `\n---\n\n**Emergency Numbers (India):** 112 (All Emergency) | 108 (Ambulance) | 104 (Health Helpline)\n\n**Finding a Doctor:** Use Practo, 1mg, or visit your nearest government health center for affordable consultation.`;

  // ── Build XAI data ──────────────────────────────────────────────
  const totalMatchScore = matchedConditions.reduce((s, m) => s + m.score, 0);
  const maxPossible = 120;

  const symptomWordCount = tokenize(expandedSymptoms).length;
  const symptomScoreRaw = Math.min(40, Math.round((symptomWordCount / 8) * 40));
  const severityScoreRaw = Math.round((severity / 10) * 25);
  const durationScoreRaw = (() => {
    const dl = normalizeText(duration);
    if (dl.includes("month") || dl.includes("year") || dl.includes("chronic")) return 20;
    if (dl.includes("week")) return 15;
    if (dl.includes("4") || dl.includes("7") || dl.includes("day")) return 10;
    return 5;
  })();
  const bodyAreaScoreRaw = bodyArea && bodyArea !== "general" ? 15 : 5;

  const totalRaw = symptomScoreRaw + severityScoreRaw + durationScoreRaw + bodyAreaScoreRaw;
  const confidence = Math.min(95, Math.round((totalRaw / 100) * 95));

  const xaiFactors: SymptomXAIFactor[] = [
    {
      label: "Symptom Description",
      score: symptomScoreRaw,
      maxScore: 40,
      impact: symptomScoreRaw >= 25 ? "high" : symptomScoreRaw >= 12 ? "moderate" : "low",
      description: `${symptomWordCount} descriptive words analysed. More detail improves accuracy.`,
    },
    {
      label: "Reported Severity",
      score: severityScoreRaw,
      maxScore: 25,
      impact: severity >= 7 ? "high" : severity >= 4 ? "moderate" : "low",
      description: `Severity ${severity}/10. ${severity >= 7 ? "High severity raises urgency." : severity >= 4 ? "Moderate severity flagged." : "Mild severity lowers urgency."}`,
    },
    {
      label: "Symptom Duration",
      score: durationScoreRaw,
      maxScore: 20,
      impact: durationScoreRaw >= 15 ? "high" : durationScoreRaw >= 10 ? "moderate" : "low",
      description: `Duration: "${duration}". ${durationScoreRaw >= 15 ? "Prolonged duration signals need for evaluation." : "Short duration noted."}`,
    },
    {
      label: "Body Area Specificity",
      score: bodyAreaScoreRaw,
      maxScore: 15,
      impact: bodyAreaScoreRaw >= 12 ? "high" : "low",
      description: bodyArea && bodyArea !== "general"
        ? `Specific area "${bodyArea}" narrows possible conditions.`
        : "General area selected — symptom text is the primary driver.",
    },
  ];

  const xai: SymptomXAIData = {
    confidence,
    factors: xaiFactors,
    topConditions: matchedConditions.slice(0, 3).map(m => ({
      name: m.condition.name,
      score: Math.min(100, Math.round((m.score / maxPossible) * 100)),
      category: m.condition.category,
    })),
    decisionSummary: matchedConditions.length > 0
      ? `The algorithm matched ${matchedConditions.length} condition(s) based on your symptom text, severity rating, and body area. The top match is "${matchedConditions[0].condition.name}" in the ${matchedConditions[0].condition.category} category.`
      : "No strong condition matches were found. The model bases urgency level on severity and duration alone.",
    modelInfo: "CarePulse Medical NLP v3.0 — Keyword-weighted scoring with body-area context. Not a diagnostic tool.",
  };

  return {
    analysis,
    disclaimer: "This is an AI-assisted preliminary assessment only. It is NOT a medical diagnosis. If you are experiencing a medical emergency, call 112 or 108 immediately. Always consult a qualified healthcare professional for proper diagnosis and treatment.",
    xai,
  };
}

export function generateDashboardInsights(stats: {
  totalPatients?: number;
  criticalPatients?: number;
  totalHospitals?: number;
  avgOccupancy?: number;
  trends?: { diseaseName: string; caseCount: number }[];
}): string {
  const insights: string[] = [];

  if (stats.criticalPatients && stats.totalPatients) {
    const criticalPercent = ((stats.criticalPatients / stats.totalPatients) * 100).toFixed(1);
    if (parseFloat(criticalPercent) > 20) {
      insights.push(`⚠️ Critical patient ratio is elevated at ${criticalPercent}%. Consider reviewing resource allocation, staffing levels, and ICU capacity. Implement early warning score (EWS) systems to identify deteriorating patients earlier.`);
    } else {
      insights.push(`✅ Critical patient ratio is at ${criticalPercent}%, within acceptable parameters. Continue monitoring with regular clinical assessments.`);
    }
  }

  if (stats.trends && stats.trends.length > 0) {
    const sorted = [...stats.trends].sort((a, b) => b.caseCount - a.caseCount);
    const topDisease = sorted[0];
    insights.push(`📊 **${topDisease.diseaseName}** shows the highest case count (${topDisease.caseCount}) and should be monitored closely. Consider implementing targeted screening and public health interventions.`);

    if (sorted.length > 2) {
      insights.push(`📈 **Disease Trend Summary:** ${sorted.slice(0, 4).map(d => `${d.diseaseName} (${d.caseCount} cases)`).join(" | ")}. Track week-over-week changes to identify emerging outbreaks.`);
    }

    const monsoonDiseases = sorted.filter(d =>
      ["dengue", "malaria", "chikungunya", "typhoid", "cholera", "leptospirosis"].some(
        md => d.diseaseName.toLowerCase().includes(md)
      )
    );
    if (monsoonDiseases.length > 0) {
      insights.push(`🦟 **Vector-borne/Waterborne Alert:** ${monsoonDiseases.map(d => d.diseaseName).join(", ")} cases detected. Recommend intensifying vector control measures, community awareness campaigns, and ensuring ORS/IV fluid stock levels.`);
    }
  }

  if (stats.avgOccupancy) {
    if (stats.avgOccupancy > 85) {
      insights.push(`🏥 **Hospital Occupancy Critical:** ${stats.avgOccupancy}% — approaching capacity. Implement discharge planning optimization, identify patients for step-down care, and activate overflow protocols.`);
    } else if (stats.avgOccupancy > 70) {
      insights.push(`🏥 **Hospital Occupancy Elevated:** ${stats.avgOccupancy}% — prepare contingency plans. Review elective admissions and optimize bed turnover.`);
    } else {
      insights.push(`🏥 Hospital occupancy at ${stats.avgOccupancy}% — capacity is adequate for current patient load.`);
    }
  }

  if (stats.totalHospitals) {
    insights.push(`🏨 **Network Coverage:** ${stats.totalHospitals} hospitals across India providing comprehensive healthcare coverage. Ensure all facilities maintain essential drug and supply stock levels.`);
  }

  insights.push(`💡 **Recommendations:** 1) Implement predictive analytics for patient admission patterns. 2) Regular health screenings reduce emergency admissions by 30%. 3) Ensure vaccination drive compliance across all facilities. 4) Review antimicrobial stewardship protocols to combat drug resistance.`);

  return insights.join("\n\n");
}
