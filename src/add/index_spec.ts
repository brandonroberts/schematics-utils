import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createWorkspace } from '../utility/testing/workspace';

describe('schematic', () => {
  const collectionPath = path.join(__dirname, '../collection.json');
  const schematicsRunner = new SchematicTestRunner('add', collectionPath);

  let workspaceTree: UnitTestTree;

  beforeEach(() => {
    workspaceTree = createWorkspace(schematicsRunner, workspaceTree);
  });

  it('works', () => {
    const tree = schematicsRunner.runSchematic('add', {}, Tree.empty());

    expect(tree.files).toEqual([]);
  });
});
