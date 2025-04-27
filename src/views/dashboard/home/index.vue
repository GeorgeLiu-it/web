<template xmlns="http://www.w3.org/1999/html">
  <div class="home">
    <div class="header">
      <el-card class="user-card">
        <el-row>
          Hello {{ userStore.state.userInfo.username }}, "Stay Hungry, Stay Foolish"
        </el-row>
      </el-card>
    </div>

    <div class="content">
        <el-card class="entrance-card">
          <el-row class="title">
            Quick Access
          </el-row>
          <div class="button-group">
            <div class="button-item" v-for="item in entranceList">
              <el-button :icon="item.icon" :type="item.type" plain @click="handleClick(item)"/>
              {{ item.title }}
            </div>
          </div>
        </el-card>
        <el-card class="chart-card">
          <el-row class="title">
            User Data
          </el-row>
          <div class="time-select">
            <el-select
                @change="getChartInfo"
                v-model="userChartRequest.date"
                placeholder="Select"
                style="width: 200px"
            >
              <el-option
                  v-for="item in userChartOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </div>
          <user-activity-chart v-if="isShow" :chart="chart"/>
        </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useUserStore} from "@/stores/user";
import {ref} from "vue";
import {userChart, type UserChartRequest, type UserChartResponse} from "@/api/user";
import UserActivityChart from "@/components/widgets/UserActivityChart.vue";
import {useWebsiteStore} from "@/stores/website";
import router from "@/router";
import {type Tag, useTagStore} from "@/stores/tag";

const userStore = useUserStore()

interface Entrance {
  title: string
  name: string;
  icon: string;
  type: string;
}

const entranceList: Entrance[] = [
  {
    title: 'Information',
    name: 'user-info',
    icon: 'Postcard',
    type: 'primary',
  },
  {
    title: 'Like & Star',
    name: 'user-star',
    icon: 'Star',
    type: 'warning',
  },
  {
    title: 'Comments',
    name: 'user-comment',
    icon: 'ChatDotRound',
    type: 'info',
  },
  {
    title: 'Feedback',
    name: 'user-feedback',
    icon: 'Message',
    type: 'success',
  }
]

const tagStore = useTagStore()

function handleClick(item: Entrance) {
  const newTag: Tag = {
    title: item.title,
    name: item.name
  }
  const exists = tagStore.state.tags.some(tag => tag.name === newTag.name);
  if (exists) {
    return;
  }
  tagStore.state.tags.push(newTag);
  router.push({name:item.name})
}

const userChartRequest = ref<UserChartRequest>({
  date: 7,
})

const userChartOptions = [
  {
    value: 7,
    label: '七天',
  },
  {
    value: 30,
    label: '一个月',
  },
  {
    value: 90,
    label: '三个月',
  },
  {
    value: 180,
    label: '六个月',
  },
  {
    value: 365,
    label: '一年',
  },
]

const chart = ref<UserChartResponse>(
    {
      date_list: [],
      login_data: [],
      register_data: [],
    }
)

const isShow = ref(false)

const getChartInfo = async () => {
  isShow.value = false
  const res = await userChart(userChartRequest.value)
  if (res.code === 0) {
    chart.value = res.data
    isShow.value = true
  }
}

getChartInfo()

</script>

<style scoped lang="scss">
.home {
  .header {
    margin-bottom: 20px;

    .user-card {
      .el-row {
        font-size: 32px;
      }

    }
  }

  .content {
    display: block;

    .entrance-card {
      margin-bottom: 20px;

      .title {
        font-size: 24px;
      }

      .button-group {
        display: flex;
        margin-top: 20px;
        margin-bottom: 20px;

        .button-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 80px;
          margin: 10px;

          .el-button {
            border: none;
            --el-font-size-base: 32px;
            height: 62px;
            background-color: transparent;
          }
        }
      }
    }

    .chart-card {
      .title {
        font-size: 24px;
      }

      .time-select {
        display: flex;
        margin-top: 20px;
        margin-bottom: 40px;

        .el-select {
          margin-left: auto;
        }
      }

      .user-activity-chart {
        position: relative;
      }
    }

    .aside {
      margin-left: 20px;
      height: 100%;

      .title {
        font-size: 24px;
      }

      .text {
        margin-top: 20px;
      }
    }
  }
}
</style>
