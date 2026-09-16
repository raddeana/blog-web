<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import ParticleBackground from '../components/particle-background.vue';
import { useUserStore } from '../stores/user';

const router = useRouter();
const userStore = useUserStore();

const formState = reactive({
  account: '',
  password: '',
});
const remember = ref(false);
const loading = ref(false);

const rules = {
  account: [
    { required: true, message: '请输入用户名或邮箱', trigger: 'change' },
    { max: 50, message: '不超过 50 个字符', trigger: 'change' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'change' },
    { min: 6, max: 20, message: '密码长度 6-20 位', trigger: 'change' },
  ],
};

const handleSubmit = async (values: { account: string; password: string }) => {
  loading.value = true;
  try {
    await userStore.login({
      username: values.account,
      password: values.password,
    });
    message.success('登录成功');
    router.push('/home');
  } catch (e: any) {
    message.error(e?.message || '登录失败');
  } finally {
    loading.value = false;
  }
};

const goRegister = () => router.push('/register');
</script>

<template>
  <div class="auth-page">
    <ParticleBackground />
    <div class="auth-card">
      <h1 class="auth-title">登录</h1>
      <p class="auth-subtitle">欢迎回到 Blog</p>
      <a-form
        :model="formState"
        :rules="rules"
        layout="vertical"
        @finish="handleSubmit"
      >
        <a-form-item name="account">
          <a-input
            v-model:value="formState.account"
            size="large"
            placeholder="用户名 / 邮箱"
            allow-clear
          >
            <template #prefix>
              <UserOutlined style="color: rgba(0, 240, 255, 0.6)" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="password">
          <a-input-password
            v-model:value="formState.password"
            size="large"
            placeholder="密码"
          >
            <template #prefix>
              <LockOutlined style="color: rgba(0, 240, 255, 0.6)" />
            </template>
          </a-input-password>
        </a-form-item>
        <div class="auth-row">
          <a-checkbox v-model:checked="remember">记住我</a-checkbox>
          <a class="auth-link" @click="message.info('请联系管理员重置密码')">忘记密码?</a>
        </div>
        <a-button
          type="primary"
          html-type="submit"
          :loading="loading"
          size="large"
          block
          class="auth-submit"
        >
          登录
        </a-button>
        <p class="auth-switch">
          还没账号?<a class="auth-link" @click="goRegister">立即注册</a>
        </p>
      </a-form>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.auth-card {
  position: relative;
  z-index: 10;
  width: 400px;
  max-width: calc(100vw - 32px);
  padding: 40px 36px;
  background: rgba(13, 17, 40, 0.6);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(0, 240, 255, 0.25);
  border-radius: 16px;
  box-shadow:
    0 0 40px rgba(0, 240, 255, 0.15),
    0 0 80px rgba(124, 92, 255, 0.1),
    inset 0 0 20px rgba(0, 240, 255, 0.05);
  animation: glow 4s ease-in-out infinite;
}

@keyframes glow {
  0%,
  100% {
    box-shadow:
      0 0 40px rgba(0, 240, 255, 0.15),
      0 0 80px rgba(124, 92, 255, 0.1),
      inset 0 0 20px rgba(0, 240, 255, 0.05);
  }
  50% {
    box-shadow:
      0 0 60px rgba(0, 240, 255, 0.3),
      0 0 100px rgba(124, 92, 255, 0.2),
      inset 0 0 30px rgba(0, 240, 255, 0.1);
  }
}

.auth-title {
  margin: 0 0 4px;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: 2px;
  color: #e6f7ff;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
  text-align: center;
}

.auth-subtitle {
  margin: 0 0 28px;
  font-size: 13px;
  letter-spacing: 1px;
  color: rgba(230, 247, 255, 0.65);
  text-align: center;
}

.auth-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.auth-switch {
  margin: 20px 0 0;
  font-size: 13px;
  color: rgba(230, 247, 255, 0.65);
  text-align: center;
}

.auth-link {
  margin-left: 4px;
  color: #00f0ff;
  cursor: pointer;
  transition: color 0.2s;
}

.auth-link:hover {
  color: #7c5cff;
  text-shadow: 0 0 8px rgba(124, 92, 255, 0.6);
}

:deep(.ant-checkbox-wrapper) {
  color: rgba(230, 247, 255, 0.65);
}

:deep(.ant-checkbox-inner) {
  background-color: transparent;
  border-color: rgba(0, 240, 255, 0.4);
}

:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: #00f0ff;
  border-color: #00f0ff;
  box-shadow: 0 0 8px rgba(0, 240, 255, 0.6);
}

:deep(.ant-input-affix-wrapper),
:deep(.ant-input) {
  background: rgba(5, 8, 22, 0.5);
  border-color: rgba(0, 240, 255, 0.25);
  color: #e6f7ff;
}

:deep(.ant-input-affix-wrapper:hover),
:deep(.ant-input:hover) {
  border-color: rgba(0, 240, 255, 0.5);
}

:deep(.ant-input-affix-wrapper-focused),
:deep(.ant-input-affix-wrapper:focus),
:deep(.ant-input:focus) {
  border-color: #00f0ff;
  box-shadow: 0 0 0 2px rgba(0, 240, 255, 0.2);
}

:deep(.ant-input-password-icon) {
  color: rgba(230, 247, 255, 0.45);
}

:deep(.ant-input-password-icon:hover) {
  color: #00f0ff;
}

:deep(.ant-form-item-label > label) {
  color: rgba(230, 247, 255, 0.85);
}

:deep(.ant-btn-primary) {
  background: linear-gradient(135deg, #00f0ff 0%, #7c5cff 100%);
  border: none;
  font-weight: 600;
  letter-spacing: 2px;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.4);
}

:deep(.ant-btn-primary:hover) {
  background: linear-gradient(135deg, #33f3ff 0%, #8d6cff 100%);
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.6);
}
</style>
