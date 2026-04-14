import type { HospitalSeed } from "./india-hospitals-data";

const indianStatesDistricts: Record<string, { cities: string[]; lat: number; lng: number }> = {
  "Andhra Pradesh": { cities: ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Kadapa", "Rajahmundry", "Kakinada", "Tirupati", "Anantapur", "Eluru", "Ongole", "Chittoor", "Srikakulam", "Machilipatnam", "Tenali", "Proddatur", "Adoni", "Madanapalle", "Chirala", "Narasaraopet", "Hindupur", "Bhimavaram", "Tadepalligudem", "Gudivada"], lat: 15.9129, lng: 79.7400 },
  "Arunachal Pradesh": { cities: ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro", "Bomdila", "Along", "Tezu", "Roing", "Daporijo", "Changlang", "Namsai", "Khonsa"], lat: 28.2180, lng: 94.7278 },
  "Assam": { cities: ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon", "Karimganj", "Goalpara", "Sivasagar", "Dhubri", "North Lakhimpur", "Golaghat", "Haflong", "Diphu", "Barpeta", "Nalbari", "Mangaldoi", "Kokrajhar"], lat: 26.2006, lng: 92.9376 },
  "Bihar": { cities: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Purnia", "Arrah", "Bihar Sharif", "Begusarai", "Katihar", "Munger", "Chhapra", "Samastipur", "Hajipur", "Sasaram", "Dehri", "Motihari", "Siwan", "Nawada", "Buxar", "Jehanabad", "Aurangabad", "Bettiah", "Saharsa", "Madhubani"], lat: 25.0961, lng: 85.3131 },
  "Chhattisgarh": { cities: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon", "Jagdalpur", "Raigarh", "Ambikapur", "Mahasamund", "Dhamtari", "Chirmiri", "Kawardha", "Kanker", "Dongargarh"], lat: 21.2787, lng: 81.8661 },
  "Goa": { cities: ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim", "Curchorem", "Sanquelim", "Cuncolim", "Quepem"], lat: 15.2993, lng: 74.1240 },
  "Gujarat": { cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Anand", "Navsari", "Morbi", "Nadiad", "Surendranagar", "Bharuch", "Mehsana", "Bhuj", "Porbandar", "Palanpur", "Valsad", "Vapi", "Godhra", "Dahod", "Botad", "Amreli", "Deesa"], lat: 22.2587, lng: 71.1924 },
  "Haryana": { cities: ["Faridabad", "Gurugram", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula", "Bhiwani", "Sirsa", "Bahadurgarh", "Jind", "Thanesar", "Kaithal", "Rewari", "Palwal", "Mahendragarh", "Narnaul"], lat: 29.0588, lng: 76.0856 },
  "Himachal Pradesh": { cities: ["Shimla", "Dharamshala", "Solan", "Mandi", "Palampur", "Baddi", "Nahan", "Kullu", "Manali", "Hamirpur", "Una", "Bilaspur", "Chamba", "Kangra", "Sundernagar"], lat: 31.1048, lng: 77.1734 },
  "Jharkhand": { cities: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Hazaribagh", "Giridih", "Ramgarh", "Dumka", "Chaibasa", "Phusro", "Medininagar", "Chatra", "Gumla", "Lohardaga"], lat: 23.6102, lng: 85.2799 },
  "Karnataka": { cities: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi", "Kalaburagi", "Davanagere", "Ballari", "Tumakuru", "Shimoga", "Raichur", "Bidar", "Hospet", "Gadag", "Udupi", "Hassan", "Mandya", "Chikkamagaluru", "Bagalkot", "Chitradurga", "Haveri", "Yadgir", "Ramanagara", "Dharwad", "Kolar"], lat: 15.3173, lng: 75.7139 },
  "Kerala": { cities: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Kannur", "Kottayam", "Malappuram", "Kasaragod", "Idukki", "Pathanamthitta", "Wayanad"], lat: 10.8505, lng: 76.2711 },
  "Madhya Pradesh": { cities: ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa", "Murwara", "Singrauli", "Burhanpur", "Khandwa", "Bhind", "Chhindwara", "Guna", "Shivpuri", "Vidisha", "Damoh", "Mandsaur", "Khargone", "Neemuch", "Hoshangabad", "Itarsi"], lat: 22.9734, lng: 78.6569 },
  "Maharashtra": { cities: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Amravati", "Nanded", "Sangli", "Malegaon", "Jalgaon", "Akola", "Latur", "Ahmednagar", "Dhule", "Chandrapur", "Parbhani", "Ichalkaranji", "Jalna", "Ambarnath", "Bhiwandi", "Panvel", "Wardha", "Satara", "Beed", "Yavatmal", "Osmanabad", "Ratnagiri", "Sindhudurg"], lat: 19.7515, lng: 75.7139 },
  "Manipur": { cities: ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Kakching", "Ukhrul", "Senapati", "Tamenglong", "Chandel", "Jiribam"], lat: 24.6637, lng: 93.9063 },
  "Meghalaya": { cities: ["Shillong", "Tura", "Jowai", "Nongstoin", "Williamnagar", "Baghmara", "Resubelpara", "Nongpoh", "Mairang"], lat: 25.4670, lng: 91.3662 },
  "Mizoram": { cities: ["Aizawl", "Lunglei", "Saiha", "Champhai", "Serchhip", "Kolasib", "Lawngtlai", "Mamit"], lat: 23.1645, lng: 92.9376 },
  "Nagaland": { cities: ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Mon", "Phek"], lat: 26.1584, lng: 94.5624 },
  "Odisha": { cities: ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", "Baripada", "Bhadrak", "Jeypore", "Bargarh", "Jharsuguda", "Angul", "Dhenkanal", "Koraput", "Kendrapara", "Jajpur", "Rayagada", "Paradip", "Phulbani"], lat: 20.9517, lng: 85.0985 },
  "Punjab": { cities: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot", "Hoshiarpur", "Batala", "Moga", "Abohar", "Malerkotla", "Khanna", "Phagwara", "Muktsar", "Barnala", "Rajpura", "Firozpur", "Kapurthala", "Sangrur"], lat: 31.1471, lng: 75.3412 },
  "Rajasthan": { cities: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Bhilwara", "Alwar", "Sikar", "Sri Ganganagar", "Pali", "Bharatpur", "Tonk", "Kishangarh", "Beawar", "Hanumangarh", "Nagaur", "Jhunjhunu", "Banswara", "Dungarpur", "Churu", "Chittorgarh", "Bundi", "Barmer", "Jaisalmer"], lat: 27.0238, lng: 74.2179 },
  "Sikkim": { cities: ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Singtam", "Rangpo", "Jorethang"], lat: 27.5330, lng: 88.5122 },
  "Tamil Nadu": { cities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Dindigul", "Thanjavur", "Tiruvannamalai", "Tiruppur", "Ranipet", "Sivakasi", "Karur", "Namakkal", "Nagercoil", "Cuddalore", "Kumbakonam", "Kanchipuram", "Ramanathapuram", "Villupuram", "Dharmapuri", "Perambalur"], lat: 11.1271, lng: 78.6569 },
  "Telangana": { cities: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Ramagundam", "Khammam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet", "Siddipet", "Miryalaguda", "Jagtial", "Mancherial", "Kamareddy", "Sangareddy", "Medak", "Wanaparthy", "Narayanpet", "Vikarabad"], lat: 18.1124, lng: 79.0193 },
  "Tripura": { cities: ["Agartala", "Dharmanagar", "Udaipur", "Kailashahar", "Belonia", "Ambassa", "Khowai", "Sabroom", "Sonamura"], lat: 23.9408, lng: 91.9882 },
  "Uttar Pradesh": { cities: ["Lucknow", "Kanpur", "Agra", "Varanasi", "Allahabad", "Meerut", "Ghaziabad", "Noida", "Bareilly", "Aligarh", "Moradabad", "Gorakhpur", "Saharanpur", "Jhansi", "Mathura", "Firozabad", "Muzaffarnagar", "Shahjahanpur", "Rampur", "Farrukhabad", "Hapur", "Etawah", "Mirzapur", "Bulandshahr", "Sambhal", "Lakhimpur Kheri", "Unnao", "Hardoi", "Rae Bareli", "Sultanpur"], lat: 26.8467, lng: 80.9462 },
  "Uttarakhand": { cities: ["Dehradun", "Haridwar", "Rishikesh", "Haldwani", "Roorkee", "Rudrapur", "Kashipur", "Nainital", "Almora", "Pithoragarh", "Mussoorie", "Kotdwar", "Pauri", "Tehri", "Chamoli"], lat: 30.0668, lng: 79.0193 },
  "West Bengal": { cities: ["Kolkata", "Howrah", "Siliguri", "Durgapur", "Asansol", "Bardhaman", "Malda", "Baharampur", "Habra", "Kharagpur", "Shantiniketan", "Cooch Behar", "Jalpaiguri", "Raiganj", "Haldia", "Bankura", "Midnapore", "Krishnanagar", "Balurghat", "Basirhat"], lat: 22.9868, lng: 87.8550 },
  "Delhi": { cities: ["New Delhi", "Dwarka", "Rohini", "Saket", "Janakpuri", "Pitampura", "Shahdara", "Lajpat Nagar", "Karol Bagh", "Vasant Kunj", "Nehru Place", "Mayur Vihar", "Okhla", "Narela", "Najafgarh"], lat: 28.7041, lng: 77.1025 },
  "Jammu & Kashmir": { cities: ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Sopore", "Kathua", "Udhampur", "Rajouri", "Poonch", "Kupwara", "Pulwama", "Shopian", "Ganderbal", "Budgam", "Bandipora"], lat: 33.7782, lng: 76.5762 },
  "Ladakh": { cities: ["Leh", "Kargil", "Diskit", "Padum"], lat: 34.1526, lng: 77.5771 },
  "Chandigarh": { cities: ["Chandigarh", "Manimajra", "Mohali", "Panchkula", "Zirakpur"], lat: 30.7333, lng: 76.7794 },
  "Puducherry": { cities: ["Puducherry", "Karaikal", "Mahe", "Yanam", "Villianur", "Ozhukarai"], lat: 11.9416, lng: 79.8083 },
  "Andaman & Nicobar": { cities: ["Port Blair", "Car Nicobar", "Mayabunder", "Diglipur", "Rangat"], lat: 11.7401, lng: 92.6586 },
  "Dadra Nagar Haveli & Daman Diu": { cities: ["Silvassa", "Daman", "Diu", "Amli", "Khanvel"], lat: 20.1809, lng: 73.0169 },
  "Lakshadweep": { cities: ["Kavaratti", "Agatti", "Amini", "Andrott", "Minicoy"], lat: 10.5667, lng: 72.6417 },
};

const hospitalChains = [
  "Apollo", "Fortis", "Max", "Medanta", "Manipal", "Narayana Health", "KIMS", "Aster",
  "Columbia Asia", "Wockhardt", "Global", "Yashoda", "Care", "Rainbow", "Sterling",
  "Continental", "Shalby", "HCG", "NH", "Sahyadri", "Jupiter", "Kokilaben", "Lilavati",
  "SRM", "MIOT", "Kauvery", "Meenakshi", "GEM", "Sparsh", "Sakra", "BGS Gleneagles",
];

const govPrefixes = [
  "District Hospital", "Civil Hospital", "Government General Hospital",
  "Government Medical College Hospital", "Sub-District Hospital",
  "Community Health Center", "Primary Health Center", "Taluk Hospital",
  "Area Hospital", "ESI Hospital", "Railway Hospital",
  "Government Women & Children Hospital", "TB Hospital",
];

const privatePrefixes = [
  "Hospital", "Medical Center", "Multispeciality Hospital",
  "Super Speciality Hospital", "Health Center", "Nursing Home",
  "Children Hospital", "Maternity Hospital", "Eye Hospital",
  "Heart Institute", "Cancer Hospital", "Trauma Center",
];

const departments = [
  "General Medicine", "General Surgery", "Pediatrics", "Obstetrics & Gynecology",
  "Orthopedics", "Cardiology", "Neurology", "Pulmonology", "Dermatology",
  "ENT", "Ophthalmology", "Urology", "Nephrology", "Gastroenterology",
  "Oncology", "Psychiatry", "Radiology", "Anesthesiology", "Emergency Medicine",
  "Dental", "Physiotherapy", "Pathology", "Microbiology", "Endocrinology",
  "Rheumatology", "Plastic Surgery", "Vascular Surgery", "Neonatology",
  "Hematology", "Nuclear Medicine", "Pain Management", "Ayurveda", "Homeopathy",
];

const localNames = [
  "Arogya", "Jeevan", "Sanjeevani", "Shree", "Sri", "Sai", "Ram", "Krishna",
  "Lakshmi", "Ganesh", "Vinayaka", "Dhanvantari", "Ashirwad", "Aastha", "Priya",
  "Sunrise", "Sunshine", "Star", "City", "Metro", "Royal", "Golden", "Silver",
  "Diamond", "Pearl", "Lotus", "Tulip", "Orchid", "Mahatma", "Guru", "Seva",
  "Karuna", "Daya", "Sahara", "Nirmala", "Pushpa", "Indira", "Rajiv", "Gandhi",
  "Nehru", "Sardar", "Shivaji", "Ambedkar", "Tagore", "Vivekananda", "Raman",
  "Bose", "Patel", "Bharat", "Hindustan", "National", "United", "Modern",
  "New Life", "Life Care", "Health First", "Wellness", "Healing Touch", "Hope",
  "Grace", "Mercy", "Faith", "Trust", "Unity", "Premier", "Elite", "Supreme",
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function pickN<T>(arr: T[], n: number, rng: () => number): T[] {
  const shuffled = [...arr].sort(() => rng() - 0.5);
  return shuffled.slice(0, n);
}

function generatePhone(state: string, rng: () => number): string {
  const codes: Record<string, string[]> = {
    "Delhi": ["11"], "Maharashtra": ["22", "20", "712"], "Karnataka": ["80", "821"],
    "Tamil Nadu": ["44", "422", "452"], "Telangana": ["40"], "Gujarat": ["79", "261"],
    "West Bengal": ["33"], "Uttar Pradesh": ["522", "512", "562"], "Rajasthan": ["141", "291"],
    "Kerala": ["471", "484"], "Punjab": ["161", "183"], "Haryana": ["124", "129"],
    "Bihar": ["612"], "Madhya Pradesh": ["755", "731"], "Odisha": ["674"],
  };
  const areaCode = codes[state] ? pick(codes[state], rng) : String(Math.floor(rng() * 900) + 100);
  const num = String(Math.floor(rng() * 90000000) + 10000000);
  return `+91 ${areaCode} ${num.slice(0, 4)} ${num.slice(4)}`;
}

export function generateIndiaHospitals(targetCount: number = 70000): HospitalSeed[] {
  const rng = seededRandom(42);
  const hospitals: HospitalSeed[] = [];

  const stateEntries = Object.entries(indianStatesDistricts);
  const totalCities = stateEntries.reduce((sum, [, v]) => sum + v.cities.length, 0);

  for (const [state, { cities, lat: baseLat, lng: baseLng }] of stateEntries) {
    const stateShare = Math.max(
      Math.round((cities.length / totalCities) * targetCount),
      cities.length * 3
    );

    const hospitalsPerCity = Math.ceil(stateShare / cities.length);

    for (let ci = 0; ci < cities.length; ci++) {
      const city = cities[ci];
      const cityLat = baseLat + (ci * 0.15 - cities.length * 0.075) + (rng() - 0.5) * 0.3;
      const cityLng = baseLng + (ci * 0.12 - cities.length * 0.06) + (rng() - 0.5) * 0.3;

      for (let hi = 0; hi < hospitalsPerCity && hospitals.length < targetCount; hi++) {
        const typeRoll = rng();
        let name: string;
        let bedCap: number;
        let icuCap: number;
        let deptCount: number;

        if (hi === 0) {
          name = `District Hospital ${city}`;
          bedCap = 200 + Math.floor(rng() * 300);
          icuCap = 20 + Math.floor(rng() * 40);
          deptCount = 8 + Math.floor(rng() * 6);
        } else if (hi === 1 && cities.indexOf(city) < 5) {
          name = `Government Medical College Hospital ${city}`;
          bedCap = 500 + Math.floor(rng() * 1500);
          icuCap = 50 + Math.floor(rng() * 150);
          deptCount = 12 + Math.floor(rng() * 10);
        } else if (typeRoll < 0.12) {
          const chain = pick(hospitalChains, rng);
          name = `${chain} Hospital ${city}`;
          bedCap = 100 + Math.floor(rng() * 400);
          icuCap = 15 + Math.floor(rng() * 60);
          deptCount = 8 + Math.floor(rng() * 12);
        } else if (typeRoll < 0.25) {
          const prefix = pick(govPrefixes, rng);
          name = `${prefix} ${city}`;
          bedCap = 50 + Math.floor(rng() * 250);
          icuCap = 5 + Math.floor(rng() * 30);
          deptCount = 4 + Math.floor(rng() * 8);
        } else if (typeRoll < 0.5) {
          const localName = pick(localNames, rng);
          const suffix = pick(privatePrefixes, rng);
          name = `${localName} ${suffix}`;
          bedCap = 30 + Math.floor(rng() * 200);
          icuCap = 3 + Math.floor(rng() * 25);
          deptCount = 3 + Math.floor(rng() * 8);
        } else if (typeRoll < 0.7) {
          const localName = pick(localNames, rng);
          name = `${localName} Nursing Home`;
          bedCap = 10 + Math.floor(rng() * 50);
          icuCap = 1 + Math.floor(rng() * 5);
          deptCount = 2 + Math.floor(rng() * 4);
        } else if (typeRoll < 0.85) {
          name = `PHC ${city} - Unit ${hi}`;
          bedCap = 6 + Math.floor(rng() * 24);
          icuCap = 0;
          deptCount = 2 + Math.floor(rng() * 3);
        } else {
          name = `CHC ${city} - Block ${hi}`;
          bedCap = 30 + Math.floor(rng() * 70);
          icuCap = 2 + Math.floor(rng() * 8);
          deptCount = 3 + Math.floor(rng() * 5);
        }

        const selectedDepts = pickN(departments, deptCount, rng);
        const occupancyRate = 0.5 + rng() * 0.45;
        const lat = cityLat + (rng() - 0.5) * 0.08;
        const lng = cityLng + (rng() - 0.5) * 0.08;

        const areas = [`Sector ${Math.floor(rng() * 50) + 1}`, "Main Road", "Civil Lines", "Station Road", "Market Area", "Industrial Area", "Old City", "New Colony", "Ring Road", "Highway", "Bypass Road", "Medical College Road", "Hospital Road", "Gandhi Nagar", "Nehru Nagar", "MG Road"];
        const area = pick(areas, rng);

        const emailPrefix = name.toLowerCase()
          .replace(/[^a-z0-9\s]/g, "")
          .replace(/\s+/g, ".")
          .slice(0, 30);

        hospitals.push({
          name,
          country: "India",
          state,
          city,
          area,
          location: `${area}, ${city}, ${state}`,
          latitude: Math.round(lat * 10000) / 10000,
          longitude: Math.round(lng * 10000) / 10000,
          specializedDepartments: selectedDepts,
          bedCapacity: bedCap,
          icuCapacity: icuCap,
          currentOccupancy: Math.floor(bedCap * occupancyRate),
          contactNumber: generatePhone(state, rng),
          email: `${emailPrefix}@hospital.in`,
        });
      }
    }
  }

  while (hospitals.length < targetCount) {
    const [state, { cities, lat, lng }] = pick(stateEntries, rng);
    const city = pick(cities, rng);
    const localName = pick(localNames, rng);
    const suffix = pick(privatePrefixes, rng);
    const bedCap = 15 + Math.floor(rng() * 100);
    const selectedDepts = pickN(departments, 2 + Math.floor(rng() * 5), rng);

    hospitals.push({
      name: `${localName} ${suffix} ${city}`,
      country: "India",
      state,
      city,
      area: pick(["Main Road", "Station Area", "Market", "Colony", "Nagar"], rng),
      location: `${city}, ${state}`,
      latitude: Math.round((lat + (rng() - 0.5) * 2) * 10000) / 10000,
      longitude: Math.round((lng + (rng() - 0.5) * 2) * 10000) / 10000,
      specializedDepartments: selectedDepts,
      bedCapacity: bedCap,
      icuCapacity: Math.floor(bedCap * 0.1),
      currentOccupancy: Math.floor(bedCap * (0.4 + rng() * 0.5)),
      contactNumber: generatePhone(state, rng),
      email: `${localName.toLowerCase().replace(/\s/g, "")}${Math.floor(rng() * 999)}@hospital.in`,
    });
  }

  return hospitals.slice(0, targetCount);
}
