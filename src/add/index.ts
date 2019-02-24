import {strings, normalize} from '@angular-devkit/core';
import {Rule, Tree, apply, chain, mergeWith, move, url, applyTemplates, SchematicsException, schematic} from '@angular-devkit/schematics';
import {Schema as Options} from './schema';
import {addSchematicToCollectionJson, buildDefaultPath, getProject} from '../utility';

export function addNgAdd(options: Options): Rule {
  return (tree: Tree) => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }

    const project = getProject(tree, options.project);

    const defaultPath = buildDefaultPath(project); 
    const libPath = defaultPath.substr(0, defaultPath.length - 7);

    const templateSource = apply(url('./files'), [
      applyTemplates({
        ...strings,
        ...(options as object),
      } as any),
      move(libPath),
    ]);

    return chain([
      schematic('collection', options),
      addSchematicToCollectionJson(normalize(`${libPath}/${options.schematicsPath}/collection.json`), 'ng-add', {
        description: 'Add support for ng-add.',
        factory: './ng-add/index#ngAdd',
        schema: './ng-add/schema.json'
      }),
      mergeWith(templateSource),
    ]);
  };
}
