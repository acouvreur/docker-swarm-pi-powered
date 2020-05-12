docker-compose -f docker-compose.openvpn.yml run --rm openvpn ovpn_genconfig -u tcp://vpn.${DOMAINNAME}:443
sudo sed -i 's/^port 1194/port 443/g' ./openvpn/openvpn.conf
docker-compose -f docker-compose.openvpn.yml run --rm openvpn ovpn_initpki

docker-compose -f docker-compose.openvpn.yml up -d