const OrgModel = require('../dao/org.structure.dao');

/**
 * Prepares the object with the fields id, parent, root and height.
 * 
 * @param {Object} node 
 */
const prepareNodeStructure = (node = {}) => {
    const pathSplit = node.path ? node.path.split('/') : [];
    return {
        id: node.id,
        parent: pathSplit[pathSplit.length > 0 ? pathSplit.length - 1 : 0] || null,
        root: pathSplit[0] || node.id,
        height: pathSplit.length,
    };
};

/**
 * Prepares the array of object with the fields id, parent, root and height.
 * 
 * @param {Array} node 
 */
const prepareNodesStructure = (nodes = []) => {
    return nodes && nodes.map((node) => {
        return prepareNodeStructure(node);
    });
};

/**
 * Adds a node if the node id is not already consumed.
 * 
 * If the new node is a root then it will added only if there are new nodes.
 * 
 * Returns the status of the addition.
 * 
 * @param {*} newNode - The node to be added.
 */
const addNode = (newNode) => {
    return new Promise((resolve, reject) => {
        if (newNode) {
            if( newNode.id && newNode.parent) {
                OrgModel.getNodes([newNode.id, newNode.parent]).then((nodes) => {
                    let isNodeIdConsumed = null;
                    let parentNode = null;
                    nodes.forEach((node) => {
                        isNodeIdConsumed = isNodeIdConsumed || node.id === newNode.id;
                        if (node.id === newNode.parent) {
                            parentNode = node;
                        } else if (node.id === newNode.id) {
                            isNodeIdConsumed = node;
                        };
                    });

                    if (!isNodeIdConsumed && parentNode) {
                        OrgModel.addNode({
                            id: newNode.id,
                            path: parentNode.path ? parentNode.path + `/${newNode.parent}` : newNode.parent,
                        }).then(() => {
                            resolve(true);
                        }).catch(() => {
                            reject(false);
                        });
                    } else {
                        reject(false);
                    }
                }).catch(() => {
                    reject(false);
                }); 
            } else if (newNode.id && !newNode.parent) {
                OrgModel.getRootNode().then((data) => {
                    if (!data) {
                        OrgModel.addNode({
                            id: newNode.id,
                            path: null,
                        }).then(() => {
                            resolve(true);
                        }).catch(() => {
                            reject(false);
                        });
                    } else {
                        reject(false);
                    }
                }).catch(() => {
                    reject(false);
                });
            } 
        }

        if (!newNode || !newNode.id) {
            reject(false);
        }
    });
};

/**
 * Updates/Moves the node to the new parent, if both the parents are already available.
 * 
 * @updateNode {Object} updateNode - The node to be updated.
 */
const updateParent = (updateNode = {}) => {
    
    return new Promise((resolve, reject) => {
        if (updateNode.id && updateNode.parent) {
            OrgModel.getNodes([updateNode.id, updateNode.parent]).then((nodes) => {
                let parentNode = null;
                let node = null;
                nodes.forEach((item) => {
                    if (item.id === updateNode.parent) {
                        parentNode = item;
                    } else if (item.id === updateNode.id) {
                        node = item;
                    }
                });

                if (node && node.path && parentNode && (!parentNode.path 
                    || (parentNode.path && !parentNode.path.match(node.id)))) {
                    const newPath = parentNode.path 
                        ? `${parentNode.path}/${parentNode.id}` 
                        : parentNode.id;

                    OrgModel.updateChildPathByPathMatch(`${node.path}/${node.id}`,
                        `${newPath}/${node.id}`, node.id, newPath)
                        .then((status) => {
                            status ? resolve(true) : reject(false);
                        }).catch(() => {
                            reject(false);
                        });
                    
                } else {
                    reject(false);
                }
            }).catch(() => {
                reject(false);
            });
        } else {
            reject(false);
        }
    });
};

/**
 * Retrieves all the child nodes of the given node as an Array.
 * 
 * If the node is leaf or if the node is not available an empty array is returned.
 * 
 * @param {String} nodeId 
 */
const getAllChildrenOfNode = (nodeId = null) => {
    return new Promise(async (resolve, reject) => {
        if (nodeId) {
            Promise
              .all([OrgModel.getChildNodes(nodeId), OrgModel.getNode(nodeId)])
              .then((result) => {
                  const nodes = prepareNodesStructure(result[0]);
                  const node = prepareNodeStructure(result[1]);
                  node.children = nodes;

                  if(node.id) {
                      resolve(node);
                  } else {
                      reject(false);
                  }

              })
              .catch((e) => reject(false));
        } else {
            reject(false);
        }
    });
};

module.exports = {
    addNode,
    updateParent,
    getAllChildrenOfNode,
    prepareNodeStructure
};