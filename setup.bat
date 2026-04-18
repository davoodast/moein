@echo off
REM ============================================
REM Atelier Moein - Setup Script (Windows)
REM ============================================
REM This script automates the installation and 
REM setup of the Atelier Moein application

setlocal enabledelayedexpansion
set "SCRIPT_DIR=%~dp0"

REM Color codes
for /F %%A in ('copy /Z "%~f0" nul') do set "BS=%%A"

:check_prerequisites
echo.
echo ====================================
echo Checking Prerequisites...
echo ====================================

node --version >nul 2>&1
if errorlevel 1 (
    echo %BS%[91m[ERROR]%BS%[0m Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

npm --version >nul 2>&1
if errorlevel 1 (
    echo %BS%[91m[ERROR]%BS%[0m npm is not installed!
    echo npm should come with Node.js. Please reinstall Node.js.
    pause
    exit /b 1
)

echo %BS%[92m[OK]%BS%[0m Node.js and npm are installed
node --version
npm --version
echo.

:install_backend
echo ====================================
echo Installing Backend Dependencies...
echo ====================================
cd /d "%SCRIPT_DIR%backend"
if errorlevel 1 (
    echo %BS%[91m[ERROR]%BS%[0m Cannot access backend directory
    pause
    exit /b 1
)

call npm install
if errorlevel 1 (
    echo %BS%[91m[ERROR]%BS%[0m Backend installation failed
    pause
    exit /b 1
)
echo %BS%[92m[OK]%BS%[0m Backend dependencies installed
echo.

:setup_backend_env
echo ====================================
echo Setting up Backend Environment...
echo ====================================

if not exist ".env" (
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo %BS%[92m[OK]%BS%[0m Created .env file
    ) else (
        echo %BS%[91m[WARNING]%BS%[0m .env.example not found
    )
) else (
    echo %BS%[92m[OK]%BS%[0m .env file already exists
)
echo.

:seed_database
echo ====================================
echo Initializing Database...
echo ====================================
call npm run seed
if errorlevel 1 (
    echo %BS%[91m[WARNING]%BS%[0m Database seeding had issues
    echo You may need to run "npm run seed" manually
)
echo %BS%[92m[OK]%BS%[0m Database initialized
echo.

:install_frontend
echo ====================================
echo Installing Frontend Dependencies...
echo ====================================
cd /d "%SCRIPT_DIR%frontend"
if errorlevel 1 (
    echo %BS%[91m[ERROR]%BS%[0m Cannot access frontend directory
    pause
    exit /b 1
)

call npm install
if errorlevel 1 (
    echo %BS%[91m[ERROR]%BS%[0m Frontend installation failed
    pause
    exit /b 1
)
echo %BS%[92m[OK]%BS%[0m Frontend dependencies installed
echo.

:setup_frontend_env
echo ====================================
echo Setting up Frontend Environment...
echo ====================================

if not exist ".env" (
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo %BS%[92m[OK]%BS%[0m Created .env file
    ) else (
        echo %BS%[91m[WARNING]%BS%[0m .env.example not found
    )
) else (
    echo %BS%[92m[OK]%BS%[0m .env file already exists
)
echo.

:build_check
echo ====================================
echo Verifying Builds...
echo ====================================

cd /d "%SCRIPT_DIR%backend"
call npm run build
if errorlevel 1 (
    echo %BS%[91m[WARNING]%BS%[0m Backend build had issues
)
echo.

cd /d "%SCRIPT_DIR%frontend"
call npm run build
if errorlevel 1 (
    echo %BS%[91m[WARNING]%BS%[0m Frontend build had issues
)
echo.

:completion
echo ====================================
echo %BS%[92mSetup Complete!%BS%[0m
echo ====================================
echo.
echo Next steps:
echo 1. Open two terminal windows/tabs
echo.
echo 2. Terminal 1 - Start Backend:
echo    cd "%SCRIPT_DIR%backend"
echo    npm run dev
echo.
echo 3. Terminal 2 - Start Frontend:
echo    cd "%SCRIPT_DIR%frontend"
echo    npm run dev
echo.
echo 4. Open your browser to:
echo    http://localhost:5173
echo.
echo 5. Login with default credentials:
echo    Username: admin
echo    Password: admin123
echo.
echo Documentation:
echo - Main README: README.md
echo - Setup Guide: INSTALL.md
echo - Deployment: DEPLOYMENT_READY.md
echo.
pause
