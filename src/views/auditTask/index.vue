<template>
  <div class="taskContainer">
    <el-tabs type="border-card">
      <el-tab-pane label="我的核对">
        <el-table :data="collatorList" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
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
          <el-table-column align="center" min-width="200px" label="是否通过">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.state > 2">已通过</el-tag>
              <el-tag type="warning" v-else>待处理</el-tag>
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
                  <el-button size="mini" type="warning" :disabled="scope.row.state > 2">
                    审批
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <span style="display:inline-block;padding:0 10px;" @click="handlePassApply(scope.row, 2)">通过</span>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <span style="display:inline-block;padding:0 10px;" @click="handleDenyApply(scope.row, 2)">不通过</span>
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
          <el-table-column align="center" min-width="200px" label="是否通过">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.state > 3">已通过</el-tag>
              <el-tag type="warning" v-else>待处理</el-tag>
            </template>
          </el-table-column>
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
                  <el-button size="mini" type="warning" :disabled="scope.row.state !== 3">
                    审批
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <span style="display:inline-block;padding:0 10px;" @click="handlePassApply(scope.row, 3)">通过</span>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <span style="display:inline-block;padding:0 10px;" @click="handleDenyApply(scope.row, 3)">不通过</span>
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
          <el-table-column align="center" min-width="200px" label="是否通过">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.state > 4">已通过</el-tag>
              <el-tag type="warning" v-else>待处理</el-tag>
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
                  <el-button size="mini" type="warning" :disabled="scope.row.state !== 4">
                    审批
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <span style="display:inline-block;padding:0 10px;" @click="handlePassApply(scope.row, 4)">通过</span>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <span style="display:inline-block;padding:0 10px;" @click="handleDenyApply(scope.row, 4)">不通过</span>
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
          <el-table-column align="center" min-width="200px" label="是否通过">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.state > 5">已通过</el-tag>
              <el-tag type="warning" v-else>待处理</el-tag>
            </template>
          </el-table-column>
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
                  <el-button size="mini" type="warning" :disabled="scope.row.state !== 5">
                    审批
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <span style="display:inline-block;padding:0 10px;" @click="handlePassApply(scope.row, 5)">通过</span>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <span style="display:inline-block;padding:0 10px;" @click="handleDenyApply(scope.row, 5)">不通过</span>
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
        <el-button type="primary" v-if="dialogStatus === 'pass'" @click="passApply()">确 定</el-button>
        <el-button type="primary" v-if="dialogStatus === 'deny'" @click="denyApply()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="查看审批意见" :visible.sync="opinionTextDialog" append-to-body width="80%">
      <el-table :data="opinionList" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                style="width: 100%">
        <el-table-column align="center" min-width="80px" label="审批人">
          <template slot-scope="scope">
            <span>{{scope.row.userEntity.username}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="120px" label="所属审核流程">
          <template slot-scope="scope">
            <span>{{computedCurrentState(scope.row.assessState)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="120px" label="审批结果">
          <template slot-scope="scope">
            <el-tag type="success" v-if="!scope.row.reject">已通过</el-tag>
            <el-tag type="danger" v-else>未通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="200px" label="审核时间">
          <template slot-scope="scope">
            <span>{{scope.row.auditTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="200px" label="审批意见">
          <template slot-scope="scope">
            {{scope.row.illustration}}
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
            { required: true, message: '请输入活动审批意见', trigger: 'blur' }
          ],

        }
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
            this.collatorList = res.data.data.collatorList
            this.auditorList = res.data.data.auditorList
            this.approverList = res.data.data.apporverList
            this.countersignList = res.data.data.countersignList
          }
        })
      },
      checkAuditDetail(row) {
        this.selectedId = row.id
        this.selectedName = row.name
        this.fileDialog = true
      },
      handlePassApply(row, state) {
        this.dialogStatus = 'pass'
        this.opinionDialog = true
        this.opinionForm.text = ''
        this.selectedTaskId = row.id
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
              var qs = require('qs')
              let data = {
                userId: this.userId,
                state: this.assessState,  // 当前流程
                passState: 1, // 通过或未通过
                illustration: this.opinionForm.text // 审核说明
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
                illustration: this.opinionForm.text // 审核说明
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
        getAllOpinion(row.id, state).then((res) => {
          if(res.data.code === 0) {
            this.opinionList = res.data.data
          }
        })
      }
    },
    computed: {
      computedCurrentState() {
        return function(state) {
          if(state === 0) {
            return '未进行'
          }
          if(state === 1) {
            return '进行中'
          }
          if(state === 2) {
            return '核对'
          }
          if(state === 3) {
            return '审核'
          }
          if(state === 4) {
            return '会签'
          }
          if(state === 5) {
            return '批准'
          }
        }
      }
    }
  }
</script>

<style scoped>
  .taskContainer {
    padding: 20px;
  }
</style>
