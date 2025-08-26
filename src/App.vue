<template>
    <div>
        <nav>
            <router-link to="/">文章列表</router-link>
            <router-link to="/editor/new">新建文章</router-link>
            <router-link to="/selectResearchReport">新增精选研报</router-link>
            <span style="float:right">
                <button v-if="auth" @click="logout">Logout</button>
            </span>
        </nav>
        <div class="container">
            <router-view />
        </div>
    </div>
</template>

<script>
import { isAuthenticated, logout as apiLogout } from './api/userapi'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { emitter } from './api/event-bus'

export default {
    setup() {
        const router = useRouter()
        const auth = ref(isAuthenticated())
        onMounted(() => {
            emitter.on('login-success', () => {
                auth.value = true
            })
        })
        function logout() {
            apiLogout()
            auth.value = false
            router.push('/login')
        }

        return { auth, logout }
    }
}
</script>
