# Useful Commands

Here are some useful commands to be used during the process of creating an Ionic app based on Capacitor and Angular.

```sh
ionic start ionic-todos tabs --type=angular-standalone --id=<app_id> # create project
ionic build --prod # build www folder
ionic serve --no-open # serve
ionic g page login # generate a page as standalone component

#Android
npm install @capacitor/android # add capacitor/android
npx cap add android # add platform
npx cap run android # build debug
npx cap sync android # build release
npx cap open android # run native IDE
ionic cap run android -l --external # livereload

#iOS
npm install @capacitor/ios # add capacitor/ios
npx cap add ios # add platform
npx cap run ios # build debug
npx cap sync ios # build release
npx cap open ios # run native IDE
ionic cap run ios -l --external # livereload

```

## App Resources
- Create a resources folder in the root directory.
- Add icon files, which should be at least 1024px x 1024px.
- Add splash screen files, which should be at least 2732px x 2732px.
- The format can be jpg or png.

```sh
resources/
├── icon-only.png
├── icon-foreground.png
├── icon-background.png
├── splash.png
└── splash-dark.png
```
- Now run these commands to add @capacitor/assets as a dependency and generate app resources.

```sh
npm install @capacitor/assets --save-dev
npx capacitor-assets generate
```

## Code Documentation
- Create code documentation using compodoc:

```sh
npm install -g @compodoc/compodoc  
npm install --save-dev @compodoc/compodoc
```

- Configure compodoc via tsconfig.doc.json  file

```json
// tsconfig.doc.json 
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es2017",
    "experimentalDecorators": true,
    "lib": ["dom", "es2017"]
  },
  "exclude": ["node_modules", "**/*spec.ts"]
}
```
- Now you can generate the Compodoc documentation by executing this command

```sh
compodoc -p tsconfig.doc.json 
```