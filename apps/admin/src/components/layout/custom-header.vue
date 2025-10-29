<template>
<div class="custom-header">
    <a href="javascript:;"><img class="logo" src="/logo.png" /></a>
    <el-dropdown>
        <span class="el-dropdown-link">
        {{ userInfo.name || 'unknown' }}
        <el-icon class="el-icon--right">
            <arrow-down />
        </el-icon>
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item>用户画像</el-dropdown-item>
                <el-dropdown-item>登出</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</div>
</template>
<style scoped lang="less">
.custom-header {
    margin: 0 -20px;
    border-bottom: 1px solid var(--el-menu-border-color);
    padding: 0 20px;
    height: calc(100% - 2px);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.logo {
    width: 30px;
    height: 30px;
}
</style>
<script setup>
import { useCounterStore, } from '@/stores/user-info';
const userInfo = useCounterStore();
</script>