#!/bin/sh

# Variables
VERSION="0.1"
REPO_ROOT="../.."

# Package identifiers
PKG_ID_PREFIX="com.github.garnierclement.pfe"
PKG_ID_MANTICORE="com.github.garnierclement.pfe.manticore"
PKG_ID_LAUNCHD="com.github.garnierclement.pfe.launchd"
PKG_ID_MAX5_EXT="com.github.garnierclement.pfe.max5_externals"
PKG_ID_MAX6_EXT="com.github.garnierclement.pfe.max6_externals"

# Create a custom package for Manticore
mkdir dist
cp -Rf ../../docs/ dist/docs/
cp -Rf ../../projects/ dist/projects/
cp -Rf ../../sensors/ dist/sensors/
cp -Rf ../../var/ dist/var/

# Create a folder for the Max/MSP externals
mkdir -p max_externals/Cycling\ \'74/java/lib/
cp -Rf $REPO_ROOT/projects/MAX/max_externals/lib/*.jar max_externals/Cycling\ \'74/java/lib/

# We store our packages in out/
mkdir out

# Create package for Manticore
pkgbuild --root dist \
	--identifier com.github.garnierclement.pfe.manticore \
	--version $VERSION \
	--install-location "/Applications/Manticore/" \
	--scripts scripts/core \
	--ownership preserve \
	out/core-$VERSION.pkg

# Package for launchd
pkgbuild --root launchd/ \
	--identifier $PKG_ID_LAUNCHD \
	--install-location "/Library/LaunchDaemons/" \
	--scripts scripts/launchd \
	--ownership recommended \
	out/manticore-launchd.pkg

# Package Max/MSP Java externals for Max 5
pkgbuild --root max_externals \
	--identifier $PKG_ID_MAX5_EXT \
	--install-location "/Applications/Max5/" \
	--scripts scripts/max5 \
	--ownership preserve \
	out/max5-java-libs.pkg

# Package Max/MSP Java externals for Max 6
pkgbuild --root max_externals \
	--identifier $PKG_ID_MAX6_EXT \
	--install-location "/Applications/Max 6.1/" \
	--scripts scripts/max6 \
	--ownership preserve \
	out/max6.1-java-libs.pkg

# Package ZeroMQ & Node.js with brew-pkg
cd out
brew pkg --with-deps --identifier-prefix $PKG_ID_PREFIX zeromq
brew pkg --identifier-prefix $PKG_ID_PREFIX nodejs
# or wget http://nodejs.org/dist/v0.10.29/node-v0.10.29.pkg ?
cd ..

# Here we should generate the `distribution.xml` file !

# Main package
productbuild --distribution distribution.xml \
	--resources resources \
	--package-path out \
	--version $VERSION \
	manticore-$VERSION.pkg

	