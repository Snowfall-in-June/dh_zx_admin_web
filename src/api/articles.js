const AUTH_KEY = 'dh_admin_token'
const ARTICLES_KEY = 'dh_admin_articles'

import axios from "axios"

async function readArticles() {
  const token = localStorage.getItem(AUTH_KEY)
  try {
    const response = await axios.get('/api/articles', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return response.data
  } catch (e) {
    console.error('接口请求失败', e)
    return '[]'
  }
}

export async function writeArticles(param) {
  const token = localStorage.getItem(AUTH_KEY)
  try {
    const response = await axios.post(
      '/api/articles',
      param,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    return response.data || []
  } catch (e) {
    console.error('接口请求失败', e)
    return []
  }
}

export function listArticles() {
  return Promise.resolve(readArticles())
}

export async function getArticle(id) {
  const token = localStorage.getItem(AUTH_KEY)
  try {
    const response = await axios.get(`/api/articles/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return response.data
  } catch (e) {
    console.error('接口请求失败', e)
    return '[]'
  }
}

export function saveArticle(article) {

  return writeArticles(article)

}

export async function updateAritcle(article){
  const token = localStorage.getItem(AUTH_KEY)
  try {
    const response = await axios.put(
      `/api/articles/${article.id}`,
      article,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    return response.data || []
  } catch (e) {
    console.error('接口请求失败', e)
    return []
  }
}

export async function deleteArticle(id) {
  const token = localStorage.getItem(AUTH_KEY)
  try {
    const response = await axios.delete(
      `/api/articles/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data || []
  } catch (e) {
    console.error('接口请求失败', e)
    return []
  }
}

export async function updateTopLevel(id,level) {
  const token = localStorage.getItem(AUTH_KEY)
  try {
    const response = await axios.put(
      `/api/articles/updateTopLevel`,
      {id:id,topLevel:level},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data || []
  } catch (e) {
    console.error('接口请求失败', e)
    return []
  }
}