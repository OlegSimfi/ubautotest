if exist ..\ub-e\packages (
  cd ..\ub-e
  call npm i
  call npx lerna bootstrap
  @if errorlevel 1 goto err
  cd ..\ubjs
) else (
  echo UnityBase enterprise repository not found
  echo If you have access to https://gitlab.intecracy.com/unitybase/ub-e.git - clone it
  echo otherwise remove all @ub-e/* models from .\apps\autotest\ubConfig*.json 
)

if exist ..\ub-d\packages (
  cd ..\ub-d
  call npm i
  call npx lerna bootstrap
  @if errorlevel 1 goto err
  cd ..\ubjs
) else (
  echo UnityBase Defense repository not found
  echo If you have access to https://gitlab.intecracy.com/unitybase/ub-d.git - clone it
  echo otherwise remove all @ub-d/* models from .\apps\autotest\ubConfig*.json 
)

call npm i
@if errorlevel 1 goto err
call npx lerna bootstrap
@if errorlevel 1 goto err

cd .\packages\ubcli
set NODE_ENV=production
call npm link
set NODE_ENV=dev
cd ..\..

if not defined SRC (
 echo get a compiled DLL from a unitybase registry
 mkdir %temp%\ub-bootstrap
 cd /d %temp%\ub-bootstrap
 call npm init -y
 set NODE_ENV=production
 call npm i @unitybase/mailer @ub-d/iit-crypto --registry http://registry.unitybase.info
 xcopy /I /E /Q /Y  %temp%\ub-bootstrap\node_modules\@unitybase\mailer\bin %~dp0\..\apps\autotest\node_modules\@unitybase\mailer\bin
 xcopy /I /E /Q /Y  %temp%\ub-bootstrap\node_modules\@ub-d\iit-crypto\bin %~dp0\..\apps\autotest\node_modules\@ub-d\iit-crypto\bin
 cd /d %~dp0
 rmdir /S /Q %temp%\ub-bootstrap
) else (
 call npm run build:native
 @if errorlevel 1 goto err
)

@goto end

:err
@echo Bootstrap failed
EXIT /B 1

:end
