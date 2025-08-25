<template>
    <div class="article-form-container">
        <h2 class="page-title">撰写文章</h2>

        <!-- 已选择文件表格 -->
        <div v-if="files && files.length" class="selected-files">
            <strong>已选择文件：</strong>
            <table class="files-table">
                <thead>
                    <tr>
                        <th>文件名称</th>
                        <th>文件地址</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="file in files" :key="file.url">
                        <td>
                            <a :href="file.url" target="_blank">{{ file.name }}</a>
                        </td>
                        <td>{{ file.url }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 文章标题 -->
        <div class="form-group">
            <label class="form-label">标题：</label>
            <input v-model="title" placeholder="请输入文章标题" class="form-input" />
        </div>

        <!-- 正文编辑器与实时预览 -->
        <div class="editor-preview-wrapper">
            <div class="editor-section">
                <label class="form-label">正文：</label>
                <RichEditorTiny v-model="content" />
            </div>
            <div class="preview-section">
                <label class="form-label">实时预览：</label>
                <div class="preview" v-html="sanitizedContent"></div>
            </div>
        </div>

        <!-- 保存按钮与提示 -->
        <div class="form-actions">
            <button @click="save" class="btn-save">保存</button>
            <button @click="back" class="btn-save">返回</button>
            <span v-if="message" class="save-message">{{ message }}</span>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import RichEditorTiny from './RichEditorTiny.vue'
import DOMPurify from 'dompurify'
import { updateAritcle, saveArticle } from '../api/articles'

export default {
    name: 'ArticleForm',
    props: {
        id: { type: String, default: 'new' },
        files: { type: Array, default: () => [] },
        content_p: { type: String, default: 'content' },
        title_p: { type: String, default: 'titile' }
    },
    emits: ['saved'],
    components: { RichEditorTiny },
    setup(props, { emit }) {
        const title = ref('')
        const content = ref('')
        const message = ref('')

        
        async function load() {
            if (props.id && props.id !== 'new') {
                title.value = props.title_p
                content.value = props.content_p
            }
        }
        const sanitizedContent = computed(() => DOMPurify.sanitize(content.value || ''))

        async function save() {
            if (!title.value.trim()) {
                message.value = '请输入标题'
                return
            }

            try {
                if (props.id && props.id !== 'new') {
                    // 更新文章
                    const saved = await updateAritcle({id:props.id,researchReportIds: props.files.map(f => f.id).join(','),
                        articleTitle: title.value,
                        articleContent: content.value})
                    if (saved) {
                        message.value = '更新成功！'
                        setTimeout(() => {
                            message.value = ''
                            emit('saved', true)
                        }, 400)
                    } else {
                        message.value = '更新失败！'
                        emit('saved', false)
                    }
                } else {
                    const saved = await saveArticle({
                        researchReportIds: props.files.map(f => f.id).join(','),
                        articleTitle: title.value,
                        articleContent: content.value
                    })

                    if (saved) {
                        message.value = '保存成功！'
                        setTimeout(() => {
                            message.value = ''
                            emit('saved', true)
                        }, 400)
                    } else {
                        message.value = '保存失败！'
                        emit('saved', false)
                    }
                }

            } catch (e) {
                console.error(e)
                message.value = '保存异常！'
                emit('saved', false)
            }
        }

        async function back() {
            emit('saved', true)
        }

        onMounted(load)

        return {title,content,sanitizedContent, save, back, message }
    }
}
</script>

<style scoped>
.article-form-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #333;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.page-title {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 600;
    text-align: center;
    color: #1f2937;
}

.selected-files {
    margin-bottom: 16px;
}

.files-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
}

.files-table th,
.files-table td {
    border: 1px solid #e2e8f0;
    padding: 8px 12px;
    text-align: left;
}

.files-table th {
    background-color: #f3f4f6;
    color: #374151;
    font-weight: 500;
}

.form-group {
    margin-bottom: 16px;
    display: flex;
    align-items: center;
}

.form-label {
    width: 80px;
    font-weight: 500;
}

.form-input {
    flex: 1;
    padding: 6px 12px;
    border: 1px solid #cbd5e0;
    border-radius: 4px;
    font-size: 14px;
}

.editor-preview-wrapper {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
}

.editor-section {
    width: 50%;
}

.preview-section {
    width: 50%;
    border-left: 1px solid #e2e8f0;
    padding-left: 16px;
}

.preview {
    height: 400px;
    /* 固定高度，可根据需要调整 */
    overflow-y: auto;
    /* 内容超出显示滚动条 */
    padding: 12px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
}

.form-actions {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 12px;
}

.btn-save {
    padding: 6px 18px;
    background-color: #3b82f6;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.btn-save:hover {
    background-color: #2563eb;
}

.save-message {
    color: #e90a20;
    font-weight: 500;
}
</style>
