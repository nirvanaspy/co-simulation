<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="标识" show-overflow-tooltip>
      <template slot-scope="scope">
        {{scope.row.order_no}}
      </template>
    </el-table-column>
    <el-table-column label="参数1" width="195" align="center">
      <template slot-scope="scope">
        {{scope.row.price}}
      </template>
    </el-table-column>
    <el-table-column label="状态" width="100" align="center">
      <template slot-scope="scope">
        <el-tag :type="scope.row.status | statusFilter"> {{scope.row.status}}</el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { fetchList } from '@/api/transaction'

export default {
  data() {
    return {
      list: [
        {
          order_no: 'asd101',
          price: 1180,
          status: '已成功'
        },
        {
          order_no: 'asd101',
          price: 1180,
          status: '已完成'
        },
        {
          order_no: 'asd101',
          price: 1180,
          status: '已完成'
        },
        {
          order_no: 'asd101',
          price: 1180,
          status: '已成功'
        },
        {
          order_no: 'asd101',
          price: 1180,
          status: '已完成'
        },
        {
          order_no: 'asd101',
          price: 1180,
          status: '已超时'
        },
        {
          order_no: 'asd101',
          price: 1180,
          status: '已完成'
        },
        {
          order_no: 'asd101',
          price: 1180,
          status: '已超时'
        }
      ]
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        已成功: 'success',
        已超时: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    // this.fetchData()
  },
  methods: {
    fetchData() {
      fetchList().then(response => {
        this.list = response.data.items.slice(0, 7)
      })
    }
  }
}
</script>
