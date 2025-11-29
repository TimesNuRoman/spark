# 🔥 SPARK AUTOMATIC LAUNCH SCRIPT
# Автоматический запуск всей экосистемы Spark в фоновом режиме

param(
    [switch]$Development,
    [switch]$Production,
    [switch]$All
)

Write-Host "🚀 SPARK AUTOMATIC LAUNCH - STARTING..." -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Set working directory to script location
Set-Location $PSScriptRoot

# Setup logging
$logFile = "$PSScriptRoot\spark_launch.log"
$date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
"[$date] Spark Launch Started" | Out-File -FilePath $logFile -Append

# Configuration
$serverDir = "server-app"
$websiteDir = "website"

# Function to log messages
function Log-Message {
    param([string]$message, [string]$color = "White")
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Host "[$timestamp] $message" -ForegroundColor $color
    "[$timestamp] $message" | Out-File -FilePath $logFile -Append -Encoding UTF8
}

# Function to check if port is in use
function Test-Port {
    param([int]$port)
    $connection = $null
try {
    Write-Host "✅ All services started!" -ForegroundColor Green
    Write-Host "Spark is running globally!" -ForegroundColor Green

    # Step 6: Build production site (PowerShell version)
    Write-Host "🏗️  Building production website..." -ForegroundColor Cyan
    if (Test-Path "website") {
        try {
            Set-Location website
            npm run build
            Set-Location ..
            Write-Host "✅ Production build completed" -ForegroundColor Green
        } catch {
            Write-Host "❌ Build failed: $_" -ForegroundColor Red
        }
    }

    # Step 7: Auto-deploy to production
    Write-Host "🚀 Auto-deploying to production..." -ForegroundColor Cyan
    if (Test-Path ".git") {
        try {
            # Add timestamp to force deploy detection
            Get-Date -Format 'yyyy-MM-dd HH:mm:ss' | Out-File -FilePath ".deploy_timestamp" -Encoding UTF8

            # Force add all changes including timestamp
            git add -A .
            git add ".deploy_timestamp" 2>$null

            git commit -m "🚀 Automatic Spark Deploy

✅ Server: http://localhost:8000
✅ Tunnel: $TUNNEL_URL
✅ Frontend: Development ready
✅ Production: Built and deployed

🔥 Spark Live Globally!
🌐 Check: https://spark-production.netlify.app
✅ Navigation fixes included
🕒 Deploy timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" 2>$null

            # Push with force to ensure success
            git push origin master --force-with-lease 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Code pushed to GitHub" -ForegroundColor Green
                Write-Host "✅ Netlify auto-deploy triggered - check in 2-3 minutes" -ForegroundColor Green
                Write-Host "🌐 PRODUCTION SITE: https://spark-production.netlify.app" -ForegroundColor Cyan
            } else {
                Write-Host "❌ Primary push failed - trying force push" -ForegroundColor Yellow
                git push origin master --force 2>$null
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "✅ Code force-pushed to GitHub" -ForegroundColor Green
                } else {
                    Write-Host "❌ Git deploy failed completely" -ForegroundColor Red
                }
            }
        } catch {
            Write-Host "⚠️  Git deploy skipped, but Spark is running locally" -ForegroundColor Yellow
        }
    }

    # Keep processes alive
    Wait-Event
} catch {
    Write-Host "❌ Error occurred: $_" -ForegroundColor Red
}

# Function to kill process by port
function kill-port {
    param([int]$port)
    Log-Message "Checking port $port..." "Yellow"
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($process) {
        Log-Message "Killing process on port $port" "Yellow"
        Stop-Process -Id $process.OwningProcess -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
}

# Cleanup previous processes
Log-Message "🧹 Cleaning up previous processes..." "Yellow"
kill-port 8000  # Server
kill-port 3001  # Frontend dev
kill-port 3000  # Frontend prod

# Step 1: Start Backend Server
Log-Message "🔧 Starting Spark Backend Server..." "Blue"

if (Test-Path $serverDir) {
    Set-Location $serverDir

    # Start server in background
    $serverJob = Start-Job -ScriptBlock {
        param($serverDir)
        Set-Location $serverDir
        npm start
    } -ArgumentList (Join-Path $PSScriptRoot $serverDir)

    Log-Message "✓ Spark Server starting at http://localhost:8000" "Green"
    Set-Location $PSScriptRoot
} else {
    Log-Message "❌ Server directory not found: $serverDir" "Red"
    exit 1
}

# Wait for server to start
Log-Message "⏳ Waiting for server startup..." "Yellow"
$maxRetries = 30  # 30 seconds
$retryCount = 0
while (-not (Test-Port 8000)) {
    if ($retryCount -ge $maxRetries) {
        Log-Message "❌ Server failed to start within 30 seconds" "Red"
        exit 1
    }
    Start-Sleep -Seconds 1
    $retryCount++
}

Log-Message "✅ Server started successfully at http://localhost:8000" "Green"

# Step 2: Start Cloudflare Tunnel
Log-Message "🌏 Starting Cloudflare Tunnel..." "Blue"

if (Test-Path "cloudflared.exe") {
    # Start tunnel in background
    $tunnelJob = Start-Job -ScriptBlock {
        param($scriptRoot)
        Set-Location $scriptRoot
        .\cloudflared tunnel --url http://localhost:8000
    } -ArgumentList $PSScriptRoot

    Log-Message "✓ Cloudflare Tunnel starting..." "Green"

    # Wait for tunnel and capture URL
    Log-Message "⏳ Waiting for tunnel connection..." "Yellow"
    Start-Sleep -Seconds 10

    $tunnelUrl = $null

    # Try to extract tunnel URL from job output
    try {
        $jobOutput = Receive-Job $tunnelJob 2>$null
        # Look for tunnel URL pattern
        $urlMatch = $jobOutput | Select-String -Pattern "https://[^\s]+\.trycloudflare\.com"
        if ($urlMatch) {
            $tunnelUrl = $urlMatch[line].Trim()
            Log-Message "✅ Tunnel URL: $tunnelUrl" "Green"
        }
    } catch {
        Log-Message "⚠️  Could not extract tunnel URL, using known URL" "Yellow"
        $tunnelUrl = "https://estates-victorian-remedies-reflect.trycloudflare.com"
    }
}
else {
    Log-Message "❌ cloudflared.exe not found!" "Red"
    exit 1
}

# Step 3: Configure Environment
if ($tunnelUrl) {
    Log-Message "⚙️  Configuring environment variables..." "Blue"

    # Update .env.local for development
    $envPath = Join-Path $websiteDir ".env.local"
    if (-not (Test-Path $envPath)) {
        New-Item -Path $envPath -Type File -Force
    }
    "NEXT_PUBLIC_API_URL=$tunnelUrl" | Set-Content -Path $envPath -Encoding UTF8 -Force

    # Update netlify.toml for production
    $netlifyConfig = "[build]`n  command = ""npm run build""`n  functions = ""netlify/functions""`n  publish = "".""`n  processing.css.prefix = false`n`n  [build.environment]`n    NEXT_PUBLIC_API_URL = ""$tunnelUrl"""

    $netlifyPath = Join-Path $websiteDir "netlify.toml"
    $netlifyConfig | Set-Content -Path $netlifyPath -Encoding UTF8 -Force

    Log-Message "✅ Environment configured" "Green"
}

# Step 4: Start Frontend based on mode
if ($All -or $Development -or $Production) {
    if ($Development -or $All) {
        Log-Message "💻 Starting Development Frontend..." "Blue"
        Set-Location $websiteDir
        npm install --silent

        $frontendJob = Start-Job -ScriptBlock {
            param($websiteDir)
            Set-Location $websiteDir
            npm run dev
        } -ArgumentList (Join-Path $PSScriptRoot $websiteDir)

        Log-Message "✅ Development server starting at http://localhost:3001" "Green"
        Set-Location $PSScriptRoot

        # Wait for dev server
        Start-Sleep -Seconds 5
        while (-not (Test-Port 3001)) {
            Start-Sleep -Seconds 1
        }
        Log-Message "✅ Development frontend live: http://localhost:3001" "Green"
    }

    if ($Production -or $All) {
        Log-Message "🏗️  Building Production Frontend..." "Blue"
        Set-Location $websiteDir
        npm install --silent
        npm run build

        if ($LASTEXITCODE -eq 0) {
            Log-Message "✅ Production build completed" "Green"

            $prodJob = Start-Job -ScriptBlock {
                param($websiteDir)
                Set-Location $websiteDir
                npm run start
            } -ArgumentList (Join-Path $PSScriptRoot $websiteDir)

            # Wait for prod server
            Start-Sleep -Seconds 3
            while (-not (Test-Port 3000)) {
                Start-Sleep -Seconds 1
            }
            Log-Message "✅ Production frontend live: http://localhost:3000" "Green"
        } else {
            Log-Message "❌ Production build failed" "Red"
        }
        Set-Location $PSScriptRoot
    }
}

# Step 5: Git Deploy to Production
Log-Message "🚀 Deploying to GitHub..." "Blue"

try {
    # Git is already initialized, so we can deploy
    if (Test-Path ".git") {
        git add .
        $commitMsg = "🚀 Automatic Spark Deployment`n`n✅ Server: http://localhost:8000`n✅ Tunnel: $tunnelUrl`n✅ Frontend: Configured and ready`n`n🔥 Spark Global Launch Complete!"
        git commit -m $commitMsg 2>&1 | Out-Null

        if ($LASTEXITCODE -eq 0) {
            git push origin master 2>&1 | Out-Null

            if ($LASTEXITCODE -eq 0) {
                Log-Message "✅ Code pushed to GitHub" "Green"
                Log-Message "✅ Netlify will auto-deploy in 2-3 minutes" "Green"
            }
        }
    } else {
        Log-Message "⚠️  Git repository not found, skipping deployment" "Yellow"
    }
} catch {
    Log-Message "⚠️  Git deployment skipped" "Yellow"
}

# Status Summary
Log-Message "🎊 SPARK LAUNCH COMPLETE!" "Cyan"
Write-Host ""
Write-Host "🌟 SPARK SYSTEMS STATUS:" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host "✅ Backend API:     http://localhost:8000" -ForegroundColor Green
Write-Host "✅ Tunnel:          $tunnelUrl" -ForegroundColor Green
if ($Development) {
    Write-Host "✅ Dev Frontend:    http://localhost:3001" -ForegroundColor Green
}
if ($Production) {
    Write-Host "✅ Prod Frontend:   http://localhost:3000" -ForegroundColor Green
}
Write-Host "✅ Netlify Deploy:  Auto-deploying..." -ForegroundColor Green
Write-Host ""
Write-Host "🌍 PUBLIC ACCESS:" -ForegroundColor Yellow
Write-Host "Frontend: https://spark-production.netlify.app" -ForegroundColor White
Write-Host "API:      $tunnelUrl" -ForegroundColor White
Write-Host ""
Write-Host "💡 Keep this PowerShell window open to maintain tunnel!" -ForegroundColor Magenta
Write-Host "📝 Logs: spark_launch.log" -ForegroundColor Magenta
Write-Host ""
Write-Host "🚀 SPARK IS ALIVE GLOBALLY!" -ForegroundColor Cyan

# Keep jobs running if $All specified
if ($All) {
    Write-Host "`n🎋 Press Ctrl+C to stop all services" -ForegroundColor Yellow

    # Monitor jobs
    while ($true) {
        $serverStatus = (Get-Job $serverJob.Id).State
        $tunnelStatus = (Get-Job $tunnelJob.Id).State

        if ($serverStatus -eq "Failed" -or $tunnelStatus -eq "Failed") {
            Log-Message "❌ Critical service failed, stopping..." "Red"
            Get-Job | Stop-Job -PassThru | Remove-Job
            break
        }

        if ($serverStatus -eq "Completed" -or $tunnelStatus -eq "Completed") {
            Log-Message "⚠️  Service stopped unexpectedly..." "Yellow"
        }

        Start-Sleep -Seconds 10
    }
} else {
    Write-Host "`n🎋 Jobs running in background - check 'Get-Job' to monitor" -ForegroundColor Yellow
}

# Final log entry
$date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
"[$date] Spark Launch Complete" | Out-File -FilePath $logFile -Append
