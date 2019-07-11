<template>
  <div class="fileComp">
    <el-tabs type="border-card">
      <el-tab-pane label="已通过">
        <el-table :key='tableKey' :data="listApproved" v-loading="listLoading" element-loading-text="正在加载库文件" fit
                  highlight-current-row
                  style="width: 100%"
                  class="fileList"
        >
          <!--<el-table-column
            type="selection"
            :selectable="fileAuditSelection"
            width="55">
          </el-table-column>-->
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
          <el-table-column width="140" label="创建时间">
            <template slot-scope="scope">
              <span>{{scope.row.createTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="审核状态" width="100"
                           align="center"
                           :filters="filiterStateList"
                           :filter-method="filterState"
                           prop="state"
          >
            <template slot-scope="scope">
              <span :class="computeStateClass(scope.row)">
                {{computeAuditState(scope.row)}}
              </span>
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
                  <!--<el-dropdown-item>
                    <span style="display:inline-block;padding:0 10px;" @click="deleteFile(scope.row)">删除</span>
                  </el-dropdown-item>-->
                  <el-dropdown-item>
                    <span style="display:inline-block;padding:0 10px;" @click="exportFile(scope.row)">下载</span>
                  </el-dropdown-item>
                  <el-dropdown-item divided>
                    <span style="display:inline-block;padding:0 10px;" @click="checkFileVersion(scope.row)">查看历史版本</span>
                  </el-dropdown-item>
                  <!--<el-dropdown-item divided>
                    <span style="display:inline-block;padding:0 10px;" @click="handleEditInfo(scope.row)">修改文件信息</span>
                  </el-dropdown-item>-->
                  <!--<el-dropdown-item divided>
                    <span style="display:inline-block;padding:0 10px;" @click="handleEditFile(scope.row, 'edit')">修改文件</span>
                  </el-dropdown-item>-->
                  <!--<el-dropdown-item divided>
                    <span style="display:inline-block;padding:0 10px;" @click="handleEditFile(scope.row, 'secondEdit')">二次修改文件</span>
                  </el-dropdown-item>-->
                  <el-dropdown-item divided>
                    <span style="display:inline-block;padding:0 10px;" @click="applyToEdit(scope.row)">申请二次修改</span>
                  </el-dropdown-item>
                  <!--<el-dropdown-item divided>
                    <span style="display:inline-block;padding:0 10px;" @click="handleRevoke(scope.row)">撤销</span>
                  </el-dropdown-item>
                  <el-dropdown-item divided>
                    <span style="display:inline-block;padding:0 10px;" @click="handleRevokeSecond(scope.row)">更换版本</span>
                  </el-dropdown-item>-->
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="尚未通过">
        <div class="operationContainer" style="height: 40px;border-bottom:1px solid #ebeef5" v-if="forUse !== 'preview'">
          <div style="position: absolute;top: 10px;left: 16px">
            <el-button type="primary" size="mini" @click="handleCommit">提交审核</el-button>
          </div>
          <div style="float: right;color:rgb(0, 171, 235);cursor: pointer;padding-right: 20px;">
            <span @click="handleuploadFile">
              <svg-icon icon-class="upload1"></svg-icon>
              <span style="font-size: 14px;margin-left: 6px;">上传文件</span>
            </span>
          </div>
        </div>
        <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="正在加载库文件" fit
                  highlight-current-row
                  style="width: 100%"
                  class="fileList"
                  @selection-change="handleSelectionChange"
                  height="700px"
                  :row-key="getRowKey"
        >
          <el-table-column
            type="selection"
            :selectable="fileAuditSelection"
            :reserve-selection="true"
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
          <el-table-column width="140" label="创建时间">
            <template slot-scope="scope">
              <span>{{scope.row.createTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="审核状态" width="100"
                           align="center"
                           :filters="filiterStateList"
                           :filter-method="filterState"
                           prop="state"
          >
            <template slot-scope="scope">
          <span :class="computeStateClass(scope.row)">
            {{computeAuditState(scope.row)}}
          </span>
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
                  <el-dropdown-item divided :disabled="computeBtnDisable(scope.row, 'apply')">
                    <span style="display:inline-block;padding:0 10px;" @click="applyToEdit(scope.row)">申请二次修改</span>
                  </el-dropdown-item>
                  <el-dropdown-item divided :disabled="computeBtnDisable(scope.row, 'revoke')">
                    <span style="display:inline-block;padding:0 10px;" @click="handleRevoke(scope.row)">撤销修改</span>
                  </el-dropdown-item>
                  <el-dropdown-item divided :disabled="computeBtnDisable(scope.row, 'changeVersion')">
                    <span style="display:inline-block;padding:0 10px;" @click="handleRevokeSecond(scope.row)">更换版本</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
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
          <el-select v-model="fileUpInfo.secretClass" placeholder="请选择密级" style="width: 100%" @focus="checkUserInfo">
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
      </el-form>

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
        </el-form-item>
      </el-form>
      <!--直接修改文件的一些选项-->
      <el-form label-position="left" label-width="70px" v-if="uploadType === 'edit'">
        <el-form-item label="审批流程">
          <!--<el-input v-model="fileUpInfo.secretClass"></el-input>-->
          <el-select v-model="fileModify.ifToStart" placeholder="请选择提交的目标审批流程" style="width: 100%">
            <el-option
              v-for="item in ifToStartOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <!--<el-switch-->
        <!--v-model="ifOnlyEditInfo"-->
        <!--active-text="仅修改文件信息"-->
        <!--inactive-text="按年付费">-->
      <!--</el-switch>-->
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
        </uploader-drop>
        <uploader-list ref="uploaderList"></uploader-list>
        <!--重复文件列表-->
        <div class="repeatFiles" v-if="repeatFiles.length > 0">
          <el-table :key='tableKey' :data="repeatFiles" max-height="300">
            <el-table-column label="重复文件列表">
              <template slot-scope="scope">
                <span style="color: #e6a23c;">{{scope.row.name}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </uploader>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="uploadType !== 'normal' && showOnlyEdit" @click="onlyModifyFileInfo">仅修改信息</el-button>
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
                <template slot-scope="scope">{{ scope.row.realName }}</template>
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
                <template slot-scope="scope">{{ scope.row.realName }}</template>
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
                <template slot-scope="scope">{{ scope.row.realName }}</template>
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
                <template slot-scope="scope">{{ scope.row.realName }}</template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div style="text-align: right" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="commitToAuditor" style="margin-top: 10px;" :loading="commitLoading">确定</el-button>
      </div>
    </el-dialog>
    <!--二次修改撤销选择版本-->
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
        <el-button type="primary" @click="revokeSecondEdit">确 定</el-button>
      </span>
    </el-dialog>
    <!--查看已通过文件版本-->
    <el-dialog class="maniFileDialog"
               title="文件信息修改"
               :visible.sync="historyFileDialog"
               width="60%"
               append-to-body>
      <el-table :data="historyFiles"
                v-loading="historyLoading"
                element-loading-text="正在加载文件历史版本"
                fit
                highlight-current-row
                style="width: 100%"
                class="fileList">
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
            <span>
              {{scope.row.files.postfix}}
            </span>
          </template>
        </el-table-column>
        <el-table-column width="100" :label="$t('table.compSize')">
          <template slot-scope="scope">
            <span>{{computedSize(scope.row.files.fileSize)}}</span>
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
        <el-table-column width="140" label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column width="140" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="exportFile(scope.row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  /*eslint-disable*/
  import {  previewFiles } from '@/api/component'
  import { movefileTo, copyFileTo, renameFile } from '@/api/component'
  import { findExistLibFiles } from '@/api/library'
  import { getSubLibFiles, uploadSubLibFiles, deleteSubLibFile, editSubLibFileInfo, setLibFileAuditors, applyForModify, modifySubLibFile, revokeModify, getFileHisVersion, versionReplace, getFailedFiles, getSubHisFiles, getSubFilesByApplicant } from '@/api/sublibFiles'
  import { allUser, getUserById } from '@/api/getUsers'
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
        userSecurity: null,
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
        listApproved: [],
        singleComp: null,
        total: null,
        listLoading: true,
        approveListLoading: true,
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
          chunkSize: 50* 1024 * 1024,
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
        repeatFiles: [],
        filiterStateList: [
          { text: '未提交', value: 'notCommit' },
          { text: '审核中', value: 'auditing' },
          { text: '审核通过', value: 'pass' },
          { text: '审核驳回', value: 'deny' }
        ],
        uploadType: 'normal', // 上传文件状态：一般上传；直接修改上传；二次修改上传；
        selectedFileId: '', // 选中的文件id
        versionOptions: [
          {value: 'M'},
          {value: 'C'},
          {value: 'S'},
          {value: 'D'},
        ],
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
        fileModify: {
          version: '',
          versionNum: 1,
          ifToStart: null
        },
        currentVersion: '',
        versionSelectDialog: false,
        switchVersion: '',
        switchVersionOptions: [],
        commitLoading: false,
        targetEditFile: {},
        historyFileDialog: false,
        historyLoading: true,
        historyFiles: [],
        typeMap: {
          0: '参数文件',
          1: '模型文件',
          2: '报告文件',
          3: '实验数据'
        },
        showOnlyEdit: false
      }
    },
    created() {
      this.ip = this.getCookie('ip')
      this.port= this.getCookie('port')
      this.userId = this.getCookie('userId')
      this.target = service.defaults.baseURL + '/files/chunks'
      this.token = 'Bearer' + this.$store.getters.token
      this.selectFileId = ''
      this.maniType = ''
      this.initData()
    },
    methods: {
      checkUserInfo() {
        if(this.userSecurity !== null) {
          return
        }
        getUserById(this.userId).then(res => {
          if(res.data.code === 0) {
            this.userSecurity = res.data.data.secretClass
          }
        })
      },
      refreshFileList() {
        getFailedFiles(this.componentId, this.userId).then((res) => {
          if(res.data.code === 0) {
            // let listA = res.data.data
            // getSubFilesByApplicant(this.componentId, this.userId).then((res) => {
            //   if(res.data.code === 0) {
            //     this.list = listA.concat(res.data.data)
            //   }
            // })
            this.list = res.data.data
          }
        })
      },
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
        getFailedFiles(this.componentId, this.userId).then((res) => {
          if(res.data.code === 0) {
            // let listA = res.data.data
            // getSubFilesByApplicant(this.componentId, this.userId).then((res) => {
            //   if(res.data.code === 0) {
            //     this.list = listA.concat(res.data.data)
            //     this.listLoading = false
            //   }
            // })
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
        getSubLibFiles(this.componentId, true).then((res) => {
          if(res.data.code === 0) {
            this.listApproved = res.data.data
            this.approveListLoading = false
          }
        }).catch(() => {
          this.approveListLoading = false
          this.$notify({
            title: '失败',
            message: '加载出错！',
            type: 'error',
            duration: 2000
          })
        })
      },
      handleuploadFile() {
        this.uploadType = 'normal'
        this.repeatFiles = []
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
      handleEditFile(row, editType) {
        this.repeatFiles = []
        this.selectedFileId = row.id
        this.uploadType = editType
        this.showOnlyEdit = true
        this.currentVersion = row.version
        this.targetEditFile = row
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

      // 检查要修改的文件是否和当前要上传的文件信息完全一致
      checkFileIfSame(fileInfo) {
        if (this.targetEditFile.name + '.' + this.targetEditFile.postfix !== fileInfo.name || this.targetEditFile.secretClass !== this.fileUpInfo.secretClass
          || this.targetEditFile.type !== this.fileUpInfo.type || this.targetEditFile.productNo !== this.fileUpInfo.productNo
          || this.targetEditFile.fileNo !== this.fileUpInfo.fileNo) {
          return false
        } else {
          return true
        }
      },

      // 上传文件的几个方法
      // 添加文件时触发
      checkMd5 (fileAdded, fileList) {
        this.showOnlyEdit = false
        // console.log(this.$refs.uploader.uploader.files)
        // 在普通的上传文件模式下
        // 在修改模式下，上传的新文件与目标修改文件文件信息不一致时
        // 需要对所选文件进行去重  >>>
        this.repeatFiles = []
        if(this.uploadType === 'normal' || (this.uploadType !== 'normal' && !this.checkFileIfSame(fileAdded[0]))) {
          // 防止用户上传文件名称相同的文件，在上传前就去除名称重复的文件
          /*this.repeatFiles = []
          for(let j = fileAdded.length - 1; j >= 0; j--) {
            for(let k = 0; k < this.list.length; k++) {
              if(fileAdded[j] !== undefined) {
                if(fileAdded[j].name === this.list[k].name + '.' + this.list[k].postfix) {
                  let fileRepeat = fileAdded[j]
                  this.repeatFiles.push(fileRepeat)
                  this.$refs.uploader.uploader.removeFile(fileRepeat)
                  // 中和文件被删除的-1
                  this.fileCompleteLength += 1
                  fileAdded.splice(j, 1);
                  continue;
                }
              }
            }
          }*/
          let beforeCheckFiles = []
          for(let i = 0; i < fileAdded.length; i++) {
            let fileItem = {
              secretClass: this.fileUpInfo.secretClass,
              type: this.fileUpInfo.type,
              productNo: this.fileUpInfo.productNo,
              fileNo: this.fileUpInfo.fileNo,
              name: fileAdded[i].name,
              relativePath: '/' + fileAdded[i].relativePath,
            }
            beforeCheckFiles.push(fileItem)
          }
          let fileInfoPost = JSON.stringify(beforeCheckFiles)
          findExistLibFiles(this.componentId, this.userId, fileInfoPost).then((res) => {
            if(res.data.code === 0) {
              this.repeatFiles = res.data.data
              for(let j = fileAdded.length - 1; j >= 0; j--) {
                for(let k = 0; k < this.repeatFiles.length; k++) {
                  if(fileAdded[j] !== undefined) {
                    if(fileAdded[j].name === this.repeatFiles[k].name + '.' + this.repeatFiles[k].postfix) {
                      let fileRepeat = fileAdded[j]
                      this.$refs.uploader.uploader.removeFile(fileRepeat)
                      // 中和文件被删除的-1
                      this.fileCompleteLength += 1
                      fileAdded.splice(j, 1)
                      continue
                    }
                  }
                }
              }
              if(this.repeatFiles.length > 0) {
                this.$message({
                  showClose: true,
                  message: '请注意，此次上传的文件中有' + this.repeatFiles.length + '个文件在库中已存在！',
                  type: 'warning',
                  //duration: 0
                });
              }
              // <<<去重的代码

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
            }
          })
        }
        // 修改模式下的文件去重
        else {
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
          if(res.data.code === 0) {
            if(res.data.data.fileType === 'picture') {
              const {href} = this.$router.resolve({ path: '/preview',query: {id: res.data.data.pathId, type: res.data.data.fileType}})
              window.open(href, '_blank')
            }
            if(res.data.data.fileType === 'office') {
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
        })
      },
      checkFileVersion(row) {
        this.historyLoading = true
        getSubHisFiles(row.id).then((res) => {
          if(res.data.code === 0) {
            this.historyFiles = res.data.data
            this.historyLoading = false
          }
        })
        this.historyFileDialog = true
      },
      exportFile(row) {
        let url = service.defaults.baseURL + '/sublibraryFiles/' + row.id + '/user/' + this.userId + '/export'
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
            message: '请先选择文件！',
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
        this.commitLoading = true
        setLibFileAuditors(this.selectedId, datapost).then((res) => {
          if(res.data.code === 0) {
            this.$notify({
              title: '成功',
              message: '设置成功',
              type: 'success',
              duration: 2000
            })
            this.commitDialog = false
            this.getList()
            this.selectedFiles = []
          } else {
            this.$notify({
              title: '失败',
              message: res.data.msg,
              type: 'error',
              duration: 2000
            })
          }
          this.commitLoading = false
        }).catch(() => {
          this.$notify({
            title: '失败',
            message: '提交失败',
            type: 'error',
            duration: 2000
          })
          this.commitLoading = false
        })
      },
      fileAuditSelection(row) {
        /*if (row.auditMode !== 0) {
          return 0
        } else {
          return 1
        }*/
        if (row.state === 0 || row.state === 8) {
          return 1
        } else {
          return 0
        }
      },
      getRowKey(row) {
        return row.id
      },
      // 根据文件审核状态进行筛选
      filterState(value, row) {
        if(value == 'notCommit') {
          return row.auditMode === 0 && row.state === 0
        }
        if(value == 'auditing') {
          return row.auditMode !== 0 && row.ifApprove === false && row.ifReject === false
        }
        if(value == 'pass') {
          return row.ifApprove === true
        }
        if(value == 'deny') {
          return row.ifReject === true
        }
      },
      // 申请二次修改
      applyToEdit(row) {
        this.$confirm('确认申请修改吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            userId: this.userId
          }
          let qs = require('qs')
          let dataPost = qs.stringify(data)
          applyForModify(row.id, dataPost).then((res) => {
            if(res.data.code === 0) {
              this.$notify({
                title: '成功',
                message: '申请成功！',
                type: 'success',
                duration: '2000'
              })
              this.getList()
            } else {
              this.$notify({
                title: '失败',
                message: res.data.msg,
                type: 'error',
                duration: '2000'
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

      // 撤销修改
      handleRevoke(row) {
        this.$confirm('确认撤销上次的修改吗吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          revokeModify(row.id).then((res) => {
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
      // 撤销二次修改
      handleRevokeSecond(row) {
        this.selectFileId = row.id
        this.switchVersion = ''
        this.currentVersion = row.version
        getFileHisVersion(row.id).then((res) => {
          if(res.data.code === 0) {
            this.switchVersionOptions = res.data.data
            this.versionSelectDialog = true
          }
        })
      },
      revokeSecondEdit() {
        let data = {
          // ifDirectModify: false,
          version: this.switchVersion
        }
        let qs = require('qs')
        let dataPost = qs.stringify(data)
        versionReplace(this.selectFileId, dataPost).then((res) => {
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
      },
      onlyModifyFileInfo() {
        this.$confirm('确认仅修改文件信息吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let infoData = {
            fileId: this.targetEditFile.files.id,
            MD5: this.targetEditFile.files.md5,
            name: this.targetEditFile.name,
            relativePath: '/' + this.targetEditFile.name + '.' + this.targetEditFile.postfix,
            secretClass: this.fileUpInfo.secretClass,
            type: this.fileUpInfo.type,
            productNo: this.fileUpInfo.productNo,
            fileNo: this.fileUpInfo.fileNo,
            sublibraryId: this.targetEditFile.subDepot.id,
          }
          if (this.uploadType === 'edit') {
            infoData.ifDirectModify = true // 直接修改：true， 二次修改：false
            infoData.ifBackToStart = this.fileModify.ifToStart
            infoData.version = ''
          }
          if (this.uploadType === 'secondEdit') {
            item.ifDirectModify = false // 直接修改：true， 二次修改：false
            item.ifBackToStart = true
            item.version = this.fileModify.version
          }
          let editData = JSON.stringify(infoData)
          modifySubLibFile(this.selectedFileId, editData).then((res) => {
            if(res.data.code === 0) {
              this.$notify({
                title: '成功',
                message: '文件信息修改并提交成功',
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
            this.uploadDialog = false
          }).catch(() => {
            this.$notify({
              title: '失败',
              message: '文件信息修改失败',
              type: 'error',
              duration: 2000
            })
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
        let userSecurity = this.userSecurity
        if(this.userSecurity !== null) {
          return options.filter(function (item) {
            return item.value <= userSecurity;
          })
        } else {
          return [{
            label: '公开',
            value: 0
          }]
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
      },
      computeAuditState() {
        return function (row) {
          if(row.auditMode === 0 && row.state === 0) {
            return '未提交'
          }
          if((row.auditMode !== 0 && row.ifApprove === false && row.ifReject === false && row.state !== 8) || row.state === 1) {
            return '审批中'
          }
          if(row.ifApprove === true && row.state === 6) {
            return '已通过'
          }
          if(row.ifReject === true && row.state === 6) {
            return '已驳回'
          }
          if(row.state === 7) {
            return '修改申请中'
          }
          if(row.state === 8) {
            return '二次修改中'
          }
          if(row.state === 9) {
            return '二次修改中'
          }
          if(row.state === 10) {
            return '二次修改审核中'
          }
        }
      },
      computeStateClass() {
        return function (row) {
          if(row.auditMode === 0 && row.state === 0) {
            return 'notCommit'
          }
          if(row.ifApprove === true) {
            return 'approve'
          }
          if(row.ifReject === true || row.state === 8) {
            return 'reject'
          }
        }
      },
      computeVersionOption() {
        if(this.uploadType === 'secondEdit') {
          let optionComputed = []
          if(this.currentVersion.length > 0) {
            let versionState = this.currentVersion.substring(0, 1)
            let versionNum
            if(this.targetEditFile.ifApprove === true) {
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
              if(this.targetEditFile.ifModifyApprove === true) {
                versionNum = versionNum + 1
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
            }
            return optionComputed
          }
        }
      },
      /*computeVersionNum() {
        if(this.uploadType === 'secondEdit') {
          if(this.currentVersion.length > 0) {
            let versionNum = this.currentVersion.substring(1, this.currentVersion.length)
            if(this.fileModify.version === this.currentVersion.substring(0, 1)) {
              return parseInt(versionNum) + 1
            } else {
              return parseInt(versionNum)
            }
          }
        }

      }*/
      computeBtnDisable() {
        return function (row, opType) {
          let subState = row.state
          let subApprove = row.ifApprove
          let subReject = row.ifReject
          // 文件删除按钮
          // 修改文件信息
          if (opType === 'delete' || opType === 'modifyInfo') {
            if ((subState === 0) && (row.auditMode === 0) || (subState === 6 && subApprove !== true) || subState === 8) {
              return false
            } else {
              return true
            }
            return false
          }
          // 文件直接修改按钮
          if (opType === 'edit') {
            if (subState === 6 && subReject === true) {
              return false
            } else {
              return true
            }
          }
          // 申请二次修改
          if (opType === 'apply') {
            if(subState === 6) {
              return false
            } else {
              return true
            }
          }
          // 文件二次修改按钮
          if (opType === 'secondEdit') {
            if (subState === 8) {
              return false
            } else {
              return true
            }
          }
          // 撤销修改按钮
          if (opType === 'revoke') {
            if ((subState === 6 && subReject === true) || subState === 8) {
              return false
            } else {
              return true
            }
          }
          // 选择版本
          if (opType === 'changeVersion') {
            if ((subState === 6 && subReject === true) || subState === 8) {
              return false
            } else {
              return true
            }
          }
        }
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

          // 普通上传
          if(this.uploadType === 'normal') {
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
          } else if(this.uploadType === 'secondEdit') {
            // 二次修改上传
            this.fileInfoList.forEach((item) => {
              item.ifDirectModify = false // 直接修改：true， 二次修改：false
              item.ifBackToStart = true
              item.version = this.fileModify.version
            })
            let editData = JSON.stringify(this.fileInfoList[0])
            modifySubLibFile(this.selectedFileId, editData).then((res) => {
              if(res.data.code === 0) {
                this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success',
                  duration: 2000
                })
                this.statusText.success = '文件修改成功'
              } else {
                this.$notify({
                  title: '成功',
                  message: res.data.msg,
                  type: 'error',
                  duration: 2000
                })
                this.statusText.success = '文件修改失败'
              }
              this.listLoading = false
              this.hiddenClose = false
              this.getList()
            }).catch(() => {
              this.listLoading = false
              this.hiddenClose = false
              this.$notify({
                title: '失败',
                message: '文件修改时出错',
                type: 'error',
                duration: 2000
              })
              this.statusText.success = '文件修改失败'
              this.getList()
            })
          } else if(this.uploadType === 'edit') {
            // 直接修改上传
            this.fileInfoList.forEach((item) => {
              item.ifDirectModify = true // 直接修改：true， 二次修改：false
              item.ifBackToStart = this.fileModify.ifToStart
              item.version = ''
            })
            let editData = JSON.stringify(this.fileInfoList[0])
            console.log(editData)
            modifySubLibFile(this.selectedFileId, editData).then((res) => {
              if(res.data.code === 0) {
                this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success',
                  duration: 2000
                })
                this.statusText.success = '文件修改成功'
              } else {
                this.$notify({
                  title: '成功',
                  message: res.data.msg,
                  type: 'error',
                  duration: 2000
                })
                this.statusText.success = '文件修改失败'
              }
              this.listLoading = false
              this.hiddenClose = false
              this.getList()
            }).catch(() => {
              this.listLoading = false
              this.hiddenClose = false
              this.$notify({
                title: '失败',
                message: '文件修改时出错',
                type: 'error',
                duration: 2000
              })
              this.statusText.success = '文件修改失败'
              this.getList()
            })
          }
        }
      }
    }
  }
</script>

<style scoped>
  .repeatFiles {
    border: 1px solid #eee;
    margin-top: 20px;
  }
  .notCommit {
    color: #909399;
  }
  .auditing {
    color: #409eff;
  }
  .pass {
    color: #67c23a;
  }
  .reject {
    color: #f56c6c;
  }
</style>
