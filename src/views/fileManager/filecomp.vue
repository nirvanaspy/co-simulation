<template>
  <div class="fileComp" v-loading="viewLoading">
    <div class="operationContainer" style="height: 40px;border-bottom:1px solid #ebeef5" v-if="forUse !== 'preview'">
      <div style="float: left;padding-left: 10px;">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(item,index) in breadcrumbList" :key="index"><span style="cursor: pointer;color:rgb(0, 171, 235);" @click="switchFolder(item,index)">{{item.name}}</span></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div style="float: right;color:rgb(0, 171, 235);cursor: pointer;padding-right: 20px;">
        <span @click="handleuploadFile" v-if="showUploadFlag">
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
      <el-table-column label="文件名" min-width="100">
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
            <span v-if="scope.row.newFolder">
              <el-input @keyup.enter.native="newFoler"
                        ref="newFolderInput"
                        autofocus="autofocus"
                        v-model="newFolderName"
                        placeholder="按enter确定"
                        style="width: 70%;display: inline-block;position: relative;top:-2px;">
              </el-input>
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="种类" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.folder !== true && !scope.row.newFolder">
            {{scope.row.files.postfix}}
          </span>
          <span v-if="scope.row.folder == true && !scope.row.newFolder">
            文件夹
          </span>
        </template>
      </el-table-column>
      <el-table-column width="100" :label="$t('table.compSize')">
        <template slot-scope="scope">
          <span v-if="scope.row.folder !== true">{{computedSize(scope.row.files.fileSize)}}</span>
          <span v-if="scope.row.folder === true&&scope.row.name">--</span>
          <span v-if="scope.row.newFolder" style="cursor: pointer;" @click="cancelNewFolder">
            <svg-icon icon-class="cancel"></svg-icon>
          </span>
        </template>
      </el-table-column>
      <el-table-column width="100" label="密级">
        <template slot-scope="scope">
          <span>{{computedSecret(scope.row.secretClass)}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" label="版本">
        <template slot-scope="scope">
          <span>{{scope.row.version}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" label="产品型号">
        <template slot-scope="scope">
          <span>{{scope.row.productNo}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" label="文件图号">
        <template slot-scope="scope">
          <span>{{scope.row.fileNo}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" label="文件类型">
        <template slot-scope="scope">
          <span>{{typeMap[scope.row.type]}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" label="所属库">
        <template slot-scope="scope">
          <span :class="{warningText: computeSublibName(scope.row.subDepotSet).length > 1}" v-for="item in computeSublibName(scope.row.subDepotSet)" style="display: block;">{{item}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" label="创建时间">
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
                <span style="display:inline-block;padding:0 10px;" v-loading="scope.row.loading" @click="previewFile(scope.row)">预览</span>
              </el-dropdown-item>
            </el-dropdown-menu>
            <el-dropdown-menu slot="dropdown" v-else>
              <el-dropdown-item :disabled="computeBtnDisable(scope.row, 'delete')">
                <span style="display:inline-block;padding:0 10px;" @click="deleteFile(scope.row)">删除</span>
              </el-dropdown-item>
              <el-dropdown-item divided :disabled="computeBtnDisable(scope.row, 'download')">
                <span style="display:inline-block;padding:0 10px;" @click="exportFile(scope.row)">下载</span>
              </el-dropdown-item>
              <el-dropdown-item divided :disabled="computeBtnDisable(scope.row, 'modifyInfo')">
                <span style="display:inline-block;padding:0 10px;" @click="handleEditInfo(scope.row)">修改文件信息</span>
              </el-dropdown-item>
              <el-dropdown-item divided :disabled="computeBtnDisable(scope.row, 'edit')">
                <span style="display:inline-block;padding:0 10px;" @click="handleEditFile(scope.row, 'edit')">修改文件</span>
              </el-dropdown-item>
              <el-dropdown-item divided :disabled="computeBtnDisable(scope.row, 'secondEdit')">
                <span style="display:inline-block;padding:0 10px;" @click="handleEditFile(scope.row, 'secondEdit')">二次修改文件</span>
              </el-dropdown-item>
              <el-dropdown-item divided :disabled="computeBtnDisable(scope.row, 'revoke')">
                <span style="display:inline-block;padding:0 10px;" @click="handleRevoke(scope.row)">撤销修改</span>
              </el-dropdown-item>
              <el-dropdown-item divided :disabled="computeBtnDisable(scope.row, 'changeVersion')">
                <span style="display:inline-block;padding:0 10px;" @click="handleChangeVersion(scope.row)">更换版本</span>
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
              v-for="item in computeSecretOptions"
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
        <!--二次修改文件的一些选项-->
        <el-form label-position="left" label-width="70px" v-if="uploadType === 'secondEdit'">
          <el-form-item label="版本号">
            <el-select v-model="fileModify.version" placeholder="请选择版本号" style="width: 100%">
              <el-option
                v-for="item in computeVersionOption"
                :key="item.value"
                :label="item.value"
                :value="item.value">
              </el-option>
            </el-select>
            <!--<el-input-number v-model="fileModify.versionNum" :step="1" :min="computeVersionNum" style="width: 49%"></el-input-number>-->
          </el-form-item>
        </el-form>
        <!--直接修改文件的一些选项-->
        <!--<el-form label-position="left" label-width="70px" v-if="uploadType === 'edit'">
          <el-form-item label="版本号">
            <el-select v-model="fileModify.ifToStart" placeholder="请选择版本号" style="width: 100%">
              <el-option
                v-for="item in ifToStartOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            &lt;!&ndash;<el-input-number v-model="fileModify.versionNum" :step="1" :min="computeVersionNum" style="width: 49%"></el-input-number>&ndash;&gt;
          </el-form-item>
        </el-form>-->
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
            <uploader-btn v-if="computedUploadShow">选择文件</uploader-btn>
            <!--<uploader-btn v-if="fileUpInfo.secretClass !== null && fileInfo.type !== null && fileUpInfo.productNo !== null && fileUpInfo.fileNo !== null && fileUpInfo.subLibraryId !== null && fileUpInfo.secretClass !== '' && fileInfo.type !== '' && fileUpInfo.productNo !== '' && fileUpInfo.fileNo !== '' && fileUpInfo.subLibraryId !== ''">选择文件</uploader-btn>-->
          </uploader-drop>
          <uploader-list ref="uploaderList"></uploader-list>
        </uploader>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="!hiddenClose" @click="uploadDialog = false">关 闭</el-button>
        <!--<el-button type="primary" @click="uploadFile" :loading="upFileLoading">确 定</el-button>-->
      </span>
    </el-dialog>
    <!--上传文件夹弹框-->
    <el-dialog
      class="uploadDialog"
      title="上传文件夹"
      :visible.sync="uploadFolderDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      append-to-body
      width="50%">
      <uploader :options="options"
                :autoStart="autoStart"
                :file-status-text="statusText"
                :started="started"
                ref="uploaderFolder"
                @files-added="folderAdded"
                @file-success="folderFileSuccess"
                v-loading="md5Loading"
                element-loading-text="正在校验文件夹身份，请勿关闭"
                class="manage-uploaderFolder">
        <uploader-unsupport></uploader-unsupport>
        <uploader-drop>
          <p>拖拽文件到此处或</p>
          <uploader-btn :directory="true">选择文件夹</uploader-btn>
        </uploader-drop>
        <uploader-list ref="uploaderFolderList"></uploader-list>
      </uploader>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="!hiddenClose" @click="uploadFolderDialog = false">关 闭</el-button>
        <!--<el-button type="primary" @click="upload_Folder" :loading="upFolderLoading">确 定</el-button>-->
      </span>
    </el-dialog>
    <!--文件夹移动、复制操作-->
    <el-dialog
      class="maniFileDialog"
      title="文件管理"
      :visible.sync="maniFileDialog"
      append-to-body
      v-loading="maniFileLoading"
      width="30%">
      <div>
        <maniFile ref="maniFile" :selectCompId="selectCompId" :selectCompName="selectCompName" :maniType="maniType" :selectFileId="selectFileId"></maniFile>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="maniFileDialog = false">取 消</el-button>
        <el-button type="primary" @click="maniFile">确 定</el-button>
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
              v-for="item in computeSecretOptions"
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="editInfoDialog = false">取 消</el-button>
        <el-button type="primary" @click="editFileInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改文件版本-->
    <el-dialog
      class="selectVersion"
      title="选择需要回退的版本"
      :visible.sync="versionSelectDialog"
      append-to-body
      width="30%">
      <el-form label-position="left" label-width="70px">
        <el-form-item label="选择版本">
          <el-select v-model="switchVersion" placeholder="请选择回退的版本" style="width: 100%">
            <el-option
              v-for="item in switchVersionOptions"
              :key="item.id"
              :label="item.version"
              :value="item.version">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="versionSelectDialog = false">取 消</el-button>
        <el-button type="primary" @click="changeVersion">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  /*eslint-disable*/
  import { compList, createComp, updateComp, copyComp, importComp, deleteComp, compSingle, saveFolder, getCompFiles, saveFiles, deleteCompFiles, uploadFolder, previewFiles } from '@/api/component'
  import { movefileTo, copyFileTo, renameFile } from '@/api/component'
  import { getTaskFiles, downloadtaskFile, deleteTaskFile, editFileInfo, modifyTaskFile, revokeTaskFileModify, taskFileVersionReplace, getTaskFileVersion } from '@/api/pro-design-link'
  import { libraryList, subLibraryList } from "@/api/library"
  import service from '@/utils/request'
  import maniFile from '@/views/fileManager/maniFile'
  import SparkMD5 from 'spark-md5'
  import { hasMd5, mergeFile, uploadFiles, modifyFiles } from '@/api/componentFiles'
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
          fileNo: null,
          subLibraryId: null
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
        typeMap: {
          0: '参数文件',
          1: '模型文件',
          2: '报告文件',
          3: '实验数据'
        },
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
          testChunks: true,
          singleFile: false // 单文件上传模式配置项
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
        selectedLib: null,
        showUploadFlag: false,
        uploadType: 'normal', // 上传文件状态：一般上传；直接修改上传；二次修改上传；
        selectedFileId: '', // 选中的文件id
        currentVersion: '',
        targetEditFile: {},
        fileModify: {
          version: '',
          versionNum: 1,
          ifToStart: null
        },
        ifToStartOptions: [
          {
            label: '提交到初始审核流程',
            value: true
          },
          {
            label: '提交到被驳回的审核流程',
            value: false
          }
        ],
        versionSelectDialog: false,
        switchVersion: '',
        switchVersionOptions: [],
        viewLoading: false
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
      refreshFileList() {
        getTaskFiles(this.componentId,this.parentNodeId).then((res) => {
          if(res.data.code ===0) {
            this.list = res.data.data
          }
        })
      },
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
          if(res.data.code ===0) {
            this.list = res.data.data
            this.listLoading = false
          }
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
      // 取消文件上传的操作
      /*fileClose() {
        this.$confirm('关闭后上传将被终止，确认关闭吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fileReader.abort()
          this.$refs.uploader.uploader.cancel()
          this.uploadDialog = false
          this.md5Loading = false
        })
      },
      folderClose() {
        this.$confirm('关闭后上传将被终止，确认关闭吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fileReader.abort()
          this.$refs.uploaderFolder.uploader.cancel()
          this.uploadFolderDialog = false
          this.md5Loading = false
        })
      },*/
      addFolder() {
        if(this.list.length === 0) {
          let newFolder = {
            name: '',
            newFolder: true,
            folder: true
          }
          this.list.splice(0, 0, newFolder);
        } else if(this.list[0].name != ''){
          let newFolder = {
            name: '',
            newFolder: true,
            folder: true
          }
          this.list.splice(0, 0, newFolder);
        }
      },
      newFoler() {
        if(this.newFolderName) {
          this.list.splice(0, 1);
          let formData = new FormData();
          formData.append('name',this.newFolderName)
          saveFolder(this.componentId, this.parentNodeId, formData).then(() => {
            this.newFolderName = ''
            this.getList()
          }).catch(() => {
            this.newFolderName = ''
            this.$notify({
              title: '失败',
              message: '新建失败',
              type: 'error',
              duration: 2000
            })
          })
        }
      },
      cancelNewFolder() {
        if(!this.list[0].id) {
          this.list.splice(0,1)  // 删除新建行
          this.newFolderName = '' // 清空输入框
        }
      },
      handleuploadFile() {
        this.uploadType = 'normal'
        console.log(this.fileUpInfo)
        this.uploadDialog = true
        this.hiddenClose = false
        this.$nextTick(() => {
          this.fileReader = new FileReader()
          this.$refs.uploader.uploader.cancel() //清空文件上传列表
          this.$refs.uploader.uploader.opts.target = this.target
          this.$refs.uploader.uploader.opts.headers.Authorization = this.token
          this.$refs.uploader.uploader.opts.singleFile = false
          $('.uploader-list ul').html('')
          this.fileCompleteLength = 0
          this.fileInfoList = []
          $('.manage-uploader .uploader-btn').css('display','inline-block')
        })
      },
      handleUploadFolder() {
        this.hiddenClose = false
        this.uploadFolderDialog = true
        this.$nextTick(() => {
          this.fileReader = new FileReader()
          this.$refs.uploaderFolder.uploader.cancel() //清空文件上传列表
          this.$refs.uploaderFolder.uploader.opts.target = this.target
          this.$refs.uploaderFolder.uploader.opts.headers.Authorization = this.token
          this.folderFileInfo = []
          $('.manage-uploaderFolder .uploader-btn').css('display','inline-block')
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
                if(that.uploadType == 'normal') {
                  infoList.ifDirectModify = false
                  infoList.ifBackToStart = true
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
            if(this.uploadType == 'normal') {
              infoList.ifDirectModify = false
              infoList.ifBackToStart = true
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
      folderAdded(fileAdded, fileList) {
        $('.manage-uploaderFolder .uploader-btn').css('display','none')
        let listLength = fileAdded.length
        this.folderfileCompleteLength = fileAdded.length
        // alert(listLength)
        this.md5Loading = true
        this.hiddenClose = true
        let chunkSize = this.$refs.uploaderFolder.uploader.opts.chunkSize
        let completeFlag = 0
        let that = this
        for(var i = 0; i < fileAdded.length; i++) {
          let fileA = fileAdded[i]
          this.resolveMd5(fileA, chunkSize).then(function (result) {
            fileA.md5 = result
            // fileA.status = 'computeMD5'
            fileA.uniqueIdentifier = result
            hasMd5(fileA.md5).then((res) => {
              if (res.data.data.id) {
                completeFlag++
                let infoList = {
                  fileId: res.data.data.id,
                  MD5: fileA.md5,
                  name: fileA.name,
                  relativePath: '/' + fileA.relativePath
                }
                that.listLoading = false
                that.folderFileInfo.push(infoList)
                that.$refs.uploaderFolder.uploader.removeFile(fileA)
                console.log(fileAdded.length);
                if(completeFlag === listLength) {
                  that.md5Loading = false
                  that.$refs.uploaderFolder.uploader.upload()
                }
              } else if (res.data.data === false) {
                completeFlag++
                if(completeFlag === listLength) {
                  that.md5Loading = false
                  console.log(fileAdded.length)
                  that.$refs.uploaderFolder.uploader.upload()
                }
              }
            })
          })
        }
      },
      folderFileSuccess() {
        // console.log(arguments)
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
          let infoList = {
            fileId: res.data.data.id,
            MD5: arguments[1].md5,
            name: arguments[1].name,
            relativePath: '/' + arguments[1].relativePath
          }
          this.folderFileInfo.push(infoList)
        })
      },
      folderComplete() {
        console.log(arguments)
        let datapost = JSON.stringify(this.folderFileInfo)
        let notiMes = '文件' + arguments[1].name + '上传成功！'
        uploadFiles(this.componentId, this.parentNodeId, datapost).then(() => {
          this.listLoading = false
          this.$notify({
            title: '成功',
            message: notiMes,
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
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
      upload_Folder(){
        this.listLoading = true
        this.uploading = true
        this.upFolderLoading = true
        let formData = new FormData()
        formData.append('parentnodeid', this.parentNodeId)
        this.fileAll = this.$refs.uploaderFolder.uploader.files
        for (var i = 0; i < this.fileAll.length; i++) {
          //判断数组里是文件夹还是文件
          formData.append('files', this.fileAll[i].file)
        }
        uploadFolder(this.componentId, formData).then(() => {
          this.$refs.uploaderFolder.uploader.cancel()
          this.upFolderLoading = false
          this.getList()
          this.listLoading = false
          this.uploading = false
          this.uploadFolderDialog = false
        }).catch((error) => {
          this.listLoading = false
          this.uploading = false
          this.upFolderLoading = false
          this.uploadFolderDialog = false
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
        this.viewLoading = true
        previewFiles(row.id).then((res) => {
          if(res.data.code === 0) {
            if(res.data.data.fileType === 'picture') {
              /*this.$router.push({
                path: '/preview',
                query: {
                  id: res.data.data.pathId,
                  type: res.data.data.fileType
                }
              })*/
              const {href} = this.$router.resolve({ path: '/preview',query: {id: res.data.data.pathId, type: res.data.data.fileType}})
              window.open(href, '_blank')
            }
            if(res.data.data.fileType === 'office') {
              // let href = 'http://192.168.31.69:8080/preview/viewer/document/' + res.data.data.pathId
              let href = service.defaults.baseURL + '/preview/viewer/document/' + res.data.data.pathId
              window.open(href, '_blank')
            }
          } else {
            this.$notify({
              title: '失败',
              message: res.data.msg,
              type: 'error',
              duration: 2000
            })
          }
          this.viewLoading = false
        }).catch(() => {
          this.viewLoading = false
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
          'fileNo': this.fileEditInfo.fileNo,
          'sublibraryId': this.fileUpInfo.subLibraryId
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
                if(item.type !== '参数库') {
                  this.libOptions.push({
                    label: item.type,
                    value: item.id,
                    children: []
                  })
                }
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
      },
      handleEditFile(row, editType) {
        this.selectedFileId = row.id
        this.uploadType = editType
        this.currentVersion = row.version
        this.targetEditFile = row
        this.fileModify.version = ''
        this.uploadDialog = true
        this.hiddenClose = false
        this.$nextTick(() => {
          this.fileReader = new FileReader()
          this.$refs.uploader.uploader.cancel() //清空文件上传列表
          this.$refs.uploader.uploader.opts.target = this.target
          this.$refs.uploader.uploader.opts.headers.Authorization = this.token
          this.$refs.uploader.uploader.opts.singleFile = true
          $('.uploader-list ul').html('')
          this.fileCompleteLength = 0
          this.fileInfoList = []
          $('.manage-uploader .uploader-btn').css('display','inline-block')
        })
      },
      handleRevoke(row) {
        this.$confirm('确认撤销上次的修改吗吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          revokeTaskFileModify(row.id).then((res) => {
            if(res.data.code === 0) {
              this.getList()
              this.$notify({
                title: '成功',
                message: '撤销',
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
            message: '已取消撤销操作'
          })
        })
      },
      handleChangeVersion(row) {
        this.selectFileId = row.id
        this.switchVersion = ''
        this.currentVersion = row.version
        getTaskFileVersion(row.id).then((res) => {
          if(res.data.code === 0) {
            this.switchVersionOptions = res.data.data
            this.versionSelectDialog = true
          }
        })
      },
      changeVersion() {
        let data = {
          version: this.switchVersion
        }
        let qs = require('qs')
        let dataPost = qs.stringify(data)
        taskFileVersionReplace(this.selectFileId, dataPost).then((res) => {
          if(res.data.code === 0) {
            this.getList()
            this.$notify({
              title: '成功',
              message: '版本更新成功',
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
        }).catch(() => {
          this.$notify({
            title: '失败',
            message: '删除失败',
            type: 'error',
            duration: 2000
          })
        })
      }
    },
    computed: {
      classifyIcon () {
        return function (row) {
          let iconType = ''
          if(row.folder == true) {
            iconType = 'folder'
          } else if(row.files.type === 'png' || row.files.type === 'jpg' || row.files.type === 'gif'){
            iconType = 'image'
          } else if(row.files.type === 'rar' || row.files.type === 'zip') {
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
      computeSecretOptions() {
        let options = this.secretClassOptions
        let proSecret = this.proClass
        if(this.proClass !== undefined && typeof(proSecret) === 'number') {
          return options.filter(function (item) {
            return item.value <= proSecret;
          })
        } else {
          return options
        }
      },
      fileInfoListLength() {
        return this.fileInfoList.length
      },
      folderFileLength() {
        return this.folderFileInfo.length
      },
      computeSublibName() {
        return function (arr) {
          let sublibName = []
          arr.forEach((item) => {
            sublibName.push(item.type)
          })
          return sublibName
        }
      },
      computeBtnDisable() {
        return function (row, opType) {
          let subState = row.subtask.state
          let subApprove = row.subtask.ifApprove
          let subReject = row.subtask.ifReject
          // 文件删除按钮
          // 修改文件信息
          if(opType === 'delete' || opType === 'modifyInfo') {
            if(subState === 1 || (subState === 7 && subApprove !== true) || subState === 9) {
              return false
            } else {
              return true
            }
          }
          // 文件直接修改按钮
          if(opType === 'edit') {
            if(subState === 7 && subReject === true) {
              return false
            } else {
              return true
            }
          }
          // 文件二次修改按钮
          if(opType === 'secondEdit') {
            if(subState === 9) {
              return false
            } else {
              return true
            }
          }
          // 撤销修改按钮
          if(opType === 'revoke') {
            if((subState === 7 && subReject === true) || subState === 9) {
              return false
            } else {
              return true
            }
          }
          // 选择版本
          if(opType === 'changeVersion') {
            if((subState === 7 && subReject === true) || subState === 9) {
              return false
            } else {
              return true
            }
          }
        }
      },
      // 计算版本号
      computeVersionOption() {
        if(this.uploadType === 'secondEdit') {
          let optionComputed = []
          if(this.currentVersion.length > 0) {
            let versionState = this.currentVersion.substring(0, 1)
            let versionNum
            if(this.targetEditFile.subtask.ifApprove === true) {
              versionNum = parseInt(this.currentVersion.substring(1, this.currentVersion.length)) + 1
              if(versionState === 'M') {
                optionComputed = [{value: 'M' + versionNum},{value: 'C1'}]
              }
              if(versionState === 'C') {
                optionComputed = [{value: 'C' + versionNum},{value: 'S1'}]
              }
              if(versionState === 'S') {
                optionComputed = [{value: 'S' + versionNum},{value: 'D1'}]
              }
              if(versionState === 'D') {
                optionComputed = [{value: 'D' + versionNum}]
              }
            } else {
              versionNum = parseInt(this.currentVersion.substring(1, this.currentVersion.length))
              if(versionState === 'M') {
                optionComputed = [{value: 'M' + versionNum}]
              }
              if(versionState === 'C') {
                optionComputed = [{value: 'C' + versionNum}]
              }
              if(versionState === 'S') {
                optionComputed = [{value: 'S' + versionNum}]
              }
              if(versionState === 'D') {
                optionComputed = [{value: 'D' + versionNum}]
              }
            }
            return optionComputed
          }
        }
      },
      computedUploadShow() {
        if(this.uploadType === 'normal') { // 普通模式下用户必填参数 密级、类型、产品型号、文件图号、目标库
          if(this.fileUpInfo.secretClass !== null && this.fileInfo.type !== null && this.fileUpInfo.productNo !== null && this.fileUpInfo.fileNo !== null && this.fileUpInfo.subLibraryId !== null &&
            this.fileUpInfo.secretClass !== '' && this.fileInfo.type !== '' && this.fileUpInfo.productNo !== '' && this.fileUpInfo.fileNo !== '' && this.fileUpInfo.subLibraryId !== '')
          {
            return true
          }
        }
        if(this.uploadType === 'secondEdit') { // 二次修改模式下用户必填参数 密级、类型、产品型号、文件图号、目标库、新版本
          if(this.fileUpInfo.secretClass !== null && this.fileInfo.type !== null && this.fileUpInfo.productNo !== null && this.fileUpInfo.fileNo !== null && this.fileUpInfo.subLibraryId !== null && this.fileModify.version !== null &&
            this.fileUpInfo.secretClass !== '' && this.fileInfo.type !== '' && this.fileUpInfo.productNo !== '' && this.fileUpInfo.fileNo !== '' && this.fileUpInfo.subLibraryId !== '' && this.fileModify.version !== '')
          {
            return true
          }
        }
        if(this.uploadType === 'edit') { // 直接修改模式下用户必填参数 密级、类型、产品型号、文件图号、目标库、新版本
          if(this.fileUpInfo.secretClass !== null && this.fileInfo.type !== null && this.fileUpInfo.productNo !== null && this.fileUpInfo.fileNo !== null && this.fileUpInfo.subLibraryId !== null &&
            this.fileUpInfo.secretClass !== '' && this.fileInfo.type !== '' && this.fileUpInfo.productNo !== '' && this.fileUpInfo.fileNo !== '' && this.fileUpInfo.subLibraryId !== '' )
          {
            return true
          }
        }
      }
      /*computeVersionNum() {
        if(this.uploadType === 'secondEdit') {
          if(this.currentVersion.length > 0) {
            let versionNum = this.currentVersion.substring(1, this.currentVersion.length)
            if(this.fileModify.version === this.currentVersion.substring(0, 1)) {
              return parseInt(versionNum) + 1
            } else {
              // return parseInt(versionNum)
              return 1
            }
          }
        }
      }*/
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

          // 普通上传
          if(this.uploadType === 'normal') {
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
                  message: res.data.msg,
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
          } else {
            // 二次修改上传
            let postData
            if(this.uploadType === 'secondEdit') {
              this.fileInfoList.forEach((item) => {
                item.ifDirectModify = false
                item.ifBackToStart = true
                item.version = this.fileModify.version
              })
              postData = JSON.stringify(this.fileInfoList[0])

            } else if(this.uploadType === 'edit') {
              this.fileInfoList.forEach((item) => {
                item.ifDirectModify = true
                item.ifBackToStart = true
              })
              postData = JSON.stringify(this.fileInfoList[0])
            }
            modifyFiles(this.selectedFileId, this.projectId, postData).then((res) => {
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
                  message: res.data.msg,
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

        }
      },
      folderFileLength(newValue, oldValue) {
        if(this.folderfileCompleteLength === this.folderFileInfo.length && this.folderFileInfo.length !== 0) {
          let datapost = JSON.stringify(this.folderFileInfo)
          this.statusText.success = '正在合并文件'
          uploadFiles(this.componentId, this.projectId, datapost).then(() => {
            this.listLoading = false
            this.hiddenClose = false
            this.$notify({
              title: '成功',
              message: '上传成功',
              type: 'success',
              duration: 2000
            })
            this.statusText.success = '文件合并成功'
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
      }
    }
  }
</script>

<style scoped>
  .warningText {
    color: #e6a23c;
  }
</style>
