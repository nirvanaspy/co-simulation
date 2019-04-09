<template>
  <div class="taskContainer">
    <el-tabs type="border-card">
      <el-tab-pane label="我的校对">
        <el-table :data="collatorList" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                  style="width: 100%">
          <el-table-column align="left" min-width="200px" label="文件名称">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="200px" label="我的结果">
            <template slot-scope="scope">
              <span>
                <el-tag type="info">{{computeMyPassState(scope.row, 0)}}</el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="200px" label="最终结果">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.ifApprove === true">已通过</el-tag>
              <el-tag type="danger" v-if="scope.row.ifReject === true">已驳回</el-tag>
              <el-tag type="warning" v-if="scope.row.ifApprove === false && scope.row.ifReject === false">处理中</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="200px" label="审批意见">
            <template slot-scope="scope">
              <span>
                <el-button type="primary" plain size="mini" @click="checkOpinion(scope.row, 2)">查看</el-button>
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="200px" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary">预览文件</el-button>
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  <el-button size="mini" type="warning" :disabled="scope.row.state > 1||scope.row.state==1 || scope.row.ifReject == true">
                    审批
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :disabled="scope.row.state > 1||scope.row.state==1 || scope.row.ifReject == true">
                    <span style="display:inline-block;padding:0 10px;" @click="handlePassApply(scope.row, 1)">通过</span>
                  </el-dropdown-item>
                  <el-dropdown-item :disabled="scope.row.state > 1||scope.row.state==1 || scope.row.ifReject == true">
                    <span style="display:inline-block;padding:0 10px;" @click="handleDenyApply(scope.row, 1)">不通过</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="我的审核">
        <el-table :data="auditorList" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                  style="width: 100%">
          <el-table-column align="left" min-width="200px" label="文件名称">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="200px" label="我的结果">
            <template slot-scope="scope">
              <span>
                <el-tag type="info">{{computeMyPassState(scope.row, 1)}}</el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="200px" label="最终结果">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.ifApprove === true">已通过</el-tag>
              <el-tag type="danger" v-if="scope.row.ifReject === true">已驳回</el-tag>
              <el-tag type="warning" v-if="scope.row.ifApprove === false && scope.row.ifReject === false">处理中</el-tag>
            </template>
          </el-table-column>
          <!--<el-table-column align="center" min-width="200px" label="是否通过">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.passState > 3">已通过</el-tag>
              <el-tag type="danger" v-if="scope.row.passState === 0">已驳回</el-tag>
              <el-tag type="warning" v-else>待处理</el-tag>
            </template>
          </el-table-column>-->
          <el-table-column align="center" min-width="200px" label="审批意见">
            <template slot-scope="scope">
              <span>
                <el-button type="primary" plain size="mini"  @click="checkOpinion(scope.row, 3)">查看</el-button>
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="200px" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary">预览文件</el-button>
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  <el-button size="mini" type="warning" :disabled="scope.row.state !== 2 || scope.row.ifReject == true">
                    审批
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :disabled="scope.row.state !== 2 || scope.row.ifReject == true">
                    <span style="display:inline-block;padding:0 10px;" @click="handlePassApply(scope.row, 2)">通过</span>
                  </el-dropdown-item>
                  <el-dropdown-item :disabled="scope.row.state !== 2 || scope.row.ifReject == true">
                    <span style="display:inline-block;padding:0 10px;" @click="handleDenyApply(scope.row, 2)">不通过</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="我的会签">
        <el-table :data="countersignList" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                  style="width: 100%">
          <el-table-column align="left" min-width="200px" label="文件名称">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="200px" label="我的结果">
            <template slot-scope="scope">
              <span>
                <el-tag type="info">{{computeMyPassState(scope.row, 2)}}</el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="200px" label="最终结果">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.ifApprove === true">已通过</el-tag>
              <el-tag type="danger" v-if="scope.row.ifReject === true">已驳回</el-tag>
              <el-tag type="warning" v-if="scope.row.ifApprove === false && scope.row.ifReject === false">处理中</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="200px" label="审批意见">
            <template slot-scope="scope">
              <span>
                <el-button type="primary" plain size="mini" @click="checkOpinion(scope.row, 4)">查看</el-button>
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="200px" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary">预览文件</el-button>
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  <el-button size="mini" type="warning" :disabled="scope.row.state !== 3||computedAssessState(scope.row) || scope.row.state > 3 || scope.row.ifReject == true">
                    审批
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :disabled="scope.row.state !== 3|| computedAssessState(scope.row) || scope.row.state > 3 || scope.row.ifReject == true">
                    <span style="display:inline-block;padding:0 10px;" @click="handlePassApply(scope.row, 3)">通过</span>
                  </el-dropdown-item>
                  <el-dropdown-item :disabled="scope.row.state !== 3|| computedAssessState(scope.row) || scope.row.state > 3 || scope.row.ifReject == true">
                    <span style="display:inline-block;padding:0 10px;" @click="handleDenyApply(scope.row, 3)">不通过</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="我的批准">
        <el-table :data="approverList" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                  style="width: 100%">
          <el-table-column align="left" min-width="200px" label="文件名称">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="200px" label="我的结果">
            <template slot-scope="scope">
              <span>
                <el-tag type="info">{{computeMyPassState(scope.row, 3)}}</el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="200px" label="最终结果">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.ifApprove === true">已通过</el-tag>
              <el-tag type="danger" v-if="scope.row.ifReject === true">已驳回</el-tag>
              <el-tag type="warning" v-if="scope.row.ifApprove === false && scope.row.ifReject === false">处理中</el-tag>
            </template>
          </el-table-column>
          <!--<el-table-column align="center" min-width="200px" label="是否通过">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.state > 5">已通过</el-tag>
              <el-tag type="danger" v-if="scope.row.passState === 0">已驳回</el-tag>
              <el-tag type="warning" v-else>待处理</el-tag>
            </template>
          </el-table-column>-->
          <el-table-column align="center" min-width="200px" label="审批意见">
            <template slot-scope="scope">
              <span>
                <el-button type="primary" plain size="mini" @click="checkOpinion(scope.row, 5)">查看</el-button>
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="200px" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary">预览文件</el-button>
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  <el-button size="mini" type="warning" :disabled="scope.row.state !== 4 || scope.row.ifReject == true || scope.row.ifApprove == true">
                  <!--scope.row.userEntity.id==userId?true:scope.row.state !== 5-->
                    审批
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :disabled="scope.row.state !== 4 || scope.row.ifReject == true || scope.row.ifApprove == true">
                    <span style="display:inline-block;padding:0 10px;" @click="handlePassApply(scope.row, 4)">通过</span>
                  </el-dropdown-item>
                  <el-dropdown-item :disabled="scope.row.state !== 4 || scope.row.ifReject == true || scope.row.ifApprove == true">
                    <span style="display:inline-block;padding:0 10px;" @click="handleDenyApply(scope.row, 4)">不通过</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="查看文件" :visible.sync="fileDialog" append-to-body width="80%">
      <comFileManage :selectCompId="selectedId" :selectCompName="selectedName" :forUse="preview"></comFileManage>
    </el-dialog>
    <el-dialog title="填写审批意见" :visible.sync="opinionDialog" append-to-body width="60%" class="limit-width-dialog">
      <el-form :model="opinionForm" status-icon :rules="rules" ref="opinionForm" label-width="100px" class="demo-ruleForm" label-position="left">
        <el-form-item prop="text" label="审批意见">
          <el-input type="textarea" v-model="opinionForm.text" :rows="6"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="opinionDialog = false">取 消</el-button>
        <el-button type="primary" v-if="dialogStatus === 'pass'" @click="passApply()" :loading="commitLoading">确 定</el-button>
        <el-button type="primary" v-if="dialogStatus === 'deny'" @click="denyApply()" :loading="commitLoading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="查看审批意见" :visible.sync="opinionTextDialog" append-to-body width="80%">
      <el-table :data="opinionList" v-loading="opinionLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                style="width: 100%">
        <el-table-column align="center" min-width="80px" label="审批人">
          <template slot-scope="scope">
            <span>{{scope.row.userEntity.username}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="120px" label="所属审核流程">
          <template slot-scope="scope">
            <span>{{computedCurrentState(scope.row.state)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="120px" label="审批结果">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.ifPass">已通过</el-tag>
            <el-tag type="danger" v-else>未通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="200px" label="审核时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="200px" label="审批意见">
          <template slot-scope="scope">
            {{scope.row.auditDescription !== null ? scope.row.auditDescription : '无'}}
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="opinionTextDialog = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  /*eslint-disable*/
  import comFileManage from '@/views/fileManager/filecomp'
  import { getAuditTasks, assessSubtask, getOpinion, getAllOpinion} from '@/api/pro-design-link'
  import { getAuditLibFilesByUser, auditLibFile, getFileAudits } from '@/api/sublibFIles'
  export default {
    name: 'subLibFileAudit',
    data () {
      return {
        userId: '',
        dialogStatus: '',
        selectedTaskId: '',
        assessState: '',
        listLoading: true,
        opinionLoading: false,
        commitLoading: false,
        fileDialog: false,
        opinionDialog: false,
        opinionTextDialog: false,
        userId: '',
        selectedId: '',
        selectedName: '',
        collatorList: [],
        auditorList: [],
        approverList: [],
        countersignList: [],
        opinionList: [],
        preview: 'preview',
        opinionForm: {
          text: ''
        },
        rules: {
          text: [
            { required: false, message: '请输入活动审批意见', trigger: 'blur' }
          ],
        },
        maps: [],
        currenttaskid: 0,
        currentAuditMode: 0,
        // assessState: 0
      }
    },
    components: {
      comFileManage
    },
    created() {
      console.log(this.selectedName)
      this.userId = this.getCookie('userId')
      this.getAuditTaskList(this.userId)
    },
    methods: {
      getAuditTaskList() {
        getAuditLibFilesByUser(this.userId).then((res) => {
          if(res.data.code === 0) {
            this.collatorList = res.data.data.proofreadFiles
            this.auditorList = res.data.data.auditFiles
            this.approverList = res.data.data.approveFiles
            this.countersignList = res.data.data.countersignFiles
            // 对状态进行处理
            if(res.data.data.alreadyAudit){
              this.maps=res.data.data.alreadyAudit
              // console.log("maps"+this.maps)
            }
            this.listLoading = false
          } else {
            this.listLoading = false
          }
        }).catch(() => {
          this.listLoading = false
        })
      },
      checkAuditDetail(row) {
        this.selectedId = row.id
        this.selectedName = row.name
        this.fileDialog = true
      },
      handlePassApply(row, state) {
        // 当用户是当前子任务的创建者，则直接忽略通过
        if(row.userEntity.id==this.userId) {
          this.currenttaskid=row.userEntity.id
        }
        this.dialogStatus = 'pass'
        this.opinionDialog = true
        this.opinionForm.text = ''
        this.selectedTaskId = row.id
        this.assessState = state
        this.currentAuditMode = row.auditMode
        this.$nextTick(() => {
          this.$refs['opinionForm'].clearValidate()
        })
      },
      handleDenyApply(row, state) {
        this.dialogStatus = 'deny'
        this.opinionDialog = true
        this.opinionForm.text = ''
        this.selectedTaskId = row.id
        this.assessState = state
        this.currentAuditMode = row.auditMode
        this.$nextTick(() => {
          this.$refs['opinionForm'].clearValidate()
        })
      },
      passApply() {
        // 对于自己通过自己则直接返回
        if(this.currenttaskid==this.userId) {
          this.$notify({
            title: '失败',
            message: '无法审核通过自己',
            type: 'error',
            duration: 2000
          })
          this.opinionDialog = false
          return
        }
        this.$refs['opinionForm'].validate((valid) => {
          if (valid) {
            this.$confirm('确认通过吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              // this.commitLoading = true
              var qs = require('qs')
              let data = {
                userId: this.userId,
                state: this.assessState,  // 当前流程
                ifPass: 1, // 通过或未通过
                auditDescription: this.opinionForm.text, // 审核说明
                auditMode: this.currentAuditMode // 会签状态
              }
              let datapost = qs.stringify(data)
              auditLibFile(this.selectedTaskId, datapost).then((res) => {
                if(res.data.code === 0) {
                  this.$notify({
                    title: '成功',
                    message: '通过成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.getAuditTaskList()
                  this.opinionDialog = false
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
                message: '已取消操作'
              })
            })
          } else {
            return false;
          }
        })
      },
      denyApply() {
        this.$refs['opinionForm'].validate((valid) => {
          if (valid) {
            this.$confirm('确认驳回吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              var qs = require('qs')
              let data = {
                userId: this.userId,
                state: this.assessState,  // 当前流程
                passState: 0, // 通过或未通过
                auditDescription: this.opinionForm.text, // 审核说明
                auditMode: this.currentAuditMode // 会签状态
              }
              let datapost = qs.stringify(data)
              auditLibFile(this.selectedTaskId, datapost).then((res) => {
                if(res.data.code === 0) {
                  this.$notify({
                    title: '成功',
                    message: '驳回成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.getAuditTaskList()
                  this.opinionDialog = false
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
                message: '已取消操作'
              })
            })
          } else {
            return false;
          }
        })
      },
      checkOpinion(row, state) {
        this.opinionTextDialog = true
        /*getAllOpinion(row.id, state).then((res) => {
          if(res.data.code === 0) {
            this.opinionList = res.data.data
          }
        })*/
        this.opinionLoading = true
        getFileAudits(row.id).then((res) => {
          if(res.data.code === 0) {
            this.opinionList = res.data.data
            this.opinionLoading = false
          } else {
            this.opinionLoading = false
          }
        }).catch(() => {
          this.opinionLoading = false
        })
      }
    },
    computed: {
      computedCurrentState() {
        return function(state) {
          if(state === 1) {
            return '校对'
          }
          if(state === 2) {
            return '审核'
          }
          if(state === 3) {
            return '会签'
          }
          if(state === 4) {
            return '批准'
          }
        }
      },
      computedAssessState(){
        return function(row) {
          let assessState = false
          for(let i=0;i<this.maps.length;i++){
            // 多人会签判断会签人身份（是否已经会签），判断会签任务id（确定唯一会签）
            if(this.maps[i].state === 3) {
              if(this.maps[i].userEntity.id == this.userId && this.maps[i].sublibraryFilesEntity.id == row.id){
                console.log(this.maps[i])
                assessState = true
                break
              }
            }
          }
          return assessState
        }
      },
      computeMyPassState() {
        return function (row, assessState) {
          for (let i = 0; i < this.maps.length; i++) {
            if(this.maps[i].userEntity.id==this.userId && this.maps[i].sublibraryFilesEntity.id==row.fileEntity.id && this.maps[i].assessState == assessState) {
              if(this.maps[i].pass === true) {
                return '已通过'
              } else {
                return '已驳回'
              }
            }
          }
          return '未处理'
        }
      }
    }
  }
</script>

<style scoped>
  .taskContainer {
    padding: 20px;
  }
  #testscop{
    position:fixed;
    color:red;
  }
</style>
