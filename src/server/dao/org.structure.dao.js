
// Initializes the database connection and creates a pool of connections.
const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host: process.env.DB_URL || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root', 
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'organization_structure',
  connectionLimit: process.env.DB_POOL_SIZE || 10,
});

/**
 * Returns the node that matched the id.
 * 
 * If there is an error a null value is returned.
 * 
 * @param {string} nodeId 
 */
const getNode = async (nodeId = null) => {
  let node = null;
  try {
    const resultSet = await pool.query(`SELECT * from hierarchy_nodes where id=?`, [nodeId]);
    node = resultSet.length > 0 ? resultSet[0] : resultSet;
  } catch (err) {
    console.error(err);
    throw err;
  }

  return node;
}

/**
 * Returns all the nodes which matches the id's.
 * 
 * If there is an error a null value is returned. 
 * 
 * @param {Array} nodeIds - the node id's to be queried for.
 */
const getNodes = async (nodeIds = []) => {
  let node = null;
  try {
    node = await pool.query(`SELECT * from hierarchy_nodes where id in (?)`, [nodeIds]);
  } catch (err) {
    console.error(err);
    throw err;
  }

  return node;
}

/**
 * Adds a new node in the database, and returns an object containing the number of rows affected.
 * 
 * If there is an error a null value is returned.
 * 
 * @param {Object} node - the node with id and path.
 */
const addNode = async (node = {}) => {
  let result = null;
  try {
    result = await pool.query(`INSERT INTO hierarchy_nodes value (?, ?)`, [node.id, node.path]);
  } catch (err) {
    console.error(err);
    throw err;
  }

  return result;
}

/**
 * Returns the root node.
 * 
 * If there is an error a null value is returned.
 */
const getRootNode = async () => {
  let node = null;
  try {
    const resultSet = await pool.query(`SELECT * from hierarchy_nodes where path is null`);
    node = resultSet ? resultSet[0] : resultSet;
  } catch (err) {
    console.error(err);
    throw err;
  }

  return node;
}

/**
 * Returns the all the nodes that is a direct child of the supplied node id.
 * 
 * If there is an error a null value is returned.
 * 
 * @param {String} nodeId 
 */
const getChildNodes = async (nodeId = null) => {
  let result = null;
  try {
    result = await pool.query(`SELECT * from hierarchy_nodes 
        where path like ? or path like ?  or path like ? or path like ?`
      , [`${nodeId}`, `${nodeId}/%`, `%/${nodeId}`, `%/${nodeId}/%`]);
  } catch (err) {
    console.error(err);
    throw err;
  }

  return result;
}

/**
 * Updated all the children of the matching path to the new path and 
 * updates the path of the node that matches the Id in a transaction.
 * 
 * returns the summary of the transaction.
 * 
 * If there is an error a null value is returned.
 * 
 * @param {String} match - The patch that needs to be matched against.
 * @param {String} childPath - The path to which the node has to be updated to.
 * @param {String} id - Id of the node to be updated
 * @param {String} parentPath - the new path.
 * 
 */
const updateChildPathByPathMatch = async (match, childPath, id, parentPath) => {
  let result = null;
  let conn;
  
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();
    
    result = await conn.query(`UPDATE hierarchy_nodes SET path = 
      CONCAT(?, SUBSTRING(path, ?)) 
      where path like ? or path like ?`, 
      [ childPath, match.length + 1, match, `${match}/%`]);
    
    result = await conn.query(`UPDATE hierarchy_nodes SET path = ? where id = ?`
      , [ parentPath, id ]);
    
    await conn.commit();
  } catch (err) {
    console.error(err);
    await conn.rollback();
    result = null;
    throw err;
  } finally {
    conn.release();
  }

  return result;
}

/**
 * Updates the path of the node that matches the Id.
 * 
 * If there is an error a null value is returned.
 * 
 * @param {String} id - Id of the node to be updated
 * @param {String} replaceWith - the new path.
 */
const updatePathById = async (id, replaceWith) => {
  let result = null;
  try {
    result = await pool.query(`UPDATE hierarchy_nodes SET path = ? where id = ?`
      , [replaceWith, id]);
  } catch (err) {
    console.error(err);
    throw err;
  }

  return result;
}

module.exports = {
  getNode,
  getNodes,
  addNode,
  getRootNode,
  getChildNodes,
  updateChildPathByPathMatch,
  updatePathById,
};