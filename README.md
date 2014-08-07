# PFE (Projet de Fin d'Études)

* Projet de fin d'études - [INSA Lyon] - Département Télécommunications (TC) - [SPE-T Program]  
* [Wireless and Sensor Networks Lab]- Shanghai JiaoTong University  
* April - July 2014

This project marks the completion of a three year course in the Telecommunications department at INSA de Lyon and the obtainment of a French engineering degree, known as a *"Diplôme d’ingénieur"*. It is a project with a research and development perspective in which students are required to propose technologies such as but not limited to platforms, architecture, protocols, and algorithms which are innovative in regards to existing solutions. In this particular project, we were proposed to work on a subject which concerns developing a framework that would bring the power of network capability sensing to musicians who wish to develop live performances or collaborative pieces.

# Objectives

The main objective of this project is to build a framework that will allow musicians/programmers to develop interactive concert platforms whilst using various types of communicating devices sprawled over a well defined space. That is to say providing the musicians with tools to manipulate and control different data inputs such as sensors, keyboards transparently over a certain network infrastructure in order to create various outputs of an art performance such as music, lighting or even video projections.

The concept of this project resides in the usage of sensors such as but not limited to wireless sensors as inputs in order to create, modify or even cancel any kind of sounds, music, lighting or even video projections. For instance, we can simply imagine setting two wireless inertial sensors attached to a dancer, one on the left arm and the other on the right arm. The movement of one arm can be seen as an input allowing the dancer change the volume of the sound according to his motion. At the same time, the sensor on the other arm can be seen as an input used to modulate the pitch or the speed of the played music. Of course, this is a simple example and the objective of our framework is to provide a comprehensible and intuitive platform allowing the musician/programmers to achieve projects with many more complex interactions.

# Repository tree structure

* 	`definitions/`  
	General conventions and definitions   
* 	`pd/`  
	Collection of Pure Data patches  
* 	`projects/`  
	Main directory encompassing all the components of our project  
* 	`scripts/`  
	Scripts used for bootstrap, installation and debug  
*	`sensors/`  
	Description of the sensors and their parameters
* 	`var/`  
	Directory used to store logs, PIDs, and any temporary genrated file during the execution of any component  

# Projects

* 	**Manticore**  
	*Located in [`projects/manticore/`](https://github.com/garnierclement/pfe/tree/master/projects/manticore)*  
	Core program of the framework
* 	**Max/MSP client and Java externals**  
	*Located in `projects/MAX/`*  
	Manticore client for Max/MSP developed as a Java external

# Sensors

*	Mouse
*	Inertial sensor
*	MIDI keyboard

> See [Sensors](https://github.com/garnierclement/pfe/tree/master/sensors)


[SPE-T Program]: http://telecom.insa-lyon.fr/content/filiere-telecoms-rd-chine
[INSA Lyon]: www.insa-lyon.fr
[Wireless and Sensor Networks Lab]: http://wirelesslab.sjtu.edu.cn/