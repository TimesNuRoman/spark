@echo off
REM LAUNCH SPARK - NO EDITOR OPENING
REM Brief launch script for Spark ecosystem

title SPARK LAUNCHER

echo Starting Spark Ecosystem...
echo.

REM Prevent Git Bash from opening more windows
set GIT_BASH_NO_HUB=1

REM Change to script directory
cd /d "%~dp0"

REM Check if Git Bash is available
if exist "C:\Program Files\Git\bin\bash.exe" (
    "C:\Program Files\Git\bin\bash.exe" start_spark_simple.sh
) else if exist "C:\Program Files\Git\usr\bin\bash.exe" (
    "C:\Program Files\Git\usr\bin\bash.exe" start_spark_simple.sh
) else (
    echo Git Bash not found. Using PowerShell...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "& '.\start_spark_automatic.ps1' -All"
)

pause
