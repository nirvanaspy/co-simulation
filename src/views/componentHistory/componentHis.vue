<template>
  <div class="app-container calendar-list-container" id="components">
    <!--<div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 240px;" class="filter-item" placeholder="标题" v-model="searchQuery">
      </el-input>
    </div>-->

    <el-table :key='tableKey' :data="listA" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row
              stripe
              :default-sort = "{prop: 'tag', order: 'descending'}"
              style="width: 100%">

      <el-table-column :label="$t('table.compName')" min-width="100">
        <template slot-scope="scope">
          <svg-icon icon-class="history1" style="font-size: 18px;"></svg-icon>
          <span v-if="!scope.row.deleted" class="link-type" @click="handleUpdate(scope.row)">{{scope.row.name}}</span>
          <span v-else>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" :label="$t('table.compVersion')">
        <template slot-scope="scope">
          <span>{{scope.row.version}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" :label="$t('table.compPath')">
        <template slot-scope="scope">
          <span>{{scope.row.relativePath}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" :label="$t('table.compDesc')">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" label="修改时间" sortable prop="tag">
        <template slot-scope="scope">
          <span>{{computedTimeTag(scope.row.tag)}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" width="140" class-name="small-padding fixed-width" align="center">
        <template slot-scope="scope">
          <!--<el-button type="primary" size="mini" @click="handleUpdate(scope.row)" style="margin-left: 10px;">{{$t('table.edit')}}</el-button>-->
          <el-dropdown trigger="click" v-if="!scope.row.deleted">
            <!--<el-tooltip class="item" effect="dark" content="更多操作" placement="top">
              <span class="el-dropdown-link">
              <svg-icon icon-class="ellipsis"></svg-icon>
            </span>
            </el-tooltip>-->
            <span class="el-dropdown-link">
              <el-button type="success" plain>更多操作</el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <!--<el-dropdown-item>
                <span style="display:inline-block;padding:0 10px;" @click="handleUpdate(scope.row)">编辑</span>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <span style="display:inline-block;padding:0 10px;" @click="compCopy(scope.row)">复制</span>
              </el-dropdown-item>-->
              <el-dropdown-item>
                <span style="display:inline-block;padding:0 10px;" @click="exportLink(scope.row)">导出</span>
              </el-dropdown-item>
              <!--<el-dropdown-item divided>
                <span style="display:inline-block;padding:0 10px;" @click="handleDelete(scope.row)">删除</span>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <span style="display:inline-block;padding:0 10px;" @click="historyVersion(scope.row)">历史版本</span>
              </el-dropdown-item>-->
            </el-dropdown-menu>
          </el-dropdown>
          <!--<el-dropdown trigger="click" v-else>
            <span class="el-dropdown-link">
              <el-button type="success" plain>更多操作</el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span style="display:inline-block;padding:0 10px;" @click="handleDelHisCom(scope.row)">删除</span>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <span style="display:inline-block;padding:0 10px;" @click="handleResHisCom(scope.row)">恢复</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>-->
        </template>
      </el-table-column>

    </el-table>

    <div class="pagination-container" style="text-align: center;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="currentPage" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!-- 修改 -->
    <el-dialog title="历史组件详情"
               :visible.sync="dialogFormVisible"
               top="7vh" width="86%"
               class="filesDialog"
               append-to-body
    >
      <div slot="title">
        <svg-icon icon-class="history1"></svg-icon>
        组件历史版本详情
      </div>
      <el-form :rules="componentRules" ref="dataForm" :model="temp" label-width="100px"
               style='width: 100%;height: 100%'>
        <div style="height: 90%;overflow-y: auto;width: 40%;float: left;padding-right: 16px;position: relative;">
          <el-form-item :label="$t('table.compName')" prop="name">
            <el-input v-model="temp.name" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.compVersion')" prop="version">
            <el-input v-model="temp.version" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.compPath')" prop="relativePath">
            <el-input v-model="temp.relativePath" placeholder="/test/，必须以斜杠开头，斜杠结尾" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.compDesc')" prop="desc">
            <el-input v-model="temp.description" disabled="disabled"></el-input>
          </el-form-item>
          <div class="button-container">
            <el-button @click="dialogFormVisible = false" style="margin-right: 10px">{{$t('table.cancel')}}</el-button>
            <!--<el-button type="primary" @click="updateData" :loading="upComLoading">{{$t('table.confirm')}}</el-button>-->
          </div>
          <!--去除修改组件时的文件上传模块-->
          <!--<el-form-item :label="$t('table.compUpload')" prop="fileAll">
          <uploader :options="options"
                    :autoStart="autoStart"
                    :file-status-text="statusText"
                    :started="started"
                    ref="uploader"
                    class="uploader-example">
            <uploader-unsupport></uploader-unsupport>
            <uploader-drop>
              <p>拖拽文件到此处或</p>
              <uploader-btn>选择文件</uploader-btn>
              <uploader-btn :directory="true">选择文件夹</uploader-btn>
            </uploader-drop>
            <uploader-list id="fileUp"></uploader-list>
          </uploader>
        </el-form-item>-->
        </div>
        <!--文件管理模块-->
        <div style="height: 100%;overflow: auto;width: 60%;float: right;padding:5px 0 10px 10px;border-left:1px solid #ccc;margin-top: -44px">
          <!--<label style="width: 100%;font-size: 14px;">组件详细信息</label>-->
          <comFileManage :selectCompId="selectedId" :selectCompName="selectdName"></comFileManage>
        </div>
      </el-form>
      <!--<div slot="footer" class="dialog-footer">-->
      <!--<el-button @click="dialogFormVisible = false" style="margin-right: 10px">{{$t('table.cancel')}}</el-button>-->
      <!--<el-button type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>-->
      <!--</div>-->
    </el-dialog>
  </div>
</template>

<script>
  /* eslint-disable */
  import { compList, createComp, updateComp, copyComp, importComp, deleteComp, compListHistory, compSingle, restoreCom, cleanCom, compHisVersion} from '@/api/component'
  import waves from '@/directive/waves' // 水波纹指令
  import { Loading } from 'element-ui'
  import comFileManage from '@/views/fileManager/historyFile'

  export default {
    name: 'componentHistory',
    directives: {
      waves
    },
    data() {
      const validatePath = (rule, value, callback) => {
        let pattern = /^(\/([a-zA-Z0-9]+))$/;
        // let pattern = /^(\/([a-zA-Z0-9]+))*\/$/;

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
        projectId: '',
        /*componentId: '',
        componentName: '',*/
        selectedId: '',
        selectdName: '',
        treeInfo: [],
        fileList: [],
        tableKey: 0,
        list: [],
        singleComp: null,
        listLoading: true,
        listQuery: {
          page: 0,
          limit: 10,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id',
          deviceName: undefined
        },
        total:0,//默认数据总数
        pagesize:10,//每页的数据条数
        currentPage:1,//默认开始页面
        sortable: null,
        oldList: [],
        newList: [],
        temp: {
          id: '',
          name: '',
          version: '',
          relativePath: '',
          description: '',
          fileAll: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '修改',
          create: '创建'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          type: [{required: true, message: 'type is required', trigger: 'change'}],
          timestamp: [{type: 'date', required: true, message: 'timestamp is required', trigger: 'change'}],
          title: [{required: true, message: 'title is required', trigger: 'blur'}]
        },
        componentRules: {
          name: [{ required: true, message: '请输入组件名', trigger: 'blur' }],
          version: [{ required: true, message: '请输入版本', trigger: 'blur' }],
          relativePath: [{ required: true, trigger: 'blur', validator: validatePath }]
        },
        downloadLoading: false,
        managerLoading: false,
        creComLoading: false,
        upComLoading: false,
        hisBtnLoading: false,
        options: {
          // 可通过 https://github.com/simple-uploader/Uploader/tree/develop/samples/Node.js 示例启动服务
          //target: '//localhost:3000/upload',
          chunkSize: 1024 * 1024,
          testChunks: true
        },
        attrs: {
          accept: 'image/*'
        },
        statusText: {
          success: '成功了',
          error: '出错了',
          uploading: '上传中',
          paused: '暂停中',
          waiting: '等待中'
        },
        started: false,
        autoStart: '',

        fileInfo: [],
        folderInfo: [],
        files: [],
        folderClearData: [],        //文件夹需要清空的内容数组
        fileClearData: [],          //文件需要清空的内容数组

        fileAll: [],
        searchQuery: '',
        userData:{
          username: '',
          password: ''
        },
        errorMessage: '操作失败'
      }
    },
    props: {
      componentId: {
        default: '',
        type: String
      },
      componentName: {
        default: '',
        type: String
      }
    },
    components: {
      comFileManage
    },
    created() {
      /*this.componentId = this.$route.params.id
      this.componentName = this.$route.params.name*/
      if(this.componentId === '') {
        return
      }
      this.isHistory = false
      this.projectId = this.$store.getters.projectId
      this.userData.username = this.getCookie('username')
      this.userData.password = this.getCookie('password')

      this.getList();

      this.autoStart = false;      //取消自动上传
    },
    methods: {
      getList() {
        this.listLoading = true
        compHisVersion(this.componentId,this.listQuery).then(response => {
          this.isHistory = false
          this.list = response.data.data.content
          this.total = response.data.data.totalElements
          this.listLoading = false
        })
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
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
          id: '',
          name: '',
          version: '',
          relativePath: '',
          description: '',
          fileAll: ''
        }
      },
      handleUpdate(row) {
        this.selectedId = row.id;
        this.selectdName = row.name
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      compCopy(row) {
        let qs = require('qs');
        let id = row.id;
        this.temp = Object.assign({}, row) // copy obj

        let data = {
          'name': this.temp.name
        };
        let proData = qs.stringify(data);
        const copyloading = Loading.service({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading'
        })

        copyComp(proData, id).then(() => {
          this.list.unshift(this.temp)
          this.dialogFormVisible = false
          copyloading.close()
          this.$notify({
            title: '成功',
            message: '复制成功',
            type: 'success',
            duration: 2000
          })

          this.getList()
        }).catch(() => {
          this.$notify({
            title: '失败',
            message: '复制失败',
            type: 'error',
            duration: 2000
          })
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.upComLoading = true
            let id = this.selectedId;

            let formData = new FormData();

            // this.fileAll = this.$refs.uploader.uploader.files;

            formData.append('name', this.temp.name);
            formData.append('version', this.temp.version);
            formData.append('relativePath', this.temp.relativePath);
            //formData.append('size', this.size);
            formData.append('description', this.temp.description);
            formData.append('enctype', "multipart/form-data");
            let data = {
              name: this.temp.name,
              version: this.temp.version,
              relativePath: this.temp.relativePath,
              description: this.temp.description
            }
            let qs = require('qs')
            let newdata = qs.stringify(data)
            updateComp(newdata,id).then(() => {
              this.upComLoading = false
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch((error) => {
              this.errorMessage = '操作失败！'
              this.upComLoading = false
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
          deleteComp(id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },

      exportLink(row) {

        let id = row.id;
        this.exportUrl = this.getIP() + 'apis/componenthistorys/' + id + '/export';

        console.log(this.exportUrl);
        window.open(this.exportUrl);
      },

      uploadCom: function (file) {
        let formData = new FormData();

        console.log("导入组件文件----------");
        console.log(file);

        formData.append('importComponents', file.file);
        const uploading = Loading.service({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading'
        })

        importComp(this.userData, formData).then(() => {
          uploading.close()
          this.$notify({
            title: '成功',
            message: '导入成功',
            type: 'success',
            duration: 2000
          })
          //导入成功后再次查询
          this.getList()

        })
          .catch(error => {
            this.$notify({
              title: '失败',
              message: '导入失败',
              type: 'error',
              duration: 2000
            })
          })
      },

      handleInfo: function (item, path) {
        if (item == null)
          return;

        if (item.hasOwnProperty("children")) {
          let flag;
          for (let i = 0; i < item.children.length; i++) {
            flag = true;
            if (item.children[i].name == path) {
              item = item.children[i];
              flag = false;
              return item;
            }
          }

          if (flag) {
            item.children.push({"name": path});
            item = item.children[item.children.length - 1];
            return item;
          }

        } else {
          item.children = [];
          item.children.push({"name": path});
          item = item.children[0];
          return item;
        }

      },

      zTreeOnClick: function (e, treeId, treeNode) {

        let zTree = $.fn.zTree.getZTreeObj("treeDemo");
        let id;

        for (let i = 0; i < treeInfo.length; i++) {
          if (this.treeInfo[i].name == zTree.getSelectedNodes()[0].name) {
            id = this.treeInfo[i].id;
            break;
          }
        }

      },

      showHistory: function(){
        this.listLoading = true
        this.hisBtnLoading = true
        compListHistory(this.projectId, this.listQuery).then(response => {
          this.isHistory = true
          this.list = response.data.data.content
          this.total = response.data.total
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
      },

      showNow: function(){
        this.listLoading = true
        this.hisBtnLoading = true
        compList(this.projectId,this.listQuery).then(response => {
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
      },
      handleDelHisCom(row) {
        this.$confirm('确认彻底删除此组件吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          cleanCom(row.id).then(() => {
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
      handleResHisCom(row) {
        this.$confirm('确认恢复此组件吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          restoreCom(row.id).then(() => {
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
      historyVersion(row) {

      }
    },
    computed: {
      listA: function () {
        let self = this;
        return self.list.filter(function (item) {
          return item.name.toLowerCase().indexOf(self.searchQuery.toLowerCase()) !== -1;
        })
      },
      computedTimeTag() {
        return function (tag) {
          let date = new Date(tag);
          let Y = date.getFullYear() + '-';
          let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
          let D = date.getDate() < 10 ? '0'+ date.getDate() + ' ' : date.getDate() + ' '
          let h = date.getHours() < 10 ? '0'+ date.getHours() + ':' : date.getHours() + ':'
          let m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':'
          let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
          return Y+M+D+h+m+s
        }
      }
    }
  }
</script>

<style scoped>
  .el-button+.el-button {
    margin-left: 0;
  }
  .el-dialog__body {
    padding: 30px 20px;
    color: #606266;
    line-height: 24px;
    font-size: 14px;
    height: 440px;
    overflow-y: auto;
  }

  .el-dialog {
    margin-top: 10vh;
  }
  .button-container{
    position: absolute;
    bottom: 0;
    right: 15px;
  }

</style>
