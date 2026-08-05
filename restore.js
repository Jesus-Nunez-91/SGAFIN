const fs = require('fs');
const path = require('path');

const mappings = [
  { old: "inventory.component.ts", new: "inventario.componente.ts", oldClass: "InventoryComponent", newClass: "ComponenteInventario" }
];

const srcDir = "c:/Users/jenunez/Desktop/Aplicativos/sgaproactualizado/src/pages";
const destDir = "c:/Users/jenunez/Desktop/Aplicativos/SGAFIN/src/pages";

for (const map of mappings) {
    const oldPath = path.join(srcDir, map.old);
    const newPath = path.join(destDir, map.new);
    if (fs.existsSync(oldPath)) {
        let content = fs.readFileSync(oldPath, 'utf8');
        content = content.replace(new RegExp("export class " + map.oldClass, "g"), "export class " + map.newClass);
        fs.writeFileSync(newPath, content, 'utf8');
        console.log(`Copied and fixed ${map.new}`);
    } else {
        console.log(`Not found: ${oldPath}`);
    }
}
