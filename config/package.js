const config = {
  name: "webpack-build-template",
  version: "1.0.0",
  description: "webpack build template",
  main: "main.js",
  os: ["win32"],
  scripts: {
    start: "npm run dev",
    dev: "set NODE_ENV=development&& node build/index.js",
    build: "set NODE_ENV=production&& node build/index.js",
  },
  repository: {
    type: "git",
    url: "https://github.com/terryvince/webpack-build-template.git",
  },
  author: "terryvince",
  license: "ISC",
  devDependencies: {
    "@babel/core": "^7.6.2",
    "@babel/plugin-proposal-class-properties": "^7.5.5",
    "@babel/plugin-proposal-decorators": "^7.6.0",
    "@babel/plugin-proposal-export-namespace-from": "^7.5.2",
    "@babel/plugin-proposal-function-sent": "^7.5.0",
    "@babel/plugin-proposal-json-strings": "^7.2.0",
    "@babel/plugin-proposal-throw-expressions": "^7.2.0",
    "@babel/plugin-syntax-dynamic-import": "^7.2.0",
    "@babel/plugin-syntax-import-meta": "^7.2.0",
    "@babel/plugin-transform-runtime": "^7.6.2",
    "@babel/preset-env": "^7.6.2",
    "@babel/runtime-corejs3": "^7.6.2",
    "@typescript-eslint/parser": "^2.3.1",
    "@vue/test-utils": "^1.0.0-beta.29",
    autoprefixer: "^9.6.1",
    "babel-core": "^7.0.0-bridge.0",
    "babel-eslint": "^10.0.3",
    "babel-loader": "^8.0.6",
    chalk: "^2.4.2",
    "clean-webpack-plugin": "^3.0.0",
    "copy-webpack-plugin": "^5.0.4",
    "css-loader": "^3.2.0",
    cssnano: "^4.1.10",
    ejs: "^2.7.1",
    "ejs-html-loader": "^4.0.1",
    eslint: "^5.16.0",
    "eslint-loader": "^3.0.2",
    "eslint-plugin-vue": "^5.2.3",
    "fast-sass-loader": "^1.5.0",
    "file-loader": "^4.2.0",
    "html-loader": "^0.5.5",
    "html-script-injection-webpack-plugin": "^1.1.4",
    "html-webpack-plugin": "^3.2.0",
    "html-webpack-reload-plugin": "^2.0.0",
    "json-loader": "^0.5.7",
    "mini-css-extract-plugin": "^0.8.0",
    "node-sass": "^4.12.0",
    "postcss-loader": "^3.0.0",
    "postcss-preset-env": "^6.7.0",
    "progress-bar-webpack-plugin": "^1.12.1",
    "sass-loader": "^8.0.0",
    "style-loader": "^1.0.0",
    "ts-loader": "^6.2.0",
    typescript: "^3.6.3",
    "url-loader": "^2.1.0",
    "vue-class-component": "^7.1.0",
    "vue-loader": "^15.7.1",
    "vue-property-decorator": "^8.2.2",
    "vue-style-loader": "^4.1.2",
    "vue-template-compiler": "^2.6.10",
    webpack: "^4.41.0",
    "webpack-cli": "^3.3.9",
    "webpack-dev-server": "^3.8.1",
  },
  dependencies: {
    "@babel/runtime": "^7.6.2",
    vue: "^2.6.10",
  },
  browserslist: [
    "last 2 version",
    "> 1%",
    "iOS >= 6",
    "Android > 4.1",
    "not ie <= 8",
    "Firefox > 20",
  ],
}

function productPackage({ isJest = false, isElectron = false }) {
  config.scripts.test = isJest ? "jest" : "echo Error: no test";
  if (isJest) {
    Object.assign(config.devDependencies, {
      "@types/jest": "^24.0.18",
      "babel-jest": "^24.9.0",
      jest: "^24.9.0",
      "ts-jest": "^24.1.0",
      "vue-jest": "^3.0.5",
    });
  }
  if (isElectron) {
    Object.assign(config.scripts, {
      start: "npm run dev",
      dev: "npm run build_web&& electron .",
      build: "npm run build_web&& electron-builder",
      dev_web: "set NODE_ENV=development&& node build/index.js",
      build_web: "set NODE_ENV=production&& node build/index.js",
    });
    Object.assign(config.devDependencies, {
      electron: "^6.0.10",
      "electron-builder": "^21.2.0",
    });
    config.build = {
      appId: "com.terryvince.www",
      copyright: "terryvince",
      productName: "HelloWorld",
      win: {
        target: [
          {
            target: "nsis",
            arch: ["x64", "ia32"],
          },
        ],
      },
      nsis: {
        oneClick: false,
        allowElevation: true,
        allowToChangeInstallationDirectory: true,
      },
      directories: {
        output: "./install",
        app: "./",
      },
    };
  }
}
module.exports = {
  packageJson:config,
  productPackage
}
