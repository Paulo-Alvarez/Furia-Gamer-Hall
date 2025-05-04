apt-get update && apt-get install -y wget gnupg unzip

wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -O google-chrome-stable_current_amd64.deb

apt-get install -y ./google-chrome-stable_current_amd64.deb

rm -f google-chrome-stable_current_amd64.deb
apt-get clean
apt-get autoremove -y

google-chrome-stable --version