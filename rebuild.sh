#!/bin/bash

sudo rm -rf /opt/thehive/

~/TheHive-TicketTemplates/bin/activator clean stage

sudo cp -r ~/TheHive-TicketTemplates/target/universal/stage /opt/thehive

sudo chown -R thehive /opt/thehive

sudo service thehive restart

