const structureService = require('./structure');
const OrgModel = require('../dao/org.structure.dao');
jest.mock('../dao/org.structure.dao');

test('Prepare node structure root', (done) => {
    expect(structureService.prepareNodeStructure({ id: 'Europe', path: null}))
        .toEqual({
            height: 0,
            id: 'Europe',
            parent: null,
            root: 'Europe',
        });
    done();
});

test('Prepare node structure', (done) => {
    expect(structureService.prepareNodeStructure({ id: 'Denmark', path: 'Europe'}))
        .toEqual({
            height: 1,
            id: 'Denmark',
            parent: 'Europe',
            root: 'Europe',
        });
    done();
});

test('Prepare node structure child of child', (done) => {
    expect(structureService.prepareNodeStructure({ id: 'Denmark', path: 'EU/Europe'}))
        .toEqual({
            height: 2,
            id: 'Denmark',
            parent: 'Europe',
            root: 'EU',
        });
    done();
});

describe('Hierarchy build test', () => {
    test('Adding a root node, without an existing root node.', (done) => {
        OrgModel.addNode = jest.fn(() => new Promise((resolve, reject) => { resolve(true); }));
        OrgModel.getRootNode = jest.fn(() => new Promise((resolve, reject) => { resolve(null); }));

        expect(structureService.addNode({ id: 'Europe', parent: null}))
            .resolves
            .toEqual(true);
        done();
    });

    test('Adding a root node, with an existing root node.', (done) => {
       OrgModel.getRootNode = jest.fn(() => new Promise((resolve, reject) => { 
           resolve({ id: 'Europe', path: null}); 
        }));

        expect(structureService.addNode({ id: 'Denmark', parent: null}))
            .rejects
            .toEqual(false);
        done();
    });

    test('Adding a node, without an existing root node.', (done) => {
        OrgModel.getNodes = jest.fn(() => new Promise((resolve, reject) => { 
            resolve([{}]); 
        }));
        expect(structureService.addNode({ id: 'Denmark', parent: 'Europe'}))
            .rejects
            .toEqual(false);
        done();
    });

    test('Adding a node, with a parent node.', (done) => {
        OrgModel.getNodes = jest.fn(() => new Promise((resolve, reject) => { 
            resolve([{ id: 'Europe', path: null}]); 
        }));
        OrgModel.addNode = jest.fn(() => new Promise((resolve, reject) => { resolve(true); }));

        expect(structureService.addNode({ id: 'Denmark', parent: 'Europe'}))
            .resolves
            .toEqual(true);
        done();
    });

    test('Adding a node with the separator character, with a parent node.', (done) => {
        OrgModel.getNodes = jest.fn(() => new Promise((resolve, reject) => { 
            resolve([{ id: 'Europe', path: null}]); 
        }));
        OrgModel.addNode = jest.fn(() => new Promise((resolve, reject) => { resolve(true); }));

        expect(structureService.addNode({ id: 'Denmark/', parent: 'Europe'}))
            .resolves
            .toEqual(true);
        done();
    });

    test('Adding a node, with a parent node and another node of same Id', (done) => {
        OrgModel.getNodes = jest.fn(() => new Promise((resolve, reject) => { 
            resolve([{ id: 'Europe', path: null}, { id: 'Denmark', path: 'Europe'}]); 
        }));
        OrgModel.addNode = jest.fn(() => new Promise((resolve, reject) => { resolve(true); }));

        expect(structureService.addNode({ id: 'Denmark', parent: 'Europe'}))
            .rejects
            .toEqual(false);
        done();
    });
});

describe('Hierarchy modification test', () => {
    test('Moving a node to a non existing node', (done) => {
        OrgModel.getNodes = jest.fn(() => new Promise((resolve, reject) => { 
            resolve([{ id: 'Denmark', path: 'Europe'}]); 
        }));
        OrgModel.addNode = jest.fn(() => new Promise((resolve, reject) => { resolve(true); }));

        expect(structureService.updateParent({ id: 'Denmark', parent: 'Europe'}))
            .rejects
            .toEqual(false);
        done();
    });

    test('Moving a node to an existing node', (done) => {
        OrgModel.getNodes = jest.fn(() => new Promise((resolve, reject) => { 
            resolve([{ id: 'Denmark', path: 'EU'}, { id: 'Europe', path: null}]); 
        }));
        OrgModel.updateChildPathByPathMatch = jest.fn(() => new Promise((resolve, reject) => { resolve(true); }));

        expect(structureService.updateParent({ id: 'Denmark', parent: 'Europe'}))
            .resolves
            .toEqual(true);
        done();
    });

    test('Moving a parent node to its own child node', (done) => {
        OrgModel.getNodes = jest.fn(() => new Promise((resolve, reject) => { 
            resolve([{ id: 'Denmark', path: 'Europe/EU'}, { id: 'Europe', path: 'EU'}]); 
        }));
        OrgModel.updateChildPathByPathMatch = jest.fn(() => new Promise((resolve, reject) => { resolve(true); }));

        expect(structureService.updateParent({ id: 'Europe', parent: 'Denmark'}))
            .rejects
            .toEqual(false);
        done();
    });

    test('Moving an unknown node to an existing node', (done) => {
        OrgModel.getNodes = jest.fn(() => new Promise((resolve, reject) => { 
            resolve([{ id: 'Europe', path: null}]); 
        }));
        OrgModel.updateChildPathByPathMatch = jest.fn(() => new Promise((resolve, reject) => { resolve(true); }));

        expect(structureService.updateParent({ id: 'Denmark', parent: 'Europe'}))
            .rejects
            .toEqual(false);
        done();
    });
});

describe('Hierarchy traversal test', () => {
    test('Fetching a child of root', async (done) => {
        OrgModel.getChildNodes = jest.fn(() => new Promise((resolve, reject) => { 
            resolve([{ id: 'Denmark', path: 'Europe'}]); 
        }));

        const result = await structureService.getAllChildrenOfNode('Denmark');
        expect(result)
            .toEqual([{
                height: 1,
                id: 'Denmark',
                parent: 'Europe',
                root: 'Europe',
            }]);
        done();
    });

    test('Fetching a child of child', async (done) => {
        OrgModel.getChildNodes = jest.fn(() => new Promise((resolve, reject) => { 
            resolve([{ id: 'Denmark', path: 'EU/Europe'}]); 
        }));

        const result = await structureService.getAllChildrenOfNode('Denmark');
        expect(result)
            .toEqual([{
                height: 2,
                id: 'Denmark',
                parent: 'Europe',
                root: 'EU',
            }]);
        done();
    });

    test('Fetching a child of invalid parent', async (done) => {
        OrgModel.getChildNodes = jest.fn(() => new Promise((resolve, reject) => { 
            resolve([]); 
        }));

        const result = await structureService.getAllChildrenOfNode('Denmark');
        expect(result)
            .toEqual([]);
        done();
    });
});