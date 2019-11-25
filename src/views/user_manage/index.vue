<template>
  <div class="usermanageCont">
    <span class="editor-create" @click="handlAddUser()" v-if="nowTabs == 0">
        <svg-icon icon-class="create"></svg-icon>
    </span>
    <span class="editor-create" @click="handlAddRole()" v-if="nowTabs == 1">
        <svg-icon icon-class="create"></svg-icon>
    </span>
    <div style="position: absolute; top: 32px;right: 70px;z-index: 1000">
<!--        <el-button type="text" style="padding: 0" @click="importingUsers">导入</el-button>-->
        <el-tooltip content="导入用户信息" placement="bottom" effect="light">
<!--          <i class="el-icon-share"></i>-->
          <el-button type="text" style="padding: 0;height: 40px" @click="importingUsers">导入</el-button>
        </el-tooltip>
      <input id="files" type="file" style="display: none" accept="application/vnd.ms-excel" @change="beforeAvatarUpload">
    </div>
    <div style="
          position: fixed;
          top: 0;
          left: 0;
          z-index: 10000;
          width: 100%;
          height: 100%;"
         v-loading="loading"
         element-loading-text="用户信息导入中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.8)"
         v-show="loading"
    ></div>
    <el-row style="height: 100%;">
      <el-col :xs="24" :sm="24" :md="24">
        <el-tabs type="border-card" v-model="nowTabs">
          <el-tab-pane>
            <span slot="label"><svg-icon icon-class="peoples"></svg-icon> 用户管理</span>
            <div class="userboard">
              <div class="filiter-box">
                <div class="input-group">
                  <el-input type="text" size="small" v-model="searchQuery" style="width:200px;"></el-input>
                  <div class="input-group-button">
                    <svg-icon icon-class="search"></svg-icon>
                  </div>
                </div>
              </div>
              <div>
                <div v-for="item in newUserList" class="user-item" v-if="item.username !== 'admin' && item.username !== 'securityGuard' && item.username !== 'securityAuditor'">
                  <div class="editor-box">
                    <!--<span class="editor-item editor-edit" @click="handleEnableSelect(item)">
                      <el-tooltip content="修改角色" placement="top">
                        <svg-icon icon-class="switchrole"></svg-icon>
                      </el-tooltip>
                    </span>-->
                    <!--<span class="editor-item editor-edit" @click="handleEditDepa(item)">
                      <el-tooltip content="修改部门" placement="top">
                        <svg-icon icon-class="edit"></svg-icon>
                      </el-tooltip>
                    </span>-->
                    <span v-if="item.enabled" class="editor-item editor-disable" @click="handleDisableUser(item)">
                    <el-tooltip content="禁用用户" placement="top">
                      <svg-icon icon-class="disable"></svg-icon>
                    </el-tooltip>
                  </span>
                    <span v-if="!item.enabled" class="editor-item editor-enable" @click="handleEnableUser(item)">
                    <el-tooltip content="解除禁用" placement="top">
                      <svg-icon icon-class="enable"></svg-icon>
                    </el-tooltip>
                  </span>
                    <span class="editor-item editor-delete" @click="handleDeleteUser(item)">
                    <el-tooltip content="删除用户" placement="top">
                      <svg-icon icon-class="delete"></svg-icon>
                    </el-tooltip>
                  </span>
                  </div>
                  <div class="avatarCont">
                  <span class="user-avatar">
                    <!--<img :src="genenrateAvatar(item.id)" alt="">-->
                    <svg-icon :icon-class="item.enabled === true ? 'user-1' : 'user-disable'"></svg-icon>
                  </span>
                  </div>
                  <div class="userMesCont">
                    <div class="userName">
                      <span class="username-title">用户名:</span>
                      <span class="username-text link-type" @click="handleEditUser(item)">{{item.username}}</span>
                    </div>
                    <div class="userName">
                      <span class="username-title">姓名:</span>
                      <span class="username-text link-type" @click="handleEditUser(item)">{{item.realName}}</span>
                    </div>
                    <div class="userSecret">
                      <span class="username-title">部门:</span>
                      <span class="secret-text link-type" @click="handleEditDepa(item)" v-if="item.department">{{item.department.name}}</span>
                      <span class="secret-text link-type" @click="handleEditDepa(item)" v-else>选择部门</span>
                    </div>
                    <div class="userSecret">
                      <span class="username-title">密级:</span>
                      <span class="secret-text link-type" @click="handleEditSecretClass(item)">{{computedSecret(item.secretClass)}}</span>
                    </div>
                    <div class="userMes">
                      <div class="user-role name" v-if="item.roleEntities">
                        <span class="role-text">角色:</span>
                        <!--<span v-for="role in item.roleEntities" style="margin-left: 6px;">{{role.name}}-{{role.description}}</span>
                        <el-dropdown placement="bottom-start" trigger="click" @command="handleSelectRole">
                          <span class="switchrole" @click="handleSelectUser(item)">
                            <el-tooltip content="修改角色" placement="top">
                              <svg-icon icon-class="switchrole"></svg-icon>
                            </el-tooltip>
                          </span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="item in roleList" :key="item.id" :command="item.id">{{item.description}}</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>-->
                        <el-select
                          class="role-select"
                          v-model="item.roleEntities"
                          value-key="id"
                          multiple
                          style="margin-left: 52px;width:calc(100% - 200px);min-width: 300px;"
                          @change="handleSelectRole(item, item.roleEntities)"
                          placeholder="请选择">
                          <el-option
                            v-for="role in roleList"
                            :key="role.id"
                            :label="role.description"
                            :value="role">
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>
                </div>
               <div>
                 <el-pagination
                   style="margin: 15px 0;text-align: center"
                   background
                   layout="total,prev, pager, next"
                   @current-change="userListApaging"
                   :current-page="currentPage"
                   :total="userListA.length">
                 </el-pagination>

               </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label"><svg-icon icon-class="roles"></svg-icon> 角色管理</span>
            <el-row>
              <el-col :span="6" v-for="(item, index) in roleList" :key="index" :offset="(index)%3 == 0 ? 0 : 3"
                      style="margin-bottom: 30px;">
                <el-card :body-style="{ padding: '0px',background:'#fff'}" shadow="hover">
                  <span class="role-icon"><svg-icon icon-class="role"></svg-icon></span>
                  <div style="padding: 14px;position: relative;">
                    <div class="role-name">角色名称: {{item.name}}</div>
                    <div class="role-description">角色描述: {{item.description}}</div>
                    <div class="bottom clearfix role-edit-box">
                      <span @click="handleEditRole(item)"
                            v-if="item.name !== 'user' && item.name !== 'admin'"
                            class="role-edit">
                        <svg-icon icon-class="edit"></svg-icon>
                      </span>
                      <span @click="handleDeleteRole(item.id)" v-if="item.name !== 'user' && item.name !== 'admin'"
                            class="role-delete">
                        <svg-icon icon-class="delete"></svg-icon>
                      </span>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <!--新建用户-->
    <el-dialog title="新建用户"
               class="createDialog"
               :visible.sync="createDialogVisible"
               width="30%">
      <el-form label-position="left" label-width="80px" :model="createUserInfo">
        <el-form-item label="用户名">
          <el-input v-model="createUserInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="createUserInfo.realName"></el-input>
        </el-form-item>
        <!--<el-form-item label="用户密级">
          <el-select v-model="createUserInfo.secretClass" style="width: 100%;">
            <el-option
              v-for="item in secretOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="用户角色">
          <el-select v-model="createUserInfo.roleName" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.description"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户部门">
          <el-select v-model="createUserInfo.departmentName" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in departmentList"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="密码">
          <el-input v-model="createUserInfo.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="再次输入">
          <el-input v-model="createUserInfo.passwordAgain" type="password"></el-input>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers" :loading="addUserLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑用户-->
    <el-dialog title="编辑用户"
               class="editDialog"
               :visible.sync="editDialogVisible"
               width="30%">
      <el-form label-position="left" label-width="80px" :model="userInfo">
        <el-form-item label="用户名">
          <el-input v-model="userInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="userInfo.realName"></el-input>
        </el-form-item>
        <!--<el-form-item label="用户密级">
          <el-select v-model="userInfo.secretClass" style="width: 100%;">
            <el-option
              v-for="item in secretOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑用户密级-->
    <el-dialog title="修改用户密级"
               class="editDialog"
               :visible.sync="editSecretClassDialog"
               width="30%">
      <el-form label-position="left" label-width="80px" :model="userInfo">
        <el-form-item label="用户密级">
          <el-select v-model="userInfo.secretClass" style="width: 100%;">
            <el-option
              v-for="item in secretOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSecretClassDialog = false">取 消</el-button>
        <el-button type="primary" @click="editSecretClass()">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑用户密码-->
    <el-dialog title="编辑用户密码"
               class="editDialog"
               :visible.sync="editPassDialog"
               width="30%">
      <el-form label-position="left" label-width="80px" :model="userInfo">
        <el-form-item label="用户名">
          <el-input v-model="userInfo.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="输入密码">
          <el-input v-model="userInfo.newPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="再次输入">
          <el-input v-model="userInfo.passwordAgain" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPassDialog = false">取 消</el-button>
        <el-button type="primary" @click="editPass()">确 定</el-button>
      </span>
    </el-dialog>
    <!--新建用户角色-->
    <el-dialog title="新建角色"
               class="createDialog"
               :visible.sync="createRoleDialog"
               width="30%">
      <el-form label-position="left" label-width="80px" :model="createRoleInfo">
        <el-form-item label="角色名称">
          <el-input v-model="createRoleInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="createRoleInfo.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="createRoleDialog = false">取 消</el-button>
                <el-button type="primary" @click="addRoles">确 定</el-button>
            </span>
    </el-dialog>
    <!--编辑用户角色-->
    <el-dialog title="编辑用户角色"
               class="editDialog"
               :visible.sync="editRoleDialog"
               width="30%">
      <el-form label-position="left" label-width="80px" :model="roleInfo">
        <el-form-item label="角色名">
          <el-input v-model="roleInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="roleInfo.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="editRoleDialog = false">取 消</el-button>
                <el-button type="primary" @click="editRole()">确 定</el-button>
            </span>
    </el-dialog>
    <!--修改用户部门-->
    <el-dialog title="修改用户部门"
               class="editDialog"
               :visible.sync="editDepaDialog"
               width="30%">
      <el-form label-position="left" label-width="80px" :model="userInfo">
        <el-form-item label="用户部门">
          <el-select value-key="id" v-model="userInfo.department" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in departmentList"
              :key="item.id"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDepaDialog = false">取 消</el-button>
        <el-button type="primary" @click="editDepa()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  /*eslint-disable*/
  import { isvalidUsername, isvalidPwd } from '@/utils/validate'
  import { UserList, updateUser, deleteUser, addUser, disableUser, distributeUserRole, updatePassword, updateSecretClass, updateUserDepartment, ifIncharge, importUserFile } from '@/api/getUsers'
  import { getDepartment } from '@/api/department'
  import { roleList, deleteRole, addRole, updateRole } from '@/api/roles'
  import store from '../../store'
  import qs from 'qs'

  export default {
    name: 'usermanange',
    data() {
      return {
        role: '',
        nowTabs: null,
        selectedUserId: '',
        userList: [],
        listQuery: {
          page: 0,
          size:10,
          limit: 5,
        },
        // roleList: null,
        roleList: [],
        departmentList: [],
        userInfo: {
          id: '',
          username: '',
          realName: '',
          password: '',
          newPassword: '',
          passwordAgain: '',
          secretClass: 0,
          department: null
        },
        createUserInfo: {
          username: '',
          // secretClass: 0,
          realName: '',
          password: '',
          passwordAgain: '',
          roleName: '',
          departmentName: ''
        },
        secretOptions: [
          {
            value: 0,
            name: '公开'
          },
          {
            value: 1,
            name: '内部'
          },
          {
            value: 2,
            name: '秘密'
          },
          {
            value: 3,
            name: '机密'
          },
          /*{
            value: 4,
            name: '绝密'
          },*/
        ],
        roleInfo: {
          id: '',
          name: '',
          description: ''
        },
        createRoleInfo: {
          name: '',
          description: ''
        },
        managerInfo: null,
        createDialogVisible: false,
        editDialogVisible: false,
        editSecretClassDialog: false,
        deleteDialogVisible: false,
        createRoleDialog: false,
        editRoleDialog: false,
        editPassDialog: false,
        editDepaDialog: false,
        addUserLoading: false,
        searchQuery: '',
        newUserList: [],
        currentPage: 1,
        loading: false
      }
    },
    created() {
      this.role = this.$store.getters.roles[0]
      this.getUserList()
      this.getDepartmentList()
      this.getRolesList()
    },
    mounted() {
    },
    methods: {
      importingUsers(){
        let files = document.getElementById('files')
        files.click()
      },
      beforeAvatarUpload() {
        this.loading = true
        let _this = this
        let file  = document.getElementById("files").files[0];
        let dataPost = new FormData()
        dataPost.append('type', 'EXCEL')
        dataPost.append('file', file)
        importUserFile(dataPost).then(res => {
          _this.loading = false
          if(res.data.code === 0) {
            this.getUserList()
            this.$notify({
              title: '成功',
              message: '用户导入成功',
              type: 'success',
              duration: 2000
            })
          } else {
              this.$notify({
                  title: '失败',
                  message: '用户导入失败',
                  type: 'error',
                  duration: 2000
              })
          }
        }).catch(error => {
          _this.loading = false
          _this.$notify({
            title: '失败',
            message: '用户导入失败',
            type: 'error',
            duration: 2000
          })
        })
      },
      getUserList() {
        UserList(this.listQuery).then((res) => {
          if(res.data.code === 0) {
            this.currentPage = 1
            this.userList = res.data.data
            this.userList.forEach((item) => {
              item.originRoleEntities = item.roleEntities
            })
            this.newUserList = this.userListA.slice((this.currentPage-1) * 10,this.currentPage * 10)
          } else {
            this.$notify({
              title: '失败',
              message: res.data.msg,
              type: 'error',
              duration: 2000
            })
          }
        })
      },
      getRolesList() {
        roleList(this.listQuery).then((res) => {
          if(res.data.code === 0) {
            this.roleList = res.data.data.filter((item) => {
              return item.name !== 'admin' && item.name !== 'security_guard' && item.name !== 'security_auditor' && item.name !== 'users'
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
      },
      getDepartmentList() {
        getDepartment().then((res) => {
          if(res.data.code === 0) {
            this.departmentList = res.data.data
          }
        })
      },
      resetCreateUser() {
        this.createUserInfo = {
          username: '',
          password: '',
          passwordAgain: '',
          realName: '',
          // secretClass: 0,
          roleName: ''
        }
      },
      handlAddUser() {
        this.resetCreateUser()
        this.createDialogVisible = true
      },
      handleEditUser(item) {
        this.editDialogVisible = true
        this.userInfo = Object.assign({}, item)
      },
      handleEditSecretClass(item) {
        if(this.role !== 'ROLE_SECURITY_GUARD') {
          return
        }
        this.editSecretClassDialog = true
        this.userInfo = Object.assign({}, item)
      },
      handleEditPass(item) {
        this.editPassDialog = true
        this.userInfo = Object.assign({}, item)
      },
      handleEditDepa(item) {
        this.editDepaDialog = true
        this.userInfo = Object.assign({}, item)
      },
      handleDisableUser(item){
        this.$confirm('确认禁用此用户吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            enabled: false
          }
          let qs = require('qs');
          let postData = qs.stringify(data);
          disableUser(item.id, postData).then((res) => {
            if(res.data.code === 0) {
              this.getUserList()
              this.$notify({
                title: '成功',
                message: '用户禁用成功',
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
        })
      },
      handleEnableUser(item) {
        this.$confirm('确认将此用户解禁吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            enabled: true
          }
          let qs = require('qs');
          let postData = qs.stringify(data);
          disableUser(item.id, postData).then((res) => {
            if(res.data.code === 0) {
              this.getUserList()
              this.$notify({
                title: '成功',
                message: '用户解禁成功',
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
        })
      },
      handleDeleteUser(item) {
        this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            userId: item.id
          }
          let qs = require('qs');
          let postData = qs.stringify(data)
          ifIncharge(postData).then((res) => {
            if(res.data.code === 0) {
              if(res.data.data === true) {
                this.$confirm('该用户有正在进行中的项目或审核任务，确认删除吗？', '警告', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'error'
                }).then(() => {
                  deleteUser(item.id).then((res) => {
                    if(res.data.code === 0) {
                      this.getUserList()
                      this.$notify({
                        title: '成功',
                        message: '删除成功',
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
                }).catch(() => {

                })
              } else {
                deleteUser(item.id).then((res) => {
                  if(res.data.code === 0) {
                    this.getUserList()
                    this.$notify({
                      title: '成功',
                      message: '删除成功',
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
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleDeleteRole(id) {
        this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRole(id).then((res) => {
            if(res.data.code === 0) {
              this.getRolesList()
              this.getUserList()
              this.$notify({
                title: '成功',
                message: '删除成功',
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
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handlAddRole() {
        this.resetRoleTemp()
        this.createRoleDialog = true
      },
      handleEditRole(item) {
        this.editRoleDialog = true
        this.roleInfo = Object.assign({}, item)
      },
      resetRoleTemp() {
        this.createRoleInfo.name = ''
        this.createRoleInfo.description = ''
      },
      addRoles() {
        var qs = require('qs')
        let data = {
          'name': this.createRoleInfo.name,
          'description': this.createRoleInfo.description
        }
        // let datapost = qs.stringify(data)
        addRole(data).then((res) => {
          if(res.data.code === 0) {
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.resetRoleTemp()
            this.getRolesList()
            this.createRoleDialog = false
          } else {
            this.$notify({
              title: '失败',
              message: res.data.msg,
              type: 'error',
              duration: 2000
            })
          }
        })
      },
      addUsers() {
        this.addUserLoading = true
        let qs = require('qs')
        let data = {
          'username': this.createUserInfo.username,
          // 'password': this.createUserInfo.password,
          // 'secretClass': this.createUserInfo.secretClass,
          'roleName': this.createUserInfo.roleName,
          'realName': this.createUserInfo.realName,
          'departmentName': this.createUserInfo.departmentName,
        }
        let postData = qs.stringify(data)
        let roleName = this.createUserInfo.roleName
        addUser(postData, roleName).then((res) => {
          if(res.data.code === 0) {
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getUserList()
            this.createDialogVisible = false
          } else {
            this.$notify({
              title: '失败',
              message: res.data.msg,
              type: 'error',
              duration: 2000
            })
          }
          this.addUserLoading = false
        }).catch(() => {
          this.addUserLoading = false
        })
      },
      editUser() {
        var qs = require('qs')
        let data = {
          'username': this.userInfo.username,
          'realName': this.userInfo.realName
          // 'secretClass': this.userInfo.secretClass
        }
        let datapost = qs.stringify(data)
        updateUser(this.userInfo.id, datapost).then((res) => {
          if(res.data.code === 0) {
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.getUserList()
            this.editDialogVisible = false
          } else {
            this.$notify({
              title: '失败',
              message: res.data.msg,
              type: 'error',
              duration: 2000
            })
          }
        })
      },
      editSecretClass() {
        var qs = require('qs')
        let data = {
          'secretClass': this.userInfo.secretClass
        }
        let datapost = qs.stringify(data)
        updateSecretClass(this.userInfo.id, datapost).then((res) => {
          if(res.data.code === 0) {
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.getUserList()
            this.editSecretClassDialog = false
          } else {
            this.$notify({
              title: '失败',
              message: res.data.msg,
              type: 'error',
              duration: 2000
            })
          }
        })
      },
      editRole() {
        var qs = require('qs')
        let data = {
          'name': this.roleInfo.name,
          'description': this.roleInfo.description
        }
        let datapost = qs.stringify(data)
        updateRole(datapost, this.roleInfo.id,).then((res) => {
          if(res.data.code === 0) {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            this.getRolesList()
            this.editRoleDialog = false
          } else {
            this.$notify({
              title: '失败',
              message: '修改失败',
              type: 'error',
              duration: 2000
            })
          }
        })
      },
      editPass() {
        var qs = require('qs')
        let data = {
          'password': this.userInfo.newPassword
        }
        let datapost = qs.stringify(data)
        updatePassword(this.userInfo.id, datapost).then((res) => {
          if(res.data.code === 0) {
            this.$notify({
              title: '成功',
              message: '密码修改成功',
              type: 'success',
              duration: 2000
            })
            this.editPassDialog = false
          } else {
            this.$notify({
              title: '失败',
              message: res.data.msg,
              type: 'error',
              duration: 2000
            })
          }
        })
      },
      editDepa() {
        var qs = require('qs')
        let data = {
          'departmentId': this.userInfo.department.id
        }
        let datapost = qs.stringify(data)
        updateUserDepartment(this.userInfo.id, datapost).then((res) => {
          if(res.data.code === 0) {
            this.$notify({
              title: '成功',
              message: '部门修改成功',
              type: 'success',
              duration: 2000
            })
            this.editDepaDialog = false
            this.getUserList()
          } else {
            this.$notify({
              title: '失败',
              message: res.data.msg,
              type: 'error',
              duration: 2000
            })
          }
        })
      },
      handleSelectUser(item) {
        this.selectedUserId = item.id
      },
      /*handleSelectRole(id) {
        this.$confirm('确认选择该角色吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var qs = require('qs')
          let data = {
            'roleId': id
          }
          let datapost = qs.stringify(data)
          distributeUserRole(this.selectedUserId, datapost).then((res) => {
            if(res.data.code === 0) {
              this.$notify({
                title: '成功',
                message: res.data.msg,
                type: 'success',
                duration: 2000
              })
              this.getUserList()
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
            message: '已取消选择'
          })
        })
      }
    },*/
      handleEnableSelect(item) {
        item.edit = true
      },
      handleSelectRole(item, roleEntities) {
        /*this.$confirm('确认选择该角色吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消选择'
          })
        })
      }*/
        let ids = []
        roleEntities.forEach((item) => {
          ids.push(item.id)
        })
        let roleIds = (ids + '').replace(/\[|]/g, '')
        var qs = require('qs')
        let data = {
          'ids': roleIds
        }
        let datapost = qs.stringify(data)
        distributeUserRole(item.id, datapost).then((res) => {
          if (res.data.code === 0) {
            this.$notify({
              title: '成功',
              message: '角色修改成功',
              type: 'success',
              duration: 2000
            })
            this.getUserList()
          } else {
            item.roleEntities = item.originRoleEntities
            this.$notify({
              title: '失败',
              message: res.data.msg,
              type: 'error',
              duration: 2000
            })
          }
        })
      },
      userListApaging(val){
        this.currentPage = val
        this.newUserList = this.userListA.slice((val-1) * 10,val * 10)
      },
    },
    beforeMount(){
      console.log(this.userListA)

    },
    computed: {
        userListA: function () {
        let self = this;
        return self.userList.filter(function (item) {
          return item.username.toLowerCase().indexOf(self.searchQuery.toLowerCase()) !== -1;
        })
      },
      listenNowTabs() {
        return this.nowTabs
      },
      computedSecret() {
        return function(secretClass) {
          if(secretClass === 0) {
            return '公开'
          }
          if(secretClass === 1) {
            return '内部'
          }
          if(secretClass === 2) {
            return '秘密'
          }
          if(secretClass === 3) {
            return '机密'
          }
          if(secretClass === 4) {
            return '绝密'
          }
        }
      }
    },

    watch: {
      listenNowTabs: function() {
      }
    }
  }
</script>

<style lang="scss" scoped>
  .editor-create {
    right: 35px;
    position: absolute;
    top: 40px;
    z-index: 1000;
    // color: rgb(92, 184, 92);
    color: #12d0d5;
    cursor: pointer;
  }

  .managerCont {
    height: 100%;
    padding-right: 30px;

    .managerAvatar {
      width: 100px;
      height: 100px;
      padding: 6px;
      background: #fff;
      border-radius: 50%;
      padding: 8px;
      margin: 0 auto;

      .avatar {
        display: inline-block;
        width: 100%;
        height: 100%;
        background: #ddd;
        border-radius: 50%;
        font-size: 60px;
        line-height: 80px;
      }
    }

    .managerInfo {
      width: 100%;
      padding: 30px 0;

      .info-title, .info-mes {
        width: 50%;
        display: inline-block;
        text-align: left;

        span {
          display: block;
        }
      }

      .infoBox {
        box-sizing: border-box;
        height: 35px;
        line-height: 35px;
        padding-left: 8px;

        span {
          display: inline-block;
          width: 50%;
          text-align: left;
          color: rgb(119, 119, 119);
          font-size: 13px;
        }
      }

      .infoBox:nth-child(odd) {
        background: #fff;
      }
    }
  }

  .usermanageCont {
    /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
    -ms-overflow-style: none;
    /*火狐下隐藏滚动条*/
    overflow: -moz-scrollbars-none;
    scrollbar-width: none;
  }

  /*Chrome下隐藏滚动条，溢出可以透明滚动*/
  .usermanageCont::-webkit-scrollbar {
    width: 0px
  }

  .usermanageCont {
    box-sizing: border-box;
    padding: 32px;
    background-color: #f2f8f9;
    width: 100%;
    // height: 100%;
    overflow-y: scroll;
    position: absolute;
    top: 63px;
    bottom: 0;

    .user-item {
      position: relative;
      overflow: hidden;
      border-bottom: 1px solid #eee;
      // margin-bottom: 10px;
    }

    .editor-box {
      position: absolute;
      top: 4px;
      right: 0px;

      .editor-item {
        width: 20px;
        margin-right: 4px;
        font-size: 18px;
        cursor: pointer;

        &.editor-create {
          // color: rgb(92, 184, 92)
          color: #12d0d5;
        }

        &.editor-edit {
          // color: rgb(240, 173, 48)
          color: #3f9fe1
        }

        &.editor-delete {
          color: rgb(233, 102, 44)
        }

        &.editor-disable {
          color: #f04d4e;
        }
        &.editor-enable {
          position: relative;
          top: 1px;
          color: #2eb2dc;
        }
      }
    }

    .avatarCont {
      float: left;
      width: 60px;
      height: 100%;
      // background: #123;
      font-size: 40px;

      .user-avatar {
        display: inline-block;
        /*width: 40px;
        height: 40px;*/
        margin-top: 8px;
        // background: #eee;
        border-radius: 6px;
        text-align: center;
        cursor: pointer;
      }
    }

    .userMesCont {
      float: left;
      width: calc(100% - 80px);
      height: 100%;
      box-sizing: border-box;
      padding: 10px;
      text-align: left;
      // background: #445;
      .name {
        color: rgb(119, 119, 119);
        font-size: 14px;
        position: relative;
      }
      .userSecret {
        margin-top: 6px;
      }
      .username-title {
        color: #777;
        font-size: 14px;
      }

      .username-text {
        // color: #777;
        font-weight: 500;
        font-size: 14px;
        margin-left: 10px;
      }
      .secret-text {
        // color: #777;
        font-weight: 500;
        font-size: 14px;
        margin-left: 22px;
      }
      .userMes div {
        /*height: 24px;
        line-height: 24px;*/
        /*height: 30px;
        line-height: 30px;*/
      }

      .switchrole {
        margin-left: 10px;
        font-size: 20px;
        cursor: pointer;
      }
      .role-text {
        display: inline-block;
        height: 30px;
        position: absolute;
        top: 8px;bottom: 0;
      }
    }

    .userboard {
      background: #fff;
      padding: 0 18px 18px 0;
    }

    .role-icon {
      display: block;
      width: 100%;
      height: 48px;
      padding-left: 10px;
      background: rgba(66, 156, 266, 0.66);
      // background: rgba(46, 178, 220, 0.75);
      font-size: 40px;
    }
  }

  .filiter-box {
    text-align: left;
    padding-bottom: 20px;
    padding-left: 8px;
    border-bottom: 1px solid #eee;
  }

  .input-group {
    padding: 0 10px;
  }

  .input-group-button {
    height: 32px;
    width: 32px;
    line-height: 32px;
    position: relative;
    top: 1px;
    left: -10px;
    display: inline-block;
    // background: #3f7b5f;
    background: #12d0d5;
    cursor: pointer;
    text-align: center;
  }

  .role-edit-box {
    position: absolute;
    top: -40px;
    right: 10px;
  }
  .role-edit {
    // color: rgb(240, 173, 48);
    color: #4a7de6;
    cursor: pointer;
  }

  .role-delete {
    color: rgb(233, 102, 44);
    cursor: pointer;
  }

  .role-name, .role-description{
    height: 20px;
    line-height: 20px;
    padding: 4px 0;
    font-size: 13px;
    color: #777;
  }
</style>
