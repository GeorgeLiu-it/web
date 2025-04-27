<template>
  <div class="web">
    <el-container>
      <el-header>
        <avaya-header/>
      </el-header>
      <el-main>
        <router-view/>
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
</style>
