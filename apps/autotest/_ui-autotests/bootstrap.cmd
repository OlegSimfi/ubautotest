call npm set prefer-offline true
call npm i
call .\node_modules\.bin\lerna bootstrap

cd .\packages\ubcli
call npm link
cd ..\..

if exist ..\ub-e\packages (
  cd ..\ub-e
  call npm i --prefer-offline
  call .\node_modules\.bin\lerna bootstrap
  cd ..\ubjs
) else (
  echo UnityBase enterprise repository not found
  echo If you have access to https://gitlab.intecracy.com/unitybase/ub-e.git - clone it
  echo otherwise remove all @ub-e/* models from .\apps\autotest\ubConfig*.json 
)

if exist ..\ub-d\packages (
  cd ..\ub-d
  call npm i
  call .\node_modules\.bin\lerna bootstrap
  cd ..\ubjs
) else (
  echo UnityBase Defense repository not found
  echo If you have access to https://gitlab.intecracy.com/unitybase/ub-d.git - clone it
  echo otherwise remove all @ub-d/* models from .\apps\autotest\ubConfig*.json 
)

REM cd .\apps\autotest
REM call npm i
REM if not defined SRC (
REM   echo on
REM   echo To compile a native modules you need:
REM   echo  - checkout a UnityBase server sources 
REM   echo  - set environment variable SRC to Source folder location
REM   echo  - execute command `npm run build:native`
REM   echo Compilation use a Delphi@XE2-sp4 Delphi@7 and InnoSetup@5.5.9 - all of them MUST be installed
REM   echo In case you do not have access to Server Sources or compilers - run a 
REM   echo   `npm run replace-native` in autotest folder
REM   echo This will install latest compiled packages from registry
REM   exit 1
REM )
REM 
REM cd ..\..
REM call npm run build:native


