<template>
  <div class="app-container calendar-list-container"
       v-loading.fullscreen.lock="scanLoading"
       element-loading-text="正在扫描中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)"
       style="position: absolute;top:85px;bottom:0;width:100%;background-color: #f0f2f5;"
  >
    <div class="selectedName" style="width:100%;height: 40px;line-height: 40px;color:#909399;">
      <span v-if="this.selectedDeviceName" style="margin-right: 10px">当前选中设备:{{selectedDeviceName}}</span>
      <span v-if="this.selectedCompName">组件:{{selectedCompName}}</span>
      <div class="btn-group" style="float:right;">
        <el-dropdown style="margin-right: 10px;">
          <el-button type="primary">
            完整扫描
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown" style="width:120px;">
            <el-dropdown-item>
              <span @click="scanAllByDevice" style="padding:0 13px;">
                扫描设备
              </span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="scanAllByComp" style="padding:0 13px;">
                扫描组件
              </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown>
          <el-button type="primary">
            快速扫描
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown" style="width:120px;">
            <el-dropdown-item>
              <span @click="handleScanQuickByDevice" style="padding:0 13px;">
                扫描设备
              </span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="handleScanQuickByComp" style="padding:0 13px;">
                扫描组件
              </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div style="width:33%;float:left;margin-top: 10px;border:1px solid #ebeef5;height: calc(100% - 110px);">
      <el-table :data="deviceList" v-loading="listLoading" element-loading-text="给我一点时间" fit highlight-current-row
                style="width: 100%;height:100%;overflow-y: scroll"
                :row-key="getRowKeysComp"
                :expand-row-keys="deviceExpands"
                class="deviceList"
      >
        <el-table-column align="left" width="40" type="expand">
          <template slot-scope="props">
            <el-table
              stripe highlight-current-row
              :data="props.row.comps"
              style="padding: 0 0"
              :show-header="false"
            >
              <el-table-column width="40">
                <template slot-scope="scope">
                  <span><svg-icon icon-class="组件"></svg-icon></span>
                </template>
              </el-table-column>
              <el-table-column label="组件名" align="left" width="160">
                <template slot-scope="scope">
                  <span class="link-type"
                        @dblclick="handleSelectComp(scope.row)">{{scope.row.componentHistoryEntity.name}}</span>
                </template>
              </el-table-column>
              <el-table-column label="路径" align="left">
                <template slot-scope="scope">
                  <span>{{scope.row.componentHistoryEntity.relativePath}}</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column align="left" width="40">
          <template slot-scope="scope">
            <span v-if="scope.row.online"><svg-icon icon-class="设备"></svg-icon></span>
            <span v-else><svg-icon icon-class="devicefalse"></svg-icon></span>
          </template>
        </el-table-column>
        <el-table-column align="left" :label="$t('table.deviceName')" min-width="160">
          <template slot-scope="scope">
            <span v-if="scope.row.deviceEntity !== null" class="link-type" @dblclick="getDetailByNode(scope.row, scope.$index)">{{scope.row.deviceEntity.name}}</span>
            <span v-else>暂未绑定设备</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="IP" min-width="130">
          <template slot-scope="scope">
            <span v-if="scope.row.deviceEntity !== null" class="link-type">{{scope.row.deviceEntity.hostAddress}}</span>
            <span v-else>暂未绑定设备</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="状态" width="100">
          <template slot-scope="scope">
            <span class="el-tag el-tag--danger" v-if="!scope.row.online">离线</span>
            <span class="el-tag el-tag--primary" v-else>在线</span>
          </template>
        </el-table-column>
      </el-table>
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
    <div style="width:65%;height: calc(100% - 110px);float: right;margin-top: 10px;margin-bottom: 10px;border:1px solid #ebeef5">
      <el-table :data="deviceDetail" v-loading="listLoading" element-loading-text="给我一点时间" fit highlight-current-row
                style="width: 100%;height:100%;overflow-y: scroll"
                class="scanResTable"
      >
        <!--<el-table-column align="center" type="expand">
          <template slot-scope="props">
            <el-tabs>
              <el-tab-pane label="正确">
                <el-table :data="props.row.correctFiles" stripe fit width="100%" :show-header="false">
                  <el-table-column label="文件名称" prop="name" min-width="240">
                  </el-table-column>
                  <el-table-column label="路径" prop="targetPath" min-width="240">
                  </el-table-column>
                  <el-table-column prop="correct" label="状态" align="center" width="80">
                    <template slot-scope="scope">
                      <svg-icon icon-class="correct"></svg-icon>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="已修改">
                <el-table :data="props.row.modifyedFiles" fit width="100%" :show-header="false">
                  <el-table-column label="文件名称" prop="name" min-width="240">
                    &lt;!&ndash;<template props="fileName">
                      &lt;!&ndash;<span>{{scope.row.deployPath}}</span>&ndash;&gt;
                    </template>&ndash;&gt;
                  </el-table-column>
                  <el-table-column label="路径" prop="targetPath" min-width="240">
                  </el-table-column>
                  <el-table-column prop="modifyed" label="状态" align="center" width="80">
                    <template slot-scope="scope">
                      <svg-icon icon-class="modifyed"></svg-icon>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="已删除">
                <el-table :data="props.row.missingFiles" fit width="100%" :show-header="false">
                  <el-table-column label="文件名称" prop="name" min-width="240">
                    &lt;!&ndash;<template props="fileName">
                      &lt;!&ndash;<span>{{scope.row.deployPath}}</span>&ndash;&gt;
                    </template>&ndash;&gt;
                  </el-table-column>
                  <el-table-column label="路径" prop="targetPath" min-width="240">
                  </el-table-column>
                  <el-table-column prop="missing" label="状态" align="center" width="80">
                    <template slot-scope="scope">
                      <svg-icon icon-class="error"></svg-icon>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="未知">
                <el-table :data="props.row.unknownFiles" fit width="100%" :show-header="false">
                  <el-table-column label="文件名称" prop="name" min-width="240">
                    &lt;!&ndash;<template props="fileName">
                      &lt;!&ndash;<span>{{scope.row.deployPath}}</span>&ndash;&gt;
                    </template>&ndash;&gt;
                  </el-table-column>
                  <el-table-column label="路径" prop="targetPath" min-width="240">
                  </el-table-column>
                  <el-table-column prop="unknown" label="状态" align="center" width="80">
                    <template slot-scope="scope">
                      <svg-icon icon-class="unknown"></svg-icon>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </template>
        </el-table-column>-->
        <el-table-column align="center" width="40">
          <template slot-scope="scope">
            <span><svg-icon icon-class="组件"></svg-icon></span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="组件名" min-width="100">
          <template slot-scope="scope">
            <!--<span><svg-icon icon-class="组件"></svg-icon></span>-->
            <span class="link-type" :class="computedClass(scope.row)">{{scope.row.componentHistoryEntity.name}}</span>
            <!--<span class="link-type" v-else>{{scope.row.componentEntity.name}}</span>-->
          </template>
        </el-table-column>
        <el-table-column align="center" label="版本" width="80">
          <template slot-scope="scope">
            <span class="link-type" :class="computedClass(scope.row)">{{scope.row.componentHistoryEntity.version}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="路径" min-width="130">
          <template slot-scope="scope">
            <span class="link-type" :class="computedClass(scope.row)">{{scope.row.componentHistoryEntity.relativePath}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="扫描结果" min-width="130">
          <template slot-scope="scope">
            <span v-if="scope.row.correctFiles !== undefined" class="res-cont" @click="checkScanRes(scope.row, 'correct')">
              <svg-icon icon-class="correct"></svg-icon>
              {{scope.row.correctFiles.length}}
            </span>
            <span v-if="scope.row.modifyedFiles !== undefined" class="res-cont" @click="checkScanRes(scope.row, 'modifyed')">
              <svg-icon icon-class="modifyed"></svg-icon>
              {{scope.row.modifyedFiles.length}}
            </span>
            <span v-if="scope.row.missingFiles !== undefined" class="res-cont" @click="checkScanRes(scope.row, 'missing')">
              <svg-icon icon-class="error"></svg-icon>
              {{scope.row.missingFiles.length}}
            </span>
            <span v-if="scope.row.unknownFiles !== undefined" class="res-cont" @click="checkScanRes(scope.row, 'unknown')">
              <svg-icon icon-class="unknown"></svg-icon>
              {{scope.row.unknownFiles.length}}
            </span>
            <span v-if="scope.row.correctFiles === undefined" class="res-cont">
              --
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="height:20px;width:100%;"></div>
    <el-dialog title="请填写后缀名" :visible.sync="dialogFormVisible" width="40%">
      <div class="dialog-body" style='width: 80%; margin:0 auto;'>
        <span>后缀名：</span>
        <el-autocomplete
          class="inline-input"
          v-model="type1"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
        ></el-autocomplete>
        <span>(例如:exe,txt)</span>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="formReset">取 消</el-button>
        <el-button v-if="dialogStatus=='scanByDevice'" type="primary" @click="scanQuickByDevice">
          {{$t('table.confirm')}}
        </el-button>
        <el-button v-else type="primary" @click="scanQuickByComp">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

    <!--扫描结果弹框-->
    <el-dialog title="扫描结果" :visible.sync="resDialogVisible" append-to-body width="40%" class="scanResDialog">
      <div slot="title">
        {{scanResTitle}}
        <div style="display: inline-block; margin-left: 10px;">
          <el-input style="width: 200px;" class="filter-item" placeholder="请输入文件名进行搜索" v-model="searchQuery">
          </el-input>
        </div>
      </div>
      <el-table class="searchResTable" :data="computedResList()" stripe fit width="100%" v-if="searchQuery.length > 0">
        <el-table-column label="文件名称" prop="name" min-width="240">
        </el-table-column>
        <el-table-column label="路径" prop="targetPath" min-width="240">
        </el-table-column>
        <el-table-column prop="correct" label="状态" align="center" width="80">
          <template slot-scope="scope">
            <svg-icon v-if="scope.row.type === 0" icon-class="correct"></svg-icon>
            <svg-icon v-if="scope.row.type === 1" icon-class="modifyed"></svg-icon>
            <svg-icon v-if="scope.row.type === 2" icon-class="unknown"></svg-icon>
            <svg-icon v-if="scope.row.type === 3" icon-class="error"></svg-icon>
          </template>
        </el-table-column>
      </el-table>
      <el-tabs v-model="activeResPane" v-else>
        <el-tab-pane label="正确" name="correct">
          <el-table :data="resDataList.correctFiles" stripe fit width="100%" :show-header="false">
            <el-table-column label="文件名称" prop="name" min-width="240">
            </el-table-column>
            <!--<el-table-column label="文件名称" min-width="240">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>-->
            <el-table-column label="路径" prop="targetPath" min-width="240">
            </el-table-column>
            <el-table-column prop="correct" label="状态" align="center" width="80">
              <template slot-scope="scope">
                <svg-icon icon-class="correct"></svg-icon>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="已修改" name="modifyed">
          <el-table :data="resDataList.modifyedFiles" fit width="100%" :show-header="false">
            <el-table-column label="文件名称" prop="name" min-width="240">
            </el-table-column>
            <el-table-column label="路径" prop="targetPath" min-width="240">
            </el-table-column>
            <el-table-column prop="modifyed" label="状态" align="center" width="80">
              <template slot-scope="scope">
                <svg-icon icon-class="modifyed"></svg-icon>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="已删除" name="missing">
          <el-table :data="resDataList.missingFiles" fit width="100%" :show-header="false">
            <el-table-column label="文件名称" prop="name" min-width="240">
            </el-table-column>
            <el-table-column label="路径" prop="targetPath" min-width="240">
            </el-table-column>
            <el-table-column prop="missing" label="状态" align="center" width="80">
              <template slot-scope="scope">
                <svg-icon icon-class="error"></svg-icon>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="未知" name="unknown">
          <el-table :data="resDataList.unknownFiles" fit width="100%" :show-header="false">
            <el-table-column label="文件名称" prop="name" min-width="240">
            </el-table-column>
            <el-table-column label="路径" prop="targetPath" min-width="240">
            </el-table-column>
            <el-table-column prop="unknown" label="状态" align="center" width="80">
              <template slot-scope="scope">
                <svg-icon icon-class="unknown"></svg-icon>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="resDialogVisible = false">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  /*eslint-disable*/
  import { deployplanDevice, getDeployDetailByDevice } from '@/api/deployplan'
  import { scanDevice, scanComp, scanQucikByDev, scanQucikByComp, scanNode, scanNodeDetail, scanQuickNode, scanQuickNodeDetail, getResultByOrder } from '@/api/scan'
  import { deployNodeList, getNodeDetail } from '@/api/deployDesignNode'
  import Stomp from 'stompjs'
  import SockJS from 'sockjs-client'
  import Vue from 'vue'
  import service from '@/utils/request'

  export default {
    name: 'monitor',
    data() {
      return {
        listLoading: false,
        scanLoading: false,
        dialogFormVisible: false,
        resDialogVisible: false,
        isExpand: false,
        deployPlanId: '',
        deployplanName: '',
        deviceList: [],
        webResBody: [],
        selectedDeviceId: '',
        selectedDeviceName: '',
        selectedCompName: '',
        selectedCompId: '',
        deviceDetail: [],
        fileInfo: [],
        fileResult: [],
        total: 0,
        listQuery: {
          page: 0,
          size: 20,
          limit: 5,
          tagname: ''
        },
        total: null,
        pagesize:10,//每页的数据条数
        currentPage:1,//默认开始页面
        indexedDB: null,
        myDB: null,
        dbRequest: null,
        dbObjectStore: null,
        getRowKeys(row) {
          return row.componentHistoryEntity.id
        },
        getRowKeysComp(row) {
          return row.id
        },
        // 要展开的行，数值的元素是row的key值
        expands: [],
        deviceExpands: [],
        type1: '',
        typeSuggest: [{ value: 'pdf' }, { value: 'txt' }, { value: 'sig' }],
        dialogStatus: '',
        textMap: {
          scanByDevice: '快速扫描设备',
          scanByComp: '快速扫描组件'
        },
        resDataList: {},
        activeResPane: 'correct',
        searchQuery: '',
        scanResTitle: '扫描结果'
      }
    },
    created() {
      // alert(this.$route.params.id)
      this.deployPlanId = this.$route.params.id
      this.deployplanName = this.$route.params.name
      // this.getDevices(this.deployPlanId)
      this.getNodeList()
      this.initIndexedDB('indexedDB-orderConfig', 1)
    },
    methods: {
      handleSizeChange(val) {
        this.listQuery.size = val
        this.pagesize = val
        this.getNodeList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val - 1
        this.currentPage = val
        this.getNodeList()
      },
      initIndexedDB(name, version) {
        let that = this
        this.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
        if(!this.indexedDB)
        {
          alert("你的浏览器不支持IndexedDB");
        }
        // const request = this.indexedDB.open(name, version)
        this.dbRequest = this.indexedDB.open(name, version)
        this.dbRequest.onerror = function(e) {
          console.log(e.currentTarget.error.message);
        };

        this.dbRequest.onsuccess = function(e) {
          that.myDB = e.target.result;
          /*const transaction = this.myDB.transaction(["orderId"], "readwrite");
          this.dbObjectStore = transaction.objectStore("orderId");
          console.log('成功打开DB');*/
        };

        this.dbRequest.onupgradeneeded = function(e) {
          that.myDB = e.target.result;
          console.log(this.myDB)
          if (!that.myDB.objectStoreNames.contains('orderConfig')) {
            console.log("我需要创建一个新的存储对象");
            //如果表格不存在，创建一个新的表格（keyPath，主键 ； autoIncrement,是否自增），会返回一个对象（objectStore）
            that.dbObjectStore = that.myDB.createObjectStore('orderConfig', {
              keyPath: "id",
              autoIncrement: true
            });

            //指定可以被索引的字段，unique字段是否唯一

            /*that.dbObjectStore.createIndex("deployplanId", "deployplanId", {
              unique: false
            });

            that.dbObjectStore.createIndex("designNodeId", "designNodeId", {
              unique: false
            });
            that.dbObjectStore.createIndex("nodeDetailId", "nodeDetailId", {
              unique: false
            });*/
            that.dbObjectStore.createIndex("id", "id", {
              unique: true
            });
          }
          console.log('数据库版本更改为： ' + version);
        };
      },
      addOrder(id, orderId) {
        if(!this.myDB) {
          return
        }
        var tx = this.myDB.transaction('orderConfig', 'readwrite');
        var store = tx.objectStore('orderConfig');
        var req = store.put({
          id: id,
          deployplanId: this.deployPlanId,
          designNodeId: this.selectedDeviceId,
          nodeDetailId: this.selectedCompId,
          orderId: orderId });
        req.onsuccess = function (evt) {
        };
        req.onerror = function() {
          alert('error')
        };
      },
      checkOrder(id) {
        let that = this
        if(!this.myDB) {
          return
        }
        var tx = this.myDB.transaction('orderConfig', 'readwrite');
        var store = tx.objectStore('orderConfig');
        var req = store.get(id);
        req.onsuccess = function (evt) {
          // alert('getsucess')
          // alert(evt.target.result.orderId)
          if(evt.target.result) {
            getResultByOrder(evt.target.result.orderId).then((res) => {
              const compResult = res.data.data
              that.expands = []
              that.deviceDetail = compResult
              for (var j = 0; j < that.deviceDetail.length; j++) {
                that.expands.push(that.deviceDetail[j].deploymentDesignDetailEntity.componentHistoryEntity.id)
                that.deviceDetail[j].componentHistoryEntity = that.deviceDetail[j].deploymentDesignDetailEntity.componentHistoryEntity
                that.deviceDetail[j].correctFiles = []
                that.deviceDetail[j].missingFiles = []
                that.deviceDetail[j].modifyedFiles = []
                that.deviceDetail[j].unknownFiles = []
                that.deviceDetail[j].result.forEach((item) => {
                  if(item.type === 0) {
                    that.deviceDetail[j].correctFiles.push(item)
                  }
                  if(item.type === 1) {
                    that.deviceDetail[j].modifyedFiles.push(item)
                  }
                  if(item.type === 2) {
                    that.deviceDetail[j].unknownFiles.push(item)
                  }
                  if(item.type === 3) {
                    that.deviceDetail[j].missingFiles.push(item)
                  }
                })
              }
            })
          } else {
            console.log('noOrderId')
          }
        };
        req.onerror = function() {
          alert('error')
        };
      },
      querySearch(queryString, cb) {
        cb(this.typeSuggest)
      },
      formReset: function() {
        this.type1 = ''
        this.dialogFormVisible = false
      },
      getDevices(id) {
        deployplanDevice(id).then((res) => {
          this.deviceList = res.data.data
          this.getList2()
        })
      },
      getNodeList() {
        this.listLoading = true;
        deployNodeList(this.deployPlanId, this.listQuery).then(response => {
          /*this.deviceList = []
          response.data.data.content.forEach((item) => {
            if(item.deviceEntity) {
              this.deviceList.push(item)
            }
          })*/
          this.deviceList = response.data.data.content
          this.listLoading = false
          this.total = response.data.data.totalElements
          this.getList2()
        })
      },
      getList2() {
        let url = service.defaults.baseURL + '/OMS'
        let socket = new SockJS(url)
        let stompClient = Stomp.over(socket)
        stompClient.debug=null
        let that = this
        stompClient.connect({}, function(frame) {
          stompClient.subscribe('/onlineDevice', function(response) {
            let resBody = response.body
            let resBody2 = resBody.replace(/[\\]/g, '')
            that.webResBody = JSON.parse(resBody2)

            if (that.deviceList.length > 0) {
              for (let i = 0; i < that.deviceList.length; i++) {
                that.deviceList[i].online = false
              }
            }
            /*if (that.webResBody.length > 0) {
              for (let i = 0; i < that.webResBody.length; i++) {
                let listIfExist = false
                let tempList = []
                if (that.deviceList.length > 0) {
                  for (let j = 0; j < that.deviceList.length; j++) {
                    if (that.webResBody[i].inetAddress === that.deviceList[j].ip) {      //查找在线设备
                      that.deviceList[j].online = true
                      break
                    }
                  }
                }
              }
            }*/
            if(that.webResBody){
              $.each(that.webResBody, function (key, value) {
                let listIfExist = false;
                let tempList = [];
                if(that.deviceList.length > 0){
                  for(let j=0;j<that.deviceList.length;j++){
                    if(that.deviceList[j].deviceEntity) {
                      if(value.hostAddress === that.deviceList[j].deviceEntity.hostAddress){      //查找在线设备
                        that.deviceList[j].online = true;
                        break;
                      }
                    }
                  }
                }
              })
            }

            if (that.deviceList.length > 0) {
              for (let i = 0; i < that.deviceList.length; i++) {
                Vue.set(that.deviceList, i, that.deviceList[i])
              }
            }
          })
        })

      },
      getDetailByNode(row, index) {
        // this.isExpand = false
        let uniqueId = this.deployPlanId + row.id
        this.selectedDeviceId = row.id
        this.selectedDeviceName = row.deviceEntity.name
        this.selectedCompId = ''
        this.selectedCompName = ''
        // getDeployDetailByDevice(this.deployPlanId, row.id).then((res) => {
        getNodeDetail(row.id).then((res) => {
          this.deviceDetail = res.data.data
          this.expands = []
          this.deviceList[index].comps = res.data.data
          this.deviceExpands.push(row.id)
          this.checkOrder(uniqueId)
        })
      },
      handleSelectComp(row) {
        // this.selectedCompId = row.componentHistoryEntity.id
        this.selectedCompId = row.id
        this.selectedDeviceId = row.deploymentDesignNodeEntity.id
        this.selectedDeviceName = row.deploymentDesignNodeEntity.deviceEntity.name
        this.selectedCompName = row.componentHistoryEntity.name
        this.deviceDetail = [row]
        let uniqueId = this.deployPlanId + this.selectedDeviceId + row.id
        this.expands = []
        this.checkOrder(uniqueId)

      },
      scanAllByDevice() {
        if (this.selectedDeviceId == '') {
          this.$message({
            message: '请先双击选择设备！',
            type: 'warning'
          })
          return
        }
        for (var i = 0; i < this.deviceList.length; i++) {
          if (this.selectedDeviceId == this.deviceList[i].id) {
            if (this.deviceList[i].online === true) {
              this.$notify({
                title: '扫描开始',
                message: '设备完整扫描',
                type: 'success',
                duration: 2000
              })
              this.scanLoading = true
              // scanDevice(this.deployPlanId, this.selectedDeviceId).then((res) => {
              scanNode(this.selectedDeviceId).then((res) => {
                let uniqueId = this.deployPlanId + this.selectedDeviceId
                this.addOrder(uniqueId, res.data.data[0].orderId)
                this.isExpand = false
                this.scanLoading = false
                const compResult = res.data.data
                this.expands = []
                this.deviceDetail = compResult
                for (var j = 0; j < this.deviceDetail.length; j++) {
                  this.expands.push(this.deviceDetail[j].deploymentDesignDetailEntity.componentHistoryEntity.id)
                  this.deviceDetail[j].componentHistoryEntity = this.deviceDetail[j].deploymentDesignDetailEntity.componentHistoryEntity
                  this.deviceDetail[j].correctFiles = []
                  this.deviceDetail[j].missingFiles = []
                  this.deviceDetail[j].modifyedFiles = []
                  this.deviceDetail[j].unknownFiles = []
                  this.deviceDetail[j].result.forEach((item) => {
                    if(item.type === 0) {
                      this.deviceDetail[j].correctFiles.push(item)
                    }
                    if(item.type === 1) {
                      this.deviceDetail[j].modifyedFiles.push(item)
                    }
                    if(item.type === 2) {
                      this.deviceDetail[j].unknownFiles.push(item)
                    }
                    if(item.type === 3) {
                      this.deviceDetail[j].missingFiles.push(item)
                    }
                  })
                }
                this.$notify({
                  title: '成功',
                  message: '扫描成功',
                  type: 'success',
                  duration: 2000
                })
              }).catch(() => {
                this.scanLoading = false
                this.$notify({
                  title: '失败',
                  message: '扫描失败',
                  type: 'error',
                  duration: 2000
                })
              })
            } else {
              this.$message({
                message: '设备离线！',
                type: 'warning'
              })
            }
          }
        }
        /*scanDevice(this.deployPlanId, this.selectedDeviceId).then((res) => {
          const compResult = res.data.data
          /!*for (var i = 0; i < compResult.length; i++) {
            for (var j = 0; j < this.fileInfo.length; j++) {
              if(compResult[i].componentEntity.id === this.fileInfo[j].componentEntity.id) {
                this.fileInfo[j].modifyedFiles = compResult[i].modifyedFiles
                this.fileInfo[j].missingFiles = compResult[j].missingFiles
                this.fileInfo[j].unknownFiles = compResult[j].unknownFiles
                this.fileInfo[j].correctFiles = compResult[j].correctFiles
                // this.fileInfo[j].files.concat(compResult[i].modifyedFiles).concat(compResult[i].missingFiles).concat(compResult[i].unknownFiles).concat(compResult[i].correctFiles)
              }
            }
          }*!/
          this.fileResult = [
            {
              correctFiles:[{deployPath:'1', id:'1'}]
            },
            {
              correctFiles:[{deployPath:'2', id:'2'}]
            }
          ]
          /!*for(var i = 0; i < this.fileInfo.length; i++) {
            for(var j = 0; j < compResult.length; j++ ) {
              if(this.fileInfo[i].componentEntity.id === compResult[j].componentEntity.id) {
                let resFile = {
                  modifyedFiles: [],
                  missingFiles: [],
                  unknownFiles: [],
                  correctFiles: []
                }
                resFile.modifyedFiles = compResult[j].modifyedFiles,
                resFile.missingFiles = compResult[j].missingFiles,
                resFile.unknownFiles = compResult[j].unknownFiles,
                resFile.correctFiles = compResult[j].correctFiles,
               /!* res = {
                  modifyedFiles: compResult[j].modifyedFiles,
                  missingFiles: compResult[j].missingFiles,
                  unknownFiles: compResult[j].unknownFiles,
                  correctFiles: compResult[j].correctFiles
                }*!/
                this.fileResult.push(res)
              }
            }
          }*!/
          console.log(this.fileResult)
          this.$notify({
            title: '成功',
            message: '扫描成功',
            type: 'success',
            duration: 2000
          })
        })*/
      },
      scanAllByComp() {
        if (this.selectedDeviceId == '') {
          this.$message({
            message: '请先双击选择设备！',
            type: 'warning'
          })
          return
        }
        if (this.selectedCompId == '') {
          this.$message({
            message: '请先双击选择组件！',
            type: 'warning'
          })
          return
        }
        for (var i = 0; i < this.deviceList.length; i++) {
          if (this.selectedDeviceId == this.deviceList[i].id) {
            if (this.deviceList[i].online === true) {
              this.scanLoading = true
              scanNodeDetail(this.selectedCompId).then((res) => {
                let uniqueId = this.deployPlanId + this.selectedDeviceId + this.selectedCompId
                this.addOrder(uniqueId, res.data.data.orderId)
                this.scanLoading = false
                this.deviceDetail = []
                this.expands = []
                this.deviceDetail.push(res.data.data)
                // this.expands.push(res.data.data.componentEntity.id)
                this.expands.push(res.data.data.deploymentDesignDetailEntity.componentHistoryEntity.id)

                for(var j = 0; j < this.deviceDetail.length; j++ ) {
                  this.deviceDetail[j].componentHistoryEntity = this.deviceDetail[j].deploymentDesignDetailEntity.componentHistoryEntity
                  this.deviceDetail[j].correctFiles = []
                  this.deviceDetail[j].missingFiles = []
                  this.deviceDetail[j].modifyedFiles = []
                  this.deviceDetail[j].unknownFiles = []
                  this.deviceDetail[j].result.forEach((item) => {
                    if(item.type === 0) {
                      this.deviceDetail[j].correctFiles.push(item)
                    }
                    if(item.type === 1) {
                      this.deviceDetail[j].modifyedFiles.push(item)
                    }
                    if(item.type === 2) {
                      this.deviceDetail[j].unknownFiles.push(item)
                    }
                    if(item.type === 3) {
                      this.deviceDetail[j].missingFiles.push(item)
                    }
                  })
                }
                /*console.log(this.expands)
                console.log('组件扫描')
                console.log(this.deviceDetail)*/
                this.$notify({
                  title: '成功',
                  message: '组件完整扫描成功',
                  type: 'success',
                  duration: 2000
                })
              }).catch(() => {
                this.scanLoading = false
                this.$notify({
                  title: '失败',
                  message: '组件完整扫描失败',
                  type: 'error',
                  duration: 2000
                })
              })
            } else {
              this.$message({
                message: '设备离线！',
                type: 'warning'
              })
            }
          }
        }

      },
      handleScanQuickByDevice() {
        if (this.selectedDeviceId == '') {
          this.$message({
            message: '请先双击选择设备！',
            type: 'warning'
          })
          return
        }
        this.dialogStatus = 'scanByDevice'
        this.type1 = ''
        this.dialogFormVisible = true
      },
      handleScanQuickByComp() {
        /*for(var i = 0; i < this.deviceList.length; i++) {
          if (this.selectedDeviceId == this.deviceList[i].id) {
            if (!this.deviceList[i].online) {
              this.$message({
                message: '设备离线！',
                type: 'warning'
              })
              return
            }
          }
        }*/
        if (this.selectedDeviceId == '') {
          this.$message({
            message: '请先双击选择设备！',
            type: 'warning'
          })
          return
        }
        if (this.selectedCompId == '') {
          this.$message({
            message: '请先双击选择组件！',
            type: 'warning'
          })
          return
        }
        this.dialogStatus = 'scanByComp'
        this.type1 = ''
        this.dialogFormVisible = true
      },
      scanQuickByDevice() {
        for (var i = 0; i < this.deviceList.length; i++) {
          if (this.selectedDeviceId == this.deviceList[i].id) {
            if (this.deviceList[i].online === true) {
              this.$notify({
                title: '扫描开始',
                message: '设备完整扫描',
                type: 'success',
                duration: 2000
              })
              this.scanLoading = true
              // scanQucikByDev(this.deployPlanId, this.selectedDeviceId, this.type1).then((res) => {
              scanQuickNode(this.selectedDeviceId, this.type1).then((res) => {
                this.scanLoading = false
                // this.deviceDetail = []
                // this.deviceDetail.push(res.data.data)
                this.deviceDetail = res.data.data
                this.expands = []
                for (var k = 0; k < this.deviceDetail.length; k++) {
                  this.expands.push(this.deviceDetail[k].deploymentDesignDetailEntity.componentHistoryEntity.id)
                  this.deviceDetail[k].componentHistoryEntity = this.deviceDetail[k].deploymentDesignDetailEntity.componentHistoryEntity
                  this.deviceDetail[k].correctFiles = []
                  this.deviceDetail[k].missingFiles = []
                  this.deviceDetail[k].modifyedFiles = []
                  this.deviceDetail[k].unknownFiles = []
                  this.deviceDetail[k].result.forEach((item) => {
                    if(item.type === 0) {
                      this.deviceDetail[k].correctFiles.push(item)
                    }
                    if(item.type === 1) {
                      this.deviceDetail[k].modifyedFiles.push(item)
                    }
                    if(item.type === 2) {
                      this.deviceDetail[k].unknownFiles.push(item)
                    }
                    if(item.type === 3) {
                      this.deviceDetail[k].missingFiles.push(item)
                    }
                  })
                }
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: '设备快速扫描成功',
                  type: 'success',
                  duration: 2000
                })
              }).catch(() => {
                this.dialogFormVisible = false
                this.scanLoading = false
                this.$notify({
                  title: '失败',
                  message: '设备快速扫描失败',
                  type: 'error',
                  duration: 2000
                })
              })
            } else {
              this.$message({
                message: '设备离线！',
                type: 'warning'
              })
            }
          }
        }
      },
      scanQuickByComp() {
        for (var i = 0; i < this.deviceList.length; i++) {
          if (this.selectedDeviceId == this.deviceList[i].id) {
            if (this.deviceList[i].online === true) {
              this.$notify({
                title: '扫描开始',
                message: '设备完整扫描',
                type: 'success',
                duration: 2000
              })
              this.scanLoading = true
              // scanQucikByComp(this.deployPlanId, this.selectedDeviceId, this.selectedCompId, this.type1).then((res) => {
              scanQuickNodeDetail(this.selectedCompId, this.type1).then((res) => {
                this.scanLoading = false
                this.deviceDetail = []
                this.deviceDetail.push(res.data.data)
                this.expands = []
                // this.expands.push(res.data.data.componentEntity.id)
                this.expands.push(res.data.data.deploymentDesignDetailEntity.componentHistoryEntity.id)

                for(var j = 0; j < this.deviceDetail.length; j++ ) {
                  this.deviceDetail[j].componentHistoryEntity = this.deviceDetail[j].deploymentDesignDetailEntity.componentHistoryEntity
                  this.deviceDetail[j].correctFiles = []
                  this.deviceDetail[j].missingFiles = []
                  this.deviceDetail[j].modifyedFiles = []
                  this.deviceDetail[j].unknownFiles = []
                  this.deviceDetail[j].result.forEach((item) => {
                    if(item.type === 0) {
                      this.deviceDetail[j].correctFiles.push(item)
                    }
                    if(item.type === 1) {
                      this.deviceDetail[j].modifyedFiles.push(item)
                    }
                    if(item.type === 2) {
                      this.deviceDetail[j].unknownFiles.push(item)
                    }
                    if(item.type === 3) {
                      this.deviceDetail[j].missingFiles.push(item)
                    }
                  })
                }
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: '组件快速扫描成功',
                  type: 'success',
                  duration: 2000
                })
              }).catch(() => {
                this.dialogFormVisible = false
                this.scanLoading = false
                this.$notify({
                  title: '失败',
                  message: '组件快速扫描失败',
                  type: 'error',
                  duration: 2000
                })
              })
            } else {
              this.$message({
                message: '设备离线！',
                type: 'warning'
              })
            }
          }
        }
      },
      checkScanRes(row, type) {
        this.resDataList = row
        this.scanResTitle = row.componentHistoryEntity.name + '扫描结果'
        this.activeResPane = type
        this.searchQuery = ''
        this.resDialogVisible = true
      }
    },
    computed: {
      computedIcon() {
        return function(row) {
          if (row.correct) {
            return 'correct'
          }
          if (row.modifyed) {
            return 'modifyed'
          }
          if (row.missing) {
            return 'error'
          }
          if (row.unknown) {
            return 'unknown'
          }
          return ''
        }
      },
      computedClass() {
        return function(row) {
          if (row.correctFiles) {
            if (row.missingFiles.length > 0 || row.modifyedFiles.length > 0) {
              return 'abNormal'
            } else {
              return ''
            }
          }
        }
      },
      computedResList() {
        return function() {
          let self = this;
          if(self.resDataList.result !== undefined) {
            return self.resDataList.result.filter(function (item) {
              return item.name.toLowerCase().indexOf(self.searchQuery.toLowerCase()) !== -1;
            })
          } else {
            return []
          }
        }
      }
      /*deviceListB: function () {
        let self = this;
        return self.deviceList.filter(function (item) {
          if(item.deviceEntity) {
            return item
          }
        })
      },*/
    }
  }
</script>

<style scoped>
  .abNormal {
    color: orangered;
  }
  .res-cont {
    cursor: pointer;
    padding: 0 6px;
  }
</style>

