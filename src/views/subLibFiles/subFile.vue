<template>
  <div class="fileComp">
    <div class="operationContainer" style="height: 40px;border-bottom:1px solid #ebeef5" v-if="forUse !== 'preview'">
      <div style="float: left;padding-left: 10px;">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(item,index) in breadcrumbList" :key="index"><span style="cursor: pointer;color:rgb(0, 171, 235);" @click="switchFolder(item,index)">{{item.name}}</span></el-breadcrumb-item>
        </el-breadcrumb>
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
    >
      <el-table-column label="文件名" min-width="200">
        <template slot-scope="scope">
          <span>
            <svg-icon :icon-class="classifyIcon(scope.row)" style="font-size: 30px;margin-right: 10px;cursor: pointer;color:  #26bada;"></svg-icon>
            <el-tooltip class="item" effect="dark" :content="scope.row.name" placement="top">
              <span v-if="!scope.row.newFolder" class="link-type"
                    @click="loadListFile(scope.row)"
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
        <el-form-item label="目标库">
          <el-cascader
            style="width: 100%"
            :options="libOptions"
            @focus="getLib"
            @active-item-change="handleItemChange"
            @change="onSubLibChange"
          ></el-cascader>
          <!--:props="libProps"-->
        </el-form-item>
      </el-form>
      <uploader :options="options"
                :autoStart="autoStart"
                :file-status-text="statusText"
                ref="uploader"
                class="manage-uploader"
                @file-complete="fileComplete"
                @complete="complete"
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
        <uploader-list ref="uploaderList"></uploader-list>
      </uploader>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="!hiddenClose" @click="uploadDialog = false">关 闭</el-button>
        <!--<el-button type="primary" @click="uploadFile" :loading="upFileLoading">确 定</el-button>-->
      </span>
    </el-dialog>
    <!--文件重命名-->
    <el-dialog
      class="maniFileDialog"
      title="文件重命名"
      :visible.sync="renameDialog"
      append-to-body
      width="30%">
      <el-form ref="fileRenameForm" :rules="fileRenameRules" :model="fileRename" label-position="right" label-width="70px" style='width: 80%; margin:0 auto;'>
        <el-form-item label="名称" prop="name">
          <el-input v-model="fileRename.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="renameDialog = false">取 消</el-button>
        <el-button type="primary" @click="renameFile">确 定</el-button>
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
  </div>
</template>

<script>
  /*eslint-disable*/
  import { compList, createComp, updateComp, copyComp, importComp, deleteComp, compSingle, saveFolder, getCompFiles, saveFiles, deleteCompFiles, uploadFolder, previewFiles } from '@/api/component'
  import { movefileTo, copyFileTo, renameFile } from '@/api/component'
  import { getTaskFiles, downloadtaskFile, deleteTaskFile, editFileInfo } from '@/api/pro-design-link'
  import { libraryList, subLibraryList } from "@/api/library"
  import service from '@/utils/request'
  import maniFile from '@/views/fileManager/maniFile'
  import SparkMD5 from 'spark-md5'
  import { hasMd5, mergeFile, uploadFiles } from '@/api/componentFiles'
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
    components: {
      maniFile
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
          // codeName: null
        },
        fileUpInfo: {
          secretClass: null,
          type: null,
          productNo: null,
          fileNo: null
          // codeName: null
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
        uploadFolderDialog: false,
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
        upFolderLoading: false,
        listQuery: {
          page: 1,
          limit: 10,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id',
          deviceName: undefined
        },
        sortable: null,
        oldList: [],
        newList: [],
        fileRenameRules: {
          name: [{ required: true, message: '请输入文件名！', trigger: 'blur' }]
        },
        downloadLoading: false,
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
        fileTreeList: [],
        md5Loading: false,
        started: false,
        autoStart: false,
        fileInfo: [],
        folderInfo: [],
        files: [],
        folderClearData: [],        //文件夹需要清空的内容数组
        fileClearData: [],          //文件需要清空的内容数组
        fileAll: [],
        searchQuery: '',
        CheckedComps: [],
        target: '',
        token: '',
        folderFileInfo: [],
        fileInfoList: [],
        fileCompleteLength: 0,
        folderfileCompleteLength: 0,
        stopResolveMD5: false,
        hiddenClose: false,
        libOptions: [],
        libProps: {
          label: 'type',
          value: 'id',
          children: 'children'
        },
        selectedLib: null
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
      processResponse() {
        console.log(arguments, 'processResponse')
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
        // console.log(this.breadcrumbList)

        if(this.componentId){
          this.getList();
        } else {
          this.listLoading = false
        }
        this.autoStart = false; //取消自动上传
      },
      getList() {
        this.listLoading = true
        getTaskFiles(this.componentId,this.parentNodeId).then((res) => {
          this.list = res.data.data
          this.listLoading = false
          // this.parentNodeId = ''
          // (this.parentNodeId)
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
      loadListFile(row) {
        if(row.folder){
          this.parentNodeId = row.id
          this.listLoading = true
          getCompFiles(this.componentId,this.parentNodeId).then((res) => {
            this.listLoading = false
            this.list = res.data.data
            this.breadcrumbList.push({
              name: row.name,
              componentId: this.componentId,
              parentNodeId: row.id,
              folder: true
            })

          }).catch(() => {
            this.listLoading = false
            this.$notify({
              title: '失败',
              message: '加载出错！',
              type: 'error',
              duration: 2000
            })
          })
        } else {
          return
        }
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
        this.hiddenClose = true
        this.md5Loading = true
        $('.manage-uploader .uploader-btn').css('display','none')
        this.fileCompleteLength += fileAdded.length
        let chunkSize = this.$refs.uploader.uploader.opts.chunkSize
        let completeFlag = 0
        let that = this
        for(var i = 0; i < fileAdded.length; i++) {
          let fileA = fileAdded[i]
          this.resolveMd5(fileA, chunkSize).then(function (result) {
            console.log(result)
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
              console.log(currentChunk)
              if (currentChunk < chunks) {
                let a = 'deal with' + currentChunk + '剩余' + (chunks - currentChunk)
                console.log(a)
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
        /*axios.post('http://192.168.31.13:8080/files/chunks/merge', datapost, {
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          }
        })*/
        mergeFile(datapost).then(() => {
        }).catch(() => {
          this.$notify({

          })
        })
      },
      // 上传文件时 fileSuccess 第一个参数为根文件， 第二个参数为上传的文件
      fileSuccess () {
        // console.log('fileSuccess', arguments)
        // this.fileMd5HeadTailTime(arguments[1].file, this.$refs.uploader.uploader.opts.chunkSize)
        // this.mergeFile(arguments[1].uniqueIdentifier, arguments[1].chunks.length, arguments[1].size, arguments[1].name, arguments[1].relativePath)
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
              sublibraryId: this.fileUpInfo.subLibraryId
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
      complete () {
      },
      uploadFile() {
        this.listLoading = true
        this.uploading = true
        this.upFileLoading = true
        let formData = new FormData()
        formData.append('parentnodeid', this.parentNodeId)
        this.fileAll = this.$refs.uploader.uploader.files
        for (var i = 0; i < this.fileAll.length; i++) {
          //判断数组里是文件夹还是文件
          formData.append('files', this.fileAll[i].file)
        }
        saveFiles(this.componentId, formData).then((res) => {
          this.uploading = false
          this.upFileLoading = false
          this.$refs.uploader.uploader.cancel()
          this.getList()
          this.listLoading = false
          this.uploadDialog = false
        }).catch((error) => {
          this.listLoading = false
          this.uploading = false
          this.upFileLoading = false
          this.$notify({
            title: '失败',
            message: '上传失败',
            type: 'error',
            duration: 2000
          })
        })
      },
      deleteFile(row) {
        this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          deleteTaskFile(row.id).then((res) => {
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
      switchFolder(row,index){
        // console.log(this.breadcrumbList)
        if(row.folder){
          this.listLoading = true
          this.parentNodeId = row.parentNodeId
          getCompFiles(this.componentId,this.parentNodeId).then((res) => {
            this.listLoading = false
            this.list = res.data.data
            this.breadcrumbList.splice(index+1, this.breadcrumbList.length-index-1)
          }).catch(() => {
            this.listLoading = false
          })
        } else {
          return
        }
      },
      exportFile(row) {
        let url = service.defaults.baseURL + '/subtaskFiles/' + row.id + '/user/' + this.userId + '/export'
        window.open(url)
      },
      handleMove(row) {
        this.maniFileDialog = true
        this.maniFileLoading = true
        /*this.$nextTick(() => {
          this.resetManiFile()
        })*/
        getCompFiles(this.componentId, '').then((res) => {
          this.maniFileLoading = false
          this.$refs.maniFile.list = res.data.data
          this.resetManiFile()
        }).catch(() => {
          this.maniFileLoading = false
          this.maniFileDialog = false
          this.$notify({
            title: '失败',
            message: '加载出错！',
            type: 'error',
            duration: 2000
          })
        })
        this.selectFileId = row.id
        this.maniType = 'move'
      },
      handleCopy(row) {
        this.maniFileDialog = true
        this.maniFileLoading = true
        getCompFiles(this.componentId, '').then((res) => {
          this.maniFileLoading = false
          this.$refs.maniFile.list = res.data.data
          this.resetManiFile()
        }).catch(() => {
          this.maniFileLoading = false
          this.maniFileDialog = false
          this.$notify({
            title: '失败',
            message: '加载出错！',
            type: 'error',
            duration: 2000
          })
        })
        this.selectFileId = row.id
        this.maniType = 'copy'
      },
      resetManiFile() {
        this.$refs.maniFile.breadcrumbList = []
        this.$refs.maniFile.projectId = this.$store.getters.projectId
        this.$refs.maniFile.componentId = this.selectCompId
        this.$refs.maniFile.compName = this.selectCompName
        this.$refs.maniFile.targetFolderId = this.componentId
        this.$refs.maniFile.targetComponentId = this.componentId
        this.$refs.maniFile.breadcrumbList.push({
          name: this.selectCompName,
          componentId: this.selectCompId,
          parentNodeId: '',
          folder: true
        })

      },
      handleRenameFile(row) {
        this.renameDialog = true
        this.fileRename = {
          name: row.name
        }
        this.selectFileId = row.id
        this.$nextTick(() => {
          this.$refs['fileRenameForm'].clearValidate()
        })

      },
      renameFile() {
        this.$refs['fileRenameForm'].validate((valid) => {
          if (valid) {
            let nameData = {
              'name': this.fileRename.name
            }
            var qs = require('qs');
            let datapost = qs.stringify(nameData)
            renameFile(this.selectFileId, datapost).then(() => {
              this.fileRename.name = ''
              this.renameDialog = false
              this.$notify({
                title: '成功',
                message: '文件重命名成功！',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch((error) => {
              this.fileRename.name = ''
              this.errorMessage = '重命名失败！'
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
      maniFile() {
        if(this.$refs.maniFile.targetComponentId === '') {
          this.$message({
            type: 'warning',
            message: '请先选择目标组件！'
          })
          return
        }
        let data = {
          'targetNodeId': this.$refs.maniFile.targetFolderId,
          'targetComponentId': this.$refs.maniFile.targetComponentId
        }
        var qs = require('qs');
        let datapost = qs.stringify(data)
        // 移动文件
        if(this.maniType == 'move') {
          // this.$refs.maniFile.moveFile()
          movefileTo(this.$refs.maniFile.selectFileId, this.$refs.maniFile.targetFolderId, datapost).then(() => {
            this.maniFileDialog = false
            this.$notify({
              title: '成功',
              message: '文件移动成功！',
              type: 'success',
              duration: 2000
            })
            this.getList()
          }).catch(() => {
            // this.resetManiFile()
            // this.$refs.maniFile.initData()
            this.maniFileDialog = false
            this.$notify({
              title: '失败',
              message: '文件移动失败！',
              type: 'error',
              duration: 2000
            })
          })
        } else if(this.maniType == 'copy') {
          // 复制文件
          // this.$refs.maniFile.initData()
          copyFileTo(this.$refs.maniFile.selectFileId, this.$refs.maniFile.targetFolderId, datapost).then(() => {
            // this.resetManiFile()
            this.maniFileDialog = false
            this.$notify({
              title: '成功',
              message: '文件移动成功！',
              type: 'success',
              duration: 2000
            })
            this.getList()
            // this.$refs.maniFile.getList()
          }).catch(() => {
            // this.resetManiFile()
            // this.$refs.maniFile.initData()
            this.maniFileDialog = false
            this.$notify({
              title: '失败',
              message: '文件复制失败！',
              type: 'error',
              duration: 2000
            })
          })
        }
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
        editFileInfo(this.selectFileId, datapost).then((res) => {
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

      // 查询所有文件库
      getLib() {
        if(this.libOptions.length === 0) {
          libraryList().then((res) => {
            if(res.data.code === 0) {
              let resData = res.data.data
              this.libOptions = []
              resData.forEach((item) => {
                this.libOptions.push({
                  label: item.type,
                  value: item.id,
                  children: []
                })
              })
            }
          })
        }
      },

      // 选择一级库
      handleItemChange(val) {
        let libId = val[0]
        subLibraryList(libId).then((res) => {
          for(let i = 0; i < this.libOptions.length; i++) {
            if(libId === this.libOptions[i].value) {
              if(this.libOptions[i].children.length == 0) {
                res.data.data.forEach((item) => {
                  this.libOptions[i].children.push({
                    label: item.type,
                    value: item.id
                  })
                })
                break
              }
            }
          }
        })
      },
      onSubLibChange(val) {
        this.fileUpInfo.subLibraryId = val[1]
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
      folderFileLength() {
        return this.folderFileInfo.length
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
          let datapost = JSON.stringify(this.fileInfoList)
          this.statusText.success = '正在合并文件'
          uploadFiles(this.componentId, this.projectId, datapost).then((res) => {
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
