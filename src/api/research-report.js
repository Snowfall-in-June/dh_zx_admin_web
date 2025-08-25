import axios from "axios"
const AUTH_KEY = 'dh_admin_token'

export async function search_research_reports(params = {}) {
  const token = localStorage.getItem(AUTH_KEY)
  try {
    const response = await axios.get('/api/research-report/research-reports', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params // 传查询参数
    })
    return response.data || []
  } catch (e) {
    console.error('接口请求失败', e)
    return []
  }
}

export async function search_research_reports_by_ids(ids) {
  const token = localStorage.getItem(AUTH_KEY)
  try {
    const response = await axios.get(`/api/research-report/research-reports/${ids}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      
    })
    return response.data || []
  } catch (e) {
    console.error('接口请求失败', e)
    return []
  }
}
