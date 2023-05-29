<template>
  <div class="app-container">
    <div class="form-container">
      <el-form label-width="90px" :inline="true">
        <el-form-item label="产品编号" class="number-input">
          <el-input v-model="productCode" placeholder="产品编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="分隔符" class="number-input">
          <el-input v-model="separator" placeholder="分隔符" clearable></el-input>
        </el-form-item>
        <el-form-item label="开始序号" class="number-input">
          <el-input v-model="beginSeq" placeholder="开始序号" clearable></el-input>
        </el-form-item>
        <el-form-item label="结束序号" class="number-input">
          <el-input v-model="endSeq" placeholder="结束序号" clearable></el-input>
        </el-form-item>
        <el-form-item label="序号位数" class="number-input">
          <el-input v-model="seqLength" placeholder="序号位数" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-refresh" type="primary" :loading="isGenerating" plain @click="generateItems()" size="medium">生成条码</el-button>
        </el-form-item>
      </el-form>
      <div id="images-container">
        <div v-for="(item, index) of items" :key="index" v-show="index < 5">
          <canvas :id="item.seq"></canvas>
          <div>{{item.data}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jsBarcode from 'jsbarcode-fixed'
import { jsPDF } from "jspdf";


export default {
  data() {
    return {
      productCode: '215014',
      separator: '-',
      beginSeq: 1,
      endSeq: 100,
      seqLength: 5,
      items: [],
      isGenerating: false
    }
  },
  computed: {
    
  },
  mounted() {
  },
  methods: {
    pad(num) {
      num = num.toString();
      while (num.length < this.seqLength) num = "0" + num;
      return num;
    },
    generateItems () {
      this.isGenerating = true
      this.items = []
      for (let i = this.beginSeq; i <= this.endSeq; i++) {
        this.items.push({
          seq: 'barcode-' + this.pad(i),
          data: this.productCode + " " + this.separator + " " + this.pad(i)
        })
      }
      this.$nextTick(() => {
        const doc = new jsPDF('l', 'mm', [54, 30]);
        for (let i = this.beginSeq; i <= this.endSeq; i++) {
          let id = 'barcode-' + this.pad(i)
          let content = this.productCode + " " + this.separator + " " + this.pad(i)
          jsBarcode('#' + id, content, {
            format: 'CODE128Fix',
            displayValue: false,
            ean128: false,
            fontSize: 40,
            height: 50,
            font: 'sans-serif',
            textMargin: 0
          })
          let canvas = document.getElementById(id)
          doc.addImage(canvas.toDataURL("image/jpeg"), 'JPEG', 2, 2, 50, 20)
          doc.text(content, 27, 25, 'center')
          if (i < this.endSeq) {
            doc.addPage()
          }
        }
        const from = this.productCode + '-' + this.pad(this.beginSeq)
        const end = this.productCode + '-' + this.pad(this.endSeq)
        doc.save('条码' + from + '_' + end + ".pdf");
        this.isGenerating = false
      })
    }
  }
}
</script>

<style>

.number-input {
  .el-input__inner {
    width: 100%;
  }
}
</style>

<style scoped>

</style>
