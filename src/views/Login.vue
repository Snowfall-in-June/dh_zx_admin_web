<template>
  <div style="max-width:420px; margin:0 auto">
    <h2>Admin Login</h2>
    <form @submit.prevent="submit">
      <label>用户名</label>
      <input v-model="username" placeholder="username" />
      <label>密码</label>
      <input type="password" v-model="password" placeholder="password" />
      <div style="margin-top:8px">
        <button type="submit">Login</button>
      </div>
      <div v-if="error" style="color:red; margin-top:8px">{{ error }}</div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { login } from '../api/userapi'
import { useRouter } from 'vue-router'
import { emitter } from '../api/event-bus'
export default {
  setup() {
    const username = ref('')
    const password = ref('')
    const error = ref('')
    const router = useRouter()

    async function submit() {
      error.value = ''
      try {
        await login(username.value, password.value)
        emitter.emit('login-success')
        router.push('/')
      } catch (e) {
        console.debug(e)
        error.value = '登陆失败，检查用户名/密码'
      }
    }

    return { username, password, error, submit }
  }
}
</script>
