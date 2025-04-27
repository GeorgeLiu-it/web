<template>
  <div class="dashboard-menu">
    <div class="collapse-button">
      <el-button @click="handleCollapse">
        <el-icon>
          <component :is="icon"></component>
        </el-icon>
      </el-button>
    </div>
    <el-menu :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="$route.path">
      <template v-for="item in menuList">
        <el-menu-item v-if="!item.subItems" :index="generatePathForSingleItem(item)">
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
        <el-sub-menu v-else-if="!item.admin_role||userStore.isAdmin" :index="item.name">
          <template #title>
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item v-for="subItem in item.subItems" :index="generatePathForSubItem(item,subItem)"
                        @click="handleClick(subItem)">
            <el-icon>
              <component :is="subItem.icon"></component>
            </el-icon>
            <span>{{ subItem.title }}</span>
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import type {Tag} from "@/stores/tag";
import {computed} from "vue";
import {useLayoutStore} from "@/stores/layout";
import {useTagStore} from "@/stores/tag";
import {useUserStore} from "@/stores/user";

const userStore = useUserStore()

interface MenuItem {
  title: string;
  name: string;
  icon: string;
  subItems?: MenuItem[];
  admin_role?:boolean;
}

const menuList: MenuItem[] = [
  {
    title: "Home",
    name: "",
    icon: "House"
  },
  {
    title: "Self Center",
    name: "user-center",
    icon: "Monitor",
    subItems: [
      {
        title: "Information",
        name: "user-info",
        icon: "Postcard"
      },
      {
        title: "Like & Star",
        name: "user-star",
        icon: "Star"
      },
      {
        title: "Comment",
        name: "user-comment",
        icon: "ChatDotRound"
      },
      {
        title: "Feedback",
        name: "user-feedback",
        icon: "Message"
      }
    ]
  },
  {
    title: "User Management",
    name: "users",
    icon: "User",
    admin_role:true,
    subItems: [
      {
        title: "User List",
        name: "user-list",
        icon: "SetUp"
      }
    ]
  },
  {
    title: "Article Management",
    name: "articles",
    icon: "Document",
    admin_role:true,
    subItems: [
      {
        title: "Publish",
        name: "article-publish",
        icon: "Collection"
      },
      {
        title: "Comment",
        name: "comment-list",
        icon: "ChatLineRound"
      },
      {
        title: "List",
        name: "article-list",
        icon: "DocumentCopy"
      }
    ]
  },
  // {
  //   title: "Image Management",
  //   name: "images",
  //   icon: "Picture",
  //   admin_role:true,
  //   subItems: [
  //     {
  //       title: "List",
  //       name: "image-list",
  //       icon: "PictureRounded"
  //     }
  //   ]
  // },
  {
    title: "System Management",
    name: "system",
    icon: "Coin",
    admin_role:true,
    subItems: [
      {
        title: "Feedback",
        name: "feedback-list",
        icon: "Position"
      },
      // {
      //   title: "广告列表",
      //   name: "advertisement-list",
      //   icon: "Connection"
      // },
      // {
      //   title: "友链列表",
      //   name: "friend-link-list",
      //   icon: "Link"
      // },
      {
        title: "Login traces",
        name: "login-logs",
        icon: "memo"
      },
      {
        title: "Configuration",
        name: "app-config",
        icon: "setting"
      }
    ]
  }
]

const layoutStore = useLayoutStore()
const tagStore = useTagStore()
const isCollapse = computed(() => layoutStore.state.isCollapse)
const icon = computed(() => layoutStore.state.isCollapse ? "Expand" : "Fold")

const handleCollapse = () => {
  layoutStore.state.isCollapse = !layoutStore.state.isCollapse
}

function generatePathForSingleItem(item: MenuItem): string {
  return '/dashboard/' + item.name;
}

function generatePathForSubItem(parentItem: MenuItem, subItem: MenuItem): string {
  return '/dashboard/' + parentItem.name + '/' + subItem.name;
}

function handleClick(subItem: MenuItem) {
  const newTag: Tag = {
    title: subItem.title,
    name: subItem.name
  }
  const exists = tagStore.state.tags.some(tag => tag.name === newTag.name);
  if (exists) {
    return;
  }
  tagStore.state.tags.push(newTag);
}
</script>

<style scoped lang="scss">
.dashboard-menu {
  .collapse-button {
    display: flex;

    .el-button {
      margin-left: auto;
      border-style: none;
    }
  }

  .el-menu {
    border-right: none;
    --el-menu-item-height: 52px;
    --el-menu-sub-item-height: 44px;
  }

  .el-popper {
    .el-menu-item {
      height: 44px;
      width: 140px;
    }
  }
}

.collapsed .dashboard-menu .collapse-button .el-button {
  margin-right: auto;
}
</style>

<style lang="scss">
.el-menu--popup {
  min-width: 140px;
}
</style>
