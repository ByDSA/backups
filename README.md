# backups
## Instalación
Ejecutar:
```bash
pnpm build
```
Automáticamente crea el link simbólico de  `/bin/backup` a `build/bin.js`.
## Generar backup de carpeta
```bash
sudo backup "PATH"
```
Admite las siguientes flags:
- `--force` o `-f`: borra el backup previo antes de generar el nuevo.
- `--checkAfter` o `-c`: comprueba la integridad del backup después de crearlo. Compara la carpeta vieja con la carpeta raíz del ISO con el comando `diff`.
- `--deleteAfter` o `-d`: elimina los archivos fuente originales tras hacer el backup.
- `--type` o `-t`: permite especificar la forma en que se almacenará el backup. Los tipos soportados son:
  - `iso` (por defecto)
  - De momento no hay más tipos soportados

1. Al hacer el backup, primero genera el tree y lo incluye en la propia carpeta de la que se va a hacer backup el backup.
  - Si la carpeta del backup o subcarpetas ya contenían un `index.tree`, por razones de eficiencia no lo vuelve a generar y se reutiliza. Es recomendable buscar y borrar aquellos `index.tree` que no se quieran reutilizar para hacer la nueva generación del tree.
2. Después, hace el backup propiamente dicho (lo pone en un archivo `.iso`, etc.). Al final del nombre de archivo del backup, genera un timestamp de la fecha en que se ha hecho (en formato `[YYYY-MM-DD]`).
  - Si el achivo de backup ya existía (porque se ha hecho un backup el mismo día), sobreescribe el archivo. Si tenía el flag `--force`, elimina el backup previo antes de generar el nuevo, pero igualmente se borrará al generar la nueva ISO.

## Encontrar archovos duplicados en un árbol
```bash
sudo backup tree dup "PATH"
```

Acepta los flags:
- `--considerHash` (activada por defecto): considera los hashes de los archivos.
- `--considerEmpty` o `-e`: considera los y carpetas vacíos.
- `--considerFolders` o `-f` (activada por defecto).
- `--considerName` o `-n` (activada por defecto): para considerarse duplicado el archivo debe tener el mismo nombre (independientemente del resto del path).
- `--considerSize` o `-s` (activada por defecto): para considerarse duplicado el archivo debe tener el mismo tamaño.
- `--considerTime` o `-t`: para considerarse duplicado el archivo debe tener las mismas fechas de creación y de modificación.
- `--deep` (no sé si la flag funciona)

## Generar archivo de árbol
```bash
sudo backup tree gen "PATH"
```

Acepta las flags:
- `--out` o `-o`: permite especificar el path y nombre del archivo de árbol. Por defecto es `./[nombre carpeta].tree`, junto a la carpeta.
- `--dontFollowISOs`: considerará los archivos ISO como un archivo atómico y no como una carpeta.
- `--ignoreTrees` (creo que no funciona): no usará para generar el árbol los archivos `.tree` como caché en carpetas (o ISOs) que contengan ya un archivo `.tree`.

## Comparar dos archivos de árbol
```bash
sudo backup tree compare "PATH1" "PATH2" > "file.log"
```
Admite las siguientes flags (creo que no funciona ninguna actualmente):
- `--onlyFiles`: muestra sólo archivos y no carpetas.
- `--onlyDeleted`: muestra sólo archivos y carpetas que no existen en el segundo árbol.
- `--ignoreTrees`: ignora los archivos `.tree` en la comparación, incluyendo los de los ISOs.