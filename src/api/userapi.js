// very small mock API using localStorage
const AUTH_KEY = 'dh_admin_token'
import axios from "axios"

export async function login(username, password) {
  try {
    // 调用后端登录接口
    const res = await axios.post('/api/auth/login', {
      username,
      password
    })

    // 假设后端返回 { token: "xxxx" }
    const { token } = res.data
    localStorage.setItem(AUTH_KEY, token)
    return { token }
  } catch (err) {
    throw new Error('登录失败：' + err.response?.data?.message || err.message)
  }
}

export function logout() {
  localStorage.removeItem(AUTH_KEY)
}

export async function isAuthenticated() {
  try {
    const token = localStorage.getItem(AUTH_KEY)
    if(!token){
      return false
    }
    await axios.get("/api/auth/checkLogin", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return true
  } catch (err) {
    localStorage.removeItem(AUTH_KEY);
    return false;
  }
}

