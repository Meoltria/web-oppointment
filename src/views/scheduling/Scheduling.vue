<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 挂号平台</el-breadcrumb-item>
        <el-breadcrumb-item>医生排班</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="handle-box">
      <el-cascader :options="orgSelects" :props="defaultProps" v-model="orgSelected"  placeholder="选择科室" @change="handleOrgChange" change-on-select clearable >
      </el-cascader>
      <el-select v-model="listQuery.userId" placeholder="选择医生" clearable >
        <el-option v-for="item in userSelects" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-date-picker v-model="listQuery.surgeryDate" type="date" placeholder="选择出诊日期" >
      </el-date-picker>
      <el-select v-model="listQuery.endTreatCode" placeholder="是否停诊" clearable>
        <el-option v-for="item in endTreatSelects" :key="item.code" :label="item.name" :value="item.code">
        </el-option>
      </el-select>
      <el-button type="primary" icon="search" @click="search">查询</el-button>
      <el-button type="primary" icon="plus" @click="handleCreate">排班</el-button>
      <el-button type="primary" icon="plus" @click="handleBatchCreate">批次排班</el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="正在加载数据..." borde fit highlight-current-row style="width:100%">
      <el-table-column align="center" label="科室">
        <template scope="scope">
          <span>{{scope.row.organazitionName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="医生">
        <template scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="出诊日期" width="120px">
        <template scope="scope">
          <span>{{scope.row.surgeryDate}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="出诊时段">
        <template scope="scope">
          <span>{{scope.row.periodTypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="挂号级别">
        <template scope="scope">
          <span>{{scope.row.registeredRankName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="挂号费">
        <template scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否停诊">
        <template scope="scope">
          <span>{{scope.row.endTreatName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180px">
        <template scope="scope">
          <el-button type="primary" icon="edit" size="small" @click="handleDetail(scope.row)">详细</el-button>
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
        <el-form-item label="功能编码" prop="code">
          <el-input v-model="temp.code"></el-input>
        </el-form-item>
        <el-form-item label="功能名称" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="功能类型" prop="property">
          <el-select v-model="temp.property">
            <el-option v-for="item in propertySelects" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父级功能">
          <el-cascader :options="selects" :props="defaultProps" v-model="tempSelected"  change-on-select>
          </el-cascader>
        </el-form-item>
        <el-form-item label="功能图标">
           <el-input  v-model="temp.icon"></el-input>
        </el-form-item>
        <el-form-item label="功能路径">
          <el-input v-model="temp.path"></el-input>
        </el-form-item>
        <el-form-item label="功能描述">
          <el-input type="textarea" v-model="temp.description"></el-input>
        </el-form-item>
        <el-form-item label="功能排序">
          <el-input v-model="temp.order"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createTemp">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSchedulings, getScheduling, createScheduling, deleteScheduling } from '@/api/scheduling'
import { getOrgTreeByType } from '@/api/orgnazition'
import { getOrgUsersByType } from '@/api/user'
import { getDictonarySelect } from '@/api/dictionary'

export default {
  data () {
    return {
      list: null,
      total: null,
      orgSelects: null,
      orgSelected: [],
      tempOrgSelected: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
      },
      userSelects: null,
      endTreatSelects: null,
      tempUserSelects: null,
      listLoading: true,
      listQuery: {
        OrganazitionId: undefined,
        userId: undefined,
        surgeryDate: undefined,
        endTreatCode: undefined,
        page: 1,
        per_Page: 10
      },
      temp: {
        id: undefined,
        schedulingTypeCode: '',
        schedulingTypeName: '',
        endTreatCode: '',
        endTreatName: '',
        surgeryDate: undefined,
        endTreatDate: undefined,
        recoveryTreatDate: undefined,
        endTreatReason: '',
        maxCount: 0,
        totalCount: 0,
        periodTypeCode: '',
        periodTypeName: '',
        starTime: '',
        endTime: '',
        price: '',
        treatPrice: '',
        plusPrice: '',
        address: '',
        status: '正常'
      },
      rules: {
        code: [
          {required: true, message: '请输入功能编码', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入功能名称', trigger: 'blur'}
        ],
        property: [
          {required: true, message: '请选择功能类型', trigger: 'select'}
        ]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: '单次排班',
        detail: '排班详情'
      }
    }
  },
  created () {
    this.getOrgSelects()
    this.getEndTreatSelects()
    this.listLoading = false
  },
  methods: {
    getOrgSelects () {
      getOrgTreeByType(1, '01').then(response => {
        this.orgSelects = response.data
      })
    },
    getList () {
      this.listLoading = true
      this.listQuery.OrganazitionId = this.orgSelected.length === 0 ? null : this.orgSelected[this.orgSelected.length - 1]
      getSchedulings(this.listQuery).then(response => {
        this.list = response.data
        this.total = parseInt(response.headers['x-totalcount'])
        this.listLoading = false
      })
    },
    getUserSelects () {
      var orgId = this.orgSelected.length === 0 ? null : this.orgSelected[this.orgSelected.length - 1]
      getOrgUsersByType(orgId, '01').then(response => {
        this.userSelects = response.data
      })
    },
    getEndTreatSelects () {
      getDictonarySelect('EndTreat').then(response => {
        this.endTreatSelects = response.data
      })
    },
    getTemp (id) {
      getScheduling(id).then(response => {
        this.temp = {
          id: response.data.id,
          code: response.data.code,
          name: response.data.name,
          parent: response.data.parent,
          icon: response.data.icon,
          path: response.data.path,
          property: response.data.property,
          description: response.data.description,
          order: response.data.order,
          status: response.data.status
        }
      })
    },
    createTemp () {
      this.$refs.temp.validate(valid => {
        if (valid) {
          this.temp.parent = this.tempSelected[this.tempSelected.length - 1]
          createScheduling(this.temp).then(response => {
            if (response.status === 201) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 3000
              })
              this.getSelects()
              this.getList()
            }
          })
        } else {
          return false
        }
      })
    },
    deleteTemp (id) {
      deleteScheduling(id).then(response => {
        if (response.status === 204) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 3000
          })
          this.getSelects()
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
        parent: 0,
        icon: '',
        path: '',
        property: '',
        description: '',
        order: 0,
        status: '正常'
      }
    },
    handleOrgChange () {
      this.getUserSelects()
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
      this.tempSelected = this.selected
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleDetail (row) {
      this.getTemp(row.id)
      this.tempSelected = this.selected
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
