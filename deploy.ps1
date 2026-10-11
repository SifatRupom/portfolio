function Push-Portfolio {
    $token = "YOUR_GITHUB_PAT_HERE"  # Replace with your token
    $headers = @{Authorization = "token $token"; "User-Agent" = "portfolio-deploy" }

    # Step 1: Get username
    $user = Invoke-RestMethod -Uri "https://api.github.com/user" -Headers $headers
    $username = $user.login
    Write-Host "GitHub Username: $username"

    # Step 2: Create repository
    $body = @{name = "portfolio"; description = "My Portfolio Website"; private = $false; auto_init = $false } | ConvertTo-Json
    try {
        $repo = Invoke-RestMethod -Method POST -Uri "https://api.github.com/user/repos" -Headers $headers -Body $body -ContentType "application/json"
        Write-Host "Repository created: $($repo.html_url)"
    }
    catch {
        Write-Host "Repository may already exist, continuing..."
    }

    # Step 3: Git config and push
    git config --global user.email "sifatrupom06@gmail.com"
    git config --global user.name $username

    Set-Location "E:\my portfolio system"

    if (Test-Path ".git") {
        Write-Host "Git already initialized"
    }
    else {
        git init
    }

    # Remove server.js and start_server.bat from tracking
    git rm --cached server.js 2>$null
    git rm --cached start_server.bat 2>$null

    git add index.html style.css main.js "photo.jpg.jpg"
    git commit -m "Add portfolio website"

    $remoteUrl = "https://$($username):$($token)@github.com/$($username)/portfolio.git"

    git remote remove origin 2>$null
    git remote add origin $remoteUrl

    git branch -M main
    git push -u origin main --force

    Write-Host ""
    Write-Host "========================================="
    Write-Host "SUCCESS! Now enabling GitHub Pages..."

    # Step 4: Enable GitHub Pages
    $pagesBody = @{source = @{branch = "main"; path = "/" } } | ConvertTo-Json
    try {
        Invoke-RestMethod -Method POST -Uri "https://api.github.com/repos/$username/portfolio/pages" -Headers $headers -Body $pagesBody -ContentType "application/json"
        Write-Host "GitHub Pages enabled!"
    }
    catch {
        Invoke-RestMethod -Method PUT -Uri "https://api.github.com/repos/$username/portfolio/pages" -Headers $headers -Body $pagesBody -ContentType "application/json"
        Write-Host "GitHub Pages updated!"
    }

    Write-Host ""
    Write-Host "Your portfolio is LIVE at:"
    Write-Host "https://$username.github.io/portfolio"
    Write-Host "=========================================`n"
}

Push-Portfolio
