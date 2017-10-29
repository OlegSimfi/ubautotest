cd /d %~dp0

call start_docker_image.bat

SET ub=E:\UnityBase\ub.exe
SET ConfigFile=E:\Git\ubjs\apps\autotest\ubConfig.json
%ub% -dev -cfg %ConfigFile%

rem ub -calcIntegrity
rem ub -dev %~dp0\ubConfig.json

rem call stop_docker_image.bat