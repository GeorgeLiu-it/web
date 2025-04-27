<template>
  <div class="web">
    <el-container>
      <el-header>
        <avaya-header/>
      </el-header>
      <el-main>
        <div class="error">
          <el-image src="/image/avaya/404.jpeg" alt=""/>
        </div>
      </el-main>
      <el-footer>
        <avaya-footer/>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import AvayaHeader from "@/components/layout/AvayaHeader.vue";
import AvayaFooter from "@/components/layout/AvayaFooter.vue";
</script>

<style scoped lang="scss">
.web {
  max-width: 1400px;
  .el-header {
    height: auto;
  }
  .el-main {
    padding: 0 50px;
    height: auto;
  }
  .el-footer {
    height: auto;
  }
}

.error{
  display: flex;
  .el-image {
    margin-top: 80px;
    margin-left: auto;
    margin-right: auto;
    height: 300px;
    width: auto;
  }
}
</style>
