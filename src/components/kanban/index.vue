<template>
  <div class="board-column">
    <div class="board-column-header">
      {{ headerText }}
    </div>
    <!--<draggable></draggable>-->
    <div
      :list="list"
      :options="options"
      class="board-column-content">
      <div v-for="element in list" :key="element.id" class="board-item" @dblclick.stop="handleSelectTask(element)">
        <span class="tag-box"></span>
        <span @click="handleEditTask(element)">
          <!--<span v-if="element.designLinkEntity">{{element.designLinkEntity.description}}</span>-->
          <span class="link-type">{{element.name}}</span>
        </span>
        <!--<span>{{ element.description }}</span>-->
        <!--<span style="float: right">
          <svg-icon icon-class="enter"></svg-icon>
        </span>-->
        <span style="float: right;font-size: 16px;margin-right: 4px;" @click.stop="handleDeleteTask(element)">
          <svg-icon icon-class="delete"></svg-icon>
        </span>
        <div class="tag-box-mine" v-if="element.finishTime">
          <span class="status-box">
            {{copmutedDate(element.finishTime)}}
          </span>
          <span class="link-type taskPic" v-if="element.userEntity">
            <svg-icon icon-class="people"></svg-icon>{{element.userEntity.username}}
          </span>
        </div>
      </div>
      <!--<div class="add-item" v-if="taskType == 'undo'" @click="handleAddTask">
        <span>+</span>
      </div>-->
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="newTaskDialog" append-to-body width="60%" class="limit-width-dialog">
      <div class="img-container"></div>
      <div class="text-container">设置当前子任务</div>
      <el-form label-position="right" label-width="120px" :rules="rules" :model="taskInfo" ref="taskForm">
        <el-form-item label="任务名" prop="name">
          <label slot="label">
            <svg-icon icon-class="documentation"></svg-icon>
            任务名
          </label>
          <el-input v-model="taskInfo.name" disabled="disabled"></el-input>
        </el-form-item>
        <!--<el-form-item :label="$t('table.projectDesc')" prop="description">
          <label slot="label">
            <svg-icon icon-class="components1"></svg-icon>
            描述
          </label>
          <el-input v-model="taskInfo.description"></el-input>
        </el-form-item>-->
        <el-form-item :label="$t('table.projectDesc')" prop="userEntity">
          <label slot="label">
            <svg-icon icon-class="people"></svg-icon>
            执行者
          </label>
          <el-select v-model="taskInfo.userEntity" value-key="id" :loading="getMaLoading" @focus="getAbleUser" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in taskPicOptions"
              :key="item.id"
              :label="item.username"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item :label="$t('table.projectDesc')" prop="description">
          <label slot="label">
            <svg-icon icon-class="process"></svg-icon>
            设计环节
          </label>
          <el-select v-model="taskInfo.designLinkEntity" value-key="description" @focus="getAbleLinks" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in desiginLinkOptions"
              :key="item.id"
              :label="item.description"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item required prop="finishTime">
          <label slot="label">
            <svg-icon icon-class="calendar"></svg-icon>
            截止日期
          </label>
          <el-date-picker
            style="width:100%;"
            v-model="taskInfo.finishTime"
            type="date"
            placeholder="设置截止日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="timestamp">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus === 'create'" type="primary" @click="saveTask">确定</el-button>
        <el-button v-if="dialogStatus === 'update'" type="primary" @click="editTask">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  /*eslint-disable*/
  import { allUser } from '@/api/getUsers'
  import { setProLinks, updateProDesignLink, deleteSubtask } from '@/api/pro-design-link'
  import { getLinks } from '@/api/designLinks'
  import draggable from 'vuedraggable'
  export default {
    name: 'DragKanbanDemo',
    components: {
      draggable
    },
    props: {
      taskType: {
        type: String,
        default: ''
      },
      headerText: {
        type: String,
        default: 'Header'
      },
      options: {
        type: Object,
        default() {
          return {}
        }
      },
      list: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        proId: '',
        userId: '',
        taskInfo: {
          name: '',
          info: '',
          userId: '',
          userEntity: {

          },
          designLinkEntity: {

          },
          finishTime: '',
          linkId: ''
        },
        dialogStatus: '',
        textMap: {
          update: '修改任务',
          create: '新建任务'
        },
        newTaskDialog: false,
        taskPicOptions: [],
        desiginLinkOptions: [],
        rules: {
          finishTime: [{required: true, message: '请选择结束时间！', trigger: 'change'}],
          userEntity: [{required: true, message: '请选择任务负责人！', trigger: 'change'}],
        },
        getMaLoading: true
      }
    },
    created() {
      this.proId = this.$route.query.id
      this.userId = this.getCookie('userId')
      console.log(this.list)
    },
    methods: {
      resetCreat() {
        this.taskInfo = {
          name: '',
          info: '',
          userId: '',
          finishTime: '',
          linkId: ''
        }
      },
      handleAddTask() {
        this.resetCreat()
        this.dialogStatus = 'create'
        this.newTaskDialog = true
        this.$nextTick(() => {
          this.$refs['taskForm'].clearValidate()
        })
      },
      getAbleUser() {
        allUser().then((res) => {
          if(res.data.code === 0) {
            this.taskPicOptions = []
            res.data.data.forEach((item) => {
              if(item.username !== 'admin' && item.username !== 'securityGuard' && item.username !== 'securityAuditor') {
                if(this.list.length > 0) {
                  if(item.secretClass >= this.list[0].projectEntity.secretClass) {
                    this.taskPicOptions.push(item)
                  }
                } else {
                  this.taskPicOptions.push(item)
                }
              }
            })
            this.getMaLoading = false
          } else {
            this.getMaLoading = false
          }
        }).catch(() => {
          this.getMaLoading = false
        })
      },
      getAbleLinks() {
        getLinks().then((res) => {
          if(res.data.code === 0) {
            this.desiginLinkOptions = res.data.data
          }
        })
      },
      saveTask() {
        this.$refs['taskForm'].validate((valid) => {
          if(valid) {
            let qs = require('qs')
            let data = {
              finishTime: this.taskInfo.finishTime.toString(),
              userId: this.taskInfo.userId,
              designLinkEntityId: this.taskInfo.linkId
            }
            let dataPost = qs.stringify(data)
            setProLinks(this.proId, dataPost).then((res) => {
              if(res.data.code === 0) {
                this.$notify({
                  title: '成功',
                  message: '任务新建成功！',
                  type: 'success',
                  duration: '2000'
                })
                this.newTaskDialog = false
                // 成功后调用父组件方法 刷新list
                this.$emit('onNewTask')
              } else {
                this.$notify({
                  title: '失败',
                  message: res.data.msg,
                  type: 'error',
                  duration: '2000'
                })
              }
            })
          } else {
            return false
          }
        })
      },
      handleEditTask(temp) {
        this.dialogStatus = 'update'
        this.taskInfo = Object.assign({}, temp)
        if (temp.userEntity !== null) {
          this.taskPicOptions = [temp.userEntity]
        }
        if (temp.designLinkEntity !== null) {
          this.desiginLinkOptions = [temp.designLinkEntity]
        }
        this.newTaskDialog = true
        this.$nextTick(() => {
          this.$refs['taskForm'].clearValidate()
        })
      },
      editTask() {
        this.$refs['taskForm'].validate((valid) => {
          if(valid) {
            let qs = require('qs')
            let data = {
              finishTime: this.taskInfo.finishTime.toString(),
              userId: this.taskInfo.userEntity.id,
              // designLinkEntityId: this.taskInfo.designLinkEntity.id
            }
            let dataPost = qs.stringify(data)
            updateProDesignLink(this.taskInfo.id, this.proId, dataPost).then(res => {
              if(res.data.code === 0) {
                this.$notify({
                  title: '成功',
                  message: '任务修改成功！',
                  type: 'success',
                  duration: '2000'
                })
                this.newTaskDialog = false
                // 成功后调用父组件方法 刷新list
                this.$emit('onNewTask')
              } else {
                this.$notify({
                  title: '失败',
                  message: res.data.msg,
                  type: 'error',
                  duration: '2000'
                })
              }
            })
          } else {
            return false
          }
        })
      },
      handleDeleteTask(row) {
        this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteSubtask(row.id).then((res) => {
            if(res.data.code === 0) {
              this.$notify({
                title: '成功',
                message: '任务删除成功！',
                type: 'success',
                duration: '2000'
              })
              // 成功后调用父组件方法 刷新list
              this.$emit('onNewTask')
            } else {
              this.$notify({
                title: '失败',
                message: res.data.msg,
                type: 'error',
                duration: '2000'
              })
            }
          })
        }).catch(() => {

        })
      },
      handleSelectTask(row) {
        /*this.$router.push({
          path: '/taskFiles',
          name: 'taskFiles',
          params: {
            id: row.id
          },
          query: {
            name: row.designLinkEntity ? row.designLinkEntity.name : ''
          }
        })
        this.setCookie('taskSelectedName')*/
        if(row.userEntity !== null) {
          this.$router.push({
            path: '/taskFiles',
            name: 'taskFiles',
            params: {
              id: row.id
            },
            query: {
              name: row.designLinkEntity ? row.designLinkEntity.name : '',
              proClass: row.projectEntity.secretClass
            }
          })
          console.log(row.projectEntity.secretClass)
          this.setCookie('taskSelectedName')
        } else {
          this.$notify({
            title: '失败',
            message: '请先指定子任务负责人！',
            type: 'error',
            duration: '2000'
          })
        }
      }
    },
    computed: {
      copmutedDate() {
        return function(time) {
          let unixtimestamp = new Date(parseInt(time))
          let year = unixtimestamp.getFullYear();
          let month = "0" + (unixtimestamp.getMonth() + 1);
          let date = "0" + unixtimestamp.getDate();
          return year + "-" + month.substring(month.length-2, month.length)  + "-" + date.substring(date.length-2, date.length)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .board-column {
    min-width: 300px;
    min-height: 100px;
    height: auto;
    overflow: hidden;
    background: #f0f0f0;
    border-radius: 3px;
    .board-column-header {
      height: 36px;
      line-height: 36px;
      overflow: hidden;
      padding: 0 20px;
      text-align: left;
      background: #333;
      color: #fff;
      border-radius: 3px 3px 0 0;
      font-size: 14px;
    }
    .board-column-content {
      // background: #f2f8f9;
      background: #f5f6f7;
      height: auto;
      overflow: hidden;
      border: 10px solid transparent;
      min-height: 60px;
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      align-items: center;
      .board-item {
        position: relative;
        cursor: pointer;
        width: 100%;
        height: 64px;
        margin: 5px 0;
        background-color: #fff;
        text-align: left;
        border-radius: 4px;
        // line-height: 54px;
        padding: 5px 14px;
        box-sizing: border-box;
        box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);
        font-size: 13px;
        color: #333;
      }
      .tag-box-mine {
        width: 100%;
        height: 40px;
        line-height: 40px;
      }
      .status-box {
        float: right;
        display: inline-block;
        width: 75px;
        text-align: center;
        background: rgb(255,79,62);
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        color: #fff;
        border-radius: 3px;
        margin-top: 10px;
        margin-right: -14px;
      }
      .taskPic {
        // float: right;
      }
      .tag-box {
        position: absolute;
        top: 0;
        left: 0;
        display: inline-block;
        height: 100%;
        width: 2px;
        background: #f9944a;
      }
      .board-item:hover {
        .tag-box {
          width: 4px;
        }
      }
    }
    .add-item {
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: #fff;
      color: #ccc;
      font-weight: 700;
      font-size: 26px;
      cursor: pointer;
    }
  }
  .img-container {
    width: 100%;
    height: 140px;
    margin: 0 auto;
    background: url("./task-back.png") center center no-repeat;
    background-size: 113px 90px;
  }
  .text-container {
    text-align: center;
    color: #777;
    margin-bottom: 20px;
    font-size: 14px;
    font-weight: 500;
  }
</style>
