<template>
  <div class="taskContainer">
    <el-tabs type="border-card">
      <el-tab-pane label="我的校对">
        <el-table :data="collatorList" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                  style="width: 100%">
          <el-table-column align="center" min-width="200px" label="任务名称">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="200px" label="所属项目">
            <template slot-scope="scope">
              <span class="link-type" @click="jumpToPro(scope.row.projectEntity)">{{scope.row.projectEntity.name}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center"
                           min-width="200px"
                           label="审批状态"
                           prop="state"
                           :filters="[{ text: '已审批', value: 'proofed' }, { text: '未审批', value: 'notProofed' }]"
                           :filter-method="filterState"
          >
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
              <!--<el-tag type="success" v-if="scope.row.passState === 1">已通过</el-tag>
              <el-tag type="danger" v-if="scope.row.passState === 0">已驳回</el-tag>
              <el-tag type="warning" v-if="scope.row.passState === 2">处理中</el-tag>-->
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
              <el-button size="mini" type="primary" @click="checkAuditDetail(scope.row)">查看文件</el-button>
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  <el-button size="mini" type="warning" :disabled="scope.row.state > 3||scope.row.state==3 || scope.row.ifReject == true">
                    审批
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :disabled="scope.row.state > 3||scope.row.state==3 || scope.row.ifReject == true">
                    <span style="display:inline-block;padding:0 10px;" @click="handlePassApply(scope.row, 3)">通过</span>
                  </el-dropdown-item>
                  <el-dropdown-item :disabled="scope.row.state > 3||scope.row.state==3 || scope.row.ifReject == true">
                    <span style="display:inline-block;padding:0 10px;" @click="handleDenyApply(scope.row, 3)">不通过</span>
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
          <el-table-column align="center" min-width="200px" label="任务名称">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="200px" label="所属项目">
            <template slot-scope="scope">
              <span>{{scope.row.projectEntity.name}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center"
                           min-width="200px"
                           label="审批状态"
                           prop="state"
                           :filters="[{ text: '已审批', value: 'audited' }, { text: '未审批', value: 'notAudited' }]"
                           :filter-method="filterState"
          >
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
              <!--<el-tag type="success" v-if="scope.row.passState === 1">已通过</el-tag>
              <el-tag type="danger" v-if="scope.row.passState === 0">已驳回</el-tag>
              <el-tag type="warning" v-if="scope.row.passState === 2">处理中</el-tag>-->
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
              <el-button size="mini" type="primary" @click="checkAuditDetail(scope.row)">查看文件</el-button>
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  <el-button size="mini" type="warning" :disabled="scope.row.state !== 4 || scope.row.ifReject == true">
                    审批
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :disabled="scope.row.state !== 4 || scope.row.ifReject == true">
                    <span style="display:inline-block;padding:0 10px;" @click="handlePassApply(scope.row, 4)">通过</span>
                  </el-dropdown-item>
                  <el-dropdown-item :disabled="scope.row.state !== 4 || scope.row.ifReject == true">
                    <span style="display:inline-block;padding:0 10px;" @click="handleDenyApply(scope.row, 4)">不通过</span>
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
          <el-table-column align="center" min-width="200px" label="任务名称">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="200px" label="所属项目">
            <template slot-scope="scope">
              <span>{{scope.row.projectEntity.name}}</span>
            </template>
          </el-table-column>
          <!--<el-table-column align="center" min-width="200px" label="是否通过">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.state > 4">已通过</el-tag>
              <el-tag type="danger" v-if="scope.row.passState === 0">已驳回</el-tag>
              <el-tag type="warning" v-else>待处理</el-tag>
            </template>
          </el-table-column>-->
          <el-table-column
            align="center"
            min-width="200px"
            label="审批状态"
            prop="state"
            :filters="[{ text: '已审批', value: 'signed' }, { text: '未审批', value: 'notSigned' },]"
            :filter-method="filterState"
          >
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
              <!--<el-tag type="success" v-if="scope.row.passState === 1">已通过</el-tag>
              <el-tag type="danger" v-if="scope.row.passState === 0">已驳回</el-tag>
              <el-tag type="warning" v-if="scope.row.passState === 2">处理中</el-tag>-->
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
              <el-button size="mini" type="primary" @click="checkAuditDetail(scope.row)">查看文件</el-button>
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  <el-button size="mini" type="warning" :disabled="scope.row.state !== 5||computedAssessState(scope.row) || scope.row.state > 5 || scope.row.ifReject == true">
                    审批
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :disabled="scope.row.state !== 5|| computedAssessState(scope.row) || scope.row.state > 5 || scope.row.ifReject == true">
                    <span style="display:inline-block;padding:0 10px;" @click="handlePassApply(scope.row, 5)">通过</span>
                  </el-dropdown-item>
                  <el-dropdown-item :disabled="scope.row.state !== 5|| computedAssessState(scope.row) || scope.row.state > 5 || scope.row.ifReject == true">
                    <span style="display:inline-block;padding:0 10px;" @click="handleDenyApply(scope.row, 5)">不通过</span>
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
          <el-table-column align="center" min-width="200px" label="任务名称">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="200px" label="所属项目">
            <template slot-scope="scope">
              <span>{{scope.row.projectEntity.name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            min-width="200px"
            label="审批状态"
            prop="state"
            :filters="[{ text: '已审批', value: 'approved' }, { text: '未审批', value: 'notApproved' }]"
            :filter-method="filterState"
          >
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
              <!--<el-tag type="success" v-if="scope.row.passState === 1">已通过</el-tag>
              <el-tag type="danger" v-if="scope.row.passState === 0">已驳回</el-tag>
              <el-tag type="warning" v-if="scope.row.passState === 2">处理中</el-tag>-->
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
              <el-button size="mini" type="primary" @click="checkAuditDetail(scope.row)">查看文件</el-button>
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  <el-button size="mini" type="warning" :disabled="scope.row.state !== 6 || scope.row.ifReject == true || scope.row.ifApprove == true">
                  <!--scope.row.userEntity.id==userId?true:scope.row.state !== 5-->
                    审批
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :disabled="scope.row.state !== 6 || scope.row.ifReject == true || scope.row.ifApprove == true">
                    <span style="display:inline-block;padding:0 10px;" @click="handlePassApply(scope.row, 6)">通过</span>
                  </el-dropdown-item>
                  <el-dropdown-item :disabled="scope.row.state !== 6 || scope.row.ifReject == true || scope.row.ifApprove == true">
                    <span style="display:inline-block;padding:0 10px;" @click="handleDenyApply(scope.row, 6)">不通过</span>
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
        <el-button type="primary" v-if="dialogStatus === 'pass'" @click="passApply()" :loading="auditLoading">确 定</el-button>
        <el-button type="primary" v-if="dialogStatus === 'deny'" @click="denyApply()" :loading="auditLoading">确 定</el-button>
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
  import { getProjectAuth } from '@/api/project'
  export default {
    name: 'auditTask',
    data () {
      return {
        userId: '',
        dialogStatus: '',
        selectedTaskId: '',
        assessState: '',
        listLoading: false,
        fileDialog: false,
        opinionDialog: false,
        opinionTextDialog: false,
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
        maps: [],  //存取当前回传maps中的用户操作状态数组(maps废弃，当前存储的是userEntityList)
        auditLoading: false,
        opinionLoading: false,
        currentAuditMode: 0
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
        getAuditTasks(this.userId).then((res) => {
          if(res.data.code === 0) {
            this.collatorList = res.data.data.proofreadSubtask
            this.auditorList = res.data.data.auditSubtask
            this.approverList = res.data.data.approveSubtask
            this.countersignList = res.data.data.countersignSubtask
            // 多人会签操作状态获取
            this.maps=res.data.data.alreadyAudit
          }
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
          this.$notify({
            title: '失败',
            message: '无法审核通过自己',
            type: 'error',
            duration: 2000
          })
          return
        }
        this.dialogStatus = 'pass'
        this.opinionDialog = true
        this.opinionForm.text = ''
        this.selectedTaskId = row.id
        this.currentAuditMode = row.auditMode
        this.assessState = state
        this.$nextTick(() => {
          this.$refs['opinionForm'].clearValidate()
        })
      },
      handleDenyApply(row, state) {
        this.dialogStatus = 'deny'
        this.opinionDialog = true
        this.opinionForm.text = ''
        this.selectedTaskId = row.id
        this.currentAuditMode = row.auditMode
        this.assessState = state
        this.$nextTick(() => {
          this.$refs['opinionForm'].clearValidate()
        })
      },
      passApply() {
        this.$refs['opinionForm'].validate((valid) => {
          if (valid) {
            this.$confirm('确认通过吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.auditLoading = true
              var qs = require('qs')
              let data = {
                userId: this.userId,
                state: this.assessState,  // 当前流程
                ifPass: 1, // 通过或未通过
                auditDescription: this.opinionForm.text, // 审核说明
                auditMode: this.currentAuditMode // 会签状态
              }
              let datapost = qs.stringify(data)
              assessSubtask(this.selectedTaskId, datapost).then((res) => {
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
                this.auditLoading = false
              }).catch(() => {
                this.$notify({
                  title: '失败',
                  message: '操作失败',
                  type: 'error',
                  duration: 2000
                })
                this.auditLoading = false
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
              this.auditLoading = true
              var qs = require('qs')
              let data = {
                userId: this.userId,
                state: this.assessState,  // 当前流程
                ifPass: 0, // 通过或未通过
                auditDescription: this.opinionForm.text, // 审核说明
                auditMode: this.currentAuditMode // 会签状态
              }
              let datapost = qs.stringify(data)
              assessSubtask(this.selectedTaskId, datapost).then((res) => {
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
                this.auditLoading = false
              }).catch(() => {
                this.$notify({
                  title: '失败',
                  message: '操作失败',
                  type: 'error',
                  duration: 2000
                })
                this.auditLoading = false
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
        this.opinionLoading = true
        getAllOpinion(row.id, state).then((res) => {
          if(res.data.code === 0) {
            this.opinionList = res.data.data
          }
          this.opinionLoading = false
        }).catch(() => {
          this.opinionLoading = false
        })
      },
      jumpToPro(row) {
        row.loading = true
        getProjectAuth(row.id, this.userId).then((res) => {
          if(res.data.code === 0) {
            if(res.data.data === true) {
              this.$store.commit('SET_PROJECTID', row.id)
              this.$store.commit('SET_PROJECTNAME', row.name)
              this.$router.push({
                path: '/task_manage',
                name: 'task_manage',
                query: {
                  name: row.name,
                  id: row.id
                }
              })
            } else {
              this.$notify({
                title: '失败',
                message: '对不起，您没有无权限查看此项目！',
                type: 'error',
                duration: '6000'
              })
            }
          } else {
            this.$notify({
              title: '失败',
              message: '权限验证失败！',
              type: 'error',
              duration: '2000'
            })
          }
          row.loading = false
        }).catch(() => {
          this.$notify({
            title: '失败',
            message: '权限验证失败！',
            type: 'error',
            duration: '2000'
          })
          row.loading = false
        })
      },
      filterState(value, row) {
        if(value == 'proofed') {
          return row.state > 3
        }
        if(value == 'notProofed') {
          return row.state <= 3
        }
        if(value == 'audited') {
          return row.state > 4
        }
        if(value == 'notAudited') {
          return row.state <= 4
        }
        if(value == 'signed') {
          return row.state > 5
        }
        if(value == 'notSigned') {
          return row.state <= 5
        }
        if(value == 'approved') {
          return row.state > 6
        }
        if(value == 'notApproved') {
          return row.state <= 6
        }
      }
    },
    computed: {
      computedCurrentState() {
        return function(state) {
          if(state === 3) {
            return '校对'
          }
          if(state === 4) {
            return '审核'
          }
          if(state === 5) {
            return '会签'
          }
          if(state === 6) {
            return '批准'
          }
        }
      },
      computedAssessState(){
        return function(row) {
          let assessState = false
          for(let i=0;i<this.maps.length;i++){
            // 多人会签判断会签人身份（是否已经会签），判断会签任务id（确定唯一会签）
            if(this.maps[i].state === 5) {
              if(this.maps[i].userEntity.id == this.userId && this.maps[i].subtaskEntity.id == row.id){
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
          /*for (let i = 0; i < this.maps.length; i++) {
            if(this.maps[i].userEntity.id==this.userId && this.maps[i].subtaskEntity.id==row.id && this.maps[i].assessState == assessState) {
              if(this.maps[i].pass === true) {
                return '已通过'
              } else {
                return '已驳回'
              }
            }
          }*/
          if(row.state > assessState) {
            return '已处理'
          }
          return '未处理'
        }
      }
      /*computedAssessState(){
        return function(row) {
          let assessState=0
          for(let i=0;i<this.maps.length;i++){
            // 多人会签判断会签人身份（是否已经会签），判断会签任务id（确定唯一会签）
            if(this.maps[i].userEntity.id==this.userId&&this.maps[i].subtaskEntity.id==row.id){
              if(assessState<this.maps[i].assessState)
              assessState=this.maps[i].assessState
            }
          }
          return assessState
        }
      },
      computeMyPassState() {
        return function (row, assessState) {
          for (let i = 0; i < this.maps.length; i++) {
            if(this.maps[i].userEntity.id==this.userId && this.maps[i].subtaskEntity.id==row.id && this.maps[i].assessState == assessState) {
              if(this.maps[i].pass === true) {
                return '已通过'
              } else {
                return '已驳回'
              }
            }
          }
          return '未处理'
        }
      }*/
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
