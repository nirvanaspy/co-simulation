<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input style="width: 240px;" class="filter-item" :placeholder="$t('table.deviceName')" v-model="searchQuery">
      </el-input>
    </div>
    <el-table :key='tableKey' :data="listA" v-if="!isHistory" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" :label="$t('table.deviceName')" width="130">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row, scope.$index)">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" align="center" :label="$t('table.deviceIP')">
        <template slot-scope="scope">
          <span>{{scope.row.hostAddress}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="操作系统">
        <template slot-scope="scope">
          <span style="font-size: 28px"><svg-icon :icon-class="computedOs(scope.row.ostype)"></svg-icon></span>
        </template>
      </el-table-column>
      <!--<el-table-column min-width="100px" align="center" :label="$t('table.devicePath')">-->
        <!--<template slot-scope="scope">-->
          <!--<span v-if="scope.row.deployPath">{{scope.row.deployPath}}</span>-->
          <!--<span v-else>&#45;&#45;</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column min-width="90px" align="center" label="CPU">
        <template slot-scope="scope">
          <span v-if="!scope.row.online">--</span>
          <span v-else>{{Math.round(scope.row.cpuClock/1000*100)/100}}GHz</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="CPU利用率">
        <template slot-scope="scope">
          <span v-if="!scope.row.online">--</span>
          <span v-else>{{scope.row.cpuUtilization}}%</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="内存利用率">
        <template slot-scope="scope">
          <span v-if="!scope.row.online">--</span>
          <span v-else-if="scope.row.ifChangeColor < 70">{{computedRamSize(scope.row)}}%</span>
          <span v-else-if="scope.row.ifChangeColor >= 70 && scope.row.ifChangeColor < 85" style="color: #FF8C00;">{{computedRamSize(scope.row)}}%</span>
          <span v-else-if="scope.row.ifChangeColor >= 85" style="color: #FF0000;">{{computedRamSize(scope.row)}}%</span>
        </template>
      </el-table-column>
      <!--<el-table-column min-width="90px" align="center" label="上行速度">-->
        <!--<template slot-scope="scope">-->
          <!--<span v-if="!scope.row.online">&#45;&#45;</span>-->
          <!--<span v-else>{{computedUpStream(scope.row.upLoadSpeed)}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column min-width="90px" align="center" label="下行速度">-->
        <!--<template slot-scope="scope">-->
          <!--<span v-if="!scope.row.online">&#45;&#45;</span>-->
          <!--<span v-else>{{computedDownStream(scope.row.downLoadSpeed)}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column align="center" :label="$t('table.deviceState')">
        <template slot-scope="scope">
          <span class="el-tag el-tag--danger" v-if="scope.row.online == false">离线</span>
          <span class="el-tag el-tag--primary" v-else>在线</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.check')" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-if="scope.row.online && !scope.row.virtual" @click="handleProcess(scope.row)">{{$t('table.deviceProcess')}}</el-button>
          <el-button size="mini" type="success" v-if="scope.row.online && !scope.row.virtual" @click="handleDisk(scope.row)">{{$t('table.disk')}}</el-button>
          <!--<el-button size="mini" type="warning" v-if="!scope.row.virtual && scope.row.online" @click="handleRouter(scope.row)">-->
            <!--远程-->
          <!--</el-button>-->
          <el-button type="primary" disabled="disabled" v-if="!scope.row.online || scope.row.virtual" size="mini">{{$t('table.deviceProcess')}}</el-button>
          <el-button size="mini" disabled="disabled" v-if="!scope.row.online || scope.row.virtual" type="success">{{$t('table.disk')}}</el-button>
          <!--<el-button type="warning" disabled="disabled" v-if="!scope.row.online || scope.row.virtual" size="mini">远程</el-button>-->
        </template>
      </el-table-column>
      <el-table-column align="center" label="预约人">
        <template slot-scope="scope">
          <span v-if="scope.row.users">{{scope.row.users.realName}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="140" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-dropdown trigger="click" v-if="!scope.row.virtual">
            <span class="el-dropdown-link">
              <el-button type="success" plain size="small">更多操作</el-button>
            </span>
            <el-dropdown-menu slot="dropdown" v-if="!scope.row.deleted">
              <!--<el-dropdown-item>-->
                <!--<span style="display:inline-block;padding:0 10px;" @click="handleUpdate(scope.row, scope.$index)">编辑</span>-->
              <!--</el-dropdown-item>-->
              <!--<el-dropdown-item divided>-->
                <!--<span style="display:inline-block;padding:0 10px;" @click="copyDevice(scope.row)">复制</span>-->
              <!--</el-dropdown-item>-->
              <el-dropdown-item>
                <span style="display:inline-block;padding:0 10px;" @click="checkBooking(scope.row)">查看预约详情</span>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <span style="display:inline-block;padding:0 10px;" @click="deleteDevice(scope.row)" v-if="userId === scope.row.users.id">取消预约</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button type="primary" size="mini" v-if="scope.row.virtual" @click="handleReport(scope.row)">预约</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--<el-pagination-->
      <!--@size-change="handleSizeChange"-->
      <!--@current-change="handleCurrentChange"-->
      <!--:current-page="currentPage"-->
      <!--:page-sizes="[20,50,100]"-->
      <!--:page-size="10"-->
      <!--layout="total, sizes, prev, pager, next, jumper"-->
      <!--:total="this.total"-->
      <!--background-->
      <!--style="text-align: center;margin-top:20px"-->
    <!--&gt;-->
    <!--</el-pagination>-->

    <!--修改对话窗口：包含动态图-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%" class="modDeviceDialog" v-if="!isHistory">
      <el-form :rules="deviceRules"
               ref="dataForm"
               :model="temp"
               label-width="100px"
               :disabled="true"
               style='width: 80%; margin:0 auto;'>
        <el-form-item :label="$t('table.deviceName')" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.deviceIP')" prop="hostAddress">
          <el-input v-model="temp.hostAddress"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.deviceDesc')" prop="description">
          <el-input v-model="temp.description"></el-input>
        </el-form-item>
      </el-form>
      <lineMarker ref="lineMarker"
                  v-if="!isHistory && dialogStatus === 'update' && list[currentDeviceIndex].online == true"
                  :countTime="list[currentDeviceIndex].countTime"
                  :cpuData="list[currentDeviceIndex].cpuData"
                  :ramData="list[currentDeviceIndex].ramData"
                  :upSpeed="list[currentDeviceIndex].upLoadSpeed"
                  :downSpeed="list[currentDeviceIndex].downLoadSpeed"
                  style="margin-bottom: 10px;"
      >
      </lineMarker>
    </el-dialog>
    <el-dialog title="磁盘" :visible.sync="diskDialogVisible">
      <el-table :key='tableKey' :data="disks" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                style="width: 100%">
        <el-table-column align="center" :label="$t('table.deviceName')" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.size')">
          <template slot-scope="scope">
            <span>{{scope.row.size}}G</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.usedSize')">
          <template slot-scope="scope">
            <span>{{scope.row.usedSize}}G</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="diskDialogVisible = false">{{$t('table.close')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog title="进程" :visible.sync="processDialogVisible" class="processDialog">
      <el-table :key='tableKey' :data="taskprocess" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                stripe
                height="100%"
                style="width: 100%"
                @selection-change="handleCheckedProcess">
        <el-table-column
          type="selection"
          width="55"
          align="center">
        </el-table-column>
        <el-table-column align="center" label="pid">
          <template slot-scope="scope">
            <span>{{scope.row.pid}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.processName')">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="占用内存">
          <template slot-scope="scope">
            <span>{{computedSize(scope.row.ramUsedSize)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="float:right;margin-top: 10px">
        <el-button @click="processDialogVisible = false">关闭</el-button>
        <!--<el-button type="primary" @click="compMonitor()">组件进程监控</el-button>-->
      </div>
    </el-dialog>
    <el-dialog title="组件进程监控" :visible.sync="compProcessDialogVisible">
      <el-table :key='tableKey' :data="taskprocess" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                style="width: 100%">

        <el-table-column align="center" label="进程">
          <template slot-scope="scope">
            <span>--</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span>--</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="请填写预约信息" :visible.sync="reportDialogVisible" width="40%">
      <el-form :rules="bookingRules" ref="reportForm" :model="bookingTemp"  label-width="100px" style='width: 80%; margin:0 auto;'>
        <el-form-item label="预约时间（小时）" label-width="140px">
          <el-input-number size="small" v-model="bookingTemp.bookingTime" controls-position="right" step-strictly></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reportDialogVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="reportDevice">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog title="预约详情" :visible.sync="bookingInfoDialog" width="40%">
      <el-form :model="bookingInfo"  label-position="left" label-width="100px" style='width: 80%; margin:0 auto;'>
        <el-form-item label="预约人" label-width="140px">
          <span>{{bookingInfo.realName}}</span>
        </el-form-item>
        <el-form-item label="项目名称" label-width="140px">
          <span>{{bookingInfo.proName}}</span>
        </el-form-item>
        <el-form-item label="任务名称" label-width="140px">
          <span>{{bookingInfo.taskName}}</span>
        </el-form-item>
        <el-form-item label="开始时间" label-width="140px">
          <span>{{bookingInfo.startTime}}</span>
        </el-form-item>
        <el-form-item label="预约时长" label-width="140px">
          <span>{{bookingInfo.bookingTime}}小时</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bookingInfoDialog = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getDevices, saveDevices, updateDevice, copyDevices, getDisks, getProcess, reportDevices, getHisDevices, cleanDevice, restoreDev } from '@/api/device'
  import waves from '@/directive/waves' // 水波纹指令
  import service from '@/utils/request'
  import Stomp from 'stompjs'
  import SockJS from 'sockjs-client'
  import lineMarker from './lineMarker'
  import Vue from 'vue'

  /* eslint-disable */
  export default {
    name: 'add-device',
    directives: {
      waves
    },
    components: {
      lineMarker
    },
    data() {
      const validateIP = (rule, value, callback) => {
        //ip地址
        let exp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        let reg = value.match(exp);

        if(value.length==0){
          callback(new Error("请输入IP！"));
        }else if (reg == null) {
          callback(new Error('IP地址不合法！'));
        }else {
          callback()
        }
      }
      const validatePath = (rule, value, callback) => {
        let pattern = /^([a-zA-Z]:(\\))([a-zA-Z]*)|(\/([a-zA-Z]+))*$/;

        if(value.length==0){
          callback(new Error("请输入路径！"));
        }else if (!(value.match(pattern))) {
          callback(new Error('路径格式不正确!'));
        }else {
          callback()
        }
      }

      return {
        isHistory: false,
        tableKey: 0,
        list: [],
        webResBody: [],
        checkedProcess: [],           //checkbox, 进程id
        processIds: [],             //进程id
        cpuData: 0,
        ramData: 0,
        upSpeed: 0,
        countTime: null,
        listLoading: true,
        currentDeviceIndex: 0,
        searchQuery: '',
        reportData: {
          name: '',
          hostAddress: '',
          deployPath: ''
        },
        proId: '',
        deviceId: '',
        listQuery: {
          page: 0,
          size:20,
          limit: 5,
          tagname: ''
        },
        total: null,
        pagesize:10,//每页的数据条数
        currentPage:1,//默认开始页面
        sortable: null,
        oldList: [],
        newList: [],
        temp: {
          name: '',
          hostAddress: '',
          deployPath: '',
          description: ''
        },
        bookingTemp: {
          reportPath: '',
          bookingTime: 1
        },
        disks: [],
        taskprocess: [],
        // reportPath: '',
        dialogFormVisible: false,
        diskDialogVisible: false,
        processDialogVisible: false,
        compProcessDialogVisible: false,
        reportDialogVisible: false,
        creDevLoading: false,
        upDevLoading: false,
        delLoading: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新建'
        },
        dialogPvVisible: false,
        pvData: [],
        deviceRules: {
          name: [{ required: true, message: '请输入设备名', trigger: 'blur' }],
          hostAddress: [{ required: true, trigger: 'blur', validator: validateIP }],
          deployPath: [{ required: true, trigger: 'blur', validator: validatePath }]
        },
        bookingRules: {
          reportPath: [{ required: true, message: '请填写部署路径', trigger: 'blur' }]
        },
        downloadLoading: false,
        errorMessage: '操作失败！',
        currentTaskId: '',
        userId: '',
        bookingInfoDialog: false,
        bookingInfo: {}
      }
    },
    filters: {
      statusFilter(deviceState) {
        const statusMap = {
          true: '在线',
          false: '离线'
        }
        return statusMap[deviceState]
      }
    },
    created() {
      this.currentTaskId = this.$route.params.id
      this.userId = this.getCookie('userId')
      this.isHistory = false
      this.proId = this.getCookie('projectId')
      this.getListAndSubscribe()
    },
    methods: {
      getList() {
        this.listLoading = true
        getDevices(this.proId, this.listQuery).then(response => {
          if(response.data.code === 0) {
            this.isHistory = false
            this.list = response.data.data
            // this.total = response.data.total
            this.listLoading = false
            for(let i=0;i<this.list.length;i++){
              this.list[i].online = false;
              this.list[i].virtual = false;
            }
          }
        })
      },
      getListAndSubscribe() {
        this.listLoading = true
        getDevices(this.proId, this.listQuery).then(response => {
          if(response.data.code === 0) {
            this.isHistory = false
            this.list = response.data.data
            // this.total = response.data.total
            this.listLoading = false
            for(let i=0;i<this.list.length;i++){
              this.list[i].online = false;
              this.list[i].virtual = false;
            }
            this.getList2()
          }
        })
      },
      getHis() {
        this.listLoading = true
        getHisDevices(this.proId, this.listQuery).then((response) => {
          if(response.data.code === 0) {
            this.isHistory = true
            this.list = response.data.data.content
            this.total = response.data.total
            this.listLoading = false
            this.listLength = response.data.data.length
            this.total = response.data.data.totalElements
          }
        })
      },
      getList2() {
        let url = service.defaults.baseURL + '/COSIMULATION';
        let socket = new SockJS(url);
        let stompClient = Stomp.over(socket);
        stompClient.debug=null
        let that = this;
        stompClient.connect({}, function (frame) {
          stompClient.subscribe('/onlineDevice', function (response) {
            let resBody = response.body;
            let resBody2 = resBody.replace(/[\\]/g, '');
            that.webResBody = JSON.parse(resBody2);

            if(that.list.length > 0){
              for(let i=0;i<that.list.length;i++){
                // if(that.list[i].createTime)
                if(that.list[i].createTime) {
                  let bootTime = Date.parse(that.list[i].createTime) + that.list[i].interval * 3600 * 1000
                  let nowTime = new Date().getTime()
                  if(bootTime < nowTime) {
                    cleanDevice(that.list[i].id).then((res) => {
                      if(res.data.code === 0) {
                        that.getList()
                        return
                      }
                    })

                  }
                }
                that.list[i].online = false;

                if(that.list[i].online === false && that.list[i].virtual === true){
                  that.list.splice(i,1);
                  i--;
                }
              }
            }

            if(that.webResBody){
              $.each(that.webResBody, function (key, value) {
                let listIfExist = false;
                let tempList = [];
                if(that.list.length > 0){
                  for(let j=0;j<that.list.length;j++){
                    if(that.list[j].virtual !== true){       //虚拟设备不需要再赋值  或者在每次查之前把虚拟且离线的设备删除
                      if(value.hostAddress === that.list[j].hostAddress){      //查找在线设备
                        that.list[j].online = true;
                        that.list[j].cpuClock = value.cpuClock;
                        that.list[j].cpuUtilization = value.cpuUtilization;
                        that.list[j].ramTotalSize = value.ramTotalSize;
                        that.list[j].ramFreeSize = value.ramFreeSize;
                        that.list[j].ifChangeColor = (value.ramTotalSize - value.ramFreeSize)/value.ramTotalSize*100;
                        that.list[j].virtual = false;
                        // that.countTime = that.webResBody[i].createTime
                        // that.cpuData = parseInt(that.webResBody[i].cpuutilization)
                        // that.ramData = Math.round((that.webResBody[i].ramsize - that.webResBody[i].freeRAMSize)/that.webResBody[i].ramsize*10000)/100
                        that.list[j].countTime = value.createTime;
                        that.list[j].cpuData = parseInt(value.cpuUtilization);
                        that.list[j].ramData = Math.round((value.ramTotalSize - value.ramFreeSize)/value.ramTotalSize*10000)/100;
                        that.list[j].upLoadSpeed = value.upLoadSpeed;
                        that.list[j].downLoadSpeed = value.downLoadSpeed;
                        that.list[j].ostype = value.ostype
                        listIfExist = true;
                        break;
                      }
                    }
                  }
                }

                if(!listIfExist && !that.isHistory){       //添加虚拟设备
                  tempList.name = value.hostAddress;
                  tempList.hostAddress = value.hostAddress;
                  tempList.cpuClock = value.cpuClock;
                  tempList.cpuUtilization = value.cpuUtilization;
                  tempList.ramTotalSize = value.ramTotalSize;
                  tempList.ramFreeSize = value.ramFreeSize;
                  tempList.ifChangeColor = (value.ramTotalSize - value.ramFreeSize)/value.ramTotalSize*100;
                  tempList.virtual = true;
                  tempList.online = true;
                  tempList.countTime = value.createTime;
                  tempList.cpuData = parseInt(value.cpuUtilization);
                  tempList.ramData = Math.round((value.ramTotalSize - value.ramFreeSize)/value.ramTotalSize*10000)/100;
                  tempList.upLoadSpeed = value.upLoadSpeed;
                  tempList.downLoadSpeed = value.downLoadSpeed;
                  tempList.ostype = value.ostype;
                  that.list.push(tempList);
                }
              })
            }

            if(that.list.length > 0) {
              for (let i = 0; i < that.list.length; i++) {
                Vue.set(that.list, i, that.list[i]);
              }
            }
          });
        });
      },
      handleSizeChange(val) {
        this.listQuery.size = val
        this.pagesize = val
        if(this.isHistory) {
          this.getHis()
        } else {
          this.getList()
        }
      },
      handleCurrentChange(val) {
        this.listQuery.page = val - 1
        this.currentPage = val
        if(this.isHistory) {
          this.getHis()
        } else {
          this.getList()
        }
      },
      resetTemp() {
        this.temp = {
          name: '',
          hostAddress: '',
          deployPath: '',
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
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.creDevLoading = true
            let formData = new FormData();
            formData.append('name', this.temp.name);
            formData.append('hostAddress', this.temp.hostAddress);
            formData.append('deployPath', this.temp.deployPath);
            formData.append('description', this.temp.description);
            saveDevices(this.proId, formData).then((res) => {
              this.creDevLoading = false
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch((error) =>{
              this.creDevLoading = false
              this.errorMessage = '操作失败！'
              if(error.response.data.message){
                this.errorMessage = error.response.data.message
              }
              this.$notify({
                title: '创建设备失败',
                message: this.errorMessage,
                type: 'error',
                duration: 2000
              })
            })
          }
        })
      },
      handleUpdate(row, index) {
        this.temp = Object.assign({}, row) // copy obj
        /*this.temp.timestamp = new Date(this.temp.timestamp)*/
        this.dialogStatus = 'update'
        this.deviceId = row.id
        this.dialogFormVisible = true
        this.currentDeviceIndex = index
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        this.$nextTick(() => {
          if(!row.online) {
            return
          }
          // 销毁图表
          // this.$refs.lineMarker.chart.clear() // 直接销毁无需清空
          this.$refs.lineMarker.chart.dispose()
          this.$refs.lineMarker.chartSpeed.dispose()
          this.$refs.lineMarker.chart = null
          this.$refs.lineMarker.chartSpeed = null
          // 重置数据
          this.$refs.lineMarker.cpuArr = []
          this.$refs.lineMarker.upstreamSpeedArr = []
          this.$refs.lineMarker.downstreamSpeedArr = []
          this.$refs.lineMarker.ramArr = []
          this.$refs.lineMarker.initChart()
          this.$refs.lineMarker.initSpeedChart()
          this.$refs['dataForm'].clearValidate()

        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.upDevLoading = true
            let qs = require('qs');
            let data = qs.stringify({
              'name': this.temp.name,
              'hostAddress': this.temp.hostAddress,
              'deployPath': this.temp.deployPath,
              'description': this.temp.description
            });
            let deviceData = new FormData()
            deviceData.append('name',this.temp.name)
            deviceData.append('hostAddress',this.temp.hostAddress)
            deviceData.append('deployPath',this.temp.deployPath)
            deviceData.append('description',this.temp.description)
            deviceData.append('enctype', "multipart/form-data")
            updateDevice(this.deviceId, data).then((res) => {
              this.upDevLoading = false
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch((error) =>{
              this.errorMessage = '操作失败！'
              if(error.response.data.message){
                this.errorMessage = error.response.data.message
              }
              this.upDevLoading = false
              this.$notify({
                title: '修改设备失败',
                message: this.errorMessage,
                type: 'error',
                duration: 2000
              })
            })
          }
        })
      },
      deleteDevice(row) {
        this.delLoading = true
        this.$confirm('确认取消预约吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let deleteId = row.id
          cleanDevice(deleteId).then((res) => {
            if(res.data.code === 0) {
              this.delLoading = false
              this.$notify({
                title: '成功',
                message: '取消成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }
          }).catch(() =>{
            this.delLoading = false
            this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'error',
              duration: 2000
            })
          })
        }).catch(() => {
          this.delLoading = false
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      copyDevice(row) {
        let qs = require('qs');
        let id = row.id;
        this.temp = Object.assign({}, row)  // copy obj
        let data = {
          'name': this.temp.name
        };
        let proData = qs.stringify(data);
        copyDevices(id).then(() => {
          this.list.unshift(this.temp)
          /* this.dialogFormVisible = false */
          this.$notify({
            title: '成功',
            message: '复制成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        }).catch(() =>{
          this.$notify({
            title: '失败',
            message: '复制失败',
            type: 'error',
            duration: 2000
          })
        })
      },
      handleProcess(row) {
        this.processDialogVisible = true
        this.listLoading = true
        getProcess(row.id).then((res) => {
          this.taskprocess = res.data.data
          this.listLoading = false
        }).catch((error) => {
          this.listLoading = false
          this.errorMessage = '获取进程失败！'
          if(error.response.data.message){
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
      handleDisk(row) {
        this.diskDialogVisible = true
        this.listLoading = true
        getDisks(row.id).then((res) => {
          this.disks = res.data.data
          this.listLoading = false
        }).catch((error) => {
          this.listLoading = false
          this.errorMessage = '获取硬盘信息失败！'
          if(error.response.data.message){
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
      handleReport(row) {
        for(let i = 0; i < this.list.length; i++) {
          let item = this.list[i]
          if(item.subtask) {
            if(item.subtask.id === this.currentTaskId) {
              this.$message({
                type: 'warning',
                message: '当前子任务已预约设备 ' + item.name + '，请勿重复预约'
              })
              return
            }
          }
        }
        this.reportDialogVisible = true
        this.reportData.name = row.name
        this.reportData.hostAddress = row.hostAddress
        this.$nextTick(() => {
          this.$refs['reportForm'].clearValidate()
        })
      },
      resetReport() {
        this.reportData.name = ''
        this.reportData.hostAddress = ''
        this.reportData.deployPath = ''
        this.bookingTemp.reportPath = ''
        this.bookingTemp.bookingTime = 1
      },
      reportDevice() {
        let qs = require('qs')
        let RpData = qs.stringify({
          'name': this.reportData.name,
          'hostAddress': this.reportData.hostAddress,
          'description': '',
          'userId': this.userId,
          'subtaskId': this.currentTaskId,
          'interval': this.bookingTemp.bookingTime
        })
        reportDevices(RpData).then((res) => {
          if(res.data.code === 0) {
            this.$notify({
              title: '成功',
              message: '预约成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          } else {
            this.$notify({
              title: '失败',
              message: res.data.msg,
              type: 'error',
              duration: 2000
            })
          }
          this.resetReport()
          this.reportDialogVisible = false
        }).catch(() => {
          this.resetReport()
          this.$notify({
            title: '失败',
            message: '预约失败',
            type: 'error',
            duration: 2000
          })
        })
      },
      handleCheckedProcess(val) {          //所选的进程，checkbox
        this.checkedProcess = val;
        this.processIds.splice(0,this.processIds.length);
        for(let i=0;i<this.checkedProcess.length;i++){
          this.processIds.push(this.checkedProcess[i].id);
        }
      },
      handleRouter(row) {
        this.$router.push({
          name: 'connectvnc',
          params: {
            id: row.id,
            ip: row.hostAddress
          }
        })
      },
      showNow() {
        this.getList()
      },
      showHistory() {
        this.currentDeviceIndex = 0
        this.getHis()
      },
      handleClean(row) {
        this.$confirm('确认彻底删除此设备吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          cleanDevice(row.id).then(() => {
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
        this.$confirm('确认恢复此设备吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          restoreDev(row.id).then(() => {
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
      checkBooking(row) {
        this.bookingInfo = {
          realName: row.users.realName,
          startTime: row.createTime,
          bookingTime: row.interval,
          taskName: row.subtask.name,
          proName: row.subtask.project.name
        }
        this.bookingInfoDialog = true
      }
    },
    computed: {
      listA: function () {
        let self = this;
        return self.list.filter(function (item) {
          return item.name.toLowerCase().indexOf(self.searchQuery.toLowerCase()) !== -1;
        })
      },
      listenProjectId () {
        return this.$store.state.app.projectId
      },
      computedUpStream () {
        return function(speed) {
          if(speed >= 0 && speed <= 1000) {
            return Math.round(speed*10)/10 + 'KB/S'
          }
          if(speed > 1000) {
            return Math.round(speed/10)/100 + 'MB/S'
          }
          if(!speed) {
            return 0 + 'KB/S'
          }
        }
      },
      computedDownStream () {
        return function(speed) {
          if(speed >= 0 && speed <= 1000) {
            return Math.round(speed*10)/10 + 'KB/S'
          }
          if(speed > 1000) {
            return Math.round(speed/10)/100 + 'MB/S'
          }
          if(!speed) {
            return 0 + 'KB/S'
          }
        }
      },
      computedSize() {
        return function (size) {
          if(size < 1) {
            return Math.round(size*1024) + 'KB'
          } else if(size < 1000) {
            return Math.round(size) + 'MB'
          } else {
            return Math.round(size/1024) + 'GB'
          }
        }
      },
      computedRamSize() {
        return function (row) {
          if(row.ramTotalSize && row.ramFreeSize) {
            if(row.ramTotalSize == 0) {
              return 0
            } else {
              return Math.round((row.ramTotalSize - row.ramFreeSize)/row.ramTotalSize*10000)/100
            }
          } else {
            return '--'
          }
        }
      },
      computedOs() {
        return function (type) {
          if(type == 0) {
            return 'unknownOs'
          } else if (type == 1) {
            return 'windows'
          } else if (type == 2) {
            return 'linux'
          } else if (type == 3) {
            return 'vxworks'
          } else {
            return 'unknownOs'
          }
        }
      }
      /*listenCpuData() {
        return this.countTime
      }*/
    },
    watch: {
      listenProjectId: function () {
        this.proId = this.getCookie('projectId')
        this.getList()
      },
    }
  }
</script>

<style scoped>
  .mydialogFooter {
    height:40px;
  }
</style>
