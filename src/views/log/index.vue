<template>
  <div class="app-container calendar-list-container download-log-container">
    <div v-if="list.length === 0" style="width: 100%;font-size: 24px;color: #999;text-align: center;margin-top: 100px">
      暂无数据
    </div>
    <div>
      <div v-for="item in list" class="log-container">
        <div class="log-des-box">
        <span class="icon">
          <svg-icon icon-class="logs"></svg-icon>
        </span>
          <span class="des-text">
          {{computeLogDes(item)}}
        </span>
        </div>
        <div class="log-time-box">
        <span class="icon" style="color: #777;">
          <svg-icon icon-class="time"></svg-icon>
        </span>
          <span class="time-text">
          下载时间:{{item.createTime}}
        </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  import {logList} from '@/api/log'
  export default {
    name: 'log',
    data() {
      return {
        list: []
      }
    },
    methods: {
      getLogList() {
        logList().then((res) => {
          if(res.data.code === 0) {
            this.list = res.data.data
          }
        })
      }
    },
    created() {
      this.getLogList()
    },
    computed: {
      computeLogDes() {
        return function (item) {
          let downloadName = item.fileName
          let operator = '用户' + item.users.realName
          let des = operator + '下载了' + downloadName
          return des
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .download-log-container {
  }
  .log-container {
    width: 100%;
    height: 80px;
    background: #eaf4fb;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 4px;
    .icon {
      margin-right: 4px;
    }
    .log-des-box {
      margin-bottom: 10px;
      .des-text {
        font-size: 20px;
        color: #555;
      }
    }
    .log-time-box {
      .time-text {
        font-size: 14px;
        color: #999;
      }
    }
  }

</style>
