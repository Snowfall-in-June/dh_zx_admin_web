<template>
  <div class="article-page">
    <h2 class="page-title">文章列表</h2>
    <div v-if="articles.length === 0" class="empty">暂无文章</div>

    <div v-for="a in articles" :key="a.id" class="article-card">
      <h3 class="article-title">{{ a.articleTitle }}</h3>

      <!-- 摘要内容 -->
      <div class="article-summary" v-html="summary(a.articleSortContent)"></div>

      <!-- 查看完整内容按钮 -->
      <button class="btn-link" @click="openModal(a.articleContent)">查看完整内容</button>

      <!-- 其他字段展示 -->
      <div class="article-meta">
        <span>作者：{{ a.author }}</span>
        <span>👍 {{ a.likeCount ?? 0 }}</span>
        <span>🔗 {{ a.shareCount ?? 0 }}</span>
        <span>置顶等级：{{ a.topLevel }}</span>
        <span>创建时间：{{ a.createdAt }}</span>
      </div>

      <div class="article-actions">
        <button class="btn-edit" @click="topLevel(a.id,1)">置顶</button>
        <button class="btn-delete" @click="topLevel(a.id,0)">取消置顶</button>
        
        <router-link :to="`/editor/${a.id}`">
          <button class="btn-edit">编辑</button>
        </router-link>
        <button class="btn-delete" @click="remove(a.id)">删除</button>
      </div>
    </div>

    <!-- 模态框 -->
    <div v-if="showModal" class="modal-mask" @click.self="closeModal">
      <div class="modal-container">
        <div class="modal-header">
          <h3>文章内容</h3>
          <button class="modal-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body" v-html="modalContent"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { listArticles, deleteArticle,updateTopLevel} from '../api/articles'

const articles = ref([])
const showModal = ref(false)
const modalContent = ref('')

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

async function topLevel(id,level) {
   if(!confirm("确认置顶?")) return
   await updateTopLevel(id,level)
   await load()
}

function openModal(content) {
  modalContent.value = content
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

onMounted(load)
</script>

<style scoped>
.article-page {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  font-family: "Helvetica", "Arial", sans-serif;
  color: #333;
}

.page-title {
  text-align: center;
  margin-bottom: 20px;
}

.empty {
  text-align: center;
  color: #888;
}

.article-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}

.article-title {
  font-size: 20px;
  margin-bottom: 8px;
}

.article-summary {
  color: #555;
  margin-bottom: 10px;
  line-height: 1.6;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 14px;
  color: #666;
  margin-top: 10px;
}

.article-actions {
  margin-top: 12px;
}

.btn-edit,
.btn-delete,
.btn-link {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  margin-right: 8px;
  cursor: pointer;
  font-size: 14px;
}

.btn-edit {
  background: #007bff;
  color: white;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.btn-link {
  background: transparent;
  color: #007bff;
  text-decoration: underline;
  cursor: pointer;
}

.btn-edit:hover {
  background: #0056b3;
}

.btn-delete:hover {
  background: #a71d2a;
}

.btn-link:hover {
  color: #0056b3;
}

/* 模态框样式 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  padding: 20px;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.modal-close {
  background: transparent;
  border: none;
  font-size: 22px;
  cursor: pointer;
}

.modal-body {
  line-height: 1.6;
  color: #444;
}
</style>
