const express = require('express');
const structureRouter = express.Router();

const hierarchyController = require('../controller/hierarchy');

/**
 * The end pint returns all the child nodes of the given parent. 
 * The parent node id is expected as a path parameter.
 */
structureRouter.get('/:node?', hierarchyController.getNodeWithChildren);

/**
 * This endpoint adds a new node to the hierarchy.
 */
structureRouter.post('/', hierarchyController.addNode);

/**
 * This endpoint moves the node to another parent.
 */
structureRouter.patch('/', hierarchyController.updateNode);
  
module.exports = structureRouter;
