# Hierarchy Challenge - Amazing Co.
-----------

_This project is to create a tree structure for structuring Amazing Co._

Amazing Co has a root node (only one) and several children nodes, each one with its own children as well. It's a tree-based structure.

They need two  basic operations:

    1. Get all children nodes of a given node (the given node can be anyone in the tree structure).

    2. Change the parent node of a given node (the given node can be anyone in the tree structure).

Each node should have the following info:

    1. Node identification
    2. Who is the parent node
    3. Who is the root node
    4. The height of the node. In the above example, height(root) = 0 and height(a) == 1.


## Technologies used
---
* Node JS
* Express
* MariaDB
* Jest
* Docker
* React

## Build
---

The expectation is that the below two application is available.

* Git 
* Docker

Either clone the project using git or download the project to a folder and navigate to the project folder in a *terminal* or *command prompt*.

Use ```docker-compose up``` to start the application in port ```3000```. 
Use ```docker-compose stop``` to stop the application. 

Docker will enable the node server, and a mariadb instance once you run the above command.

## Test
---

Use ```yarn test``` to run the test. 

## API Documentation
___

A high level API doc is available [here](https://documenter.getpostman.com/view/8855737/SVmySHoe?version=latest) with couple of examples.