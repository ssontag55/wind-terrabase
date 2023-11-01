@echo off
set LIB_DIR="%~dp0..\lib"
for /f "delims=X" %%i in ('dir /b %LIB_DIR%\grib2json-*.jar') do set LAUNCH_JAR=%LIB_DIR%\%%i
"java" -Xmx512M -jar %LAUNCH_JAR% %*
