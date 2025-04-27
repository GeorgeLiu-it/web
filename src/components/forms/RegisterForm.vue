<template>
  <div class="register-form">
    <el-image class="register-image" src="/image/avaya/nezha.png" alt=""/>
    <el-form
        ref="registerForm"
        :model="registerFormData"
        :rules="rules"
        :validate-on-rule-change="false"
        hide-required-asterisk
        @keyup.enter="submitForm"
        label-width="70px"
        label-position="left"
    >

      <el-form-item label="Username" prop="username">
        <el-input
            v-model="registerFormData.username"
            size="large"
            placeholder="Please input your username"
        />
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input
            v-model="registerFormData.password"
            show-password
            size="large"
            type="password"
            placeholder="Please input your password"
        />
      </el-form-item>
      <el-form-item label="Comfirm">
        <el-input
            v-model="repeatPassword"
            show-password
            size="large"
            type="password"
            placeholder="Please confirm your password"
        />
        <el-text v-if="registerFormData.password!==repeatPassword">Please conform your password</el-text>
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input
            v-model="registerFormData.email"
            size="large"
            placeholder="Please input your email address"
        />
      </el-form-item>
      <!-- <el-form-item prop="captcha">
        <div class="captcha">
          <el-input
              v-model="emailRequest.captcha"
              placeholder="No need to input"
              size="large"
              maxlength="6"
              minlength="6"
          />
          <el-image :src="picPath" alt="" @click="emailVerify"/>
          <el-button @click="sendCode">Send code</el-button>
        </div>
      </el-form-item> -->
      <!-- <el-form-item label="Email code" prop="email">
        <el-input
            v-model="registerFormData.verification_code"
            size="large"
            placeholder="Please input email code"
        />
      </el-form-item> -->
      <el-form-item>
        <div class="button-wrapper">
          <el-button
              type="primary"
              size="large"
              @click="submitForm"
          >Register
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref,} from "vue";
import type {RegisterRequest} from "@/api/user";
import {useUserStore} from "@/stores/user";
import {captcha, type EmailRequest, sendEmailVerificationCode} from "@/api/base";
import type {FormInstance, FormRules} from 'element-plus';
import {useLayoutStore} from "@/stores/layout";

const registerForm = ref<FormInstance>()

const registerFormData = reactive<RegisterRequest>({
  username: "",
  password: "",
  email: "",
  verification_code: "",
})

const repeatPassword = ref('')

const emailRequest = reactive<EmailRequest>({
  email: "",
  captcha: "",
  captcha_id: "",
})


const rules = reactive<FormRules<RegisterRequest>>({
  username:[{
    required:true,
    max:20,
    trigger:'blur',
    message:'Please ensure the length between 8 and 20'
  }],
  password:[{
    required:true,
    min:8,
    max:20,
    trigger:'change',
    message:'Please ensure the length between 8 and 20'
  }],
  email: [{
    required: true,
    type:'email',
    trigger: 'blur',
    message: 'Please check the email format'
  }],
  verification_code: [{
    required: false,
    len: 6,
    trigger: 'blur',
    message: 'No need to input'
  }],
})

const userStore = useUserStore()
const layoutStore = useLayoutStore()

const picPath = ref('')

const emailVerify = () => {
  captcha().then(async (res) => {
    picPath.value = res.data.pic_path
    emailRequest.captcha_id = res.data.captcha_id
  })
}

emailVerify()

const sendCode = async () => {
  emailRequest.email = registerFormData.email
  const res = await sendEmailVerificationCode(emailRequest)
  if (res.code === 0) {
    ElMessage.success(res.msg)
  } else {
    emailVerify()
  }
}

const submitForm = async () => {
  console.log("send registration data to server")
  const isValid: boolean = await new Promise((resolve) => {
    registerForm.value?.validate((valid: boolean) => {
      resolve(valid)
    })
  })

  if (isValid) {
    const flag = await userStore.registerIn(registerFormData)

    if (flag) {
      layoutStore.state.registerVisible = false
      layoutStore.state.popoverVisible = false
    }
  }
  return false
}
</script>


<style scoped lang="scss">
.register-form {
  display: flex;

  .register-image {
    display: block;
    width: 190px;
    height: 100%;
    margin-right: 10px;
  }

  .el-form {
    .captcha {
      display: flex;
    }
    .el-text{
      color: red;
    }
    .button-wrapper {
      text-align: end;
      justify-content: flex-end;
      width: 90%;
    }
  }
}
</style>