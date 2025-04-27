<template>
    <el-button @click="resetDateFilter">reset date filter</el-button>
    <el-button @click="clearFilter">reset all filters</el-button>
    <el-table ref="tableRef" row-key="date" :data="priorityList" style="width: 100%">
      <el-table-column
        prop="updated_at"
        label="updated_at"
        sortable
        width="180"
        column-key="date"
        :filters="[
          { text: '2016-05-01', value: '2016-05-01' },
          { text: '2016-05-02', value: '2016-05-02' },
          { text: '2016-05-03', value: '2016-05-03' },
          { text: '2016-05-04', value: '2016-05-04' },
          { text: '2016-05-05', value: '2016-05-05' },
        ]"
        :filter-method="filterHandler"
      />
      <el-table-column prop="siebel_number" label="siebel_number" width="180" />
      <el-table-column prop="severity" label="severity" />
      <!-- <el-table-column prop="severity" label="severity" :formatter="formatter" /> -->
  
      <el-table-column
        prop="status"
        label="status"
        width="100"
        :filters="[
          { text: 'Home', value: 'Home' },
          { text: 'Office', value: 'Office' },
          { text: 'Other', value: 'Other' },
        ]"
        :filter-method="filterTag"
        filter-placement="bottom-end"
      >
        <template #default="scope">
          <el-tag
            :type="scope.row.status === 'Closed' ? 'primary' : 'success'"
            disable-transitions
            >{{ scope.row.status }}</el-tag
          >
        </template>
      </el-table-column>

    </el-table>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  import type { TableColumnCtx, TableInstance } from 'element-plus'
  import { type statistic, prioritizeList } from "@/api/statistic";
  
  const priorityList = ref<statistic[]>([])

  const getPriorityList = async () => {
  const res = await prioritizeList()
    if (res.code === 0) {
      res.data.forEach((item) => {
        priorityList.value.push(item)
      })
    }
  }

  getPriorityList()

  interface UserTest {
    date: string
    name: string
    address: string
    tag: string
    [key: string]: any;
  }
  
  const tableRef = ref<TableInstance>()
  
  const resetDateFilter = () => {
    tableRef.value!.clearFilter(['date'])
  }
  const clearFilter = () => {
    tableRef.value!.clearFilter()
  }
  const formatter = (row: UserTest, column: TableColumnCtx<UserTest>) => {
    return row.address
  }
  const filterTag = (value: string, row: UserTest) => {
    return row.tag === value
  }
  const filterHandler = (
    value: string,
    row: UserTest,
    column: TableColumnCtx<UserTest>
  ) => {
    const property = column['property']
    return row[property] === value
  }
  
  const tableData: UserTest[] = [
    {
      date: '2016-05-03',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
      tag: 'Home',
      nameA: 'na1',
    },
    {
      date: '2016-05-02',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
      tag: 'Office',
      nameA: 'na2',
    },
    {
      date: '2016-05-04',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
      tag: 'Home',
      nameA: 'na3',
    },
    {
      date: '2016-05-01',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
      tag: 'Office',
      nameA: 'na4',
    },
    {
      date: '2016-05-05',
      name: 'Jet',
      address: 'No. 189, Grove St, Los Angeles',
      tag: 'Office',
      nameA: 'na5',
    },
  ]
  </script>
  