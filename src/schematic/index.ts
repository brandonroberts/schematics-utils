import {strings, normalize} from '@angular-devkit/core';
import {Rule, Tree, apply, chain, mergeWith, move, url, applyTemplates, SchematicsException, schematic} from '@angular-devkit/schematics';
import {buildDefaultPath, getProject} from '@schematics/angular/utility/project';
import {Schema as Options} from './schema';
import {addSchematicToCollectionJson} from '../utility/collection';

export function addSchematic(options: Options): Rule {
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
      addSchematicToCollectionJson(normalize(`${libPath}/${options.schematicsPath}/collection.json`), strings.dasherize(options.name), {
        description: `${strings.capitalize(options.name)} schematic`,
        factory: `./${strings.dasherize(options.name)}/index#${strings.camelize(options.name)}`
      }),
      mergeWith(templateSource),
    ]);
  };
}