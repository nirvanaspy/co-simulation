<template>
  <div class="applyContainer">
    <div v-if="username === 'admin'">
      <el-table :data="applyList" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                style="width: 100%">
        <el-table-column align="center" min-width="200px" label="文件名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="120px" label="所属库">
          <template slot-scope="scope">
            <span>{{scope.row.subDepot.type}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="200px" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleAuditApply(scope.row, true)" :disabled="scope.row.state !== 7">通过</el-button>
            <el-button type="danger" size="mini"  @click="handleAuditApply(scope.row, false)" :disabled="scope.row.state !== 7">驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else>
      <el-table :data="taskApplyList" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                style="width: 100%">
        <el-table-column align="center" min-width="200px" label="子任务名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="120px" label="所属项目">
          <template slot-scope="scope">
            <span>{{scope.row.project.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="200px" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleAuditApply(scope.row, true)" :disabled="scope.row.state !== 8">通过</el-button>
            <el-button type="danger" size="mini"  @click="handleAuditApply(scope.row, false)" :disabled="scope.row.state !== 8">驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  /*eslint-disable*/
  import { getEditApply, handleApply } from '@/api/sublibFiles';
  import { getTaskEditApply, handleTaskEditApply } from '@/api/pro-design-link';
  export default {
    name: 'auditApply',
    data () {
      return {
        applyList: [],
        taskApplyList: [],
        listLoading: false,
        username: '',
        userId: ''
      }
    },
    created() {
      this.username = this.getCookie('username')
      this.userId = this.getCookie('userId')
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        if(this.username === 'admin') {
          getEditApply().then(res => {
            if(res.data.code === 0) {
              this.applyList = res.data.data
              this.listLoading = false
            } else {
              this.listLoading = false
            }
          }).catch(() => {
            this.listLoading = false
          })
        } else {
          getTaskEditApply(this.userId).then(res => {
            if(res.data.code === 0) {
              this.taskApplyList = res.data.data
              this.listLoading = false
            } else {
              this.listLoading = false
            }
          }).catch(() => {
            this.listLoading = false
          })
        }
      },
      handleAuditApply(row, flag) {
        let confirmText = ''
        if (flag === true) {
          confirmText = '确认同意申请吗？'
        } else if(flag === false) {
          confirmText = '确认驳回申请吗？'
        }
        let qs = require('qs')
        let data = {
          ifModifyApprove: flag
        }
        let postData = qs.stringify(data)
        if(this.username === 'admin') {
          handleApply(row.id, postData).then((res) => {
            if(res.data.code === 0) {
              this.$notify({
                title: '成功',
                message: '操作成功！',
                type: 'success',
                duration: 2000
              })
              this.getList()
            } else {
              this.$notify({
                title: '失败',
                message: res.data.msg,
                type: 'error',
                duration: 2000
              })
            }
          })
        } else {
          handleTaskEditApply(row.id, postData).then((res) => {
            if(res.data.code === 0) {
              this.$notify({
                title: '成功',
                message: '操作成功！',
                type: 'success',
                duration: 2000
              })
              this.getList()
            } else {
              this.$notify({
                title: '失败',
                message: res.data.msg,
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      }
    },
  }
</script>

<style scoped>
  .applyContainer {
    height: calc(100% - 60px) !important;
    overflow: auto;
    padding: 20px;
  }
</style>
