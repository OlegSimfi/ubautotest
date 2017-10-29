# Installing UnityBase application inside a docker Windows Nano Server based container

## Prerequirements
In Windows10 / Windows Server 2016 enable a docker

Switch you docker to a Windows container mode [as described here](https://docs.docker.com/docker-for-windows/#switch-between-windows-and-linux-containers)

Pull a docket image for nano server `docker pull microsoft/nanoserver`
Clean nanoserver image do not contains a http.sys - TODO http.sys driver is present, but netsh http command is unavailable
Pull a docket image for nano server + iis `docker pull nanoserver/iis`

Do everything using Powershell - [read instruction](https://social.technet.microsoft.com/wiki/contents/articles/38652.nano-server-getting-started-in-container-with-docker.aspx)

docker run --name nanoiis -d -it -p 80:80 nanoserver/iis




Test it by starting nanoserver with powershell in interactive mode: `docker run -it microsoft/nanoserver powershell`







