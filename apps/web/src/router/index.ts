import { createRouter, createWebHistory } from 'vue-router';
import { LoginPage, RegisterPage, ModifyPasswordPage, useUserStore } from '@blog/user';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: LoginPage, meta: { title: '登录' } },
    { path: '/register', name: 'register', component: RegisterPage, meta: { title: '注册' } },
    { path: '/modify-password', name: 'modify-password', component: ModifyPasswordPage, meta: { title: '修改密码', requiresAuth: true } },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/home.vue'),
      meta: { title: '首页', requiresAuth: true },
    },
    { path: '/:pathMatch(.*)*', redirect: '/login' },
  ],
});

router.beforeEach((to) => {
  const store = useUserStore();
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }
  if (to.meta.requiresAuth && !store.isLogin) {
    return '/login';
  }
  if ((to.path === '/login' || to.path === '/register') && store.isLogin) {
    return '/home';
  }
  return true;
});

export default router;
