import { createWebHistory, createRouter } from 'vue-router';

const routes = [
    { path: '/', component: () => import('@/pages/home.vue'),},
    { path: '/users', component: () => import('@/pages/users.vue'), },
    { path: '/roles', component: () => import('@/pages/roles.vue'), },
    { path: '/auths', component: () => import('@/pages/auths.vue'), },
    { path: '/contents', component: () => import('@/pages/contents.vue'), },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});