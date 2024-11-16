#!/bin/sh

rm -rf ./Aurora-Browser-Linux
tar xzf ./tools/nwjs-sdk-v0.59.1-linux-x64.tar.gz
mv nwjs-sdk-v0.59.1-linux-x64 Aurora-Browser-Linux
cp -rf ./src/package.nw Aurora-Browser-Linux
mv ./Aurora-Browser-Linux/nw ./Aurora-Browser-Linux/AuroraBrowser

rm -rf ./Aurora-Browser-Windows
unzip ./tools/nwjs-sdk-v0.59.1-win-x64.zip
mv nwjs-sdk-v0.59.1-win-x64 Aurora-Browser-Windows
cp -rf ./src/package.nw Aurora-Browser-Windows
mv ./Aurora-Browser-Windows/nw.exe ./Aurora-Browser-Windows/AuroraBrowser.exe

