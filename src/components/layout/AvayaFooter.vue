<template>
  <div class="web-footer">
    <div class="footer-top">
      <el-image
          :src="websiteStore.state.websiteInfo.full_logo===''?'/image/avaya/avaya-red-logo.jpeg':websiteStore.state.websiteInfo.full_logo"
          alt="Avaya Red Logo"/>
      <div class="line"></div>
    </div>
    <div class="footer-bottom">
      <div class="info-box">
        <el-text>Author: {{ websiteStore.state.websiteInfo.name }}</el-text>
        <el-text>Running: {{ elapsedTime }}</el-text>
        <div class="version">
          <el-tag type="primary" size="large">version</el-tag>
          <el-tag type="info" size="large">{{ websiteStore.state.websiteInfo.version }}</el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useWebsiteStore} from "@/stores/website";
import {ref} from "vue";
import {onUnmounted} from "vue";

const websiteStore = useWebsiteStore()

let timerId: number | null = null;
const elapsedTime = ref("");

function updateElapsedTime() {
  let creationDate = websiteStore.state.websiteInfo.created_at;
  if (creationDate) {
    let creationTimestamp = new Date(creationDate).getTime();
    let currentTimestamp = new Date().getTime();

    let totalDays = (currentTimestamp - creationTimestamp) / 1000 / (60 * 60 * 24);
    let daysPassed = Math.floor(totalDays);
    let hoursRemaining = Math.floor((totalDays - daysPassed) * 24);
    let minutesRemaining = Math.floor((totalDays - daysPassed - (hoursRemaining / 24)) * 24 * 60);
    let secondsRemaining = Math.floor((totalDays - daysPassed - (hoursRemaining / 24) - (minutesRemaining / 24 / 60)) * 24 * 60 * 60);

    elapsedTime.value = `${daysPassed}天${hoursRemaining}时${minutesRemaining}分${secondsRemaining}秒`;
  }
}

function initializeTimer() {
  updateElapsedTime();
  timerId = setInterval(updateElapsedTime, 1000);
}

onUnmounted(() => {
  clearInterval(timerId as number);
});

initializeTimer();

</script>


<style scoped lang="scss">
.web-footer {
  padding: 20px;
  background-color: white;
  display: block;

  .footer-top {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .el-image {
      width: 100px; 
      height: auto;
      margin-right: 10px;
    }

    .line {
      flex-grow: 1;
      height: 1px;
      width: 1000px;
      background-color: #DCDFE6; 
    }
  }

  .footer-bottom {
    display: flex;
    justify-content: flex-end;

    .info-box {
      width: auto; 
      text-align: left; 

      .el-text {
        display: block;
        margin: auto;
      }
    }

  }

}
</style>
