<template>
  <div class="app-container">
    <el-upload
        class="upload-demo"
        action="#"
        :show-file-list="false"
        :auto-upload="false"
        :on-change="fileSelected">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
    <div class="results">
      <el-input v-model="inputData" disabled style="width:600px;max-width:100%;" />
      <el-button type="primary" icon="el-icon-document" @click="handleCopy(inputData,$event)">
        复制到粘贴板
      </el-button>
      <el-button type="danger" icon="el-icon-document" @click="removeLastNode">
        删除最近节点
      </el-button>
    </div>
    <div class="drawing">
      <v-stage
          ref="stage"
          :config="stageSize"
          @mousemove="handleMouseMove"
          @mouseDown="handleMouseDown"
          @mouseUp="handleMouseUp"
      >
        <v-layer ref="layer">
          <v-image :config="imageConfig"></v-image>
          <v-rect
              v-for="(rec, index) in recs"
              :key="index"
              @dragstart="handleDragStart"
              @dragend="handleDragEnd"
              :config="{
                x: Math.min(rec.startPointX, rec.startPointX + rec.width),
                y: Math.min(rec.startPointY, rec.startPointY + rec.height),
                width: Math.abs(rec.width),
                height: Math.abs(rec.height),
                fill: 'yellow',
                stroke: 'yellow',
                strokeWidth: 3,
                draggable: true
              }"
          />
        </v-layer>
      </v-stage>
    </div>
  </div>
</template>

<script>
import clip from '../../util/clipboard'

export default {
  data () {
    return {
      imageConfig: {
        image: null
      },
      stageSize: {
        width: 800,
        height: 600,
      },
      isDrawing: false,
      isDragging: false,
      dragStartPoint: {},
      dragNodeId: '',
      recs: []
    }
  },
  computed: {
    inputData () {
      if (this.imageConfig.image) {
        const finalArray = []
        const totalHeight = this.stageSize.height
        const totalWidth = this.stageSize.width
        for (const rec of this.recs) {
          finalArray.push({
            sX: (rec.startPointX / totalWidth * 100).toFixed(2),
            sY: (rec.startPointY / totalHeight * 100).toFixed(2),
            w: (rec.width / totalWidth * 100).toFixed(2),
            h: (rec.height / totalHeight * 100).toFixed(2)
          })
        }
        return JSON.stringify(finalArray)
      } else {
        return '未添加图片'
      }
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
    fileSelected (file) {
      let reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = (e) =>{
        const image = new window.Image();
        image.src = e.target.result
        image.onload = () => {
          // set image only when it is loaded
          this.imageConfig.image = image;
          this.stageSize.width = image.width
          this.stageSize.height = image.height
        }
      }
      this.recs = []
    },
    handleMouseDown(e) {
      if (e.target.index === 0) {
        this.isDrawing = true;
        const pos = this.$refs.stage.getNode().getPointerPosition();
        this.setRecs([
          ...this.recs,
          { startPointX: pos.x, startPointY: pos.y, width: 0, height: 0 },
        ]);
      } else {
        this.isDrawing = false
        this.isDragging = true
        this.dragNodeId = e.target
      }
    },
    handleMouseUp() {
      if (this.isDrawing) {
        this.isDrawing = false;
      }
      if (this.isDragging) {
        const stopPoint = this.$refs.stage.getNode().getPointerPosition();
        this.isDragging = false
        this.adjustRecsByPoints(stopPoint)
      }
    },
    adjustRecsByPoints(stopPoint) {
      for (let rec of this.recs) {
        if (rec.startPointX < this.dragStartPoint.x && this.dragStartPoint.x < rec.startPointX + rec.width && rec.startPointY < this.dragStartPoint.y && this.dragStartPoint.y < rec.startPointY + rec.height) {
          rec.startPointX = stopPoint.x - this.dragStartPoint.x + rec.startPointX
          rec.startPointY = stopPoint.y - this.dragStartPoint.y + rec.startPointY
        }
      }
    },
    setRecs(element) {
      this.recs = element;
    },
    handleMouseMove() {
      // no drawing - skipping
      if (!this.isDrawing && !this.isDragging) {
        return;
      }
      // console.log(event);
      const point = this.$refs.stage.getNode().getPointerPosition();
      // handle  rectangle part
      let curRec = this.recs[this.recs.length - 1];
      if (this.isDrawing) {
        curRec.width = point.x - curRec.startPointX;
        curRec.height = point.y - curRec.startPointY;
      }
      if (this.isDragging) {
        this.dragStartPoint = point
      }
    },
    handleDragStart() {
      this.isDragging = true;
    },
    handleDragEnd() {
      this.isDragging = false;
    },
    handleCopy(text, event) {
      clip(text, event)
    },
    removeLastNode() {
      this.recs.pop()
    }
  }
}
</script>

<style>
.konvajs-content {
  margin: 0 auto;
}
</style>
