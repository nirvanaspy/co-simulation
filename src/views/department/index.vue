<template>
  <div class="department-cont">
    <div class="department-operation">
      <span class="editor-create" @click="handleAddDepartment()">
        <svg-icon icon-class="create"></svg-icon>
    </span>
    </div>
    <el-row>
      <el-col :span="6" v-for="(item, index) in departmentList" :key="index" :offset="(index)%3 == 0 ? 0 : 3"
              style="margin-bottom: 30px;">
        <el-card :body-style="{ padding: '0px',background:'#fff'}" shadow="hover">
          <span class="department-icon"><svg-icon icon-class="department"></svg-icon></span>
          <div style="padding: 14px;position: relative;">
            <div class="department-name">部门名称: {{item.name}}</div>
            <div class="department-name">描述: {{item.description}}</div>
            <div class="bottom clearfix department-edit-box" v-if="item.name !== '信息化部'">
              <span @click="handleEditDepartment(item)"
                    class="department-edit">
                <svg-icon icon-class="edit"></svg-icon>
              </span>
              <span @click="handleDeleteDepartment(item.id)"
                    class="department-delete">
                <svg-icon icon-class="delete"></svg-icon>
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="新建部门"
               class="createDialog"
               :visible.sync="createDialogVisible"
               width="30%">
      <el-form label-position="left" label-width="80px" :model="createDpInfo">
        <el-form-item label="部门名">
          <el-input v-model="createDpInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="createDpInfo.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
         <el-button @click="createDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="addDepa">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑部门-->
    <el-dialog title="编辑部门"
               class="editDialog"
               :visible.sync="editDialogVisible"
               width="30%">
      <el-form label-position="left" label-width="80px" :model="editInfo">
        <el-form-item label="部门名称">
          <el-input v-model="editInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="部门描述">
          <el-input v-model="editInfo.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDepartment()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  /*eslint-disable*/
  import { getDepartment, addDepartment, deleteDepartment, modifyDepartment } from '@/api/department'
  export default {
    name: 'department',
    data() {
      return {
        departmentList: [],
        createDialogVisible: false,
        editDialogVisible: false,
        createDpInfo: {
          name: '',
          description: ''
        },
        editInfo: {

        }
      }
    },
    methods: {
      getDepartmentList() {
        getDepartment().then((res) => {
          if (res.data.code === 0) {
            this.departmentList = res.data.data
          }
        })
      },
      handleAddDepartment() {
        this.createDialogVisible = true
      },
      handleEditDepartment(item) {
        this.editDialogVisible = true
        this.editInfo = Object.assign({}, item)
      },
      handleDeleteDepartment(id) {
        this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDepartment(id).then((res) => {
            if(res.data.code === 0) {
              this.getDepartmentList()
              this.$notify({
                title: '成功',
                message: '删除成功',
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
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      addDepa() {
        let data = {
          'name': this.createDpInfo.name,
          'description': this.createDpInfo.description
        }
        addDepartment(data).then((res) => {
          if(res.data.code === 0) {
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getDepartmentList()
            this.createDialogVisible = false
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
      editDepartment() {
        let data = {
          'name': this.editInfo.name,
          'description': this.editInfo.description
        }
        modifyDepartment(this.editInfo.id, data).then((res) => {
          if(res.data.code === 0) {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            this.getDepartmentList()
            this.createDialogVisible = false
          } else {
            this.$notify({
              title: '失败',
              message: res.data.msg,
              type: 'error',
              duration: 2000
            })
          }
        })
      }
    },
    created() {
      this.getDepartmentList()
    }
  }
</script>

<style lang="scss" scoped>
  .department-cont {
    padding: 20px;
    .department-operation {
      height: 30px;
      line-height: 30px;
      .editor-create {
        float: right;
        color: #12d0d5;
        cursor: pointer;
        font-size: 20px;
      }
    }
    .department-icon {
      display: block;
      width: 100%;
      height: 48px;
      padding-left: 10px;
      background: #c5d9ff;
      font-size: 40px;
    }
    .department-edit-box {
      position: absolute;
      top: -40px;
      right: 10px;
    }
    .department-edit {
      // color: rgb(240, 173, 48);
      color: #4a7de6;
      cursor: pointer;
    }

    .department-delete {
      color: rgb(233, 102, 44);
      cursor: pointer;
    }

    .department-name, .department-description{
      padding: 4px 0;
      color: #777;
      font-weight: 500;
      font-size: 14px;
    }
  }
</style>
