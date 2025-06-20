<template>
  <div class="user-info">
    <el-col :span="12">
      <div class="info">
        <div class="title">
          <el-row>User Information</el-row>
        </div>
        <div class="content">
          <el-form
              ref="userChangeInfoForm"
              :model="userChangeInfoFormData"
              :rules="rules"
              :validate-on-rule-change="false"
              hide-required-asterisk
              label-width="auto"
              style="max-width: 400px"
          >
            <el-form-item label="Profile">
              <el-image :src="userInfo.avatar" alt=""/>
            </el-form-item>
            <el-form-item label="uuid">
              {{ userInfo.uuid }}
            </el-form-item>
            <el-form-item label="Username" prop="username">
              <el-input @change="updateUserInfo" v-model="userChangeInfoFormData.username"/>
            </el-form-item>
            <el-form-item label="Address" prop="address">
              <el-input @change="updateUserInfo" v-model="userChangeInfoFormData.address"/>
            </el-form-item>
            <el-form-item label="Signature" prop="signature">
              <el-input @change="updateUserInfo" v-model="userChangeInfoFormData.signature" type="textarea" :rows="2"/>
            </el-form-item>
            <el-form-item label="Email">
              {{ userInfo.email }}
            </el-form-item>
            <el-form-item label="Privilege">
              {{ userInfo.role_id === 1 ? "User" : "Administrator" }}
            </el-form-item>
            <el-form-item label="Register method">
              {{ userInfo.register }}
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="operation" v-if="userStore.state.userInfo.register==='Email'">
        <div class="title">
          <el-row>Action</el-row>
        </div>
        <div class="content">
          <el-button @click="layoutStore.state.passwordResetVisible = true">Change pwd</el-button>
        </div>
        <el-dialog
            v-model="passwordResetVisible"
            width="500"
            align-center
            destroy-on-close
            :before-close="passwordResetVisibleSynchronization"
        >
          <template #header>
            Change pwd
          </template>
          <password-reset-form/>
          <template #footer>
          </template>
        </el-dialog>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="card">
        <div class="title">
          <el-row>User Card</el-row>
        </div>
      </div>
      <div class="content">
        <user-card :key="cardKey" :uuid="userInfo.uuid" :user-card-info="null"/>
      </div>
    </el-col>
  </div>
</template>

<script setup lang="ts">
import {useUserStore} from "@/stores/user";
import {reactive, ref, watch} from "vue";
import {userChangeInfo, type UserChangeInfoRequest} from "@/api/user";
import type {FormInstance, FormRules} from "element-plus";
import UserCard from "@/components/widgets/UserCard.vue";
import {useLayoutStore} from "@/stores/layout";
import PasswordResetForm from "@/components/forms/PasswordResetForm.vue";

const userStore = useUserStore()
const layoutStore = useLayoutStore()

const userInfo = ref(userStore.state.userInfo)

const userChangeInfoForm = ref<FormInstance>()

const userChangeInfoFormData = reactive<UserChangeInfoRequest>({
  username: userInfo.value.username,
  address: userInfo.value.address,
  signature: userInfo.value.signature,
})

const rules = reactive<FormRules<UserChangeInfoRequest>>({
  username: [{
    required:true,
    max:20,
    trigger:'blur',
    message:'Length should be less than 20'
  }],
  address: [{
    max: 200,
    trigger: 'blur',
    message:'Length should be less than 200'
  }],
  signature: [{
    max: 320,
    trigger: 'blur',
    message:'Length should be less than 320'
  }]
})

const cardKey = ref(0)

const updateUserInfo = async () => {
  const isValid: boolean = await new Promise((resolve) => {
    userChangeInfoForm.value?.validate((valid: boolean) => {
      resolve(valid)
    })
  })

  if (isValid) {
    const res = await userChangeInfo(userChangeInfoFormData)
    if (res.code === 0) {
      cardKey.value += 1
    }
  }
}

const passwordResetVisible = ref(layoutStore.state.passwordResetVisible)
watch(
    () => layoutStore.state.passwordResetVisible,
    (newValue) => {
      passwordResetVisible.value = newValue
    }
)

const passwordResetVisibleSynchronization = () => {
  layoutStore.state.passwordResetVisible = false
}
</script>

<style scoped lang="scss">
.user-info {
  display: flex;

  .info {
    .title {
      border-left: 5px solid blue;
      padding-left: 10px;
    }

    .content {
      margin: 20px;

      .el-form {
        .el-form-item {
          .el-image {
            height: 50px;
            width: 50px;
          }
        }
      }
    }
  }

  .operation {
    .title {
      border-left: 5px solid blue;
      padding-left: 10px;
    }

    .content {
      margin: 20px;
    }
  }

  .card {
    .title {
      border-left: 5px solid blue;
      padding-left: 10px;
    }

    .content {
      margin: 20px;
    }
  }
}
</style>
