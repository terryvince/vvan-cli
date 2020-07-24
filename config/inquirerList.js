const vuePromptList = [
  {
    type: "input",
    message: "请输入项目名字:",
    name: "projectName",
  },
  {
    type: "confirm",
    message: "是否需要jest测试?",
    name: "isJest",
  },
];

const electronPromptList = [
  {
    type: "input",
    message: "请输入项目名字:",
    name: "projectName",
  },
  {
    type: "confirm",
    message: "是否需要jest测试?",
    name: "isJest",
  },
];

module.exports = {
  vuePromptList,
  electronPromptList,
};
