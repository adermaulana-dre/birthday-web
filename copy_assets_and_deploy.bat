@echo off
title Persiapan Aset & Deploy Website Saskia
chcp 65001 >nul

:: Define paths
set "BrainDir=C:\Users\dep018\.gemini\antigravity-ide\brain\c687ba2b-bd78-404d-9d45-8ad3babc2fcd"
set "WorkspaceDir=c:\Users\dep018\Desktop\ExperimentRepo\birthday-web"
set "AssetsDir=%WorkspaceDir%\assets"

echo 🌸 Memulai persiapan aset website ulang tahun Saskia... 🌸
echo.

:: Create assets directory if not exist
if not exist "%AssetsDir%" (
    mkdir "%AssetsDir%"
    echo Folder assets berhasil dibuat.
)

:: Copy Baekhyun assets
set "Img1=%BrainDir%\baekhyun_one_1779360561105.png"
set "Img2=%BrainDir%\baekhyun_two_1779360591287.png"
set "Img3=%BrainDir%\baekhyun_three_1779360667234.png"

if exist "%Img1%" (
    copy "%Img1%" "%AssetsDir%\baekhyun_1.jpg" /Y >nul
    echo [OK] Aset 1 berhasil disalin!
) else (
    echo [ERROR] Aset 1 tidak ditemukan!
)

if exist "%Img2%" (
    copy "%Img2%" "%AssetsDir%\baekhyun_2.jpg" /Y >nul
    echo [OK] Aset 2 berhasil disalin!
) else (
    echo [ERROR] Aset 2 tidak ditemukan!
)

if exist "%Img3%" (
    copy "%Img3%" "%AssetsDir%\baekhyun_3.jpg" /Y >nul
    echo [OK] Aset 3 berhasil disalin!
) else (
    echo [ERROR] Aset 3 tidak ditemukan!
)

:: Clean up dummy/temporary files
if exist "%AssetsDir%\dummy.txt" (
    del "%AssetsDir%\dummy.txt" /Q >nul
)
if exist "%WorkspaceDir%\test.txt" (
    del "%WorkspaceDir%\test.txt" /Q >nul
)

echo.
echo 🎉 Persiapan aset selesai! Anda sekarang dapat membuka index.html secara lokal di browser Anda.
echo.

:: Git Deployment Prompt
set /p deploy="Apakah Anda ingin mendeploy langsung ke GitHub Pages (username: adermaulana-dre)? (y/n): "
if /i "%deploy%"=="y" (
    echo.
    echo 🚀 Memulai proses inisialisasi Git dan Deployment...
    
    :: Initialize git
    if not exist "%WorkspaceDir%\.git" (
        git init
        echo Local Git repository initialized.
    )
    
    :: Add remote origin pointing to user's repository
    git remote remove origin >nul 2>&1
    git remote add origin "https://github.com/adermaulana-dre/birthday-web.git"
    echo Added Git remote pointing to: https://github.com/adermaulana-dre/birthday-web.git
    
    :: Commit changes
    git add .
    git commit -m "Initial commit - Happy 26th Birthday Saskia! 🌸"
    
    echo.
    echo Mengunggah kode ke GitHub...
    echo Silakan masukkan kredensial login GitHub Anda jika diminta pada popup.
    
    git branch -M main
    git push -u origin main --force
    
    echo.
    echo 🎉 Berhasil diunggah ke GitHub!
    echo.
    echo Untuk mengaktifkan website langsung:
    echo 1. Buka repository Anda di browser: https://github.com/adermaulana-dre/birthday-web
    echo 2. Masuk ke Settings -> Pages
    echo 3. Pada bagian 'Build and deployment', ubah Source menjadi 'Deploy from a branch'
    echo 4. Pilih branch 'main' dan folder '/ (root)', lalu klik Save.
    echo 5. Website Anda akan aktif dalam 1-2 menit di URL: https://adermaulana-dre.github.io/birthday-web/
    echo.
) else (
    echo.
    echo Deployment dilewati. Anda dapat membuka dan menguji website secara lokal terlebih dahulu!
)

pause
