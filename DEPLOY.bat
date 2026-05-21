@echo off
title Deploy Website Ulang Tahun Saskia ke GitHub Pages
chcp 65001 >nul 2>&1
echo.
echo ============================================================
echo  DEPLOY WEBSITE ULANG TAHUN SASKIA CHAERUNNISA
echo  github.com/adermaulana-dre/birthday-web
echo ============================================================
echo.

:: ---- STEP 1: Copy Baekhyun images ----
echo [1/4] Menyalin gambar Baekhyun ke folder assets...

set "BRAIN=C:\Users\dep018\.gemini\antigravity-ide\brain\c687ba2b-bd78-404d-9d45-8ad3babc2fcd"
set "ASSETS=%~dp0assets"

if not exist "%ASSETS%" mkdir "%ASSETS%"

copy /B /Y "%BRAIN%\baekhyun_one_1779360561105.png" "%ASSETS%\baekhyun_1.jpg"
copy /B /Y "%BRAIN%\baekhyun_two_1779360591287.png" "%ASSETS%\baekhyun_2.jpg"
copy /B /Y "%BRAIN%\baekhyun_three_1779360667234.png" "%ASSETS%\baekhyun_3.jpg"

if exist "%ASSETS%\baekhyun_1.jpg" (
    echo    [OK] baekhyun_1.jpg - Candy Sweet Theme
) else (
    echo    [GAGAL] baekhyun_1.jpg tidak tersalin!
)
if exist "%ASSETS%\baekhyun_2.jpg" (
    echo    [OK] baekhyun_2.jpg - UN Village Night Theme
) else (
    echo    [GAGAL] baekhyun_2.jpg tidak tersalin!
)
if exist "%ASSETS%\baekhyun_3.jpg" (
    echo    [OK] baekhyun_3.jpg - Bambi Cozy Theme
) else (
    echo    [GAGAL] baekhyun_3.jpg tidak tersalin!
)

:: ---- STEP 2: Clean up temp files ----
if exist "%~dp0assets\dummy.txt" del /Q "%~dp0assets\dummy.txt"
if exist "%~dp0test.txt" del /Q "%~dp0test.txt"
if exist "%~dp0Pages" del /Q "%~dp0Pages"

echo.
echo [2/4] Menyiapkan repository Git...

:: ---- STEP 3: Git setup ----
git remote remove origin >nul 2>&1
git remote add origin https://github.com/adermaulana-dre/birthday-web.git

echo.
echo [3/4] Commit semua file...
git add .
git commit -m "Birthday website Saskia - fix JS bug + gambar Baekhyun + deploy"

echo.
echo [4/4] Push ke GitHub...
git branch -M main
git push -u origin main --force

echo.
echo ============================================================
echo  BERHASIL! Website sudah di-upload ke GitHub!
echo ============================================================
echo.
echo Langkah berikutnya - Aktifkan GitHub Pages:
echo.
echo  1. Buka: https://github.com/adermaulana-dre/birthday-web
echo  2. Klik tab [Settings]
echo  3. Klik [Pages] di sidebar kiri
echo  4. Pada "Source": pilih "Deploy from a branch"
echo  5. Branch: main   Folder: / (root)
echo  6. Klik [Save]
echo.
echo  Website akan aktif dalam 1-2 menit di:
echo  https://adermaulana-dre.github.io/birthday-web/
echo.
echo ============================================================
pause
