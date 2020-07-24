// 读取项目下的vvan.config.js，没得则使用默认配置
const defaultConfig = {
  postfix: ".vue", // 自定义生成的模板文件的扩展名
  outputPath:"", // 如果配置了输出目录，则在指定目录生成组件，如果没配置，则以命令行工作目录为准
  defalutOne: "vue-base-template", // 不设置默认选择，则通过问询来选择
  templateList: [
    // 如果只有一个模板，则默认选择第一个模板，不经过问询
    {
      name: "vue-base-template",
      description: "生成vue的基础组件",
      path: "", // 可提供文件来作为模板,路径为命令行的工作目录
      template: [
        "<template>",
        '  <div class="{{ name }}">\n    template\n  </div>',
        "</template>",
        "",
        "<script>",
        "// import x from ''",
        "export default {",
        "  name: '{{ name }}',",
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
        ".{{ name }}{font-size:13px;}",
        ".title{font-size: 14px;font-weight: bold;}",
        "</style>",
        "",
      ],
    },
  ],
};

module.exports = defaultConfig;
