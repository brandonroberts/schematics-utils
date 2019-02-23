/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
        }
      }
    } catch (_) {}

    let source;
    if (!collectionPath) {
      collectionPath = normalize(`${libPath}/collection.json`);
      
      source = apply(url('./files'), [
        applyTemplates({}),
        move(libPath),
      ]);
    }

    return source ? chain([mergeWith(source)]) : noop();
  };
}