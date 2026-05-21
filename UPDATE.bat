@echo off
title Push Update ke GitHub - Website Saskia
chcp 65001 >nul 2>&1
echo.
echo ============================================================
echo  UPDATE WEBSITE KE GITHUB PAGES
echo ============================================================
echo.

echo [1/3] Menyalin gambar Baekhyun ke folder assets...
set "BRAIN=C:\Users\dep018\.gemini\antigravity-ide\brain\c687ba2b-bd78-404d-9d45-8ad3babc2fcd"

if not exist "assets" mkdir assets
copy /B /Y "%BRAIN%\baekhyun_one_1779360561105.png"   "assets\baekhyun_1.jpg"
copy /B /Y "%BRAIN%\baekhyun_two_1779360591287.png"   "assets\baekhyun_2.jpg"
copy /B /Y "%BRAIN%\baekhyun_three_1779360667234.png" "assets\baekhyun_3.jpg"

if exist "assets\baekhyun_1.jpg" (echo    OK: baekhyun_1.jpg) else (echo    GAGAL: baekhyun_1.jpg)
if exist "assets\baekhyun_2.jpg" (echo    OK: baekhyun_2.jpg) else (echo    GAGAL: baekhyun_2.jpg)
if exist "assets\baekhyun_3.jpg" (echo    OK: baekhyun_3.jpg) else (echo    GAGAL: baekhyun_3.jpg)

if exist "assets\dummy.txt" del /Q "assets\dummy.txt"
if exist "test.txt"         del /Q "test.txt"

echo.
echo [2/3] Commit semua perubahan...
git add .
git status
git commit -m "Fix: countdown timer + script.js rewrite + gambar Baekhyun"

echo.
echo [3/3] Push ke GitHub...
git push origin main --force

echo.
echo ============================================================
echo  SELESAI! Tunggu 1-2 menit lalu buka:
echo  https://adermaulana-dre.github.io/birthday-web/
echo ============================================================
echo.
pause
