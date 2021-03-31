const { productPackage, packageJson } = require("../config/package");
const { copyDir, exists } = require("../utils");
const path = require("path");
const fs = require("fs");
/**
 * 创建项目
 * @param {string} projectName 
 * @param {object} config 
 */
function createProject(projectName, config) {
    productPackage(config); // 生成项目模板配置
    copyProject(projectName); // 创建项目模板
  }

// 复制项目模板
function copyProject(projectName) {
    const srcDir = path.join(process.env.vvan_execPath, "template/project"); // 项目模板路径
    let dest = path.join(process.cwd(), projectName); //当前命令行的工作路径
    
    fs.stat(dest, (err) => {
      if (!err) {
        console.error("fail:directory already exists!"); // 如果目标目录已经创建过就抛出错误
        return;
      }
      copyDir(srcDir, dest) // 目标目录不存在开始复制
        .then(() => {
          fs.writeFile(
            path.join(dest, "package.json"),
            JSON.stringify(packageJson, null, 4),
            (err) => {
              //创建配置的package.json
              if (err) {
                console.log(err);
                return;
              }
              console.log("创建模板成功:)");
            }
          );
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }

  module.exports = {
    createProject
  }

