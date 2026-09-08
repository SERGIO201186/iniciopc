@echo off
REM ============================================================================
REM  OMNIA CONTROL - Arranque en modo kiosco
REM  Abre el panel a pantalla completa, sin barra de direcciones ni pestanas,
REM  usando un perfil de navegador aparte (no toca tu perfil normal de Chrome
REM  ni de Edge). Pensado para la PC compartida de recepcion/empleados.
REM
REM  Ver KIOSCO-PC.md en esta misma carpeta para las instrucciones completas
REM  (como activar GitHub Pages, como hacer que esto arranque solo con la PC,
REM  y como salir del modo kiosco).
REM ============================================================================

setlocal

REM --- URL del panel publicado en GitHub Pages ---
set "PANEL_URL=https://sergio201186.github.io/iniciopc/"

REM --- Perfil de navegador exclusivo para el kiosco ---
set "PERFIL=%LOCALAPPDATA%\OmniaKiosco"

set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
set "CHROME_X86=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
set "EDGE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
set "EDGE_ALT=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"

set "FLAGS=--kiosk "%PANEL_URL%" --user-data-dir="%PERFIL%" --noerrdialogs --disable-translate --disable-infobars --disable-session-crashed-bubble --overscroll-history-navigation=0 --disable-pinch --no-first-run"

if exist "%CHROME%" (
    start "" "%CHROME%" %FLAGS%
) else if exist "%CHROME_X86%" (
    start "" "%CHROME_X86%" %FLAGS%
) else if exist "%EDGE%" (
    start "" "%EDGE%" %FLAGS% --edge-kiosk-type=fullscreen
) else if exist "%EDGE_ALT%" (
    start "" "%EDGE_ALT%" %FLAGS% --edge-kiosk-type=fullscreen
) else (
    echo No se encontro Google Chrome ni Microsoft Edge instalados en esta PC.
    echo Instala alguno de los dos y vuelve a intentarlo.
    pause
)

endlocal
