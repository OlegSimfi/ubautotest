# npm i -g npm@5.3.0
# npm i -g lerna npx
# npm i -g webpack

$startDate = get-date
write-host $startDate

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory("C:\Users\QA\Documents\UBStandard4.1.0-beta.6.zip", "C:\UnityBase")

$oldPath = $env:Path
[Environment]::SetEnvironmentVariable("Path", $oldPath + ";C:\UnityBase", "Process")
[Environment]::SetEnvironmentVariable("Path", $oldPath + ";C:\UnityBase", "Machine")
 
[Environment]::SetEnvironmentVariable("UB_HOME", "C:\UnityBase", "Process")
[Environment]::SetEnvironmentVariable("UB_HOME", "C:\UnityBase", "Machine")
 
ub -http register
npm i -g @unitybase/ubcli --registry=http://registry.unitybase.info

git config --global user.email "ubautomation.no-reply@softengi.com"
git config --global user.name "ubautomation ubautomation"

cd c:\
git clone  --recursive  "https://ubautomation:w5M3h7g2xfuK@gitlab.intecracy.com/unitybase/ub-all.git"
cd C:\ub-all\ubjs
git pull origin master
git log origin/uiautotest -n 1
git log master -n 1
git merge origin/uiautotest -s recursive -Xours -v

# ----- after clonning repositories
cd C:\ub-all
npm run bootstrap

get-date
cd C:\ub-all\ubjs\apps\autotest
.\tsql3.cmd

$finishDate = get-date
write-host $finishDate
$deploymentDuration = new-timespan -start $startDate -end $finishDate
write-host $deploymentDuration
write-host ("Deployment duration, seconds: " + $deploymentDuration.TotalSeconds)

ub
