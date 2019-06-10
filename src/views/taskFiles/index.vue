<template>
  <div class="app-container calendar-list-container" id="components">
    <div class="task-text">
      <span class="text">{{taskName}}</span>
      <span class="text" style="color: #67C23A" v-if="computeCurrentState === '审批结束 已通过'">{{computeCurrentState}}</span>
      <span class="text" style="color: #e6a23c;" v-else>{{computeCurrentState}}</span>
    </div>
    <span class="task-detail">
      <!--<div class="task-text">
        <span class="text">{{taskName}}</span>
        <span class="text" style="color: #e6a23c;font-size: 12px;">{{computeCurrentState}}</span>
      </div>-->
      <el-button type="primary" size="small" @click="handleCommit" :disabled="!ableToCommit">提交审核</el-button>
      <el-button type="primary" size="small" @click="handleApplySecondEdit" v-if="showSecondEditApply">申请二次修改</el-button>
      <!--<el-button type="primary" size="small">直接修改</el-button>-->
    </span>
    <div style="height: 100%;overflow: auto;width: 100%;padding:5px 0 10px 10px;">
      <comFileManage :selectCompId="selectedId" :selectCompName="selectdName" :proClass="proSecretClass" ref="fileComp"></comFileManage>
    </div>
    <el-dialog title="选择审核人" :visible.sync="commitDialog" append-to-body width="60%" class="limit-width-dialog audit-dialog">
      <el-form label-position="left" label-width="80px">
        <el-form-item label="审批流程" v-if="commitType === 'editCommit'">
          <el-select v-model="ifBackToStart" placeholder="请选择提交的目标审批流程" style="width: 100%">
            <el-option
              v-for="item in ifToStartOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会签模式">
          <el-radio-group v-model="signType">
            <el-radio :label="1">无会签</el-radio>
            <el-radio :label="2">一人会签通过</el-radio>
            <el-radio :label="3">多人会签通过</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-collapse v-model="activeNames" accordion class="audit-collapse">
        <el-collapse-item title="选择校对人" name="1">
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
              :data="computeList"
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
        <el-button type="primary" @click="commitToAuditor" style="margin-top: 10px;" :loading="commitLoading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  /* eslint-disable */
  import comFileManage from '@/views/fileManager/filecomp'
  import { allUser } from '@/api/getUsers'
  import { setAuditors, getSubtaskDetail, applyForTaskAudit } from '@/api/pro-design-link'

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
        countersignList: [],
        commitLoading: false,
        showSecondEditApply: false,
        ableToCommit: false,
        subtaskName: '',
        commitType: '',
        ifToStartOptions: [
          {
            label: '提交到初始审核流程',
            value: true
          },
          {
            label: '提交到被驳回的审核流程',
            value: false
          }
        ],
        ifBackToStart: true,
        taskName: '',
        taskState: null,
        taskIfPass: false,
        myTimer: null
      }
    },
    components: {
      comFileManage,
    },
    created() {
      this.userId = this.getCookie('userId')
      this.selectedId = this.$route.params.id !== ':id' ? this.$route.params.id : this.getCookie('taskSelectedId')
      this.taskName = this.$route.query.name ? this.$route.query.name : decodeURI(unescape(this.getCookie('taskSelectedName')))
      this.proSecretClass = this.$route.query.proClass ? parseInt(this.$route.query.proClass) : parseInt(this.getCookie('taskSelectedClass'))
      this.getSubtaskDetails()
      if(this.myTimer) {
        clearInterval(this.myTimer)
      }
      this.myTimer = setInterval(() => {
        this.refreshSubTaskDetail()
        this.$refs.fileComp.refreshFileList()
      }, 20000)
    },
    destroyed() {
      if(this.myTimer) {
        clearInterval(this.myTimer)
      }
    },
    methods: {
      refreshSubTaskDetail() {
        getSubtaskDetail(this.selectedId).then((res) => {
          if(res.data.code === 0) {
            let subtaskObj = res.data.data
            this.taskState = subtaskObj.state
            this.taskIfPass = subtaskObj.ifApprove
            if(subtaskObj.state === 7 && (subtaskObj.ifApprove === true || subtaskObj.ifReject === true)) {
              this.showSecondEditApply = true
            } else {
              this.showSecondEditApply = false
            }
            if(subtaskObj.state === 1 || subtaskObj.state === 9 || (subtaskObj.state === 7 && subtaskObj.ifReject === true)) {
              this.$refs.fileComp.showUploadFlag = true
              this.ableToCommit = true
            } else {
              this.$refs.fileComp.showUploadFlag = false
              this.ableToCommit = false
            }
          } else {
            this.ableToCommit = true
            this.$refs.fileComp.showUploadFlag = true
          }
        })
      },
      getSubtaskDetails() {
        this.$nextTick(() => {
          this.ableToCommit = false
          this.$refs.fileComp.showUploadFlag = false
        })
        getSubtaskDetail(this.selectedId).then((res) => {
          if(res.data.code === 0) {
            let subtaskObj = res.data.data
            this.taskState = subtaskObj.state
            this.taskIfPass = subtaskObj.ifApprove
            if(subtaskObj.state === 7 && (subtaskObj.ifApprove === true || subtaskObj.ifReject === true)) {
              this.showSecondEditApply = true
            } else {
              this.showSecondEditApply = false
            }
            if(subtaskObj.state === 1 || subtaskObj.state === 9 || (subtaskObj.state === 7 && subtaskObj.ifReject === true)) {
              this.$refs.fileComp.showUploadFlag = true
              this.ableToCommit = true
            } else {
              this.$refs.fileComp.showUploadFlag = false
              this.ableToCommit = false
            }
          } else {
            this.ableToCommit = true
            this.$refs.fileComp.showUploadFlag = true
          }
        })
      },
      getAbleUser() {
        this.getMaLoading = true
        allUser().then((res) => {
          if(res.data.code === 0) {
            this.userList = []
            res.data.data.forEach((item) => {
              if(item.username !== 'admin' && item.username !== 'securityGuard' && item.username !== 'securityAuditor') {
                this.userList.push(item)
              }
            })
            this.countersignList = this.userList.slice(0)
            // 筛选会签用户
            for(let i=0;i<this.countersignList.length;i++){
              if(this.countersignList[i].id === this.userId){
                this.countersignList.splice(i,1)
                break
              }
            }
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
        if(this.$refs.fileComp.list.length === 0) {
          this.$notify({
            title: '失败',
            message: '请先上传子任务文件',
            type: 'error',
            duration: 2000
          })
          return
        }

        for(let i = 0; i < this.$refs.fileComp.list.length; i++) {
          if(this.$refs.fileComp.list[i].subDepotSet.length > 1) {
            this.$confirm('库中有文件同时属于多个库，确认继续提交吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.commitDialog = true
              this.signType = 0
              this.getAbleUser()
              return
            }).catch(() => {
              return
            })
            return
          }
        }
        let subtaskObj = this.$refs.fileComp.list[0].subtask
        if(subtaskObj.state == 1 && subtaskObj.ifReject == false && subtaskObj.ifApprove == false) {
          this.commitType = 'firstCommit'
        }
        if(subtaskObj.state == 7 && subtaskObj.ifReject == true) {
          this.commitType = 'editCommit'
        }
        if(subtaskObj.state == 9) {
          this.commitType = 'secondCommit'
        }
        if(subtaskObj)
        this.commitDialog = true
        this.signType = 0
        this.getAbleUser()
        this.getSubtaskDetails()
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

        // 校验四类人员选择是否正确
        if(myCollatorIds.length === 0) {
          this.$message({
            message: '请选择校对人',
            type: 'warning'
          })
          return
        }
        if(myAuditIds.length === 0) {
          this.$message({
            message: '请选择审核人',
            type: 'warning'
          })
          return
        }
        if(myCountersignIds.length === 0 && this.signType !== 1) {
          this.$message({
            message: '请选择会签人',
            type: 'warning'
          })
          return
        }
        if(myApproveIds.length === 0) {
          this.$message({
            message: '请选择批准人',
            type: 'warning'
          })
          return
        }

        let collatorIds = (myCollatorIds + '').replace(/\[|]/g, '')
        let auditIds = (myAuditIds + '').replace(/\[|]/g, '')
        let countersignIds = (myCountersignIds + '').replace(/\[|]/g, '')
        let approveIds = (myApproveIds + '').replace(/\[|]/g, '')

        var qs = require('qs')
        let data = {
          'proofreadUserIds': collatorIds,
          'auditUserIds': auditIds,
          'countersignUserIds': this.signType === 1 ? '' : countersignIds, // 1:无会签 2:一人会签 3:多人会签
          'approveUserIds': approveIds,
          'commitMode': 0, // 0: 一次提交； 1：直接修改； 2：二次修改；
          'auditMode': this.signType,
          'userId': this.userId,
          'ifBackToStart': this.commitType === 'editCommit' ? this.ifBackToStart : false
        }
        if(this.commitType === 'firstCommit') {
          data.commitMode = 0
        } else if(this.commitType === 'editCommit') {
          data.commitMode = 1
        } else if(this.commitType === 'secondCommit') {
          data.commitMode = 2
        }
        let datapost = qs.stringify(data)
        this.commitLoading = true
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
          this.commitLoading = false
          this.getSubtaskDetails()
        }).catch(() => {
          this.$notify({
            title: '失败',
            message: '提交失败',
            type: 'error',
            duration: 2000
          })
          this.commitLoading = false
        })
      },
      handleApplySecondEdit() {
        this.$confirm('确认申请二次修改吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          applyForTaskAudit(this.selectedId).then((res) => {
            if(res.data.code === 0) {
              this.$notify({
                title: '成功',
                message: '申请成功',
                type: 'success',
                duration: 2000
              })
              this.getSubtaskDetails()
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
            message: '已取消申请'
          })
        })
      }
    },
    computed: {
      computeList() {
        let list = []
        if(this.signType === 3) {
          list = this.countersignList
        } else {
          list = this.userList
        }
        return list
      },
      computeCurrentState() {
        if(this.taskState === null) {
          return '--'
        }
        if(this.taskState === 0) {
          return '未开始'
        }
        if(this.taskState === 1) {
          return '进行中'
        }
        if(this.taskState === 2) {
          return '待审批'
        }
        if(this.taskState === 3) {
          return '校对中'
        }
        if(this.taskState === 4) {
          return '审核中'
        }
        if(this.taskState === 5) {
          return '会签中'
        }
        if(this.taskState === 6) {
          return '批准中'
        }
        if(this.taskState === 7) {
          if(this.taskIfPass === true) {
            return '审批结束 已通过'
          } else if(this.taskIfPass === false) {
            return '审批结束 已驳回'
          }
          return '审批结束'
        }
        if(this.taskState === 8) {
          return '申请二次修改中'
        }
        if(this.taskState === 9) {
          return '二次修改中'
        }
      },
      computeShowBtn() {
        return function (list) {
          let flag = false
          let subtaskObj
          if(list) {
            if(list[0]) {
              subtaskObj = list[0].subtask
            } else {
              return false
            }
            if(subtaskObj.state === 7 && (subtaskObj.ifApprove === true || subtaskObj.ifReject === true)) {
              flag = true
            }
          }
          return flag
        }
      }
      /*computeShowBtn() {
        let flag = false
        let subtaskObj
        if(this.$refs.fileComp !== undefined) {
          if(this.$refs.fileComp.list[0]) {
            subtaskObj = this.$refs.fileComp.list[0].subtask
          } else {
            return false
          }
          if(subtaskObj.state === 7 && (subtaskObj.ifApprove === true || subtaskObj.ifReject === true)) {
            flag = true
          }
        }
        return flag
      }*/
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
  .task-detail {
    position: absolute;
    top: 88px;
    left: 30px;
  }
  .task-text {
    display: block;
    height: 20px;
    position: absolute;
    top: 66px;
    left: 32px;
  }
  .task-text .text {
    font-size: 12px;
    color: #777;
    margin-right: 10px;
    display: inline-block;
  }
</style>
