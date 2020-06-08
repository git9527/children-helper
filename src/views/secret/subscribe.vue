<template>
  <div class="app-container">
    <el-row>
      <el-col :span="15" :offset="1">
        <el-table :data="items"
                  stripe
                  border>
          <el-table-column
                  prop="host"
                  label="Server Host"
                  width="110">
          </el-table-column>
          <el-table-column
                  prop="port"
                  label="Server Port">
          </el-table-column>
          <el-table-column
                  prop="protocol"
                  label="Protocol">
          </el-table-column>
          <el-table-column
                  prop="encryption"
                  label="Encryption">
          </el-table-column>
          <el-table-column
                  prop="password"
                  label="Password">
          </el-table-column>
          <el-table-column
                  prop="remark"
                  label="Remark">
          </el-table-column>
          <el-table-column label="Operation">
            <template slot-scope="scope">
              <el-button
                      size="mini"
                      type="danger"
                      @click="handleDelete(scope.$index)">Remove</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="btn">
          <el-button type="primary" plain @click="onGenerate">Generate</el-button>
        </div>
        <el-input type="textarea" disabled v-model="content"></el-input>
      </el-col>
      <el-col :span="6" :offset="1">
        <el-form ref="form" :model="form" label-width="90px">
          <el-form-item label="Server Host">
            <el-input v-model="form.host"></el-input>
          </el-form-item>
          <el-form-item label="Server Port">
            <el-input v-model="form.port"></el-input>
          </el-form-item>
          <el-form-item label="Protocol">
            <el-select v-model="form.protocol">
              <el-option label="Shadowsocks" value="ss"></el-option>
              <el-option label="V2ray" value="vmess"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Encryption">
            <el-select v-model="form.encryption" v-if="form.protocol === 'vmess'">
              <el-option label="auto" value="auto"></el-option>
              <el-option label="aes-128-gcm" value="aes-128-gcm"></el-option>
              <el-option label="chacha20-poly1305" value="chacha20-poly1305"></el-option>
            </el-select>
            <el-select v-model="form.encryption" v-else-if="form.protocol === 'ss'">
              <el-option label="aes-256-gcm" value="aes-256-gcm"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Password">
            <el-input v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item label="Remark">
            <el-input v-model="form.remark"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">Add Item</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="1"></el-col>
    </el-row>

  </div>
</template>

<script>
  import { Base64 } from 'js-base64'

  export default {
    data () {
      return {
        items: [],
        form: {
          host: '',
          port: '',
          protocol: '',
          encryption: '',
          password: '',
          remark: ''
        },
        content: ''
      }
    },
    mounted () {
    },
    methods: {
      onSubmit () {
        const _copy = Object.assign({}, this.form)
        this.items.push(_copy)
      },
      handleDelete(index) {
        this.items.splice(index, 1);
      },
      onGenerate () {
        let text = ''
        for (const item of this.items) {
            const plain = item.encryption + ":" + item.password + "@" + item.host + ":" + item.port
            text = text + item.protocol + "://" + Base64.encode(plain) + '#' + item.remark + '\n'
        }
        this.content = Base64.encode(text)
      }
    }
  }
</script>

<style scoped>
.btn {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
