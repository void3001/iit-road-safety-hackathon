const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Load roads dataset
let ROADS_DATA = [];
try {
    const roadsPath = path.join(__dirname, 'scratch_roads_data.json');
    if (fs.existsSync(roadsPath)) {
        ROADS_DATA = JSON.parse(fs.readFileSync(roadsPath, 'utf8'));
    }
} catch (e) {
    console.warn('⚠️ Could not load scratch_roads_data.json in proxy.js:', e.message);
}

// 100% Real Major Indian Hospitals
const HOSPITALS_DATA = [
    { name: "All India Institute of Medical Sciences (AIIMS)", city: "Delhi", location: [28.5672, 77.2100], phone: "011-26588500", authority: "Ministry of Health & Family Welfare, Govt of India" },
    { name: "Sanjay Gandhi Postgraduate Institute of Medical Sciences (SGPGIMS)", city: "Lucknow", location: [26.7761, 80.9388], phone: "0522-2668700", authority: "Government of Uttar Pradesh" },
    { name: "Kokilaben Dhirubhai Ambani Hospital", city: "Mumbai", location: [19.1312, 72.8256], phone: "022-42696969", authority: "Reliance Group Healthcare Trust" },
    { name: "Sawai Man Singh (SMS) Hospital", city: "Jaipur", location: [26.9022, 75.8164], phone: "0141-2560291", authority: "Government of Rajasthan" },
    { name: "NIMHANS Hospital", city: "Bengaluru", location: [12.9430, 77.5992], phone: "080-26995000", authority: "Ministry of Health, Govt of India" },
    { name: "Civil Hospital", city: "Ahmedabad", location: [23.0519, 72.6033], phone: "079-22683721", authority: "Government of Gujarat" },
    { name: "Sher-i-Kashmir Institute of Medical Sciences (SKIMS)", city: "Srinagar", location: [34.1378, 74.8020], phone: "0194-2401189", authority: "Govt of Jammu & Kashmir" },
    { name: "Rajiv Gandhi Government General Hospital", city: "Chennai", location: [13.0805, 80.2764], phone: "044-25305000", authority: "Government of Tamil Nadu" },
    { name: "PSG Hospitals", city: "Coimbatore", location: [11.0256, 77.0033], phone: "0422-2570170", authority: "PSG & Sons Charities Trust" },
    { name: "Medanta - The Medicity", city: "Gurugram", location: [28.4278, 77.0422], phone: "0124-4141414", authority: "Global Health Limited" },
    { name: "Government Rajaji Hospital", city: "Madurai", location: [9.9267, 78.1233], phone: "0452-2532535", authority: "Government of Tamil Nadu" },
    { name: "Mahatma Gandhi Memorial Government Hospital", city: "Trichy", location: [10.8122, 78.6856], phone: "0431-2415525", authority: "Government of Tamil Nadu" },
    { name: "Government Mohan Kumaramangalam Medical College Hospital", city: "Salem", location: [11.6644, 78.1489], phone: "0427-2211515", authority: "Government of Tamil Nadu" },
    { name: "Tiruppur Government Headquarters Hospital", city: "Tiruppur", location: [11.1097, 77.3489], phone: "0421-2242108", authority: "Government of Tamil Nadu" },
    { name: "Government Ramanathapuram Medical College Hospital", city: "Ramanathapuram", location: [9.3661, 78.8378], phone: "04567-220060", authority: "Government of Tamil Nadu" },
    { name: "Pioneer Hospital (Multi-Specialty)", city: "Ramanathapuram", location: [9.3621, 78.8322], phone: "04567-221234", authority: "Private Medical Trust" }
];

// 100% Real Major Indian Police Headquarters/Stations
const POLICE_DATA = [
    { name: "Central Delhi Police Station / Parliament Street Station", city: "Delhi", location: [28.6276, 77.2144], phone: "011-23361100", authority: "Delhi Police" },
    { name: "Hazratganj Police Station", city: "Lucknow", location: [26.8488, 80.9436], phone: "0522-2206159", authority: "Uttar Pradesh Police" },
    { name: "Colaba Police Station", city: "Mumbai", location: [18.9150, 72.8276], phone: "022-22856817", authority: "Mumbai Police" },
    { name: "Sodala Police Station", city: "Jaipur", location: [26.9067, 75.7767], phone: "0141-2292323", authority: "Rajasthan Police" },
    { name: "Kalasipalya Police Station", city: "Bengaluru", location: [12.9609, 77.5761], phone: "080-22942549", authority: "Bengaluru City Police" },
    { name: "Navrangpura Police Station", city: "Ahmedabad", location: [23.0367, 72.5614], phone: "079-26443430", authority: "Gujarat Police" },
    { name: "Kothibagh Police Station", city: "Srinagar", location: [34.0722, 74.8156], phone: "0194-2452093", authority: "Jammu & Kashmir Police" },
    { name: "Flower Bazaar Police Station", city: "Chennai", location: [13.0903, 80.2801], phone: "044-23452582", authority: "Greater Chennai Police" },
    { name: "Peelamedu Police Station", city: "Coimbatore", location: [11.0267, 77.0100], phone: "0422-2300444", authority: "Coimbatore City Police" },
    { name: "Sector 58 Police Station", city: "Noida", location: [28.5992, 77.3622], phone: "0120-2444331", authority: "Gautam Buddh Nagar Police (UP)" },
    { name: "Tallakulam Police Station", city: "Madurai", location: [9.9325, 78.1367], phone: "0452-2530084", authority: "Madurai City Police (TN)" },
    { name: "Cantonment Police Station", city: "Trichy", location: [10.8033, 78.6867], phone: "0431-2415301", authority: "Trichy City Police (TN)" },
    { name: "Hasthampatti Police Station", city: "Salem", location: [11.6733, 78.1567], phone: "0427-2416041", authority: "Salem City Police (TN)" },
    { name: "Tiruppur North Police Station", city: "Tiruppur", location: [11.1156, 77.3511], phone: "0421-2200100", authority: "Tiruppur City Police (TN)" },
    { name: "Ramanathapuram Town Police Station", city: "Ramanathapuram", location: [9.3695, 78.8364], phone: "04567-220021", authority: "Tamil Nadu Police (Ramanathapuram District)" },
    { name: "Kenikarai Police Station", city: "Ramanathapuram", location: [9.3562, 78.8290], phone: "04567-230300", authority: "Tamil Nadu Police (Ramanathapuram District)" }
];

// ============================================================
// CONFIGURATION
// ============================================================
require('dotenv').config();
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL   = 'llama-3.1-8b-instant';
const PORT         = 3001;

// ============================================================
// FIREBASE ADMIN SDK — reads live Firestore data
// ============================================================
let db = null;
let firebaseReady = false;

async function initFirebase() {
    try {
        const admin = require('firebase-admin');

        // Use application default credentials if available, otherwise use project ID only
        // For local dev without a service account, we use the REST API fallback below
        if (admin.apps.length === 0) {
            admin.initializeApp({
                projectId: 'road-safety-71e0b'
            });
        }
        db = admin.firestore();
        firebaseReady = true;
        console.log('✅ Firebase Admin connected to road-safety-71e0b');
    } catch(e) {
        console.warn('⚠️  Firebase Admin not available:', e.message);
        console.warn('    Using demo data. To enable live data, run: npm install firebase-admin');
        firebaseReady = false;
    }
}

// Haversine formula to compute great-circle distance between two points in km
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Helper to fetch nearby places from Mappls REST API
function fetchMapplsNearby(lat, lng, keyword) {
    return new Promise((resolve) => {
        const staticKey = 'pjprbhnnpkyuqazaihagotjchdzvrtqwiccr';
        const url = `https://search.mappls.com/search/places/nearby/json?access_token=${staticKey}&refLocation=${lat},${lng}&keywords=${encodeURIComponent(keyword)}`;
        
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        };

        https.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed.suggestedLocations || []);
                } catch (e) {
                    resolve([]);
                }
            });
        }).on('error', (err) => {
            console.error(`⚠️ Mappls Nearby API Error (${keyword}):`, err.message);
            resolve([]);
        });
    });
}

// Helper to geocode address using Mappls Geocoding REST API
function fetchMapplsGeocode(address) {
    return new Promise((resolve) => {
        const staticKey = 'pjprbhnnpkyuqazaihagotjchdzvrtqwiccr';
        const url = `https://search.mappls.com/search/address/geocode?access_token=${staticKey}&address=${encodeURIComponent(address)}`;
        
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        };

        https.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.copResults && parsed.copResults.latitude) {
                        resolve({
                            lat: parseFloat(parsed.copResults.latitude),
                            lng: parseFloat(parsed.copResults.longitude),
                            address: parsed.copResults.formattedAddress || address
                        });
                    } else if (parsed.suggestedLocations && parsed.suggestedLocations[0]) {
                        const first = parsed.suggestedLocations[0];
                        resolve({
                            lat: parseFloat(first.latitude),
                            lng: parseFloat(first.longitude),
                            address: first.placeName || first.placeAddress || address
                        });
                    } else {
                        resolve(null);
                    }
                } catch (e) {
                    resolve(null);
                }
            });
        }).on('error', (err) => {
            console.error('⚠️ Mappls Geocode REST API Error:', err.message);
            resolve(null);
        });
    });
}

// Helper to reverse geocode coordinates using Mappls Reverse Geocoding REST API
function fetchMapplsReverseGeocode(lat, lng) {
    return new Promise((resolve) => {
        const staticKey = 'pjprbhnnpkyuqazaihagotjchdzvrtqwiccr';
        const url = `https://search.mappls.com/search/address/rev-geocode?access_token=${staticKey}&lat=${lat}&lon=${lng}`;
        
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        };

        https.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed && parsed.results && parsed.results[0]) {
                        resolve(parsed.results[0].formattedAddress || parsed.results[0].subDistrict || parsed.results[0].district || null);
                    } else if (parsed && parsed.response && parsed.response[0]) {
                        resolve(parsed.response[0].formatted_address || null);
                    } else {
                        resolve(null);
                    }
                } catch (e) {
                    resolve(null);
                }
            });
        }).on('error', (err) => {
            console.error('⚠️ Mappls Rev-Geocode REST API Error:', err.message);
            resolve(null);
        });
    });
}

// Function to detect Tamil Nadu cities/districts in chat message and geocode them
async function detectAndGeocodeLocation(message) {
    const msg = message.toLowerCase();
    
    // Comprehensive offline dictionary of all Tamil Nadu districts/cities for instant 100% reliable geocoding
    const TN_LOCAL_COORDINATES = {
        "ramanathapuram": [9.3639, 78.8394],
        "ramanthapuram": [9.3639, 78.8394],
        "ramanathupuram": [9.3639, 78.8394],
        "ramnad": [9.3639, 78.8394],
        "madurai": [9.9252, 78.1198],
        "mdu": [9.9252, 78.1198],
        "coimbatore": [11.0168, 76.9558],
        "kovai": [11.0168, 76.9558],
        "cbe": [11.0168, 76.9558],
        "chennai": [13.0827, 80.2707],
        "madras": [13.0827, 80.2707],
        "trichy": [10.8122, 78.6856],
        "tiruchirappalli": [10.8122, 78.6856],
        "salem": [11.6644, 78.1489],
        "tiruppur": [11.1097, 77.3489],
        "tirupur": [11.1097, 77.3489],
        "erode": [11.3410, 77.7172],
        "vellore": [12.9165, 79.1325],
        "thanjavur": [10.7870, 79.1378],
        "tanjore": [10.7870, 79.1378],
        "dindigul": [10.3673, 77.9806],
        "tirunelveli": [8.7139, 77.7567],
        "nellai": [8.7139, 77.7567],
        "thoothukudi": [8.7642, 78.1348],
        "tuticorin": [8.7642, 78.1348],
        "kanyakumari": [8.0883, 77.5385],
        "nagercoil": [8.1833, 77.4119],
        "karur": [10.9601, 78.0766],
        "namakkal": [11.2189, 78.1672],
        "krishnagiri": [12.5186, 78.2137],
        "dharmapuri": [12.1211, 78.1582],
        "hosur": [12.7409, 77.8253],
        "theni": [10.0150, 77.4830],
        "virudhunagar": [9.5680, 77.9624],
        "sivaganga": [9.8433, 78.4809],
        "sivagangai": [9.8433, 78.4809],
        "pudukkottai": [10.3797, 78.8205],
        "nagapattinam": [10.7672, 79.8449],
        "tiruvarur": [10.7725, 79.6361],
        "cuddalore": [11.7480, 79.7714],
        "villupuram": [11.9401, 79.4861],
        "tiruvannamalai": [12.2272, 79.0700],
        "kanchipuram": [12.8342, 79.7036],
        "tiruvallur": [13.1438, 79.9079],
        "chengalpattu": [12.6932, 79.9754],
        "ranipet": [12.9272, 79.3328],
        "tirupattur": [12.4926, 78.5678],
        "kallakurichi": [11.7380, 78.9624],
        "tenkasi": [8.9591, 77.3139],
        "mayiladuthurai": [11.1018, 79.6522],
        "ariyalur": [11.1396, 79.0746],
        "perambalur": [11.2335, 78.8819],
        "nilgiris": [11.4167, 76.7000],
        "ooty": [11.4102, 76.6950],
        "udhagamandalam": [11.4102, 76.6950]
    };

    const tnLocations = Object.keys(TN_LOCAL_COORDINATES);
    let detectedName = null;
    
    // Look for phrases like "in <location>", "at <location>", "near <location>", "from <location>", "to <location>"
    const prepositionPatterns = [
        /\bin\s+([a-zA-Z\s]+)/i,
        /\bat\s+([a-zA-Z\s]+)/i,
        /\bnear\s+([a-zA-Z\s]+)/i,
        /\bfrom\s+([a-zA-Z\s]+)/i,
        /\bto\s+([a-zA-Z\s]+)/i
    ];

    for (const pattern of prepositionPatterns) {
        const match = message.match(pattern);
        if (match && match[1]) {
            const candidate = match[1].trim().toLowerCase();
            for (const loc of tnLocations) {
                if (candidate.includes(loc)) {
                    detectedName = loc;
                    break;
                }
            }
        }
        if (detectedName) break;
    }

    // Direct search if no preposition pattern matched
    if (!detectedName) {
        for (const loc of tnLocations) {
            const regex = new RegExp(`\\b${loc}\\b`, 'i');
            if (regex.test(msg)) {
                detectedName = loc;
                break;
            }
        }
    }

    if (detectedName) {
        // 1. Instant dictionary resolve (100% reliable)
        if (TN_LOCAL_COORDINATES[detectedName]) {
            const coords = TN_LOCAL_COORDINATES[detectedName];
            const cleanName = detectedName.charAt(0).toUpperCase() + detectedName.slice(1);
            const formatted = ["ramanthapuram", "ramanathupuram", "ramnad"].includes(detectedName) 
                ? "Ramanathapuram, Tamil Nadu" 
                : `${cleanName}, Tamil Nadu`;
                
            console.log(`[GEODECODING] Instant local match! Resolved "${detectedName}" to [${coords[0]}, ${coords[1]}]`);
            return {
                lat: coords[0],
                lng: coords[1],
                address: formatted
            };
        }

        // 2. MapmyIndia REST Geocoding API fallback
        console.log(`[GEODECODING] Detected location "${detectedName}" in user query. Fetching coordinates from MapmyIndia...`);
        let searchString = detectedName;
        if (["ramanthapuram", "ramanathupuram", "ramnad"].includes(detectedName)) {
            searchString = "Ramanathapuram, Tamil Nadu";
        } else {
            searchString = `${detectedName.charAt(0).toUpperCase() + detectedName.slice(1)}, Tamil Nadu`;
        }
        
        const geocodeResult = await fetchMapplsGeocode(searchString);
        if (geocodeResult) {
            console.log(`[GEODECODING] Successfully geocoded "${searchString}" to [${geocodeResult.lat}, ${geocodeResult.lng}] (${geocodeResult.address})`);
            return geocodeResult;
        }
    }
    return null;
}


// ============================================================
// CONTEXT FETCHER — queries Firestore and safety datasets
// ============================================================
async function fetchRelevantContext(message, userLat, userLng, userAddress = null) {
    const msg = message.toLowerCase();
    let context = '';

    // --- Detect complaint ID query (e.g. "RW-8490", "#8490") ---
    const complaintIdMatch = message.match(/(?:rw[-#]?)\s*(\d{4,6})/i) || message.match(/#(\d{4,6})/);

    if (complaintIdMatch) {
        const complaintId = `RW-${complaintIdMatch[1]}`;

        if (firebaseReady && db) {
            try {
                // Query Firestore by complaint id field
                const snap = await db.collection('complaints').where('id', '==', complaintId).limit(1).get();
                if (!snap.empty) {
                    const data = snap.docs[0].data();
                    context = `LIVE COMPLAINT DATA FROM FIREBASE:\n${JSON.stringify(data, null, 2)}`;
                    console.log(`[FIREBASE] Found complaint ${complaintId}`);
                } else {
                    context = `No complaint found with ID ${complaintId} in Firebase.`;
                }
            } catch(e) {
                console.warn('[FIREBASE] Complaint query failed:', e.message);
                context = getFallbackComplaint(complaintId);
            }
        } else {
            context = getFallbackComplaint(complaintId);
        }
    }

    // --- Detect specific highway / expressway query ---
    let roadContext = '';
    for (const road of ROADS_DATA) {
        // match name, clean version without "Expressway/Highway", or sNo
        const cleanName = road.name.replace(/Expressway|Greenfield|Greenfield Expressway|Highway|Road|Project/gi, '').trim().toLowerCase();
        if (msg.includes(road.name.toLowerCase()) || (cleanName.length > 3 && msg.includes(cleanName))) {
            roadContext = `ROAD INFRASTRUCTURE INFO (PUBLIC WORKS):
- Road Name: ${road.name}
- Responsible Contractor: ${road.contractor}
- PWD/NHAI/State Authority: ${road.authority}
- State/Jurisdiction: ${road.state}
- Sanctioned Budget: ₹${road.sanctionedBudget} Crores
- Contract Amount (utilized): ₹${road.contractAmount} Crores
- Designated Engineer Email: ${road.engineerEmail}
- Last Relaying Date: ${road.lastRelaying}
- Warranty Expiry Date: ${road.warrantyExpiry}
- Quality Score: ${road.qualityScore}/10 (${road.condition})\n`;
            console.log(`[CHATBOT] Matched road: ${road.name}`);
            break;
        }
    }
    
    // Fallback simple road name matches (e.g. NH-544) if no expressway matched
    if (!roadContext) {
        const roadMatch = message.match(/\b(nh[-\s]?\d+|sh[-\s]?\d+|mdr[-\s]?\d+)\b/i);
        if (roadMatch) {
            const roadName = roadMatch[1].toUpperCase().replace(/\s/, '-');
            roadContext = getFallbackRoad(roadName);
        }
    }
    context += roadContext;

    // --- Detect City in query ---
    const cities = ["delhi", "mumbai", "bengaluru", "lucknow", "jaipur", "noida", "srinagar", "chennai", "coimbatore", "ahmedabad", "gurugram", "madurai", "trichy", "salem", "tiruppur"];
    let matchedCity = "";
    for (const city of cities) {
        if (msg.includes(city)) {
            matchedCity = city;
            break;
        }
    }

    // --- Detect safety intents ---
    const isPoliceIntent = /\b(theft|steal|stole|stolen|rob|robbery|mugged|jewel|money|purse|wallet|thief|crime|snatch|cheat|fraud|police|fir|harass|fight|burglar|burglary|assault)\b/i.test(msg);
    const isHospitalIntent = /\b(accident|crash|hurt|blood|bleed|bone|fracture|injury|hospital|emergency|stroke|heart|patient|ambulance|doctor|medical|pain|first aid)\b/i.test(msg);

    // --- Hospital Info ---
    let hospitalMatched = false;
    for (const hosp of HOSPITALS_DATA) {
        const nameWords = hosp.name.toLowerCase().split(' ');
        const firstTwo = nameWords.slice(0, 2).join(' ');
        const isDirectMatch = msg.includes(hosp.name.toLowerCase()) || msg.includes(firstTwo);
        const isCityMatch = matchedCity && hosp.city.toLowerCase() === matchedCity;

        if (isDirectMatch || (isHospitalIntent && isCityMatch)) {
            context += `\nEMERGENCY HOSPITAL INFO (MATCHED):
- Hospital Name: ${hosp.name}
- Authority/Affiliation: ${hosp.authority}
- City: ${hosp.city}
- Emergency Phone: ${hosp.phone}
- Map Coordinates: ${hosp.location.join(', ')}\n`;
            console.log(`[CHATBOT] Matched hospital: ${hosp.name}`);
            hospitalMatched = true;
            if (isDirectMatch) break;
        }
    }

    // Fallback context with all major hospitals if intent is detected but no specific city/hospital matched and no GPS coordinates are available
    if (isHospitalIntent && !hospitalMatched && (!userLat || !userLng)) {
        context += `\nALL VERIFIED INDIAN EMERGENCY HOSPITALS DATA:
${HOSPITALS_DATA.map(h => `- ${h.name} (${h.city}): Phone ${h.phone}, Authority: ${h.authority}`).join('\n')}\n`;
    }

    // --- Police Station Info ---
    let policeMatched = false;
    for (const ps of POLICE_DATA) {
        const firstWord = ps.name.toLowerCase().split(' ')[0];
        const isDirectMatch = msg.includes(ps.name.toLowerCase()) || msg.includes(firstWord + ' police');
        const isCityMatch = matchedCity && ps.city.toLowerCase() === matchedCity;

        if (isDirectMatch || (isPoliceIntent && isCityMatch)) {
            context += `\nEMERGENCY POLICE STATION INFO (MATCHED):
- Station Name: ${ps.name}
- Department/Authority: ${ps.authority}
- District/City: ${ps.city}
- Phone Contact: ${ps.phone}
- Map Coordinates: ${ps.location.join(', ')}\n`;
            console.log(`[CHATBOT] Matched police station: ${ps.name}`);
            policeMatched = true;
            if (isDirectMatch) break;
        }
    }

    // Fallback context with all major police stations if intent is detected but no specific city/station matched and no GPS coordinates are available
    if (isPoliceIntent && !policeMatched && (!userLat || !userLng)) {
        context += `\nALL VERIFIED INDIAN POLICE STATIONS DATA:
${POLICE_DATA.map(p => `- ${p.name} (${p.city}): Phone ${p.phone}, Authority: ${p.authority}`).join('\n')}\n`;
    }

    // --- Detect general stats query ---
    if (msg.includes('total') || msg.includes('how many') || msg.includes('stats') ||
        msg.includes('statistic') || msg.includes('dashboard') || msg.includes('overview')) {

        if (firebaseReady && db) {
            try {
                const statsDoc = await db.collection('stats').doc('global').get();
                if (statsDoc.exists) {
                    context += `\nLIVE PLATFORM STATS FROM FIREBASE:\n${JSON.stringify(statsDoc.data(), null, 2)}`;
                    console.log('[FIREBASE] Loaded global stats');
                }
            } catch(e) {
                console.warn('[FIREBASE] Stats query failed:', e.message);
                context += `\n` + getFallbackStats();
            }
        } else {
            context += `\n` + getFallbackStats();
        }
    }

    // --- Inject Closest Safety Centers by user's GPS coordinates (with MapmyIndia / Mappls live search) ---
    if (userLat && userLng) {
        let livePolice = [];
        let liveHospitals = [];

        try {
            const [polRes, hospRes] = await Promise.all([
                fetchMapplsNearby(userLat, userLng, 'police'),
                fetchMapplsNearby(userLat, userLng, 'hospital')
            ]);

            if (polRes && polRes.length > 0) {
                livePolice = polRes.map(item => ({
                    name: item.placeName || 'Nearby Police Station',
                    city: item.placeAddress || 'Local Area',
                    location: [parseFloat(item.latitude), parseFloat(item.longitude)],
                    phone: item.phoneNumber || '100',
                    authority: 'Police Department'
                })).filter(p => !isNaN(p.location[0]) && !isNaN(p.location[1]));
            }

            if (hospRes && hospRes.length > 0) {
                liveHospitals = hospRes.map(item => ({
                    name: item.placeName || 'Nearby Hospital',
                    city: item.placeAddress || 'Local Area',
                    location: [parseFloat(item.latitude), parseFloat(item.longitude)],
                    phone: item.phoneNumber || '108',
                    authority: 'Medical Center'
                })).filter(h => !isNaN(h.location[0]) && !isNaN(h.location[1]));
            }
        } catch (err) {
            console.warn('⚠️ Mappls fetch in proxy failed, using fallbacks:', err.message);
        }

        const combinedPolice = [...livePolice, ...POLICE_DATA];
        const combinedHospitals = [...liveHospitals, ...HOSPITALS_DATA];

        // Shortlist to 10km; if none found, progressively extend to 50km, then 150km, then unlimited
        const mappedPolice = combinedPolice.map(ps => ({
            ...ps,
            distance: getDistance(userLat, userLng, ps.location[0], ps.location[1])
        })).sort((a, b) => a.distance - b.distance);

        // Deduplicate police list by lowercase name
        const uniquePolice = [];
        const seenPolNames = new Set();
        for (const p of mappedPolice) {
            const norm = p.name.toLowerCase().trim();
            if (!seenPolNames.has(norm)) {
                seenPolNames.add(norm);
                uniquePolice.push(p);
            }
        }

        let filteredPolice = uniquePolice.filter(p => p.distance <= 10.0);
        if (filteredPolice.length === 0) {
            filteredPolice = uniquePolice.filter(p => p.distance <= 50.0);
        }
        if (filteredPolice.length === 0) {
            filteredPolice = uniquePolice.filter(p => p.distance <= 150.0);
        }
        if (filteredPolice.length === 0) {
            filteredPolice = uniquePolice;
        }

        const mappedHospitals = combinedHospitals.map(h => ({
            ...h,
            distance: getDistance(userLat, userLng, h.location[0], h.location[1])
        })).sort((a, b) => a.distance - b.distance);

        // Deduplicate hospital list by lowercase name
        const uniqueHosp = [];
        const seenHospNames = new Set();
        for (const h of mappedHospitals) {
            const norm = h.name.toLowerCase().trim();
            if (!seenHospNames.has(norm)) {
                seenHospNames.add(norm);
                uniqueHosp.push(h);
            }
        }

        let filteredHospitals = uniqueHosp.filter(h => h.distance <= 10.0);
        if (filteredHospitals.length === 0) {
            filteredHospitals = uniqueHosp.filter(h => h.distance <= 50.0);
        }
        if (filteredHospitals.length === 0) {
            filteredHospitals = uniqueHosp.filter(h => h.distance <= 150.0);
        }
        if (filteredHospitals.length === 0) {
            filteredHospitals = uniqueHosp;
        }

        const top3Police = filteredPolice.slice(0, 3);
        const top3Hospitals = filteredHospitals.slice(0, 3);

        const isNearMeQuery = /\b(near me|nearby|around me|around here|my location|my area|my place)\b/i.test(msg);

        if (top3Police.length > 0 || top3Hospitals.length > 0) {
            context += `\n============================================================\n`;
            context += `USER CURRENT EXACT DETECTED LOCATION:\n`;
            context += `- Locked Coordinates: [${userLat}, ${userLng}]\n`;
            if (userAddress) {
                context += `- Resolved Street/Locality Address: ${userAddress}\n`;
            }
            context += `============================================================\n`;
            
            context += `\nIMMEDIATE REAL-WORLD SAFETY CENTERS (Within progressive shortlist radius of user coordinates [${userLat}, ${userLng}]):`;
            if (isNearMeQuery || true) { // Always highlight it for priority
                context += `\n[CRITICAL NOTE: User coordinates are locked at ${userAddress || 'their live GPS location'}. Prioritize these real-world nearest locations directly in your output. DO NOT refer them to Chennai or other distant areas. Guide them precisely based on this coordinates context.]`;
            }

            if (top3Police.length > 0) {
                context += `\n\nNEAREST POLICE STATIONS:`;
                top3Police.forEach((p, index) => {
                    context += `\n${index + 1}. ${p.name}
   * Address/Area: ${p.city}
   * Direct Phone: ${p.phone}
   * Distance: ${p.distance.toFixed(2)} km away
   * Department/Authority: ${p.authority}`;
                });
            }

            if (top3Hospitals.length > 0) {
                context += `\n\nNEAREST EMERGENCY HOSPITALS:`;
                top3Hospitals.forEach((h, index) => {
                    context += `\n${index + 1}. ${h.name}
   * Address/Area: ${h.city}
   * Emergency Phone: ${h.phone}
   * Distance: ${h.distance.toFixed(2)} km away
   * Authority/Affiliation: ${h.authority}`;
                });
            }
            context += `\n`;
        }
    }

    return context;
}

// ============================================================
// FALLBACK DEMO DATA (used when Firebase Admin unavailable)
// ============================================================
function getFallbackComplaint(complaintId) {
    const demo = {
        'RW-8490': { id: 'RW-8490', address: 'NH-544, km 145, Coimbatore', description: 'Deep Pothole', severity: 5, status: 'Escalated', road: 'NH-544', assignedTo: 'L&T Infrastructure' },
        'RW-8488': { id: 'RW-8488', address: 'SH-15, Ganapathy Junction', description: 'Waterlogging', severity: 4, status: 'Pending', road: 'SH-15', assignedTo: null },
        'RW-8482': { id: 'RW-8482', address: 'MDR-42, Peelamedu', description: 'Missing Signage', severity: 2, status: 'Resolved', road: 'MDR-42', assignedTo: 'L&T Infrastructure' }
    };
    if (demo[complaintId]) return `COMPLAINT DATA (demo):\n${JSON.stringify(demo[complaintId], null, 2)}`;
    return `No complaint found with ID ${complaintId}.`;
}

function getFallbackRoad(roadName) {
    const demo = {
        'NH-544': { road: 'NH-544', authority: 'NHAI', condition: 'Fair', open_complaints: 28, contractor: 'L&T Infrastructure', warranty_expires: '2029-10-12' },
        'SH-15':  { road: 'SH-15', authority: 'PWD Tamil Nadu', condition: 'Poor', open_complaints: 14 },
        'MDR-42': { road: 'MDR-42', authority: 'CCMC', condition: 'Good', open_complaints: 3 }
    };
    if (demo[roadName]) return `ROAD DATA (demo):\n${JSON.stringify(demo[roadName], null, 2)}`;
    return '';
}

function getFallbackStats() {
    return `PLATFORM STATS (demo):\n${JSON.stringify({
        totalComplaints: 312, open: 42, inProgress: 146, resolved: 124,
        roadsMonitored: 18, avgResolutionDays: 6.4
    }, null, 2)}`;
}

// ============================================================
// GROQ API CALL
// ============================================================
const BASE_SYSTEM_PROMPT = `You are RoadLaw AI, the official assistant for the RoadWatch platform — an Indian road safety and emergency response system.

YOUR PRIMARY DUTY IS TO OUTPUT EXTREMELY CLEAN, HIGHLY ORGANISED, AND PREMIUM RESPONSES. Under high-stress emergency conditions, citizens need information to be easily readable, visually structured, and direct.

============================================================
REQUIRED RESPONSE FORMAT (STRICTLY COMPLY WITH THIS MARKDOWN LAYOUT):
============================================================

### 📍 EMERGENCY DISPATCH DETAILS
- **LOCKED LOCATION:** [Specify the Exact Address/City/District from the Context]
- **COORDINATES:** [Specify the Active GPS Coordinates from the Context]
- **STATUS:** [e.g., Live Location Locked | Geocoded Override Active]

---

[IF POLICE/CRIME CONTEXT APPLIES]
### 👮 NEAREST LAW ENFORCEMENT & POLICE STATION
* **Name:** [Matched Police Station Name]
* **Distance:** [X.XX] km away
* **Direct Emergency Phone:** \`[Phone Number or "100"]\`
* **Authority Jurisdiction:** [e.g., Tamil Nadu Police]
* **Address/Locality:** [Address of matched station]
---

[IF MEDICAL/ACCIDENT CONTEXT APPLIES]
### 🏥 NEAREST MEDICAL ASSISTANCE & TRAUMA CENTER
* **Name:** [Matched Hospital Name]
* **Distance:** [X.XX] km away
* **Direct Emergency Phone:** \`[Phone Number or "108"]\`
* **Authority/Affiliation:** [e.g., Government Medical College Hospital]
* **Address/Locality:** [Address of matched hospital]
---

### 📋 EMERGENCY IMMEDIATE ACTION PLAN
1. **[Step 1 - e.g. Immediate Safety / Dial Emergency Services]:** Call the direct number shown above or standard National Services (100 for Police, 108 for Medical Ambulance).
2. **[Step 2 - Log Report on RoadWatch]:** Citizens can log their issue instantly on our **[Report Tab](#report)**. This will map the emergency, alert high-level safety officers, and warn oncoming highway traffic.
3. **[Step 3 - File Formal Complaint / FIR]:** Provide step-by-step guidance on how to lodge a complaint/FIR (e.g., key details needed: time, description, value).

---

### ⚖️ CITIZEN RIGHTS & ROAD SAFETY LAWS
* **Good Samaritan Law (MV Act § 134A):** Under Section 134A of the Motor Vehicles Act, anyone who renders immediate emergency assistance to an accident victim (during the Golden Hour) is fully protected from civil/criminal liability, police interrogation, and hospital fee harassment.
* **Right to Register FIR (BNSS § 173 / CrPC § 154):** Under Section 173 of the Bharatiya Nagarik Suraksha Sanhita (BNSS) (formerly Section 154 of CrPC), you have an absolute legal right to register an FIR/e-FIR for cognitive offenses at the nearest police station, and you are legally entitled to receive a free copy of the registered FIR.

============================================================

Always cite relevant law sections to ensure absolute legal precision. Keep the tone compassionate, calm, extremely clear, and professional. Avoid unstructured blocks of text. Make every response feel premium and state of the art!`;

const COMPLAINT_INSTRUCTION = `============================================================
AUTO-COMPLAINT REGISTRATION TRIGGER (HIDDEN INSTRUCTION)
============================================================
If the user's prompt explicitly asks you to register a complaint, report an issue, or log an incident (e.g., "register a complaint about this pothole", "report a major accident here"), you MUST perform a severity analysis and append the following hidden JSON block at the absolute end of your response:

[AUTO_COMPLAINT_TRIGGER: {"type":"[pothole/accident/damage/waterlog/sign/other]", "severity":[1-5], "description":"[Short 3-5 word summary]"}]

Severity Rules:
1-2: Minor issues (small potholes, missing signs)
3: Moderate issues (medium road damage, waterlogging)
4-5: Critical Danger (major accidents, massive sinkholes, life-threatening hazards)

Do NOT mention the trigger block in your visible text. Just append it at the very end.`;

function callGroq(messages) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify({ model: GROQ_MODEL, messages, max_tokens: 400, temperature: 0.4 });
        const options = {
            hostname: 'api.groq.com',
            path: '/openai/v1/chat/completions',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        };
        const req = https.request(options, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
        });
        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

// ============================================================
// HTTP SERVER
// ============================================================
const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
    if (req.method !== 'POST' || req.url !== '/chat') {
        res.writeHead(404); return res.end('Not found');
    }

    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
        try {
            const { message, lat, lng } = JSON.parse(body);
            console.log(`\n[USER]: ${message} (Coords: ${lat}, ${lng})`);

            // Detect and geocode locations in the message
            let activeLat = lat;
            let activeLng = lng;
            let geocodedInfo = null;

            try {
                const geocodedLoc = await detectAndGeocodeLocation(message);
                if (geocodedLoc) {
                    activeLat = geocodedLoc.lat;
                    activeLng = geocodedLoc.lng;
                    geocodedInfo = {
                        lat: geocodedLoc.lat,
                        lng: geocodedLoc.lng,
                        address: geocodedLoc.address
                    };
                    console.log(`[OVERRIDE COORDS] Overriding user coordinates to geocoded: [${activeLat}, ${activeLng}]`);
                }
            } catch (err) {
                console.warn('⚠️ Conversational location geocoding failed:', err.message);
            }

            let resolvedAddress = null;
            if (activeLat && activeLng) {
                try {
                    resolvedAddress = await fetchMapplsReverseGeocode(activeLat, activeLng);
                    if (resolvedAddress) {
                        console.log(`[REV-GEOCODE] Resolved coordinates [${activeLat}, ${activeLng}] to address: "${resolvedAddress}"`);
                    }
                } catch (err) {
                    console.warn('⚠️ Reverse geocode failed in proxy:', err.message);
                }
            }

            const context = await fetchRelevantContext(message, activeLat, activeLng, resolvedAddress || (geocodedInfo ? geocodedInfo.address : null));
            if (context) console.log(`[CONTEXT]: ${context.substring(0, 80)}...`);

            // Inject an explicit, high-priority instruction notifying the LLM of the user's locked coordinates/address
            const lockedLocationNotice = `[CRITICAL EMERGENCY LOCATION NOTICE]:
- Locked Coordinates: [${activeLat}, ${activeLng}]
- Locked Address/Locality: ${resolvedAddress || (geocodedInfo ? geocodedInfo.address : 'Unknown Area (Live Geolocation)')}
- Method: ${geocodedInfo ? 'Conversational AI Override' : 'Live Browser GPS/Map Pin'}

You must strictly structure your response to use the above Locked Location and Coordinates under your "📍 EMERGENCY DISPATCH DETAILS" section. Do NOT reference Madurai, Chennai, or any other cities unless they are in the immediate vicinity of this locked location.`;

            const systemContent = context
                ? `${BASE_SYSTEM_PROMPT}\n\n${lockedLocationNotice}\n\n--- CONTEXT FROM FIREBASE & MAPS ---\n${context}\n--- END CONTEXT ---\n\n${COMPLAINT_INSTRUCTION}`
                : `${BASE_SYSTEM_PROMPT}\n\n${lockedLocationNotice}\n\n${COMPLAINT_INSTRUCTION}`;

            const { statusCode, body: groqBody } = await callGroq([
                { role: 'system', content: systemContent },
                { role: 'user', content: message }
            ]);

            const parsed = JSON.parse(groqBody);
            let reply = parsed.choices?.[0]?.message?.content?.trim()
                     || parsed.error?.message
                     || 'No response.';

            console.log(`[BOT FULL REPLY]:\n${reply}\n-------------------------`);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ reply, geocoded: geocodedInfo }));

        } catch(err) {
            console.error('[ERROR]', err.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ reply: `Server error: ${err.message}` }));
        }
    });
});

// Start server after Firebase init attempt
initFirebase().then(() => {
    server.listen(PORT, () => {
        console.log(`\n✅ RoadLaw AI Proxy running at http://localhost:${PORT}`);
        console.log(`🔥 Firebase: ${firebaseReady ? 'CONNECTED (live data)' : 'OFFLINE (demo data)'}`);
        console.log(`🤖 AI Model: Groq ${GROQ_MODEL}`);
        console.log(`📡 Context injection: ENABLED\n`);
    });
});
