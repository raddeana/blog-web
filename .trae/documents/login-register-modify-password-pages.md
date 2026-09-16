# 登录 / 注册 / 修改密码 页面实现计划

## Context

`packages/user` 是 monorepo 中负责用户域的组件库，已声明 Vue3 + Ant Design Vue + Pinia + Axios 依赖，但 `views/login.vue`、`views/register.vue`、`components/modify-password-modal.vue`、`services/user.ts` 均为空文件；`index.ts` 引用了不存在的 `./apis/user` 且导出语法非法（`export LoginPage from ...`）。`apps/web` 目前是 Vite 脚手架状态，已具备 vue-router/pinia/ant-design-vue/axios 依赖但未集成路由。

本计划目标：
1. 在 `packages/user` 内建成完整的用户域页面（登录/注册/修改密码）+ 接口层 + 状态层，科技感粒子动画视觉风格；
2. 修正 `index.ts` 非法导出语法；
3. 在 `apps/web` 集成 vue-router 路由 + Pinia + Ant Design Vue，使页面可直接访问 `/login` `/register` `/home`；
4. 接口走 mock 占位，不接真实后端；不引第三方动画/持久化库。

## 设计决策

- **Pinia store 放 `packages/user/stores/user.ts`**：用户域状态归属用户包，页面自洽（页面调 api → 写 store → 跳转），apps/web 守卫直接复用此 store，不在 web 内重复封装。
- **粒子背景抽公共组件** `particle-background.vue`：login/register 复用，modify-password-modal 不用（modal 浮在登录页之上，背景由宿主提供）。
- **services/user.ts 保留作业务编排层但不被 index.ts 导出**：本次透传 apis，预留扩展点；避免删文件扩大改动面。
- **接口走 `setTimeout` + `Promise.resolve` mock**，不引 mock 库。
- **localStorage 手写持久化**，不引 pinia-persistedstate。
- **apps/web 全量引入 Ant Design Vue + reset.css**：本次规模够用，按需引入不在范围内。
- **路由守卫用 packages/user 的 store**：单 store 真源，apps/web 不自建。
- **修正 index.ts 导出语法**为 `export { default as X } from '...'`，否则 `@blog/user` 导入会失败。

## 视觉规范

- 背景主色 `#050816`（极深蓝黑）；次背景/卡片 `#0d1128` / `rgba(13,17,40,.6)`
- 霓虹色板：青 `#00f0ff`（主）、紫 `#7c5cff`（辅）、品红 `#ff006e`（点缀）、蓝 `#3a86ff`
- 文字主 `#e6f7ff`，次 `rgba(230,247,255,.65)`
- 毛玻璃卡片：`backdrop-filter: blur(14px)` + 多层霓虹 `box-shadow` + `glow` 4s 呼吸动画
- antd 组件用 `:deep()` 穿透 scoped 覆盖配色（输入框聚焦青色光晕、按钮渐变背景）
- 字体：`'Segoe UI', 'PingFang SC', system-ui, sans-serif` + `letter-spacing`，不引外部字体
- 粒子：canvas 自实现，动态数量 `min(120, area/12000)`，运动 ±0.3~0.6，连线距离 130px，鼠标连线距离 160px，半透明深色矩形做拖尾

## 工作清单（按执行顺序）

### 第一阶段：接口 + 状态层

| # | 文件 | 操作 | 简述 |
|---|---|---|---|
| 1 | `packages/user/apis/user.ts` | 新建 | axios 实例（baseURL `import.meta.env.VITE_API_BASE_URL \|\| '/api'`、timeout、错误归一化拦截器）+ 类型（LoginParams/RegisterParams/ModifyPasswordParams/LoginResult/UserInfo/ApiResponse）+ login/register/modifyPassword 三函数，`setTimeout` 600ms mock 占位返回 |
| 2 | `packages/user/stores/user.ts` | 新建 | `defineStore('blog-user', {...})` options 风格；state `{ token, userInfo }`；actions `setToken/setUserInfo/login/register/modifyPassword/logout`；手写 localStorage 持久化（init 读 + 改时写），key `blog_user_token`/`blog_user_info` |
| 3 | `packages/user/services/user.ts` | 填写 | 业务编排层，聚合 apis 为 `userService` 对象，注释说明定位；不被 index.ts 导出 |
| 4 | `packages/user/index.ts` | 修改 | 修导出语法为 `{ default as X }`；新增导出 `useUserStore` |

### 第二阶段：页面组件

| # | 文件 | 操作 | 简述 |
|---|---|---|---|
| 5 | `packages/user/components/particle-background.vue` | 新建 | 全屏 canvas 粒子动画：粒子+连线+鼠标交互+resize+onUnmounted 清理 rafId；绝对定位 z-0 |
| 6 | `packages/user/views/login.vue` | 填写 | ParticleBackground + 毛玻璃卡片；a-form（account/password/remember）；rules required+min/max；提交 `useUserStore().login` → message.success → `router.push('/home')`；"立即注册"链接跳 /register；霓虹 scoped 样式 + `:deep()` 覆盖 antd |
| 7 | `packages/user/views/register.vue` | 填写 | 同布局；a-form（username/email/password/confirmPassword/agree）；username 限字符 pattern、email type、password 强度 validator、confirmPassword 一致性 validator、agree 必勾 validator；提交 `useUserStore().register` → message.success → `router.push('/login')` |
| 8 | `packages/user/components/modify-password-modal.vue` | 新建 | a-modal + a-form（oldPassword/newPassword/confirmPassword）；一致性 validator；props `open` v-model；提交 `useUserStore().modifyPassword` → 关闭 + resetFields；深色 modal 样式 `:deep(.ant-modal-content)` |

### 第三阶段：apps/web 集成

| # | 文件 | 操作 | 简述 |
|---|---|---|---|
| 9 | `apps/web/package.json` | 修改 | dependencies 加 `"@blog/user": "workspace:*"` |
| 10 | 根目录 | shell | `pnpm install` 建立 `@blog/user` 软链 |
| 11 | `apps/web/src/router/index.ts` | 新建 | 路由表（`/` redirect `/login`、`/login`、`/register`、`/home`、404）；`beforeEach` 守卫：未登录访问需鉴权页 → `/login`，已登录访问 `/login`/`/register` → `/home`；守卫内运行时调用 `useUserStore()` |
| 12 | `apps/web/src/views/home.vue` | 新建 | 占位首页：标题 + "修改密码"按钮（toggle `ModifyPasswordModal`）+ "退出登录"按钮（`useUserStore().logout()` + 跳 `/login`）；从 `@blog/user` 导入 |
| 13 | `apps/web/src/main.ts` | 修改 | `createPinia()` 先装 → `app.use(router)` → `app.use(Antd)` + `import 'ant-design-vue/dist/reset.css'` → mount |
| 14 | `apps/web/src/App.vue` | 修改 | 改为 `<router-view />`，删 HelloWorld 引用与 logo 样式 |
| 15 | `apps/web/src/style.css` | 修改 | 删 `#app` max-width/padding；`body` 去 `display:flex`/`place-items:center`；背景 `#050816`、`color #e6f7ff`；`html/body/#app` 全高；移除 button/a 自定义样式交 antd |
| 16 | `apps/web/index.html` | 修改 | title 改 "Blog Web" |

## 关键文件路径

- `D:\github\blog-web\packages\user\apis\user.ts` — 接口与类型层，页面与 store 数据来源
- `D:\github\blog-web\packages\user\stores\user.ts` — Pinia 域 store，登录态真源
- `D:\github\blog-web\packages\user\components\particle-background.vue` — 复用粒子背景组件
- `D:\github\blog-web\packages\user\views\login.vue` — 登录页主体（用户当前打开）
- `D:\github\blog-web\packages\user\index.ts` — 导出语法修复，必须先于其它改动
- `D:\github\blog-web\apps\web\src\router\index.ts` — 路由表与守卫
- `D:\github\blog-web\apps\web\src\main.ts` — Pinia/router/Antd 装配

## 验证方式

1. 仓库根目录 `D:\github\blog-web` 跑 `pnpm install`（新增 workspace 依赖后必须装一次）。
2. 根目录跑 `pnpm dev-web`（即 `pnpm -F @blog/web dev`，启动 vite）。
3. 访问 `http://localhost:5173`（端口以终端输出为准）。
4. 交互检查点：
   - 路由：`/` 自动重定向到 `/login`；未登录访问 `/home` 被守卫踢回 `/login`；登录后再访问 `/login` 被重定向到 `/home`。
   - 视觉：深色背景粒子缓慢漂浮、粒子间连线随距离淡出、鼠标附近粒子连出线；卡片毛玻璃 + 霓虹边光呼吸；输入框聚焦青色光晕。
   - 登录：填 `admin` / `123456`，约 600ms 后 toast "登录成功"，跳 `/home`；刷新 token 仍在。
   - 注册：点"立即注册"到 `/register`；两次密码不一致/未勾协议触发表单报错；填对提交 toast "注册成功"并跳 `/login`。
   - 修改密码：`/home` 点"修改密码"弹 modal；新密码不一致/少于 6 位报错；填对提交 toast 成功、modal 关闭、表单清空。
   - 退出登录：`/home` 点退出 → 跳 `/login`；再访问 `/home` 被拦截。
   - 控制台：无报错、无循环依赖 warning、无 antd 缺样式警告。
   - 性能：切走 `/login` 路由后 CPU 回落（`cancelAnimationFrame` 生效）。
