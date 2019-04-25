<template>
  <div class="search-panel-container">
    <transition name="hide">
      <div class="search-header" v-show="!mainActive">
        <span @click="showMainSearch" style="cursor: pointer;">
          <svg-icon icon-class="search-2"></svg-icon>
        </span>
      </div>
    </transition>
    <div class="search-main" :class="{'main-not-active': !mainActive}">
      <span style="position: absolute;top: 12px;right: 0;cursor: pointer;font-size: 18px;z-index: 99;" @click="hideMainSearch">
        <svg-icon icon-class="error"></svg-icon>
        <!--<el-button type="danger" size="mini">关闭</el-button>-->
      </span>
      <div class="search-mask" v-if="!mainActive"></div>
      <div class="condition-container">
        <el-tabs v-model="activeName">
          <el-tab-pane label="搜索项目" name="first">
            <div class="operation-btn-container">
              <div class="search-btn-container" style="float: right">
                <el-button type="primary" size="mini" @click="searchPro">搜索项目</el-button>
              </div>
              <div style="float: left">
                <el-button type="success" size="mini" @click="addCondition">增加</el-button>
                <el-button type="danger"  size="mini" @click="deleteCondition">删除</el-button>
              </div>
            </div>
            <el-table :data="conditionList" max-height="300"
                      @selection-change="handleSelectionChange"
                      @select="selectRow"
                      :row-class-name="tableRowClassName"
                      ref="multipleTable">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column align="center" width="150px" label="列名">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.field" placeholder="请选择">
                    <el-option
                      v-for="item in proFieldOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" width="150px" label="运算符">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.operator" placeholder="请选择">
                    <el-option
                      v-for="item in operatorOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" min-width="200px" label="值">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.value"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" width="150px" label="逻辑符">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.logic" placeholder="请选择" clearable>
                    <el-option
                      v-for="item in logicOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="搜索文件" name="second">
            <div class="operation-btn-container">
              <div class="search-btn-container" style="float: right">
                <el-button type="primary" size="mini" @click="searchFile">搜索文件</el-button>
              </div>
              <div style="float: left">
                <el-button type="success" size="mini" @click="addFileCondition">增加</el-button>
                <el-button type="danger"  size="mini" @click="deleteFileCondition">删除</el-button>
              </div>
            </div>
            <el-table :data="fileConditionList" max-height="300"
                      @selection-change="handleFileSelectionChange"
                      @select="selectFileRow"
                      :row-class-name="tableRowClassName"
                      ref="multipleTable">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column align="center" width="150px" label="列名">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.field" placeholder="请选择">
                    <el-option
                      v-for="item in proFieldOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" width="150px" label="运算符">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.operator" placeholder="请选择">
                    <el-option
                      v-for="item in operatorOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" min-width="200px" label="值">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.value"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" width="150px" label="逻辑符">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.logic" placeholder="请选择" clearable>
                    <el-option
                      v-for="item in logicOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="search-result-container">
        <!--<span>搜索结果</span>-->
        <div v-if="activeName === 'first'">
          <el-table :data="proResultList" max-height="400">
            <el-table-column min-width="120" label="名称" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column width="120" label="令号" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column width="120" label="创建者" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column width="120" label="负责人" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column width="120" label="密级" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="activeName === 'second'">
          <el-table :data="fileResultList" max-height="400">
            <el-table-column min-width="120" label="名称" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column width="120" label="令号" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column width="120" label="创建者" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column width="120" label="负责人" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column width="120" label="密级" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /*eslint-disable*/
  import { searchProject } from '@/api/project'
  import { searchFiles } from '@/api/sublibFiles'
  import dayjs from 'dayjs'
  export default {
    name: 'searchPanel',
    data() {
      return {
        activeName: 'first',
        mainActive: false,
        seletedRow: [],
        selectedFileRow: [],
        proResultList: [],
        fileResultList: [],
        filterObj: {},
        fileFilterObj: {},
        conditionList: [
          {
            field: '',
            operator: '',
            value: '',
            logic: ''
          }
        ],
        fileConditionList: [
          {
            field: '',
            operator: '',
            value: '',
            logic: ''
          }
        ],
        proFieldOptions: [
          {
            label: '名称',
            value: 'name'
          },
          {
            label: '令号',
            value: 'orderNum'
          },
          {
            label: '创建者',
            value: 'creator.username'
          },
          {
            label: '负责人',
            value: 'pic.username'
          }
        ],
        fileFiledOptions: [
          {
            label: '名称',
            value: 'name'
          },
          {
            label: '后缀',
            value: 'postFix'
          },
          {
            label: '密级',
            value: 'secretClass'
          },
          {
            label: '负责人',
            value: 'pic.id'
          }
        ],
        operatorOptions: [
          {
            label: '包含',
            value: 'contains'
          },
          {
            label: '等于',
            value: 'eq'
          },
          {
            label: '不等于',
            value: 'neq'
          },
          {
            label: '开始为',
            value: 'startswith'
          },
          {
            label: '结束为',
            value: 'endswith'
          }
        ],
        logicOptions: [
          {
            label: '或者',
            value: 'or'
          },
          {
            label: '并且',
            value: 'and'
          }
        ]
      }
    },
    methods: {
      // 样式逻辑
      showMainSearch() {
        this.mainActive = true
      },
      hideMainSearch() {
        this.mainActive = false
      },
      // 业务逻辑
      tableRowClassName(row) {
        row.row.index = row.rowIndex
      },
      searchPro() {
        /*let data  = {
          logic: 'or',
          filters: [{
            field: 'finishTime',
            operator: 'contains',
            value: '1556208000000'
          },
          {
            field: 'secretClass',
            operator: 'eq',
            value: 1
          }]
        }*/
        this.serializeCondtion()
        let data
        if(this.filterObj.logic == '') {
          data = this.filterObj.filters[0]
        } else {
          data = this.filterObj
        }
        let postData = JSON.stringify(data)
        this.proResultList = []
        searchProject(postData).then((res) => {
          if(res.data.code === 0) {
            this.proResultList = res.data.data
          }
        })
      },
      searchFile() {
        /*let data  = {
          logic: 'or',
          filters: [{
            field: 'finishTime',
            operator: 'contains',
            value: '1556208000000'
          },
          {
            field: 'secretClass',
            operator: 'eq',
            value: 1
          }]

        }*/
        /*let data = {
          logic: 'and',
          filters: [{
            field: 'ifApprove',
            operator: 'eq',
            value: true
          },{
            field: 'userEntity.id',
            operator: 'contains',
            value: '218b4827'
          }]
        }*/
        this.serializeFileCondtion()
        let data
        if(this.fileFilterObj.logic == '') {
          data = this.fileFilterObj.filters[0]
        } else {
          data = this.fileFilterObj
        }
        let postData = JSON.stringify(data)
        searchFiles(postData).then((res) => {
          if(res.data.code === 0) {
            this.fileResultList = res.data.data
          }
        })
      },
      // 增加项目筛选条件
      addCondition() {
        this.conditionList.push({
          field: '',
          operator: '',
          value: '',
          logic: ''
        })
      },
      // 删除项目筛选条件
      deleteCondition() {
        this.conditionList = this.conditionList.filter((item) => {
          return item.checked !== true
        })
      },
      // 增加文件筛选条件
      addFileCondition() {
        this.fileConditionList.push({
          field: '',
          operator: '',
          value: '',
          logic: ''
        })
      },

      //删除文件筛选条件
      deleteFileCondition() {
        this.fileConditionList = this.fileConditionList.filter((item) => {
          return item.checked !== true
        })
      },
      selectRow(selection, row) {
        row.checked = !row.checked
      },
      selectFileRow(selection, row) {
        row.checked = !row.checked
      },
      handleSelectionChange(val) {
        this.seletedRow = val
      },
      handleFileSelectionChange(val) {
        this.selectedFileRow = val
      },
      serializeFileCondtion() {
        this.fileConditionList.forEach((item, index) => {
          // 不是最后一个条件
          if(index !== this.fileConditionList.length - 1 && this.fileConditionList.length > 1) {
            // 所有条件都不能为空
            if(item.field == '' || item.operator== '' || item.value == '' || item.logic == '') {
              this.$message({
                message: '筛选条件填写不完整',
                type: 'warning'
              })
              return false
            }
          }
          // 只有一个条件
          if(this.fileConditionList.length == 1) {
            // 所有条件都不能为空
            if(item.field == '' || item.operator == '' || item.value == '') {
              console.log(item)
              this.$message({
                message: '筛选条件填写不完整',
                type: 'warning'
              })
              return false
            }
          }
        })
        let filterObj = {
          logic: '',
          filters: []
        }
        for(let i = 0; i < this.fileConditionList.length; i++) {
          let filterItem = {
            field: this.fileConditionList[i].field,
            operator: this.fileConditionList[i].operator,
            value: this.fileConditionList[i].value
          }
          if(filterObj.filters.length > 1) {
            let copyObj = JSON.parse(JSON.stringify(filterObj))
            filterObj.filters =[filterItem, copyObj]
          } else {
            filterObj.filters.push(filterItem)
          }
          if(filterObj.filters.length == 2) {
            filterObj.logic = this.fileConditionList[i-1].logic
          } else {
            filterObj.logic = this.fileConditionList[i].logic
          }
        }
        this.fileFilterObj = filterObj
      },
      serializeCondtion() {
        this.conditionList.forEach((item, index) => {
          // 不是最后一个条件
          if(index !== this.conditionList.length - 1 && this.conditionList.length > 1) {
            // 所有条件都不能为空
            if(item.field == '' || item.operator== '' || item.value == '' || item.logic == '') {
              this.$message({
                message: '筛选条件填写不完整',
                type: 'warning'
              })
              return false
            }
          }
          // 只有一个条件
          if(this.conditionList.length == 1) {
            // 所有条件都不能为空
            if(item.field == '' || item.operator == '' || item.value == '') {
              console.log(item)
              this.$message({
                message: '筛选条件填写不完整',
                type: 'warning'
              })
              return false
            }
          }
        })
        let filterObj = {
          logic: '',
          filters: []
        }
        for(let i = 0; i < this.conditionList.length; i++) {
          let filterItem = {
            field: this.conditionList[i].field,
            operator: this.conditionList[i].operator,
            value: this.conditionList[i].value
          }
          if(filterObj.filters.length > 1) {
            let copyObj = JSON.parse(JSON.stringify(filterObj))
            filterObj.filters =[filterItem, copyObj]
          } else {
            filterObj.filters.push(filterItem)
          }
          if(filterObj.filters.length == 2) {
            filterObj.logic = this.conditionList[i-1].logic
          } else {
            filterObj.logic = this.conditionList[i].logic
          }
        }
        this.filterObj = filterObj
        console.log(filterObj)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .search-panel-container {
    position: absolute;
    top: 60px;
    bottom: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    background: #ebf1f6;
  }
  .search-main {
    position: relative;
    width: 60%;
    // height: 300px;
    margin: 20px auto;
    transform: perspective(1000px);
    transition: transform .6s;
    transition-timing-function: cubic-bezier(.2,1,.3,1);
  }
  .search-main.main-not-active {
    transform: perspective(1000px) translate3d(0,-2vh,0) rotate3d(1,0,0,40deg);
  }
  .search-header {
    text-align: center;
    font-size: 200px;
  }
  .search-mask {
    width: 100%;
    height: 100%;
    background: rgba(89,131,232,0.2);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
  }
  .hide-enter-active, .hide-leave-active {
    transition: opacity .05s;
  }
  .hide-enter, .hide-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .condition-container {
    // height: 300px;
  }
  .operation-btn-container {
    width: 100%;
    text-align: right;
    margin-bottom: 10px;
    height: 30px;
  }
  .search-result-container {
    margin-top: 4px;
    min-height: 300px;
    background: #fff;
  }

</style>
