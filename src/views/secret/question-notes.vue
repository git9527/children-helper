<template>
  <div class="app-container">
    <div class="form-container">
      <el-form label-width="90px" class="form">
        <el-form-item label="题目关键字" class="number-input">
          <el-input v-model="keyword" placeholder="输入题目关键字" clearable></el-input>
        </el-form-item>
        <el-button class="button" type="primary" @click="onSubmit" plain :loading="isSubmitting" :disabled="isSubmitting">提交</el-button>
      </el-form>
      <div id="notes-container"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import iconv from 'iconv-lite'

export default {
  data() {
    return {
      keyword: '',
      isSubmitting: false
    }
  },
  mounted() {
  },
  methods: {
    onSubmit() {
      this.isSubmitting = true
      const proxy = 'https://summer-star-0c32.13148461135.workers.dev'
      axios.get(proxy + '/3gmfw/search/' + this.keyword).then(resp => {
        const originData = resp.data
        const links = originData.match(/".*html/)
        if (!links) {
          this.$message({
            showClose: true,
            message: '查询失败',
            type: 'error'
          })
          this.keyword = ''
          this.isSubmitting = false
          return
        }
        const link = links[0].replace(/"/, '')
        axios.get(proxy + '/3gmfw/result' + link, {
          responseType: 'arraybuffer'
        }).then(resp2 => {
          const _data = iconv.decode(Buffer.from(resp2.data, 'binary'), 'gb18030')
          const data2 = _data.toString('utf8')
          const part1 = data2.match(/is-normal[\s\S]*<\/p>\r\n\t\t\t\t\t\t\t<\/div>/)[0]
          const part2 = part1.replace('is-normal">\r\n\t\t\t\t\t\t\t\t<p>', '').replace('</div>', '')
          document.getElementById('notes-container').innerHTML = part2
          this.isSubmitting = false
        })
      })
    }
  }
}
</script>

<style scoped>
.btn {
  margin-top: 10px;
  margin-bottom: 10px;
}

.form-container {
  text-align: center;
}

.form {
  width: 400px;
  margin: 0 auto;
}

#notes-container {
  color: black;
}
</style>
