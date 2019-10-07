# Docker Swarm : Raspberry Pi powered

## Architecture

- 1 RPi 4 4GB
- 2 RPi 3B+ 1GB
- 1 RPi 3 1GB

## Pre-requisites

### DietPi

Install DietPi OS on every Pi following [this tutorial](https://dietpi.com/phpbb/viewtopic.php?t=9).

### Configure SSH Keys

**On each RPi** :

1. Generate RSA keys `ssh-keygen`
2. Copy the output to `~/.ssh/authorized_keys` on every other Pi
3. Install Docker with dietpi-software : `sudo dietpi-software`

### Convoy : Docker Plugin for NFS

**On each RPi** :

1. Install convoy binaries

```shell
wget https://github.com/rancher/convoy/releases/download/v0.5.0/convoy.tar.gz
tar -xvzf convoy.tar.gz
sudo cp convoy/convoy convoy/convoy-pdata_tools /usr/local/bin/
```

2. Setup communication socket between Docker and Convoy

```shell
sudo mkdir -p /etc/docker/plugins/
sudo bash -c 'echo "unix:///var/run/convoy/convoy.sock" > /etc/docker/plugins/convoy.spec'
```

3. 