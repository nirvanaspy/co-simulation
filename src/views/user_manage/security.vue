<template>
  <div class="usermanageCont">
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
              <div v-for="item in userListA" class="user-item" v-if="item.username !== 'admin' && item.username !== 'securityGuard' && item.username !== 'securityAuditor'">
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
                    <span class="username-text">{{item.username}}</span>
                  </div>
                  <div class="userName">
                    <span class="username-title">姓名:</span>
                    <span class="username-text">{{item.realName}}</span>
                  </div>
                  <div class="userSecret">
                    <span class="username-title">部门:</span>
                    <span class="secret-text">{{item.department.name}}</span>
                  </div>
                  <div class="userSecret">
                    <span class="username-title">密级:</span>
                    <span class="secret-text link-type" @click="handleEditSecretClass(item)">{{computedSecret(item.secretClass)}}</span>
                  </div>
                  <div class="userMes">
                    <div class="user-role name" v-if="item.roleEntities">
                      <span class="role-text">角色:</span>
                      <el-select
                        class="role-select"
                        v-model="item.roleEntities"
                        value-key="id"
                        multiple
                        style="margin-left: 52px;width:calc(100% - 200px);min-width: 300px;"
                        :disabled="true"
                        placeholder="请选择">
                        <el-option
                          v-for="role in item.roleEntities"
                          :key="role.id"
                          :label="role.description"
                          :value="role">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
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
  </div>
</template>

<script>
  /*eslint-disable*/
  import { UserList, updateUser, deleteUser, addUser, disableUser, distributeUserRole, updatePassword, updateSecretClass, updateUserDepartment, ifIncharge } from '@/api/getUsers'
  import { getDepartment } from '@/api/department'
  import { roleList, deleteRole, addRole, updateRole } from '@/api/roles'
  import store from '../../store'

  export default {
    name: 'security',
    data() {
      return {
        listQuery: {
          page: 0,
          size:10,
          limit: 5,
        },
        role: '',
        nowTabs: null,
        selectedUserId: '',
        userList: [],
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
          }
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
        searchQuery: ''
      }
    },
    created() {
      this.role = this.$store.getters.roles[0]
      this.getUserList()
    },
    mounted() {
    },
    methods: {
      getUserList() {
        UserList(this.listQuery).then((res) => {
          if (res.data.code === 0) {
            this.userList = res.data.data
            this.userList.forEach((item) => {
              item.originRoleEntities = item.roleEntities
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
      handleEditSecretClass(item) {
        if(this.role !== 'ROLE_SECURITY_GUARD') {
          return
        }
        this.editSecretClassDialog = true
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
      handleSelectUser(item) {
        this.selectedUserId = item.id
      },
      handleEnableSelect(item) {
        item.edit = true
      },
      handleSelectRole(item, roleEntities) {
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
      }
    },
    computed: {
      userListA: function () {
        let self = this
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
        color: #777;
        font-weight: 500;
        font-size: 14px;
        margin-left: 10px;
      }
      .secret-text {
        color: #777;
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
