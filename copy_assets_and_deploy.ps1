# ==========================================================================
# Saskia's 26th Birthday Website - Copy Assets & Deploy Helper Script
# ==========================================================================

# Define paths
$BrainDir = "C:\Users\dep018\.gemini\antigravity-ide\brain\c687ba2b-bd78-404d-9d45-8ad3babc2fcd"
$WorkspaceDir = "c:\Users\dep018\Desktop\ExperimentRepo\birthday-web"
$AssetsDir = "$WorkspaceDir\assets"

Write-Host "🌸 Memulai persiapan aset website ulang tahun Saskia... 🌸" -ForegroundColor Pink

# Copy Baekhyun assets
$Image1 = "$BrainDir\baekhyun_one_1779360561105.png"
$Image2 = "$BrainDir\baekhyun_two_1779360591287.png"
$Image3 = "$BrainDir\baekhyun_three_1779360667234.png"

if (Test-Path $Image1) {
    Copy-Item $Image1 "$AssetsDir\baekhyun_1.jpg" -Force
    Write-Host "✅ Aset 1 berhasil disalin!" -ForegroundColor Green
} else {
    Write-Host "❌ Aset 1 tidak ditemukan di brain directory!" -ForegroundColor Red
}

if (Test-Path $Image2) {
    Copy-Item $Image2 "$AssetsDir\baekhyun_2.jpg" -Force
    Write-Host "✅ Aset 2 berhasil disalin!" -ForegroundColor Green
}

if (Test-Path $Image3) {
    Copy-Item $Image3 "$AssetsDir\baekhyun_3.jpg" -Force
    Write-Host "✅ Aset 3 berhasil disalin!" -ForegroundColor Green
}

# Clean up dummy text
if (Test-Path "$AssetsDir\dummy.txt") {
    Remove-Item "$AssetsDir\dummy.txt" -Force
}
if (Test-Path "$WorkspaceDir\test.txt") {
    Remove-Item "$WorkspaceDir\test.txt" -Force
}

Write-Host "🎉 Persiapan aset selesai! Anda sekarang dapat membuka index.html secara lokal." -ForegroundColor Cyan
Write-Host ""

# Git Deployment Prompt
$deploy = Read-Host "Apakah Anda ingin mendeploy langsung ke GitHub Pages (username: adermaulana-dre)? (y/n)"
if ($deploy -eq "y" -or $deploy -eq "Y") {
    Write-Host "🚀 Memulai proses inisialisasi Git dan Deployment..." -ForegroundColor Yellow
    
    # Check if git is initialized
    if (!(Test-Path "$WorkspaceDir\.git")) {
        git init
        Write-Host "Initialized local Git repository."
    }
    
    # Add remote
    git remote remove origin 2>$null
    git remote add origin "https://github.com/adermaulana-dre/birthday-web.git"
    Write-Host "Added Git remote pointing to: https://github.com/adermaulana-dre/birthday-web.git"
    
    # Commit
    git add .
    git commit -m "Initial commit - Happy 26th Birthday Saskia! 🌸"
    
    Write-Host "Mengunggah kode ke GitHub..." -ForegroundColor Yellow
    Write-Host "Silakan masukkan kredensial GitHub Anda jika diminta." -ForegroundColor Cyan
    
    git branch -M main
    git push -u origin main --force
    
    Write-Host "🎉 Berhasil diunggah ke GitHub!" -ForegroundColor Green
    Write-Host "Untuk mengaktifkan website langsung:" -ForegroundColor Yellow
    Write-Host "1. Buka repository Anda di browser: https://github.com/adermaulana-dre/birthday-web" -ForegroundColor Cyan
    Write-Host "2. Masuk ke Settings -> Pages" -ForegroundColor Cyan
    Write-Host "3. Pada bagian 'Build and deployment', ubah Source menjadi 'Deploy from a branch'" -ForegroundColor Cyan
    Write-Host "4. Pilih branch 'main' dan folder '/ (root)', lalu klik Save." -ForegroundColor Cyan
    Write-Host "5. Website Anda akan aktif dalam 1-2 menit di URL: https://adermaulana-dre.github.io/birthday-web/" -ForegroundColor Green
} else {
    Write-Host "Deployment dilewati. Anda dapat menjalankannya kapan saja!" -ForegroundColor Yellow
}
pause
