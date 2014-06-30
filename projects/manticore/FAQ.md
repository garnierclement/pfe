<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [Manticore FAQ](#manticore-faq)
  - [What is Manticore ?](#what-is-manticore-)
  - [How does one node communicate with another ?](#how-does-one-node-communicate-with-another-)
  - [Do I need Manticore on my computer ?](#do-i-need-manticore-on-my-computer-)
  - [What is a sensor ?](#what-is-a-sensor-)
  - [What is *InCh* ?](#what-is-inch-)
  - [What is *MaCh* ?](#what-is-mach-)
  - [Why is there an HTTP server on Manticore ?](#why-is-there-an-http-server-on-manticore-)
  - [How do I request a resource ?](#how-do-i-request-a-resource-)
  - [What is a resource ?](#what-is-a-resource-)
  - [How do I had a new sensor into the framework ?](#how-do-i-had-a-new-sensor-into-the-framework-)
  - [What is ZeroMQ ?](#what-is-zeromq-)
  - [What is Node.js ?](#what-is-nodejs-)
  - [What is a Max/MSP external ?](#what-is-a-maxmsp-external-)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Manticore FAQ

## What is Manticore ?

> // TODO
> quel est sa place ?
> each node (i.e. computer) of the network require its own manticore instance

## How does one node communicate with another ?

Each node on the network have its own instance of Manticore and they use the *InCh* and *MaCh* communication channel to exchange information and data.

These communications channels are achieved by the use of a custom made protocol relying on TCP sockets.

This custom made protocol uses JSON object with a simple 2 part (header and paylaod)
refer to the guide about inter-core messaging for more in-depth about its content and messaging type ...


## Do I need Manticore on my computer ?

You need a Manticore instance on your computer if 

1. You are a Raspberry Pi (or any other computer actually) who wants to provide a resource to the network
2. You are running a musical coding software (like Max/MSP) and you want to access to 

## What is a sensor ?

A sensor can be any device that we use as input of information. The sensor can be directly connected to its node (a mouse connected with USB cable) or wireless (inertial sensor using ZigBee communication with the node).

## What is *InCh* ?

> // TODO
> What is it ? undirectionnal asynchronous information channel. that is to say ...
> Deserve which purpose ?
> How is it implemented (PUB/SUB ZeroMQ pattern)

## What is *MaCh* ?

> // TODO

## Why is there an HTTP server on Manticore ?

> // TODO
> use a web browser as a simple client

Allow the following procedure :

1. Set up a UDP socket on a chosen port in your favorite musical or creative coding software/framework (i.e. Max/MSP, Processing, openFrameworks, etc.)
2. Use your web browser and the web interface to request a resource by specifiying the previously chosen port and cliking on the `Request` button
3. Now you should receive an UDP datagrams with OSC formated packets including data from the requested resource

## How do I request a resource ?

> // TODO (what shoul I use ?)

## What is a resource ?

> // TODO
A resource represents the data which is provided by a sensor. When we say that we want to request a resource, it means that our program wants to access to the data from a sensor located on another node in the network.

## How do I had a new sensor into the framework ?

> // TODO

## What is ZeroMQ ? 

> // TODO (and why is it useful ?)

## What is Node.js ?

> // TODO (javascript and good to read documentation about patterns and modules)

## What is a Max/MSP external ?

> // TODO

