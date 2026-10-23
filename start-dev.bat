@echo off
cd /d "%~dp0"
where pnpm >nul 2>nul
if %errorlevel%==0 (set PM=pnpm) else (set PM=npm)
echo Installing packages (first run only takes a moment)...
call %PM% install
echo Starting portfolio on http://localhost:3000 ...
start "" cmd /c "timeout /t 15 >nul && start http://localhost:3000"
if "%PM%"=="pnpm" (set RUNNER=pnpm dev) else (set RUNNER=npm run dev)
powershell -NoProfile -ExecutionPolicy Bypass -Command "%RUNNER% 2>&1 | Tee-Object -FilePath dev-server.log"
pause
