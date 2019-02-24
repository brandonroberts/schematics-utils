import { Path, normalize } from '@angular-devkit/core';
import {
  Rule,
  SchematicsException,
  Tree,
  noop,
  apply,
  url,
  mergeWith,
  move,
  applyTemplates,
  chain,
} from '@angular-devkit/schematics';
import { getProject, buildDefaultPath } from '@schematics/angular/utility/project';
import { Schema } from './schema';


export default function collection(options: Schema): Rule {
  return (tree: Tree) => {
    if (!options.project) {
      throw new SchematicsException('Project is required.');
    }

    const project = getProject(tree, options.project);

    const defaultPath = buildDefaultPath(project); 
    const libPath = defaultPath.substr(0, defaultPath.length - 7).substr(1);
    
    let collectionPath: Path | undefined;
    try {
      const packageJsonContent = tree.read(`${libPath}/package.json`);

      if (packageJsonContent) {
        const packageJson = JSON.parse(packageJsonContent.toString('utf-8'));

        if ('schematics' in packageJson) {
          const p = normalize(`${libPath}/${packageJson['schematics']}`);

          if (tree.exists(p)) {
            collectionPath = p;
          }
        } else {
          packageJson['schematics'] = `./${options.schematicsPath}/collection.json`;
          packageJson['scripts'] = {
            ...packageJson['scripts'],
            "build:schematics": "../../node_modules/.bin/tsc -p tsconfig.schematics.json",
            "copy:schemas": `cp --parents schematics/*/schema.json ../../dist/${options.project}/`,
            "copy:files": `cp --parents -p schematics/*/files/** ../../dist/${options.project}/`,
            "copy:collection": `cp schematics/collection.json ../../dist/${options.project}/schematics/collection.json`,
            "postbuild:schematics": "npm run copy:schemas && npm run copy:files && npm run copy:collection"
          };

          tree.overwrite(`${libPath}/package.json`, JSON.stringify(packageJson, null, 2));          
        }
      }
    } catch (_) {}

    let source;
    if (!collectionPath) {
      source = apply(url('./files'), [
        applyTemplates({ ...(options as object)}),
        move(libPath),
      ]);      
    }

    return source ? chain([mergeWith(source)]) : noop();
  };
}