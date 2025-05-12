@echo off 
set param1="%~1"

IF %param1%=="" (
	echo Debe ingresar el mensaje del commit
) ELSE (
	git add . && git commit -m %param1% && git push origin main
)