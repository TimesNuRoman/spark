@echo off
REM 🔥 SPARK ONE-CLICK LAUNCH
REM Автоматический запуск всей экосистемы Spark

echo 🚀 SPARK AUTOMATIC LAUNCH
echo ========================
echo.

REM Set console colors
color 1F

REM Change to batch file directory
cd /d %~dp0

REM Check if PowerShell is available
powershell -Command "& { Write-Host 'PowerShell available' }" >nul 2>&1
if errorlevel 1 (
    echo ❌ PowerShell not available. Please install Windows PowerShell or run start_spark_automatic.ps1 manually
    echo.
    pause
    exit /b 1
)

echo ✅ PowerShell found
echo.

REM Check administrator privileges
net session >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Administrator privileges available
) else (
    echo ⚠️  No administrator privileges - tunnel may have issues
)
echo.

REM Check if we have Git Bash/Git SDK for running shell scripts
where git >nul 2>nul
if %errorlevel% neq 0 goto :no_git

REM Try Git Bash first for shell scripts
echo 🔥 STARTING SPARK ECOSYSTEM VIA GIT BASH...
echo ────────────────────────────────────
"C:\Program Files\Git\bin\bash.exe" "./start_spark_simple.sh"
goto :done

:no_git
echo ⚠️  Git not found, using PowerShell script...
echo 🔥 STARTING SPARK ECOSYSTEM VIA POWERSHELL...
echo ────────────────────────────────────
powershell -NoProfile -ExecutionPolicy Bypass -Command "& '.\start_spark_automatic.ps1' -All"

echo.
echo 🎊 SCRIPT COMPLETED
echo.
pause
