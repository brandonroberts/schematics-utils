import { Path, JsonObject, parseJsonAst } from "@angular-devkit/core";
import { Rule, Tree } from "@angular-devkit/schematics";
import { appendPropertyInAstObject } from "./json";

export function addSchematicsToPackageJson(
  packageJsonPath: Path,
  collectionPath: string,
): Rule {
  return (tree: Tree) => {
    const packageJsonContent = tree.read(packageJsonPath);

    if (!packageJsonContent) {
      throw new Error('Invalid package.json path: ' + packageJsonPath);
    }

    const packageJsonAst = parseJsonAst(packageJsonContent.toString('utf-8'));

    if (packageJsonAst.kind !== 'object') {
      throw new Error('Invalid package.json content.');
    }

    let found = false;
    for (const property of packageJsonAst.properties) {
      if (property.key.value == 'schematics') {
        if (property.value.kind !== 'object') {
          throw new Error('Invalid schematic collection found; schematics needs to be an object.');
        }

        const recorder = tree.beginUpdate(packageJsonPath);
        appendPropertyInAstObject(recorder, property.value, collectionPath, 'description');
        tree.commitUpdate(recorder);

        return tree;
      }
    }

    throw new Error('Could not find the "schematics" property in collection.json.');
  };
}