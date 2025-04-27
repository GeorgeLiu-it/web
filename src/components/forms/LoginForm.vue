<template>
  <div class="login-form">
    <el-image class="login-image" src="/image/avaya/nezha.png" alt=""/>
    <el-form
        ref="loginForm"
        :model="loginFormData"
        :rules="rules"
        :validate-on-rule-change="false"
        hide-required-asterisk
        @keyup.enter="submitForm"
        label-width="70px"
        label-position="left"
    >
      <el-form-item label="Eamil" prop="email">
        <el-input
            v-model="loginFormData.email"
            size="large"
            placeholder="Your email address"
            suffix-icon="user"
        />
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input
            v-model="loginFormData.password"
            show-password
            size="large"
            type="password"
            placeholder="Your Password"
        />
      </el-form-item>
      <el-form-item label="Captcha" prop="captcha">
        <div class="captcha">
          <el-input
              v-model="loginFormData.captcha"
              placeholder="No need to input"
              size="large"
          />
          <el-image :src="picPath" alt="" @click="loginVerify"/>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="button-wrapper">
          <el-button
              type="primary"
              size="large"
              @click="submitForm"
          >Login
          </el-button>
      </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref,} from "vue";
import type {LoginRequest} from "@/api/user";
import {useUserStore} from "@/stores/user";
import {captcha} from "@/api/base";
import type {FormInstance, FormRules} from 'element-plus';
import {useLayoutStore} from "@/stores/layout";

const loginForm = ref<FormInstance>()

const loginFormData = reactive<LoginRequest>({
  email: "",
  password: "",
  captcha: "",
  captcha_id: "",
})

const rules = reactive<FormRules<LoginRequest>>({
  email: [{
    required: true,
    type: 'email',
    trigger: 'blur',
    message: 'Please check your email format'
  }],
  password: [{
    required: true,
    min: 8,
    max: 20,
    trigger: 'blur',
    message: 'Please ensure the length between 8 and 20'
  }],
  captcha: [{
    required: false,
    len: 6,
    trigger: 'blur',
    message: 'Please input verification code'
  }],
})

const userStore = useUserStore()
const layoutStore = useLayoutStore()

const picPath = ref('')

const loginVerify = () => {
  captcha().then(async (res) => {
    picPath.value = res.data.pic_path
    loginFormData.captcha_id = res.data.captcha_id
  })
}

loginVerify()

const submitForm = async () => {
  const isValid: boolean = await new Promise((resolve) => {
    loginForm.value?.validate((valid: boolean) => {
      resolve(valid)
    })
  })

  if (isValid) {
    const flag = await userStore.loginIn(loginFormData)

    if (!flag) {
      loginVerify()
    } else {
      layoutStore.state.loginVisible = false
      layoutStore.state.popoverVisible = false
    }
  }
  loginVerify()
  return false
}
</script>


<style scoped lang="scss">
.login-form {
  display: flex;
  

  .login-image {
    display: block;
    width: 225px;
    height: 100%;
    margin-right: 10px;
  }

  .el-form {
    .captcha {
      display: flex;
    }

    .button-wrapper {
      text-align: end;
      justify-content: flex-end;
      width: 90%;
    }
  }
}
</style>
