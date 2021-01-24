import axios from 'axios';

const apiHost = process.env.API_HOST || "";

export const getNodeById = (id) => {
  return axios.get(`${apiHost}/node/${id}`)
    .then((nodeDetails) => {

      const nodeMap = nodeDetails.data.children.reduce((res, node) => {
        res[node.id] = node;
        node.children = [];
        return res;
      },{ [id]: { ...nodeDetails.data, children : [] }});

      nodeDetails.data.children.reduce((res, node) => {
        if (node.parent) {
          nodeMap[node.parent].children.push(node);
        } else {
          res[node.id] = node;
        }

        return res;
      },{});

      return { tree: nodeMap[id], map: nodeMap };
    });
}

export const addNode = (node) => {

  return axios.post(`${apiHost}/node`, node);
};

export const updateNode = (node) => {

  return axios.patch(`${apiHost}/node`, node);
};