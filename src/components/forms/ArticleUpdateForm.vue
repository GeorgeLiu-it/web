<template>
  <div class="article-update-form">
    <el-form
        :model="articleUpdateFormData"
        :validate-on-rule-change="false"
        label-width="15%"
        label-position="left"
    >
      <el-form-item label="Title" prop="title">
        <el-input
            v-model="articleUpdateFormData.title"
            size="large"
            placeholder="Please input title"
        />
      </el-form-item>
      <el-form-item label="Category" prop="category">
        <el-input
            v-model="articleUpdateFormData.category"
            size="large"
            placeholder="Please input category"
        />
      </el-form-item>
      <el-form-item label="Tags" prop="tags">
        <el-tag v-for="tag in articleUpdateFormData.tags"
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
            v-model="articleUpdateFormData.abstract"
            type="textarea"
            placeholder="Please input abstract"
        />
      </el-form-item>

      <el-form-item label="Content" prop="content">
        <el-button @click="drawer = true" icon="EditPen">Edit Content</el-button>
          <el-drawer v-model="drawer" :direction="direction" size="80%">
            <template #header>
              Edit Content
            </template>
            <template #default>
              <MdEditor v-model="articleUpdateFormData.content" @onUploadImg="onUploadImg"/>
            </template>
            <template #footer>
              <el-text>Click the X above or anywhere outside to exit editing</el-text>
            </template>
          </el-drawer>
      </el-form-item>

      <el-form-item>
        <div class="button-group">
          <el-button
              type="primary"
              size="large"
              @click="submitForm"
          >Confirm
          </el-button>
          <el-button
              size="large"
              @click="layoutStore.state.articleUpdateVisible = false"
          >Cancel
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {defineProps, nextTick, reactive, ref} from "vue";
import {type DrawerProps, ElMessage, type InputInstance} from "element-plus";
import {type Article, articleUpdate, type ArticleUpdateRequest} from "@/api/article";
import type {ApiResponse} from "@/utils/request";
import type {ImageUploadResponse} from "@/api/image";
import {useUserStore} from "@/stores/user";
import {useLayoutStore} from "@/stores/layout";
import type {Hit} from "@/api/common";
import {MdEditor} from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import axios, {type AxiosResponse} from "axios";

const props = defineProps<{
  article: Hit<Article>;
}>();

const userStore = useUserStore()
const layoutStore = useLayoutStore()

const path = ref(import.meta.env.VITE_BASE_API)

const articleUpdateFormData = reactive<ArticleUpdateRequest>({
  id: props.article._id,
  cover: props.article._source.cover,
  title: props.article._source.title,
  category: props.article._source.category,
  tags: props.article._source.tags,
  abstract: props.article._source.abstract,
  content: props.article._source.content,
})

const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref<InputInstance>()

const handleClose = (tag: string) => {
  articleUpdateFormData.tags.splice(articleUpdateFormData.tags.indexOf(tag), 1)
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    articleUpdateFormData.tags.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

const handleSuccess = (res: ApiResponse<ImageUploadResponse>) => {
  if (res.code === 0) {
    articleUpdateFormData.cover = res.data.url
    ElMessage.success(res.msg)
  }
}

const drawer = ref(false)
const direction = ref<DrawerProps['direction']>('rtl')

const onUploadImg = async (files: File[], callback: (urls: string[]) => void): Promise<void> => {
  const res = await Promise.all(
      files.map((file) => {
        return new Promise<AxiosResponse<ApiResponse<ImageUploadResponse>>>((resolve, reject) => {
          const form = new FormData();
          form.append('image', file);

          axios
              .post('/api/image/upload', form, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
              })
              .then((response) => resolve(response))
              .catch((error) => reject(error));
        });
      })
  );

  callback(res.map((item) => item.data.data.url));
};

const submitForm = async () => {
  const res = await articleUpdate(articleUpdateFormData)
  if (res.code === 0) {
    ElMessage.success(res.msg)
    layoutStore.state.articleUpdateVisible = false
  }
}
</script>

<style scoped lang="scss">
.article-update-form {
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

.el-drawer{
  .md-editor .md-editor-toolbar-wrapper .md-editor-toolbar svg.md-editor-icon {
    height: 24px;
    width: 24px;
  }
}
</style>
