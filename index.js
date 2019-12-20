#!/usr/bin/env node
const inquirer = require('inquirer');
const program = require('commander');
const path = require('path');
const fs = require('fs');
let config = require('./config');
let execPath = process.argv[1].split(path.sep+'index.js')[0];   //全局安装的命令的执行路径
let src = path.join(execPath,'templateZ');

const vuePromptList=[
    {
        type:'input',
        message:'请输入项目名字:',
        name:'projectName'
    },
    {
        type:'confirm',
        message:'是否需要jest测试?',
        name:'isJest'
    }
];

const electronPromptList=[
    {
        type:'input',
        message:'请输入项目名字:',
        name:'projectName'
    },
    {
        type:'confirm',
        message:'是否需要jest测试?',
        name:'isJest'
    }
];

program
    .version('1.0.7')
    .option('-v,--version','view version')
    .command('init [dir]')
    .description('初始化一个项目')
    .action(function (dir) {
        if(dir){
            copyTemplate(dir);
        }else{
            inquirer.prompt(vuePromptList).then(res=>{
                let projectName = res.projectName;
                let isJest = res.isJest;
                productPackage({isJest});
                copyTemplate(projectName);
            });
        }

    });

program
    .command('create electron')
    .description('初始化一个electron项目')
    .action(()=>{
       inquirer.prompt(electronPromptList) .then(res=>{
           let projectName = res.projectName;
           let isJest = res.isJest;
           productPackage({isJest,isElectron:true});
           copyTemplate(projectName);
       })
    });

program.parse(process.argv);

function productPackage({isJest=false,isElectron=false}){
    config.scripts.test = isJest ? 'jest': 'echo Error: no test';
    if(isJest){
        Object.assign(config.devDependencies,{
            "@types/jest": "^24.0.18",
            "babel-jest": "^24.9.0",
            "jest": "^24.9.0",
            "ts-jest": "^24.1.0",
            "vue-jest": "^3.0.5"
        })
    }
    if(isElectron){
        Object.assign(config.scripts,{
            "start": "npm run dev",
            "dev": "npm run build_web&& electron .",
            "build": "npm run build_web&& electron-builder",
            "dev_web": "set NODE_ENV=development&& node build/index.js",
            "build_web": "set NODE_ENV=production&& node build/index.js"
        });
        Object.assign(config.devDependencies,{
            "electron": "^6.0.10",
            "electron-builder": "^21.2.0",
        });
        config.build = {
            "appId": "com.terryvince.www",
                "copyright": "terryvince",
                "productName": "HelloWorld",
                "win": {
                "target": [
                    {
                        "target": "nsis",
                        "arch": [
                            "x64",
                            "ia32"
                        ]
                    }
                ]
            },
            "nsis": {
                "oneClick": false,
                    "allowElevation": true,
                    "allowToChangeInstallationDirectory": true
            },
            "directories": {
                "output": "./install",
                    "app": "./"
            }
        }
    }
}

function copyTemplate(projectName) {
    let dest = path.join(process.cwd(),projectName);        //当前命令行的工作路径
    function copy (src) {
        fs.readdir(src, (err, files) => {
            err && console.log(err);
            files.forEach(name => {
                let curPath = path.join(src, name);
                fs.stat(curPath, (err, stats) => {
                    if(err){
                        console.log(err);
                        return;
                    }
                    let tempPath = curPath.split('templateZ'+path.sep)[1];   //取得目录层级
                    let fullPath = path.join(dest,tempPath);
                    if (stats.isFile()) {
                        let readable = fs.createReadStream(curPath);
                        let writable = fs.createWriteStream(fullPath);
                        readable.pipe(writable);
                    }
                    if (stats.isDirectory()) {
                        fs.mkdir(fullPath,function (err) {           //创建目录后继续复制该目录下的文件
                            if(err){
                                console.log(err);
                            }
                            copy(curPath);
                        });
                    }
                })
            })
        })
    }

    fs.stat(dest,(err)=>{
       if(err){                             //目录不存在，创建
           fs.mkdir(dest,(err)=>{
               if(err){
                   console.log(err)
                   return;
               }
               fs.writeFile(path.join(dest,'package.json'),JSON.stringify(config,null,4),err=>{    //创建配置的package.json
                   if(err){
                       console.log(err);
                       return;
                   }
               });
               copy(src);
           });
           return;
       }
       console.error('fail:directory already exists!');
        // copy(src);                      //目录存在
    });

}