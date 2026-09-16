<script setup lang="ts">
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { useUserStore } from '@blog/user';

const router = useRouter();
const userStore = useUserStore();

const handleLogout = () => {
  userStore.logout();
  message.success('已退出登录');
  router.push('/login');
};

const goModifyPassword = () => router.push('/modify-password');
</script>

<template>
  <div class="home-page">
    <div class="home-card">
      <h1 class="home-title">首页占位</h1>
      <p class="home-welcome">
        欢迎，<span class="home-username">{{ userStore.userInfo?.username }}</span>
      </p>
      <div class="home-actions">
        <a-button type="primary" @click="goModifyPassword">修改密码</a-button>
        <a-button @click="handleLogout">退出登录</a-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #050816;
}

.home-card {
  padding: 48px 56px;
  background: rgba(13, 17, 40, 0.6);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(0, 240, 255, 0.25);
  border-radius: 16px;
  box-shadow:
    0 0 40px rgba(0, 240, 255, 0.15),
    0 0 80px rgba(124, 92, 255, 0.1);
  text-align: center;
}

.home-title {
  margin: 0 0 12px;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: 2px;
  color: #e6f7ff;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
}

.home-welcome {
  margin: 0 0 28px;
  color: rgba(230, 247, 255, 0.75);
  letter-spacing: 1px;
}

.home-username {
  color: #00f0ff;
  font-weight: 600;
}

.home-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.home-actions .ant-btn-primary {
  background: linear-gradient(135deg, #00f0ff 0%, #7c5cff 100%);
  border: none;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.4);
}

.home-actions .ant-btn-default {
  background: rgba(5, 8, 22, 0.5);
  border-color: rgba(0, 240, 255, 0.25);
  color: #e6f7ff;
}
</style>
