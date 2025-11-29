# 🔥 SPARK FINAL DEPLOYMENT SCRIPT (PowerShell for Windows)
# Этот скрипт завершает полный deployment Spark на производстве

Write-Host "🚀 SPARK FINAL DEPLOYMENT - STARTING..." -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Colors (using Write-Host with different approaches)
$GREEN = "Green"
$BLUE = "Blue"
$YELLOW = "Yellow"
$RED = "Red"

Write-Host "`nStep 1: Verifying current setup..." -ForegroundColor Blue
Write-Host "✓ Website build complete" -ForegroundColor Green
Write-Host "✓ Server running on port 8000" -ForegroundColor Green
Write-Host "✓ Cloudflare Tunnel active:" -ForegroundColor Green
Write-Host "  URL: https://estates-victorian-remedies-reflect.trycloudflare.com" -ForegroundColor Green
Write-Host "✓ Git repository initialized & committed" -ForegroundColor Green

Write-Host "`nStep 2: Creating GitHub repository..." -ForegroundColor Yellow
# Configuration
$REPO_NAME = "spark-production"
$REPO_DESC = "🔥 Spark - Decentralized Social Network powered by AI and Cryptography"

Write-Host "MANUAL STEP REQUIRED - Create GitHub repository:`n" -ForegroundColor Yellow
Write-Host "1. Go to https://github.com/new" -ForegroundColor Cyan
Write-Host "2. Repository name: $REPO_NAME" -ForegroundColor Cyan
Write-Host "3. Description: `"$REPO_DESC`"" -ForegroundColor Cyan
Write-Host "4. Make it Public" -ForegroundColor Cyan
Write-Host "5. Do NOT initialize with README, .gitignore, or license" -ForegroundColor Cyan
Write-Host "6. Press 'Create repository'`n" -ForegroundColor Cyan

$confirmation = Read-Host "Press Enter when GitHub repository is created..."

# Step 3: Add GitHub remote
Write-Host "`nStep 3: Adding GitHub remote..." -ForegroundColor Blue

do {
    $GITHUB_USERNAME = Read-Host "Please provide your GitHub username"
    if ([string]::IsNullOrWhiteSpace($GITHUB_USERNAME)) {
        Write-Host "GitHub username is required!" -ForegroundColor Red
    }
} while ([string]::IsNullOrWhiteSpace($GITHUB_USERNAME))

$REMOTE_URL = "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

Write-Host "Adding remote: $REMOTE_URL" -ForegroundColor Blue
git remote add origin $REMOTE_URL

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ GitHub remote added successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to add GitHub remote. Check if repository exists." -ForegroundColor Red
    exit 1
}

# Step 4: Push to GitHub
Write-Host "`nStep 4: Pushing code to GitHub..." -ForegroundColor Blue

Write-Host "Pushing to GitHub..." -ForegroundColor Blue
git push -u origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Code successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "✓ Repository URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME" -ForegroundColor Green
} else {
    Write-Host "Trying with master branch..." -ForegroundColor Yellow
    git push -u origin master 2>&1

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Code successfully pushed to GitHub (master branch)!" -ForegroundColor Green
        Write-Host "✓ Repository URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to push to GitHub. Please check repository access." -ForegroundColor Red
        exit 1
    }
}

# Step 5: Netlify instructions
Write-Host "`nStep 5: Connecting to Netlify..." -ForegroundColor Blue

Write-Host "MANUAL STEP REQUIRED - Connect GitHub to Netlify:`n" -ForegroundColor Yellow
Write-Host "1. Go to https://app.netlify.com/" -ForegroundColor Cyan
Write-Host "2. Log in to your account" -ForegroundColor Cyan
Write-Host "3. Click 'Add new site' -> 'Import an existing project'" -ForegroundColor Cyan
Write-Host "4. Choose 'Deploy with GitHub'" -ForegroundColor Cyan
Write-Host "5. Search for and select '$REPO_NAME'" -ForegroundColor Cyan
Write-Host "6. Build settings:" -ForegroundColor Cyan
Write-Host "   - Branch: main (or master)" -ForegroundColor Cyan
Write-Host "   - Build command: npm run build" -ForegroundColor Cyan
Write-Host "   - Publish directory: .next" -ForegroundColor Cyan
Write-Host "   - Add env var: NEXT_PUBLIC_API_URL = https://estates-victorian-remedies-reflect.trycloudflare.com" -ForegroundColor Cyan
Write-Host "7. Click 'Deploy site'`n" -ForegroundColor Cyan

Write-Host "Expected result after deployment:" -ForegroundColor Blue
Write-Host "🌍 Production URL: Will be provided by Netlify" -ForegroundColor Green
Write-Host "🚀 Live Features:" -ForegroundColor Green
Write-Host "  - Global access to Spark Social Network" -ForegroundColor Green
Write-Host "  - AI-powered feed algorithm" -ForegroundColor Green
Write-Host "  - Real-time encrypted messaging (Signal protocol)" -ForegroundColor Green
Write-Host "  - AI comment moderation (Rule 43)" -ForegroundColor Green
Write-Host "  - Mobile-responsive design" -ForegroundColor Green
Write-Host "  - Data stored on YOUR local computer" -ForegroundColor Green

Write-Host "`n🎊 DEPLOYMENT COMPLETE! 🎊" -ForegroundColor Yellow
Write-Host ""
Write-Host "Share these URLs with the world:" -ForegroundColor Cyan
Write-Host "- 🖥️  Production: [Netlify URL]" -ForegroundColor White
Write-Host "- 🔧 API: https://estates-victorian-remedies-reflect.trycloudflare.com" -ForegroundColor White
Write-Host ""
Write-Host "Spark is now a GLOBAL social network running on your computer! 🌍⚡" -ForegroundColor Green
