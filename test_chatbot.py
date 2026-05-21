import urllib.request
import json
import sys

def test_chat(message, lat, lng, expected_keywords):
    url = "http://localhost:3001/chat"
    payload = {
        "message": message,
        "lat": lat,
        "lng": lng
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers=headers, method='POST')
    
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode('utf-8')
            parsed = json.loads(res_body)
            reply = parsed.get("reply", "")
            print(f"\nMessage: '{message}' | Coordinates: [{lat}, {lng}]")
            print("-" * 60)
            print(reply)
            print("-" * 60)
            
            matched = []
            for kw in expected_keywords:
                if kw.lower() in reply.lower():
                    matched.append(kw)
            
            if len(matched) == len(expected_keywords):
                print(f"[OK] Success! Found expected keywords: {matched}")
                return True
            else:
                missing = [kw for kw in expected_keywords if kw not in matched]
                print(f"[FAIL] Failed! Missing expected keywords: {missing}")
                return False
    except Exception as e:
        print(f"[FAIL] Connection error: {e}")
        return False

if __name__ == "__main__":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    print("Testing chatbot context matching...")
    
    # Test case 1: Stolen jewels near Coimbatore
    success1 = test_chat(
        message="my jewels were stolen! help me find the nearest police station.",
        lat=11.02,
        lng=77.00,
        expected_keywords=["Peelamedu", "Police"]
    )
    
    # Test case 2: Road accident near Madurai
    success2 = test_chat(
        message="there was a major accident here. someone is injured. where is the hospital?",
        lat=9.92,
        lng=78.12,
        expected_keywords=["Rajaji", "Hospital"]
    )
    
    # Test case 3: Ramanathapuram local query
    success3 = test_chat(
        message="I am in Ramanathapuram town. My jewels were stolen! Where is the nearest police station near me?",
        lat=9.3639,
        lng=78.8394,
        expected_keywords=["Ramanathapuram", "Police"]
    )
    
    if success1 and success2 and success3:
        print("\n[SUCCESS] All tests passed successfully!")
        sys.exit(0)
    else:
        print("\n[FAILED] Some tests failed.")
        sys.exit(1)
