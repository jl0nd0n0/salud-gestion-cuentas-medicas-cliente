read -p "Estas seguro de actualizar HOMI PRODUCCION ? " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    # do dangerous stuff
	cd release/build
	sshpass -p '5f30OgW47qDUf5A' rsync -avAXEWSlHh --exclude '.git' --exclude 'node_modules' --exclude 'release' --exclude 'source' --exclude 'server' --exclude 'img' --exclude 'widgets' --exclude 'webfonts' --exclude 'assets/images/product/Source/' -e 'ssh ' . jlondono@172.26.0.6:/var/www/html/homi1.artemisaips.com/public_html/	
fi
