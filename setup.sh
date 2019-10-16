#!/bin/bash

# /!\ Start this script on the master of the swarm

# Configuration for every apps
export PUID=1000 # User ID to set inside the containers
export PGID=1000 # Group ID to set inside the containers
# Avoid right issues on shared folder within containers
export TZ="Europe/Paris"
# export DOMAINNAME=""   # Configure top level domain name every exposed containers
                                        # will be available at something.${DOMAINNAME}

# OVH Configuration to DNS Challenge a wildcard domain to Let's Encrypt with Traefik
# export OVH_ENDPOINT="ovh-eu"
# export OVH_APPLICATION_KEY=""
# export OVH_APPLICATION_SECRET=""
# export OVH_CONSUMER_KEY=""
# export TRAEFIK_NETWORK=traefik

# 1. Init the swarm through the local ipv4 address
docker swarm init --advertise-addr $(hostname -I | cut -d' ' -f1)

# 2. Create an attachable network so multiple 
# swarm stack can join it
docker network create --attachable --driver overlay traefik

# 3. Connect nodes to the swarm
JOIN_TOKEN=$(docker swarm join-token worker | grep token | awk '{ print $5 }')
ADVERTISED_IP=$(docker swarm join-token worker | grep token | awk '{ print $6 }')
ssh Odin docker swarm join --token ${JOIN_TOKEN} ${ADVERTISED_IP}
ssh Thor docker swarm join --token ${JOIN_TOKEN} ${ADVERTISED_IP}
ssh Loki docker swarm join --token ${JOIN_TOKEN} ${ADVERTISED_IP}

