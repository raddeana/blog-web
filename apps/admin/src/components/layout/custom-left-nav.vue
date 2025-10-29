<template>
<div class="nav-wrapper">
    <el-menu>
        <el-menu-item index="auths" route="/auths">
            <el-icon><icon-menu /></el-icon>
            <span>权限管理</span>
        </el-menu-item>
        <el-menu-item index="roles" route="/roles">
            <el-icon><icon-menu /></el-icon>
            <span>角色管理</span>
        </el-menu-item>
        <el-menu-item index="users" route="/users">
            <el-icon><icon-menu /></el-icon>
            <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="contents" route="/contents">
            <el-icon><icon-menu /></el-icon>
            <span>内容管理</span>
        </el-menu-item>
    </el-menu>
</div>
</template>
<style lang="less" scoped>
.nav-wrapper {
    height: calc(100vh - 120px);
    overflow-x: hidden;
    overflow-y: auto;
    border-right: 1px solid var(--el-menu-border-color);

    ::v-deep .el-menu {
        border-right: 0;
    }
}
</style>
