### Charts

TBD

### Build

Build and copy files to test on `doc`:
```bash
npm run build && rm -rf docsrc/node_modules/vue-d3-charts/dist/ && cp -r dist/ docsrc/node_modules/vue-d3-charts/
```

### Documentation page

Documentation source files are located in `docsrc` folder

##### Serve files
```bash
cd docsrc/
npm run dev
```

##### Build files
```bash
cd docsrc/
npm run build
```