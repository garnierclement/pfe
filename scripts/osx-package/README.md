# Creating an OS X Installer package

Create a `.pkg` installer for Mac OS X in order to provide an user friendly GUI to install Manticore.

**WARNING This a work in progress and does not work yet out of the box**

## Resources

* [Making OS X Installer Packages like a Pro] (StackOverflow)
* [Empaqueter un démon pour OS X]
* [pkgbuild man page] (Apple Developer)
* [pkgutil man page] (Apple Developer)
* [productbuild man page] (Apple Developer)
* [Creating payload-free packages with pkgbuild]


[Making OS X Installer Packages like a Pro]: http://stackoverflow.com/questions/11487596/making-os-x-installer-packages-like-a-pro-xcode4-developer-id-mountain-lion-re
[Empaqueter un démon pour OS X]: http://vincent.bernat.im/fr/blog/2013-autoconf-osx-installeur.html#fnref:sdk
[pkgbuild man page]: https://developer.apple.com/library/mac/documentation/Darwin/Reference/Manpages/man1/pkgbuild.1.html#//apple_ref/doc/man/1/pkgbuild
[pkgutil man page]: https://developer.apple.com/library/mac/documentation/Darwin/Reference/Manpages/man1/pkgutil.1.html
[productbuild man page]: https://developer.apple.com/library/mac/documentation/Darwin/Reference/ManPages/man1/productbuild.1.html
[Creating payload-free packages with pkgbuild]: http://derflounder.wordpress.com/2012/08/15/creating-payload-free-packages-with-pkgbuild/

## Pre and post install scripts

* `pkgbuild` looks for scripts in files called `preinstall` and `postinstall`
* You can use `set -e` to exit immediately if a command exits with a non-zero status (if applicable)
* Remember to `chmod +x` the scripts otherwise the installation will fail during the execution of the scripts
