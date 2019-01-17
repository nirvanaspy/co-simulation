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
              symbolSize: 30,
              itemStyle: {
                normal: {
                  color: 'rgb(79, 97, 185)',
                }
              },
              symbol: 'path://M662.656 717.056l-7.04-83.584-63.104-4.096c-7.808-26.112-19.584-50.304-34.432-72.064l37.12-49.92-59.136-59.392-51.456 37.76c-22.144-14.336-46.464-25.472-72.192-32.64l-3.712-62.976-83.456-7.552-15.36 63.232c-26.624 3.328-51.712 10.624-75.008 21.248l-44.288-46.976L121.6 468.096l29.568 59.648c-17.28 18.816-31.872 40.192-43.008 63.36l-65.536-7.552-21.888 80.896 61.824 27.136c-0.512 11.392-0.384 23.04 0.64 34.816 1.152 13.952 3.456 27.52 6.656 40.704l-55.552 36.608 35.2 76.032 64.896-18.944c15.36 20.352 33.536 38.4 54.016 53.504l-18.944 63.36 75.904 35.584 36.992-55.424c24.576 5.888 50.304 8.192 76.8 6.528l25.728 59.648 81.024-21.504-7.168-64.768c23.808-11.776 45.312-27.008 64.256-45.056l56.704 28.416 48.256-68.48-46.08-44.032c10.496-24.064 17.408-50.048 20.224-77.056l60.544-14.464z m-309.632 108.416c-66.816 5.632-125.696-43.904-131.328-110.848-5.632-66.816 43.904-125.696 110.848-131.328 66.816-5.632 125.696 43.904 131.328 110.848 5.632 66.816-44.032 125.568-110.848 131.328zM954.752 422.528l33.92-60.416-41.216-32c6.784-21.504 9.984-43.52 9.856-65.28l48.64-16.896-12.8-68.096-52.736 1.92c-8.448-20.096-19.968-38.912-34.304-55.808l26.624-44.8L879.232 37.12l-39.936 36.096c-19.712-9.984-40.32-16.768-61.184-20.224L769.664 0.384l-69.248 0.768-7.552 54.528c-20.608 4.864-40.448 12.672-58.88 23.296l-41.216-35.584-52.48 45.184 29.696 47.36c-5.76 7.552-11.008 15.616-15.744 24.064-5.632 10.112-10.368 20.48-14.336 30.976l-55.04-0.768L473.6 258.56l53.12 17.152c1.024 21.12 5.12 41.856 12.16 61.696l-42.368 34.56 35.328 59.52 50.944-20.736c14.08 15.36 30.592 28.928 49.408 40.064l-9.984 52.736 65.408 22.912 25.216-47.616c21.76 2.944 43.52 2.56 64.896-1.024l25.6 45.696 64.768-24.448-11.136-51.584c18.432-11.52 35.2-26.112 49.536-43.264l48.256 18.304z m-268.8-57.344c-55.168-30.976-74.752-100.736-43.776-155.904 30.976-55.168 100.736-74.752 155.904-43.776 55.168 30.976 74.752 100.736 43.776 155.904-30.976 55.168-100.736 74.752-155.904 43.776zM439.68 319.488l16.512-29.44-20.096-15.616c3.328-10.496 4.864-21.12 4.864-31.744l23.68-8.192-6.272-33.152-25.6 0.896c-4.096-9.728-9.728-18.944-16.64-27.136l13.056-21.76-26.24-21.504-19.456 17.536c-9.6-4.864-19.584-8.192-29.824-9.856l-4.096-25.6-33.792 0.384-3.712 26.496c-9.984 2.304-19.712 6.144-28.672 11.392l-20.096-17.28-25.6 22.016 14.464 23.04c-2.816 3.712-5.376 7.552-7.68 11.648-2.816 4.864-5.12 9.984-6.912 15.104l-26.752-0.384-5.504 33.28 25.856 8.32c0.512 10.24 2.432 20.352 5.888 29.952l-20.608 16.896 17.152 29.056 24.832-10.112c6.784 7.552 14.848 14.08 24.064 19.584l-4.864 25.728 31.872 11.136 12.288-23.168c10.624 1.408 21.248 1.28 31.616-0.512l12.416 22.272 31.616-11.904-5.376-25.088c8.96-5.632 17.152-12.672 24.192-21.12l23.424 8.832z m-130.944-27.904c-26.88-15.104-36.352-49.024-21.248-75.904 15.104-26.88 49.024-36.352 75.904-21.248 26.88 15.104 36.352 49.024 21.248 75.904-15.104 26.752-49.024 36.352-75.904 21.248z',
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
              links: this.linksList
            }
          ]
        })
      },
      initConfig() {
        // console.log(this.currentNodeInfo)
        if(this.list.length > 0) { // 绑定了组件
          // console.log(this.list[0])
          if(this.list[0].deploymentDesignNodeEntity.deviceEntity !== null) { // 绑定了设备和组件
            this.centerDevice = {
              name: this.list[0].deploymentDesignNodeEntity.deviceEntity.name,
              /*x: this.centerX,
              y: this.centerY,*/
              symbol: 'path://M723.626667 853.333333 614.4 853.333333l0-109.226667 112.64 0 0-71.68L71.68 672.426667 71.68 153.6l853.333333 0L925.013333 443.733333l58.026667 0c3.413333 0 10.24 0 13.653333 3.413333L996.693333 129.706667c0-27.306667-20.48-47.786667-47.786667-47.786667L47.786667 81.92C20.48 81.92 0 102.4 0 129.706667l0 566.613333c0 27.306667 20.48 47.786667 47.786667 47.786667l337.92 0L385.706667 853.333333 256 853.333333c-23.893333 0-44.373333 20.48-44.373333 44.373333 0 23.893333 20.48 44.373333 44.373333 44.373333l481.28 0c-6.826667-10.24-10.24-20.48-10.24-30.72L727.04 853.333333 723.626667 853.333333z M993.28 467.626667l-201.386667 0c-17.066667 0-30.72 13.653333-30.72 30.72l0 409.6c0 17.066667 13.653333 30.72 30.72 30.72l201.386667 0c17.066667 0 30.72-13.653333 30.72-30.72l0-409.6C1024 484.693333 1010.346667 467.626667 993.28 467.626667zM890.88 921.6c-6.826667 0-13.653333-6.826667-13.653333-13.653333 0-6.826667 6.826667-13.653333 13.653333-13.653333s13.653333 6.826667 13.653333 13.653333C904.533333 914.773333 897.706667 921.6 890.88 921.6zM1003.52 877.226667l-225.28 0 0-341.333333 225.28 0L1003.52 877.226667z',
              symbolSize: 40,
              itemStyle: {
                normal: {
                  // color: '#42b983',
                  color: 'rgb(55, 148, 255)',
                }
              },
              deviceInfo: this.list[0].deploymentDesignNodeEntity.deviceEntity
            }
          } else { // 未绑定设备， 绑定了组件
            this.centerDevice = {
              name: '暂未绑定设备',
              symbolSize: 40,
              symbol: 'circle',
              itemStyle: {
                normal: {
                  // color: '#42b983',
                  // color: 'rgb(55, 148, 255)',
                  color: '#ccc'
                }
              },
              deviceInfo: {}
            }
          }
        } else { // 未绑定组件
          if (this.currentNodeInfo.deviceEntity === null) { // 未绑定组件 未绑定设备
            this.centerDevice = {
              name: '暂未绑定设备与组件',
              symbol: 'circle',
              symbolSize: 40,
              itemStyle: {
                normal: {
                  // color: '#42b983',
                  // color: 'rgb(55, 148, 255)',
                  color: '#ccc'
                }
              },
              deviceInfo: {}
            }
          } else {
            this.centerDevice = { // 未绑定组件 绑定了设备
              name: this.currentNodeInfo.deviceEntity.hostAddress + '暂未绑定组件',
              symbol: 'path://M723.626667 853.333333 614.4 853.333333l0-109.226667 112.64 0 0-71.68L71.68 672.426667 71.68 153.6l853.333333 0L925.013333 443.733333l58.026667 0c3.413333 0 10.24 0 13.653333 3.413333L996.693333 129.706667c0-27.306667-20.48-47.786667-47.786667-47.786667L47.786667 81.92C20.48 81.92 0 102.4 0 129.706667l0 566.613333c0 27.306667 20.48 47.786667 47.786667 47.786667l337.92 0L385.706667 853.333333 256 853.333333c-23.893333 0-44.373333 20.48-44.373333 44.373333 0 23.893333 20.48 44.373333 44.373333 44.373333l481.28 0c-6.826667-10.24-10.24-20.48-10.24-30.72L727.04 853.333333 723.626667 853.333333z M993.28 467.626667l-201.386667 0c-17.066667 0-30.72 13.653333-30.72 30.72l0 409.6c0 17.066667 13.653333 30.72 30.72 30.72l201.386667 0c17.066667 0 30.72-13.653333 30.72-30.72l0-409.6C1024 484.693333 1010.346667 467.626667 993.28 467.626667zM890.88 921.6c-6.826667 0-13.653333-6.826667-13.653333-13.653333 0-6.826667 6.826667-13.653333 13.653333-13.653333s13.653333 6.826667 13.653333 13.653333C904.533333 914.773333 897.706667 921.6 890.88 921.6zM1003.52 877.226667l-225.28 0 0-341.333333 225.28 0L1003.52 877.226667z',
              symbolSize: 40,
              itemStyle: {
                normal: {
                  // color: '#42b983',
                  color: 'rgb(55, 148, 255)'
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
        // console.log('detailList=========')
        // console.log(this.detaillist)
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
