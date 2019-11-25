<template>
  <div>
    <el-input v-model="searchQuery" style="width: 260px;margin: 0 0 20px 10px;">

    </el-input>
    <el-tree class="filter-tree" :data="treeList"
             :props="defaultProps"
             :default-expand-all="false"
             :render-content="renderContent"
             :filter-node-method="filterNode"
             @node-contextmenu = "rightClick"
             ref="tree">
    </el-tree>
  </div>
</template>

<script>
  /*eslint-disable*/
  import { getFileTree } from "@/api/sublibFiles"
  export default {
    name: 'libraryTree',
    data() {
      return {
        treeList: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        searchQuery: ''
      }
    },
    methods: {
      getTreeList() {
        getFileTree().then((res) => {
          if(res.data.code === 0) {
            this.treeList = res.data.data
            this.treeList.forEach((item) => {
              item.name = item.library.type
              item.icon = 'library'
              item.sublibraryLibraries.forEach((child) => {
                child.icon = 'sublib'
                child.name = child.sublibraryLibrary.type
                /*child.forEach((subLibItem) => {
                  child.children = subLibItem.sublibraryLibraryFiles
                })*/
                child.children = child.sublibraryLibraryFiles
              })
              item.children = item.sublibraryLibraries
            })
          }
        })
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      rightClick(event, data, node, self) {
        console.log(node)
        if(node.data.sublibraryLibraryFiles) {
          this.$router.push({
            path: '/sublibFiles',
            name: 'subLibFiles',
            params: {
              id: node.data.sublibraryLibrary.id
            },
            query: {
              name: node.data.sublibraryLibrary.type
            }
          })
        } else {
          return
        }
      },
      renderContent(h, { node, data, store }) {
        if(data.icon) {
          return (
            <span>
            <svg-icon icon-class={data.icon} style="margin-right:6px;font-size:18px;"></svg-icon>
            <span style="color:#555;font-size:12px;">{node.label}</span>
            </span>
          )
        } else {
          return (
            <span>
            <svg-icon icon-class='documentation' style="margin-right:6px;font-size:18px;color:#409EFF;"></svg-icon>
            <span style="color:#555;font-size:12px;">{node.label}</span>
            </span>
          )
        }
      },
    },
    created() {
      this.getTreeList()
    },
    watch: {
      searchQuery(val) {
        this.$refs.tree.filter(val);
      }
    }
  }
</script>

<style scoped>

</style>
