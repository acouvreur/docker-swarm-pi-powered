#!/bin/bash

# 1. Download
wget https://github.com/ContainX/docker-volume-netshare/releases/download/v0.36/docker-volume-netshare_0.36_armhf.deb

sudo dpkg -i docker-volume-netshare_0.36_armhf.deb

sudo service docker-volume-netshare start

rm docker-volume-netshare_0.36_armhf.deb
