<template>
  <div class="system-config">
    <el-container>
      <el-aside width="160px">
        <el-menu :collapse-transition="false" :router="true" :default-active="$route.path">
          <template v-for="item in menuList">
            <el-menu-item :index="generatePathForSingleItem(item)">
              <span>{{ item.title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
interface MenuItem {
  title: string;
  name: string;
}

const menuList: MenuItem[] = [
  // {
  //   title: "Site",
  //   name: "site-config",
  // },
  {
    title: "System",
    name: "system-config",
  },
  {
    title: "Email",
    name: "email-config",
  },
  {
    title: "JWT",
    name: "jwt-config",
  }
]

function generatePathForSingleItem(item: MenuItem): string {
  return '/dashboard/system/app-config/' + item.name;
}
</script>

<style scoped lang="scss">
.el-menu{
  height: 100%;
}
</style>
