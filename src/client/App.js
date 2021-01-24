import React, { useState, useEffect } from "react";
import Tree from 'react-tree-graph';

import Node from './components/Node';
import Tab from './components/Tab';
import Modal from './components/Modal';

import { getNodeById, addNode, updateNode } from './api/node';

import 'react-tree-graph/dist/style.css'
import './App.css';

function App() {
  const [treeData, setTreeData] = useState(null);
  const [errorData, setError] = useState({});
  const [selectedNode, setSelectedNode] = useState('');
  const [notify, setNotify] = useState({});

  useEffect(() => {
    window.ts.ui.get('#node-search', function (search) {
      search.value = selectedNode;
      search.onsearch = function (value) {
        value && getNodeById(value)
          .then(setTreeData)
          .catch(() => {
            window.ts.ui.Notification.error('Oops!! Could not find the node.');
            setTreeData(null);
          });
        setSelectedNode(value);
      }
      search.focus();
    });
  });

  const onClick = (e, node) => {
    setSelectedNode('');
    setSelectedNode(node);
    window.ts.ui.get('#modal').open();
    getNodeById(node).then(setTreeData);
  };

  const onRightClick = (e, node) => {
    e.preventDefault();
    getNodeById(node).then(setTreeData);
    setSelectedNode(node);
  }

  return (
    <>
      <div data-ts="Main" >
        <div data-ts="Content">
          <div data-ts="Panel" className="main-panel">
            <div data-ts="Board" id="tab-board">
              <section data-ts="Panels">
                <Tab title="Search Node">
                  <div
                    data-ts="Search"
                    id="node-search"
                    className="ts-inset search"
                    { ...{'data-ts.info': 'Please enter the node id eg: Europe'}}
                  />
                  <div className="tree-container">
                    {treeData && selectedNode &&
                    <Tree
                      data={treeData.tree}
                      height={500}
                      width={800}
                      textProps={{
                        dx: '-25',
                        dy: '25',
                      }}
                      animated={true}
                      gProps={{
                        onClick: onClick,
                        onContextMenu: onRightClick
                      }}
                      keyProp="id"
                      labelProp="id"
                    />
                    }
                  </div>
                </Tab>

                <Tab title="Add Node">
                  <Node
                    onSubmit={(node, clearForm) => {
                      const errorTemplate = {
                        title: "Adding node failed.",
                        type: "errors",
                        explanations: [
                          "There should be at least one root node",
                          "Only one node can be the root node",
                          "There cannot be two nodes with same Id",
                          "If the new node is not a root node, the parent should be available."
                        ]
                      };

                      setSelectedNode('');

                      if (node && node.id) {
                        addNode(node)
                          .then(() => {
                            getNodeById(node.parent).then(setTreeData);
                            setError({});
                            setNotify({ add: `Added ${node.id} successfully`});

                            clearForm();
                          })
                          .catch((e) => {
                            console.error(e);
                            setNotify({});
                            setError({ add: errorTemplate });
                          });
                      } else {
                        setError({ add: errorTemplate });
                      }

                    }}
                    notify={notify.add}
                    explanation={errorData.add}
                  />
                </Tab>
              </section>
            </div>
          </div>
        </div>
      </div>

      <Modal id="modal" title="View/Update Node">
        <Node
          onSubmit={(node) => {
            const errorTemplate = {
              title: "Updating node failed.",
              type: "errors",
              explanations: [
                "Root node cannot be updated",
                "A parent cannot be moved to its own child",
                "If the new node is not a root node, the parent should be available."
              ]
            };

            if (node && node.id) {
              updateNode(node)
                .then(() => {
                  getNodeById(node.parent)
                    .then(setTreeData);
                  setError({});
                  setNotify({ update: "Updated the node successfully" });
                })
                .catch((e) => {
                  console.error(e);
                  setNotify({});
                  setError({ update: errorTemplate });
                });
            } else {
              setError({ update: errorTemplate });
            }
          }}
          node={treeData ? { ...treeData.map[selectedNode] } : {} }
          onCancel={() => {
            window.ts.ui.get('#modal').close();
            setError({});
          }}
          notify={notify.update}
          explanation={errorData.update}
        />
      </Modal>
    </>
  );
}

export default App;