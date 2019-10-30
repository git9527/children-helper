<template>
  <div>
    <span v-for="(number, index) of formula.numbers" :key="index">
      <span class="number">{{number}}</span>
      <span class="operation">{{getOperation(index)}}</span>
    </span>
    <div class="result"></div>
  </div>
</template>

<script>
  export default {
    props: {
      formula: {
        type: Object,
        required: true
      }
    },
    mounted () {
    },
    methods: {
      getOperation (index) {
        const text = this.formula.operations[index]
        if (text === 'plus') {
          return '+'
        } else if (text === 'minus') {
          return '-'
        } else {
          return '='
        }
      }
    }
  }
</script>

<style scoped>
  .number {
    font-size: 20px;
  }
  .operation {
    font-size: 20px;
    padding: 5px;
  }
</style>
