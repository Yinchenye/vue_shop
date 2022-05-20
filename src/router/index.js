// 该文件管理项目中的所有路由配置
import vueRouter from "vue-router";
const router = new vueRouter({
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      component: () => import("../views/MyLogin.vue"),
    },
    {
      path: "/home",
      component: () => import("../views/MyHome.vue"),
    },
  ],
});
// 设置路由守卫，每次登录前，验证token
router.beforeEach((to, from, next) => {
  // 登录界面对任何人放行
  if (to.path == "/login") next();
  // 只有会话中存有token才能放行
  if (to.path == "/home") {
    if (!sessionStorage.getItem("token")) {
      return next("/login");
    } else {
      next()
    }
  }
});
export default router;
