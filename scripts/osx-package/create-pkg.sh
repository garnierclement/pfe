#!/bin/sh

# Create package root
mkdir package
cp -Rf ../../docs/ package/docs/
cp -Rf ../../projects/ package/projects/
cp -Rf ../../sensors/ package/sensors/
cp -Rf ../../var/ package/var/

# Create output
mkdir out
pkgbuild --root package \
	--identifier com.manticore.core \
	--version 1.0 \
	--ownership recommended \
	--scripts scripts \
	--install-location "/Applications/Manticore/" \
	out/manticore-v1.0.pkg
	