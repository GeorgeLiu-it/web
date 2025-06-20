<template>
  <div class="article-list">
    <div class="title">
      <el-row>Article List</el-row>
      <el-button-group>
        <el-button type="success" icon="Plus" @click="handleToPublishArticle">
          New
        </el-button>

        <el-button type="danger" icon="Delete" @click="articleBulkDeleteVisible = true;handleIdsToDelete()">
          Batch delete
        </el-button>

        <el-dialog
            v-model="articleBulkDeleteVisible"
            width="500"
            align-center
            destroy-on-close
        >
          <template #header>
            Delete
          </template>
          Selected [{{ idsToDelete.length }}], please confirm your action？
          <template #footer>
            <el-button type="primary" @click="handleBulkDelete(idsToDelete)">
              Confirm
            </el-button>
            <el-button @click="articleBulkDeleteVisible = false">Cancel</el-button>
          </template>
        </el-dialog>
      </el-button-group>
    </div>

    <div class="article-list-request">
      <el-form :inline="true" :model="articleListRequest">
        <el-form-item label="Title">
          <el-input v-model="articleListRequest.title" placeholder="Please input title" clearable/>
        </el-form-item>
        <el-form-item label="Category">
          <el-input v-model="articleListRequest.category" placeholder="Please input category" clearable/>
        </el-form-item>
        <el-form-item label="Abstract">
          <el-input v-model="articleListRequest.abstract" placeholder="Please input abstract" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="getArticleTableData">Search</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
        ref="multipleArticleTableRef"
        :data="articleTableData"
    >
      <el-table-column type="selection" width="60"/>
      <!-- <el-table-column label="封面" width="100">
        <template #default="scope:{ row: Hit<Article>, column: any, $index: number }">
          <el-image :src="scope.row._source.cover" alt=""/>
        </template>
      </el-table-column> -->
      <el-table-column prop="_source.title" label="Title" width="120"/>
      <el-table-column prop="_source.category" label="Category" width="90"/>
      <el-table-column label="Tag" width="120">
        <template #default="scope:{ row: Hit<Article>, column: any, $index: number }">
          <el-tag v-for="tag in scope.row._source.tags">{{ tag }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Brief">
        <template #default="scope:{ row: Hit<Article>, column: any, $index: number }">
          <el-text line-clamp="5">{{ scope.row._source.abstract }}</el-text>
        </template>
      </el-table-column>
      <el-table-column prop="_source.created_at" label="Publish Time" width="115"/>
      <el-table-column label="ID" width="220">
        <template #default="scope:{ row: Hit<Article>, column: any, $index: number }">
          <el-link :href="'/article/'+scope.row._id">{{ scope.row._id }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="Action" width="181">
        <template #default="scope:{ row: any, column: any, $index: number }">
          <el-button
              type="warning"
              @click="layoutStore.state.articleUpdateVisible=true;articleInfo=scope.row"
          >
            Modify
          </el-button>
          <el-button
              type="danger"
              @click="articleDeleteVisible=true;articleInfo=scope.row"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
        v-model="articleUpdateVisible"
        width="500"
        align-center
        destroy-on-close
        :before-close="articleUpdateVisibleSynchronization"
    >
      <template #header>
        Modify
      </template>
      <article-update-form :article=articleInfo />
      <template #footer>
      </template>
    </el-dialog>

    <el-dialog
        v-model="articleDeleteVisible"
        width="500"
        align-center
        destroy-on-close
    >
      <template #header>
        Delete
      </template>
      Selected [1], please confirm your action?
      <template #footer>
        <el-button type="primary" @click="handleDelete(articleInfo._id)">
          Confirm
        </el-button>
        <el-button @click="articleDeleteVisible = false">Cancel</el-button>
      </template>
    </el-dialog>

    <el-pagination
        :current-page="page"
        :page-size="page_size"
        :page-sizes="[10, 30, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
import {nextTick, onMounted, reactive, ref, watch} from "vue";
import {
  type Article,
  articleDelete, type ArticleDeleteRequest,
  articleList,
  type ArticleListRequest
} from "@/api/article";
import {useLayoutStore} from "@/stores/layout";
import {ElMessage} from "element-plus";
import {useRoute, useRouter} from "vue-router";
import ArticleUpdateForm from "@/components/forms/ArticleUpdateForm.vue";
import type {Hit} from "@/api/common";
import {type Tag, useTagStore} from "@/stores/tag";


const multipleArticleTableRef = ref()
const articleTableData = ref<Hit<Article>[]>()
const page = ref(1)
const page_size = ref(10)
const total = ref(0)

const tagStore = useTagStore()

const handleToPublishArticle = () => {
  const newTag: Tag = {
    title: "Publish",
    name: "article-publish"
  }
  const exists = tagStore.state.tags.some(tag => tag.name === newTag.name);
  if (exists) {
    return;
  }
  tagStore.state.tags.push(newTag);
  router.push({name:'article-publish'})
}

const layoutStore = useLayoutStore()

const articleBulkDeleteVisible = ref(false)
let idsToDelete: string[]

const handleIdsToDelete = () => {
  idsToDelete = []

  const rows: Hit<Article>[] = multipleArticleTableRef.value.getSelectionRows()
  rows.forEach(row => {
    idsToDelete.push(row._id)
  })
}

const handleBulkDelete = async (ids: string[]) => {
  const requestData: ArticleDeleteRequest = {
    ids: ids
  }
  const res = await articleDelete(requestData)
  if (res.code === 0) {
    ElMessage.success(res.msg)
  }
  articleBulkDeleteVisible.value = false
  layoutStore.state.shouldRefreshArticleTable = true
}

const articleListRequest = reactive<ArticleListRequest>({
  title: null,
  category: null,
  abstract: null,
  page: 1,
  page_size: 10,
})

const route = useRoute()
const router = useRouter()

onMounted(() => {
  articleListRequest.title = route.query.title as string || null
  articleListRequest.category = route.query.category as string || null
  articleListRequest.abstract = route.query.abstract as string || null
  page.value = Number(route.query.page) || 1
  page_size.value = Number(route.query.page_size) || 10
})

const getArticleTableData = async () => {
  if (articleListRequest.title === "") {
    articleListRequest.title = null
  }
  if (articleListRequest.category === "") {
    articleListRequest.category = null
  }
  if (articleListRequest.abstract === "") {
    articleListRequest.abstract = null
  }

  articleListRequest.page = page.value
  articleListRequest.page_size = page_size.value

  const table = await articleList(articleListRequest)

  if (table.code === 0) {
    articleTableData.value = table.data.list
    total.value = table.data.total

    await router.push({
      path: router.currentRoute.value.path,
      query: {
        title: articleListRequest.title,
        category: articleListRequest.category,
        abstract: articleListRequest.abstract,
        page: articleListRequest.page,
        page_size: articleListRequest.page_size,
      },
    })
  }
}

watch(() => route.query, (newQuery) => {
  articleListRequest.title = newQuery.title as string || null
  articleListRequest.category = newQuery.category as string || null
  articleListRequest.abstract = newQuery.abstract as string || null
  articleListRequest.page = Number(newQuery.page) || 1
  articleListRequest.page_size = Number(newQuery.page_size) || 10
}, {immediate: true})

nextTick(() => {
  getArticleTableData()
})

let articleInfo: Hit<Article>
const articleDeleteVisible = ref(false)

const articleUpdateVisible = ref(layoutStore.state.articleUpdateVisible)
watch(
    () => layoutStore.state.articleUpdateVisible,
    (newValue) => {
      articleUpdateVisible.value = newValue
    }
)

const articleUpdateVisibleSynchronization = () => {
  layoutStore.state.articleUpdateVisible = false
}

const handleDelete = async (id: string) => {
  let ids: string[] = []
  ids.push(id)

  const requestData: ArticleDeleteRequest = {
    ids: ids
  }

  const res = await articleDelete(requestData)
  if (res.code === 0) {
    ElMessage.success(res.msg)
  }
  articleDeleteVisible.value = false
  layoutStore.state.shouldRefreshArticleTable = true
}

watch(() => layoutStore.state.shouldRefreshArticleTable, (newVal) => {
  if (newVal) {
    getArticleTableData()
    layoutStore.state.shouldRefreshArticleTable = false
  }
})

const handleSizeChange = (val: number) => {
  page_size.value = val
  getArticleTableData()
}

const handleCurrentChange = (val: number) => {
  page.value = val
  getArticleTableData()
}
</script>

<style scoped lang="scss">
.article-list {
  .title {
    display: flex;

    .el-row {
      font-size: 24px;
    }

    .el-button-group {
      margin-left: auto;
      margin-top: auto;
      margin-bottom: auto;

      .el-button {
        margin-left: 32px;
      }
    }
  }

  .article-list-request {
    border: 1px solid #DCDFE6;
    padding-top: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
    padding-left: 20px;
    display: flex;

    .el-form {
      margin-left: auto;
    }
  }

  .el-table {
    border: 1px solid #DCDFE6;

    .el-image {
      height: 48px;
    }
  }

  .el-pagination {
    display: flex;
    justify-content: center;
  }
}
</style>
