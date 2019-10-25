#!/bin/sh

faas-cli build --image acouvreur/radarr-sonarr-fn:latest -f ./radarr-sonarr-fn.yml
