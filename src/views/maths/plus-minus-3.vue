<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="运算类型">
        <el-select v-model="formInline.calType">
          <el-option label="加法" value="plus"></el-option>
          <el-option label="减法" value="minus"></el-option>
          <el-option label="加减混合" value="mix"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="题目数量">
        <el-input-number v-model="formInline.calCount" :min="12" :step="4" :max="100" step-strictly></el-input-number>
      </el-form-item>
      <el-form-item label="最终结果范围">
        <el-select v-model="formInline.calMax">
          <el-option label="10以内" value="10"></el-option>
          <el-option label="20以内" value="20"></el-option>
          <el-option label="30以内" value="30"></el-option>
          <el-option label="50以内" value="50"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" type="primary" plain @click="generateItems">生成试题</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-printer" type="success" plain @click="downloadPdf">下载为PDF</el-button>
      </el-form-item>
    </el-form>

    <div id="full-page">
      <standard-number></standard-number>
      <ul class="items-table" id="items-table">
        <li class="single-item" v-for="(item, index) of items" :key="index">
          <single :formula="item"></single>
        </li>
      </ul>

      <div class="footer">
        <span class="date">日期：____________</span>
        <span class="score">得分：____________</span>
      </div>
    </div>

  </div>
</template>

<script>
  import Single from './single-item'
  import StandardNumber from './standard'
  import { generatePdf } from '../../vendors/pdf'

  export default {
    components: {
      Single, StandardNumber
    },
    data() {
      return {
        formInline: {
          calType: 'mix',
          calCount: 100,
          calMax: '30'
        },
        items: []
      }
    },
    mounted () {
      this.generateItems()
    },
    methods: {
      downloadPdf () {
        generatePdf('三数加减', 'full-page')
      },
      generateItems () {
        this.items = []
        for (let i = 0; i < this.formInline.calCount; i++) {
          const obj = this.getSingle()
          obj.id = i
          this.items.push(obj)
        }
      },
      getSingle () {
        const operation1 = this.getRandomOperation()
        const max =  parseInt(this.formInline.calMax)
        let a = this.randomNumber(0, max)
        if (a === 0) {
          a = this.randomNumber(0, max)
        }
        const b = this.getRandomNumber(operation1, a)
        const operation2 = this.getRandomOperation()
        let c = 0
        if (operation1 === 'plus') {
          c = this.getRandomNumber(operation2, a + b)
        } else {
          c = this.getRandomNumber(operation2, a - b)
        }
        return {
          numbers: [a, b, c],
          operations: [operation1, operation2]
        }
      },
      getRandomNumber (operation, a) {
        const rest = parseInt(this.formInline.calMax) - a
        let b = 0
        if (operation === 'plus') {
          b = this.randomNumber(0, rest)
        } else {
          b = this.randomNumber(0, a)
        }
        return b
      },
      getRandomOperation () {
        let operation = 'plus'
        if (this.formInline.calType === 'minus') {
          operation = 'minus'
        } else if (this.formInline.calType === 'mix') {
          operation = Math.round(Math.random()*10) >=5 ? 'plus': 'minus'
        }
        return operation
      },
      randomNumber (a, b) {
        const maxNum = a > b ? a : b
        const minNum = a > b ? b : a
        return Math.round(Math.random()*(maxNum - minNum))
      }
    }
  }
</script>

<style>
  .el-input--suffix .el-input__inner {
    width: 120px;
  }
</style>

<style scoped>
  .items-table {
    margin: 0 auto;
    border-left: 1px solid black;
    border-top: 1px solid black;
    list-style-type: none;
    width: 724px;
    overflow: hidden;
    padding: 0;
  }
  .single-item {
    border-right: 1px solid black;
    border-bottom: 1px solid black;
    list-style-type: none;
    width: 180px;
    height: 40px;
    float: left;
    line-height: 40px;
  }
  .single-item >>> .operation {
    padding: 2px;
  }
  .footer {
    margin-top: 10px;
  }
  .date {
    margin: 0 30px;
  }
  #full-page {
    padding-top: 10px;
    width: 800px;
    margin: 0 auto;
  }
</style>
