const hierarchyController = require('./hierarchy');
const structureService = require('../service/structure');
jest.mock('../service/structure');



describe('Hierarchy get node with children controller test', () => {
  test('Get node by id success test.', (done) => {
    const returnAsReceived = jest.fn((p) => {
      expect(p.id).toBe('Europe');
      done();
    });
    const res = { send: returnAsReceived }

    structureService.getAllChildrenOfNode = jest.fn(() => new Promise((resolve, reject) => {
      resolve({id: 'Europe'});
    }));

    hierarchyController.getNodeWithChildren({ params : {id: 'Europe', parent: null}}, res);
  });

  test('Get node by id failure test.', (done) => {
    const returnAsReceived = jest.fn((p) => {
      expect(p).toBe(400);
      done();
    });
    const res = { status: returnAsReceived, send: () => {}}

    structureService.getAllChildrenOfNode = jest.fn(() => new Promise((resolve, reject) => {
      reject(false);
    }));

    hierarchyController.getNodeWithChildren({ params : {id: 'Europe', parent: null}}, res);
  });
});

describe('Hierarchy update node controller test', () => {
  test('Update node success test.', (done) => {
    const returnAsReceived = jest.fn((p) => {
      expect(p).toStrictEqual({
        status: "success",
        message: "Node updated successfully"
      });
      done();
    });
    const res = { send: returnAsReceived }

    structureService.updateParent = jest.fn(() => new Promise((resolve, reject) => {
      resolve(true);
    }));

    hierarchyController.updateNode({ body : {id: 'Europe', parent: null}}, res);
  });

  test('Update failure test.', (done) => {
    const returnAsReceived = jest.fn((p) => {
      expect(p).toBe(400);
      done();
    });
    const res = { status: returnAsReceived, send: () => {}}

    structureService.updateParent = jest.fn(() => new Promise((resolve, reject) => {
      reject(false);
    }));

    hierarchyController.updateNode({ params : {id: 'Europe', parent: null}}, res);
  });
});

describe('Hierarchy add node controller test', () => {
  test('Add node success test.', (done) => {
    const returnAsReceived = jest.fn((p) => {
      expect(p).toStrictEqual({
        status: "success",
        message: "Node added successfully"
      });
      done();
    });
    const res = { send: returnAsReceived }

    structureService.addNode = jest.fn(() => new Promise((resolve, reject) => {
      resolve(true);
    }));

    hierarchyController.addNode({ body : {id: 'Europe', parent: null}}, res);
  });

  test('Add invalid node id failure test.', (done) => {
    const returnAsReceived = jest.fn((p) => {
      expect(p).toBe(400);
      done();

      return {send: () => {}};
    });
    const res = { status: returnAsReceived}


    hierarchyController.addNode({ params : {id: 12, parent: null}}, res);
  });

  test('Add valid node id failure test.', (done) => {
    const returnAsReceived = jest.fn((p) => {
      expect(p).toBe(400);
      done();

      return {send: () => {}};
    });
    const res = { status: returnAsReceived, send: () => {}}

    structureService.addNode = jest.fn(() => new Promise((resolve, reject) => {
      reject(false);
    }));

    hierarchyController.addNode({ params : {id: 'Europe', parent: null}}, res);
  });
});