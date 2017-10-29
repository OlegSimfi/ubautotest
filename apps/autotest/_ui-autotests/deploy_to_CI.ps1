$ubjsRootPath = (Resolve-Path .\..\..\).Path

remove-item "$ubjsRootPath\.bin\bootstrap.cmd"
copy-item "$ubjsRootPath\apps\autotest\_ui-autotests\bootstrap.cmd" -Destination "$ubjsRootPath\.bin"

remove-item "$ubjsRootPath\apps\autotest\package.json"
copy-item "$ubjsRootPath\apps\autotest\_ui-autotests\package_testapp.json" -Destination "$ubjsRootPath\apps\autotest"
rename-item "$ubjsRootPath\apps\autotest\package_testapp.json" -NewName "$ubjsRootPath\apps\autotest\package.json"

cd $ubjsRootPath
npm run bootstrap

cd $ubjsRootPath\packages\ubq
npm i @unitybase/mailer

cd $ubjsRootPath\apps\Autotest
npm install
npm run test

ub