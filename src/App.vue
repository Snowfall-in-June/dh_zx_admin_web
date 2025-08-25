<template>
    <div>
        <nav>
            <router-link to="/">Dashboard</router-link>
            <router-link to="/editor/new">New Article</router-link>
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
