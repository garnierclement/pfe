#!/bin/sh

# Variables
VERSION="0.1"

# Create a custom package for Manticore
mkdir package
cp -Rf ../../docs/ package/docs/
cp -Rf ../../projects/ package/projects/
cp -Rf ../../sensors/ package/sensors/
cp -Rf ../../var/ package/var/

# We store our packages in out/
mkdir out

# Create package for Manticore
pkgbuild --root package \
	--identifier com.github.garnierclement.pfe.manticore \
	--version $VERSION \
	--install-location "/Applications/Manticore/" \
	--scripts scripts/core \
	out/core-$VERSION.pkg

	#--ownership recommended \

# Package for launchd
pkgbuild --root launchd/ \
	--identifier com.github.garnierclement.pfe.launchd \
	--install-location "/Library/LaunchDaemons/" \
	--scripts scripts/launchd \
	--ownership recommended \
	out/manticore-launchd.pkg

# Create dependency packages (no payload, just scripts)
pkgbuild --nopayload \
	--identifier com.github.garnierclement.pfe.dependency.brew \
	--scripts scripts/brew \
	out/brew.pkg

pkgbuild --nopayload \
	--identifier com.github.garnierclement.pfe.dependency.nodejs \
	--scripts scripts/nodejs \
	out/nodejs-brew.pkg

pkgbuild --nopayload \
	--identifier com.github.garnierclement.pfe.dependency.zeromq \
	--scripts scripts/zeromq \
	out/zeromq-brew.pkg

# Main package
productbuild --distribution distribution.xml \
	--resources resources \
	--package-path out \
	--version $VERSION \
	manticore-$VERSION.pkg

	