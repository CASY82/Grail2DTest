@echo off
cd /d %~dp0
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required. Install Node.js and run this file again.
  pause
  exit /b 1
)
start "GRAIL CH1 Server" cmd /k node server.mjs
timeout /t 2 /nobreak >nul
start http://localhost:4173
