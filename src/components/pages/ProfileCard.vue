<template>
  <el-card class="profile-card">
    <el-row class="title">Self Card</el-row>
    <div class="content">
      <el-row class="info-row">
        <el-col :span="6" class="label">Nick:</el-col>
        <el-col :span="18" class="value">{{ websiteStore.state.websiteInfo.name }}</el-col>
      </el-row>
      <el-row class="info-row">
        <el-col :span="6" class="label">Email:</el-col>
        <el-col :span="18" class="value">{{ websiteStore.state.websiteInfo.email }}</el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import {useWebsiteStore} from "@/stores/website";

const websiteStore = useWebsiteStore()
</script>

<style scoped lang="scss">
.profile-card {
  margin-bottom: 20px;

  .title {
    font-size: 24px;
    margin-bottom: 10px;
  }

  .content {
    .label {
      font-size: auto;
      font-weight: bold;
    }
  }
}
</style>
