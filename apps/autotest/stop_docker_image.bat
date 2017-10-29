set /p containerid=<onlyoffice.pid
docker stop %containerid%
rm .\onlyoffice.pid