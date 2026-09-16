<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { LockOutlined } from '@ant-design/icons-vue';
import type { Rule } from 'ant-design-vue/es/form';
import ParticleBackground from '../components/particle-background.vue';
import { useUserStore } from '../stores/user';

const router = useRouter();
const userStore = useUserStore();

const formRef = ref();
const loading = ref(false);

const formState = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const validateNewPassword = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject('请输入新密码');
  }
  if (value.length < 6 || value.length > 20) {
    return Promise.reject('密码长度 6-20 位');
  }
  if (!/[a-zA-Z]/.test(value) || !/\d/.test(value)) {
    return Promise.reject('密码须包含字母和数字');
  }
  if (value === formState.oldPassword) {
    return Promise.reject('新密码不能与旧密码相同');
  }
  return Promise.resolve();
};

const validateConfirm = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject('请再次输入新密码');
  }
  if (value !== formState.newPassword) {
    return Promise.reject('两次密码不一致');
  }
  return Promise.resolve();
};

const rules = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'change' }],
  newPassword: [{ required: true, validator: validateNewPassword, trigger: 'change' }],
  confirmPassword: [{ required: true, validator: validateConfirm, trigger: 'change' }],
};

const handleSubmit = async () => {
  try {
    await formRef.value.validate();
  } catch {
    return;
  }
  loading.value = true;
  try {
    await userStore.modifyPassword({
      oldPassword: formState.oldPassword,
      newPassword: formState.newPassword,
    });
    message.success('密码修改成功，请重新登录');
    router.push('/login');
  } catch (e: any) {
    message.error(e?.message || '修改失败');
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
      <h1 class="auth-title">修改密码</h1>
      <p class="auth-subtitle">请输入旧密码与新密码</p>
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        layout="vertical"
        @finish="handleSubmit"
      >
        <a-form-item name="oldPassword">
          <a-input-password
            v-model:value="formState.oldPassword"
            size="large"
            placeholder="旧密码"
          >
            <template #prefix>
              <LockOutlined style="color: rgba(0, 240, 255, 0.6)" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item name="newPassword">
          <a-input-password
            v-model:value="formState.newPassword"
            size="large"
            placeholder="新密码（字母+数字，6-20 位）"
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
            placeholder="确认新密码"
          >
            <template #prefix>
              <LockOutlined style="color: rgba(0, 240, 255, 0.6)" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          :loading="loading"
          size="large"
          block
          class="auth-submit"
        >
          确认修改
        </a-button>
        <p class="auth-switch">
          <a class="auth-link" @click="goLogin">返回登录</a>
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

.auth-switch {
  margin: 20px 0 0;
  font-size: 13px;
  color: rgba(230, 247, 255, 0.65);
  text-align: center;
}

.auth-link {
  color: #00f0ff;
  cursor: pointer;
  transition: color 0.2s;
}

.auth-link:hover {
  color: #7c5cff;
  text-shadow: 0 0 8px rgba(124, 92, 255, 0.6);
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
