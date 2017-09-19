<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 系统设置</el-breadcrumb-item>
        <el-breadcrumb-item>医院信息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="handle-box">
      <el-input v-model="listQuery.name" placeholder="医院名称" class="handle-input"></el-input>
      <el-button type="primary" icon="search" @click="search">查询</el-button>
      <el-button type="primary" icon="plus" @click="handleCreate">添加</el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="正在加载数据..." borde fit highlight-current-row style="width:100%">
      <el-table-column align="center" label="医院编码" width="120px">
        <template scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="医院名称">
        <template scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="接入类型" width="120px">
        <template scope="scope">
          <span>{{scope.row.accessTypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="医院地址">
        <template scope="scope">
          <span>{{scope.row.address}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180px">
        <template scope="scope">
          <el-button type="primary" icon="edit" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" icon="delete" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination">
      <el-pagination :page-sizes="[10,15,20,30]" :page-size="listQuery.per_Page"  layout="total, sizes, prev, pager, next" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page="listQuery.page" :current-page.sync="listQuery.page" :total='total'>
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="temp" :rules="rules" ref="temp" label-position="left" label-width="120px" style='width: 450px; margin-left:50px;'>
        <el-form-item label="医院编码" prop="code">
          <el-input v-model="temp.code"></el-input>
        </el-form-item>
        <el-form-item label="医院名称" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="接入方式" prop="accessTypeCode">
          <el-select v-model="temp.accessTypeCode">
            <el-option v-for="item in selects" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="医院地址">
          <el-input type="textarea" v-model="temp.address"></el-input>
        </el-form-item>
        <el-form-item label="介绍信息">
          <el-input type="textarea" v-model="temp.info"></el-input>
        </el-form-item>
        <el-form-item label="医院Logo">
          <el-input v-model="temp.logoUrl"></el-input>
        </el-form-item>
        <el-form-item label="医院图片">
          <el-input v-model="temp.picUrl"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createTemp">确 定</el-button>
        <el-button v-if="dialogStatus=='edit'" type="primary" @click="updateTemp">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getHospitals, getHospital, createHospital, updateHospital, deleteHospital } from '@/api/hospital'
import { getDictonarySelect } from '@/api/dictionary'

export default {
  data () {
    return {
      list: null,
      total: null,
      selects: null,
      listLoading: true,
      listQuery: {
        name: undefined,
        page: 1,
        per_Page: 10
      },
      temp: {
        id: undefined,
        code: '',
        name: '',
        accessTypeCode: '',
        accessTypeName: '',
        address: '',
        info: '',
        logoUrl: '',
        picUrl: '',
        status: '正常'
      },
      rules: {
        code: [
          {required: true, message: '请输入医院编码', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入医院名称', trigger: 'blur'}
        ],
        accessTypeCode: [
          {required: true, message: '请选择接入方式', trigger: 'select'}
        ]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: '创建医院',
        edit: '编辑医院'
      }
    }
  },
  created () {
    this.getList()
    this.getSelects()
  },
  methods: {
    getList () {
      this.listLoading = true
      getHospitals(this.listQuery).then(response => {
        this.list = response.data
        this.total = parseInt(response.headers['x-totalcount'])
        this.listLoading = false
      })
    },
    getSelects () {
      getDictonarySelect('AccessType').then(response => {
        this.selects = response.data
      })
    },
    getTemp (id) {
      getHospital(id).then(response => {
        this.temp = {
          id: response.data.id,
          code: response.data.code,
          name: response.data.name,
          accessTypeCode: response.data.accessTypeCode,
          accessTypeName: response.data.accessTypeName,
          address: response.data.address,
          info: response.data.info,
          logoUrl: response.data.logoUrl,
          picUrl: response.data.picUrl,
          status: response.data.status
        }
      })
    },
    createTemp () {
      this.$refs.temp.validate(valid => {
        if (valid) {
          this.temp.accessTypeName = this.selects.find(item => item.code === this.temp.accessTypeCode).name
          createHospital(this.temp).then(response => {
            if (response.status === 201) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 3000
              })
              this.getList()
            }
          })
        } else {
          return false
        }
      })
    },
    updateTemp () {
      this.$refs.temp.validate(valid => {
        if (valid) {
          this.temp.accessTypeName = this.selects.find(item => item.code === this.temp.accessTypeCode).name
          updateHospital(this.temp).then(response => {
            if (response.status === 204) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 3000
              })
              this.getList()
            }
          })
        } else {
          return false
        }
      })
    },
    deleteTemp (id) {
      deleteHospital(id).then(response => {
        if (response.status === 204) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 3000
          })
          this.getList()
        }
      })
    },
    search () {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp () {
      this.temp = {
        id: undefined,
        code: '',
        name: '',
        accessTypeCode: '',
        accessTypeName: '',
        address: '',
        info: '',
        logoUrl: '',
        picUrl: '',
        status: '正常'
      }
    },
    handleSizeChange (val) {
      this.listQuery.per_Page = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
    handleCreate () {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleEdit (row) {
      this.getTemp(row.id)
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
    },
    handleDelete (row) {
      this.$confirm('确定要删除当前信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteTemp(row.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除!'
        })
      })
    }
  }
}
</script>

<style scoped>
.handle-box{
  margin-bottom: 20px;
}

.handle-select{
  width: 120px;
}

.handle-input{
  width: 180px;
  display: inline-block;
}

</style>
