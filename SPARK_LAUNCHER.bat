@echo off
REM 🌟 SPARK MAIN LAUNCHER
REM This is the ONE-CLICK launcher that starts everything automatically

title SPARK MAIN LAUNCHER

echo.
echo SPARK SOCIAL NETWORK LAUNCHER
echo ==============================
echo.

cd /d "%~dp0"

echo Starting Spark ecosystem...
echo.

REM Run through Git Bash if available
if exist "C:\Program Files\Git\bin\bash.exe" (
    "C:\Program Files\Git\bin\bash.exe" spark_bash_launcher.sh
) else (
    echo Using PowerShell launcher...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "& '.\spark_powershell_launcher.ps1' -All"
)

pause
