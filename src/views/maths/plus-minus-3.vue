<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="运算类型">
        <el-select v-model="formInline.calType" size="medium">
          <el-option label="加法" value="plus"></el-option>
          <el-option label="减法" value="minus"></el-option>
          <el-option label="加减混合" value="mix"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="题目数量">
        <el-input-number v-model="formInline.calCount" :min="12" :step="4" :max="100" step-strictly size="medium" controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item label="最终结果范围">
        <el-select v-model="formInline.calMax" size="medium">
          <el-option label="10以内" value="10"></el-option>
          <el-option label="20以内" value="20"></el-option>
          <el-option label="30以内" value="30"></el-option>
          <el-option label="50以内" value="50"></el-option>
          <el-option label="100以内" value="100"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" type="primary" plain @click="generateItems(1)" size="medium">生成试题</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-document" type="success" plain @click="downloadPdf" size="medium">下载为PDF</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-printer" type="warning" plain @click="printContent" size="medium">直接打印</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-printer" type="danger" plain @click="printTenCopy" size="medium">打印10份</el-button>
      </el-form-item>
    </el-form>

    <div id="full-page">
      <div class="single-page" v-for="(page, pageIndex) of pageItems" :key="pageIndex" :id="pageIndex">
        <standard-number></standard-number>
        <ul class="items-table" id="items-table">
          <li class="single-item" v-for="(item, index) of page.items" :key="index">
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

  </div>
</template>

<script>
  import Single from './single-item'
  import StandardNumber from './standard'
  import { generatePdf } from '../../vendors/pdf'
  import MathGenerator from '../../util/math-generator'
  import Operators from "../../util/Operators";

  export default {
    components: {
      Single, StandardNumber
    },
    data() {
      return {
        formInline: {
          calType: 'mix',
          calCount: 100,
          calMax: '100'
        },
        pageItems: []
      }
    },
    mounted () {
      this.generateItems()
    },
    methods: {
      downloadPdf () {
        generatePdf('三数加减', 'full-page')
      },
      generateItems (count=1) {
        this.pageItems =[]
        for (let j = 0; j < count; j++) {
          var items = []
          for (let i = 0; i < this.formInline.calCount; i++) {
            const obj = this.getSingle()
            obj.id = j + '-' + i
            items.push(obj)
          }
          this.pageItems.push({
            items: items
          })
        }
      },
      printTenCopy() {
        this.generateItems(10)
        setTimeout(() => {
          this.printContent()
        }, 1000)
      },
      getSingle () {
        const operation1 = this.getRandomOperation()
        const max =  parseInt(this.formInline.calMax)
        let a = MathGenerator.randomInRange(1, max)
        const b = this.getRandomNumber(operation1, a)
        const operation2 = this.getRandomOperation()
        let c = 0
        if (operation1 === Operators.ADDITION) {
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
        if (operation === Operators.ADDITION) {
          b = MathGenerator.randomInRange(1, rest)
        } else {
          b = MathGenerator.randomInRange(1, a)
        }
        return b
      },
      getRandomOperation () {
        let operation = Operators.ADDITION
        if (this.formInline.calType === 'minus') {
          operation = Operators.SUBSTRUCTION
        } else if (this.formInline.calType === 'mix') {
          operation = Math.round(Math.random()*10) >=5 ? Operators.ADDITION: Operators.SUBSTRUCTION
        }
        return operation
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
    width: 180px;
  }
  .single-item >>> .operation {
    padding-left: 1px;
  }
  .date {
    margin: 0 30px;
  }
  #full-page {
    width: 800px;
    margin: 0 auto;
    float: none;
  }
  .single-page {
    padding-top: 10px;
    page-break-after: always;
    page-break-inside: avoid;
  }
</style>
