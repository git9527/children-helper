<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="题目数量">
        <el-input-number v-model="formInline.calCount" :min="12" :step="4" :max="100" step-strictly size="medium" controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item label="最终结果范围">
        <el-select v-model="formInline.calMax" size="medium">
          <el-option label="50以内" value="50"></el-option>
          <el-option label="100以内" value="100"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" icon="el-icon-refresh" type="primary" plain @click="generateItems">生成试题</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" icon="el-icon-document" type="success" plain @click="downloadPdf">下载为PDF</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" icon="el-icon-printer" type="warning" plain @click="printContent">直接打印</el-button>
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
        <span class="date">开始时间：____________</span>
        <span class="date">结束时间：____________</span>
        <span class="score">得分：____________</span>
      </div>
    </div>

  </div>
</template>

<script>
  import Single from './single-item'
  import StandardNumber from './standard'
  import { generatePdf } from '../../vendors/pdf'
  import MathGenerator from '../../util/math-generator'

  export default {
    components: {
      Single, StandardNumber
    },
    data() {
      return {
        formInline: {
          calCount: 100,
          calMax: '100'
        },
        items: []
      }
    },
    mounted () {
      this.generateItems()
    },
    methods: {
      downloadPdf () {
        generatePdf('四则运算混合', 'full-page')
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
        const max = parseInt(this.formInline.calMax)
        const a = MathGenerator.randomInRange(1, max)
        const numbers = [a]
        const operations = []
        const randomCombine1 = MathGenerator.getRandomNumberAndOperator(a, max)
        numbers.push(randomCombine1.number)
        operations.push(randomCombine1.operator)
        const result1 = MathGenerator.calculateQuestion(numbers, operations)
        const randomCombine2 = MathGenerator.getRandomNumberAndOperator(result1, max)
        numbers.push(randomCombine2.number)
        operations.push(randomCombine2.operator)
        return MathGenerator.addParenthesesIfNeed(numbers, operations)
      },
      printContent () {
        window.print()
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
    padding-left: 1px;
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
