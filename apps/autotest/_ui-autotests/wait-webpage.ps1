param
(
    [string]$url = 'http://localhost:888/ubadminui',
    [int]$timeout = 700,
    [int]$step = 10
)
$counter = 0
write-host "Start waiting, URL=$url timeout=$timeout step=$step"
while($true){
    try 
    {
        Invoke-WebRequest -Uri $url -Method Get | out-null
        write-host "got response from page, finished"
        break
    }catch{
        write-host -NoNewline "."
    }
    start-sleep $step
    $counter += $step
    if($counter -gt $timeout){ 
        write-host "Fail"
        write-host "Timeout exceeded"
        exit 1
    }
}