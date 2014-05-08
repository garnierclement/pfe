#!/bin/sh

echo "[system info]"
uname -a

echo "[hostname]"
hostname -A

echo "[Wireless LAN wlan0]"
ifconfig wlan0 | head -n2

echo "[Ethernet eth0]"
ifconfig eth0 | head -n2

echo "[USB devices]"
lsusb
