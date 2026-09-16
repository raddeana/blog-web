<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons-vue';
import type { Rule } from 'ant-design-vue/es/form';
import ParticleBackground from '../components/particle-background.vue';
import { useUserStore } from '../stores/user';

const router = useRouter();
const userStore = useUserStore();

const formState = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agree: false,
});
const loading = ref(false);

const validatePassword = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject('请输入密码');
  }
  if (value.length < 6 || value.length > 20) {
    return Promise.reject('密码长度 6-20 位');
  }
  if (!/[a-zA-Z]/.test(value) || !/\d/.test(value)) {
    return Promise.reject('密码须包含字母和数字');
  }
  return Promise.resolve();
};

const validateConfirm = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject('请再次输入密码');
  }
  if (value !== formState.password) {
    return Promise.reject('两次密码不一致');
  }
  return Promise.resolve();
};

const validateAgree = async (_rule: Rule, value: boolean) => {
  if (!value) {
    return Promise.reject('请阅读并同意用户协议');
  }
  return Promise.resolve();
};

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'change' },
    { min: 3, max: 20, message: '用户名长度 3-20 位', trigger: 'change' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '仅允许字母、数字、下划线', trigger: 'change' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'change' },
    { type: 'email' as const, message: '邮箱格式不正确', trigger: 'change' },
  ],
  password: [{ required: true, validator: validatePassword, trigger: 'change' }],
  confirmPassword: [{ required: true, validator: validateConfirm, trigger: 'change' }],
  agree: [{ validator: validateAgree, trigger: 'change' }],
};

const handleSubmit = async (values: {
  username: string;
  email: string;
  password: string;
}) => {
  loading.value = true;
  try {
    await userStore.register({
      username: values.username,
      email: values.email,
      password: values.password,
    });
    message.success('注册成功，请登录');
    router.push('/login');
  } catch (e: any) {
    message.error(e?.message || '注册失败');
  } finally {
    loading.value = false;
  }
};

const goLogin = () => router.push('/login');
</script>

<template>
  <div class="auth-page">
    <ParticleBackground />
    <div class="auth-card">
      <h1 class="auth-title">注册</h1>
      <p class="auth-subtitle">加入 Blog，开启你的创作之旅</p>
      <a-form
        :model="formState"
        :rules="rules"
        layout="vertical"
        @finish="handleSubmit"
      >
        <a-form-item name="username">
          <a-input
            v-model:value="formState.username"
            size="large"
            placeholder="用户名"
            allow-clear
          >
            <template #prefix>
              <UserOutlined style="color: rgba(0, 240, 255, 0.6)" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="email">
          <a-input
            v-model:value="formState.email"
            size="large"
            placeholder="邮箱"
            allow-clear
          >
            <template #prefix>
              <MailOutlined style="color: rgba(0, 240, 255, 0.6)" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="password">
          <a-input-password
            v-model:value="formState.password"
            size="large"
            placeholder="密码（字母+数字，6-20 位）"
          >
            <template #prefix>
              <LockOutlined style="color: rgba(0, 240, 255, 0.6)" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item name="confirmPassword">
          <a-input-password
            v-model:value="formState.confirmPassword"
            size="large"
            placeholder="确认密码"
          >
            <template #prefix>
              <LockOutlined style="color: rgba(0, 240, 255, 0.6)" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item name="agree">
          <a-checkbox v-model:checked="formState.agree">
            我已阅读并同意 <a class="auth-link">用户协议</a> 与 <a class="auth-link">隐私政策</a>
          </a-checkbox>
        </a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          :loading="loading"
          size="large"
          block
          class="auth-submit"
        >
          注册
        </a-button>
        <p class="auth-switch">
          已有账号?<a class="auth-link" @click="goLogin">返回登录</a>
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
  padding: 24px 0;
}

.auth-card {
  position: relative;
  z-index: 10;
  width: 400px;
  max-width: calc(100vw - 32px);
  padding: 36px 36px 32px;
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
  align-items: flex-start;
}

:deep(.ant-checkbox + span) {
  padding-left: 8px;
  padding-top: 0;
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
