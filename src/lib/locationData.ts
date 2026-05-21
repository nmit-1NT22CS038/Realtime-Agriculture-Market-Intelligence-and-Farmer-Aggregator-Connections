// src/lib/locationData.ts

export const DISTRICT_MARKETS = {
  "Bangalore": ["Bangalore", "Doddaballa Pur", "Ramanagara", "Hoskote", "Kanakapura"],
  "Shimoga": ["Shimoga", "Bhadravathi", "Shikaripura", "Sorabha", "Shimogga(Theertahalli)", "Hosanagar", "Sagar"],
  "Gadag": ["Gadag", "Laxmeshwar", "Mundaragi", "Nargunda", "Rona"],
  "Kolar": ["Chintamani", "Bangarpet", "Kolar", "Chickkaballapura", "Gowribidanoor", "Malur", "Mulabagilu", "Srinivasapur"],
  "Dharwad": ["Hubli", "Dharwar", "Annigeri", "Kalagategi", "Kundagol"],
  "Mysore": ["Mysore", "Piriya Pattana", "Nanjangud", "K.R.Nagar", "Santhesargur", "Hunsur", "T. Narasipura"],
  "Bellary": ["Bellary", "Kottur", "Hospet", "H.B. Halli", "Hoovinahadagali", "Sirguppa"],
  "Davangere": ["Davangere", "Harappana Halli", "Honnali", "Harihara", "Jagalur", "Channagiri"],
  "Belgaum": ["Belgaum", "Soundati", "Ramdurga", "Sankeshwar", "Gokak", "Bailahongal", "Kudchi", "Athani", "Nandagada", "Nippani"],
  "Bidar": ["Bidar", "Basava Kalayana", "Humanabad", "Aurad"],
  "Raichur": ["Raichur", "Sindhanur", "Manvi", "Lingasugur", "Devadurga"],
  "Hassan": ["Hassan", "Arasikere", "Channarayapatna", "Holenarsipura", "Arakalgud", "Belur", "Sakaleshpura"],
  "Haveri": ["Ranebennur", "Haveri", "Savanur", "Shiggauv", "Hanagal", "Hirekerur", "Byadagi"],
  "Koppal": ["Gangavathi", "Kustagi", "Koppal", "Yalburga"],
  "Chikmagalur": ["Chikkamagalore", "Kadur", "Bagepalli", "Tarikere", "Koppa", "Moodigere", "Sringeri"],
  "Kalburgi": ["Kalburgi", "Chittapur", "Sedam", "Chincholi"],
  "Tumkur": ["Tumkur", "Madhugiri", "Tiptur", "Sira", "Gubbi", "Kunigal"],
  "Chitradurga": ["Chitradurga", "Challakere", "Hosadurga", "Hiriyur", "Holalkere"],
  "Bijapur": ["Bijapur", "Sindagi", "Talicot"],
  "Bagalkot": ["Bagalakot", "Badami", "Jamakhandi", "Mhalingapur", "Hungund"],
  "Mangalore": ["Mangalore", "Puttur", "Bantwal", "Belthangdi", "Sulya"],
  "Udupi": ["Udupi", "Kundapura", "Karkala"],
  "Mandya": ["Nagamangala", "Mandya", "K.R. Pet", "Maddur", "Srirangapattana", "Malavalli", "Pandavapura"],
  "Karwar": ["Mundgod", "Haliyala", "Kumta", "Yellapur", "Karwar", "Honnavar", "Sirsi", "Siddapur"],
  "Chamrajnagar": ["Gundlupet", "Kollegal", "Chamaraj Nagar"],
  "Yadgiri": ["Yadgiri", "Shorapur", "Shahpur"],
  "Madikeri": ["Somvarpet", "Gonikappal", "Madikeri"],
};

export const DISTRICTS = Object.keys(DISTRICT_MARKETS);

export const COMMODITY_VARIETIES = {
  "Maize": ["Local", "Hybrid/Local", "Yellow", "Other", "Sweet Corn (For Biscuits)", "Popcorn", "Jawari"],
  "Rice": [
    "Broken Rice", "Fine", "Medium", "Coarse", "Other", "Sona", "CR 1009 (Coarse) Boiled",
    "Hansa", "Sarbati Raw", "Kattasambar", "Jaya", "Dappa", "IR-8", "Pusa Basmati Raw (Old)",
    "IR 20", "Kachha Basmati", "Sona Fine", "Basumathi", "Pusa Basmati Raw (New)",
    "Sona Mansoori Non Basmati", "IR 20 Fine Raw", "Sona Medium", "Coarse (I.R.20)",
    "Govt. Quality", "Hassan Dappa", "Hamsa St.", "Masuri", "GMR Steam",
    "Zeeraga Samba Rawrice", "Fine(Basmati)", "EMR Boiled", "IR 20 Medium Boiled",
    "Tallahamsa (Bilihamsa)", "Sadharan", "Boiled Rice", "Kaddi", "Pusa Basmati Sela (Old)",
    "Rice Floor", "Super Fine"
  ],
  "Onion": ["Onion", "Local", "Other", "Puna", "Pusa-Red", "Telagi", "Beelary-Red", "Bangalore-Samall", "White", "Bombay (U.P.)", "Hybrid"],
  "Potato": ["Potato", "Local", "Other", "Chandermukhi", "Jalander", "Chips", "Sinduri"],
  "Groundnut": ["Gejje", "Big (With Shell)", "Balli/Habbu", "Other", "Gungri (With Shell)", "Natte", "Hybrid", "Bold"],
  "Jowar": ["Jowar (White)", "Jowar Hybrid", "Local", "Hybrid", "Other", "Jowar (Yellow)", "Annigeri", "Bijapur", "Red"],
  "Ragi": ["Local", "Fine", "Red", "Hybrid", "Other", "Medium", "Feeds (Poultry Quality)", "Medium Fine"],
  "Cotton": [
    "GCH", "LH-1556", "Varalakshmi (Ginned)", "F-1054", "MCU 5", "LD-327",
    "H-4(A) 27mm FIne", "Other", "Suyodhar (Ginned)", "Jayadhar", "Hampi (Ginned)",
    "Krishna", "Cotton (Ginned)", "Aka-1 (Unginned)", "R-51 (Ginned)", "N-44",
    "Jayadhar 23mm-FIne"
  ],
  "Wheat": ["Local", "Super Fine", "Red", "White", "Medium", "Mexican", "Other", "Sona", "H.D.", "Jawari", "Bansi", "Kirthi", "Coarse", "Medium Fine"],
  "Arhar Dal": ["Arhar Dal"],
  "Bengal Gram Dal": ["Bengal Gram Dal"],
  "Green Gram Dal": ["Green Gram Dal"],
  "Foxtail Millet": ["Navane Hybrid", "Other"],
  "Cashewnuts": ["FAQ"],
};

export const COMMODITIES = Object.keys(COMMODITY_VARIETIES);

export const SEASONS = ["Kharif", "Rabi", "Summer"];