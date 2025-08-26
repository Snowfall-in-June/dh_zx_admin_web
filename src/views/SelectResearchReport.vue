<template>
  <div class="container">
    <h1>精选研报录入数据</h1>
    <form @submit.prevent="submit" enctype="multipart/form-data">
      <label>精选集类型:</label>
      <select v-model="type">
        <option value="宏观专题">宏观专题</option>
        <option value="策略专题">策略专题</option>
        <option value="行业专题">行业专题</option>
        <option value="个股专题">个股专题</option>
      </select>
      <br /><br />
      <label>精选集标题:</label>
      <input v-model="title" type="text" />
      <br /><br />
      <label>精选集图标 <i style="color: red;">(宽高比 3:4)</i>:</label>
      <input ref="iconFile" type="file" multiple />
      <br /><br />
      <label>分享用户名称:</label>
      <input v-model="sharedUserName" type="text" />
      <br /><br />
      <label>标签:</label>
      <input v-model="tags" type="text" />
      <br /><br />
      <label>精选集专题简介:</label>
      <textarea v-model="introduction"></textarea>
      <br /><br />
      <h3>研报列表:</h3>
      <div v-for="(item, idx) in reports" :key="idx" class="researchReport">
        <h3>上传研报 {{ idx + 1 }}</h3>
        <label>研报时间:</label>
        <input v-model="item.reportTime" type="text" />

        <label>研报所属机构:</label>
        <input v-model="item.reportOrganization" type="text" />

        <label>研报作者:</label>
        <input v-model="item.owner" type="text" />

        <label>研报标题:</label>
        <input v-model="item.reportTitle" type="text" />

        <label>研报文件:</label>
        <input type="file" @change="onFileChange($event, idx)" />
      </div>

      <button type="button" @click="addReport">新增一个研报</button>
      <button type="button" @click="removeReport">删除一个研报</button>
      <br /><br />

      <button type="submit">提交</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const type = ref('宏观专题')
    const title = ref('')
    const iconFile = ref(null)
    const sharedUserName = ref('')
    const tags = ref('')
    const introduction = ref('')

    const reports = ref([
      {
        reportTime: '',
        reportOrganization: '',
        owner: '',
        reportTitle: '',
        reportFile: null
      }
    ])

    function addReport() {
      reports.value.push({
        reportTime: '',
        reportOrganization: '',
        owner: '',
        reportTitle: '',
        reportFile: null
      })
    }

    function removeReport() {
      if (reports.value.length > 0) {
        reports.value.pop()
      }
    }

    function onFileChange(e, idx) {
      reports.value[idx].reportFile = e.target.files[0]
    }

    async function submit() {
      const formData = new FormData()
      formData.append('type', type.value)
      formData.append('title', title.value)
      if (iconFile.value && iconFile.value.files.length > 0) {
        for (let f of iconFile.value.files) {
          formData.append('iconFile', f)
        }
      }
      formData.append('sharedUserName', sharedUserName.value)
      formData.append('tags', tags.value)
      formData.append('introduction', introduction.value)

      reports.value.forEach((item, idx) => {
        formData.append(`reportTime[${idx}]`, item.reportTime)
        formData.append(`reportOrganization[${idx}]`, item.reportOrganization)
        formData.append(`owner[${idx}]`, item.owner)
        formData.append(`reportTitle[${idx}]`, item.reportTitle)
        if (item.reportFile) {
          formData.append(`reportFiles[${idx}]`, item.reportFile)
        }
      })

      try {
        const resp = await fetch(
          'https://www.dongh123.com/api/select_report/addSelected_report',
          { method: 'POST', body: formData }
        )
        if (!resp.ok) throw new Error('网络异常')
        const data = await resp.json()
        alert('保存数据成功')
        console.log('保存成功:', data)
      } catch (err) {
        alert('保存失败: ' + err.message)
        console.error('保存失败:', err)
      }
    }

    return {
      type,
      title,
      iconFile,
      sharedUserName,
      tags,
      introduction,
      reports,
      addReport,
      removeReport,
      onFileChange,
      submit
    }
  }
}
</script>

<style scoped>
.container {
  width: 80%;
  max-width: 600px;
  margin: 0 auto;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.researchReport {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 15px;
}

.researchReport h3 {
  margin-top: 0;
  color: #007bff;
}
</style>
