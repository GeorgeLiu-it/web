<template>
  <el-card class="calendar">
    <el-row class="title" calendarInfo>Calendar</el-row>
    <el-row class="info-row" :gutter="10">
      <el-col :span="6" class="label">Time:</el-col>
      <el-col :span="18" class="value">{{ calendarInfo.date }} {{ currentTime }}</el-col>
    </el-row>
    <el-row class="info-row" :gutter="10">
      <el-col :span="6" class="label">Lunar:</el-col>
      <el-col :span="18" class="value">{{ calendarInfo.lunar_date }}</el-col>
    </el-row>
    <el-row class="info-row" :gutter="10">
      <el-col :span="6" class="label">Solar:</el-col>
      <el-col :span="18" class="value">{{ calendarInfo.solar_term }}</el-col>
    </el-row>

    <el-row class="info-row" :gutter="10">
      <el-col :span="6" class="label">Good:</el-col>
      <el-col :span="18" class="value">{{ calendarInfo.auspicious }}</el-col>
    </el-row>

    <el-row class="info-row" :gutter="10">
      <el-col :span="6" class="label">Bad:</el-col>
      <el-col :span="18" class="value">{{ calendarInfo.inauspicious }}</el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import {onUnmounted, ref} from "vue";
import {websiteCalendar, type WebsiteCalendarResponse} from "@/api/website";

const calendarInfo = ref<WebsiteCalendarResponse>({
  date: '',
  lunar_date: '',
  ganzhi: '',
  zodiac: '',
  day_of_year: '',
  solar_term: '',
  auspicious: '',
  inauspicious: '',
})

let timerId: number | null = null
const currentTime = ref('')

function updateCurrentTime() {
  currentTime.value = new Date().toLocaleTimeString()
}

function initializeTimer() {
  updateCurrentTime()
  timerId = setInterval(updateCurrentTime, 1000)
}

onUnmounted(() => {
  clearInterval(timerId as number)
})

initializeTimer()

const getCalendarInfo = async () => {
  const res = await websiteCalendar()
  if (res.code == 0) {
    calendarInfo.value = res.data
  }
}
getCalendarInfo()
</script>

<style scoped lang="scss">
.calendar {
  margin-bottom: 20px;

  .title {
    font-size: 24px;
    margin-bottom: 10px;
  }

  .label {
    font-size: auto;
    font-weight: bold;
  }
}
</style>
