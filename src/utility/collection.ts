import { Path, JsonObject, parseJsonAst } from "@angular-devkit/core";
import { Rule, Tree } from "@angular-devkit/schematics";
import { appendPropertyInAstObject } from "./json";

export function addSchematicToCollectionJson(
  collectionPath: Path,
  schematicName: string,
  description: JsonObject,
): Rule {
  return (tree: Tree) => {
    const collectionJsonContent = tree.read(collectionPath);

    if (!collectionJsonContent) {
      throw new Error('Invalid collection path: ' + collectionPath);
    }

    const collectionJsonAst = parseJsonAst(collectionJsonContent.toString('utf-8'));

    if (collectionJsonAst.kind !== 'object') {
      throw new Error('Invalid collection content.');
    }

    for (const property of collectionJsonAst.properties) {
      if (property.key.value == 'schematics') {
        if (property.value.kind !== 'object') {
          throw new Error('Invalid collection.json; schematics needs to be an object.');
        }

        const recorder = tree.beginUpdate(collectionPath);
        appendPropertyInAstObject(recorder, property.value, schematicName, description);
        tree.commitUpdate(recorder);

        return tree;
      }
    }

    throw new Error('Could not find the "schematics" property in collection.json.');
  };
}