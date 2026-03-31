@echo off
echo 🚀 Portfolio App Deployment Script
echo ===================================

echo Step 1: Checking project structure...
if not exist "package.json" (
    echo ❌ package.json not found. Please run from project root.
    pause
    exit /b 1
)

echo ✅ Project structure OK

echo.
echo Step 2: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ npm install failed
    pause
    exit /b 1
)

echo ✅ Dependencies installed

echo.
echo Step 3: Testing database connection...
node test-connection.js
if %errorlevel% neq 0 (
    echo ❌ Database connection failed
    echo Please check your .env file and NeonDB setup
    pause
    exit /b 1
)

echo ✅ Database connection successful

echo.
echo Step 4: Initializing database...
node init-db.js
if %errorlevel% neq 0 (
    echo ❌ Database initialization failed
    pause
    exit /b 1
)

echo ✅ Database initialized

echo.
echo Step 5: Starting local server...
echo Your app will be available at: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
node server.js