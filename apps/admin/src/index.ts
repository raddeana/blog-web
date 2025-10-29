import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import 'element-plus/dist/index.css';
import './index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App);
const pinia = createPinia();

// 注册全部icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia);
app.mount('#app');
