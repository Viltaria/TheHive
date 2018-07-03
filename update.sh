~/TheHive/bin/activator clean stage
sudo rm -rf /opt/thehive
sudo service thehive stop
sudo cp -r ~/TheHive/target/universal/stage /opt/thehive
sudo chown thehive:thehive /opt/thehive -R
sudo service thehive start
