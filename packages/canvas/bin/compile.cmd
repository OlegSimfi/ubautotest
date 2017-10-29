@echo off
if not defined SRC (
  echo SRC environment variable must be defined
  exit 1
)

echo %UB_CORE%

call %SRC%\bin\setEnv.cmd
call %SRC%\bin\setCompilerEnv.cmd
if not exist %~dp0x32 mkdir %~dp0x32
cd %~dp0..\src
%DCC7% -$D- -$L- -$Y- -B -Q -DRELEASE%SM52DEF% -E..\bin\x32 ^
  -I%SYN_LIB% ^
  -R%SYN_LIB% ^
  -U%LIB%\FastMM;%SYN_LIB%;%UB_CORE%;"%DELPHI_7%\Lib" ^
  -N%DCU7_PATH% ^
  UBCanvas.dpr

if not exist %~dp0x64 mkdir %~dp0x64
%DCC64% -$D- -$L- -$Y- -B -Q -DRELEASE%SM52DEF% -E..\bin\x64 ^
  -NSSystem;Winapi;System.Win;Vcl; ^
  -I%SYN_LIB% ^
  -R%SYN_LIB% ^
  -R%LIB%\Synopse ^
  -U%LIB%\FastMM;%SYN_LIB%;%UB_CORE%;"%DELPHI_XE2%\lib\Win64\release" ^
  -N%DCUX64_PATH% ^
  UBCanvas.dpr