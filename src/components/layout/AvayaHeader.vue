<template>
  <div :class="{'web-header': true}">
    <div class="container">
      <div class="logo">
        <el-image
            :src="websiteStore.state.websiteInfo.logo===''?'/image/avaya/avaya-red-logo.jpeg':websiteStore.state.websiteInfo.logo"
            alt=""/>
      </div>
      <div class="web-menu">
        <el-menu mode="horizontal" :ellipsis="false" :router="true" :default-active="route.path">
          <template v-for="item in menuList">
            <el-menu-item :index="item.name"><span>{{ item.title }}</span></el-menu-item>
          </template>
        </el-menu>
      </div>
      <div class="login">
        <login-popup/>
      </div>
    </div>
  </div>
  <carousel/>
</template>

<script setup lang="ts">
import LoginPopup from "@/components/common/LoginPopup.vue";
import Carousel from "@/components/layout/Carousel.vue";
import {useWebsiteStore} from "@/stores/website";
import { useRoute } from 'vue-router';

const websiteStore = useWebsiteStore()
const route = useRoute()

interface MenuItem {
  title: string;
  name: string;
}

const menuList: MenuItem[] = [
  {
    title: "Home",
    name: "/chat",
  },
  {
    title: "Statistic",
    name: "/statistic",
  },
  {
    title: "Confluence",
    name: "/confluence"

  },
  {
    title: "About",
    name: "/about",
  }
]

</script>


<style scoped lang="scss">
.web-header {
  display: flex;
  justify-content: center;
  padding: 0 10px;
  width: auto;

  .container {
    display: flex;
    width: 100%;
    align-items: center;

    .logo {
      display: flex;

      .el-image {
        // padding: 1px;
        height: 100px;
      }
    }
    .web-menu {
      margin-left: 20px;
      display: flex;
      align-items: center;

      .el-menu {
        background-color: transparent;
        border-bottom: none;
        --el-menu-item-font-size: 20px;

        .el-menu-item {
          border-bottom: none;
          background-color: transparent;
        }
      }
    }

    .login {
      margin-left: auto;
      display: flex;
      align-items: center;
      margin-right: 20px;

      .el-icon {
        font-size: 28px;
      }
    }
  }
}
</style>
