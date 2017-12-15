#!/usr/bin/bash
PATH=/usr/bin
argument=${1}
DIR="$(cd "$(dirname "$0")" && pwd)"
cd ${DIR}
cd ..
echo "Calling node from $PWD"
echo "node server/web.js ${argument}"
echo "+++++"
echo "*****"
node "server/web.js"
echo "*****"
