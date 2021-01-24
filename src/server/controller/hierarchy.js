const structureService = require('../service/structure');

/**
 * Find the node with its children.
 *
 * If the node is found ,returns with 200 OK with the details.
 * If the node is not found, returns an 400 Bad request.
 *
 * @param req
 * @param res
 */
const getNodeWithChildren = (req, res) => {
  const { params: { node }}= req;

  structureService.getAllChildrenOfNode(node).then((children) => {
    res.send(children);
  }, () => {
    res.status(400).send({
      errorCode: "404",
      errorMessage: "The node you are searching is invalid",
    });
  });
}

/**
 * Adds the given node to the hierarchy.
 *
 * If the node is valid, returns 200 OK.
 * If the node is not valid, returns an 400 Bad request.
 *
 * @param req
 * @param res
 */
const addNode = (req, res) => {
  const node = req.body;

  if(!node || !node.id || !node.id.match || node.id.match(/[^a-zA-Z0-9]/)) {
    res.status(400).send({
      errorCode: "400",
      errorMessage: "The node you are trying to add is invalid",
    });
  } else {
    structureService.addNode(node).then((result) => {
      res.send({
        status: "success",
        message: "Node added successfully"
      })
    }, (error) => {
      res.status(400).send({
        errorCode: "400",
        errorMessage: "The node you are trying to add is invalid",
      });
    });
  }
};

/**
 * Update the nodes parent.
 *
 * If the node is found and if the given details are valid, returns with 200 OK with the details.
 * If the node is not found or if the details are not vaild, returns an 400 Bad request.
 *
 * @param req
 * @param res
 */
const updateNode = (req, res) => {
  const node = req.body;
  structureService.updateParent(node).then((result) => {
    res.send({
      status: "success",
      message: "Node updated successfully"
    });
  }, (error) => {
    res.status(400).send({
      status: "failure",
      message: "Failed to update the node"
    });
  });
};

module.exports = { getNodeWithChildren, addNode, updateNode };
