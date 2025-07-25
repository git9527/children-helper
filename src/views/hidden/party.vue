<template>
  <div class="app-container">
    <div class="form-container">
      <el-form>
        <el-form-item>
          <el-input v-model="content" placeholder="请提供待生成介绍新的基本信息"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-refresh" type="primary" :loading="isGenerating" plain @click="generateItems()" size="medium">生成介绍信</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {generatePdf} from "../../util/pdf";


export default {
  data() {
    return {
      content: '',
      isGenerating: false
    }
  },
  computed: {
    
  },
  mounted() {
  },
  methods: {
    async generateItems () {
      const fields = this.content.split('\t')
      const details = {
        name: fields[0] || '未填写',
        phone: fields[1] || '13900000000',
        id: fields[2] || '000000000000000000',
        receiverContact: fields[3] || '未知',
        receiverPhone: fields[4] || '13900000000',
        receiverName: fields[5] || '未知',
        receiverLocation: fields[6] || fields[5] || '未知',
        month: new Date().getMonth() + 1 + "",
      }
      const pdfBytes = await generatePdf(details, 'https://biti.cdn.zhangsn.me/font/SimSun.ttf', 'https://biti.cdn.zhangsn.me/font/SimSun-Bold.ttf')
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      // pdfBytes 是你生成的 Uint8Array
      const blobUrl = URL.createObjectURL(blob);

      // 打开一个新窗口并加载 PDF
      const printWindow = window.open(blobUrl);

      if (printWindow) {
        // 等 PDF 加载完成后触发打印
        this.content = '';
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
        };
      } else {
        alert("请允许弹窗以打印 PDF");
      }

    }
  }
}
</script>


<style scoped>

</style>
