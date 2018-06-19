#!/bin/bash

rm -rf /opt/thehive/

~/TheHive/bin/activator clean stage

cp -r ~/TheHive/target/universal/stage /opt/thehive

chown -R thehive /opt/thehive

service thehive restart