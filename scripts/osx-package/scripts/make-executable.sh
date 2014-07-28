#!/bin/sh

# Ensures that all scripts can be executed
chmod -v +x ./*/preinstall
chmod -v +x ./*/postinstall
chmod -v +x ./commands/*.command
chmod -v +x ./commands/*/*.command