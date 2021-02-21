<template>
  <div class="app-container">
    <div class="form-container">
      <el-form label-width="90px" class="form">
        <el-form-item label="单车编号" class="number-input">
          <el-input v-model="code" placeholder="输入10位单车编号, 不确定的用*替" clearable></el-input>
        </el-form-item>
        <el-form-item label="二维码类型" class="number-input">
          <el-switch
              v-model="largeQr"
              active-text="较大(29x29)"
              inactive-text="较小(25x25)">
          </el-switch>
        </el-form-item>
        <div class="label">上面两方块中间<span class="red">第一行</span>样式</div>
        <img class="guide-image" src="../../assets/images/haluo/first.png"/>
        <div class="align-left">
          <div class="small-square" v-for="(item, index) of firstLineDisplay" :key="index" @click="clickFirstLine(index)"
               v-bind:class="item === 1 ? 'clicked' : 'empty'"></div>
        </div>
        <template v-if="code.indexOf('**') > -1">
          <div class="label">上面两方块中间<span class="red">第二行</span>样式(仅需涂上开头几个黑色块)</div>
          <div class="align-left">
            <div class="small-square" v-for="(item, index) of secondLineDisplay" :key="index" @click="clickSecondLine(index)"
                 v-bind:class="item === 1 ? 'clicked' : 'empty'"></div>
          </div>
        </template>
        <div class="label">左上方块下<span class="red">第一行</span>样式</div>
        <img class="guide-image" src="../../assets/images/haluo/bottom.png"/>
        <div class="align-left">
          <div class="square" v-for="(item, index) of squares" :key="index" @click="clickSquare(index)"
               v-bind:class="item === 1 ? 'clicked' : 'empty'"></div>
        </div>
        <el-button class="button" type="primary" @click="onSubmit" plain>猜测二维码</el-button>
      </el-form>
      <div id="images-container"></div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode'

export default {
  data() {
    return {
      // firstLine: [0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1],
      // secondLine: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      // squares: [0, 1, 0, 1, 1],
      // code: '915**00816',
      firstLine: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      secondLine: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      squares: [0, 0, 0, 0, 0],
      code: '',
      largeQr: true,
      showImage: true,
      correctLevelMap: {
        '11': 'L',
        '10': 'M',
        '01': 'Q',
        '00': 'H'
      },
      maskTypeMap: {
        '101': 0,
        '100': 1,
        '111': 2,
        '110': 3,
        '001': 4,
        '000': 5,
        '011': 6,
        '010': 7
      }
    }
  },
  computed: {
    firstLineDisplay () {
      const copy =  this.firstLine.slice()
      return this.largeQr ? copy: copy.splice(0, 9)
    },
    secondLineDisplay () {
      const copy =  this.secondLine.slice()
      return this.largeQr ? copy: copy.splice(0, 9)
    }
  },
  mounted() {
  },
  methods: {
    async onSubmit() {
      const imageContainer = document.getElementById('images-container')
      while (imageContainer.firstChild) {
        imageContainer.firstChild.remove()
      }
      if (this.code.length !== 10) {
        this.$alert('单车编号错误，长度不为10')
        return
      }
      const correctLevelCode = this.squares.slice(0, 2).join('')
      if (!this.largeQr && this.squares[0] !== 1) {
        this.$alert('较小二维码与左上方块的下一行样式不匹配，请重新填充')
        return
      }
      const correctLevel = this.correctLevelMap[correctLevelCode]
      const maskTypeCode = this.squares.slice(2, 5).join('')
      const maskType = this.maskTypeMap[maskTypeCode]
      const expected = this.firstLineDisplay.join('') + this.getLeadingNonBlackOfSecondLine()
      const version = this.largeQr ? 3 : 2
      const suffixes = this.largeQr ? ['', '&f', '&b'] : ['']
      console.log('expected is', expected)
      for (const number of this.getWaitingNumbers()) {
        for (const suffix of suffixes) {
          const tempCode = number + suffix
          const tried = await this.tryCode(tempCode, version, correctLevel, maskType)
          if (tried.indexOf(expected) === 0) {
            console.log('found the same', tempCode)
            await this.generateReal(tempCode, version, correctLevel, maskType)
          }
        }
      }
      const final = document.getElementById('images-container').children.length
      if (final === 0) {
        this.$alert('未发现潜在二维码，请仔细核对样式')
      } else {
        const message = final === 0 ? '恭喜您，发现唯一的二维码，请核对其他部分' : '恭喜您，发现' + final + '个潜在二维码，请完善第二行样式'
        this.$message({
          showClose: true,
          message: message,
          type: 'success'
        })
      }
    },
    getWaitingNumbers() {
      const numbers = []
      const count = (this.code.match(/\*/g) || []).length
      if (count === 0) {
        numbers.push(this.code)
      } else if (count === 1) {
        const location = this.code.indexOf('*')
        const before = this.code.substring(0, location)
        const after = this.code.substr(location + 1, 10)
        for (let i = 0; i < 10; i++) {
          numbers.push(before + i + after)
        }
      } else if (count === 2) {
        const location = this.code.indexOf('**')
        const before = this.code.substring(0, location)
        const after = this.code.substr(location + 2, 10)
        for (let i = 0; i < 100; i++) {
          const val = i < 10 ? '0' + i : i
          numbers.push(before + val + after)
        }
      }
      return numbers
    },
    async generateReal(code, version, correctLevel, maskType) {
      const imageSize = version === 3 ? 290 : 250
      const dataUrl = await QRCode.toDataURL('http://c3x.me/?n=' + code, {
        version: version,
        errorCorrectionLevel: correctLevel,
        maskPattern: maskType,
        width: imageSize,
        margin: 2,
        scale: 1
      })
      const img = new Image()
      img.setAttribute('src', dataUrl)
      const canvas = document.createElement('canvas')
      img.onload = () => {
        const number = code.split('&')[0]
        canvas.width = imageSize
        canvas.height = imageSize + 30
        const context = canvas.getContext('2d')
        context.fillStyle = 'white'
        context.fillRect(0, 0, imageSize, imageSize)
        context.drawImage(img, 0, 0, imageSize, imageSize)
        context.font = '16px sans-serif'
        context.fillStyle = 'black'
        context.textAlign = 'center'
        context.fillText(number, imageSize / 2 - 10, imageSize + 10)
      }
      document.getElementById('images-container').appendChild(canvas)
    },
    getLeadingNonBlackOfSecondLine () {
      return this.secondLineDisplay.join('').replace(/0+$/g, "")
    },
    async tryCode(code, version, correctLevel, maskType) {
      const width = version === 3 ? 29 : 25
      const canvas = await QRCode.toCanvas('http://c3x.me/?n=' + code, {
        version: version,
        errorCorrectionLevel: correctLevel,
        maskPattern: maskType,
        width: width,
        margin: 0,
        scale: 1
      })
      const data = canvas.getContext('2d').getImageData(0, 0, width, 2).data
      const colorArray = []
      for (let i = 0; i < data.length; i += 4) {
        colorArray.push(data[i] === 0 ? 1 : 0)
      }
      return colorArray.slice(8, width - 8).join('') + colorArray.slice(8 + width, width - 8 + width).join('')
    },
    clickSquare(index) {
      this.$set(this.squares, index, 1 - this.squares[index])
    },
    clickFirstLine(index) {
      this.$set(this.firstLine, index, 1 - this.firstLine[index])
    },
    clickSecondLine(index) {
      this.$set(this.secondLine, index, 1 - this.secondLine[index])
    }
  }
}
</script>

<style>
.single-qr {
  display: block;
  margin: 30px auto;
}
.number-input {
  .el-input__inner {
    width: 100%;
  }
}
</style>

<style scoped>
.btn {
  margin-top: 10px;
  margin-bottom: 10px;
}

.form-container {
  text-align: center;
}

.form {
  width: 400px;
  margin: 0 auto;
}

.square {
  width: 30px;
  height: 30px;
  border: solid 1px black;
  margin-right: 10px;
  display: inline-block;
}

.small-square {
  width: 20px;
  height: 20px;
  border: solid 1px black;
  margin-right: 5px;
  display: inline-block;
}

.align-left {
  text-align: left;
}

.clicked {
  background-color: black;
}

.label {
  text-align: left;
  margin-bottom: 10px;
  vertical-align: middle;
  font-size: 14px;
  color: #606266;
  font-weight: bolder;
}

.number-input {
  width: 350px;
  margin-left: 0;
  text-align: left;
}

.button {
  margin-top: 10px;
}

.red {
  color: red;
}
.guide-image {
  width: 200px;
}
</style>
