<template>
  <div>
    <div class="designLink-box"></div>
    <div class="text-container">
      为产品设立基本的设计环节
      <span class="create-link" @click="addLinkItem">
        <svg-icon icon-class="create"></svg-icon>
      </span>
    </div>
    <el-table :data="list" element-loading-text="给我一点时间" border fit highlight-current-row height="400"
              style="width: 100%">
      <el-table-column align="center" :label="$t('table.baselineName')" width="200">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.name" class="edit-input" size="small"/>
          </template>
          <span v-else>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100" :label="$t('table.baselineDesc')">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.description" class="edit-input" size="small"/>
          </template>
          <span v-else>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--编辑按钮-->
          <el-button v-if="!scope.row.edit && scope.row.id" type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
          <!--确定添加按钮-->
          <el-button v-if="scope.row.edit && !scope.row.id" type="success" size="mini" @click="confirmAdd(scope.row)">确定</el-button>
          <!--确定编辑按钮-->
          <el-button v-if="scope.row.edit && scope.row.id" type="primary" size="mini" @click="confirmEdit(scope.row)">确定</el-button>
          <!--取消添加按钮-->
          <el-button v-if="scope.row.edit && !scope.row.id" class="cancel-btn" size="mini" type="warning" @click="cancelAdd(scope.row)">取消</el-button>
          <!--取消编辑按钮-->
          <el-button v-if="scope.row.edit && scope.row.id" type="warning" size="mini" @click="cancelEdit(scope.row)">取消</el-button>
          <!--删除按钮-->
          <el-button v-if="!scope.row.edit && scope.row.id" type="warning" size="mini" @click="deleteLink(scope.row)" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  /*eslint-disable*/
  import { getLinks, saveLinks, updateLinkById, deleteLinkById } from '@/api/designLinks'
  export default {
    name: 'index',
    data() {
      return {
        list: [],
        listLoading: false
      }
    },
    created() {
      this.getDesignLinks()
    },
    methods: {
      getDesignLinks() {
        this.listLoading = true
        getLinks().then((res) => {
          if(res.data.code === 0) {
            this.listLoading = false
            this.list = res.data.data
            this.list = this.list.map(v => {
              this.$set(v, 'edit', false)
              v.originalName = v.name
              v.originalDescription = v.description
              return v
            })
          }
        })
      },
      addLinkItem() {
        if(!this.list[0].id) {
          return
        }
        this.list.unshift({
          name: '',
          description: '',
          edit: true
        })
      },
      cancelAdd(row) {
        if(!row.id && row.edit) {
          if(!this.list[0].id) {
            this.list.splice(0,1)
          }
        }
      },
      confirmAdd(row) {
        let data = {
          name: row.name,
          description:  row.description
        }
        saveLinks(data).then((res) => {
          if(res.data.code === 0) {
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getDesignLinks()
          } else {
            this.$notify({
              title: '失败',
              message: res.data.msg,
              type: 'error',
              duration: 2000
            })
          }
        })
      },
      handleEdit(row) {
        row.edit = true
        /*if(!this.list[0].id && this.list[0].edit) {
          this.list.splice(0, 1)
        }*/
      },
      confirmEdit(row) {
        let qs = require('qs')
        let data = {
          name: row.name,
          description: row.description
        }
        let dataPost = qs.stringify(data)
        updateLinkById(row.id, dataPost).then(res => {
          if(res.data.code === 0) {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            row.edit = false
            this.getDesignLinks()
          } else {
            this.$notify({
              title: '失败',
              message: res.data.msg,
              type: 'error',
              duration: 2000
            })
          }
        })
      },
      cancelEdit(row) {
        row.edit = false
        row.name = row.originalName
        row.description = row.originalDescription
      },
      deleteLink(row) {
        this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteLinkById(row.id).then(res => {
            if(res.data.code === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.getDesignLinks()
            } else {
              this.$notify({
                title: '失败',
                message: res.data.msg,
                type: 'error',
                duration: 2000
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .designLink-box {
    width: 100%;
    height: 140px;
    margin: 0 auto;
    background: url("./workflow.png") center center no-repeat;
    background-size: 113px 90px;
  }
  .text-container {
    text-align: center;
    color: #777;
    margin-bottom: 20px;
    font-size: 14px;
    font-weight: 500;
  }
  .create-link {
    float: right;
    cursor: pointer;
    color: #82d4ec;
    font-size: 16px;
  }
</style>
