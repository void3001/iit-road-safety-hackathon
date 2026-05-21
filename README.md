# RoadWatch AI — Intelligent Road Safety & Incident Reporting Platform

RoadWatch AI is a state-of-the-art, hyper-localized road safety and incident management platform. It empowers citizens to report road hazards (potholes, accidents, waterlogging, etc.) and get real-time legal/safety advice via an AI-powered conversational assistant that perfectly understands their geographic context.

## 🌟 Key Features

### 🤖 Context-Aware AI Chatbot
- **Location-Injected AI Context**: The chatbot automatically knows exactly where you are and maps your location to the nearest hospitals, police stations, and active road contractors.
- **Conversational Geocoding**: Users can simply say *"I'm in Ramanathapuram"* and the system will instantly parse the location, override inaccurate browser-ISP GPS data, and sync the map and AI context to the new city.
- **Automated Complaint Registration**: If a user asks the AI to *"register a complaint about this massive pothole"*, the AI autonomously assesses the severity (1-5) and automatically registers the incident directly to the live database, providing the user with a tracking ticket.

### 🗺️ Live Incident Mapping (GIS)
- **Real-Time Data Plotting**: Displays live incidents fetched from the database on an interactive OpenStreetMap.
- **Precision Geolocation Guard**: An advanced geolocation algorithm that prevents browser-level ISP fallbacks (e.g., cell tower rerouting) by verifying distance thresholds and preserving high-accuracy device GPS.

### 📝 Smart Reporting Dashboard
- **Dynamic Severity Analysis**: A highly interactive, premium UI slider for incident reporting that uses dynamic gradients (Green to Red) to visually reflect hazard severity.
- **Image Evidence Upload**: Allows users to upload photo evidence of incidents which are stored securely in the cloud.
- **Multilingual Support**: Real-time localization for English, Tamil, and Hindi for broader accessibility.

---

## 🛠️ Software Stack

### Frontend Architecture
- **Core**: HTML5, Vanilla CSS3, Vanilla JavaScript (ES6+).
- **Mapping Engine**: [Leaflet.js](https://leafletjs.com/) integrated with OpenStreetMap tiles.
- **Design System**: Custom UI/UX featuring glassmorphism, dynamic gradients, and modern micro-animations without relying on heavy frameworks.
- **Markdown Parsing**: `marked.js` for rendering rich-text AI responses.

### Backend & API Layer
- **Runtime Environment**: [Node.js](https://nodejs.org/).
- **Web Server / Proxy**: [Express.js](https://expressjs.com/) handling secure proxying to AI models and CORS mitigation.
- **AI Engine**: [Groq Cloud API](https://groq.com/) utilizing ultra-fast Large Language Models (LLMs) like LLaMA-3 to process context-injected legal and safety queries.
- **Image Processing**: ImgBB API (with Firebase Storage fallback) for handling photo evidence.

### Cloud Infrastructure & Database
- **Platform**: [Firebase](https://firebase.google.com/) (Compat SDK).
- **Authentication**: Firebase Anonymous Authentication for seamless, frictionless user session tracking and persistence.
- **Database**: Firebase **Firestore** (NoSQL) for real-time syncing of complaints, statistics, and geolocation data.
- **Storage**: Firebase **Storage** for media management.

---

## 🚀 How It Works

1. **Initialization**: The user opens the app. Firebase Anonymous Auth assigns a unique session ID. 
2. **Location Lock**: The browser's GPS API fetches coordinates. If the accuracy is poor or diverted by the cellular network (e.g., ISP gateway fallback), the user can correct it conversationally via the chatbot.
3. **Context Construction**: The Node.js proxy aggregates the user's location, active local incidents, and nearby essential services into a hidden system prompt.
4. **AI Processing**: Groq processes the context-rich prompt and returns localized safety advice or automatically triggers a backend Firestore write if a complaint is detected.
5. **Real-time Sync**: The frontend listens to Firestore updates and instantly updates the heatmap and data dashboard.

---

## 💻 Getting Started (Local Development)

### Prerequisites
- Node.js (v16+)
- Python 3.x (for simple HTTP server)

### 1. Start the HTTP Server (Frontend)
Run the following command in the project root to serve the `index.html` file:
\`\`\`bash
python -m http.server 8080
\`\`\`

### 2. Start the AI Proxy Server (Backend)
In a separate terminal window, start the Node.js Express server to handle AI requests:
\`\`\`bash
node proxy.js
\`\`\`

### 3. Open the Application
Navigate to \`http://localhost:8080\` in your browser to interact with the platform. Ensure the proxy server remains running for the chatbot to function.

---
*Built for the IIT Road Safety Hackathon.*
