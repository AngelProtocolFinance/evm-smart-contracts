#!/bin/sh

# turn logging on
set -x;

if [ "$1" == "mumbai" ]; then 
  rpc=$(grep MUMBAI_RPC_URL .env | cut -d '=' -f2 | sed -e 's/^\"//' -e 's/\"$//');
elif [ "$1" == "polygon" ]; then
  rpc=$(grep POLYGON_RPC_URL .env | cut -d '=' -f2 | sed -e 's/^\"//' -e 's/\"$//');
elif [ "$1" == "goerli" ]; then
  rpc=$(grep GOERLI_RPC_URL .env | cut -d '=' -f2 | sed -e 's/^\"//' -e 's/\"$//');
elif [ "$1" == "mainnet" ]; then
  rpc=$(grep MAINNET_RPC_URL .env | cut -d '=' -f2 | sed -e 's/^\"//' -e 's/\"$//');
else
  echo ERROR: Select valid option from {mumbai, polygon, goerli, mainnet}
  exit 1;
fi

hardhat node --fork $rpc
