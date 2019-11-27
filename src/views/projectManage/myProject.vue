<template>
  <div class="my-project-container">
    <el-table :data="list" style="width: 100%;padding-top: 15px;">
      <el-table-column label="项目名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <span @dblclick="routerToMyProject(scope.row)" class="link-type">
            {{scope.row.name}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="项目状态" width="195" align="left"
                       prop="state"
                       :filters="[{ text: '未进行', value: 0 }, { text: '进行中', value: 1 }, { text: '已完成', value: 2 }, { text: '超时', value: 3 }]"
                       :filter-method="filterState">
        <template slot-scope="scope">
          <span v-if="scope.row.state !== null" :class="stateClassMap[scope.row.state]">
            <span>
              <el-tag
                :type="stateClassMap[scope.row.state]"
                disable-transitions>{{stateMap[scope.row.state]}}
              </el-tag>
            </span>
          </span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="项目令号" width="195" align="left">
        <template slot-scope="scope">
          <span v-if="scope.row.orderNum !== null">{{scope.row.orderNum}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="项目截止时间" width="195" align="center">
        <template slot-scope="scope">
          {{copmutedDate(scope.row.finishTime)}}
        </template>
      </el-table-column>
      <el-table-column label="项目负责人" width="195" align="center">
        <template slot-scope="scope">
          {{scope.row.pic.username}}
        </template>
      </el-table-column>
      <el-table-column label="项目创建者" width="195" align="center">
        <template slot-scope="scope">
          {{scope.row.creator.username}}
        </template>
      </el-table-column>
      <!--<el-table-column label="状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter"> {{scope.row.status}}</el-tag>
        </template>
      </el-table-column>-->
    </el-table>
  </div>
</template>

<script>
  /*eslint-disable*/
  import { getProjectsByUser } from '@/api/pro-design-link'
  export default {
    name: 'myProject',
    data() {
      return {
        userId: '',
        list: [],
        stateMap: {
          0: '未进行',
          1: '进行中',
          2: '已完成',
          3: '超时'
        },
        stateClassMap: {
          0: 'info',
          1: 'primary',
          2: 'success',
          3: 'warning'
        }
      }
    },
    created() {
      this.userId = this.getCookie('userId')
      this.getList()
    },
    methods: {
      getList() {
        getProjectsByUser(this.userId).then((res) => {
          if(res.data.code === 0) {
            this.list = res.data.data
          }
        })
      },
      routerToMyProject(row) {
        this.$router.push({
          path: '/task_manage',
          name: 'task_manage',
          query: {
            name: row.name,
            id: row.id
          }
        })
      },
      filterState(value, row) {
        return row.state == value;
      },
    },
    computed: {
      copmutedDate() {
        return function(time) {
          if(time !== null) {
            let unixtimestamp = new Date(parseInt(time))
            let year = unixtimestamp.getFullYear();
            let month = "0" + (unixtimestamp.getMonth() + 1);
            let date = "0" + unixtimestamp.getDate();
            return year + "-" + month.substring(month.length-2, month.length)  + "-" + date.substring(date.length-2, date.length)
          } else {
            return '--'
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .my-project-container {
    padding: 20px;
    height: calc(100% - 100px) !important;
    overflow: scroll;
    .undo {
      color: #909399;
    }
    .doing {
      color: #409EFF;
    }
    .complete {
      color: #67C23A;
    }
    .timeout {
      color: #E6A23C;
    }
  }
</style>
