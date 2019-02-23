import {strings, normalize} from '@angular-devkit/core';
import {Rule, SchematicContext, Tree, apply, chain, mergeWith, move, url, branchAndMerge, applyTemplates, SchematicsException, schematic} from '@angular-devkit/schematics';
import {parseName} from '@schematics/angular/utility/parse-name';
import {buildDefaultPath, getProject} from '@schematics/angular/utility/project';
import {Schema as Options} from './schema';
import { addSchematicToCollectionJson } from '../utility/collection';

export function addNgAdd(options: Options): Rule {
  return (tree: Tree) => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    const project = getProject(tree, options.project);

    const defaultPath = buildDefaultPath(project); 
    const libPath = defaultPath.substr(0, defaultPath.length - 7);

    if (options.path === undefined) {
      options.path = `${buildDefaultPath(project)}/${options.schematicsPath}`;
    }

    const parsedPath = parseName(options.path, '');
    options.path = parsedPath.path;

    const templateSource = apply(url('./files'), [
      applyTemplates({
        ...strings,
        ...(options as object),
      } as any),
      move(libPath),
    ]);

    return chain([
      schematic('collection', options),
      addSchematicToCollectionJson(normalize(`${libPath}/collection.json`), 'ng-add', {
        description: 'Add support for ng-add.',
        factory: './ng-add/index#ngAdd'
      }),
      mergeWith(templateSource),
    ]);
  };
}

export function addSchematicToCollection() {

}