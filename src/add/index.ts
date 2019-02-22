import {strings} from '@angular-devkit/core';
import {Rule, SchematicContext, Tree, apply, chain, mergeWith, move, url, branchAndMerge, applyTemplates, SchematicsException} from '@angular-devkit/schematics';
import {parseName} from '@schematics/angular/utility/parse-name';
import {buildDefaultPath, getProject} from '@schematics/angular/utility/project';
import {Schema as Options} from './schema';

export function addNgAdd(options: Options): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    const project = getProject(tree, options.project);

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
      move(parsedPath.path),
    ]);

    return chain([
      branchAndMerge(
        chain([mergeWith(templateSource)])
      ),
    ])(tree, context);
  };
}

export function addSchematicToCollection() {

}