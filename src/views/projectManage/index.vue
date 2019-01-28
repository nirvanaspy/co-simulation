<template>
  <div class="project-container">
    <el-header style="background: #2d3a4b;line-height: 60px;">
      <div class="searchContainer" style="display: inline-block;margin-bottom:16px;">
        <el-input style="width: 200px;" class="filter-item" placeholder="项目名" v-model="searchQuery">
        </el-input>
      </div>
      <div class="right-menu">
        <span calss="userName" style="position: relative;top: -12px;color: #fff;">{{userName}}</span>
        <el-dropdown class="avatar-container right-menu-item" trigger="click">
          <div class="avatar-wrapper">
            <pan-thumb class="proImg" width="40px" height="40px" image="./2/png">
            </pan-thumb>
            <!--<img class="user-avatar" src="./2.jpg">-->
            <i class="el-icon-caret-bottom"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <span v-if="role === 'admin'" style="display:block;">
                <router-link to="/user_manage">用户管理</router-link>
              </span>
              <span v-else @click="handleModifyPassword" style="display:block;">修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <div class="title-container">
      <h3 class="title" style="margin-bottom:30px">
        <!--<span v-if="!isHistory">项目管理</span>
        <span v-else>项目管理回收站</span>-->
      </h3>
    </div>
    <el-tabs tab-position="left" style="height: calc(100% - 200px);" @tab-click="handleTabClick">
      <el-tab-pane label="所有项目">
        <span class="tab-name" slot="label" style="font-size: 16px;">所有项目<i class="el-icon-document"
                                                                            style="padding-left: 10px;"></i></span>
        <div class="project-list">
          <div v-if="listA.length === 0" class="no-project-container">
            <span class="no-project-icon">
              <svg-icon icon-class="工程"></svg-icon>
            </span>
            <div class="no-project-desc">
              暂无项目
            </div>
          </div>
          <div v-for="item in listA" v-if="!item.deleted" class="project-item">
            <div class="project-star project-detail">
            <span class="star-container" @click="toggleStar(item)">
              <svg-icon v-if="item.hasStar" icon-class="star-light"></svg-icon>
              <svg-icon v-else icon-class="star-dark"></svg-icon>
            </span>
            </div>
            <div class="project-info project-detail">
              <div class="info-detail info-name" @click="handleSelect(item)">{{item.name}}</div>
              <div class="info-detail info-description">{{item.description}}</div>
            </div>
            <div class="project-operation project-detail">
            <span class="icons icons-edit" @click="handleUpdate(item)">
              <el-tooltip content="编辑" placement="top">
                <svg-icon icon-class="edit"></svg-icon>
              </el-tooltip>
            </span>
            <span class="icons icons-delete" @click="handleDelete(item)">
              <el-tooltip content="删除" placement="top">
                <svg-icon icon-class="delete"></svg-icon>
              </el-tooltip>
            </span>
            </div>
          </div>
          <div class="new-project-container">
            <div class="project-star project-detail new-info">
          <span class="star-container">
            <svg-icon icon-class="add-1"></svg-icon>
          </span>
            </div>
            <div class="project-info project-detail">
              <div class="info-detail new-info" @click="handleCreate($event)">创建新项目</div>
            </div>
            <div class="project-operation project-detail"></div>
          </div>
        </div>
        <el-pagination
          v-if="listA.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10,20,30,50]"
          :page-size="listQuery.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.total"
          background
          style="text-align: center;margin-top:20px;width: 100%;"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="回收站">
        <span slot="label" class="tab-name" style="font-size: 16px;">回收站<i class="el-icon-delete"
                                                                           style="padding-left: 10px;"></i></span>
        <div class="project-list hisList">
          <div v-if="listA.length === 0" class="no-project-container">
            <span class="no-project-icon">
              <svg-icon icon-class="工程"></svg-icon>
            </span>
            <div class="no-project-desc">
              暂无项目
            </div>
          </div>
          <div v-for="item in listA" v-if="item.deleted" class="project-item">
            <div class="project-star project-detail">
              <span class="star-container">
                <svg-icon v-if="item.hasStar" icon-class="star-light"></svg-icon>
                <svg-icon v-else icon-class="star-dark"></svg-icon>
              </span>
            </div>
            <div class="project-info project-detail">
              <div class="info-detail info-name">{{item.name}}</div>
              <div class="info-detail info-description">{{item.description}}</div>
            </div>
            <div class="project-operation project-detail">
              <span class="icons icons-edit" @click="handleResHisPro(item)">
                <el-tooltip content="恢复" placement="top">
                  <svg-icon icon-class="recover"></svg-icon>
                </el-tooltip>
              </span>
              <span class="icons icons-delete" @click="handleDelHisPro(item)">
                <el-tooltip content="清除" placement="top">
                  <svg-icon icon-class="delete"></svg-icon>
                </el-tooltip>
              </span>
            </div>
          </div>
        </div>
        <el-pagination
          v-if="listA.length"
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :current-page="currentPage1"
          :page-sizes="[10,20,30,50]"
          :page-size="listQuery1.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.total1"
          background
          style="text-align: center;margin-top:20px;width: 100%;"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" append-to-body width="40%"
               class="limit-width-dialog">
      <el-form :rules="rules" ref="dataForm" :model="temp" style='width: 80%; margin:0 auto;'>
        <el-form-item :label="$t('table.projectName')" prop="name" :label-width="formLabelWidth">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.projectDesc')" prop="description" :label-width="formLabelWidth">
          <el-input v-model="temp.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData" :loading="creProLoading">
          {{$t('table.confirm')}}
        </el-button>
        <el-button v-else type="primary" @click="updateData" :loading="creProLoading">{{$t('table.confirm')}}
        </el-button>
      </div>
    </el-dialog>
    <!--普通用户修改密码-->
    <el-dialog title="修改密码" :visible.sync="modifyPasswordVisible" append-to-body width="40%" class="limit-width-dialog">
      <el-form :model="form" ref="modifyPassForm" :rules="modifyRules" style="width: 80%; margin:0 auto;">
        <!--<el-form-item label="原密码" :label-width="formLabelWidth">
          <el-input type="password" v-model="form.passwordOld" auto-complete="off"></el-input>
        </el-form-item>-->
        <el-form-item label="新密码" :label-width="formLabelWidth" prop="passwordNew">
          <el-input :type="passwordType" v-model="form.passwordNew" auto-complete="off"></el-input>
          <span class="show-pwd" @click="showPwd">
            <svg-icon icon-class="eye"/>
          </span>
        </el-form-item>
        <el-form-item label="再次输入" :label-width="formLabelWidth" prop="passwordAgain">
          <el-input :type="passwordTypeAgain" v-model="form.passwordAgain" auto-complete="off"></el-input>
          <span class="show-pwd" @click="showPwdAgain">
            <svg-icon icon-class="eye"/>
          </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyPasswordVisible = false">取 消</el-button>
        <el-button :disabled="this.btnConfirm" type="primary" @click="modifyPassword" :loading="modPasLoading">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import PanThumb from '@/components/PanThumb'
  import { isvalidPwd } from '@/utils/validate'
  import {
    projectList,
    projectList_user,
    createProject,
    updateProject,
    deleteProject,
    projectListHis,
    projectList_userHis,
    restorePro,
    cleanPro,
    starPro
  } from '@/api/project'
  import { getUserId, updateUser } from '@/api/getUsers'
  import store from '../../store'

  /* import LangSelect from '@/components/LangSelect'*/
  /* import SocialSign from './socialsignin'*/

  /*eslint-disable*/
  export default {
    components: {PanThumb},
    name: 'login',
    data() {
      const validatePassword = (rule, value, callback) => {
        if (!isvalidPwd(value)) {
          callback(new Error('密码必须是6-16位数字和字母的组合！'))
          this.btnConfirm = true
          this.passwordValidate = false
        } else {
          callback()
          this.passwordValidate = true
          if (this.passwordValidate && this.pasAgainValidate) {
            this.btnConfirm = false
          }
        }

      }
      const validatePasswordAgain = (rule, value, callback) => {
        if (!isvalidPwd(value)) {
          callback(new Error('密码必须是6-16位数字和字母的组合！'))
          this.btnConfirm = true
          this.pasAgainValidate = false
        } else if (this.form.passwordAgain !== this.form.passwordNew) {
          this.btnConfirm = true
          this.pasAgainValidate = false
          callback(new Error('两次密码输入不一致，请再次输入新密码！'))
        } else {
          callback()
          this.pasAgainValidate = true
          if (this.passwordValidate && this.pasAgainValidate) {
            this.btnConfirm = false
          }
        }
      }
      return {
        userId: '',
        userName: '',
        selectedId: '',
        tableKey: 0,
        list: [],
        listQuery: {
          page: 0,
          size: 10,
          limit: 5,
          tagname: ''
        },
        total: null,
        pagesize: 10,//每页的数据条数
        currentPage: 1,//默认开始页面
        listQuery1: {
          page: 0,
          size: 10,
          limit: 5,
          tagname: ''
        },
        total1: null,
        pagesize1: 10,//每页的数据条数
        currentPage1: 1,//默认开始页面
        searchQuery: '',
        dialogFormVisible: false,
        modifyPasswordVisible: false,
        modPasLoading: false,
        passwordType: 'password',
        passwordTypeAgain: 'password',
        btnConfirm: false,
        passwordValidate: false,
        pasAgainValidate: false,
        formLabelWidth: '100px',
        temp: {
          id: '',
          name: '',
          description: ''
        },
        form: {
          passwordNew: '',
          passwordAgain: ''
        },
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新建'
        },
        rules: {
          name: [{required: true, message: '请输入工程名！', trigger: 'blur'}],
          // description: [{ required: true, message: 'description is required', trigger: 'blur' }]
        },
        modifyRules: {
          passwordNew: [{required: true, trigger: 'blur', validator: validatePassword}],
          passwordAgain: [{required: true, trigger: 'blur', validator: validatePasswordAgain}]
        },
        loading: false,
        listLoading: true,
        creProLoading: false,
        ediuserLoading: false,
        delLoading: false,
        showDialog: false,
        userData: {
          username: '',
          password: ''
        },
        token: '',
        role: '',
        errorMessage: '操作失败！',
        hisBtnLoading: false,
        isHistory: false,
      }
    },
    created() {
      this.role = store.getters.roles

      this.userId = this.getCookie('userId')
      this.userName = this.getCookie('username')

      this.getList()
      // this.getUserInfo()
    },
    mounted() {
    },
    methods: {
      handleTabClick(tab, event) {
        console.log(tab.label);
        if (tab.label === '回收站') {
          this.showHistory()
        } else if (tab.label === '所有项目') {
          this.showNow()
        }
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
      },
      showPwdAgain() {
        if (this.passwordTypeAgain === 'password') {
          this.passwordTypeAgain = ''
        } else {
          this.passwordTypeAgain = 'password'
        }
      },
      logout() {
        this.$store.dispatch('FedLogOut').then(() => {
          location.reload()// In order to re-instantiate the vue-router object to avoid bugs
        })
      },
      getUserInfo() {
        getUserId().then(res => {
          this.userId = res.data.data.id
          this.userName = res.data.data.username
        })
      },
      getList() {
        this.listLoading = true
        if (this.role == 'admin') {
          projectList(this.listQuery).then(response => {
            this.list = response.data.data.content
            this.listLoading = false
            this.listLength = response.data.data.length
            this.total = response.data.data.totalElements
          })
        } else if (this.role == 'editor') {
          // alert(this.userId)
          projectList_user(this.userId, this.listQuery).then(response => {
            this.list = response.data.data.content
            this.listLoading = false
            this.listLength = response.data.data.length
            this.total = response.data.data.totalElements
          })
        }

      },
      resetTemp() {
        this.temp = {
          id: '',
          name: '',
          description: ''
        }
      },
      handleCreate(event) {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        event.target.loading = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {        //创建项目
        let qs = require('qs');
        this.$refs['dataForm'].validate((valid) => {
          this.creProLoading = true
          if (valid) {
            let data = {
              'name': this.temp.name,
              'description': this.temp.description
            };
            let proData = qs.stringify(data);
            createProject(proData, this.userId).then(() => {
              this.creProLoading = false
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch(error => {
              this.creProLoading = false
              this.errorMessage = '操作失败！'
              if (error.response.data.message) {
                this.errorMessage = error.response.data.message
              }
              this.$notify({
                title: '失败',
                message: this.errorMessage,
                type: 'error',
                duration: 2000
              })
            })
          }
        })
      },
      handleUpdate(row) {
        this.selectedId = row.id;
        console.log(this.selectedId);
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        let qs = require('qs');
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.creProLoading = true
            let data = {
              'name': this.temp.name,
              'description': this.temp.description
            };

            const id = this.selectedId;
            // let beforUpdateName = '';

            console.log("改前改后-----------")


            /*for(let i=0;i<this.list.length;i++){
              if(id == this.list[i].id){
                beforUpdateName = this.list[i].name;
                console.log(beforUpdateName);
              }
            }*/

            /*console.log(this.temp.name);

            console.log(id);*/
            let proData = qs.stringify(data);
            updateProject(proData, id).then(() => {
              this.creProLoading = false
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            }).catch((error) => {
              this.creProLoading = false
              this.errorMessage = '操作失败！'
              if (error.response.data.message) {
                this.errorMessage = error.response.data.message
              }
              this.$notify({
                title: '失败',
                message: this.errorMessage,
                type: 'error',
                duration: 2000
              })
            })
          }
        })
      },
      handleDelete(row) {
        let id = row.id;
        // this.delLoading = true
        row.delLoading = true
        this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteProject(id).then(() => {
            // this.delLoading = false
            row.delLoading = false
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          }).catch(() => {
            // this.delLoading = false
            row.delLoading = false
            this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'error',
              duration: 2000
            })
          })
        }).catch(() => {
          // this.delLoading = false
          row.delLoading = false
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleModifyPassword() {
        this.resetModify()
        this.modifyPasswordVisible = true
        this.modPasLoading = false
        this.$nextTick(() => {
          this.$refs['modifyPassForm'].clearValidate()
        })
      },
      resetModify() {
        this.form = {
          passwordAgain: '',
          passwordNew: ''
        }
      },
      modifyPassword() {
        this.$refs['modifyPassForm'].validate((valid) => {
          if (valid) {
            this.modPasLoading = true
            let data = {
              'password': this.form.passwordNew
            }
            var qs = require('qs');
            let datapost = qs.stringify(data)
            // console.log(this.userId)
            updateUser(datapost, this.userId).then(() => {
              this.modPasLoading = false
              this.modifyPasswordVisible = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.$store.dispatch('FedLogOut').then(() => {
                location.reload()// In order to re-instantiate the vue-router object to avoid bugs
              })
            }).catch(() => {
              this.modPasLoading = false
              this.$notify({
                title: '失败',
                message: '修改失败',
                type: 'error',
                duration: 2000
              })
            })
          }
        })
      },
      handleSelect(row) {
        this.$store.commit('SET_PROJECTID', row.id)
        // let proName = URLEncoder.encode(row.name, 'utf-8')
        this.$store.commit('SET_PROJECTNAME', row.name)
        this.$router.push({path: '/dashboard/dashboard'})
      },
      handleSizeChange(val) {
        this.listQuery.size = val
        this.pagesize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val - 1
        this.currentPage = val
        this.getList()
      },
      handleSizeChange1(val) {
        this.listQuery1.size = val
        this.pagesize1 = val
        this.showHistory()
      },
      handleCurrentChange1(val) {
        this.listQuery1.page = val - 1
        this.currentPage1 = val
        this.showHistory()
      },
      showHistory: function () {
        this.listLoading = true
        this.hisBtnLoading = true
        if (this.role == 'admin') {
          projectListHis(this.listQuery).then(response => {
            console.log(this.listQuery)
            this.isHistory = true
            this.list = response.data.data.content
            this.total1 = response.data.total
            this.listLoading = false
            this.hisBtnLoading = false
          }).catch(() => {
            this.listLoading = false
            this.hisBtnLoading = false
            this.$notify({
              title: '失败',
              message: '操作失败！',
              type: 'error',
              duration: '2000'
            })
          })
        } else if (this.role == 'editor') {
          projectList_userHis(this.userId, this.listQuery).then(response => {
            this.isHistory = true
            this.list = response.data.data.content
            this.listLoading = false
            this.listLength = response.data.data.length
            this.total1 = response.data.data.totalElements
            this.hisBtnLoading = false
          }).catch(() => {
            this.listLoading = false
            this.hisBtnLoading = false
            this.$notify({
              title: '失败',
              message: '操作失败！',
              type: 'error',
              duration: '2000'
            })
          })
        }
      },
      showNow: function () {
        this.listLoading = true
        this.hisBtnLoading = true
        if (this.role == 'admin') {
          /*projectList(this.listQuery).then(response => {
            this.list = response.data.data.content
            this.listLoading = false
            this.listLength = response.data.data.length
            this.total = response.data.data.totalElements
          })*/
          projectList(this.listQuery).then(response => {
            this.list = response.data.data.content
            this.total = response.data.total
            this.listLoading = false
            this.hisBtnLoading = false
            this.isHistory = false
          }).catch(() => {
            this.listLoading = false
            this.hisBtnLoading = false
            this.$notify({
              title: '失败',
              message: '操作失败！',
              type: 'error',
              duration: '2000'
            })
          })
        } else if (this.role == 'editor') {
          // alert(this.userId)
          projectList_user(this.userId, this.listQuery).then(response => {
            this.list = response.data.data.content
            this.listLoading = false
            this.hisBtnLoading = false
            this.listLength = response.data.data.length
            this.total = response.data.data.totalElements
            this.isHistory = false
          }).catch(() => {
            this.listLoading = false
            this.hisBtnLoading = false
            this.$notify({
              title: '失败',
              message: '操作失败！',
              type: 'error',
              duration: '2000'
            })
          })
        }
      },
      handleDelHisPro(row) {
        this.$confirm('确认彻底删除此工程吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          cleanPro(row.id).then(() => {
            this.listLoading = false
            this.showHistory()
            this.$notify({
              title: '成功',
              message: '清除成功！',
              type: 'success',
              duration: 2000
            })
          }).catch(() => {
            this.listLoading = false
            this.$notify({
              title: '失败',
              message: '清除失败！',
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
      },
      handleResHisPro(row) {
        this.$confirm('确认恢复此工程吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          restorePro(row.id).then(() => {
            this.listLoading = false
            this.showHistory()
            this.$notify({
              title: '成功',
              message: '恢复成功！',
              type: 'success',
              duration: 2000
            })
          }).catch(() => {
            this.listLoading = false
            this.$notify({
              title: '失败',
              message: '恢复失败！',
              type: 'error',
              duration: 2000
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消恢复'
          })
        })
      },
      toggleStar(item) {
        let mes = item.hasStar ? '确定取消收藏吗？' : '确定加入收藏吗？'
        let mesType = item.hasStar ? 'warning' : 'success'
        this.$confirm(mes, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: mesType
        }).then(() => {
          starPro(item.id, !item.hasStar).then((res) => {
            this.getList()
          })
        })
      }
    },
    computed: {
      listA: function () {
        let self = this;
        return self.list.filter(function (item) {
          return item.name.toLowerCase().indexOf(self.searchQuery.toLowerCase()) !== -1;
        })
      }
    },
    mounted() {
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL);
      })
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  // $bg:rgb(239,240,242);
  $bg: #f1f3f5;
  $dark_gray: #889aa4;
  $light_gray: #eee;
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 2px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
  }

  .project-container {
    position: fixed;
    height: 100%;
    width: 100%;
    // background-color: $bg;
    // background-image: url("./pic01.jpg");
    background-size: cover;

    .project-list {
      width: 60%;
      // min-width: 400px;
      max-width: 800px;
      margin: 20px auto;

      .project-item, .new-project-container {
        width: 100%;
        height: 60px;
        background: #fff;
        padding: 5px 10px;
        margin-bottom: 10px;
        border-left: 4px solid rgb(25, 170, 246);
        cursor: pointer;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.15);
        font-size: 14px;

        .project-detail {
          float: left;
          height: 100%;
        }

        .project-star {
          width: 40px;
          text-align: center;

          .star-container {
            display: inline-block;
            position: relative;
            top: 50%;
            transform: translate(0, -50%);
            font-size: 24px;
          }
        }

        .project-star.new-info {
          color: #ccc;
        }

        .project-info {
          width: calc(100% - 100px);
          padding: 0 20px;

          .info-detail {
            height: 25px;
            line-height: 25px;
            color: rgb(77, 77, 77);
          }

          .info-description {
            color: rgb(179, 179, 179);
          }

          .new-info {
            height: 50px;
            line-height: 50px;
            color: rgb(179, 179, 179);
          }
        }

        .project-operation {
          width: 60px;
          line-height: 50px;

          .icons {
            font-size: 20px;
            margin-left: 6px;
            color: #ccc;
          }
        }
      }
    }

    .project-item:hover, .project-item:focus, .new-project-container:hover, .new-project-container:focus {
      // margin-bottom: 16px;
      border-radius: 4px;
      border-left-width: 8px;
      box-shadow: 4px 4px 30px rgba(0, 0, 0, .2);

      .info-name, .new-info {
        color: #3da8f5 !important;
      }

      .icons-delete {
        color: #f56c6c !important;
      }

      .icons-edit {
        color: #3da8f5 !important;
      }
    }

    .project-list.hisList {
      .project-item {
        border-left: 4px solid #f56c6c;
      }

      .project-item:hover {
        border-radius: 4px;
        border-left-width: 8px;
        box-shadow: 4px 4px 30px rgba(0, 0, 0, .2);
      }
    }

    .no-project-container {
      text-align: center;
      padding: 40px 0;

      .no-project-icon {
        font-size: 80px;
      }

      .no-project-desc {
        margin-top: 20px;
        font-size: 18px;
        color: #777;
      }
    }

    /*.icons-delete:hover {
      color: #f56c6c !important;
    }
    .icons-edit:hover {
      color: #3da8f5 !important;
    }*/
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;

      &_login, &_ip {
        font-size: 20px;
      }
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        font-weight: 400;
        color: #555;
        margin: 40px auto;
        text-align: center;
        font-weight: bold;
      }

      .set-language {
        position: absolute;
        top: 5px;
        right: 0px;
      }
    }
  }

  .right-menu {
    float: right;
    height: 100%;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }

    .avatar-container {
      height: 50px;
      margin-right: 30px;

      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
</style>
