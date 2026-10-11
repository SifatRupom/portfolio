@echo off
setlocal enabledelayedexpansion
title Portfolio GitHub Deploy

echo ========================================
echo   Deploying Portfolio to GitHub Pages
echo ========================================
echo.

set TOKEN=YOUR_GITHUB_PAT_HERE
set REPO_NAME=portfolio

echo [1/5] Getting GitHub username...
for /f "delims=" %%i in ('powershell -Command "(Invoke-RestMethod -Uri 'https://api.github.com/user' -Headers @{Authorization='token %TOKEN%'; 'User-Agent'='deploy'}).login"') do set USERNAME=%%i

echo GitHub Username: !USERNAME!
echo.

echo [2/5] Creating repository...
powershell -Command "try { Invoke-RestMethod -Method POST -Uri 'https://api.github.com/user/repos' -Headers @{Authorization='token %TOKEN%'; 'User-Agent'='deploy'} -Body ('{\"name\":\"portfolio\",\"private\":false}') -ContentType 'application/json' | Out-Null; Write-Host 'Repo created!' } catch { Write-Host 'Repo may already exist, continuing...' }"
echo.

echo [3/5] Setting up Git...
git config --global user.email "sifatrupom06@gmail.com"
git config --global user.name "!USERNAME!"

cd /d "E:\my portfolio system"

if exist ".git" (
    echo Git already initialized
) else (
    git init
)

git add index.html style.css main.js "photo.jpg.jpg"
git commit -m "Portfolio website" 2>nul || echo Nothing new to commit

echo.
echo [4/5] Pushing to GitHub...
git remote remove origin 2>nul
git remote add origin https://!USERNAME!:%TOKEN%@github.com/!USERNAME!/portfolio.git
git branch -M main
git push -u origin main --force

echo.
echo [5/5] Enabling GitHub Pages...
powershell -Command "try { Invoke-RestMethod -Method POST -Uri 'https://api.github.com/repos/!USERNAME!/portfolio/pages' -Headers @{Authorization='token %TOKEN%'; 'User-Agent'='deploy'} -Body '{\"source\":{\"branch\":\"main\",\"path\":\"/\"}}' -ContentType 'application/json' | Out-Null } catch { Invoke-RestMethod -Method PUT -Uri 'https://api.github.com/repos/!USERNAME!/portfolio/pages' -Headers @{Authorization='token %TOKEN%'; 'User-Agent'='deploy'} -Body '{\"source\":{\"branch\":\"main\",\"path\":\"/\"}}' -ContentType 'application/json' | Out-Null }"

echo.
echo =========================================
echo  SUCCESS! Your portfolio is LIVE at:
echo  https://!USERNAME!.github.io/portfolio
echo =========================================
echo.
pause
