// 这个文件用来管理用到的Element-UI组件按需导入
import Vue from "vue";
import "element-ui/lib/theme-chalk/index.css";
import { Form, FormItem, Input, Button } from "element-ui";
import { Message } from "element-ui";
Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);
Vue.component(Input.name, Input);
Vue.component(Button.name, Button);
// 将消息提示信息挂载到Vue原型对象中
Vue.prototype.$message = Message;
