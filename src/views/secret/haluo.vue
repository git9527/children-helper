<template>
  <div class="app-container">
    <div class="form-container">
      <el-form label-width="90px" class="form">
        <el-form-item label="单车编号">
          <el-input v-model="code" type="number" placeholder="请输入10位单车编号"></el-input>
        </el-form-item>
        <el-form-item>
          <vue-qr :text="qrContent" :size="200"></vue-qr>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">生成二维码</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import VueQr from 'vue-qr'


export default {
  components: {
    VueQr
  },
  data () {
    return {
      items: [],
      code: '',
      qrContent: ''
    }
  },
  mounted () {
  },
  methods: {
    onSubmit () {
      if (this.code.length !== 10) {
        this.$alert('长度错误')
      } else {
        this.qrContent = "https://c3x.me/?n=" + this.code + "&f"
      }
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

</style>
