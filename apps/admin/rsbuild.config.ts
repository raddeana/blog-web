import path from 'path';
import { defineConfig, } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';
import AutoImport from 'unplugin-auto-import/rspack';
import Components from 'unplugin-vue-components/rspack';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import ElementPlus from 'unplugin-element-plus/rspack';
import { pluginLess } from '@rsbuild/plugin-less';

export default defineConfig({
  server: {
    port: 8080,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
  },
  plugins: [
    pluginLess(),
    pluginVue(),
  ],
  html: {
    template: './public/index.html',
  },
  tools: {
    rspack: {
      plugins: [
        ElementPlus(),
        AutoImport({
          resolvers: [ElementPlusResolver()],
        }),
        Components({
          resolvers: [ElementPlusResolver()],
        }),
      ],
    },
  },
});
