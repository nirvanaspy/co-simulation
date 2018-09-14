<template>
  <div :deployPlanId="deployPlanId"
       :deployPlanName="deployPlanName"
        class="app-container calendar-list-container"
        style="width: 100%;height: 90%">
    <split-pane split="vertical" class="splicClass" style="height: 96%">
      <template slot="paneL">
        <!--<div class="filter-container" style="padding: 10px 0 5px 5px">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="名称"
                    v-model="searchQuery">
          </el-input>
          <el-button class="filter-item" style="margin-left: 10px;float:right;" @click="addNode" type="primary"
                     icon="el-icon-edit" v-show="!isHistory">添加节点
          </el-button>
        </div>-->
        <div style="height: 80%;padding-left: 6px;">
          <el-table :key='tableKey' :data="listA" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                    highlight-current-row
                    stripe
                    height="100%"
                    style="width: 100%;"
                    class="nodeTable"
          >
            <el-table-column align="center" label="已绑定设备" min-width="160">
              <template slot-scope="scope">
                <span v-if="scope.row.deviceEntity" class="link-type" @click="designNodeDetail(scope.row)">{{scope.row.deviceEntity.name}}</span>
                <span v-else class="link-type" @click="designNodeDetail(scope.row)">未绑定设备</span>
              </template>
            </el-table-column>
            <!--<el-table-column min-width="80" align="center" :label="$t('table.deployPlanDesc')">
              <template slot-scope="scope">
                <span>{{scope.row.description}}</span>
              </template>
            </el-table-column>-->
            <el-table-column align="center" label="设备ip" min-width="160">
              <template slot-scope="scope">
                <span v-if="scope.row.deviceEntity">{{scope.row.deviceEntity.hostAddress}}</span>
                <span v-else class="link-type">未绑定设备</span>
              </template>
            </el-table-column>
            <!--禁止选择设备操作-->
            <!--<el-table-column align="center" label="绑定设备" width="120" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-popover
                  ref="devicePopover"
                  placement="right"
                  width="600"
                  height="500"
                  trigger="click"
                  @show="devicePopShow(scope.row)">
                  &lt;!&ndash;<div class="filter-container">
                    <el-input style="width: 200px;" class="filter-item" placeholder="组件名" v-model="searchQuery2">
                    </el-input>

                  </div>&ndash;&gt;

                  <div style="height: 425px;overflow-y: auto;margin-top: 0;" id="deviceTab">
                    <div class="filter-container">
                      <el-input style="width: 240px;" class="filter-item" placeholder="请输入用户ip" v-model="searchQueryDevice">
                      </el-input>
                    </div>
                    <el-table :key='tableKey' :data="listAbleDevice" v-loading="deviceLoading"
                              element-loading-text="给我一点时间" border fit
                              highlight-current-row
                              ref="deviceTable"
                              style="width: 100%;"
                              @selection-change="handleCheckedDeviceChange" id="deviceTable">
                      <el-table-column
                        type="selection"
                        width="55"
                        align="center">
                      </el-table-column>
                      <el-table-column label="设备名" width="160" align="left">
                        <template slot-scope="scope">
                          <svg-icon icon-class="设备"></svg-icon>
                          <span>{{scope.row.name}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column min-width="100px" align="left" :label="$t('table.deviceIP')">
                        <template slot-scope="scope">
                          <span>{{scope.row.hostAddress}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column min-width="90px" align="left" :label="$t('table.compPath')">
                        <template slot-scope="scope">
                          <span>{{scope.row.deployPath}}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                  <div style="margin-top: 20px;">
                    <el-button size="mini" type="success" style="float:right;" @click="bindDevice"
                               :loading="bindDeviceLoading">绑定
                    </el-button>
                  </div>
                  <el-button type="primary" plain v-if="scope.row.deviceEntity" size="mini" slot="reference"
                             @click="checkNodeDevice(scope.row)">切换设备
                  </el-button>
                  <el-button type="success" plain v-else size="mini" slot="reference" @click="checkNodeDevice(scope.row)">选择设备
                  </el-button>
                </el-popover>

              </template>
            </el-table-column>-->
            <!--禁止选择组件操作-->
            <!--<el-table-column align="center" label="选择组件" width="120" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-popover
                  ref="popover4"
                  placement="right"
                  width="600"
                  height="500"
                  trigger="click"
                  @show="beforeSubmit(scope.row.id, scope.row)">
                  <div class="filter-container">
                    <el-input style="width: 200px;" class="filter-item" placeholder="组件名" v-model="searchQuery2">
                    </el-input>
                  </div>
                  <div style="height: 425px;overflow-y: auto;margin-top: 0;" id="compTab">
                    <el-table :key='tableKey' :data="listB" v-loading="complistLoading" element-loading-text="给我一点时间"
                              fit
                              highlight-current-row
                              style="width: 100%;"
                              :row-key="getRowKeysComp"
                              :expand-row-keys="compExpands"
                              @expand-change="expandRow"
                              @selection-change="handleCheckedCompsChange" id="compTable">
                      <el-table-column
                        type="selection"
                        :selectable='checkboxIsBind'
                        :reserve-selection="true"
                        width="40"
                        align="center">
                      </el-table-column>
                      <el-table-column align="left" width="40" type="expand">
                        <template slot-scope="props">
                          <el-table
                            stripe highlight-current-row
                            :data="props.row.hisVersion"
                            v-loading="props.row.loading"
                            :default-sort="{prop: 'createTime', order: 'descending'}"
                            style="padding: 0 0"
                          >
                            <el-table-column>
                              <template slot-scope="scope">
                                <el-radio-group v-model="props.row.id">
                                  <el-radio :label="scope.row.id" @change.native="getSelectHisId(scope.row, props.row)"
                                            :disabled="computedDisabled(scope.row, props.row)"></el-radio>
                                </el-radio-group>
                              </template>
                            </el-table-column>
                            <el-table-column width="40">
                              <template slot-scope="scope">
                                <span v-if="scope.row.isBind"><svg-icon icon-class="history2"></svg-icon></span>
                                <span v-else><svg-icon icon-class="history1"></svg-icon></span>
                              </template>
                            </el-table-column>
                            <el-table-column label="修改时间" align="left" width="160" sortable prop="createTime">
                              <template slot-scope="scope">
                                <span class="link-type">{{scope.row.createTime}}</span>
                              </template>
                            </el-table-column>
                            <el-table-column label="路径" align="left">
                              <template slot-scope="scope">
                                <span>{{scope.row.relativePath}}</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="correct" label="状态" align="center" width="80px">
                              <template slot-scope="scope">
                                <svg-icon v-if="scope.row.isBind" icon-class="correct"></svg-icon>
                              </template>
                            </el-table-column>
                          </el-table>
                        </template>
                      </el-table-column>
                      <el-table-column :label="$t('table.compName')" width="160" align="center">
                        <template slot-scope="scope">
                          <span>{{scope.row.name}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column width="100px" align="center" :label="$t('table.compVersion')">
                        <template slot-scope="scope">
                          <span>{{scope.row.version}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column min-width="90px" align="center" :label="$t('table.compPath')">
                        <template slot-scope="scope">
                          <span>{{scope.row.relativePath}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="解绑" width="80" align="center">
                        <template slot-scope="scope">
                          <el-button type="danger" icon="el-icon-delete" size="mini" circle v-if="scope.row.isBind"
                                     @click="deleteBindRelation(scope.row)"></el-button>
                        </template>
                      </el-table-column>

                    </el-table>
                  </div>
                  <el-pagination
                    @size-change="handleSizeChange2"
                    @current-change="handleCurrentChange2"
                    :current-page="currentPage2"
                    :page-sizes="[10,20,30]"
                    :page-size="listQuery2.limit"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total2"
                    background
                    style="text-align: center;margin-top:20px"
                  >
                  </el-pagination>
                  <div style="margin-top: 20px;">
                    <el-button size="mini" type="success" style="float:right;" @click="submit()" :loading="bindLoading">
                      绑定
                    </el-button>
                  </div>
                  <el-button type="primary" plain size="mini" slot="reference">选择组件</el-button>
                </el-popover>
              </template>
            </el-table-column>-->
            <!--禁止快照更多操作-->
            <!--<el-table-column align="center" :label="$t('table.actions')" width="200">
              <template slot-scope="scope">
                <el-dropdown trigger="click" v-if="!scope.row.deleted">
                  <span class="el-dropdown-link" v-if="!scope.row.virtual">
                    <el-button type="success" plain>更多操作</el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <span style="display:inline-block;padding:0 10px;" @click="handleDelete(scope.row)">删除</span>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.deviceEntity" divided>
                      <span style="display:inline-block;padding:0 10px;" @click="unbindDevice(scope.row)">解绑</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>-->
          </el-table>
          <span id="clicktag"></span>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[20,50,100]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="this.total"
            background
            style="text-align: center;margin-top:20px"
          >
          </el-pagination>
        </div>
      </template>
      <template slot="paneR" id="ERDiv">
        <div style="height: 100%;">
          <div class='chart-container' style="height: 100%">
            <deployBindER id="ER" :detaillist="nodeDetail" :currentNodeInfo="currentNodeInfo"></deployBindER>
          </div>
        </div>
      </template>
    </split-pane>
  </div>
</template>

<script>
  /* eslint-disable */
  import {
    deployplanList,
    createDeployplan,
    updateDeployplan,
    deleteDeployplan,
    hisDeployplan,
    cleanDeployplan,
    restoreDeployplan
  } from '@/api/deployplan'
  import {
    saveDeploymentDesignSnapshots,
    getDeploymentDesignSnapshots,
    deleteDeploymentDesignSnapshots,
    modifySnapshots
  } from '@/api/baseline'
  import {
    deployNodeList,
    deleteDeployplanNode,
    createDeployplanNode,
    bindDeviceToNode,
    unbindDeviceByNode,
    getAllBindDevices,
    getNodeDetail,
    bindCompToNode,
    bindCompsToNode,
    bindCompHisToNode,
    deleteBindDetail
  } from '@/api/deployDesignNode'
  import {compList} from '@/api/component'
  import {getDevices, getAllDevices} from '@/api/device'
  import {doDeployBind, getDeployComLists, deleteBind} from '@/api/deployBind'
  import {compHisVersion, compHisVersions} from '@/api/component'
  import waves from '@/directive/waves' // 水波纹指令
  import splitPane from 'vue-splitpane'
  import deployBindER from '../deployBind/deployBindER'
  import Sortable from 'sortablejs'
  import Vue from 'vue'

  export default {
    name: 'deployDesignSnapshoot',
    components: {splitPane, deployBindER},
    directives: {
      waves
    },
    props: {
      deployPlanId: {
        type: String,
        default: ''
      },
      deployPlanName: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        proId: '',
        searchQuery2: '',
        isHistory: false,
        selectedId: '',
        deployName: '',
        tableKey: 0,
        list: [],
        baslineList: [],
        listLoading: true,
        listQuery: {
          page: 0,
          size: 20,
          limit: 5,
          tagname: ''
        },
        total: null,
        pagesize: 10,//每页的数据条数
        currentPage: 1,//默认开始页面
        sortable: null,
        oldList: [],
        newList: [],
        temp: {
          id: '',
          name: '',
          description: ''
        },
        dialogFormVisible: false,
        baselineVisible: false,
        baselineDetailVisible: false,
        modifyBaselineVisible: false,
        baselineTemp: {
          id: '',
          name: '',
          description: ''
        },
        modifyBaselineTemp: {
          id: '',
          name: '',
          description: ''
        },
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新建'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          type: [{required: true, message: 'type is required', trigger: 'change'}],
          timestamp: [{type: 'date', required: true, message: 'timestamp is required', trigger: 'change'}],
          title: [{required: true, message: 'title is required', trigger: 'blur'}]
        },
        deployRules: {
          name: [{required: true, message: '请输入部署设计名称', trigger: 'blur'}]
        },
        baselineRules: {
          name: [{required: true, message: '请输入基线名', trigger: 'blur'}]
        },
        downloadLoading: false,
        creDepLoading: false,
        upDepLoading: false,
        creBasLoading: false,
        upBasLoading: false,
        searchQuery: '',
        searchQueryDevice: '',
        errorMessage: '操作失败！',
        deviceList: [],
        deviceTotal: 0,
        deviceLoading: false,
        bindDeviceLoading: false,
        currentNodeId: '',
        bindDeviceId: [],
        bindedDeviceList: [],
        notBindDevice: [],
        currentDeviceList: [],
        complistLoading: false,
        bindLoading: false,
        listQuery2: {
          page: 0,
          size: 10,
          limit: 10,
          tagname: ''
        },
        total2: null,
        pagesize2: 10,//每页的数据条数
        currentPage2: 1,//默认开始页面
        listComp: [],
        componentIds: [],
        componentHisIds: [],
        bindCompsId: [],
        repeatCompsId: [],
        checkedHisComId: [],
        watchArr: [],
        radio: '',
        nodeDetail: [],
        currentNodeInfo: {},
        compExpands: []
      }
    },
    created() {
      this.proId = this.$store.getters.projectId
      this.isHistory = false
      /*this.deployPlanId = this.$route.params.id
      this.deployPlanName = this.$route.params.name*/
      this.getList()
      this.getDeviceList()
    },
    methods: {
      addNode() {
        this.$confirm('确认添加节点吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          createDeployplanNode(this.deployPlanId).then(() => {
            this.list.unshift(this.temp)
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          }).catch((error) => {
            this.errorMessage = '操作失败！'
            if (error.response.data.message) {
              this.errorMessage = error.response.data.message
            }
            this.$notify({
              title: '创建失败',
              message: this.errorMessage,
              type: 'error',
              duration: 2000
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消添加节点'
          })
        })
      },
      getList() {
        this.listLoading = true;
        deployNodeList(this.deployPlanId, this.listQuery).then(response => {
          this.isHistory = false
          this.list = response.data.data.content
          this.listLoading = false
          this.total = response.data.data.totalElements
        })
      },
      getDeviceList() {
        let projectId = this.getCookie('projectId');
        getAllDevices(projectId).then(response => {
          this.deviceList = response.data.data
          this.deviceTotal = response.data.data.length
          this.deviceLoading = false
          for (let i = 0; i < this.list.length; i++) {
            this.deviceList[i].online = false;
            this.deviceList[i].virtual = false;
          }
          // this.listLength = response.data.data.length
          // this.getList2()
        })
      },
      createDeployplanNode() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.creDepLoading = true
            let projectId = this.getCookie('projectId');
            let formData = new FormData();

            formData.append('name', this.temp.name);
            formData.append('description', this.temp.description);

            createDeployplanNode(formData, this.deployPlanId).then(() => {
              this.list.unshift(this.temp)
              this.creDepLoading = false
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch((error) => {
              this.errorMessage = '操作失败！'
              this.creDepLoading = false
              if (error.response.data.message) {
                this.errorMessage = error.response.data.message
              }
              this.$notify({
                title: '创建失败',
                message: this.errorMessage,
                type: 'error',
                duration: 2000
              })
            })
          }
        })
      },
      handleCheckedDeviceChange(val) {
        console.log(val)
        /*if(val.length < 1) {
          val = val
        } else {

        }*/
        this.bindDeviceId = val
      },
      handleCheckedCompsChange(val) {          //所选的组件，checkbox

        this.checkedComps = val;
        console.log(this.checkedComps)

        this.componentIds.splice(0, this.componentIds.length);
        // this.componentHisIds.splice(0,this.componentHisIds.length);

        for (let i = 0; i < this.checkedComps.length; i++) {
          if (!this.checkedComps.selectedHisId) {
            this.componentIds.push(this.checkedComps[i].identify);
          }
        }

        console.log(this.componentIds);
      },
      checkboxIsBind(row) {
        if (row.isBind === true || row.selectedHisId) {
          return 0
        } else {
          return 1
        }
      },
      devicePopShow(row) {
        this.currentNodeId = row.id
      },
      designNodeDetail(row) {
        this.currentNodeInfo = row
        getNodeDetail(row.id).then((res) => {
          this.nodeDetail = res.data.data
        })
      },
      bindDevice() {
        this.bindDeviceLoading = true
        if (this.bindDeviceId.length > 1) {
          this.$message({
            message: '只能选择一台设备',
            type: 'error'
          })
          this.bindDeviceLoading = false
          return
        } else if (this.bindDeviceId.length == 1) {
          bindDeviceToNode(this.currentNodeId, this.bindDeviceId[0].id).then((res) => {
            this.$notify({
              title: '成功',
              message: '设备绑定成功',
              type: 'success',
              duration: 2000
            })
            document.getElementById('clicktag').click()
            this.bindDeviceLoading = false
            this.getList()
            this.currentNodeInfo = res.data.data
            getNodeDetail(this.currentNodeId).then((res) => {
              this.nodeDetail = res.data.data
              // this.nodeDetail[0].currentNodeInfo = this.currentNodeInfo
            })
          }).catch(() => {
            this.$notify({
              title: '失败',
              message: '设备绑定成失败',
              type: 'error',
              duration: 2000
            })
            this.bindDeviceLoading = false
          })
        }
      },
      unbindDevice(row) {
        this.$confirm('确认解绑吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          unbindDeviceByNode(row.id).then(() => {
            this.$notify({
              title: '成功',
              message: '设备解绑成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
            this.currentNodeInfo = {deviceEntity: null}
            getNodeDetail(row.id).then((res) => {
              this.nodeDetail = res.data.data
              // this.nodeDetail[0].currentNodeInfo = this.currentNodeInfo
            })
          }).catch(() => {
            this.$notify({
              title: '失败',
              message: '设备解绑失败',
              type: 'error',
              duration: 2000
            })
            this.bindDeviceLoading = false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消解绑'
          })
        })
      },
      checkNodeDevice() {
        this.searchQueryDevice = ''
        this.deviceLoading = true
        this.currentDeviceList = this.deviceList.slice() // 注意：复制数组，防止原数组被修改！！
        getAllBindDevices(this.deployPlanId).then((res) => {
          this.bindedDeviceList = res.data.data
          for (var i = 0; i < this.bindedDeviceList.length; i++) {
            this.currentDeviceList.splice(this.currentDeviceList.findIndex(item => item.id === this.bindedDeviceList[i].id), 1)
          }
          this.deviceLoading = false
        }).catch(() => {
          this.deviceLoading = false
        })
      },
      handleSizeChange2(val) {
        // this.listQuery2.size = val
        this.listQuery2.limit = val
        this.pagesize2 = val
        compList(this.proId, this.listQuery2).then(response => {
          this.listComp = response.data.data.content
          this.total2 = response.data.data.totalElements
          this.listLoading = false
          for (var j = 0; j < this.listComp.length; j++) {
            this.listComp[j].isBind = false;
            this.listComp[j].identify = this.listComp[j].id
          }
          //this.listComp.isBind = false;
          this.bindCompsId.splice(0, this.bindCompsId.length);
          //为是否绑定赋值
          for (var i = 0; i < this.listBind.length; i++) {
            for (var j = 0; j < this.listComp.length; j++) {
              if (this.listBind[i].componentEntity.id == this.listComp[j].id) {//判断id是否相等
                this.listComp[j].isBind = true;
                this.bindCompsId.push(this.listComp[j].id);
                break;
              }
            }
          }
        })
      },
      handleCurrentChange2(val) {
        this.listQuery2.page = val - 1
        this.currentPage2 = val
        compList(this.proId, this.listQuery2).then(response => {
          this.listComp = response.data.data.content
          this.total2 = response.data.data.totalElements
          this.listLoading = false
          for (var j = 0; j < this.listComp.length; j++) {
            this.listComp[j].isBind = false;
            this.listComp[j].identify = this.listComp[j].id
          }
          //this.listComp.isBind = false;
          this.bindCompsId.splice(0, this.bindCompsId.length)
          //为是否绑定赋值
          for (var i = 0; i < this.listBind.length; i++) {
            for (var j = 0; j < this.listComp.length; j++) {
              if (this.listBind[i].componentEntity.id == this.listComp[j].id) {//判断id是否相等
                this.listComp[j].isBind = true;
                console.log(this.listComp[j].name)
                this.bindCompsId.push(this.listComp[j].id);
                break;
              }
            }
          }
        })
      },
      getRowKeysComp(row) {
        return row.id
      },
      beforeSubmit: function (rowId, row) {//绑定前的准备工作 绑定前获取设备的id，获取所选部署设计的id
        this.currentNodeId = rowId;
        console.log(row)
        if(row) {
          this.currentNodeInfo = row
        }
        this.complistLoading = true

        console.log("所选设备的id--------");
        console.log(this.currentNodeId);

        this.listComp = [];

        //查询已绑定信息
        getNodeDetail(this.currentNodeId).then(response => {
          this.listBind = response.data.data
          // this.total = response.data.total
          /* console.log(this.listBind.length);
           console.log(this.listBind);*/

          compList(this.proId, this.listQuery2).then(response => {
            this.complistLoading = false
            this.listComp = response.data.data.content
            this.total2 = response.data.data.totalElements
            this.listLoading = false
            for (var j = 0; j < this.listComp.length; j++) {
              this.listComp[j].isBind = false;
              this.listComp[j].identify = this.listComp[j].id
            }

            //this.listComp.isBind = false;

            this.bindCompsId.splice(0, this.bindCompsId.length);

            //为是否绑定赋值
            for (var i = 0; i < this.listBind.length; i++) {
              for (var j = 0; j < this.listComp.length; j++) {
                if (this.listBind[i].componentEntity) {
                  if (this.listBind[i].componentEntity.id == this.listComp[j].id) {//判断id是否相等
                    this.listComp[j].isBind = true;
                    this.listComp[j].bindHisComp = this.listBind[i].componentHistoryEntity
                    this.listComp[j].designDetailId = this.listBind[i].id
                    console.log(this.listComp[j].name);

                    this.bindCompsId.push(this.listComp[j].id);
                    break;
                  }
                }
              }
            }
          }).catch(() => {
            this.complistLoading = false
            this.$notify({
              title: '失败',
              message: '获取信息失败',
              type: 'error',
              duration: 2000
            })
          })
        })
      },
      submit: function () {
        //alert("hh");
        this.bindLoading = true
        this.repeatCompsId.splice(0, this.repeatCompsId.length);

        if (this.componentHisIds.length !== 0) {
          console.log(this.componentHisIds)
          console.log(this.componentIds)
          let hisDataIds = (this.componentHisIds + '').replace(/\[|]/g, '')
          let hisData = {
            'componentHistoryIds': hisDataIds
          }
          let qs = require('qs')
          let hisDataPost = qs.stringify(hisData)
          bindCompHisToNode(this.currentNodeId, hisDataPost).then(() => {
            this.bindLoading = false
            document.getElementById('clicktag').click()
            getNodeDetail(this.currentNodeId).then((res) => {
              this.nodeDetail = res.data.data
              // this.nodeDetail[0].currentNodeInfo = res.data.data[0].deploymentDesignNodeEntity
            })
            this.compExpands = []
            this.$notify({
              title: '成功',
              message: '组件历史版本绑定成功',
              type: 'success',
              duration: 2000
            })

          }).catch(() => {
            this.bindLoading = false
            this.$notify({
              title: '失败',
              message: '组件历史绑定失败',
              type: 'error',
              duration: 2000
            })
          })
        }
        if (this.componentIds.length !== 0) {

          for (let i = 0; i < this.componentIds.length; i++) {
            for (let j = 0; j < this.bindCompsId.length; j++) {
              if (this.bindCompsId[j] === this.componentIds[i]) {  //判断索选择的组件是否有已绑定的
                this.repeatCompsId.push(this.bindCompsId[j]);

              }
            }
          }

          if (this.repeatCompsId.length !== 0) {
            this.$message({
              type: 'warning',
              message: '有' + this.repeatCompsId.length + '个组件已绑定过！'
            })
            this.bindLoading = false
            return;
          }

          let dataBindId = (this.componentIds + '').replace(/\[|]/g, '')
          console.log(dataBindId)
          let data = {
            // 'deviceId': this.deviceCHId,
            'componentIds': dataBindId
          }
          let qs = require('qs')
          let dataBind = qs.stringify(data)
          bindCompsToNode(this.currentNodeId, dataBind).then(() => {
            this.bindLoading = false
            getNodeDetail(this.currentNodeId).then((res) => {
              this.nodeDetail = res.data.data
              // this.nodeDetail[0].currentNodeInfo = res.data.data[0].deploymentDesignNodeEntity
            })
            document.getElementById('clicktag').click()
            this.$notify({
              title: '成功',
              message: '绑定成功',
              type: 'success',
              duration: 2000
            })
            this.compExpands = []
            /*getDeployComLists(this.deployPlanId, this.deviceCHId).then((res) => {
              this.bindedDeviceList = res.data.data
            })*/
            /*getAllBindDevices(this.deployPlanId).then((res) => {
              this.bindedDeviceList = res.data.data
            })*/

          }).catch(() => {
            this.bindLoading = false
            this.$notify({
              title: '失败',
              message: '绑定失败',
              type: 'error',
              duration: 2000
            })
          })
        } else if (this.componentIds.length === 0 && this.componentHisIds.length === 0) {
          this.$message({
            type: 'warning',
            message: '无绑定信息!'
          })
          this.bindLoading = false
        }

      },
      expandRow(row) {
        if (!row.hisVersion) {
          row.loading = true
          // console.log('row---------')
          // console.log(row)
          compHisVersions(row.id).then((res) => {

            /*row.hisVersion = res.data.data.content
            Vue.set(row.hisVersion, res.data.data.content)
            row.loading = false*/
            /*for(var j = 0; j < res.data.data.length; j++) {
              if(row.bindHisComp.id === res.data.data[j].id) {
                res.data.data[j].isBind === true
              }
            }*/
            for (var i = 0; i < this.listComp.length; i++) {
              if (this.listComp[i].id === res.data.data[0].componentEntity.id) {
                this.listComp[i].loading = false
                this.listComp[i].hisVersion = res.data.data
                /*for(var j = 0; j < this.listComp[i].hisVersion.length; j++) {
                  alert(1)
                  this.listComp[i].hisVersion[j].isBind === false
                  if(this.listComp[i].hisVersion[j].id === this.listComp[i].bindHisComp.id) {
                    alert(2)
                    this.listComp[i].hisVersion[j].isBind === true
                  }
                  Vue.set(this.listComp[i].hisVersion, j, this.listComp[i].hisVersion[j])
                }*/
                Vue.set(this.listComp, i, this.listComp[i])
              }
            }
            console.log(this.listComp)
          })
        }
      },
      getSelectHisId(row, fatherRow) {
        this.watchArr.push(row.id)
        fatherRow.selectedHisId = row.id
        console.log(this.listComp)
        // this.componentIds.splice(this.componentIds.findIndex(item => item === fatherRow.identify), 1)
        for (var i = 0; i < this.componentIds.length; i++) {
          if (this.componentIds[i] === fatherRow.identify) {
            this.componentIds.splice(i, 1)
          }
        }
      },
      /*getSelectHisId(row, fatherRow) {
        if(fatherRow.selectedHisId && fatherRow.selectedHisId.length === 0) {
          fatherRow.selectedHisId = row.id
        } else if(!fatherRow.selectedHisId) {
          fatherRow.selectedHisId = row.id
        } else if(fatherRow.selectedHisId === row.id) {
          fatherRow.selectedHisId = ''
        }
        console.log(this.listComp)
      },*/
      checkHisIsBind(row) {
        row.isBind = false
        for (var i = 0; i < this.listComp.length; i++) {
          if (this.listComp[i].bindHisComp) {
            if (row.id === this.listComp[i].bindHisComp.id) {
              row.isBind = true
              break
            }
          }
        }
        if (row.isBind === true) {
          return 0
        } else {
          return 1
        }
      },
      disableAllHis(row) {
        row.isBind = false
        for (var i = 0; i < this.listComp.length; i++) {
          if (this.listComp[i].bindHisComp) {
            if (row.id === this.listComp[i].bindHisComp.id) {
              row.isBind = true
              break
            }
          }
        }
        return 0
      },
      deleteBindRelation(row) {
        console.log('test-----')
        console.log(row)
        // alert(1111)
        deleteBindDetail(row.designDetailId).then(() => {
          this.$notify({
            title: '成功',
            message: '组件解绑成功',
            type: 'success',
            duration: 2000
          })
          this.compExpands = []
          this.beforeSubmit(this.currentNodeId)
          getNodeDetail(this.currentNodeId).then((res) => {
            this.nodeDetail = res.data.data
            console.log('-=-=-=-=-=-')
            console.log(this.currentNodeInfo)
            /*if(res.data.data.length > 0) {
              this.nodeDetail[0].currentNodeInfo = res.data.data[0].deploymentDesignNodeEntity
            } else {
            }*/
          })
          /*getDeployComLists(this.deployPlanId, this.deviceCHId).then((res) => {
            this.bindedDeviceList = res.data.data
          })*/
          /*getAllBindDevices(this.deployPlanId).then((res) => {
            this.bindedDeviceList = res.data.data
          })*/
          // document.getElementById('clicktag').click()
        }).catch(() => {
          this.$notify({
            title: '失败',
            message: '组件解绑失败',
            type: 'error',
            duration: 2000
          })
        })
      },
      getHis() {
        this.listLoading = true;
        let projectId = this.getCookie('projectId');

        hisDeployplan(projectId, this.listQuery).then(response => {
          this.isHistory = true
          this.list = response.data.data.content
          this.total = response.data.total
          this.listLoading = false
          this.listLength = response.data.data.length
          this.total = response.data.data.totalElements
        })
      },
      getBaslines(id) {
        getDeploymentDesignSnapshots(id).then((res) => {
          this.baslineList = res.data.data.content
        })
      },
      checkBaselines(row) {
        this.selectedId = row.id
        this.baselineDetailVisible = true
        this.deployName = row.name + '基线详情'
        this.getBaslines(row.id)
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
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
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
      },
      resetTemp() {
        this.temp = {
          name: '',
          description: ''
        }
      },
      resetBaseLineTemp() {
        this.baselineTemp = {
          id: '',
          name: '',
          description: ''
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleUpdate(row) {
        this.selectedId = row.id;

        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        let qs = require('qs');
        this.$refs['dataForm'].validate((valid) => {
          this.upDepLoading = true
          if (valid) {
            let data = {
              'name': this.temp.name,
              'description': this.temp.description
            };

            const id = this.selectedId;

            let deployplanData = qs.stringify(data);
            updateDeployplan(deployplanData, id).then(() => {
              this.upDepLoading = false
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch((error) => {
              this.upDepLoading = false
              this.errorMessage = '操作失败！'
              if (error.response.data.message) {
                this.errorMessage = error.response.data.message
              }
              this.$notify({
                title: '修改失败',
                message: this.errorMessage,
                type: 'error',
                duration: 2000
              })
            })

          }
        })
      },
      setSort() {
        const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
        this.sortable = Sortable.create(el, {
          ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
          setData: function (dataTransfer) {
            dataTransfer.setData('Text', '')
            // to avoid Firefox bug
            // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          },
          onEnd: evt => {
            const targetRow = this.list.splice(evt.oldIndex, 1)[0]
            this.list.splice(evt.newIndex, 0, targetRow)

            // for show the changes, you can delete in you code
            const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
            this.newList.splice(evt.newIndex, 0, tempIndex)
          }
        })
      },
      handleDelete(row) {
        let id = row.id;
        this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDeployplanNode(id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除节点成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          }).catch(() => {
            this.$notify({
              title: '失败',
              message: '删除节点失败！',
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
      handleCreateBaseline(row) {
        this.resetBaseLineTemp()
        this.baselineVisible = true
        this.selectedId = row.id
        this.$nextTick(() => {
          this.$refs['baselineForm'].clearValidate()
        })
      },
      createBaseline() {
        this.$refs['baselineForm'].validate((valid) => {
          if (valid) {
            this.creBasLoading = true
            let formData = new FormData();

            formData.append('name', this.baselineTemp.name);
            formData.append('description', this.baselineTemp.description);
            saveDeploymentDesignSnapshots(this.selectedId, formData).then(() => {
              this.creBasLoading = false
              this.baselineVisible = false
              this.$notify({
                title: '成功',
                message: '基线创建成功',
                type: 'success',
                duration: 2000
              })
            }).catch((error) => {
              this.creBasLoading = false
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
      deleteBaseline(row) {
        deleteDeploymentDesignSnapshots(row.id).then((res) => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getBaslines(this.selectedId)
        }).catch(() => {
          this.$notify({
            title: '失败',
            message: '基线删除失败',
            type: 'error',
            duration: 2000
          })
        })
      },
      handleModifyBaseline(row) {
        this.modifyBaselineVisible = true
        this.modifyBaselineTemp = {
          id: row.id,
          name: row.name,
          description: row.description
        }
      },
      modifyBaseline() {
        this.upBasLoading = true
        let data = {
          'name': this.modifyBaselineTemp.name,
          'description': this.modifyBaselineTemp.description,
        }
        var qs = require('qs');
        let datapost = qs.stringify(data)
        modifySnapshots(this.modifyBaselineTemp.id, datapost).then(() => {
          this.upBasLoading = false
          this.modifyBaselineVisible = false
          this.getBaslines(this.selectedId)
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
        }).catch((error) => {
          this.upBasLoading = false
          this.errorMessage = '操作失败！'
          if (error.response.data.message) {
            this.errorMessage = error.response.data.message
          }
          this.$notify({
            title: '修改失败',
            message: this.errorMessage,
            type: 'error',
            duration: 2000
          })
        })
      },
      handleMonitor(row) {
        this.$router.push({
          name: 'monitor',
          params: {
            name: row.name,
            id: row.id
          }
        })
      },
      showHistory() {
        this.getHis()
      },
      showNow() {
        this.getList()
      },
      handleClean(row) {
        this.$confirm('确认彻底删除此部署设计吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          cleanDeployplan(row.id).then(() => {
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
      handleRestore(row) {
        this.$confirm('确认恢复此部署设计吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          restoreDeployplan(row.id).then(() => {
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
      }
    },
    computed: {
      listAbleDevice () {
        let self = this;
        return self.currentDeviceList.filter(function (item) {
          return item.hostAddress.toLowerCase().indexOf(self.searchQueryDevice.toLowerCase()) !== -1;
        })
      },
      listA: function () {
        let self = this;
        return self.list.filter(function (item) {
          if (item.name) {
            return item.name.toLowerCase().indexOf(self.searchQuery.toLowerCase()) !== -1;
          } else {
            return item
          }
        })
      },
      listB: function () {
        let self = this;
        return self.listComp.filter(function (item) {
          return item.name.toLowerCase().indexOf(self.searchQuery2.toLowerCase()) !== -1;
        })
      },
      listenProId() {
        return this.$store.state.app.projectId
      },
      listenSelectHisComp() {
        return this.watchArr
      },
      computedDisabled: function () {
        return function (row, fatherRow) {
          if (fatherRow.bindHisComp) {
            if (row.id === fatherRow.bindHisComp.id) {
              row.isBind = true
            }
            return true
          }
        }
      }
    },
    watch: {
      deployPlanId: function (a, b) {
        this.getList()
        this.getDeviceList()
      },
      listenProId: function (a, b) {
        this.getList()
      },
      listenSelectHisComp: function (a, b) {
        this.componentHisIds = []
        for (var i = 0; i < this.listComp.length; i++) {
          if (this.listComp[i].selectedHisId) {
            this.componentHisIds.push(this.listComp[i].selectedHisId)
          }
          // this.componentIds.splice(this.componentIds.findIndex(item => item === this.listComp[i].identify), 1)
          // this.componentIds.splice(this.componentIds.findIndex(item => this.listComp[i].selectedHisId && ((item === this.listComp[i].identify))), 1)
        }
        console.log(this.componentIds)
      }
    }
  }
</script>

<style scoped>
  .splicClass {
    min-height: 530px;
    position: relative;
    border: 1px solid lightgrey;
  }

  div.isBinded {
    background: #E6E6FA;
  }

  .pan-btn {
    font-size: 12px;
    color: #fff;
    padding: 3px 15px;
    border-radius: 2px;
    border: none;
    outline: none;
    margin-right: 0;
    transition: all .6s ease;
    position: relative;
    display: inline-block;
  }

  .el-button + .el-button {
    margin-left: 0;
  }
</style>

