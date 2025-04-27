<template>
  <div class="article-create-form">
    <el-form
        :model="articleCreateFormData"
        :validate-on-rule-change="false"
        label-width="15%"
        label-position="left"
    >
      <el-form-item label="Title" prop="title">
        <el-input
            v-model="articleCreateFormData.title"
            size="large"
            placeholder="Please input title"
        />
      </el-form-item>
      <el-form-item label="Category" prop="category">
        <el-input
            v-model="articleCreateFormData.category"
            size="large"
            placeholder="Please input category "
        />
      </el-form-item>
      <el-form-item label="Tags" prop="tags">
        <el-tag v-for="tag in articleCreateFormData.tags"
                :key="tag"
                closable
                :disable-transitions="false"
                size="large"
                @close="handleClose(tag)">
          {{ tag }}
        </el-tag>
        <el-input
            v-if="inputVisible"
            ref="InputRef"
            v-model="inputValue"
            style="width: 80px"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
        />
        <el-button v-else @click="showInput">
          <el-icon><Plus /></el-icon>
        </el-button>
      </el-form-item>
      <el-form-item label="Abstract" prop="abstract">
        <el-input
            v-model="articleCreateFormData.abstract"
            type="textarea"
            placeholder="Please input abstract"
        />
      </el-form-item>
      <el-form-item>
        <div class="button-group">
          <el-button
              type="primary"
              size="large"
              @click="submitForm"
          >Publish
          </el-button>
          <el-button
              size="large"
              @click="layoutStore.state.articleCreateVisible = false"
          >Cancel
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {defineProps, nextTick, reactive, ref} from "vue";
import {ElMessage, type InputInstance} from "element-plus";
import {articleCreate, type ArticleCreateRequest} from "@/api/article";
import type {ApiResponse} from "@/utils/request";
import type {ImageUploadResponse} from "@/api/image";
import {useUserStore} from "@/stores/user";
import {useLayoutStore} from "@/stores/layout";
import { Plus } from '@element-plus/icons-vue';

const props = defineProps<{
  title: string;
  content: string;
}>();

const userStore = useUserStore()
const layoutStore = useLayoutStore()

const path = ref(import.meta.env.VITE_BASE_API)

const articleCreateFormData = reactive<ArticleCreateRequest>({
  cover: '',
  title: props.title,
  category: '',
  tags: [],
  abstract: '',
  content: props.content,
})

const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref<InputInstance>()

const handleClose = (tag: string) => {
  articleCreateFormData.tags.splice(articleCreateFormData.tags.indexOf(tag), 1)
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    articleCreateFormData.tags.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

const handleSuccess = (res: ApiResponse<ImageUploadResponse>) => {
  if (res.code === 0) {
    articleCreateFormData.cover = res.data.url
    ElMessage.success(res.msg)
  }
}


const submitForm = async () => {
  const res = await articleCreate(articleCreateFormData)
  if (res.code === 0) {
    ElMessage.success(res.msg)
    layoutStore.state.articleCreateVisible = false
  }
}
</script>

<style scoped lang="scss">
.article-create-form {
  .el-form {
    .el-form-item {
      .el-image {
        height: 120px;
      }

      .upload-content {
        display: flex;
        height: 120px;

        .container {
          margin: auto;

          .upload-filled {
            height: 32px;
            width: 32px;
          }
        }
      }

      .button-group {
        margin-left: auto;
      }
    }
  }
}
</style>

<style lang="scss">
.el-upload {
  --el-upload-dragger-padding-horizontal: 0px;
  --el-upload-dragger-padding-vertical: 0px;
  line-height: 0;
}
</style>
