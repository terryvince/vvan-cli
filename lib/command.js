const inquirer = require("inquirer");
const program = require("commander");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const { copyDir, exists } = require("../utils");
const { vuePromptList, electronPromptList } = require("../config/inquirerList");
const { productPackage, packageJson } = require("../config/package");
const defaultConfig = require("../config/componentTemplate");

const parseCommand = () => {
  var defaultConfig = { isJest: false, isElectron: false };

  program
    .version("1.1.0", "-V, --version", "查看帮助信息")
    .usage("<command> [option...]")
    .option("-v", "同-V")
    .action((command) => console.log(command._version));

  program
    .command("init")
    .description("初始化一个配置文件，会创建一个vvan.config.js")
    .action(createConfig);

  program
    .command("create <type> [name]")
    .description(
      "创建一个模板，type：vue|electron|component，name：项目或组件名字"
    )
    .action((type, name) => {
      if (type == "vue") {
        name
          ? createProject(name, defaultConfig)
          : inquirer
              .prompt(vuePromptList)
              .then(({ name, ...config }) => createProject(name, config));
      } else if (type == "electron") {
        defaultConfig.isElectron = true;
        name
          ? createProject(name, defaultConfig)
          : inquirer
              .prompt(electronPromptList)
              .then(({ name, ...config }) => createProject(name, config));
      } else if (type == "component") {
        createComponet(name);
      }
    });

  program.parse(process.argv);
};

// 创建配置文件
async function createConfig() {
  const componentPath = path.join(
    process.env.vvan_execPath,
    "config/componentTemplate.js"
  ); // 组件配置路径
  const outputPath = path.join(process.cwd(), "vvan.config.js");
  const defaultConfig = await promisify(fs.readFile)(componentPath, {
    encoding: "utf-8",
  });
  await promisify(fs.writeFile)(outputPath, defaultConfig);
  console.log("创建配置文件成功:)");
}

// 创建组件
async function createComponet(componentName) {
  const configPath = path.join(process.cwd(), "vvan.config.js");
  const isExists = await exists(configPath);
  var config = Object.assign({}, defaultConfig);
  const defalutTemplate = defaultConfig.templateList[0];
  if (isExists) {
    // 如果存在用户定义的配置，就使用用户的配置
    let userConfig = require(configPath);
    config = Object.assign({}, defaultConfig, userConfig);
    config.templateList
      ? config.templateList.push(defalutTemplate)
      : (config.templateList = [defalutTemplate]);
  }

  var componentPromptList = [];
  var selectedItem = null;
  // 如果模板列表只有一项，则默认选中第一项，不经过问询
  if (config.templateList.length == 1) {
    selectedItem = config.templateList[0];
    config.defalutOne = config.templateList.name;
  }
  // 设置了默认模板则不需要问询
  if (!config.defalutOne) {
    componentPromptList.push({
      type: "list",
      message: "请选择一个组件模板:",
      name: "templateName",
      choices: config.templateList.map((v) => v.name),
    });
  }
  if (!componentName) {
    // 不存在组件名需要问询组件名
    componentPromptList.unshift({
      type: "input",
      message: "请输入组件名字:",
      name: "name",
    });
  }
  inquirer
    .prompt(componentPromptList)
    .then(
      async ({ templateName = config.defalutOne, name = componentName }) => {
        // 如果没有设置defalutOne则通过问询的结果来选择模板
        if (!selectedItem) {
          selectedItem = config.templateList.find(
            (v) => v.name == templateName
          );
        }
        const templatePath = path.join(process.cwd(), selectedItem.path);
        // 处理成字符串，生成组件
        var template = selectedItem.template.join("\n");
        const outputPath = config.outputPath
          ? path.join(process.cwd(), config.outputPath, name + config.postfix)
          : path.join(process.cwd(), name + config.postfix);
        if (selectedItem.path) {
          const isExists = await exists(templatePath);
          if (!isExists)
            return console.error(
              `配置的模板path没找到哦，请重新检查${selectedItem.path}路径是否配置正确:(`
            );
          template = (await promisify(fs.readFile)(templatePath)).toString(
            "utf-8"
          );
        }
        // 将插值表达式替换成相应值
        template = template.replace(/{{([A-z, \s, _, 0-9, $]+)}}/g, (w) => {
          let variable = w.replace(/[{,},\s]/g, "");
          return { name }[variable] || "";
        });
        await promisify(fs.writeFile)(outputPath, template);
        console.log(`组件${outputPath}创建成功:)`);
      }
    );
}

function createProject(projectName, config) {
  productPackage(config); // 生成项目模板配置
  copyTemplate(projectName); // 创建模板
}

// 复制模板
function copyTemplate(projectName) {
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
  parseCommand,
};
