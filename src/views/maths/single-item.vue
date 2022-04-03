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
  import Operators from "@/util/Operators";

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
        const operator = this.formula.operations[index]
        if (operator === undefined) {
          return Operators.EQUALS.label
        } else {
          return operator.label
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
    font-size: 25px;
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

<style>
.single-item {
  border-right: 1px solid black;
  border-bottom: 1px solid black;
  list-style-type: none;
  height: 39px;
  float: left;
  line-height: 39px;
}
</style>
