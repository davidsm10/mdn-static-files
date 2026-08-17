# MDN Static Files

This projects has scripts to extract the HTML content from the JSON build files from the [MDN Content](https://github.com/mdn/content) project into static HTML files.

## Building the docs

First you need to load the mdn/content git submodule and build the project:

```sh
git submodule update --init
cd ./content
npm install
npm run build
```

Then you can use the scripts from the top project to build the static files:

```sh
cd ..
pnpm install
pnpm run build
pnpm run build-docs
```

Optionally you can run the next command to pack all the files in a in .tar.xz archive (which should be less than 10MB):

```sh
pnpm run pack-docs
```
