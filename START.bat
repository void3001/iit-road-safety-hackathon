@echo off
echo Starting RoadWatch Platform...
start "Website Server" powershell -NoExit -Command "python -m http.server 8080"
timeout /t 2 >nul
start "AI Proxy (Groq)" powershell -NoExit -Command "node proxy.js"
timeout /t 2 >nul
start "" "http://localhost:8080"
echo.
echo Both servers are running!
echo   Website:  http://localhost:8080
echo   AI Proxy: http://localhost:3001
echo.
echo Close the two PowerShell windows to stop the servers.
