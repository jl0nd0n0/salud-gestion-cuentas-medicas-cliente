read -p "Estas seguro de actualizar HOMI PRODUCCION ? " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    # do dangerous stuff
	cd release/build
	sshpass -p 'AxJ5^Yu2NOKh1Ob*wUyRD$4YvIQP8nz%WJs' rsync -avAXEWSlHh --exclude '.git' --exclude 'node_modules' --exclude 'release' --exclude 'source' --exclude 'server' --exclude 'img' --exclude 'widgets' --exclude 'webfonts' --exclude 'assets/images/product/Source/' -e 'ssh -p 9922' . jlondono@172.26.0.4:/var/www/html/homi.artemisaips.com/public_html/
	#sshpass -p 'AxJ5^Yu2NOKh1Ob*wUyRD$4YvIQP8nz%WJs' rsync -avAXEWSlHh --exclude '.git' --exclude 'node_modules' --exclude 'release' --exclude 'source' --exclude 'server' --exclude 'img' --exclude 'widgets' --exclude 'webfonts' --exclude 'assets/images/product/Source/' -e 'ssh -p 9922' . jlondono@162.212.158.245:/var/www/html/homi.artemisaips.com/public_html/
	
fi
