// 这个文件用来管理用到的Element-UI组件按需导入
import Vue from "vue";
import "element-ui/lib/theme-chalk/index.css";
import {
  Form,
  FormItem,
  Input,
  Button,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Select,
  Option,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Steps,
  Step,
  CheckboxGroup,
  Checkbox,
  Upload,
  Timeline,
  TimelineItem,
} from "element-ui";
Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);
Vue.component(Input.name, Input);
Vue.component(Button.name, Button);
// 将消息提示信息挂载到Vue原型对象中
Vue.prototype.$message = Message;
Vue.component(Container.name, Container);
Vue.component(Header.name, Header);
Vue.component(Aside.name, Aside);
Vue.component(Main.name, Main);
Vue.component(Menu.name, Menu);
Vue.component(Submenu.name, Submenu);
Vue.component(MenuItem.name, MenuItem);
Vue.component(Breadcrumb.name, Breadcrumb);
Vue.component(BreadcrumbItem.name, BreadcrumbItem);
Vue.component(Card.name, Card);
Vue.component(Row.name, Row);
Vue.component(Col.name, Col);
Vue.component(Table.name, Table);
Vue.component(TableColumn.name, TableColumn);
Vue.component(Switch.name, Switch);
Vue.component(Tooltip.name, Tooltip);
Vue.component(Pagination.name, Pagination);
Vue.component(Select.name, Select);
Vue.component(Option.name, Option);
Vue.component(Dialog.name, Dialog);
// 将弹框（ MessageBox.confirm）挂载到Vue原型对象中
Vue.prototype.$confirm = MessageBox.confirm;
Vue.component(Tag.name, Tag);
Vue.component(Tree.name, Tree);
Vue.component(Cascader.name, Cascader);
Vue.component(Alert.name, Alert);
Vue.component(Tabs.name, Tabs);
Vue.component(TabPane.name, TabPane);
Vue.component(Steps.name, Steps);
Vue.component(Step.name, Step);
Vue.component(CheckboxGroup.name, CheckboxGroup);
Vue.component(Checkbox.name, Checkbox);
Vue.component(Upload.name, Upload);
Vue.component(Timeline.name, Timeline);
Vue.component(TimelineItem.name, TimelineItem);
