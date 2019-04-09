<template>
  <div class="fileComp">
    <div class="operationContainer" style="height: 40px;border-bottom:1px solid #ebeef5" v-if="forUse !== 'preview'">
      <div style="position: absolute;top: 70px;left: 27px;">
        <el-button type="primary" @click="handleCommit">提交审核</el-button>
      </div>
      <div style="float: right;color:rgb(0, 171, 235);cursor: pointer;padding-right: 20px;">
        <span @click="handleuploadFile">
          <svg-icon icon-class="upload1"></svg-icon>
          <span style="font-size: 14px;margin-left: 6px;">上传文件</span>
        </span>
      </div>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="正在加载组件文件" fit
              highlight-current-row
              style="width: 100%"
              class="fileList"
              @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        :selectable="fileAuditSelection"
        width="55">
      </el-table-column>
      <el-table-column label="文件名" min-width="200">
        <template slot-scope="scope">
          <span>
            <svg-icon :icon-class="classifyIcon(scope.row)" style="font-size: 30px;margin-right: 10px;cursor: pointer;color:  #26bada;"></svg-icon>
            <el-tooltip class="item" effect="dark" :content="scope.row.name" placement="top">
              <span v-if="!scope.row.newFolder" class="link-type" :class="{'repeatFile': scope.row.repeat}"
                    style="position:relative;top:2px;display:inline-block;width:70%;white-space:nowrap;overflow:hidden;text-overflow: ellipsis">
                {{scope.row.name}}
              </span>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="种类" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.folder !== true && !scope.row.newFolder">
            {{scope.row.fileEntity.postfix}}
          </span>
          <span v-if="scope.row.folder == true && !scope.row.newFolder">
            文件夹
          </span>
        </template>
      </el-table-column>
      <el-table-column width="120" :label="$t('table.compSize')">
        <template slot-scope="scope">
          <span v-if="scope.row.folder !== true">{{computedSize(scope.row.fileEntity.fileSize)}}</span>
          <span v-if="scope.row.folder === true&&scope.row.name">--</span>
          <span v-if="scope.row.newFolder" style="cursor: pointer;" @click="cancelNewFolder">
            <svg-icon icon-class="cancel"></svg-icon>
          </span>
        </template>
      </el-table-column>
      <el-table-column width="120" label="密级">
        <template slot-scope="scope">
          <span>{{computedSecret(scope.row.secretClass)}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" label="版本">
        <template slot-scope="scope">
          <span>{{scope.row.version}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column width="40px">
        <template slot-scope="scope">
          <el-dropdown v-if="scope.row.name" trigger="click">
            <el-tooltip class="item" effect="dark" content="更多操作" placement="top">
              <span class="el-dropdown-link">
              <svg-icon icon-class="ellipsis"></svg-icon>
            </span>
            </el-tooltip>
            <el-dropdown-menu slot="dropdown" v-if="forUse === 'preview'">
              <el-dropdown-item>
                <span style="display:inline-block;padding:0 10px;" @click="previewFile(scope.row)">预览</span>
              </el-dropdown-item>
            </el-dropdown-menu>
            <el-dropdown-menu slot="dropdown" v-else>
              <el-dropdown-item>
                <span style="display:inline-block;padding:0 10px;" @click="deleteFile(scope.row)">删除</span>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <span style="display:inline-block;padding:0 10px;" @click="exportFile(scope.row)">下载</span>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <span style="display:inline-block;padding:0 10px;" @click="handleEditInfo(scope.row)">修改文件信息</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!--上传文件弹框-->
    <el-dialog
      class="uploadDialog"
      title="上传文件"
      :visible.sync="uploadDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      append-to-body
      width="50%">
      <el-form label-position="left" label-width="70px">
        <el-form-item label="密级">
          <!--<el-input v-model="fileUpInfo.secretClass"></el-input>-->
          <el-select v-model="fileUpInfo.secretClass" placeholder="请选择密级" style="width: 100%">
            <el-option
              v-for="item in secretClassOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <!--<el-input v-model="fileUpInfo.type"></el-input>-->
          <el-select v-model="fileUpInfo.type" placeholder="请选择类型" style="width: 100%">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品型号">
          <el-input v-model="fileUpInfo.productNo" placeholder="请输入产品型号"></el-input>
        </el-form-item>
        <el-form-item label="文件图号">
          <el-input v-model="fileUpInfo.fileNo" placeholder="请输入文件图号"></el-input>
        </el-form-item>
      </el-form>
      <uploader :options="options"
                :autoStart="autoStart"
                :file-status-text="statusText"
                ref="uploader"
                class="manage-uploader"
                @file-complete="fileComplete"
                @files-added="checkMd5"
                @file-success="fileSuccess"
                @file-removed="fileRemove"
                v-loading="md5Loading"
                element-loading-text="正在校验文件身份，请勿关闭"
      >
        <uploader-unsupport></uploader-unsupport>
        <uploader-drop>
          <p>在此处进行操作</p>
          <uploader-btn v-if="fileUpInfo.secretClass !== null && fileInfo.type !== null && fileUpInfo.productNo !== null && fileUpInfo.fileNo !== null && fileUpInfo.subLibraryId !== null && fileUpInfo.secretClass !== '' && fileInfo.type !== '' && fileUpInfo.productNo !== '' && fileUpInfo.fileNo !== '' && fileUpInfo.subLibraryId !== ''">选择文件</uploader-btn>
          <!--<uploader-btn :directory="true">选择文件夹</uploader-btn>-->
        </uploader-drop>
        <!--<uploader-btn>选择文件</uploader-btn>-->
        <div class="repeatFiles">
          <el-table :key='tableKey' :data="repeatFiles">
            <el-table-column label="密级">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <uploader-list ref="uploaderList"></uploader-list>
      </uploader>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="!hiddenClose" @click="uploadDialog = false">关 闭</el-button>
        <!--<el-button type="primary" @click="uploadFile" :loading="upFileLoading">确 定</el-button>-->
      </span>
    </el-dialog>
    <!--文件信息修改-->
    <el-dialog
      class="maniFileDialog"
      title="文件信息修改"
      :visible.sync="editInfoDialog"
      append-to-body
      width="30%">
      <el-form label-position="left" label-width="70px">
        <el-form-item label="密级">
          <el-select v-model="fileEditInfo.secretClass" placeholder="请选择密级" style="width: 100%">
            <el-option
              v-for="item in secretClassOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="fileEditInfo.type" placeholder="请选择类型" style="width: 100%">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品型号">
          <el-input v-model="fileEditInfo.productNo" placeholder="请输入产品型号"></el-input>
        </el-form-item>
        <el-form-item label="文件图号">
          <el-input v-model="fileEditInfo.fileNo" placeholder="请输入文件图号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editInfoDialog = false">取 消</el-button>
        <el-button type="primary" @click="editFileInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!--选择审核人-->
    <el-dialog title="选择审核人" :visible.sync="commitDialog" append-to-body width="60%" class="limit-width-dialog audit-dialog">
      <el-radio-group v-model="signType">
        <el-radio :label="1">无会签</el-radio>
        <el-radio :label="2">一人会签通过</el-radio>
        <el-radio :label="3">多人会签通过</el-radio>
      </el-radio-group>
      <el-collapse v-model="activeNames" accordion class="audit-collapse">
        <el-collapse-item title="选择核对人" name="1">
          <div>
            <el-table
              v-loading="getMaLoading"
              ref="multipleTable"
              :data="userList"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleVerifySelectionChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                label="用户名"
                min-width="120">
                <template slot-scope="scope">{{ scope.row.username }}</template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item title="选择审核人" name="2">
          <div>
            <el-table
              v-loading="getMaLoading"
              ref="multipleTable"
              :data="userList"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleAuditSelectionChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                label="用户名"
                min-width="120">
                <template slot-scope="scope">{{ scope.row.username }}</template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item title="选择会签人" name="3" v-if="signType === 2 || signType === 3">
          <div>
            <el-table
              v-loading="getMaLoading"
              ref="multipleTable"
              :data="computeList"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSignSelectionChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                label="用户名"
                min-width="120">
                <template slot-scope="scope">{{ scope.row.username }}</template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item title="选择批准人" name="4">
          <div>
            <el-table
              v-loading="getMaLoading"
              ref="multipleTable"
              :data="userList"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleApproveSelectionChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                label="用户名"
                min-width="120">
                <template slot-scope="scope">{{ scope.row.username }}</template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div style="text-align: right" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="commitToAuditor" style="margin-top: 10px;">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  /*eslint-disable*/
  import {  previewFiles } from '@/api/component'
  import { movefileTo, copyFileTo, renameFile } from '@/api/component'
  import { getSubLibFiles, uploadSubLibFiles, deleteSubLibFile, editSubLibFileInfo, setLibFileAuditors } from '@/api/sublibFIles'
  import { allUser } from '@/api/getUsers'
  import service from '@/utils/request'
  import SparkMD5 from 'spark-md5'
  import { hasMd5, mergeFile } from '@/api/componentFiles'
  import qs from 'qs'

  export default {
    name: 'comFileManage',
    props: {
      selectCompId: {
        type: String
      },
      selectCompName: {
        type: String
      },
      forUse: {
        type: String,
        default: 'normal'
      },
      proClass: {
        type: Number
      }
    },
    data() {
      return {
        ip: '',
        port: '',
        userId: '',
        projectId:'',
        componentId: '',
        // compName: '',
        parentNodeId: '',
        newFolderName: '',
        selectFileId: '',
        errorMessage: '操作失败',
        maniType: '',
        fileRename: {
          name: ''
        },
        fileEditInfo: {
          secretClass: null,
          type: null,
          productNo: null,
          fileNo: null
        },
        fileUpInfo: {
          secretClass: null,
          type: null,
          productNo: null,
          fileNo: null
        },
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
        typeOptions: [
          {
            label: '参数文件',
            value: '0'
          },
          {
            label: '模型文件',
            value: '1'
          },
          {
            label: '报告文件',
            value: '2'
          },
          {
            label: '实验数据',
            value: '3'
          }
        ],
        codeNameOptions: [
          {
            label: '产品型号',
            value: 0
          },
          {
            label: '文件图号',
            value: 1
          }
        ],
        uploadDialog: false,
        renameDialog: false,
        maniFileDialog: false,
        editInfoDialog: false,
        fileList: [],
        breadcrumbList: [],
        tableKey: 0,
        list: [],
        singleComp: null,
        total: null,
        listLoading: true,
        uploading: false,
        upFileLoading: false,
        fileRenameRules: {
          name: [{ required: true, message: '请输入文件名！', trigger: 'blur' }]
        },
        maniFileLoading: false,
        options: {
          target: 'http://127.0.0.1:8080/files/chunks',
          headers: {
            'Authorization': ''
          },
          chunkSize: 80* 1024 * 1024,
          simultaneousUploads: 20,
          autoStart: false,
          testChunks: true
        },
        attrs: {
          accept: 'image/*'
        },
        statusText: {
          computeMD5: '正在计算MD5',
          success: '上传结束',
          error: '出错了',
          uploading: '上传中',
          paused: '暂停中',
          waiting: '等待中'
        },
        md5Loading: false,
        started: false,
        autoStart: false,
        files: [],
        fileInfo: [],
        searchQuery: '',
        target: '',
        token: '',
        fileInfoList: [],
        fileCompleteLength: 0,
        stopResolveMD5: false,
        hiddenClose: false,
        libOptions: [],
        selectedFiles: [],
        selectedFileIds: [],
        commitDialog: false,
        signType: 0,
        activeNames: '',
        getMaLoading: false,
        userList: [],
        countersignList: [],
        verifyMembers: [],
        auditMembers: [],
        signMembers: [],
        approveMembers: [],
        repeatFiles: []
      }
    },
    created() {
      this.initData()
      this.ip = this.getCookie('ip')
      this.port= this.getCookie('port')
      this.userId = this.getCookie('userId')
      this.target = service.defaults.baseURL + '/files/chunks'
      this.token = 'Bearer' + this.$store.getters.token
      this.selectFileId = ''
      this.maniType = ''
    },
    methods: {
      getAbleUser() {
        this.getMaLoading = true
        allUser().then((res) => {
          if(res.data.code === 0) {
            this.userList = []
            res.data.data.forEach((item) => {
              if(item.username !== 'admin' && item.username !== 'securityGuard' && item.username !== 'securityAuditor') {
                this.userList.push(item)
              }
            })
            // this.userList = res.data.data
            this.countersignList = this.userList.slice(0)
            // 筛选多人会签用户，不能选择自己作为会签人
            for(let i=0;i<this.countersignList.length;i++){
              if(this.countersignList[i].id === this.userId){
                this.countersignList.splice(i,1)
                break
              }
            }
            this.getMaLoading = false
          } else {
            this.getMaLoading = false
          }
        }).catch(() => {
          this.getMaLoading = false
        })
      },
      initData() {
        this.projectId = this.$store.getters.projectId
        this.componentId = this.selectCompId
        this.compName = this.selectCompName
        this.breadcrumbList = []
        this.list = []
        this.breadcrumbList.push({
          name: this.compName,
          componentId: this.componentId,
          parentNodeId: '',
          folder: true
        })

        if(this.componentId){
          this.getList();
        } else {
          this.listLoading = false
        }
        this.autoStart = false; //取消自动上传
      },
      getList() {
        this.listLoading = true
        getSubLibFiles(this.componentId).then((res) => {
          this.list = res.data.data
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
          this.$notify({
            title: '失败',
            message: '加载出错！',
            type: 'error',
            duration: 2000
          })
        })
      },
      handleuploadFile() {
        this.uploadDialog = true
        this.hiddenClose = false
        this.$nextTick(() => {
          this.fileReader = new FileReader()
          this.$refs.uploader.uploader.cancel() //清空文件上传列表
          this.$refs.uploader.uploader.opts.target = this.target
          this.$refs.uploader.uploader.opts.headers.Authorization = this.token
          $('.uploader-list ul').html('')
          this.fileCompleteLength = 0
          this.fileInfoList = []
          $('.manage-uploader .uploader-btn').css('display','inline-block')
        })
      },

      // 上传文件的几个方法
      // 添加文件时触发
      checkMd5 (fileAdded, fileList) {
        // console.log(this.$refs.uploader.uploader.files)

        // 防止用户上传文件名称相同的文件，在上传前就去除名称重复的文件
        this.repeatFiles = []
        for(let j = fileAdded.length - 1; j >= 0; j--) {
          for(let k = 0; k < this.list.length; k++) {
            if(fileAdded[j] !== undefined) {
              if(fileAdded[j].name === this.list[k].name + '.' + this.list[k].postfix) {
                let fileRepeat = fileAdded[j]
                this.repeatFiles.push(fileRepeat)
                this.$refs.uploader.uploader.removeFile(fileRepeat)
                fileAdded.splice(j, 1);
                continue;
              }
            }
          }
        }
        if(this.repeatFiles.length > 0) {
          this.$message({
            showClose: true,
            message: '请注意，此次上传的文件中有文件在库中已存在！',
            type: 'warning',
            //duration: 0
          });
        }
        if(fileAdded.length > 0) {
          this.hiddenClose = true
          this.md5Loading = true
          $('.manage-uploader .uploader-btn').css('display','none')
        }

        this.fileCompleteLength += fileAdded.length
        let chunkSize = this.$refs.uploader.uploader.opts.chunkSize
        let completeFlag = 0
        let that = this
        for(var i = 0; i < fileAdded.length; i++) {
          let fileA = fileAdded[i]
          this.resolveMd5(fileA, chunkSize).then(function (result) {
            fileA.md5 = result
            fileA.uniqueIdentifier = result
            hasMd5(fileA.md5).then((res) => {
              if (res.data.data.id) {
                completeFlag++
                let infoList = {
                  fileId: res.data.data.id,
                  MD5: fileA.md5,
                  name: fileA.name,
                  relativePath: '/' + fileA.relativePath,
                  secretClass: that.fileUpInfo.secretClass,
                  type: that.fileUpInfo.type,
                  productNo: that.fileUpInfo.productNo,
                  fileNo: that.fileUpInfo.fileNo,
                  sublibraryId: that.fileUpInfo.subLibraryId
                  // codeName: that.fileUpInfo.codeName
                }
                that.fileInfoList.push(infoList)
                let resVal = ''
                let val = fileA.size
                if( val < 1024 ) {
                  resVal = val + ' B'
                } else if(val >= 1024 && val < 1048576 ) {
                  resVal = Math.round(val/1024*10)/10 + ' KB'
                } else if(val >= 1048576 && val < 1073741824) {
                  resVal = Math.round(val/1048576*10)/10 + ' MB'
                } else if(val >= 1073741824) {
                  resVal = Math.round(val/1073741824*10)/10 + ' G'
                }
                $('.manage-uploader .uploader-list ul').prepend('<div status="success" class="uploader-file">' +
                  '<div class="uploader-file-progress" style="transform: translateX(0%);"></div> ' +
                  '<div class="uploader-file-info">' +
                  '<div class="uploader-file-name"><i icon="unknown" class="uploader-file-icon"></i>' + fileA.name +
                  '</div> <div class="uploader-file-size">'+ resVal +
                  '</div> <div class="uploader-file-meta"></div> <div class="uploader-file-status"><span>成功了</span> <span style="display: none;"><span>100%</span> <em>0 bytes / s</em> <i></i></span></div> <div class="uploader-file-actions"><span class="uploader-file-pause"></span> <span class="uploader-file-resume">️</span> <span class="uploader-file-retry"></span> <span class="uploader-file-remove"></span></div></div></div>')
                that.$refs.uploader.uploader.removeFile(fileA)
                that.fileCompleteLength += 1 // 中和上传控件触发的removeFile事件的自减1
                // let notiMes = '文件' + fileA.name + '上传成功！'
                that.listLoading = false
                if(completeFlag === fileAdded.length) {
                  that.md5Loading = false
                  that.$refs.uploader.uploader.upload()
                }
              } else if (res.data.data == false) {
                completeFlag++
                if(completeFlag === fileAdded.length) {
                  that.md5Loading = false
                  that.$refs.uploader.uploader.upload()
                }
              }
            })
          })
        }
      },
      resolveMd5(zenfile,chunkSize) {
        return new Promise((resolve, reject) => {
          let file = zenfile.file
          // let spark = new SparkMD5.ArrayBuffer()
          if(zenfile.md5){
            resolve(zenfile.md5)
          }else{
            zenfile.status = 'computeMD5'
            let spark = new SparkMD5()
            let fileReader = new FileReader()
            let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
            let chunks = Math.ceil(file.size / chunkSize)
            let currentChunk = 0
            fileReader.onload = e => {
              spark.appendBinary(e.target.result)
              currentChunk++
              if (currentChunk < chunks) {
                let a = 'deal with' + currentChunk + '剩余' + (chunks - currentChunk)
                load()
              } else {
                resolve(spark.end())
              }
              fileReader.onerror = e => reject(e)
            }

            let load = () => {
              var start = currentChunk * chunkSize
              var end = start + chunkSize >= file.size ? file.size : start + chunkSize
              fileReader.readAsBinaryString(file.slice(start, end))
            }
            load()
          }
        })
      },
      fileRemove() {
        // alert('removed')
        this.fileCompleteLength -=1
      },
      mergeFile (md5, chunkNum, totalSize, name, path) {
        var qs = require('qs')
        let data = {
          'identifier': md5,
          'totalChunks': chunkNum,
          'totalSize': totalSize,
          'filename': name,
          'relativePath': path
        }
        let datapost = qs.stringify(data)
        mergeFile(datapost).then(() => {
        }).catch(() => {
          this.$notify({

          })
        })
      },
      // 上传文件时 fileSuccess 第一个参数为根文件， 第二个参数为上传的文件
      fileSuccess () {
        let data = {
          'identifier': arguments[1].uniqueIdentifier,
          'totalChunks': arguments[1].chunks.length,
          'totalSize': arguments[1].size,
          'filename': arguments[1].name,
          'relativePath': arguments[1].relativePath
        }
        let datapost = qs.stringify(data)
        this.listLoading = true
        mergeFile(datapost).then((res)=> {
          if(res.data.code === 0) {
            let infoList = {
              fileId: res.data.data.id,
              MD5: arguments[1].md5,
              name: arguments[1].name,
              relativePath: '/' + arguments[1].relativePath,
              secretClass: this.fileUpInfo.secretClass,
              type: this.fileUpInfo.type,
              productNo: this.fileUpInfo.productNo,
              fileNo: this.fileUpInfo.fileNo,
              sublibraryId: this.componentId,
              userId: this.userId
              // codeName: this.fileUpInfo.codeName
            }
            this.fileInfoList.push(infoList)
          } else {
            this.$notify({
              title: '失败',
              message: '上传出错了！',
              type: 'error',
              duration: 2000
            })
          }
        })
      },
      // 上传文件夹时 fileComplete 第一个参数为根文件（文件夹），第二个参数为最后一个上传的文件
      fileComplete () {
        console.log('filecomplete=======')
      },
      deleteFile(row) {
        this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          deleteSubLibFile(row.id).then((res) => {
            if(res.data.code === 0) {
              this.getList()
              this.$notify({
                title: '成功',
                message: row.name + '删除成功',
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
            this.listLoading = false
          }).catch(() => {
            this.listLoading = false
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
      previewFile(row) {
        previewFiles(row.id).then((res) => {

        })
      },
      exportFile(row) {
        let url = service.defaults.baseURL + '/sublibraryFiles/sublibraryFile/' + row.id + '/user/' + this.userId + '/export'
        window.open(url)
      },
      handleEditInfo(row) {
        this.editInfoDialog = true
        this.selectFileId = row.id
        this.fileEditInfo = {
          secretClass: row.secretClass,
          type: row.type,
          codeName: row.codeName,
          productNo: row.productNo,
          fileNo: row.fileNo
        }
      },
      editFileInfo() {
        let data = {
          'secretClass': this.fileEditInfo.secretClass,
          'type': this.fileEditInfo.type,
          'productNo': this.fileEditInfo.productNo,
          'fileNo': this.fileEditInfo.fileNo
          // 'codeName': this.fileEditInfo.codeName
        }
        var qs = require('qs');
        let datapost = qs.stringify(data)
        editSubLibFileInfo(this.selectFileId, datapost).then((res) => {
          if(res.data.code === 0) {
            this.$notify({
              title: '成功',
              message: '文件信息修改成功！',
              type: 'success',
              duration: 2000
            })
            this.editInfoDialog = false
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
      },
      onSubLibChange(val) {
        this.fileUpInfo.subLibraryId = val[1]
      },
      handleSelectionChange(val) {
        this.selectedFiles = val
        console.log(this.selectedFiles)
      },
      handleVerifySelectionChange(val) {
        this.verifyMembers = val
      },
      handleAuditSelectionChange(val) {
        this.auditMembers = val
      },
      handleSignSelectionChange(val) {
        this.signMembers = val
      },
      handleApproveSelectionChange(val) {
        this.approveMembers = val
      },
      handleCommit() {
        if(this.selectedFiles.length === 0) {
          this.$message({
            message: '清先选择文件！',
            type: 'warning'
          })
          return
        }
        /*this.selectedFileIds = []
        this.selectedFiles.forEach((item) => {
          this.selectedFileIds.push(item.id)
        })*/
        this.commitDialog = true
        this.signType = 1
        this.getAbleUser()
      },
      commitToAuditor() {
        let myCollatorIds = [] //核对
        let myAuditIds = [] //审核
        let myCountersignIds = [] //会签
        let myApproveIds = [] //批准
        let myFileIds = [] //批准
        this.verifyMembers.forEach((item) => {
          myCollatorIds.push(item.id)
        })
        this.auditMembers.forEach((item) => {
          myAuditIds.push(item.id)
        })
        this.signMembers.forEach((item) => {
          myCountersignIds.push(item.id)
        })
        this.approveMembers.forEach((item) => {
          myApproveIds.push(item.id)
        })
        this.selectedFiles.forEach((item) => {
          myFileIds.push(item.id)
        })
        let collatorIds = (myCollatorIds + '').replace(/\[|]/g, '')
        let auditIds = (myAuditIds + '').replace(/\[|]/g, '')
        let countersignIds = (myCountersignIds + '').replace(/\[|]/g, '')
        let approveIds = (myApproveIds + '').replace(/\[|]/g, '')
        let fileIds = (myFileIds + '').replace(/\[|]/g, '')
        var qs = require('qs')
        let data = {
          'sublibraryFileId': fileIds,
          'proofreadUserIds': collatorIds,
          'auditUserIds': auditIds,
          'countersignUserIds': this.signType === 1 ? '' : countersignIds, // 1:无会签 2:一人会签 3:多人会签
          'approveUserIds': approveIds,
          'auditMode': this.signType,
          // 'userId': this.userId
        }
        let datapost = qs.stringify(data)
        setLibFileAuditors(this.selectedId, datapost).then((res) => {
          if(res.data.code === 0) {
            this.$notify({
              title: '成功',
              message: '设置成功',
              type: 'success',
              duration: 2000
            })
            this.commitDialog = false
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
      fileAuditSelection(row) {
        if (row.auditMode !== 0) {
          return 0
        } else {
          return 1
        }
      }
    },
    computed: {
      classifyIcon () {
        return function (row) {
          let iconType = ''
          if(row.folder == true) {
            iconType = 'folder'
          } else if(row.fileEntity.type === 'png' || row.fileEntity.type === 'jpg' || row.fileEntity.type === 'gif'){
            iconType = 'image'
          } else if(row.fileEntity.type === 'rar' || row.fileEntity.type === 'zip') {
            iconType = 'compressed'
          } else {
            iconType = 'file'
          }
          return iconType
        }
      },
      computedSize() {
        return function(val) {
          let resVal
          if( val < 1024 ) {
            resVal = val + 'B'
          } else if(val >= 1024 && val < 1048576 ) {
            resVal = Math.round(val/1024*10)/10 + 'KB'
          } else if(val >= 1048576 && val < 1073741824) {
            resVal = Math.round(val/1048576*10)/10 + 'MB'
          } else if(val >= 1073741824) {
            resVal = Math.round(val/1073741824*10)/10 + 'G'
          }
          return resVal
        }
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
      },
      fileInfoListLength() {
        return this.fileInfoList.length
      },
      computeList() {
        let list = []
        if(this.signType === 3) {
          list = this.countersignList
        } else {
          list = this.userList
        }
        return list
      }
    },
    watch: {
      selectCompId(newValue, oldValue) {
        this.componentId = this.selectCompId,
          this.parentNodeId = ''
        if(this.componentId) {
          this.initData()
        }
      },
      selectCompName(newValue, oldValue) {
        this.componentId = this.selectCompId,
          this.parentNodeId = ''
        if(this.componentId) {
          this.initData()
        }
      },
      fileInfoListLength(newValue, oldValue) {
        if(this.fileCompleteLength === this.fileInfoList.length && this.fileInfoList.length !== 0) {
          let repeatFile = []
          this.fileInfoList.forEach((item, index) => {

          })
          // for(let j = 0; j < this.fileInfoList.length; j++) {
          for(let j = this.fileInfoList.length - 1; j >= 0; j--) {
            for(let i = 0; i < this.list.length; i++) {
              if(this.fileInfoList[j] !== undefined) {
                if(this.fileInfoList[j].name === this.list[i].name + '.' + this.list[i].postfix) {
                  this.fileInfoList.splice(j, 1);
                  repeatFile.push(this.fileInfoList[j]);
                  this.list[i].repeat === true
                  continue;
                }
              }
            }
          }
          if(repeatFile.length > 0) {
            this.$message({
              showClose: true,
              message: '请注意，此次上传的文件中有' + repeatFile.length + '个文件在库中已存在！',
              type: 'warning',
              //duration: 0
            });
            /*this.$notify({
              title: '提示',
              message: '请主意，当前有' + repeatFile.length + '个文件库中已存在！',
              type: 'success',
              duration: '2000'
            })*/
          }
          let datapost = JSON.stringify(this.fileInfoList)
          this.statusText.success = '正在合并文件'
          uploadSubLibFiles(this.componentId, this.userId, datapost).then((res) => {
            if(res.data.code === 0) {
              this.$notify({
                title: '成功',
                message: '上传成功',
                type: 'success',
                duration: 2000
              })
              this.statusText.success = '文件合并成功'
            } else {
              this.$notify({
                title: '成功',
                message: '上传失败',
                type: 'error',
                duration: 2000
              })
              this.statusText.success = '文件合并失败'
            }
            this.listLoading = false
            this.hiddenClose = false
            this.getList()
          }).catch(() => {
            this.listLoading = false
            this.hiddenClose = false
            this.$notify({
              title: '失败',
              message: '文件上传时出错',
              type: 'error',
              duration: 2000
            })
            this.statusText.success = '文件合并失败'
            this.getList()
          })
        }
      },
    }
  }
</script>

<style scoped>

</style>
