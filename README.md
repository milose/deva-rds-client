# deva.co RDS Client

A client for Deva.co Radio Data System distribution network.

## Setup locale

```bash
sudo timedatectl set-timezone Europe/Podgorica
sudo nano /etc/locale.gen # uncomment en_US.UTF-8
sudo localectl set-locale LANG=en_US.UTF-8
sudo locale-gen
nano ~/.bashrc
```

Add these lines to `.bashrc` file.

```config
export LC_CTYPE=en_US.UTF-8
export LC_ALL=en_US.UTF-8

alias ~='cd ~'
alias ..='cd ..'
alias ...='cd .. && cd ..'
alias ll='ls -lah'
alias p='pnpm'
alias gs='git status'
alias gl='git log --graph --pretty='\''%C(yellow)%h %ad%Cred%d %Creset%s%Cblue [%cn]'\'' --abbrev-commit --date=short --all'
alias nah='git reset --hard && git clean -df'
```

Reload the config.

```bash
source ~/.bashrc
```

Check that locale is working and that there are no error messages.

```bash
localectl; locale; locale -a
```

## Update The System

```bash
sudo apt update && sudo apt upgrade -y
```

## Enable Serial Port and Reboot

```bash
sudo raspi-config
```

Go to `Interface Options`, select `Serial Port`, then say `No` to login shell, then `Yes` to `serial port hardware`.

## Key Deprecation Error Fix

https://forums.raspberrypi.com/viewtopic.php?t=358016#p2146722

## Install Node / Git ETC

```bash
```

```bash
sudo apt install nodejs npm git
git config --global user.email "radio@radio.com"
git config --global user.name "radio"
ssh-keygen
cat ~/.ssh/id_rsa.pub # copy to github
nano ~/.ssh/config
```

Add github configuration

```config
Host github.com
 HostName github.com
 User milose
 IdentityFile ~/.ssh/id_rsa
```

## Install pm2

```bash
sudo npm install pm2@latest -g
pm2 install pm2-logrotate
pm2 startup
```

## Installation

```bash
git clone https://github.com/milose/deva-rds-client.git
cd deva-rds-client
npm install
cp .env.example .env
node list.js # get available ports
sudo nano /etc/udev/rules.d/99-com.rules # add , MODE="0666",
# to KERNEL=="ttyAMA[0-9]*|ttyS[0-9]*", MODE="0666", PROGRAM="/bin/sh -c '\
sudo udevadm control --reload-rules
sudo udevadm trigger
ls /dev/ttyAMA0 -la
nano .env # edit settings
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

