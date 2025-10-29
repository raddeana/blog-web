<template>
<el-container>
    <el-header><custom-header /></el-header>
    <el-container>
        <el-aside width="200px"><custom-left-nav /></el-aside>
        <el-container>
            <el-main><slot /></el-main>
        </el-container>
    </el-container>
    <el-footer><custom-footer /></el-footer>
</el-container>
</template>
<style scoped>

</style>
<script setup>
import CustomHeader from './custom-header';
import CustomLeftNav from './custom-left-nav';
import CustomFooter from './custom-footer';
import { ElHeader, ElContainer, ElFooter, } from 'element-plus';
</script>