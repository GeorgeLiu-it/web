<template>
  <div class="login-popup">
    <el-popover v-if="isLoggedIn" trigger="click" width="220">
      <template #reference>
        <el-avatar :size="36" :src="userStore.state.userInfo.avatar"/>
      </template>
      <template #default>
        <div class="title">
          <el-row>Welcome, {{ userStore.state.userInfo.username }}!</el-row>
        </div>
        <div class="user-info">
          <el-row>{{ userStore.state.userInfo.address }}</el-row>
        </div>
        <div class="container">
          <el-row>Signature: {{ userStore.state.userInfo.signature }}</el-row>
          <div class="action-button">
            <el-button type="danger" round @click="userStore.loginOut()">Logout</el-button>
            <el-button type="primary" round @click="goIndexOrToDashboard">{{ label }}</el-button>
          </div>
        </div>
      </template>
    </el-popover>

    <el-popover v-else :visible="popoverVisible" width="250">
      <template #reference>
        <el-avatar :size="36" :icon="User" src=""
                   @click="onClickOnIcon"/>
      </template>
      <template #default>
        <div class="default" v-click-outside="onClickOutside">
          <div class="title">
            <el-row>Please login or register</el-row>
          </div>
          <div class="auth-button">
            <div class="button-item">
              <el-button class="login" icon="User" @click="layoutStore.state.loginVisible = true"/>
              Login
              <el-dialog
                  v-model="loginVisible"
                  width="500"
                  destroy-on-close
                  align-center
                  :before-close="loginVisibleSynchronization"
              >
                <template #header>
                  Login
                </template>
                  <login-form/>
                <template #footer>
                  Happy login
                </template>
              </el-dialog>
            </div>

            <div class="button-item">
              <el-button class="register" icon="Edit" @click="layoutStore.state.registerVisible = true"/>
              Registration
              <el-dialog
                  v-model="registerVisible"
                  width="500"
                  destroy-on-close
                  align-center
                  :before-close="registerVisibleSynchronization"
              >
                <template #header>
                  Registration
                </template>
                <register-form/>
                <template #footer>
                  Happy registration
                </template>
              </el-dialog>
            </div>

            <div class="button-item">
              <el-button class="forgot-password" icon="Unlock" @click="layoutStore.state.forgotPasswordVisible = true"/>
              Forget
              <el-dialog
                  v-model="forgotPasswordVisible"
                  width="500"
                  destroy-on-close
                  align-center
                  :before-close="forgotPasswordVisibleSynchronization"
              >
                <template #header>
                  Forget password
                </template>
                <forget-form/>
                <template #footer>
                  Good luck
                </template>
              </el-dialog>
            </div>
          </div>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import {Avatar, User} from "@element-plus/icons-vue";
import {computed, ref, watch} from 'vue'
import LoginForm from "@/components/forms/LoginForm.vue";
import {useLayoutStore} from "@/stores/layout";
import {ClickOutside as vClickOutside} from 'element-plus'
import {useUserStore} from "@/stores/user";
import router from "@/router";
import {useRoute} from "vue-router";
import RegisterForm from "@/components/forms/RegisterForm.vue";
import ForgetForm from "@/components/forms/ForgetForm.vue";


const userStore = useUserStore()
const route = useRoute()
const isLoggedIn = computed(() => userStore.isLoggedIn)
const isInDashboard = route.matched.some(record => record.name === 'dashboard')
const label = isInDashboard ? 'Home' : 'Dashboard'
const goIndexOrToDashboard = (() => {
  if (isInDashboard) {
    router.push({name: 'index'})
  } else {
    router.push({name: 'home'})
  }
})

const layoutStore = useLayoutStore()

const popoverVisible = ref(layoutStore.state.popoverVisible)
watch(
    () => layoutStore.state.popoverVisible,
    (newValue) => {
      popoverVisible.value = newValue;
    }
)

const onClickOutside = () => {
  layoutStore.state.popoverVisible = false
}

const onClickOnIcon = () => {
  layoutStore.state.popoverVisible = !layoutStore.state.popoverVisible
}

const loginVisible = ref(layoutStore.state.loginVisible)
watch(
    () => layoutStore.state.loginVisible,
    (newValue) => {
      loginVisible.value = newValue
    }
)

const loginVisibleSynchronization = () => {
  layoutStore.state.loginVisible = false
}

const registerVisible = ref(layoutStore.state.registerVisible)
watch(
    () => layoutStore.state.registerVisible,
    (newValue) => {
      registerVisible.value = newValue
    }
)

const registerVisibleSynchronization = () => {
  layoutStore.state.registerVisible = false
}

const forgotPasswordVisible = ref(layoutStore.state.forgotPasswordVisible)
watch(
    () => layoutStore.state.forgotPasswordVisible,
    (newValue) => {
      forgotPasswordVisible.value = newValue
    }
)

const forgotPasswordVisibleSynchronization = () => {
  layoutStore.state.forgotPasswordVisible = false
}
</script>

<style scoped lang="scss">
.login-popup {
  .el-avatar--icon {
    font-size: 24px;
  }
}


.el-popover.el-popper {
  .title {
    display: flex;
    height: 30px;

    .el-row {
      margin: auto auto;
    }
  }

  .user-info {
    text-align: center;

    .el-row {
      display: flex;
      justify-content: center;
    }
  }


  .container {
    background-color: transparent;

    .el-row {
      justify-content: center;
      padding: 5px;
    }

    .action-button {
      display: flex;
      justify-content: center;

      .el-button {
        border: none;
        // background-color: transparent;
        margin-bottom: 5px;
      }
    }
  }
}

.el-popover.el-popper {
  .default {
    .title {
      display: flex;
      height: 60px;

      .el-row {
        margin: auto auto;
      }
    }

    .auth-button {
      display: flex;
      justify-content: center;

      .button-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 80px;

        .el-button {
          border: none;
          --el-font-size-base: 32px;
          height: 62px;
          background-color: transparent;
        }
      }
    }

    .container {
      background-color: white;

      .el-divider {
        --el-bg-color: transparent;
      }

      .oauth-login {
        display: flex;
        justify-content: center;

        .login-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 80px;
          margin-top: auto;

          .el-image {
            height: 32px;
            margin-bottom: 8px;
          }
        }
      }
    }
  }
}
</style>
