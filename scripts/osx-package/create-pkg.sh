#!/bin/sh

# Create package root
mkdir package
cp -Rf ../../docs/ package/docs/
cp -Rf ../../projects/ package/projects/
cp -Rf ../../sensors/ package/sensors/
cp -Rf ../../var/ package/var/

# We store our packages in out/
mkdir out

# Create package for Manticore
pkgbuild --root package \
	--identifier com.manticore.core \
	--version 1.0 \
	--install-location "/Applications/Manticore/" \
	out/manticore-v1.0.pkg

	#--scripts scripts/core \
	#--ownership recommended \

# Create dependency packages (no payload, just script)
pkgbuild --nopayload \
	--identifier com.manticore.dependency.brew \
	--scripts scripts/brew \
	out/brew.pkg

pkgbuild --nopayload \
	--identifier com.manticore.dependency.nodejs \
	--scripts scripts/nodejs \
	out/nodejs-brew.pkg

pkgbuild --nopayload \
	--identifier com.manticore.dependency.zeromq \
	--scripts scripts/zeromq \
	out/zeromq-brew.pkg



	