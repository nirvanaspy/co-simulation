<template>
  <div class="usermanageCont">
    <span class="editor-create" @click="handlAddUser()" v-if="nowTabs == 0">
        <svg-icon icon-class="create"></svg-icon>
    </span>
    <span class="editor-create" @click="handlAddRole()" v-if="nowTabs == 1">
        <svg-icon icon-class="create"></svg-icon>
    </span>
    <el-row style="height: 100%;">
      <el-col :xs="24" :sm="24" :md="24">
        <el-tabs type="border-card" v-model="nowTabs">
          <el-tab-pane>
            <span slot="label"><svg-icon icon-class="peoples"></svg-icon> 用户管理</span>
            <div class="userboard">
              <div class="filiter-box">
                <div class="input-group">
                  <el-input type="text" size="small" style="width:200px;"></el-input>
                  <div class="input-group-button">
                    <svg-icon icon-class="search"></svg-icon>
                  </div>
                </div>
              </div>
              <div v-for="item in userList" class="user-item" v-if="item.username !== 'admin'">
                <div class="editor-box">
                  <span class="editor-item editor-edit" @click="handleEditPass(item)">
                    <svg-icon icon-class="edit"></svg-icon>
                  </span>
                  <span class="editor-item editor-disable" @click="handleDisableUser(item)">
                    <svg-icon icon-class="disable"></svg-icon>
                  </span>
                  <span class="editor-item editor-enable" @click="handleEnableUser(item)">
                    <svg-icon icon-class="enable"></svg-icon>
                  </span>
                  <span class="editor-item editor-delete" @click="handleDeleteUser(item)">
                    <svg-icon icon-class="delete"></svg-icon>
                  </span>
                </div>
                <div class="avatarCont">
                  <span class="user-avatar">
                    <!--<img :src="genenrateAvatar(item.id)" alt="">-->
                    <svg-icon icon-class="user-1"></svg-icon>
                  </span>
                </div>
                <div class="userMesCont">
                  <div class="userName">
                    <span class="username-title">用户名:</span>
                    <span class="username-text link-type" @click="handleEditUser(item)">{{item.username}}</span>
                  </div>
                  <div class="userMes">
                    <div class="user-role name">角色:
                      <!--<span>  {{item.roleEntity.name}}-{{item.roleEntity.description}}</span>-->
                      <el-dropdown placement="bottom-start" trigger="click" @command="handleSelectRole">
                        <!--<el-button type="primary">
                            更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>-->
                        <span class="switchrole" @click="handleSelectUser(item)"><svg-icon
                          icon-class="switchrole"></svg-icon></span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item v-for="item in roleList" :command="item.id">{{item.name}}</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </div>
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
                    <div class="role-description">角色名称: {{item.description}}</div>
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
        <el-form-item label="密码">
          <el-input v-model="createUserInfo.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="再次输入">
          <el-input v-model="createUserInfo.passwordAgain" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑用户密码-->
    <el-dialog title="编辑用户密码"
               class="editDialog"
               :visible.sync="editPassDialog"
               width="30%">
      <el-form label-position="left" label-width="80px" :model="userInfo">
        <el-form-item label="用户名">
          <el-input v-model="userInfo.username" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="输入密码">
          <el-input v-model="userInfo.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="再次输入">
          <el-input v-model="userInfo.passwordAgain"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="editRoleDialog = false">取 消</el-button>
                <el-button type="primary" @click="editPass()">确 定</el-button>
            </span>
    </el-dialog>
    <!--新建用户角色-->
    <el-dialog title="新建用户角色"
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
  </div>
</template>

<script>
  /*eslint-disable*/
  import { isvalidUsername, isvalidPwd } from '@/utils/validate'
  import { UserList, updateUser, deleteUser, addUser, disableUser, distributeUserRole } from '@/api/getUsers'
  import { roleList, deleteRole, addRole, updateRole } from '@/api/roles'
  import store from '../../store'

  export default {
    name: 'usermanange',
    data() {
      return {
        nowTabs: null,
        selectedUserId: '',
        userList: [{
          username: 'aaa',
          email: 'aaa@qq.com',
          telephoneNum: '12345678910',
          id: 'qwertrtgdfgdsassffdfg'
        }],
        listQuery: {
          page: 0,
          size:10,
          limit: 5,
        },
        // roleList: null,
        roleList: [
          {
            name: 'abc',
            id: '1223123'
          },
          {
            name: 'abc',
            id: '1223123'
          },
          {
            name: 'abc',
            id: '1223123'
          },
          {
            name: 'abc',
            id: '1223123'
          },
          {
            name: 'abc',
            id: '1223123'
          },
          {
            name: 'abc',
            id: '1223123'
          }
        ],
        userInfo: {
          id: '',
          username: '',
          password: '',
          newPassword: '',
          passwordAgain: '',
        },
        createUserInfo: {
          username: '',
          password: '',
          passwordAgain: ''
        },
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
        deleteDialogVisible: false,
        createRoleDialog: false,
        editRoleDialog: false,
        editPassDialog: false
      }
    },
    created() {
      this.getUserList()
      this.getRolesList()
    },
    mounted() {
    },
    methods: {
      getUserList() {
        UserList(this.listQuery).then((res) => {
          this.userList = res.data.data.content
        })
      },
      getRolesList() {
        roleList(this.listQuery).then((res) => {
          this.roleList = res.data.data
        })
      },
      resetCreateUser() {
        this.createUserInfo = {
          username: '',
          password: '',
          passwordAgain: ''
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
      handleEditPass(item) {
        this.editPassDialog = true
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

          })
        })
      },
      handleDeleteUser(item) {
        this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUser(item.id).then(() => {
            this.getUserList()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          }).catch(() => {
            this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'error',
              duration: 2000
            })
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
          deleteRole(id).then(() => {
            this.getRolesList()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          }).catch(() => {
            this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'error',
              duration: 2000
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handlAddRole() {
        this.createRoleDialog = true
      },
      handleEditRole(item) {
        this.editRoleDialog = true
        this.roleInfo = Object.assign({}, item)
      },
      addRoles() {
        var qs = require('qs')
        let data = {
          'name': this.createRoleInfo.name,
          'description': this.createRoleInfo.description
        }
        let datapost = qs.stringify(data)
        addRole(datapost).then(() => {
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
          this.getRolesList()
          this.createRoleDialog = false
        }).catch(() => {
          this.$notify({
            title: '失败',
            message: '创建失败',
            type: 'error',
            duration: 2000
          })
        })
      },
      addUsers() {
        let data = {
          'username': this.createUserInfo.username,
          'password': this.createUserInfo.password
        }
        addUser(data).then(() => {
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
          this.getUserList()
          this.createDialogVisible = false
        }).catch(() => {
          this.$notify({
            title: '失败',
            message: '创建失败',
            type: 'error',
            duration: 2000
          })
        })
      },
      editUser() {
        var qs = require('qs')
        let data = {
          'username': this.userInfo.username,
          'email': this.userInfo.email,
          'telephoneNum': this.userInfo.telephoneNum
        }
        let datapost = qs.stringify(data)
        modifyUser(this.userInfo.id, datapost).then((res) => {
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
          this.getUserList()
        }).catch(() => {
          this.$notify({
            title: '失败',
            message: '更新失败',
            type: 'error',
            duration: 2000
          })
        })
      },
      editRole() {
        var qs = require('qs')
        let data = {
          'name': this.roleInfo.name,
          'description': this.roleInfo.description
        }
        let datapost = qs.stringify(data)
        updateRole(datapost, this.roleInfo.id,).then(() => {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
          this.getRolesList()
          this.editRoleDialog = false
        }).catch(() => {
          this.$notify({
            title: '失败',
            message: '修改失败',
            type: 'error',
            duration: 2000
          })
        })
      },
      editPass() {

      },
      handleSelectUser(item) {
        this.selectedUserId = item.id
      },
      handleSelectRole(id) {
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
          switchRole(this.selectedUserId, datapost).then(() => {
            this.$notify({
              title: '成功',
              message: '角色修改成功',
              type: 'success',
              duration: 2000
            })
            this.getUserList()
          }).catch(() => {
            this.$notify({
              title: '失败',
              message: '角色修改失败',
              type: 'error',
              duration: 2000
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消选择'
          })
        })
      }
    },
    computed: {
      listenNowTabs() {
        return this.nowTabs
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

      .userMes div {
        height: 24px;
        line-height: 24px;
      }

      .switchrole {
        margin-left: 10px;
        font-size: 20px;
        cursor: pointer;
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
