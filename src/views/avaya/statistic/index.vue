<template>
  <el-card class="statistic">
    <template #header>
      <div class="card-header">
        <el-icon><Notebook /></el-icon>
        <span class="statistic">Prioritize List</span>
      </div>
    </template>
    <div class="table">
      <ticket-statistic/>
    </div>
    <!-- <template #footer>Footer content</template> -->
  </el-card>
</template>
<script setup lang="ts">
  import TicketStatistic from "@/components/table/TicketStatistic.vue";
</script>
<style scoped lang="scss">
  .statistic {
    height: auto;

    .card-header {
      margin-left: 10px;
      font-size: 32px;

      .statistic {
        margin-left: 10px;
        font-size: 28px;
        vertical-align: top;
      }
    }
    
    .table {
      height: auto;
    }
  }
</style>