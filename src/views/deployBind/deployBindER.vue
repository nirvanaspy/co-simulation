<template>
  <div :class="className" :id="id" :style="{height:height,width:width,top:top}" :list="detaillist" :currentNodeInfo="currentNodeInfo"></div>
</template>

<script>
  import echarts from 'echarts'
  import resize from '../../components/Charts/mixins/resize'
  /* eslint-disable */
  export default {
    name: 'deploy-bind-er',
    mixins: [resize],
    props: {
      detaillist: {
        type: Array,
        default:[]
      },
      currentNodeInfo: {
        type: Object,
        default: {}
      },
      className: {
        type: String,
        default: 'chart'
      },
      id: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '100%'
      },
      top: {
        type: String,
        default: '15px'
      }
    },
    data() {
      return {
        chart: null,
        list: [],
        // currentNodeInfo: null,
        dataList: [],
        dataItem: {},
        linksList: [],
        linksItem: {},
        centerDevice: {},
        centerX: 300,
        centerY: 400,
        childX: 550,
        stepY: 200,
        title: '设备组件关系图'
      }
    },
    mounted() {
      this.initChart()
      console.log(this.list)
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initChart() {
        this.chart = echarts.init(document.getElementById(this.id));

        this.chart.setOption({
          title: {
            text: this.title //'设备组件关系图'
          },
          tooltip: {
            formatter: function (x) {
              /*return x.data.info.componentEntity.deployPath;*/
              var res
              if(x.data.deviceInfo) {
                res='<div><p>名称：'+x.data.deviceInfo.name+'</p></div>'
                  + '<div><p>IP：'+x.data.deviceInfo.hostAddress+'</p></div>'
              } else if(x.data.info){
                res='<div><p>名称：'+x.data.info.componentEntity.name+'</p></div>'
                  + '<div><p>路径：'+x.data.info.componentEntity.relativePath+'</p></div>'
                  + '<div><p>版本：'+x.data.info.componentEntity.version+'</p></div>'
                  + '<div><p>时间：'+x.data.info.componentEntity.createTime+'</p></div>'
              }
              /*for(var i=0;i<params.length;i++){
                res+='<p>'+params[i].seriesName+':'+params[i].data+'</p>'
              }*/
              return res;
            }
          },
          animationDurationUpdate: 300,
          animationEasingUpdate: 'quinticInOut',
          series: [
            {
              type: 'graph',
              layout: 'circular',
              symbolSize: 20,
              roam: true,
              label: {
                normal: {
                  show: true,
                  position: 'top',
                  /*formatter: function (name) {
                    return '{name|' + name + '}';
                  },
                  rich: {
                    name: {
                      backgroundColor: './computer.png'
                    }
                  },*/
                  textStyle: {
                    fontSize: 16,
                    fontFamily:'Arial',
                    fontWeight: 700,
                    textShadow: 'none',
                    color: '#777'
                  }
                }
              },
              /*itemStyle: {
                normal: {
                  color: '#66b1ff'
                }
              },*/
              edgeSymbol: ['circle', 'arrow'],
              edgeSymbolSize: [4, 10],
              edgeLabel: {
                normal: {
                  textStyle: {
                    fontSize: 16
                  }
                }
              },
              data: this.dataList,
              /*data: [{
                name: '节点1',
                x: 300,
                y: 400
              },{
                name: '节点2',
                x: 550,
                y: 200
              },{
                name: '节点3',
                x: 550,
                y: 400
              }, {
                name: '节点4',
                x: 550,
                y: 600
              },{
                name: '节点5',
                x: 550,
                y: 600
              }
              ],*/
              // links: [],
              links: this.linksList
              /*links: [{
                source: '节点1',
                target: '节点3'
              },{
                source: '节点1',
                target: '节点2'
              }, {
                source: '节点1',
                target: '节点4'
              },{
                source: '节点2',
                target: '节点5'
              }]*/
            }
          ]
        })
      },
      initConfig() {
        console.log(this.currentNodeInfo)
        if(this.list.length > 0) { // 绑定了组件
          console.log(this.list[0])
          if(this.list[0].deploymentDesignNodeEntity.deviceEntity !== null) { // 绑定了设备和组件
            this.centerDevice = {
              name: this.list[0].deploymentDesignNodeEntity.deviceEntity.name,
              /*x: this.centerX,
              y: this.centerY,*/
              symbolSize: 40,
              itemStyle: {
                normal: {
                  color: '#42b983',
                }
              },
              deviceInfo: this.list[0].deploymentDesignNodeEntity.deviceEntity
            }
          } else { // 未绑定设备， 绑定了组件
            this.centerDevice = {
              name: '暂未绑定设备',
              symbolSize: 40,
              itemStyle: {
                normal: {
                  color: '#42b983',
                }
              },
              deviceInfo: {}
            }
          }
        } else { // 未绑定组件
          if (this.currentNodeInfo.deviceEntity === null) { // 未绑定组件 未绑定设备
            this.centerDevice = {
              name: '暂未绑定设备与组件',
              symbolSize: 40,
              itemStyle: {
                normal: {
                  color: '#42b983',
                }
              },
              deviceInfo: {}
            }
          } else {
            this.centerDevice = { // 未绑定组件 绑定了设备
              name: this.currentNodeInfo.deviceEntity.hostAddress + '暂未绑定组件',
              symbolSize: 40,
              itemStyle: {
                normal: {
                  color: '#42b983',
                }
              },
              deviceInfo: this.currentNodeInfo.deviceEntity
            }
          }

        }

        this.dataList = []
        this.linksList = []
        this.dataList.push(this.centerDevice)
        for(let i=0;i<this.list.length;i++) {
          this.dataItem = {
            name: this.list[i].componentHistoryEntity.name,
            // name: this.list[i].componentEntity.name,
            /*x: this.childX,
            y: this.stepY*i,*/
            info: this.list[i],
            id: this.list[i].componentHistoryEntity.id
            // id: this.list[i].componentEntity.id
          }
          this.linksItem = {
            source: this.centerDevice.name,
            target: this.list[i].componentHistoryEntity.id,
            // target: this.list[i].componentEntity.id,
            // id: this.list[i].componentEntity.id
          }
          this.dataList.push(this.dataItem)
          this.linksList.push(this.linksItem)
        }
        /*console.log(this.dataList,'jjjjjj')
        console.log(this.linksList, 'lllll')*/
        if(this.linksList.length > 0) {
          this.title = '设备组件关系图'
        } else {
          this.title = '设备组件关系图(该节点暂无信息)'
        }
      }
    },
    watch: {
      detaillist () {
        /*console.log('我变啦！！')
        console.log(this.detaillist)*/
        // alert('我变啦！')
        console.log('detailList=========')
        console.log(this.detaillist)
        this.list = this.detaillist
        this.initConfig()
        this.initChart()
      },
      /*currentNodeInfo () {
        this.list = this.detaillist
        this.initConfig()
        this.initChart()
      }*/
    }
  }
</script>
