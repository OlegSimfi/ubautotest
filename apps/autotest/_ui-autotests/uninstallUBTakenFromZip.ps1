(Get-Process -Name "ub" ).kill()

ub -http unregister
$newPath = $env:Path -replace "C:\\unityBase;", ""
[Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
[Environment]::SetEnvironmentVariable("UB_HOME", $null, "Machine")
Remove-Item 'C:\UnityBase' -Recurse

npm uninstall -g @unitybase/ubcli


