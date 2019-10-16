# Docker Swarm : Raspberry Pi powered

## Architecture

- 1 RPi 4 4GB (Yggdrasil)
- 2 RPi 3B+ 1GB (Thor & Loki)
- 1 RPi 3 1GB (Odin)

### Performance tests and consequences

#### Disk speed (USB)

|                            | RPi 4    | RPi 3    |
| -------------------------- | -------- | -------- |
| Seq Write Speed (1000 MiB) | 18 MiB/s | 18 MiB/s |
| Seq Read Speed (1000 MiB)  | 63 MiB/s | 29 MiB/s |

I need high speed between HDD <->

#### Ethernet speed

|          | RPi 4           | RPi 3B+        | RPi3      |
| -------- | --------------- | -------------- | --------- |
| Download | 300-740 Mbit/s  | 150-250 Mbit/s | 92 Mbit/s |
| Upload   | ? 4.10 Mbit/s ? | 140-205 Mbit/s | 87 Mbit/s |

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