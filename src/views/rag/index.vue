<template>
  <div class="web">
    <el-container>
      <el-header>
        <avaya-header/>
      </el-header>
      <el-main>
        <el-container class="layout-body">
          <el-aside>
            <RagAside></RagAside>
          </el-aside>

          <el-main>
            <el-scrollbar class="layout-scrollbar">
              <div class="layout-main">
                <router-view v-slot="{ Component }">
                  <keep-alive include="Chat">
                    <component :is="Component" />
                  </keep-alive>
                </router-view>
              </div>
            </el-scrollbar>
            <el-backtop target=".layout-scrollbar .el-scrollbar__wrap" :right="50" :bottom="60" />
          </el-main>
        </el-container>
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
import RagAside from "@/components/layout/RagAside.vue";
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
  
<style lang="scss" scoped>
.layout {
  position: relative;
  width: 100vw;
  height: 100vh;

  .el-header {
    padding: 0 10px;
    background-color: var(--el-color-primary-light-5);
  }

  .layout-body {
    height: 0;

    .el-main {
      padding: 0;
      background-color: var(--el-bg-color-page);
    }

    .el-footer {
      background-color: var(--el-bg-color-page);
    }
  }

  .layout-main {
    min-height: calc(100vh - var(--el-header-height) - var(--el-footer-height));
    padding: 20px;
  }
}
</style>