import pandas as pd
import json
import random

# Load the excel file
df = pd.read_excel('Major road details.xlsx')
# Drop NaN rows if any
df = df.dropna(subset=['MAJOR ROADS'])

# Database of coordinates and realistic details for each road
road_details = {
    "Lucknow-Sultanpur Expressway": {
        "start": [26.8467, 80.9462], "end": [26.2648, 82.0727], "state": "Uttar Pradesh", "authority": "UPEIDA",
        "email": "ee.lucknow-sultanpur@upeida.in", "budget": 4650, "score": 8.5
    },
    "Ganga Expressway": {
        "start": [28.9845, 77.7064], "end": [25.4358, 81.8463], "state": "Uttar Pradesh", "authority": "UPEIDA",
        "email": "ee.ganga-exp@upeida.in", "budget": 36230, "score": 7.9
    },
    "Mumbai-Nagpur Expressway (Samruddhi Mahamarg)": {
        "start": [19.0760, 72.8777], "end": [21.1458, 79.0882], "state": "Maharashtra", "authority": "MSRDC",
        "email": "chiefeng.samruddhi@msrdc.in", "budget": 55335, "score": 9.1
    },
    "Purvanchal Expressway": {
        "start": [26.8467, 80.9462], "end": [25.5840, 83.5770], "state": "Uttar Pradesh", "authority": "UPEIDA",
        "email": "ee.purvanchal@upeida.in", "budget": 22494, "score": 8.4
    },
    "Yamuna Expressway": {
        "start": [28.4744, 77.5030], "end": [27.1767, 78.0081], "state": "Uttar Pradesh", "authority": "YEIDA",
        "email": "ee.yamuna-exp@yeida.gov.in", "budget": 12839, "score": 8.2
    },
    "Chittorgarh-Udaipur Highway": {
        "start": [24.8887, 74.6269], "end": [24.5854, 73.7125], "state": "Rajasthan", "authority": "NHAI",
        "email": "piu.udaipur@nhai.org", "budget": 1120, "score": 7.6
    },
    "Balotra-Sanderao Road (Rajasthan)": {
        "start": [25.8300, 72.2400], "end": [25.2600, 73.1800], "state": "Rajasthan", "authority": "PWD Rajasthan",
        "email": "ee.balotra@pwd.rajasthan.gov.in", "budget": 450, "score": 6.2
    },
    "Mughal Road (J&K)": {
        "start": [33.6186, 74.3435], "end": [33.7222, 74.8317], "state": "Jammu & Kashmir", "authority": "JK PWD",
        "email": "ee.mughalroad@jkpwd.nic.in", "budget": 640, "score": 5.8
    },
    "Mumbai Coastal Road Project": {
        "start": [18.9438, 72.8236], "end": [19.0016, 72.8162], "state": "Maharashtra", "authority": "MCGM",
        "email": "se.coastalroad@mcgm.gov.in", "budget": 12721, "score": 9.2
    },
    "Bangalore-Nidagatta Road": {
        "start": [12.9716, 77.5946], "end": [12.5400, 77.0500], "state": "Karnataka", "authority": "NHAI",
        "email": "piu.bangalore@nhai.org", "budget": 2190, "score": 8.8
    },
    "Ambala-Kaithal Highway": {
        "start": [30.3782, 76.7767], "end": [29.8015, 76.4005], "state": "Haryana", "authority": "NHAI",
        "email": "piu.ambala@nhai.org", "budget": 980, "score": 7.4
    },
    "Agra-Lucknow Expressway (302 km)": {
        "start": [27.1767, 78.0081], "end": [26.8467, 80.9462], "state": "Uttar Pradesh", "authority": "UPEIDA",
        "email": "ee.agra-lucknow@upeida.in", "budget": 15000, "score": 8.9
    },
    "Lucknow-Kanpur Expressway (62 km)": {
        "start": [26.8467, 80.9462], "end": [26.4499, 80.3319], "state": "Uttar Pradesh", "authority": "NHAI",
        "email": "piu.kanpur@nhai.org", "budget": 4700, "score": 7.2
    },
    "Thane-Bhiwandi Bypass": {
        "start": [19.2183, 72.9781], "end": [19.2813, 73.0483], "state": "Maharashtra", "authority": "MMRDA",
        "email": "ee.thane-bhiwandi@mmrda.gov.in", "budget": 1150, "score": 6.7
    },
    "Goa-Karnataka border (NH-66), Karwar-Kundapur": {
        "start": [14.8080, 74.1300], "end": [13.6261, 74.6936], "state": "Karnataka", "authority": "NHAI",
        "email": "piu.karwar@nhai.org", "budget": 3480, "score": 8.1
    },
    "Khammam-Vijayawada (NH-163G": {
        "start": [17.2473, 80.1514], "end": [16.5062, 80.6480], "state": "Andhra Pradesh", "authority": "NHAI",
        "email": "piu.vijayawada@nhai.org", "budget": 2400, "score": 7.8
    },
    "Sargi-Basanwahi (NH-130-CD)": {
        "start": [20.3000, 81.5000], "end": [20.1000, 81.3000], "state": "Chhattisgarh", "authority": "NHAI",
        "email": "piu.dhamtari@nhai.org", "budget": 520, "score": 6.9
    },
    "Dhrol-Bhadra-Patiya (NH-151)": {
        "start": [22.5644, 70.4132], "end": [22.7500, 70.6000], "state": "Gujarat", "authority": "NHAI",
        "email": "piu.rajkot@nhai.org", "budget": 610, "score": 7.0
    },
    "Patacharkuchi-Baihata (NH-27)": {
        "start": [26.4354, 91.1762], "end": [26.3456, 91.7243], "state": "Assam", "authority": "NHAI",
        "email": "piu.guwahati@nhai.org", "budget": 1420, "score": 7.3
    },
    "Durg-Raipur-Arang (NH)": {
        "start": [21.1904, 81.2849], "end": [21.1952, 81.9664], "state": "Chhattisgarh", "authority": "NHAI",
        "email": "piu.raipur@nhai.org", "budget": 2280, "score": 8.0
    },
    "Dwarka Expressway": {
        "start": [28.5823, 77.0500], "end": [28.4595, 77.0266], "state": "Delhi/Haryana", "authority": "NHAI",
        "email": "piu.dwarka@nhai.org", "budget": 9000, "score": 9.3
    },
    "NH-130CD Pkg-1 (Aluru-Jakkuva)": {
        "start": [19.8000, 81.6000], "end": [19.6000, 81.8000], "state": "Chhattisgarh", "authority": "NHAI",
        "email": "piu.kondagaon@nhai.org", "budget": 540, "score": 6.8
    },
    "Periyapatna-Hassan (NH-275) Pkg IV & V": {
        "start": [12.3421, 76.0967], "end": [13.0072, 76.1026], "state": "Karnataka", "authority": "NHAI",
        "email": "piu.hassan@nhai.org", "budget": 1180, "score": 7.5
    },
    "Yagyi-Kalewa Section (India-Myanmar Friendship Road)": {
        "start": [22.8000, 94.8000], "end": [23.0300, 94.3400], "state": "Manipur", "authority": "NHIDCL",
        "email": "gm.imphal@nhidcl.com", "budget": 1600, "score": 5.2
    },
    "Srinagar Ring Road Phase-I (km 0-42.1)": {
        "start": [34.0837, 74.7973], "end": [34.0191, 74.8876], "state": "Jammu & Kashmir", "authority": "NHAI",
        "email": "piu.srinagar@nhai.org", "budget": 1195, "score": 7.1
    },
    "Ahmedabad-Vadodara NH-8 six-laning": {
        "start": [23.0225, 72.5714], "end": [22.3072, 73.1812], "state": "Gujarat", "authority": "NHAI",
        "email": "piu.ahmedabad@nhai.org", "budget": 3250, "score": 8.3
    },
    "NH-716B Pkg-II (Kumarajapet-Veera Kaveri Raja Puram)": {
        "start": [13.1500, 79.6000], "end": [13.1000, 79.8000], "state": "Andhra Pradesh", "authority": "NHAI",
        "email": "piu.nellore@nhai.org", "budget": 870, "score": 7.0
    },
    "NH-130CD Pkg-2 (Jakkuva-Korlam)": {
        "start": [19.6000, 81.8000], "end": [19.4000, 82.0000], "state": "Chhattisgarh", "authority": "NHAI",
        "email": "piu.koraput@nhai.org", "budget": 590, "score": 6.5
    },
    "Ahmedabad-Dholera Expressway": {
        "start": [23.0225, 72.5714], "end": [22.2533, 72.1904], "state": "Gujarat", "authority": "NHAI",
        "email": "piu.dholera@nhai.org", "budget": 4200, "score": 8.7
    },
    "Agra-Gwalior Greenfield Expressway (NH-719D)": {
        "start": [27.1767, 78.0081], "end": [26.2183, 78.1828], "state": "Uttar Pradesh/MP", "authority": "NHAI",
        "email": "piu.gwalior@nhai.org", "budget": 4610, "score": 7.4
    }
}

generated_roads = []
for index, row in df.iterrows():
    road_name = str(row['MAJOR ROADS']).strip()
    contractor = str(row['CONTRACTOR NAMES']).strip()
    s_no = int(row['S.NO'])
    
    # Check if we have coordinate data for it (or use fallback)
    road_name_clean = road_name.replace('\u2013', '-').replace('\u2014', '-').replace(' ', '').lower()
    
    details = None
    for key, val in road_details.items():
        key_clean = key.replace('\u2013', '-').replace('\u2014', '-').replace(' ', '').lower()
        if key_clean == road_name_clean or key_clean in road_name_clean or road_name_clean in key_clean:
            details = val
            break
            
    if not details:
        details = {
            "start": [11.0168, 76.9558],
            "end": [11.0168, 76.9558],
            "state": "Unknown",
            "authority": "NHAI",
            "email": "ae.roads@nhai.gov.in",
            "budget": random.randint(300, 3000),
            "score": round(random.uniform(5.5, 9.0), 1)
        }
    
    # Calculate realistic spending (utilized budget)
    sanctioned = details['budget']
    utilized = round(sanctioned * random.uniform(0.85, 0.96), 2)
    
    # Assign condition
    score = details['score']
    if score >= 8.5:
        condition = "Excellent"
    elif score >= 7.0:
        condition = "Good"
    elif score >= 5.5:
        condition = "Fair"
    elif score >= 4.0:
        condition = "Poor"
    else:
        condition = "Critical"
        
    generated_roads.append({
        "sNo": s_no,
        "name": road_name,
        "contractor": contractor,
        "authority": details['authority'],
        "state": details['state'],
        "start": details['start'],
        "end": details['end'],
        "sanctionedBudget": sanctioned,
        "contractAmount": utilized,
        "engineerEmail": details['email'],
        "qualityScore": score,
        "condition": condition,
        "lastRelaying": f"{random.randint(1, 28)} {random.choice(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])} {random.randint(2022, 2024)}",
        "warrantyExpiry": f"{random.randint(1, 28)} {random.choice(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])} {random.randint(2027, 2030)}"
    })

# Output to JSON
with open('c:/Users/AJAY A T/OneDrive/Documents/iit road safety hackathon/scratch_roads_data.json', 'w') as f:
    json.dump(generated_roads, f, indent=4)

print("Generated roads successfully!")
