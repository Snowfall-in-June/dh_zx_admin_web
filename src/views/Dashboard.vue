<template>
  <div>
    <h2>文章列表</h2>
    <div v-if="articles.length === 0">暂无文章</div>
    <div v-for="a in articles" :key="a.id" class="article">
      <h3>{{ a.articleTitle }}</h3>
      <div v-html="summary(a.articleContent)"></div>
      <div style="margin-top:8px">
        <router-link :to="`/editor/${a.id}`"><button>编辑</button></router-link>
        <button @click="remove(a.id)">删除</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { listArticles, deleteArticle } from '../api/articles'

export default {
  setup() {
    const articles = ref([])

    async function load() {
      articles.value = await listArticles()
    }

    function summary(content) {
      return content ? content.slice(0, 200).replace(/\n/g, '<br/>') : ''
    }

    async function remove(id) {
      if (!confirm('确认删除?')) return
      await deleteArticle(id)
      await load()
    }

    onMounted(load)
    return { articles, summary, remove }
  }
}
</script>
