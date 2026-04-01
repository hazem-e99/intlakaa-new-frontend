@echo off
echo ========================================
echo Deploying Edge Function to Supabase
echo ========================================
echo.

REM Check if Supabase CLI is installed
where supabase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Supabase CLI is not installed!
    echo.
    echo Please install it using one of these methods:
    echo.
    echo 1. Using Scoop:
    echo    scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
    echo    scoop install supabase
    echo.
    echo 2. Using npm:
    echo    npm install -g supabase
    echo.
    echo 3. Download from: https://github.com/supabase/cli/releases
    echo.
    pause
    exit /b 1
)

echo [1/3] Logging in to Supabase...
supabase login

echo.
echo [2/3] Linking to project...
supabase link --project-ref sxpaphmltbnangdubutm

echo.
echo [3/3] Setting RESEND_API_KEY secret...
supabase secrets set RESEND_API_KEY=re_LecYdM51_NAVGYaMxQBBHonb32tKRhkw8

echo.
echo [4/4] Deploying admin-users function...
supabase functions deploy admin-users

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
pause
