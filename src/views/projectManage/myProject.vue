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
        list: []
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
      }
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

<style scoped>
  .my-project-container {
    padding: 20px;
  }
</style>
