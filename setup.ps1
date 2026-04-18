# ============================================
# Atelier Moein - Setup Script (PowerShell)
# ============================================
# This script automates the installation and 
# setup of the Atelier Moein application

param(
    [switch]$NoInteractive = $false
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$colors = @{
    Success = 'Green'
    Error = 'Red'
    Warning = 'Yellow'
    Info = 'Cyan'
}

function Write-Success {
    Write-Host "[✓] $args" -ForegroundColor $colors.Success
}

function Write-Error {
    Write-Host "[✗] $args" -ForegroundColor $colors.Error
}

function Write-Warning {
    Write-Host "[!] $args" -ForegroundColor $colors.Warning
}

function Write-Info {
    Write-Host "[→] $args" -ForegroundColor $colors.Info
}

# ===== Check Prerequisites =====
Write-Host "`n" -NoNewline
Write-Host "═════════════════════════════════" -ForegroundColor Magenta
Write-Host "Checking Prerequisites..." -ForegroundColor Magenta
Write-Host "═════════════════════════════════" -ForegroundColor Magenta
Write-Host ""

$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Error "Node.js is not installed!"
    Write-Info "Please download and install Node.js from https://nodejs.org/"
    if (-not $NoInteractive) { Read-Host "Press Enter to exit" }
    exit 1
}

$npmVersion = npm --version 2>$null
if (-not $npmVersion) {
    Write-Error "npm is not installed!"
    Write-Info "npm should come with Node.js. Please reinstall Node.js."
    if (-not $NoInteractive) { Read-Host "Press Enter to exit" }
    exit 1
}

Write-Success "Prerequisites met"
Write-Info "Node.js: $nodeVersion"
Write-Info "npm: $npmVersion"
Write-Host ""

# ===== Install Backend =====
Write-Host "═════════════════════════════════" -ForegroundColor Magenta
Write-Host "Installing Backend Dependencies..." -ForegroundColor Magenta
Write-Host "═════════════════════════════════" -ForegroundColor Magenta
Write-Host ""

$backendPath = Join-Path $scriptDir "backend"
if (-not (Test-Path $backendPath)) {
    Write-Error "Backend directory not found at $backendPath"
    if (-not $NoInteractive) { Read-Host "Press Enter to exit" }
    exit 1
}

Push-Location $backendPath
Write-Info "Installing packages from $backendPath..."
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Error "Backend installation failed"
    Pop-Location
    if (-not $NoInteractive) { Read-Host "Press Enter to exit" }
    exit 1
}
Write-Success "Backend dependencies installed"
Write-Host ""

# ===== Setup Backend Environment =====
Write-Host "═════════════════════════════════" -ForegroundColor Magenta
Write-Host "Setting up Backend Environment..." -ForegroundColor Magenta
Write-Host "═════════════════════════════════" -ForegroundColor Magenta
Write-Host ""

if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Success "Created .env file"
    } else {
        Write-Warning ".env.example not found"
    }
} else {
    Write-Success ".env file already exists"
}
Write-Host ""

# ===== Seed Database =====
Write-Host "═════════════════════════════════" -ForegroundColor Magenta
Write-Host "Initializing Database..." -ForegroundColor Magenta
Write-Host "═════════════════════════════════" -ForegroundColor Magenta
Write-Host ""

Write-Info "Running database seed..."
npm run seed
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Database seeding had issues"
    Write-Info "You may need to run 'npm run seed' manually"
} else {
    Write-Success "Database initialized"
}
Write-Host ""

# ===== Install Frontend =====
Write-Host "═════════════════════════════════" -ForegroundColor Magenta
Write-Host "Installing Frontend Dependencies..." -ForegroundColor Magenta
Write-Host "═════════════════════════════════" -ForegroundColor Magenta
Write-Host ""

$frontendPath = Join-Path $scriptDir "frontend"
if (-not (Test-Path $frontendPath)) {
    Write-Error "Frontend directory not found at $frontendPath"
    Pop-Location
    if (-not $NoInteractive) { Read-Host "Press Enter to exit" }
    exit 1
}

Pop-Location
Push-Location $frontendPath
Write-Info "Installing packages from $frontendPath..."
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Error "Frontend installation failed"
    Pop-Location
    if (-not $NoInteractive) { Read-Host "Press Enter to exit" }
    exit 1
}
Write-Success "Frontend dependencies installed"
Write-Host ""

# ===== Setup Frontend Environment =====
Write-Host "═════════════════════════════════" -ForegroundColor Magenta
Write-Host "Setting up Frontend Environment..." -ForegroundColor Magenta
Write-Host "═════════════════════════════════" -ForegroundColor Magenta
Write-Host ""

if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Success "Created .env file"
    } else {
        Write-Warning ".env.example not found"
    }
} else {
    Write-Success ".env file already exists"
}
Write-Host ""

# ===== Verify Builds =====
Write-Host "═════════════════════════════════" -ForegroundColor Magenta
Write-Host "Verifying Builds..." -ForegroundColor Magenta
Write-Host "═════════════════════════════════" -ForegroundColor Magenta
Write-Host ""

Pop-Location
Push-Location $backendPath
Write-Info "Building backend..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Backend build had issues"
}
Write-Host ""

Pop-Location
Push-Location $frontendPath
Write-Info "Building frontend..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Frontend build had issues"
}
Pop-Location
Write-Host ""

# ===== Completion =====
Write-Host "═════════════════════════════════" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "═════════════════════════════════" -ForegroundColor Green
Write-Host ""

Write-Success "Installation complete!"
Write-Host ""
Write-Info "Next steps:"
Write-Host "1. Open two terminal/PowerShell windows" -ForegroundColor White
Write-Host ""
Write-Host "2. Terminal 1 - Start Backend:" -ForegroundColor White
Write-Host "   cd '$backendPath'" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Terminal 2 - Start Frontend:" -ForegroundColor White
Write-Host "   cd '$frontendPath'" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Open your browser to:" -ForegroundColor White
Write-Host "   http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "5. Login with default credentials:" -ForegroundColor White
Write-Host "   Username: admin" -ForegroundColor Yellow
Write-Host "   Password: admin123" -ForegroundColor Yellow
Write-Host ""
Write-Info "Documentation:"
Write-Host "   - Main README: README.md" -ForegroundColor White
Write-Host "   - Setup Guide: INSTALL.md" -ForegroundColor White
Write-Host "   - Deployment: DEPLOYMENT_READY.md" -ForegroundColor White
Write-Host ""

if (-not $NoInteractive) {
    Read-Host "Press Enter to exit"
}
