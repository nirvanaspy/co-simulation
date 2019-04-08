<template>
  <div class="project-container">
    <!--<el-header style="background: linear-gradient(120deg, #00e4d0, #5983e8);line-height: 63px;height: 63px;">
      <div class="searchContainer" style="display: inline-block;margin-bottom:16px;">
        <span class="icon-search"><svg-icon icon-class="search"></svg-icon></span>
        <el-input style="width: 160px;margin-right: 12px;" class="filter-item" placeholder="项目名" v-model="searchQuery">
        </el-input>
        <el-dropdown trigger="click" placement="bottom-start">
          <span class="add-item">
            <svg-icon icon-class="add"></svg-icon>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="this.role === 'ROLE_PROJECT_MANAGER'">
              <span @click="handleCreate($event)"><svg-icon class="add-item-icon" icon-class="tree-pro"></svg-icon>创建项目</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <span @click="handleMangeDesignLinks"><svg-icon icon-class="tree-task" class="add-item-icon"></svg-icon>设计环节</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="proTitle">
          <span><svg-icon icon-class="co-simulation"></svg-icon></span>
          <span>CO-Simulation</span>
          <el-dropdown style="position:absolute;top:-1px;right: 6px;" trigger="click" placement="bottom-start">
            <span class="el-dropdown-link my-menu-icon">
              <svg-icon icon-class="menu"></svg-icon>
            </span>
            <el-dropdown-menu slot="dropdown" class="my-menu-dropdown">
              <div class="flex-menu-box">
                <div class="flex-menu-item">
                  <span class="icon-box">
                    <svg-icon icon-class="knowledge"></svg-icon>
                  </span>
                  <span class="icon-text">知识库</span>
                </div>
                <div class="flex-menu-item">
                  <span class="icon-box">
                    <svg-icon icon-class="config"></svg-icon>
                  </span>
                  <span class="icon-text">参数库</span>
                </div>
                <div class="flex-menu-item" @click="jumpToAudit()">
                  <span class="icon-box" style="color: #3f9fe1;">
                    <svg-icon icon-class="audit"></svg-icon>
                  </span>
                  <span class="icon-text">我的审查</span>
                </div>
              </div>
              &lt;!&ndash;<el-dropdown-item>狮子头</el-dropdown-item>&ndash;&gt;
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="right-menu">
        <span calss="userName" style="position: relative;top: -12px;color: #fff;">{{userName}}</span>
        <el-dropdown class="avatar-container right-menu-item" trigger="click">
          <div class="avatar-wrapper">
            <pan-thumb class="proImg" width="40px" height="40px" image="./2/png">
            </pan-thumb>
            <i class="el-icon-caret-bottom"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <span v-if="role === 'ROLE_ADMIN'" style="display:block;">
                <router-link to="/user_manage/index">用户管理</router-link>
              </span>
              <span v-else @click="handleModifyPassword" style="display:block;">修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>-->
    <div class="searchContainer my-search-box">
      <span class="icon-search"><svg-icon icon-class="search"></svg-icon></span>
      <el-input style="width: 160px;margin-right: 12px;" class="filter-item" placeholder="项目名" v-model="searchQuery">
      </el-input>
      <el-dropdown trigger="click" placement="bottom-start">
          <span class="add-item">
            <svg-icon icon-class="add"></svg-icon>
          </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-if="this.role === 'ROLE_PROJECT_MANAGER'">
            <span @click="handleCreate($event)"><svg-icon class="add-item-icon" icon-class="tree-pro"></svg-icon>创建项目</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="handleMangeDesignLinks"><svg-icon icon-class="tree-task" class="add-item-icon"></svg-icon>设计环节</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="title-container">
      <h3 class="title" style="margin-bottom:30px">
      </h3>
    </div>
    <el-row :gutter="20">
      <!--结构树-->
      <el-col :span="6">
        <div style="width: 300px;margin: 60px auto;">
          <el-tree v-if="!isHistory" class="filter-tree" :data="listTree" :props="defaultProps" :default-expand-all="false" :render-content="renderContent">ref="tree2">
          </el-tree>
        </div>
      </el-col>
      <!--项目详情-->
      <el-col :span="12">
        <el-tabs tab-position="top" style="height: calc(100% - 200px);" @tab-click="handleTabClick">
          <el-tab-pane label="所有项目">
            <span class="tab-name" slot="label" style="font-size: 16px;">所有项目<i class="el-icon-document" style="padding-left: 10px;"></i></span>
            <div class="project-list" v-loading="listLoading">
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
                  <div class="info-detail info-name"><span @click="handleSelect(item)">{{item.name}}</span></div>
                  <div class="info-detail info-secretClass">密级：{{computeSecretClass(item.secretClass)}}</div>
                  <!--<div class="info-detail info-description">{{item.description}}</div>-->
                </div>
                <div class="project-operation project-detail">
                  <span class="icons icons-setting" @click="handleStartPro(item)">
                    <el-tooltip content="启动项目" placement="top">
                      <svg-icon icon-class="startup"></svg-icon>
                    </el-tooltip>
                  </span>
                  <span class="icons icons-setting" @click="handleProSetting(item)">
                    <el-tooltip content="打开项目设置" placement="top">
                      <svg-icon icon-class="components3"></svg-icon>
                    </el-tooltip>
                  </span>
                  <!--<span class="icons icons-edit" @click="handleUpdate(item)">
                    <el-tooltip content="编辑" placement="top">
                      <svg-icon icon-class="edit"></svg-icon>
                    </el-tooltip>
                  </span>-->
                  <span class="icons icons-delete" @click="handleDelete(item)">
                    <el-tooltip content="删除" placement="top">
                      <svg-icon icon-class="delete"></svg-icon>
                    </el-tooltip>
                  </span>
                </div>
              </div>
              <div class="new-project-container" v-if="!isHistory && this.role === 'ROLE_PROJECT_MANAGER'">
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
            <span slot="label" class="tab-name" style="font-size: 16px;">回收站<i class="el-icon-delete" style="padding-left: 10px;"></i></span>
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
      </el-col>
      <!--占位-->
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    </el-row>
    <!--创建或者修改项目-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" append-to-body width="40%" class="limit-width-dialog">
      <div class="img-container"></div>
      <div class="text-container">为不同的产品建立各自的项目</div>
      <el-form :rules="rules" ref="dataForm" :model="temp" style='width: 100%; margin:0 auto;' label-width="70px">
        <el-form-item :label="$t('table.projectName')" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="密级" prop="secretClass" >
          <el-select v-model="temp.secretClass" placeholder="请选择项目密级" style="width: 100%" @change="clearPicOption">
            <el-option
              v-for="item in secretClassOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人" prop="manager" >
          <el-select v-model="temp.manager" @focus="getAbleUser" placeholder="请选择项目负责人" style="width: 100%">
            <el-option
              :loading="getMaLoading"
              v-for="item in proManagerOptions"
              :key="item.id"
              :label="item.username"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.projectDesc')" prop="description">
          <el-input v-model="temp.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData" :loading="creProLoading">
          {{$t('table.confirm')}}
        </el-button>
        <!--<el-button v-else type="primary" @click="updateData" :loading="creProLoading">{{$t('table.confirm')}}
        </el-button>-->
      </div>
    </el-dialog>
    <!--普通用户修改密码-->
    <el-dialog title="修改密码" :visible.sync="modifyPasswordVisible" append-to-body width="40%" class="limit-width-dialog">

      <el-form :model="form" ref="modifyPassForm" :rules="modifyRules" style="width: 80%; margin:0 auto;">
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
    <!--修改项目设置-->
    <el-dialog title="项目设置" :visible.sync="proSettingVisible" append-to-body width="60%" class="pro-setting-dialog">
      <el-tabs tab-position="left" style="height: 600px;">
        <el-tab-pane label="项目概览">
          <span class="tab-name" slot="label"><i class="el-icon-tickets" style="padding-right: 10px;"></i>项目概览</span>
          <el-form label-position="top" :model="temp" style="width: 100%;">
            <el-form-item :label="$t('table.projectName')" :label-width="formLabelWidth">
              <el-input v-model="temp.name" :disabled="!hasPermission"></el-input>
            </el-form-item>
            <el-form-item label="项目描述" :label-width="formLabelWidth">
              <el-input v-model="temp.description" :disabled="!hasPermission" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="项目负责人" :label-width="formLabelWidth">
              <span v-if="temp.pic">{{temp.pic.username}}</span>
              <el-dropdown placement="bottom-start" trigger="click" @click.native="getAbleUser" @command="setPersonInC" v-if="hasPermission">
                <span class="switPic">
                  <el-tooltip content="修改负责人" placement="top">
                    <svg-icon icon-class="switch"></svg-icon>
                  </el-tooltip>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(item, index) in proManagerOptions"
                                    :key="index"
                                    :loading="getMaLoading"
                                    :command="item">{{item.username}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-form-item>
          </el-form>
          <el-button type="primary" style="float: right;" @click="updateData" :disabled="!hasPermission || (temp.name === saveTemp.name && temp.description === saveTemp.description) || (temp.description === '' && saveTemp.description === null && temp.name === saveTemp.name)">保 存</el-button>
        </el-tab-pane>
        <!--<el-tab-pane label="任务管理">
          <span class="tab-name" slot="label"><i class="el-icon-setting" style="padding-right: 10px;"></i>配置管理</span>
          <div>
            &lt;!&ndash;<el-select v-model="temp.proDesignLinkEntitySet" multiple placeholder="请选择" @focus="getDesignLinks" style="width: 100%;" @change="setProDesignLink">
              <el-option
                v-for="item in designLinks"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>&ndash;&gt;
            <div v-for="item in temp.proDesignLinkEntitySet"></div>
          </div>
        </el-tab-pane>-->
        <el-tab-pane label="日程设置">
          <span class="tab-name" slot="label"><i class="el-icon-date" style="padding-right: 10px;"></i>日程设置</span>
          <div>
            <!--<div>
              <span>项目令号与节点</span>
              <span class="setOrder" >
                <svg-icon icon-class="components3"></svg-icon>
              </span>
            </div>-->
            <div>
              <div class="item-box">
                <div class="item-name">项目令号：</div>
                <div v-if="temp.orderNum === null"><el-input v-model="orderNum" placeholder="暂无令号，请输入"></el-input></div>
                <div v-else>
                  <el-input v-model="temp.orderNum" placeholder="请输入内容"></el-input>
                  <!--<el-button type="primary" size="mini" @click="updateOrderNum">修改</el-button>-->
                </div>
              </div>
              <div class="item-box">
                <div class="item-name">交付节点：</div>
                <div v-if="temp.finishTime === null">
                  <el-date-picker
                    v-model="finishTime"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="timestamp">
                  </el-date-picker>
                </div>
                <div v-else>
                  <el-date-picker
                    v-model="temp.finishTime"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="timestamp">
                  </el-date-picker>
                  <!--<el-button type="primary" size="mini" @click="updateFinishTimeAndOrder">修改</el-button>-->
                </div>
              </div>
              <div>
                <el-button class="edit-button" v-if="temp.finishTime === null || temp.orderNum === null" type="primary" @click="setFinishTimeAndOrder">设置</el-button>
                <el-button class="edit-button" v-else type="primary" @click="updateFinishTimeAndOrder">修改</el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!--管理设计环节-->
    <el-dialog title="设计环节管理" :visible.sync="designLinkVisible" append-to-body width="40%" class="limit-width-dialog">
      <designLink v-if="designLinkVisible"></designLink>
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
    updateProPic,
    deleteProject,
    projectListHis,
    projectList_userHis,
    restorePro,
    cleanPro,
    starPro,
    arrangePro,
    startPro,
    getProjectAuth
  } from '@/api/project'
  import { updatePassword, allUser } from '@/api/getUsers'
  import { getLinks } from '@/api/designLinks'
  import store from '../../store'
  import designLink from '@/views/designLinks/index'
  /*eslint-disable*/
  export default {
    components: {PanThumb,designLink},
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
        hasPermission: false,
        tableKey: 0,
        list: [],
        proManagerOptions: [],
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
        proSettingVisible: false,
        designLinkVisible: false,
        modPasLoading: false,
        passwordType: 'password',
        passwordTypeAgain: 'password',
        btnConfirm: false,
        passwordValidate: false,
        pasAgainValidate: false,
        formLabelWidth: '100px',
        secretClassOptions: [
          {
            label: '公开',
            value: 0
          },
          {
            label: '内部',
            value: 1
          },
          {
            label: '秘密',
            value: 2
          },
          {
            label: '机密',
            value: 3
          },
          /*{
            label: '绝密',
            value: 4
          }*/
        ],
        temp: {
          id: '',
          name: '',
          description: '',
          secretClass: 0
        },
        saveTemp: {

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
          manager: [{required: true, message: '请选择项目负责人！', trigger: 'change'}],
          secretClass: [{required: true, message: '请选择项目密级！', trigger: 'change'}]
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
        getMaLoading: false,
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
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        finishTime: '',
        orderNum: '',
        designLinks: []
      }
    },
    created() {
      this.role = store.getters.roles[0]
      this.userId = this.getCookie('userId')
      this.userName = this.getCookie('username')
      this.getList()
    },
    mounted() {
    },
    methods: {
      handleTabClick(tab, event) {
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
      getList() {
        this.listLoading = true
        projectList(this.listQuery).then(response => {
          if(response.data.code === 0) {
            this.list = response.data.data
            this.list.forEach((item) => {
              item.icon = 'tree-pro'
              item.children = [{
                name: '仿真任务1',
                icon: 'tree-task'
              }, {
                name: '仿真任务2',
                icon: 'tree-task'
              }]
            })
            this.listLoading = false
            this.total = response.data.data.totalElements
          } else {
            this.listLoading = false
          }
        }).catch(() => {
          this.listLoading = false
        })
        /*if (this.role == 'ROLE_PROJECT_MANAGER') {
          projectList(this.listQuery).then(response => {
            if(response.data.code === 0) {
              this.list = response.data.data
              this.list.forEach((item) => {
                item.icon = 'tree-pro'
                item.children = [{
                  name: '仿真任务1',
                  icon: 'tree-task'
                }, {
                  name: '仿真任务2',
                  icon: 'tree-task'
                }]
              })
              this.listLoading = false
              this.total = response.data.data.totalElements
            }
          })
        } else {
          // alert(this.userId)
          projectList_user(this.userId, this.listQuery).then(response => {
            if(response.data.code === 0) {
              this.list = response.data.data
              this.list.forEach((item) => {
                item.icon = 'tree-pro'
                item.children = [{
                  name: '仿真任务1',
                  icon: 'tree-task'
                }, {
                  name: '仿真任务2',
                  icon: 'tree-task'
                }]
              })
            }
            this.listLoading = false
          })
        }*/
      },
      resetTemp() {
        this.temp = {
          id: '',
          name: '',
          description: '',
          manager: '',
          secretClass: null
        }
      },

      // 查询可供选择的项目管理员
      getAbleUser() {
        this.getMaLoading = true
        allUser().then((res) => {
          if(res.data.code === 0) {
            this.proManagerOptions = []
            res.data.data.forEach((item) => {
              if(item.secretClass >= this.temp.secretClass) {
                item.roleEntities.some(role => {
                  if(role.name === 'project_manager' || role.name === 'normal_designer') {
                    this.proManagerOptions.push(item)
                  }
                })
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
      // 打开创建项目弹框
      handleCreate(event) {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        event.target.loading = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      // 创建项目
      createData() {
        let qs = require('qs');
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.creProLoading = true
            let data = {
              'name': this.temp.name,
              'creatorId': this.userId,
              'picId': this.temp.manager,
              'description': this.temp.description,
              'secretClass': this.temp.secretClass
            };
            let proData = qs.stringify(data);
            createProject(proData).then((res) => {
              if(res.data.code === 0) {
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
              } else {
                this.creProLoading = false
                this.errorMessage = '操作失败！'
                this.$notify({
                  title: '失败',
                  message: res.data.msg,
                  type: 'error',
                  duration: 2000
                })
              }
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
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        /*this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })*/
      },
      updateData() {
        /*this.$refs['dataForm'].validate((valid) => {
            if (valid) {

            }
        })*/
        let qs = require('qs');
        this.creProLoading = true
        let data = {
          'name': this.temp.name,
          'description': this.temp.description,
          'userId': this.userId
        };
        // const id = this.selectedId;
        let id = this.temp.id
        let proData = qs.stringify(data);
        updateProject(proData, id).then((res) => {
          if(res.data.code === 0) {
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
          } else {
            this.creProLoading = false
            this.$notify({
              title: '失败',
              message: res.data.msg,
              type: 'error',
              duration: 2000
            })
          }
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
          let qs = require('qs')
          let data = {
            'userId': this.userId
          };
          let dataPost = qs.stringify(data)
          deleteProject(id, dataPost).then((res) => {
            if(res.data.code === 0) {
              row.delLoading = false
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            } else {
              row.delLoading = false
              this.$notify({
                title: '失败',
                message: res.data.msg,
                type: 'error',
                duration: 2000
              })
            }
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
          row.delLoading = false
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleProSetting(item) {
        this.hasPermission = false
        if(item.creator.id === this.userId || item.pic.id === this.userId) {
          this.hasPermission = true
        }
        this.proSettingVisible = true
        this.temp = Object.assign({}, item)
        this.saveTemp = {
          name: this.temp.name,
          description: this.temp.description
        }

      },
      // 启动项目
      handleStartPro(row) {
        startPro(row.id).then((res) => {
          if(res.data.code === 0) {
            this.$notify({
              title: '成功',
              message: '项目启动成功',
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
      },
      // 切换项目负责人
      setPersonInC(pic) {
        this.$confirm('确认移交项目给' + pic.username + '吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let qs = require('qs');
          let data = {
            'picId': pic.id,
            'creatorId': this.userId
          };
          let postData = qs.stringify(data);
          updateProPic(this.temp.id, postData).then((res) => {
            if(res.data.code === 0) {
              this.$notify({
                title: '成功',
                message: '项目移交成功',
                type: 'success',
                duration: 2000
              })
              this.temp.pic.username = pic.username
              console.log(this.temp)
              console.log(this.saveTemp)
              this.getList()
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
            message: '已取消操作'
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
            updatePassword(this.userId, datapost).then((res) => {
              if(res.data.code === 0) {
                this.modifyPasswordVisible = false
                this.$notify({
                  title: '成功',
                  message: '密码修改成功',
                  type: 'success',
                  duration: 2000
                })
                this.$store.dispatch('FedLogOut').then(() => {
                  location.reload()// In order to re-instantiate the vue-router object to avoid bugs
                })
              } else {
                this.$notify({
                  title: '失败',
                  message: res.data.msg,
                  type: 'error',
                  duration: 2000
                })
              }
              this.modPasLoading = false
            })
          }
        })
      },
      handleSelect(row) {
        this.$store.commit('SET_PROJECTID', row.id)
        // let proName = URLEncoder.encode(row.name, 'utf-8')
        this.$store.commit('SET_PROJECTNAME', row.name)
        // 验证用户密级是否足够
        getProjectAuth(row.id, this.userId).then((res) => {
          if(res.data.code === 0) {
            if(res.data.data === true) {
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
                duration: '2000'
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
        }).catch(() => {
          this.$notify({
            title: '失败',
            message: '权限验证失败！',
            type: 'error',
            duration: '2000'
          })
        })
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
        if (this.role == 'ROLE_PROJECT_MANAGER') {
          projectListHis(this.listQuery).then(response => {
            if(response.data.code === 0) {
              this.isHistory = true
              this.list = response.data.data
            }
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
        } else {
          projectList_userHis(this.userId, this.listQuery).then(response => {
            if(response.data.code === 0) {
              this.isHistory = true
              this.list = response.data.data
            }
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
        }
      },
      showNow: function () {
        this.listLoading = true
        this.hisBtnLoading = true
        if (this.role == 'ROLE_PROJECT_MANAGER') {
          projectList(this.listQuery).then(response => {
            if(response.data.code === 0) {
              this.list = response.data.data
              this.list.forEach((item) => {
                item.icon = 'tree-pro'
                item.children = [{
                  name: '仿真任务1',
                  icon: 'tree-task'
                }, {
                  name: '仿真任务2',
                  icon: 'tree-task'
                }]
              })
            }
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
        } else {
          // alert(this.userId)
          projectList_user(this.userId, this.listQuery).then(response => {
            this.list = response.data.data
            this.list.forEach((item) => {
              item.icon = 'tree-pro'
              item.children = [{
                name: '仿真任务1',
                icon: 'tree-task'
              }, {
                name: '仿真任务2',
                icon: 'tree-task'
              }]
            })
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
          let qs = require('qs')
          let data = {
            'userId': this.userId
          };
          let dataPost = qs.stringify(data)
          restorePro(row.id, dataPost).then(() => {
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
      },
      renderContent(h, { node, data, store }) {
        if(data.icon) {
          return (
            <span>
            <svg-icon icon-class={data.icon} style="margin-right:6px;"></svg-icon>
            <span style="color:#777;font-size:12px;">{node.label}</span>
            </span>
          )
        } else {
          return (
            <span>
            <svg-icon icon-class='documentation' style="margin-right:6px;"></svg-icon>
            <span style="color:#777;font-size:12px;">{node.label}</span>
            </span>
          )
        }

      },
      handleMangeDesignLinks() {
        this.designLinkVisible = true
      },
      setFinishTimeAndOrder() {
        let qs = require('qs')
        let data = {
          finishTime: this.finishTime.toString(),
          orderNum: this.orderNum,
          userId: this.userId
        }
        let dataPost = qs.stringify(data)
        arrangePro(this.temp.id, dataPost).then(res => {
          if(res.data.code === 0) {
            this.$notify({
              title: '成功',
              message: '设置节点成功！',
              type: 'success',
              duration: 2000
            })
            this.temp.finishTime = this.finishTime
            this.temp.orderNum = this.orderNum
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
      updateOrderNum() {
        if(this.temp.orderNum == ''){
          this.$message({
            type: 'info',
            message: '输入不能为空!'
          })
          return
        }
        let qs = require('qs');
        let data = {
          orderNum: this.temp.orderNum,
          userId: this.userId
        }
        let id = this.temp.id
        let proData = qs.stringify(data);
        updateProject(proData, id).then(res => {
          if(res.data.code === 0) {
            this.$notify({
              title: '成功',
              message: '更新项目令号成功！',
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
      },
      updateFinishTimeAndOrder() {
        if(this.temp.orderNum == '' || this.temp.finishTime == ''){
          this.$message({
            type: 'info',
            message: '输入不能为空!'
          })
          return
        }
        let qs = require('qs');
        let data = {
          finishTime: this.temp.finishTime.toString(),
          orderNum: this.temp.orderNum,
          userId: this.userId
        }
        let id = this.temp.id
        let proData = qs.stringify(data);
        updateProject(proData, id).then(res => {
          if(res.data.code === 0) {
            this.$notify({
              title: '成功',
              message: '更新项目节点成功！',
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
      },
      getDesignLinks() {
        getLinks().then(res => {
          if(res.data.code === 0) {
            this.designLinks = res.data.data
          }
        })
      },
      setProDesignLink(val) {
        console.log(val)
      },
      jumpToAudit() {
        this.$router.push({
          path: '/audit_task'
        })
      },
      clearPicOption() {
        this.temp.manager = ''
      }
    },
    computed: {
      listA: function () {
        let self = this;
        return self.list.filter(function (item) {
          return item.name.toLowerCase().indexOf(self.searchQuery.toLowerCase()) !== -1;
        })
      },
      listTree: function() {
        let self = this
        return self.list.filter(function (item) {
          return item.deleted === false
        })
      },
      computeSecretClass() {
        return function(item) {
          if(item === 0) {
            return '公开'
          } else if (item === 1) {
            return '内部'
          } else if (item === 2) {
            return '秘密'
          } else if (item === 3) {
            return '机密'
          } else if (item === 4) {
            return '绝密'
          }
        }
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
  .my-search-box {
    position: absolute;
    top: -45px;
    left: 10px;
    z-index:1000;
  }
  .icon-search {
    position: relative;
    top: 1px;
    left: 30px;
    z-index: 1000;
  }
  .add-item {
    color: #fff;
    font-size: 17px;
    cursor: pointer;
  }
  .add-item-icon {
    margin-right: 6px;
  }
  .proTitle {
    position: absolute;
    width: 160px;
    top: 0;
    left: 50%;
    margin-left: -70px;
    background: linear-gradient(to right, #5786e8, #2961d2);
    -webkit-background-clip: text;
    color: transparent;
  }
  .my-menu-icon {
    color: #fff;
    font-size: 26px;
    /*position: absolute;
    top: -1px;
    right: 4px;*/
    cursor: pointer;
  }
  .flex-menu-box {
    display: flex;
    width: 320px;
    flex-direction: row;
    flex-wrap: wrap;
    // justify-content: flex-start;
    justify-content: space-around;
    padding: 24px;
    .flex-menu-item {
      align-items: center;
      display: block;
      width: 60px;
      // height: 60px;
      font-size: 42px;
      text-align: center;
      line-height: 60px;
      cursor: pointer;
      color: #383838;
      .icon-box {
        display: block;
        width: 100%;
      }
      .icon-text {
        display: block;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
      }
    }
  }
  .img-container {
    width: 100%;
    height: 140px;
    margin: 0 auto;
    background: url("./createPro-back.png") center center no-repeat;
    background-size: 113px 90px;
  }
  .text-container {
    text-align: center;
    color: #777;
    margin-bottom: 20px;
    font-size: 14px;
    font-weight: 500;
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
      min-width: 600px;
      max-width: 800px;
      margin: 20px auto;

      .project-item, .new-project-container {
        width: 100%;
        height: 60px;
        background: #fff;
        padding: 5px 10px;
        margin-bottom: 10px;
        border-left: 2px solid rgb(25, 170, 246);
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
          width: calc(100% - 140px);
          padding: 0 10px 0 20px;

          .info-detail {
            height: 25px;
            line-height: 25px;
            color: rgb(77, 77, 77);
          }
          .info-secretClass {
            color: #999;
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
          width: 100px;
          line-height: 50px;

          .icons {
            font-size: 22px;
            margin-left: 6px;
            color: #ccc;
            cursor: pointer;
          }
          .icons-setting {
            color: #26bada;
          }
          .icons-delete {
            position: relative;
            font-size: 26px;
            top: 1px;
            left: -4px;
          }
          .icons-edit {
            color: #3f9fe1;
          }
        }
      }
    }

    .project-item:hover, .project-item:focus, .new-project-container:hover, .new-project-container:focus {
      // margin-bottom: 16px;
      border-radius: 4px;
      border-left-width: 4px;
      box-shadow: 1px 1px 10px rgba(0, 0, 0, .2);

      .info-name, .new-info {
        color: #3da8f5 !important;
      }
      /*.icons-delete {
        color: #f56c6c !important;
      }

      .icons-edit {
        color: #3da8f5 !important;
      }*/
    }

    .project-list.hisList {
      .project-item {
        border-left: 2px solid #f56c6c;
      }

      .project-item:hover {
        border-radius: 4px;
        border-left-width: 4px;
        box-shadow: 1px 1px 10px rgba(0, 0, 0, .2);
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
  .switPic {
    cursor: pointer;
    margin-left: 6px;
  }
  .setOrder {
    cursor: pointer;
  }
  .item-box {
    margin-bottom: 22px;
  }
  .item-name {
    line-height: 36px;
    padding: 0 0 10px;
    color: #606266;
    font-weight: 700;
  }
  .edit-button {
    float: right;
  }
</style>
