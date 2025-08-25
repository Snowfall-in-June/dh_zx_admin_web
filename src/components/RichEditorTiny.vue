<template>
  <Editor
    v-model="content"
    :init="editorConfig"
    api-key="no-api-key"
  />
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import Editor from '@tinymce/tinymce-vue'

// === TinyMCE 本地依赖引入 ===
import 'tinymce/tinymce'
import 'tinymce/icons/default'
import 'tinymce/themes/silver'

// 插件
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/link'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/code'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/table'
import 'tinymce/plugins/emoticons'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/help'
import 'tinymce/plugins/autoresize'

// 引入中文语言包
// import 'tinymce/langs/zh_CN'

export default defineComponent({
  name: 'RichEditorTiny',
  components: { Editor },
  props: {
    modelValue: { type: String, default: '' }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const content = ref(props.modelValue)

    const editorConfig = {
      base_url: '/tinymce',
      suffix: '.min',
      height: 500,
      language: 'zh_CN',
      language_url: '/tinymce/langs/zh_CN.js',
      menubar: 'file edit view insert format tools table help',
      plugins: [
        'advlist autolink lists link charmap preview anchor searchreplace visualblocks visualchars code fullscreen insertdatetime table emoticons hr pagebreak nonbreaking wordcount help autoresize'
      ],
      toolbar: [
        'undo redo | formatselect fontselect fontsizeselect | bold italic underline strikethrough forecolor backcolor |',
        'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |',
        'link table emoticons hr charmap |',
        'code fullscreen preview | removeformat'
      ].join(' '),
      fontsize_formats: '8px 10px 12px 14px 16px 18px 24px 36px 48px 64px',
      font_formats:
        '宋体=SimSun; 黑体=SimHei; 微软雅黑=Microsoft YaHei; Arial=arial,helvetica,sans-serif; Courier New=courier new,courier,monospace; Georgia=georgia,palatino; Times New Roman=times new roman,times; Verdana=verdana,geneva',
      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
      automatic_uploads: false,
      images_upload_url: null,
      file_picker_callback: null
    }

    // 双向绑定
    watch(
      () => props.modelValue,
      v => {
        if (v !== content.value) content.value = v
      }
    )
    watch(content, v => emit('update:modelValue', v))

    return { content, editorConfig }
  }
})
</script>

<style scoped>
:deep(.tox.tox-tinymce) {
  min-height: 600px;
  z-index: 1 !important; /* 降低编辑器容器层级 */ 
}
</style>
