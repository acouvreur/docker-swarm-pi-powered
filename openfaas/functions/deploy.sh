#!/bin/sh

faas-cli deploy -f ./radarr-sonarr-fn.yml --network traefik
