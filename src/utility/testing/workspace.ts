import {
  UnitTestTree,
  SchematicTestRunner,
} from '@angular-devkit/schematics/testing';

export const defaultWorkspaceOptions = {
  name: 'workspace',
  newProjectRoot: 'projects'
};

const defaultLibOptions = {
  name: 'baz',
};

export function getTestProjectPath(
  workspaceOptions: any = defaultWorkspaceOptions,
  libOptions: any = defaultLibOptions
) {
  return `/${workspaceOptions.newProjectRoot}/${libOptions.name}`;
}

export function createWorkspace(
  schematicRunner: SchematicTestRunner,
  libTree: UnitTestTree,
  workspaceOptions = defaultWorkspaceOptions,
  libOptions = defaultLibOptions
) {
  libTree = schematicRunner.runExternalSchematic(
    '@schematics/angular',
    'workspace',
    workspaceOptions
  );
  libTree = schematicRunner.runExternalSchematic(
    '@schematics/angular',
    'library',
    libOptions,
    libTree
  );

  return libTree;
}
