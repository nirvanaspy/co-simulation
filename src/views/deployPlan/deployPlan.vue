<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <div v-show="isHistory" style="position: absolute;top: 88px;font-size: 12px;color: #ccc;">
        部署设计回收站
      </div>
      <el-input style="width: 200px;" class="filter-item" placeholder="名称" v-model="searchQuery">
      </el-input>
      <el-button class="filter-item" style="margin-left: 10px;float:right;" @click="handleCreate" type="success" icon="el-icon-edit" v-show="!isHistory">{{$t('table.add')}}</el-button>
      <el-button type="primary" @click="showHistory" style="float: right;" icon="el-icon-delete" v-show="!isHistory">
        回收站
      </el-button>
      <el-button type="primary" @click="showNow" style="float: right;" icon="el-icon-back" v-show="isHistory">
        返回
      </el-button>
    </div>
    <div style="width: 100%;">
      <el-table :key='tableKey' :data="listA" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                @expand-change="onExpand"
                :default-sort = "{prop: 'createTime', order: 'descending'}"
                style="width: 100%">
        <!--<el-table-column type="expand">
          <template slot-scope="props">
            <el-table
              border
              stripe highlight-current-row
              :data="props.row.baselines"
              style="padding: 0 0"
              :show-header="false"
            >
              <el-table-column width="48">
                <template slot-scope="scope">
                  <span><svg-icon icon-class="基线"></svg-icon></span>
                </template>
              </el-table-column>
              <el-table-column label="名称" align="left">
                <template slot-scope="scope">
                  <span>{{scope.row.name}}</span>
                </template>
              </el-table-column>
              <el-table-column label="名称" align="left">
                <template slot-scope="scope">
                  <span>{{scope.row.createTime}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" width="200" label="部署操作" v-if="!isHistory">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" v-if="!scope.row.deleted && scope.row.baseline" @click="checkNodeBaseLine(scope.row)">
                    查看
                  </el-button>
                  <router-link :to='{name:"deploy",params:{id:scope.row.id}}' v-if="!scope.row.deleted">
                    <el-button size="mini" type="success">部署</el-button>
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column align="center" :label="$t('table.actions')" width="240">
                <template slot-scope="scope">
                  <el-button class="deploy-action-btn" size="mini" type="warning" plain v-if="!scope.row.deleted" @click="handleMonitor(scope.row)">在线监控</el-button>
                  <el-dropdown trigger="click" v-if="!scope.row.deleted">
                    <span class="el-dropdown-link" v-if="!scope.row.virtual">
                      <el-button class="deploy-action-btn" type="primary" size="mini" plain>更多操作</el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <span style="display:inline-block;padding:0 10px;" @click="handleUpdate(scope.row)">编辑</span>
                      </el-dropdown-item>
                      <el-dropdown-item divided>
                        <span style="display:inline-block;padding:0 10px;" @click="handleCopy(scope.row)">复制</span>
                      </el-dropdown-item>
                      <el-dropdown-item divided>
                        <span style="display:inline-block;padding:0 10px;" @click="handleDelete(scope.row)">删除</span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-dropdown trigger="click" v-else>
                    <span class="el-dropdown-link">
                      <el-button type="success" plain>更多操作</el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <span style="display:inline-block;padding:0 10px;" @click="handleClean(scope.row)">清除</span>
                      </el-dropdown-item>
                      <el-dropdown-item divided>
                        <span style="display:inline-block;padding:0 10px;" @click="handleRestore(scope.row)">恢复</span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>-->
        <el-table-column align="left" :label="$t('table.deployPlanName')" min-width="140">
          <template slot-scope="scope">
            <svg-icon v-if="scope.row.baseline" icon-class="基线" style="font-size: 16px"></svg-icon>
            <svg-icon v-if="!scope.row.baseline" icon-class="部署设计" style="font-size: 16px"></svg-icon>
            <el-tooltip :content="computedDes(scope.row)" placement="right">
              <span v-if="!scope.row.deleted" class="link-type" @click="handleUpdate(scope.row)">{{scope.row.name}}</span>
              <span v-else>{{scope.row.name}}</span>
            </el-tooltip>
            <!--<div>{{scope.row.description}}</div>-->
          </template>
        </el-table-column>
        <el-table-column align="center" label="来源" min-width="100" :filters="sourceList" prop="source"
                         :filter-method="filterSource">
          <template slot-scope="scope">
            <span v-if="scope.row.source">{{scope.row.source.name}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" min-width="100" sortable prop="createTime">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="类型" width="100"
                         prop="baseline"
                         :filters="[{ text: '基线', value: true }, { text: '部署设计', value: false }]"
                         :filter-method="filterBaseline">
          <template slot-scope="scope">
          <span v-if="scope.row.baseline">
            基线
          </span>
          <span v-else>
            部署设计
          </span>
          </template>
        </el-table-column>
        <!--<el-table-column min-width="200" align="center" :label="$t('table.deployPlanDesc')">
          <template slot-scope="scope">
            <span>{{scope.row.description}}</span>
          </template>
        </el-table-column>-->
        <el-table-column align="center" width="200" label="部署操作" v-if="!isHistory">
          <template slot-scope="scope">
            <router-link :to='{name:"designNode",params:{id:scope.row.id, name: scope.row.name},query:{name: scope.row.name}}' v-if="!scope.row.deleted && !scope.row.baseline">
              <el-button size="mini" type="primary">
                设计
              </el-button>
            </router-link>
            <el-button size="mini" type="primary" v-if="!scope.row.deleted && scope.row.baseline" @click="checkNodeBaseLine(scope.row)">
              查看
            </el-button>
            <router-link :to='{name:"deploy",params:{id:scope.row.id}}' v-if="!scope.row.deleted">
              <el-button size="mini" type="success">部署</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.actions')" width="240">
          <template slot-scope="scope">
            <el-button class="deploy-action-btn" size="mini" type="success" plain v-if="!scope.row.deleted" @click="handleNewBaseline(scope.row)">新建基线</el-button>
            <el-button class="deploy-action-btn" size="mini" type="warning" plain v-if="!scope.row.deleted" @click="handleMonitor(scope.row)">在线监控</el-button>
            <el-dropdown trigger="click" v-if="!scope.row.deleted">
            <span class="el-dropdown-link" v-if="!scope.row.virtual">
              <el-button class="deploy-action-btn" type="primary" size="mini" plain>更多操作</el-button>
            </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <span style="display:inline-block;padding:0 10px;" @click="handleUpdate(scope.row)">编辑</span>
                </el-dropdown-item>
                <el-dropdown-item divided>
                  <span style="display:inline-block;padding:0 10px;" @click="handleCopy(scope.row)">复制</span>
                </el-dropdown-item>
                <el-dropdown-item divided>
                  <span style="display:inline-block;padding:0 10px;" @click="handleDelete(scope.row)">删除</span>
                </el-dropdown-item>
                <!--<el-dropdown-item divided>
                  <span style="display:inline-block;padding:0 10px;" @click="baselineDeploy(scope.row)">新建基线</span>
                </el-dropdown-item>-->
                <!--<el-dropdown-item divided>
                  <span style="display:inline-block;padding:0 10px;" @click="checkBaselines(scope.row)">基线详情</span>
                </el-dropdown-item>-->
                <!--<el-dropdown-item divided>
                  <span style="display:inline-block;padding:0 10px;" @click="handleMonitor(scope.row)">在线监控</span>
                </el-dropdown-item>-->
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown trigger="click" v-else>
            <span class="el-dropdown-link">
              <el-button type="success" plain>更多操作</el-button>
            </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <span style="display:inline-block;padding:0 10px;" @click="handleClean(scope.row)">清除</span>
                </el-dropdown-item>
                <el-dropdown-item divided>
                  <span style="display:inline-block;padding:0 10px;" @click="handleRestore(scope.row)">恢复</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
    <!--回收站模式-->
    <!--<div v-if="isHistory" style="width: 100%;margin-top: 40px;">
      <el-tabs type="border-card" @tab-click="handleTabClick">
        <el-tab-pane label="部署设计">
          <span slot="label"><svg-icon icon-class="部署设计" style="margin-right: 10px;"></svg-icon>部署设计</span>
          <el-table :key='tableKey' :data="hisDepList" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                    :default-sort = "{prop: 'createTime', order: 'descending'}"
                    style="width: 100%">
            <el-table-column align="left" :label="$t('table.deployPlanName')" min-width="200">
              <template slot-scope="scope">
                <el-tooltip :content="computedDes(scope.row)" placement="right">
                  <span>{{scope.row.name}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间" min-width="100" sortable prop="createTime">
              <template slot-scope="scope">
                <span>{{scope.row.createTime}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="当前状态" width="100"
                             prop="baseline"
                             :filters="[{ text: '基线', value: true }, { text: '部署设计', value: false }]"
                             :filter-method="filterBaseline">
              <template slot-scope="scope">
              <span>
                <svg-icon v-if="scope.row.baseline" icon-class="基线" style="font-size: 20px"></svg-icon>
                <svg-icon v-else icon-class="部署设计" style="font-size: 16px"></svg-icon>
              </span>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('table.actions')" width="240">
              <template slot-scope="scope">
                <el-button class="deploy-action-btn" size="mini" type="success" plain v-if="!scope.row.deleted" @click="handleNewBaseline(scope.row)">新建基线</el-button>
                <el-button class="deploy-action-btn" size="mini" type="warning" plain v-if="!scope.row.deleted" @click="handleMonitor(scope.row)">在线监控</el-button>
                <el-dropdown trigger="click" v-if="isHistory">
                  <span class="el-dropdown-link">
                    <el-button type="success" plain>更多操作</el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <span style="display:inline-block;padding:0 10px;" @click="handleClean(scope.row)">清除</span>
                    </el-dropdown-item>
                    <el-dropdown-item divided>
                      <span style="display:inline-block;padding:0 10px;" @click="handleRestore(scope.row)">恢复</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="基线">
          <span slot="label"><svg-icon icon-class="基线" style="margin-right: 10px;"></svg-icon>基线</span>
          <el-table :key='tableKey' :data="hisBaseList" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                    :default-sort = "{prop: 'createTime', order: 'descending'}"
                    style="width: 100%">
            <el-table-column align="left" :label="$t('table.deployPlanName')" min-width="200">
              <template slot-scope="scope">
                <el-tooltip :content="computedDes(scope.row)" placement="right">
                  <span>{{scope.row.name}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间" min-width="100" sortable prop="createTime">
              <template slot-scope="scope">
                <span>{{scope.row.createTime}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="当前状态" width="100"
                             prop="baseline"
                             :filters="[{ text: '基线', value: true }, { text: '部署设计', value: false }]"
                             :filter-method="filterBaseline">
              <template slot-scope="scope">
              <span>
                <svg-icon v-if="scope.row.baseline" icon-class="基线" style="font-size: 20px"></svg-icon>
                <svg-icon v-else icon-class="部署设计" style="font-size: 16px"></svg-icon>
              </span>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('table.actions')" width="240">
              <template slot-scope="scope">
                <el-button class="deploy-action-btn" size="mini" type="success" plain v-if="!scope.row.deleted" @click="handleNewBaseline(scope.row)">新建基线</el-button>
                <el-button class="deploy-action-btn" size="mini" type="warning" plain v-if="!scope.row.deleted" @click="handleMonitor(scope.row)">在线监控</el-button>
                <el-dropdown trigger="click" v-if="isHistory">
                  <span class="el-dropdown-link">
                    <el-button type="success" plain>更多操作</el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <span style="display:inline-block;padding:0 10px;" @click="handleCleanBase(scope.row)">清除</span>
                    </el-dropdown-item>
                    <el-dropdown-item divided>
                      <span style="display:inline-block;padding:0 10px;" @click="handleRestoreBase(scope.row)">恢复</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>-->
    <!--部署设计对话框-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%" class="limit-width-dialog">
      <el-form :rules="deployRules" ref="dataForm" :model="temp" label-width="100px" style='width: 80%; margin:0 auto;'>
        <el-form-item :label="$t('table.deployPlanName')" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.deployPlanDesc')" prop="description">
          <el-input v-model="temp.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" style="margin-right: 10px">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData" :loading="creDepLoading">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData" :loading="upDepLoading">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
    <!--基线新建对话框-->
    <el-dialog title="请填写基线信息" :visible.sync="baselineVisible" width="40%" class="limit-width-dialog">
      <el-form :rules="baselineRules" ref="baselineForm" :model="baselineTemp" label-position="right" label-width="100px" style='width: 80%; margin:0 auto;'>
        <el-form-item label="名称" prop="name">
          <el-input v-model="baselineTemp.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="baselineTemp.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="baselineVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="createBaseline" :loading="creBasLoading">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
    <!--基线详情对话框-->
    <el-dialog :title="deployName" :visible.sync="baselineDetailVisible">
      <el-table :key='tableKey' :data="baslineList" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                style="width: 100%">

        <el-table-column align="center" label="基线名称" width="200">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="基线描述" min-width="200">
          <template slot-scope="scope">
            <span>{{scope.row.description}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleModifyBaseline(scope.row)">编辑</el-button>
            <el-button type="danger" @click="deleteBaseline(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <!--<el-button @click="baselineDetailVisible = false">关闭</el-button>-->
      </div>
    </el-dialog>
    <!--修改基线对话框-->
    <el-dialog title="请填写基线信息" :visible.sync="modifyBaselineVisible" width="40%">
      <el-form :rules="baselineRules" ref="baselineForm" :model="modifyBaselineTemp" label-position="right" label-width="70px" style='width: 80%; margin:0 auto;'>
        <el-form-item label="名称" prop="name">
          <el-input v-model="modifyBaselineTemp.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="modifyBaselineTemp.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyBaselineVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="modifyBaseline" :loading="upBasLoading">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
    <!--查看部署设计快照对话框-->
    <el-dialog title="基线详情" :visible.sync="snapshootFormVisible" width="80%">
      <designSnapshoot :deployPlanId="deployPlanId" :deployPlanName="deployPlanName"></designSnapshoot>
    </el-dialog>
    <!--新建基线描述-->
    <el-dialog title="请填写基线描述" :visible.sync="baselineInfoVisible" width="40%" class="limit-width-dialog">
      <el-form ref="baselineForm" :model="baselineInfo" label-position="right" label-width="70px" style='width: 80%; margin:0 auto;'>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="baselineInfo.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="baselineInfoVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="baselineDeploy" :loading="upBasLoading">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { deployplanList, createDeployplan, updateDeployplan, deleteDeployplan, hisDeployplan, hisBaseline, cleanDeployplan, restoreDeployplan, copyDeployplan, getBaselinesByDeployplanId } from '@/api/deployplan'
  import { saveDeploymentDesignSnapshots, getDeploymentDesignSnapshots, deleteDeploymentDesignSnapshots, modifySnapshots, baselineDeployDesign } from '@/api/baseline'
  import waves from '@/directive/waves' // 水波纹指令
  import Sortable from 'sortablejs'
  import designSnapshoot from '../designNodeSnapshoot/deployDesignSnapshoot'
  import Vue from 'vue'

  /* eslint-disable */
  export default {
    name: 'deploy-plan',
    directives: {
      waves
    },
    components: {
      designSnapshoot
    },
    data() {
      return {
        deployPlanId: '',
        deployPlanName: '',
        isHistory: false,
        selectedId: '',
        deployName: '',
        tableKey: 0,
        list: [],
        hisDepList: [],
        hisBaseList: [],
        baslineList: [],
        sourceList: [{value: '--', text: '无来源'}],
        listLoading: true,
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
          id: '',
          name: '',
          description: ''
        },
        dialogFormVisible: false,
        baselineVisible: false,
        baselineDetailVisible: false,
        modifyBaselineVisible: false,
        snapshootFormVisible: false,
        baselineTemp: {
          id: '',
          name: '',
          description: ''
        },
        baselineInfo: {
          description: ''
        },
        baselineInfoVisible: false,
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
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        deployRules: {
          name: [{ required: true, message: '请输入部署设计名称', trigger: 'blur' }]
        },
        baselineRules: {
          name: [{ required: true, message: '请输入基线名', trigger: 'blur' }]
        },
        downloadLoading: false,
        creDepLoading: false,
        upDepLoading: false,
        creBasLoading: false,
        upBasLoading: false,
        searchQuery: '',
        errorMessage: '操作失败！'
      }
    },
    created() {
      this.isHistory = false
      this.getList()
    },
    methods: {
      onExpand(row) {
        if(row.baselines !== undefined) {
          return
        }
        let params = {
          deleted: false
        }
        getBaselinesByDeployplanId(row.id, params).then((res) => {
          row.baselines = res.data.data
          this.list.forEach((item,index) => {
            if(item.id == row.id) {
              Vue.set(this.list, index, row)
            }
          })
        })
      },
      handleTabClick(tab, event) {
        if (tab.label === '部署设计') {
          this.getHis()
        } else if (tab.label === '基线') {
          this.getHisBase()
        }
      },
      filterBaseline(value, row) {
        return row.baseline === value
      },
      filterSource(value, row) {
        if(value === '--') {
          return row.source === null
        } else if(value.length > 0) {
          if(row.source !== null)
          return row.source.id === value
        }
      },
      getList() {
        this.listLoading = true;
        let projectId = this.getCookie('projectId');

        deployplanList(projectId, this.listQuery).then(response => {
          this.isHistory = false
          this.list = response.data.data.content
          let listSource = [{value: '--', text: '无来源'}]
          this.list.forEach((item) => {
            if(item.source !== null) {
              listSource.push({
                value: item.source.id,
                text: item.source.name
              })
            }
          })
          this.sourceList= this.getSourceList(listSource)
          this.total = response.data.total
          this.listLoading = false
          this.listLength = response.data.data.length
          this.total = response.data.data.totalElements
        })
      },
      getSourceList(arr) {
        const res = new Map();
        return arr.filter((a) => !res.has(a.value) && res.set(a.value, 1))
      },
      getHisBase() {
        this.listLoading = true;
        let projectId = this.getCookie('projectId');
        hisBaseline(projectId, this.listQuery).then(response => {
          this.isHistory = true
          this.hisBaseList = response.data.data.content
          this.total = response.data.total
          this.listLoading = false
          this.listLength = response.data.data.length
          this.total = response.data.data.totalElements
        })
      },
      getHis() {
        this.listLoading = true;
        let projectId = this.getCookie('projectId');

        hisDeployplan(projectId, this.listQuery).then(response => {
          this.isHistory = true
          this.list = response.data.data.content
          let listSource = [{value: '--', text: '无来源'}]
          this.list.forEach((item) => {
            if(item.source !== null) {
              listSource.push({
                value: item.source.id,
                text: item.source.name
              })
            }
          })
          this.sourceList= this.getSourceList(listSource)
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
      checkNodeBaseLine(row) {
        this.snapshootFormVisible = true
        this.deployPlanId = row.id
        this.deployPlanName = row.name
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.creDepLoading = true
            let projectId = this.getCookie('projectId');
            let formData = new FormData();

            formData.append('name', this.temp.name);
            formData.append('description', this.temp.description);

            createDeployplan(formData, projectId).then(() => {
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
              if(error.response.data.message){
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
            }).catch((error) =>{
              this.upDepLoading = false
              this.errorMessage = '操作失败！'
              if(error.response.data.message){
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
      handleCopy(row) {
        copyDeployplan(row.id).then(() => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '复制成功',
            type: 'success',
            duration: 2000
          })
        }).catch((error) => {
          this.errorMessage = '操作失败！'
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
      setSort() {
        const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
        this.sortable = Sortable.create(el, {
          ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
          setData: function(dataTransfer) {
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
          deleteDeployplan(id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          }).catch(() => {
            this.$notify({
              title: '失败',
              message: '删除失败！',
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
      handleNewBaseline(row) {
        this.selectedId = row.id
        this.baselineInfoVisible = true
      },
      baselineDeploy(row) {
        let data = {
          createMessage: this.baselineInfo.description
        }
        let qs = require('qs')
        let newdata = qs.stringify(data)
        baselineDeployDesign(this.selectedId, newdata).then(() => {
          this.$notify({
            title: '成功',
            message: '已设置为基线',
            type: 'success',
            duration: 2000
          })
          this.getList()
          this.baselineInfoVisible = false
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
          if(valid) {
            this.creBasLoading = true
            let formData = new FormData();

            formData.append('name', this.baselineTemp.name);
            formData.append('description', this.baselineTemp.description);
            saveDeploymentDesignSnapshots(this.selectedId,formData).then(() => {
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
          if(error.response.data.message){
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
      },
      handleCleanBase(row) {
        this.$confirm('确认彻底删除此基线吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          cleanDeployplan(row.id).then(() => {
            this.listLoading = false
            this.getHisBase()
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
      handleRestoreBase(row) {
        this.$confirm('确认恢复此基线吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          restoreDeployplan(row.id).then(() => {
            this.listLoading = false
            this.getHisBase()
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
      listA: function () {
        let self = this;
        return self.list.filter(function (item) {
          return item.name.toLowerCase().indexOf(self.searchQuery.toLowerCase()) !== -1;
        })
      },
      listenProId () {
        return this.$store.state.app.projectId
      },
      computedDes() {
        return function(row) {
          if(!row.baseline) {
            if(row.description) {
              return '描述： ' + row.description
            } else {
              return '描述：' + ' 无'
            }
          } else if(row.baseline) {
            if(row.createMessage) {
              return '基线信息： ' + row.createMessage
            } else {
              return '基线信息：' + ' 无'
            }
          }

        }
      }
    },
    watch: {
      listenProId: function (a, b) {
        this.getList()
      }
    }
  }
</script>

<style scoped>
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
  .el-button+.el-button {
    margin-left: 0;
  }
</style>
