@echo off
REM Build and deploy to GitHub Pages
REM Usage: deploy-gh-pages.bat

echo Building Cocos Creator project for web...
echo Please build your project in Cocos Creator first (Build -^> Web Mobile)
echo The build output should be in the 'build/web-mobile' directory
echo.

set /p REPLY="Have you built the project in Cocos Creator? (y/n): "
if /i not "%REPLY%"=="y" (
    echo Please build the project first in Cocos Creator
    exit /b 1
)

REM Check if build directory exists
if not exist "build\web-mobile" (
    echo Error: build\web-mobile directory not found!
    echo Please build the project in Cocos Creator first
    exit /b 1
)

REM Create a temporary directory
set TEMP_DIR=%TEMP%\gh-pages-deploy-%RANDOM%
mkdir "%TEMP_DIR%"

REM Copy build files to temp directory
xcopy /E /I /Y "build\web-mobile\*" "%TEMP_DIR%"

REM Switch to gh-pages branch
git checkout -B gh-pages

REM Remove all files
git rm -rf .

REM Copy build files
xcopy /E /I /Y "%TEMP_DIR%\*" "."

REM Add and commit
git add -A
git commit -m "Deploy to GitHub Pages"

REM Push to GitHub
git push origin gh-pages --force

REM Switch back to master
git checkout master

REM Clean up
rmdir /S /Q "%TEMP_DIR%"

echo.
echo Deployment complete!
echo Your game will be available at: https://tuanluongwork.github.io/jrpg-battle-system/
echo Note: It may take a few minutes for GitHub Pages to update 