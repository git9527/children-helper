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
      <el-form-item label="数字范围">
        <el-select v-model="formInline.calMax">
          <el-option label="20以内" value="20"></el-option>
          <el-option label="30以内" value="30"></el-option>
          <el-option label="50以内" value="50"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="generateItems">生成试题</el-button>
      </el-form-item>
    </el-form>

    <ul class="items-table" id="items-table">
      <li class="single-item" v-for="(item, index) of items" :key="index">
        <single :formula="item"></single>
      </li>
    </ul>
  </div>
</template>

<script>
  import Single from './single-item'

  export default {
    components: {
      Single
    },
    data() {
      return {
        formInline: {
          calType: 'mix',
          calCount: 100,
          calMax: '20'
        },
        items: []
      }
    },
    mounted () {
      this.generateItems()
    },
    methods: {
      generateItems () {
        this.items = []
        let operation = 'plus'
        if (this.formInline.calType === 'minus') {
          operation = 'minus'
        }
        for (let i = 0; i < this.formInline.calCount; i++) {
          if (this.formInline.calType === 'mix') {
            operation = Math.round(Math.random()*10) >=5 ? 'plus': 'minus'
          }
          const obj = this.getSingle(operation)
          obj.id = i
          this.items.push(obj)
        }
      },
      getSingle (operation) {
        const max =  parseInt(this.formInline.calMax)
        const a = this.randomNumber(0, max)
        let b = 0
        if (operation === 'plus') {
           b = this.randomNumber(0, max-a)
        } else {
           b = this.randomNumber(0, a)
        }
        return {
          numbers: [a, b],
          operations: [operation]
        }
      },
      randomNumber (a, b) {
        const maxNum = a > b ? a : b
        const minNum = a > b ? b : a
        return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10)
      }
    }
  }
</script>

<style scoped>
  .items-table {
    margin: 0 auto;
    border-left: 1px solid black;
    border-top: 1px solid black;
    list-style-type: none;
    width: 804px;
    overflow: hidden;
    padding: 0;
  }
  .single-item {
    border-right: 1px solid black;
    border-bottom: 1px solid black;
    list-style-type: none;
    width: 200px;
    height:40px;
    float: left;
    line-height: 40px;
  }
</style>
