// 读取项目下的vvan.config.js，没有则使用默认配置，配置中涉及到路径以命令行的工作目录为基准
const defaultConfig = {
  outputPath: "", // 全局模板输出路径
  defaults: [], // 可提前配置默认选择模板name，不设置默认选择，则通过问询来选择
  ctx:{ // 模板的上下文，可以在模板中通过"$$变量名"引用变量，如$$project
    project:'test' // 内置变量 $$_name 用户输入的模板名 $$_filename 多模板中的当前文件名
  },
  // 如果只有一个模板，则默认选择第一个模板，不经过问询
  templateList: [
    // { // 该模板已内置，仅作为示例，请勿重复使用
    //   name: "vue-base-template", // 模板名
    //   description: "生成vue的基础组件",
    //   path: "", // 可提供文件路径作为模板
    //   postfix: ".vue", // 自定义生成文件的扩展名
    //   isAddPrefix: false, // 是否为该模板添加用户输入的模板名为前缀,仅对多模板有效
    //   outputPath:"", // 指定该模板的输出路径，如果指定目录部分不存在将自动创建
    //   template: [ // path 和 template任选一项即可，path优先级更高
    //     "<template>",
    //     '  <div class="$$_name">\n    template\n  </div>',
    //     "</template>",
    //     "",
    //     "<script>",
    //     "// import x from ''",
    //     "export default {",
    //     "  name: '$$_name',",
    //     "  components: {",
    //     "",
    //     "  },",
    //     "  data() {",
    //     "    return {",
    //     "      data: ''",
    //     "    }",
    //     "  },",
    //     "  computed: {",
    //     "",
    //     "  },",
    //     "  created() {}, // 生命周期 - 组件实例化后",
    //     "  mounted() {}, // 生命周期 - 挂载之后",
    //     "  beforeCreate() {}, // 生命周期 - 创建之前",
    //     "  beforeMount() {}, // 生命周期 - 挂载之前",
    //     "  beforeUpdate() {}, // 生命周期 - 更新之前",
    //     "  updated() {}, // 生命周期 - 更新之后",
    //     "  beforeDestroy() {}, // 生命周期 - 销毁之前",
    //     "  destroyed() {}, // 生命周期 - 销毁完成",
    //     "  activated() {}, // 如果页面有keep-alive缓存功能，这个函数会触发",
    //     "  methods: {",
    //     "",
    //     "  }",
    //     "}",
    //     "</script>",
    //     "",
    //     "<style lang='scss' scoped>",
    //     ".$$_name{font-size:14px;}",
    //     "</style>",
    //     "",
    //   ],
    // }
  ],
};

const defaultTemplate = {
  name: "vue-base-template",
  description: "生成vue的基础组件",
  path: "", // 可提供文件路径作为模板
  postfix: ".vue", // 自定义生成文件的扩展名
  isAddPrefix: false, // 是否为该模板添加用户输入的模板名为前缀,仅对多模板有效
  outputPath:"", // 指定该模板的输出路径，如果指定目录部分不存在将自动创建
  template: [ // path 和 template任选一项即可，path优先级更高
    "<template>",
    '  <div class="$$_name">\n    template\n  </div>',
    "</template>",
    "",
    "<script>",
    "// import x from ''",
    "export default {",
    "  name: '$$_name',",
    "  components: {",
    "",
    "  },",
    "  data() {",
    "    return {",
    "      data: ''",
    "    }",
    "  },",
    "  computed: {",
    "",
    "  },",
    "  created() {}, // 生命周期 - 组件实例化后",
    "  mounted() {}, // 生命周期 - 挂载之后",
    "  beforeCreate() {}, // 生命周期 - 创建之前",
    "  beforeMount() {}, // 生命周期 - 挂载之前",
    "  beforeUpdate() {}, // 生命周期 - 更新之前",
    "  updated() {}, // 生命周期 - 更新之后",
    "  beforeDestroy() {}, // 生命周期 - 销毁之前",
    "  destroyed() {}, // 生命周期 - 销毁完成",
    "  activated() {}, // 如果页面有keep-alive缓存功能，这个函数会触发",
    "  methods: {",
    "",
    "  }",
    "}",
    "</script>",
    "",
    "<style lang='scss' scoped>",
    ".$$_name{font-size:14px;}",
    "</style>",
    "",
  ],
}

module.exports = {
  defaultConfig,
  defaultTemplate
};
