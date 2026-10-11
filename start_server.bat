@echo off
echo ========================================
echo   Sifat Ahammed Portfolio Server
echo   Running at http://localhost:8000
echo ========================================
echo.

:: Kill any existing process on port 8000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do taskkill /PID %%a /F >nul 2>&1

:: Start Python server
start "" python -m http.server 8000

:: Wait 1.5 seconds then open browser
timeout /t 2 /nobreak >nul
start "" http://localhost:8000

echo Server is running! Open http://localhost:8000 in your browser.
echo Press CTRL+C or close this window to stop the server.
echo.
python -m http.server 8000
