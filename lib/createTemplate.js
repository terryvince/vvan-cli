const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const { copyDir, exists } = require("../utils");
const { defaultConfig, defaultTemplate } = require("../config/template");

// 创建模板
async function createTemplate(componentName) {
  const configPath = path.join(process.cwd(), "vvan.config.js");
  const isExists = await exists(configPath);

  var config = Object.assign({}, defaultConfig);

  if (isExists) {
    // 如果存在用户定义的配置，就使用用户的配置
    let userConfig = require(configPath);
    config = Object.assign({}, defaultConfig, userConfig);
  }
  config.templateList
    ? config.templateList.push(defaultTemplate)
    : (config.templateList = [defaultTemplate]);

  // console.log(JSON.stringify(config, null, 2));

  var componentPromptList = [];
  var selectedItems = [];
  // 如果模板列表只有一项，则默认选中第一项，不经过问询
  if (config.templateList.length == 1) {
    selectedItems = config.templateList;
    config.defaults = [config.templateList[0].name];
  }
  // 设置了默认模板则不需要问询
  if (!config.defaults || config.defaults.length == 0) {
    componentPromptList.push({
      type: "checkbox",
      message: "请选择一个或多个模板:",
      name: "templateNames",
      choices: config.templateList.map((v) => v.name),
    });
  }
  if (!componentName) {
    // 不存在模板名需要问询模板名
    componentPromptList.unshift({
      type: "input",
      message: "请输入模板名(多模板前缀名同用):",
      name: "name",
    });
  }
  inquirer
    .prompt(componentPromptList)
    .then(async ({ templateNames = config.defaults, name = componentName }) => {
      // 如果没有设置defaults则通过问询的结果来选择模板
      if (config.templateList.length) {
        selectedItems = config.templateList.filter((v) =>
          templateNames.includes(v.name)
        );
      }

      const selectedLen = selectedItems.length;
      // 对模板列表进行遍历
      while (selectedItems.length > 0) {
        const selectedItem = selectedItems.shift();
        if (!selectedItem.path && !selectedItem.template) {
          console.error(
            `模板${selectedItem.name}缺乏必要参数path或template，无法生成模板:(`
          );
          return;
        }

        // 输出路径
        var outputPath = selectedItem.outputPath || config.outputPath;

        // 是否产生父级目录
        const isExistsOutputPath = await exists(path.join(outputPath));
        if (!isExistsOutputPath) {
          await promisify(fs.mkdir)(outputPath, {
            recursive: true, //是否递归,默认false
          }).catch((err) => {
            console.error(`生成目录 ${outputPath} 失败:(`);
            return;
          });
        }

        // 读取template处理成字符串
        var template = selectedItem.template
          ? selectedItem.template.join("\n")
          : "";

        // 如果模板设置了path，将以path优先
        if (selectedItem.path) {
          const templatePath = path.join(process.cwd(), selectedItem.path);
          const isExists = await exists(templatePath);
          if (!isExists)
            return console.error(
              `配置的模板path没找到哦，请重新检查${selectedItem.path}路径是否配置正确:(`
            );
          template = (await promisify(fs.readFile)(templatePath)).toString(
            "utf-8"
          );
        }

        const ext = path.extname(selectedItem.path) || selectedItem.postfix;
        const basename = path.win32.basename(selectedItem.path, ext);
        var fileName = "";
        var extName = selectedItem.postfix || ext;

        if (selectedLen > 1) {
          // 多模板动态增加前缀
          fileName =
            (selectedItem.isAddPrefix ? name : "") +
            (selectedItem.isAddPrefix ? firstUpperCase(basename) : basename) +
            extName;
          outputPath = outputPath
            ? path.join(process.cwd(), outputPath, fileName)
            : path.join(process.cwd(), fileName);
        } else {
          // 单模板则重命名
          fileName = name + extName;
          outputPath = outputPath
            ? path.join(process.cwd(), outputPath, fileName)
            : path.join(process.cwd(), fileName);
        }
        // 将系统内置上下文与用户上下文合并
        const ctx = Object.assign(config.ctx, {
          _name: name,
          _filename: path.win32.basename(fileName, extName),
        });
        // 解析模板变量
        await parserTemplate(template, outputPath, ctx);
      }
      console.log(`所有模板创建完成:)`);
    });
}

// 首字母大写
function firstUpperCase(str) {
  return str.replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
}

// 解析模板变量
async function parserTemplate(templateContent, outputPath, ctx) {
  // 将插值表达式替换成相应值
  templateContent = templateContent.replace(/\$\$([A-z,_,0-9]+)/g, (w) => {
    return ctx[w.slice(2)] || "";
  });
  await promisify(fs.writeFile)(outputPath, templateContent);
  console.log(`模板${outputPath}创建成功:)`);
  return;
}

module.exports = { createTemplate };
