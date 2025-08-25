<template>
  <div class="pdf-editor-page">
    <!-- 如果还没有开始写作，显示选择 PDF 页面 -->
    <div v-if="!writing">
      <h2 class="page-title">选择 PDF 文件</h2>

      <!-- 搜索框 -->
      <div class="search-bar">
        <input
          v-model="keyword"
          @keyup.enter="searchPDFs(1)"
          placeholder="输入关键词搜索 PDF"
          type="text"
        />
        <button @click="searchPDFs(1)" class="btn-search">搜索</button>
      </div>

      <!-- 搜索结果列表表格 -->
      <div v-if="pdfList.length" class="pdf-list card">
        <p class="list-title">
          搜索结果（第 {{ currentPage }} 页 / 共 {{ totalPages }} 页，{{ total }} 个文件）：
        </p>
        <table class="pdf-table">
          <thead>
            <tr>
              <th style="width:10%">选择</th>
              <th style="width:40%">文件名称</th>
              <th style="width:50%">文件地址</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pdf in pdfList" :key="pdf.id">
              <td>
                <input
                  type="checkbox"
                  :checked="selectedFileIds.includes(pdf.id)"
                  @change="toggleFile(pdf, $event)"
                />
              </td>
              <td><a :href="pdf.url" target="_blank">{{ pdf.name }}</a></td>
              <td>{{ pdf.url }}</td>
            </tr>
          </tbody>
        </table>

        <!-- 分页控制 -->
        <div class="pagination">
          <button :disabled="currentPage === 1" @click="searchPDFs(currentPage - 1)">
            上一页
          </button>
          <span>第 {{ currentPage }} / {{ totalPages }} 页</span>
          <button :disabled="currentPage === totalPages" @click="searchPDFs(currentPage + 1)">
            下一页
          </button>
        </div>
      </div>

      <!-- 选中文件提示 -->
      <div v-if="selectedFiles.length" class="selected-info card">
        已选择 {{ selectedFiles.length }} 个文件：
        <span v-for="(file, index) in selectedFiles" :key="file.id" class="file-tag">
          {{ file.name }}
          <button @click="removeFile(file.id)" class="remove-btn">×</button>
        </span>
      </div>

      <!-- 开始写作按钮 -->
      <div class="action-btn">
        <button :disabled="selectedFiles.length === 0" @click="startWriting" class="btn-start">
          开始写作
        </button>
        <button :disabled="selectedFiles.length === 0" @click="cleanSelectedFiles" class="btn-start">
          清空选择的文件
        </button>
      </div>

      <!-- 加载状态与错误提示 -->
      <div v-if="loading" class="loading">搜索中...</div>
      <div v-if="error" class="error">{{ error }}</div>
    </div>

    <!-- 写作页面 -->
    <div v-else>
      <ArticleForm
        :files="selectedFiles"
        :id="id"
        :title_p="title"
        :content_p="content"
        @saved="onSaved"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import ArticleForm from '../components/ArticleForm.vue'
import { search_research_reports, search_research_reports_by_ids } from '../api/research-report'
import { getArticle } from '../api/articles'

export default {
  components: { ArticleForm },
  props: {
    id: { type: String, default: 'new' },
  },
  setup(props) {
    const keyword = ref('')
    const pdfList = ref([])
    const selectedFiles = ref([]) // 保存选中的文件对象
    const selectedFileIds = ref([]) // 保存选中的文件 id
    const loading = ref(false)
    const error = ref('')
    const writing = ref(false)
    const title = ref('')
    const content = ref('')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const AUTH_KEY = 'dh_admin_token'
    const token = localStorage.getItem(AUTH_KEY)
    const router = useRouter()

    const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

    async function load() {
      if (props.id && props.id !== 'new') {
        const a = await getArticle(props.id)
        if (a) {
          title.value = a.articleTitle || ''
          content.value = a.articleContent || ''
          selectedFiles.value = []
          selectedFileIds.value = []
          const reports = await search_research_reports_by_ids(a.researchReportIds)
          pdfList.value = reports.map(report => ({
            id: report.id,
            name: report.title,
            url: `${window.location.origin}/api/research-report/${report.id}?token=${token}`
          }))
          selectedFiles.value = [...pdfList.value] // 默认全选
          selectedFileIds.value = pdfList.value.map(f => f.id)
          total.value = pdfList.value.length
        }
      }
    }

    const searchPDFs = async (page = 1) => {
      if (!keyword.value.trim()) {
        error.value = '请输入关键词'
        return
      }

      loading.value = true
      error.value = ''
      pdfList.value = []
      currentPage.value = page

      try {
        const res = await search_research_reports({
          param: keyword.value.trim(),
          page: currentPage.value,
          pageSize: pageSize.value,
        })

        pdfList.value = res.list.map(report => ({
          id: report.id,
          name: report.title,
          url: `${window.location.origin}/api/research-report/${report.id}?token=${token}`
        }))
        total.value = res.total || 0
      } catch (e) {
        console.error(e)
        error.value = '搜索失败，请重试'
      } finally {
        loading.value = false
      }
    }

    const toggleFile = (pdf, event) => {
      if (event.target.checked) {
        if (!selectedFileIds.value.includes(pdf.id)) {
          selectedFileIds.value.push(pdf.id)
          selectedFiles.value.push(pdf)
        }
      } else {
        selectedFileIds.value = selectedFileIds.value.filter(id => id !== pdf.id)
        selectedFiles.value = selectedFiles.value.filter(f => f.id !== pdf.id)
      }
    }

    const removeFile = (id) => {
      selectedFileIds.value = selectedFileIds.value.filter(fid => fid !== id)
      selectedFiles.value = selectedFiles.value.filter(f => f.id !== id)
    }

    const cleanSelectedFiles = () => {
      selectedFiles.value = []
      selectedFileIds.value = []
    }

    const startWriting = () => { writing.value = true }
    const onSaved = (saved) => { if (saved) router.push('/') }

    onMounted(load)

    return {
      keyword,
      pdfList,
      selectedFiles,
      selectedFileIds,
      loading,
      error,
      writing,
      searchPDFs,
      startWriting,
      onSaved,
      title,
      content,
      cleanSelectedFiles,
      removeFile,
      toggleFile,
      currentPage,
      totalPages,
      total
    }
  }
}
</script>
<style scoped>
.pdf-editor-page {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #333;
}

.page-title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
    text-align: center;
    color: #1f2937;
}

.search-bar {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
}

.search-bar input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #cbd5e0;
    border-radius: 4px;
    font-size: 14px;
}

.btn-search {
    padding: 8px 16px;
    background-color: #3b82f6;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.btn-search:hover {
    background-color: #2563eb;
}

.card {
    background-color: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.list-title {
    font-weight: 500;
    margin-bottom: 12px;
}

.pdf-table {
    width: 100%;
    border-collapse: collapse;
}

.pdf-table th,
.pdf-table td {
    border: 1px solid #e5e7eb;
    padding: 8px 12px;
    text-align: left;
}

.pdf-table th {
    background-color: #f3f4f6;
    color: #374151;
    font-weight: 500;
}

.pdf-table td input[type="checkbox"] {
    transform: scale(1.1);
}

.pdf-table tbody tr:hover {
    background-color: #f9fafb;
}

.selected-info .file-tag {
    display: inline-block;
    background: #e0f2fe;
    color: #0369a1;
    padding: 3px 8px;
    margin-right: 6px;
    border-radius: 4px;
    font-size: 13px;
}

.action-btn {
    text-align: center;
    margin-top: 16px;
}

.btn-start {
    padding: 8px 24px;
    background-color: #10b981;
    color: #fff;
    font-weight: 500;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.btn-start:disabled {
    background-color: #94d3b8;
    cursor: not-allowed;
}

.btn-start:hover:not(:disabled) {
    background-color: #059669;
}

.loading {
    color: #3b82f6;
    margin-top: 12px;
    font-weight: 500;
}

.error {
    color: #ef4444;
    margin-top: 12px;
    font-weight: 500;
}
.file-tag {
  display: inline-flex;
  align-items: center;
  margin: 0 8px 8px 0;
  padding: 4px 8px;
  background: #f3f4f6;
  border-radius: 4px;
}

.remove-btn {
  margin-left: 6px;
  background: transparent;
  border: none;
  color: #ef4444;
  font-size: 14px;
  cursor: pointer;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-top: 16px;
}

.pagination button {
    padding: 6px 12px;
    background-color: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    cursor: pointer;
}

.pagination button:disabled {
    color: #9ca3af;
    cursor: not-allowed;
    background-color: #e5e7eb;
}
</style>
