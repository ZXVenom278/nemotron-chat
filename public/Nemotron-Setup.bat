@echo off
title Nemotron Setup
echo.
echo   Setting up Nemotron on this PC...
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
 "$ErrorActionPreference='Stop';" ^
 "$dir=Join-Path $env:LOCALAPPDATA 'Nemotron'; New-Item -ItemType Directory -Force $dir | Out-Null;" ^
 "$ico=Join-Path $dir 'nemotron.ico'; Invoke-WebRequest 'https://nemotron-ultra-chat.netlify.app/nemotron.ico' -OutFile $ico -UseBasicParsing;" ^
 "$edge=@(\"${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe\",\"$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe\") | Where-Object {Test-Path $_} | Select-Object -First 1;" ^
 "if(-not $edge){throw 'Microsoft Edge was not found. Install Edge from microsoft.com/edge and run this again.'}" ^
 "$ws=New-Object -ComObject WScript.Shell;" ^
 "foreach($folder in @([Environment]::GetFolderPath('Desktop'),[Environment]::GetFolderPath('Programs'))){" ^
 "  $s=$ws.CreateShortcut((Join-Path $folder 'Nemotron.lnk')); $s.TargetPath=$edge;" ^
 "  $s.Arguments='--app=https://nemotron-ultra-chat.netlify.app/ --window-size=900,800'; $s.IconLocation=$ico; $s.Description='Nemotron 3 Ultra chat'; $s.Save() }"
if errorlevel 1 (
  echo.
  echo   Something went wrong. Check you are online and try again.
  pause
  exit /b 1
)
echo   Done! A "Nemotron" icon is now on your desktop and in the Start menu.
echo   Opening it now...
start "" "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Nemotron.lnk"
timeout /t 4 >nul
