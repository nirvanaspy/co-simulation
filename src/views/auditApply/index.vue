<template>
  <div class="applyContainer">
    <el-table :data="applyList" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" min-width="200px" label="文件名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="120px" label="所属库">
        <template slot-scope="scope">
          <span>{{scope.row.sublibraryEntity.type}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="200px" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleAuditApply(scope.row, true)" :disabled="scope.row.state !== 6">通过</el-button>
          <el-button type="danger" size="mini"  @click="handleAuditApply(scope.row, false)" :disabled="scope.row.state !== 6">驳回</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  /*eslint-disable*/
  import { getEditApply, handleApply } from '@/api/sublibFIles';
  export default {
    name: 'auditApply',
    data () {
      return {
        applyList: [],
        listLoading: false
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
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
      }
    },
  }
</script>

<style scoped>
  .applyContainer {
    padding: 20px;
  }
</style>
