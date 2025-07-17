import DefaultTheme from "vitepress/theme";
// 确保打包后静态站点拥有td样式
import "tdesign-vue-next/es/style/index.css";

export default {
  ...DefaultTheme,
};
