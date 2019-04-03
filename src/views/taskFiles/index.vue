<template>
  <div class="app-container calendar-list-container" id="components">
    <span style="position: absolute;top: 80px;left: 27px;">
      <el-button type="primary" @click="handleCommit">提交审核</el-button>
    </span>
    <div style="height: 100%;overflow: auto;width: 100%;padding:5px 0 10px 10px;">
      <comFileManage :selectCompId="selectedId" :selectCompName="selectdName" :proClass="proSecretClass"></comFileManage>
    </div>
    <el-dialog title="选择审核人" :visible.sync="commitDialog" append-to-body width="60%" class="limit-width-dialog audit-dialog">
      <el-radio-group v-model="signType">
        <el-radio :label="1">无会签</el-radio>
        <el-radio :label="2">一人会签通过</el-radio>
        <el-radio :label="3">多人会签通过</el-radio>
      </el-radio-group>
      <el-collapse v-model="activeNames" class="audit-collapse">
        <el-collapse-item title="选择核对人" name="1">
          <div>
            <el-table
              v-loading="getMaLoading"
              ref="multipleTable"
              :data="userList"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleVerifySelectionChange">
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
          </div>
        </el-collapse-item>
        <el-collapse-item title="选择审核人" name="2">
          <div>
            <el-table
              v-loading="getMaLoading"
              ref="multipleTable"
              :data="userList"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleAuditSelectionChange">
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
          </div>
        </el-collapse-item>
        <el-collapse-item title="选择会签人" name="3" v-if="signType === 2 || signType === 3">
          <div>
            <el-table
              v-loading="getMaLoading"
              ref="multipleTable"
              :data="countersignList"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSignSelectionChange">
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
          </div>
        </el-collapse-item>
        <el-collapse-item title="选择批准人" name="4">
          <div>
            <el-table
              v-loading="getMaLoading"
              ref="multipleTable"
              :data="userList"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleApproveSelectionChange">
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
          </div>
        </el-collapse-item>
      </el-collapse>
      <div style="text-align: right" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="commitToAuditor" style="margin-top: 10px;">确定</el-button>
      </div>
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
        signType: 0,
        selectedId: '',
        userId: '',
        selectdName: '',
        commitDialog: false,
        getMaLoading: false,
        userList: [],
        verifyMembers: [],
        auditMembers: [],
        signMembers: [],
        approveMembers: [],
        activeNames: '',
        proSecretClass: null,
        countersignList: []
      }
    },
    components: {
      comFileManage,
    },
    created() {
      this.userId = this.getCookie('userId')
      this.selectedId = this.$route.params.id
      this.selectedName = this.$route.query.name
      this.proSecretClass = this.$route.query.proClass
    },
    methods: {
      getAbleUser() {
        this.getMaLoading = true
        allUser().then((res) => {
          if(res.data.code === 0) {
            this.userList = res.data.data
            // 筛选会签用户
            for(let i=0;i<this.userList.length;i++){
              if(this.userList[i].id!=this.userId){
                this.countersignList[this.countersignList.length]=this.userList[i]
              }
            }
            // this.countersignList
            this.getMaLoading = false
          } else {
            this.getMaLoading = false
          }
        }).catch(() => {
          this.getMaLoading = false
        })
      },
      handleVerifySelectionChange(val) {
        this.verifyMembers = val
      },
      handleAuditSelectionChange(val) {
        this.auditMembers = val
      },
      handleSignSelectionChange(val) {
        this.signMembers = val
      },
      handleApproveSelectionChange(val) {
        this.approveMembers = val
      },
      handleCommit() {
        this.commitDialog = true
        this.signType = 0
        this.getAbleUser()
      },
      commitToAuditor() {
        let myCollatorIds = [] //核对
        let myAuditIds = [] //审核
        let myCountersignIds = [] //会签
        let myApproveIds = [] //批准
        this.verifyMembers.forEach((item) => {
          myCollatorIds.push(item.id)
        })
        this.auditMembers.forEach((item) => {
          myAuditIds.push(item.id)
        })
        this.signMembers.forEach((item) => {
          myCountersignIds.push(item.id)
        })
        this.approveMembers.forEach((item) => {
          myApproveIds.push(item.id)
        })
        let collatorIds = (myCollatorIds + '').replace(/\[|]/g, '')
        let auditIds = (myAuditIds + '').replace(/\[|]/g, '')
        let countersignIds = (myCountersignIds + '').replace(/\[|]/g, '')
        let approveIds = (myApproveIds + '').replace(/\[|]/g, '')
        var qs = require('qs')
        let data = {
          'collatorIds': collatorIds,
          'auditIds': auditIds,
          'countersignIds': this.signType === 1 ? '' : countersignIds, // 1:无会签 2:一人会签 3:多人会签
          'approverIds': approveIds,
          /*'collatorIds': myCollatorIds,
          'auditIds': myAuditIds,
          'countersignIds': this.signType === 1 ? '' : myCountersignIds,
          'approverIds': myApproveIds,*/
          'countersignState': this.signType,
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
            this.commitDialog = false
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
