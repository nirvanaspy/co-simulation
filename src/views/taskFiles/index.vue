<template>
  <div class="app-container calendar-list-container" id="components">
    <span style="position: absolute;top: 80px;left: 27px;">
      <el-button type="primary" @click="handleCommit">提交审核</el-button>
    </span>
    <div style="height: 100%;overflow: auto;width: 100%;padding:5px 0 10px 10px;">
      <comFileManage :selectCompId="selectedId" :selectCompName="selectdName"></comFileManage>
    </div>
    <el-dialog title="新建任务" :visible.sync="commitDialog" append-to-body width="60%" class="limit-width-dialog">
      <el-table
        ref="multipleTable"
        :data="userList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="用户名"
          min-width="120">
          <template slot-scope="scope">{{ scope.row.username }}</template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="commitToAuditor">确定</el-button>
    </el-dialog>
  </div>
</template>

<script>
  /* eslint-disable */
  import comFileManage from '@/views/fileManager/filecomp'
  import { allUser } from '@/api/getUsers'
  import { setAuditors } from '@/api/pro-design-link'

  export default {
    name: 'taskFiles',
    data() {
      return {
        selectedId: '',
        userId: '',
        selectdName: '',
        commitDialog: false,
        getMaLoading: false,
        userList: [],
        auditors: []
      }
    },
    components: {
      comFileManage,
    },
    created() {
      this.userId = this.getCookie('userId')
      this.selectedId = this.$route.params.id
      this.selectedName = this.$route.query.name
    },
    methods: {
      getAbleUser() {
        this.getMaLoading = true
        allUser().then((res) => {
          if(res.data.code === 0) {
            this.userList = res.data.data
            this.getMaLoading = false
          } else {
            this.getMaLoading = false
          }
        }).catch(() => {
          this.getMaLoading = false
        })
      },
      handleSelectionChange(val) {
        this.auditors = val
      },
      handleCommit() {
        this.commitDialog = true
        this.getAbleUser()
      },
      commitToAuditor() {
        let ids = []
        this.auditors.forEach((item) => {
          ids.push(item.id)
        })
        let auditorIds = (ids + '').replace(/\[|]/g, '')
        var qs = require('qs')
        let data = {
          'ids': auditorIds,
          'userId': this.userId
        }
        let datapost = qs.stringify(data)
        setAuditors(this.selectedId, datapost).then((res) => {
          if(res.data.code === 0) {
            this.$notify({
              title: '成功',
              message: '设置成功',
              type: 'success',
              duration: 2000
            })
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
  }
</script>

<style scoped>
  .el-button+.el-button {
    margin-left: 0;
  }
  .el-dialog__body {
    padding: 30px 20px;
    color: #606266;
    line-height: 24px;
    font-size: 14px;
    height: 440px;
    overflow-y: auto;
  }

  .el-dialog {
    margin-top: 10vh;
  }
  .button-container{
    position: absolute;
    bottom: 0;
    right: 15px;
  }
  .popover-close {
    display: block;
    text-align: right;
    font-size: 20px;
  }
  .close-icon {
    cursor: pointer;
  }
  .icon-show-popover {
    cursor: pointer;
    color: #337ab7;
  }
</style>
