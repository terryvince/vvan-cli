const inquirer = require("inquirer");
const program = require("commander");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const { vuePromptList, electronPromptList } = require("../config/inquirerList");
const { createProject } = require("./createProject");
const { createTemplate } = require("./createTemplate");

const parseCommand = () => {
  var defaultConfig = { isJest: false, isElectron: false };

  program
    .version("1.2.1", "-V, --version", "查看帮助信息")
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
      "创建一个模板，type：vue|electron|template，name：项目或模板名字"
    )
    .action((type, name) => {
      switch (type) {
        case "vue":
          {
            name
              ? createProject(name, defaultConfig)
              : inquirer
                  .prompt(vuePromptList)
                  .then(({ projectName, ...config }) =>
                    createProject(projectName, config)
                  );
          }
          break;
        case "electron":
          {
            defaultConfig.isElectron = true;
            name
              ? createProject(name, defaultConfig)
              : inquirer
                  .prompt(electronPromptList)
                  .then(({ projectName, ...config }) =>
                    createProject(projectName, config)
                  );
          }
          break;
        case "template":
          {
            createTemplate(name);
          }
          break;
      }
    });

  program.parse(process.argv);
};

// 创建配置文件
async function createConfig() {
  const componentPath = path.join(
    process.env.vvan_execPath,
    "config/template.js"
  ); // 组件配置路径
  const outputPath = path.join(process.cwd(), "vvan.config.js");
  const defaultConfig = JSON.stringify(
    require(componentPath).defaultConfig,
    null,
    2
  );
  await promisify(fs.writeFile)(outputPath, "module.exports=" + defaultConfig);
  console.log("创建配置文件成功:)");
}

module.exports = {
  parseCommand,
};
