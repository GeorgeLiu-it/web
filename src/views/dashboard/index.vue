<template>
  <div class="dashboard">
    <div class="logo">
      <el-image
          src="/image/avaya/avaya-red-logo.jpeg"
          alt=""/>
    </div>
    <el-container>
      <el-aside :class="{collapsed: isCollapse}">
        <dashboard-menu/>
      </el-aside>
      <el-container>
        <el-header>
          <div class="header-top">
            <breadcrumb/>
            <div class="header-top-right">
              <login-popup/>
            </div>
          </div>
          <dashboard-tag/>
        </el-header>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
    <avaya-footer/>
  </div>
</template>

<script setup lang="ts">
import DashboardMenu from "@/components/layout/DashboardMenu.vue";
import Breadcrumb from "@/components/layout/Breadcrumb.vue";
import {computed} from "vue";
import DashboardTag from "@/components/layout/DashboardTag.vue";
import LoginPopup from "@/components/common/LoginPopup.vue";
import {useLayoutStore} from "@/stores/layout";
import AvayaFooter from "@/components/layout/AvayaFooter.vue";

const store = useLayoutStore()
const isCollapse = computed(() => store.state.isCollapse)
</script>

<style scoped lang="scss">
.dashboard {
  display: flex;
  max-width: 1400px;
  flex-direction: column;
  margin: 0 auto;

  .logo {
    width: 100%;
    text-align: left;
    padding: 2px;
    background-color: white; /* optional, for contrast */
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.05);

    .el-image {
      height: 80px;
      width: auto;
      object-fit: contain;
    }
  }

  .el-aside {
    border: 1px solid #DCDFE6;
    width: 240px;
    height: 100vh;
    &::-webkit-scrollbar{
      display: none;
    }
  }

  .el-aside.collapsed {
    width: 64px;
  }

  .el-header {
    height: auto;
    border: 1px solid #DCDFE6;

    .header-top {
      display: flex;
      border-bottom: 1px solid #DCDFE6;

      .header-top-right {
        margin-left: auto;
        margin-top: auto;
        margin-bottom: auto;


      }
    }
  }

  .el-main{
    height: calc(100vh - 100px);
    &::-webkit-scrollbar{
      display: none;
    }
  }
}
</style>
