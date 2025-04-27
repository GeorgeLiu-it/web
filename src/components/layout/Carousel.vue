<template>
  <div class="carousel">
    <el-carousel trigger="click" height="60px">
      <el-carousel-item v-for="item in txtList" :key="item" class="carousel-item">
        <el-text class="carousel-text" type="info">{{ item }}</el-text>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>


<script setup lang="ts">
import {ref} from "vue";
import {websiteCarousel} from "@/api/website";

const txtList = ref<string[]>([
  'Welcome to YONOP',
  'Enjoy the static data',
  'Collect your information',
])

// const getWebsiteCarousel = async () => {
//   const res = await websiteCarousel()
//   if (res.code === 0 && res.data.length !== 0) {
//     imgList.value = res.data
//   }
// }

// getWebsiteCarousel()
</script>

<style lang="scss" scoped>
.carousel {
  display: flex;
  justify-content: center;

  .el-carousel {
    width: 95%;
    margin-bottom: 20px;
  }

  .carousel-item {
    background-color: #1877af; // Dark green
    display: flex;
    align-items: center;
    justify-content: center;

    .carousel-text {
      color: white;
      font-size: 20px;
    }
  }
}
</style>
