<template>
  <div class="app-container">
    <el-upload action="/"
               ref="upload"
               accept=".txt"
               :before-upload="beforeUpload"
               :disabled="this.fileList.length !== 0"
               :default-file-list="this.fileList">
      <el-button type="primary" :disabled="this.fileList.length !== 0">上传文件</el-button>
    </el-upload>
  </div>
</template>

<script>
import { saveAs } from 'file-saver'

export default {
  data () {
    return {
      fileList:[]
    }
  },
  mounted () {
  },
  beforeCreate() {
    // 读取文件
    FileReader.prototype.reading = function () {
      let bytes = new Uint8Array(this.result);    //无符号整型数组
      return new TextDecoder('UTF-8').decode(bytes);
    };
    /* 重写readAsBinaryString函数 */
    FileReader.prototype.readAsBinaryString = function (f) {
      if (!this.onload)       //如果this未重写onload函数，则创建一个公共处理方式
        this.onload = () => {  //在this.onload函数中，完成公共处理
          let rs = this.reading();
          console.log(rs);
        };
      this.readAsArrayBuffer(f);  //内部会回调this.onload方法
    };
  },
  methods:{
    beforeUpload(file){
      this.fileList = [file]
      // 读取数据
      this.read(file);
      return false
    },
    read(f) {
      let rd = new FileReader();
      rd.onload = () => {
        //this.readAsArrayBuffer函数内，会回调this.onload函数。在这里处理结果
        this.dealWithData(rd.reading());
      };
      rd.readAsBinaryString(f);
    },
    dealWithData (fullContent) {
      const records = fullContent.split('\n')
      const lines = []
      for (const record of records) {
        const fields = record.split('\t')
        if (fields.length !== 4) {
          continue
        }
        console.log(fields)
        let originQuestion = fields[0]
        let options = fields[1].replace(/(^\|+)|(\|+$)/g, '')
        let answer = fields[2].replace(/(^\|+)|(\|+$)/g, '')
        let desc = fields[3]
        let id = originQuestion.split('.')[0]
        let pureQuestion = originQuestion.substring(originQuestion.indexOf('.') + 1)
        let question = pureQuestion.replace('（）', this.getFormattedAnswer(options, answer))
        lines.push(id + '\t' + question + '\t' + options + '\t' + answer + '\t' + desc)
      }
      let _content = lines.join('\n')
      const blob = new Blob([_content], {type: "text/plain;charset=utf-8"})
      saveAs(blob, '2020一建市政真题.txt')
    },
    getFormattedAnswer(options, answers) {
      let full = []
      let _options = options.split('||')
      let _answers = answers.split('||')
      for (let i = 0; i < _answers.length; i ++) {
        full.push('<font color="#ef3461">{{c1::【' + _options[Number.parseInt(_answers[i]) - 1] + '】}}</font>')
      }
      return full.join('、')
    }
  }
}
</script>

<style scoped>
.standard-number {
  width: 60px;
  padding-left: 5px;
}
</style>
