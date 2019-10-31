<template>
  <div>
    <span class="formula">
      <span v-for="(number, index) of formula.numbers" :key="index" >
        <span class="number">{{number}}</span>
        <span class="operation">{{getOperation(index)}}</span>
      </span>
    </span>
    <canvas :id="'canvas-' + this.formula.id" class="square"></canvas>
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
      this.drawSquare()
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
      },
      drawSquare () {
        var canvasWidth = 30
        var canvasHeight = 30

        var canvas = document.getElementById("canvas-" + this.formula.id)
        var ctx = canvas.getContext("2d")

        canvas.height = canvasHeight
        canvas.width = canvasWidth

        // 田字格四边
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(canvasHeight, 0)
        ctx.lineTo(canvasHeight, canvasWidth)
        ctx.lineTo(0, canvasWidth)
        ctx.closePath()
        ctx.lineWidth = 2
        ctx.stroke()
        // 田字格
        ctx.setLineDash([1])
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(0, canvasHeight/2)
        ctx.lineTo(canvasWidth, canvasHeight/2)
        ctx.moveTo(canvasWidth/2, 0)
        ctx.lineTo(canvasWidth/2, canvasHeight)
        ctx.stroke()
      }
    }
  }
</script>

<style scoped>
  .formula {
    margin-left: -30px;
  }
  .number {
    font-size: 26px;
  }
  .operation {
    font-size: 30px;
  }
  .square {
    position: absolute;
    height: 30px;
    margin-top: 5px;
  }
</style>
