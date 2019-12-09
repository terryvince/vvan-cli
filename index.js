#!/usr/bin/env node
const inquirer = require('inquirer');
const program = require('commander');
const path = require('path');
const fs = require('fs');

const promptList=[
    {
        type:'input',
        message:'请输入项目名字:',
        name:'projectName'
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
            inquirer.prompt(promptList).then(res=>{
                var projectName = res.projectName;
                copyTemplate(projectName);
            });
        }

    });

program.parse(process.argv);

function copyTemplate(projectName) {
    let dest = path.join(process.cwd(),projectName);        //当前命令行的工作路径
    let execPath = process.argv[1].split(path.sep+'index.js')[0];   //全局安装的命令的执行路径
    let src = path.join(execPath,'templateZ');

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
               }
               copy(src);
           });
           return;
       }
       console.error('fail:directory already exists!');
        // copy(src);                      //目录存在
    });

}