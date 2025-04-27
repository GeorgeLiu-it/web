<template>
  <div class="index">
    <el-container class="main-content">
      <div class="container">
        <el-main>
          <article-list/>
        </el-main>
        <el-aside>
          <calendar/>
          <profile-card/>
          <!-- <feedback/> -->
        </el-aside>
      </div>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import ArticleList from "@/components/pages/ArticleList.vue";
import Calendar from "@/components/pages/Calendar.vue";
import ProfileCard from "@/components/pages/ProfileCard.vue";
// import Feedback from "@/components/pages/Feedback.vue";
</script>

<style scoped lang="scss">
.index {
  padding: 0px;
  
  .main-content {
    display: flex;
    justify-content: center;

    .container {
      display: flex;
      max-width: 1400px;
      width: 100%;

      .el-main {
        width: 70%;
        padding: 0;
      }

      .el-aside {
        width: 30%;
        padding: 0;
        padding-left: 18px;
      }
    }
  }
}
</style>
