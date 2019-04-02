<template>
  <div class="mySub-cont">
    <div class="operation-container">
      <span class="operation-item" @click="handleAddSubLib">
        <svg-icon icon-class="create"></svg-icon>
        新建库
      </span>
      <span class="operation-item" @click="handleEditSubLib" v-if="this.selectedId">
        <svg-icon icon-class="edit"></svg-icon>
        编辑库
      </span>
      <span class="operation-item" @click="handleDeleteSubLib" v-if="this.selectedId">
        <svg-icon icon-class="delete"></svg-icon>
        删除库
      </span>
    </div>
    <div class="sub-container">
      <div v-for="item in subLibrariesList" class="sub-item" @click="handleSelectItem(item)" :class="computedActive(item.id)">
        <span class="active-flag">
          <svg-icon v-if="item.id === selectedId" icon-class="correct"></svg-icon>
          <svg-icon v-else icon-class="correct-dark"></svg-icon>
        </span>
        <span class="sub-icon">
          <svg-icon icon-class="folder-1"></svg-icon>
        </span>
        <span class="sub-text">
        <el-tooltip class="item" effect="light" :content="item.type" placement="bottom-start" :visible-arrow="false">
          <span class="text">{{item.type}}</span>
        </el-tooltip>
      </span>
      </div>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="addDiaVis" append-to-body width="60%" class="limit-width-dialog">
      <el-form :model="subLibForm" status-icon :rules="rules" ref="subLibForm" label-width="100px" class="demo-ruleForm" label-position="left">
        <el-form-item prop="type" label="库名">
          <el-input v-model="subLibForm.type"></el-input>
        </el-form-item>
        <el-form-item label="库描述">
          <el-input v-model="subLibForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDiaVis = false">取 消</el-button>
        <el-button type="primary" v-if="dialogStatus === 'create'" @click="addSubLib">确 定</el-button>
        <el-button type="primary" v-if="dialogStatus === 'update'" @click="updateSubLib">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  /*eslint-disable*/
  import { subLibraryList, addSubLibrary, updateSubLibrary, deleteSubLibrary } from '@/api/library'

  export default {
    name: 'subLibrary',
    data() {
      return {
        addDiaVis: false,
        subLibrariesList: [],
        selectedId: '',
        selectedSubLib: '',
        libId: '',
        dialogStatus: '',
        textMap: {
          update: '修改库',
          create: '新建库'
        },
        subLibForm: {
          type: '',
          description: ''
        },
        rules: {
          type: [{required: true, message: '请输入库名！', trigger: 'blur'}],
        },
      }
    },
    created() {
      this.libId = this.$route.params.id
      this.getSublibraries(this.libId)
    },
    methods: {
      getSublibraries(id) {
        subLibraryList(id).then((res) => {
          if(res.data.code === 0) {
            this.subLibrariesList = res.data.data
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
      handleSelectItem(item) {
        this.selectedId = item.id
        this.selectedSubLib = item
      },
      resetForm() {
        this.subLibForm = {
          type: '',
          description: ''
        }
      },
      handleAddSubLib() {
        this.resetForm()
        this.dialogStatus = 'create'
        this.addDiaVis = true
        this.$nextTick(() => {
          this.$refs['subLibForm'].clearValidate()
        })
      },
      addSubLib() {
        this.$refs['subLibForm'].validate((valid) => {
          if(valid) {
            var qs = require('qs')
            let data = {
              libraryId: this.libId,
              type: this.subLibForm.type,
              description: this.subLibForm.description
            }
            let dataPost = qs.stringify(data)
            addSubLibrary(dataPost).then((res) => {
              if(res.data.code === 0) {
                this.$notify({
                  title: '成功',
                  message: '库新建成功',
                  type: 'success',
                  duration: 2000
                })
                this.getSublibraries(this.libId)
              } else {
                this.$notify({
                  title: '失败',
                  message: res.data.msg,
                  type: 'error',
                  duration: 2000
                })
              }
              this.addDiaVis = false
            }).catch(() => {
              this.$notify({
                title: '失败',
                message: '操作失败',
                type: 'error',
                duration: 2000
              })
            })
          }
        })
      },
      handleEditSubLib() {
        this.dialogStatus = 'update'
        this.addDiaVis = true
        this.subLibForm = {
          type: this.selectedSubLib.type,
          description: this.selectedSubLib.description
        }
        this.$nextTick(() => {
          this.$refs['subLibForm'].clearValidate()
        })
      },
      updateSubLib() {
        this.$refs['subLibForm'].validate((valid) => {
          if (valid) {
            var qs = require('qs')
            let data = {
              type: this.subLibForm.type,
              description: this.subLibForm.description
            }
            let dataPost = qs.stringify(data)
            updateSubLibrary(this.selectedId, dataPost).then((res) => {
              if(res.data.code === 0) {
                this.$notify({
                  title: '成功',
                  message: '库修改成功',
                  type: 'success',
                  duration: 2000
                })
                this.getSublibraries(this.libId)
                this.selectedId = ''
                this.selectedSubLib = null
              } else {
                this.$notify({
                  title: '失败',
                  message: res.data.msg,
                  type: 'error',
                  duration: 2000
                })
              }
              this.addDiaVis = false
            }).catch(() => {
              this.$notify({
                title: '失败',
                message: '操作失败',
                type: 'error',
                duration: 2000
              })
            })
          }
        })
      },
      handleDeleteSubLib() {
        this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteSubLibrary(this.selectedId).then((res) => {
            if(res.data.code === 0) {
              this.$notify({
                title: '成功',
                message: '库删除成功',
                type: 'success',
                duration: 2000
              })
              this.getSublibraries(this.libId)
            } else {
              this.$notify({
                title: '失败',
                message: res.data.msg,
                type: 'error',
                duration: 2000
              })
            }
          }).catch(() => {
            this.$notify({
              title: '失败',
              message: '操作失败',
              type: 'error',
              duration: 2000
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消清除'
          })
        })
      }
    },
    computed: {
      computedActive() {
        return function (id) {
          if(id === this.selectedId) {
            return 'active-item'
          } else {
            return ''
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .sub-container {
    margin-top: 10px;
    padding: 4px 20px 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    border-top: 1px solid #efefef;
    // 禁止选中文字
    -moz-user-select:none; /*火狐*/
    -webkit-user-select:none; /*webkit浏览器*/
    -ms-user-select:none; /*IE10*/
    user-select:none;
    .sub-item {
      border: 1px solid #fff;
      margin: 0 4px 4px 0;
      position: relative;
      align-items: center;
      width: 100px;
      display: inline-block;
      text-align: center;
      cursor: pointer;
      padding: 10px 10px;
      border-radius: 6px;
      &:hover {
        background: #f1f5fa;
        .active-flag {
          display: inline-block;
        }
      }
      .active-flag {
        display: none;
        position: absolute;
        top: 2px;
        right: 2px;
        font-size: 16px;
      }
      .sub-icon {
        font-size: 60px;
      }
      .sub-text {
        display: block;
        text-align: center;
        font-size: 12px;
        width: 100%;
        overflow:hidden;
        text-overflow:ellipsis;
        -o-text-overflow:ellipsis;
        white-space:nowrap;
        color:#424e67;
        .text {
          &:hover {
            color: #4A9FF9;
          }
        }
      }
    }
    .sub-item.active-item {
      background: #f1f5fa;
      border-color: #90d8ff;
      .active-flag {
        display: inline-block;
      };
    }
  }
  .operation-container {
    margin-top: 20px;
    padding: 0px 20px 0 30px;
    color: #4A9FF9;
    height: 30px;
    .operation-item {
      margin-right: 14px;
      padding: 4px 8px;
      border: 1px solid #C3EAFF;
      border-radius: 4px;
      font-weight: 400;
      font-size: 13px;
      cursor: pointer;
    }
  }
</style>
