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
        <el-input-number v-model="formInline.calCount" :min="12" :step="4" :max="100" step-strictly size="medium"></el-input-number>
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
        <el-button icon="el-icon-refresh" type="primary" plain @click="generateItems" size="medium">生成试题</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-document" type="success" plain @click="downloadPdf" size="medium">下载为PDF</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-printer" type="warning" plain @click="printContent">直接打印</el-button>
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
        generatePdf('两数加减', 'full-page')
      },
      generateItems () {
        this.items = []
        let operation = Operators.ADDITION
        if (this.formInline.calType === 'minus') {
          operation = Operators.SUBSTRUCTION
        }
        for (let i = 0; i < this.formInline.calCount; i++) {
          if (this.formInline.calType === 'mix') {
            operation = Math.round(Math.random()*10) >=5 ? Operators.ADDITION: Operators.SUBSTRUCTION
          }
          const obj = this.getSingle(operation)
          obj.id = i
          this.items.push(obj)
        }
      },
      getSingle (operation) {
        const max = parseInt(this.formInline.calMax)
        let a = MathGenerator.randomInRange(0, max)
        if (a === 0) {
          a = MathGenerator.randomInRange(0, max)
        }
        let b = 0
        if (operation === Operators.ADDITION) {
           b = MathGenerator.randomInRange(0, max-a)
        } else {
           b = MathGenerator.randomInRange(0, a)
        }
        return {
          numbers: [a, b],
          operations: [operation]
        }
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
    width: 684px;
    overflow: hidden;
    padding: 0;
  }
  .single-item {
    border-right: 1px solid black;
    border-bottom: 1px solid black;
    list-style-type: none;
    width: 170px;
    height: 40px;
    float: left;
    line-height: 40px;
  }
  .single-item >>> .operation {
    padding: 5px;
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
