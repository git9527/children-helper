<template>
  <div class="app-container">
    <el-row>
      <el-col :span="15" :offset="1">
        <el-table :data="items"
                  stripe
                  border>
          <el-table-column
              label="序号"
              width="60">
            <template slot-scope="scope">
              <div>{{scope.$index + startNumber}}</div>
            </template>
          </el-table-column>
          <el-table-column
              prop="question"
              label="问题">
          </el-table-column>
          <el-table-column
              width="140"
              label="选项列表">
            <template slot-scope="scope">
              <div v-for="(option, index) of scope.row.options" :key="index">{{option}}</div>
            </template>
          </el-table-column>
          <el-table-column
              width="100"
              prop="answer"
              label="答案">
          </el-table-column>
          <el-table-column
              width="100"
              prop="notes"
              label="解析">
          </el-table-column>
          <el-table-column
              width="150"
              label="标签">
            <template slot-scope="scope">
              <el-tag
                  :key="index"
                  v-for="(tag, index) in scope.row.tags">
                {{tag}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            width="150"
            label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="updateItem(scope.$index, scope.row)">调整</el-button>
              <el-button type="danger" size="mini" @click="removeItem(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="btn">
          <span>请输入题目起始编号</span>
          <el-input-number v-model="startNumber" :min="1" :max="9999" controls-position="right" class="start-number"></el-input-number>
          <el-button type="primary" plain @click="onGenerate">生成</el-button>
        </div>
      </el-col>
      <el-col :span="6" :offset="1">
        <el-form ref="form" :model="form" label-width="90px">
          <el-form-item label="问题">
            <el-input v-model="form.question" type="textarea" rows="5" placeholder="此处填写问题，需包含【】"></el-input>
          </el-form-item>
          <el-form-item
              v-for="(option, index) in form.options"
              :label="'选项' + (index+1)"
              :key="index">
            <el-input v-model="form.options[index]" class="option-input" placeholder="此处填写选项"></el-input>
            <el-button @click="removeOption(index)" type="danger" plain>删除</el-button>
          </el-form-item>
          <el-form-item label="" class="left-btn">
            <el-button @click="addOption" type="primary" plain>添加选项</el-button>
          </el-form-item>
          <el-form-item label="答案">
            <el-select v-model="form.answer" class="full-wide">
              <el-option v-for="(option, index) in form.options" :label="option" :value="index+1" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="解析">
            <el-input v-model="form.notes" type="textarea" rows="2" placeholder="此处填写解析，该字段选填"></el-input>
          </el-form-item>
          <el-form-item label="标签">
            <div class="tag-container">
              <el-tag
                  :key="index"
                  v-for="(tag, index) in form.tags"
                  closable
                  :disable-transitions="false"
                  @close="removeTag(index)">
                {{tag}}
              </el-tag>
              <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">添加新标签</el-button>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">{{editIndex > -1?'更新':'添加'}}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="1"></el-col>
    </el-row>

  </div>
</template>

<script>
import { saveAs } from 'file-saver'

export default {
  data() {
    return {
      items: [],
      form: {
        question: '',
        options: [''],
        answer: '',
        notes: '',
        tags: []
      },
      inputVisible: false,
      inputValue: '',
      startNumber: 2102,
      editIndex: -1
    }
  },
  mounted() {
  },
  methods: {
    onSubmit() {
      if (!this.form.question.includes('【】')) {
        this.$message.error("问题中需含待替换部分【】")
        return
      }
      for (const option of this.form.options) {
        if (!option) {
          this.$message.error("所有选项均不能为空")
          return
        }
        if (option.includes(" ")) {
          this.$message.error("选项中不能带有空格")
        }
      }
      if (!this.form.answer) {
        this.$message.error("答案不能为空")
        return
      }
      const _copy = JSON.parse(JSON.stringify(this.form))
      if (this.editIndex > -1) {
        this.$set(this.items, this.editIndex, _copy)
        this.editIndex = -1
      } else {
        this.items.push(_copy)
      }
      this.form = {
        question: '',
        options: [''],
        answer: '',
        notes: '',
        tags: []
      }
    },
    handleDelete(index) {
      this.items.splice(index, 1);
    },
    onGenerate() {
      let content = ""
      for (let i=0; i< this.items.length; i++) {
        const item = this.items[i]
        const seq = this.zeroPad(i + this.startNumber, 4)
        const question = this.getFormattedQuestion(item).trim()
        const options = item.options.join("||")
        const answer = item.answer
        const notes = item.notes.trim()
        const tags = item.tags.join(" ").trim()
        content += seq + '\t' + question + '\t' + options + '\t' + answer + '\t' + notes +'\t\t' + tags + '\n'
      }
      const blob = new Blob([content], {type: "text/plain;charset=utf-8"})
      saveAs(blob, "start-from-" + this.startNumber + '.txt')
    },
    getFormattedQuestion(item) {
      const count = item.question.split("【").length - 1
      const answer_array = item.options[item.answer-1].split("-")
      if (count !== answer_array.length) {
        this.$message.error("题目中待填空数与答案中不符合")
        return
      }
      let question = '"' + item.question + '"'
      for (let i=0; i< answer_array.length;i++) {
        console.log('before replace', question)
        question = question.replace("【】", '{{c1::【' + answer_array[i] + '】}}')
        console.log('after replace', question)
      }
      return question
    },
    zeroPad(num, places) {
      const zero = places - num.toString().length + 1;
      return Array(+(zero > 0 && zero)).join("0") + num;
    },
    removeOption(index) {
      this.form.options.splice(index, 1)
    },
    removeTag (index) {
      this.form.tags.splice(index, 1)
    },
    addOption () {
      this.form.options.push('')
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      })
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.form.tags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    updateItem (index, rowData) {
      console.log('update item', index)
      this.editIndex = index
      this.form = {
        question: rowData.question,
        options: rowData.options,
        answer: rowData.answer,
        notes: rowData.notes,
        tags: rowData.tags
      }
    },
    removeItem (index) {
      this.items.splice(index, 1)
    }
  }
}
</script>

<style>
.full-wide {
  width: 100%;
}
</style>

<style scoped>
.btn {
  margin-top: 20px;
  margin-bottom: 10px;
}
.option-input {
  width: calc(100% - 80px);
  margin-right: 10px;
}
.el-tag {
  margin-right: 10px;
}
.button-new-tag {
  margin-right: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-right: 10px;
  vertical-align: bottom;
}
.tag-container {
  float: left;
}
.start-number {
  margin: 0 20px;
}
.left-btn {
  text-align: left;
}
</style>
