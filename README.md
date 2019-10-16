# Docker Swarm : Raspberry Pi powered

## Architecture

- 1 RPi 4 4GB (Yggdrasil)
- 2 RPi 3B+ 1GB (Thor & Loki)
- 1 RPi 3B 1GB (Odin)

### Performance tests and consequences

#### SD Card speed

SD Card used : [Samsung Evo Plus 32G](https://www.amazon.fr/gp/product/B06XFSZGCC/ref=ppx_yo_dt_b_asin_title_o02_s00?ie=UTF8&psc=1)

|                            | RPi 4    | RPi 3B+  | RPi 3B   |
| -------------------------- | -------- | -------- | -------- |
| Seq Write Speed (1000 MiB) | 18 MiB/s | 16 MiB/s | 1 MiB/s  |
| Seq Read Speed (1000 MiB)  | 40 MiB/s | 20 MiB/s | 19 MiB/s |

RPi 3B is insanely slow on seq. write speed. Might be an hardware issue !

#### Disk speed (USB)

Disk used : [Seagate 1 To Expansion USB 3.0](https://www.amazon.fr/gp/product/B00TKFEEAS/ref=ppx_yo_dt_b_asin_title_o00_s00?ie=UTF8&psc=1)

| Disk format : **NTFS**     | RPi 4    | RPi 3B   |
| -------------------------- | -------- | -------- |
| Seq Write Speed (1000 MiB) | 18 MiB/s | 18 MiB/s |
| Seq Read Speed (1000 MiB)  | 63 MiB/s | 29 MiB/s |

| Disk format : **Ext4**     | RPi 4     | RPi 3B     |
| -------------------------- | --------- | ---------- |
| Seq Write Speed (1000 MiB) | 85 MiB/s  | Not tested |
| Seq Read Speed (1000 MiB)  | 106 MiB/s | No tested  |

I need high speed between HDD <-> Pi <-> Ethernet, so try to reduce bottleneck.

#### Disk speed (NFS)

Drive is on RPi4, NFS mounted on other Pi.

|                            | RPi 4    | RPi 3B+  | RPi 3B   |
| -------------------------- | -------- | -------- | -------- |
| Seq Write Speed (1000 MiB) | 24 MiB/s | 30 MiB/s | 11 MiB/s |
| Seq Read Speed (1000 MiB)  | 52 MiB/s | 40 MiB/s | 11 MiB/s |

RPi3 Ethernet port is 100 Mbps which is ~11MiB/s so this is accurate.

#### Ethernet speed

|          | RPi 4         | RPi 3B+         | RPi 3B     |
| -------- | ------------- | --------------- | ---------- |
| Download | 35-88 MiB/s   | 18-30 MiB/s     | 11 MiB/s   |
| Upload   | ? 0.5 MiB/s ? | 16.7-24.5 MiB/s | 10.4 MiB/s |

## Pre-requisites

### DietPi

Install DietPi OS on every Pi following [this tutorial](https://dietpi.com/phpbb/viewtopic.php?t=9).

### Configure SSH Keys

**On each RPi** :

1. Generate RSA keys `ssh-keygen`
2. Copy the output to `~/.ssh/authorized_keys` on every other Pi
3. Install Docker with dietpi-software : `sudo dietpi-software`
