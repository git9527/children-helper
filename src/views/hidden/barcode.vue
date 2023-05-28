<template>
  <div class="app-container">
    <div class="form-container">
      <el-form label-width="90px" :inline="true">
        <el-form-item label="产品编号" class="number-input">
          <el-input v-model="productCode" placeholder="请输入产品编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="分隔符" class="number-input">
          <el-input v-model="separator" placeholder="请输入产品编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="开始序号" class="number-input">
          <el-input v-model="beginSeq" placeholder="产品编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="结束序号" class="number-input">
          <el-input v-model="endSeq" placeholder="产品编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="序号位数" class="number-input">
          <el-input v-model="seqLength" placeholder="产品编号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-refresh" type="primary" plain @click="generateItems()" size="medium">生成条码</el-button>
        </el-form-item>
      </el-form>
      <div id="images-container">
        <svg :id="item.seq" v-for="(item, index) of items" :key="index"></svg>
      </div>
    </div>
  </div>
</template>

<script>
import jsbarcode from 'jsbarcode'


export default {
  data() {
    return {
      productCode: '215014',
      separator: '-',
      beginSeq: 1,
      endSeq: 2,
      seqLength: 5,
      items: []
    }
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
      this.items = []
      for (let i = this.beginSeq; i <= this.endSeq; i++) {
        this.items.push({
          seq: 'barcode-' + this.pad(i)
        })
      }
      this.$nextTick(() => {
        for (let i = this.beginSeq; i <= this.endSeq; i++) {
          jsbarcode('#' + 'barcode-' + this.pad(i), this.productCode + " " + this.separator + " " + this.pad(i), {
            displayValue: true,
            format: 'CODE128B',
            ean128: true
          })
        }
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
