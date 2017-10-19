<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 挂号平台</el-breadcrumb-item>
        <el-breadcrumb-item>预约取号</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="handle-box">
      <el-cascader :options="orgSelects" :props="defaultProps" v-model="orgSelected"  placeholder="选择科室" @change="handleOrgChange" change-on-select clearable >
      </el-cascader>
      <el-select v-model="listQuery.userId" placeholder="选择医生" clearable class="handle-select">
        <el-option v-for="item in userSelects" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-date-picker v-model="listQuery.doctorDate" type="date" placeholder="预约就诊日期" @change="setListQueryDoctorDate" class="handle-select">
      </el-date-picker>
      <el-input v-model="listQuery.name" placeholder="患者姓名" class="handle-input"></el-input>
      <el-input v-model="listQuery.orderId" placeholder="预约订单号" class="handle-input"></el-input>
      <el-select v-model="listQuery.registeredStateCode" placeholder="挂号状态" clearable class="handle-select">
        <el-option v-for="item in registeredStateSelects" :key="item.code" :label="item.name" :value="item.code">
        </el-option>
      </el-select>
      <el-button type="primary" icon="search" @click="search">查询</el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="正在加载数据..." borde fit highlight-current-row style="width:100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="预约科室">
               <span>{{scope.row.organazitionName}}</span>
            </el-form-item>
            <el-form-item label="预约医生">
               <span>{{scope.row.userName}}</span>
            </el-form-item>
            <el-form-item label="挂号类别">
               <span>{{scope.row.registeredTypeName}}</span>
            </el-form-item>
             <el-form-item label="挂号费(分)">
               <span>{{scope.row.price}}</span>
            </el-form-item>
            <el-form-item label="诊疗费(分)">
               <span>{{scope.row.treatPrice}}</span>
            </el-form-item>
            <el-form-item label="加收费(分)">
               <span>{{scope.row.plusPrice}}</span>
            </el-form-item>
            <el-form-item label="预约订单号">
               <span>{{scope.row.orderId}}</span>
            </el-form-item>
            <el-form-item label="预约日期">
               <span>{{scope.row.doctorDate | formatDate }}</span>
            </el-form-item>
            <el-form-item label="预约时间">
               <span>{{scope.row.doctorTime}}</span>
            </el-form-item>
            <el-form-item label="患者姓名">
               <span>{{scope.row.name}}</span>
            </el-form-item>
            <el-form-item label="手机号">
               <span>{{scope.row.phone}}</span>
            </el-form-item>
            <el-form-item label="身份证号">
               <span>{{scope.row.idCard}}</span>
            </el-form-item>
            <el-form-item label="患者性别">
               <span>{{scope.row.genderName}}</span>
            </el-form-item>
            <el-form-item label="患者生日">
               <span>{{scope.row.birth}}</span>
            </el-form-item>
            <el-form-item label="就诊地址">
               <span>{{scope.row.address}}</span>
            </el-form-item>
            <el-form-item label="预约来源">
               <span>{{scope.row.fromType}}</span>
            </el-form-item>
            <el-form-item label="医保类别">
               <span>{{scope.row.medicalInsuranceName}}</span>
            </el-form-item>
            <el-form-item label="患者卡类型">
               <span>{{scope.row.cardTypeName}}</span>
            </el-form-item>
            <el-form-item label="患者卡号">
               <span>{{scope.row.cardNo}}</span>
            </el-form-item>
            <el-form-item label="患者类别">
               <span>{{scope.row.medicalTypeName}}</span>
            </el-form-item>
            <el-form-item label="挂号状态">
               <span>{{scope.row.registeredStateName}}</span>
            </el-form-item>
            <el-form-item label="取号时间">
               <span>{{scope.row.registeredDate | formatDateTime}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" label="患者姓名" width="120px">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别" width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.genderName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="预约日期">
        <template slot-scope="scope">
          <span>{{scope.row.doctorDate | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="预约时间">
        <template slot-scope="scope">
          <span>{{scope.row.doctorTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="预约科室">
        <template slot-scope="scope">
          <span>{{scope.row.organazitionName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="预约医生">
        <template slot-scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="挂号状态">
        <template slot-scope="scope">
          <span>{{scope.row.registeredStateName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180px">
        <template slot-scope="scope">
          <el-button v-if="scope.row.registeredStateCode==0" type="success" icon="circle-check" size="small" @click="handleTake(scope.row)">取号</el-button>
        </template>
      </el-table-column>
    </el-table>

     <div v-show="!listLoading" class="pagination">
      <el-pagination :page-sizes="[10,15,20,30]" :page-size="listQuery.per_Page"  layout="total, sizes, prev, pager, next" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page="listQuery.page" :current-page.sync="listQuery.page" :total='total'>
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getRegistereds, takeRegistered } from '@/api/registered'
import { getOrgTreeByType } from '@/api/orgnazition'
import { getOrgUsersByType } from '@/api/user'
import { getDictonarySelect } from '@/api/dictionary'
import { formatDate } from '@/utils/date'

export default {
  data () {
    return {
      list: null,
      total: null,
      orgSelects: null,
      orgSelected: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
      },
      userSelects: null,
      registeredStateSelects: null,
      listLoading: true,
      listQuery: {
        OrganazitionId: undefined,
        userId: undefined,
        name: undefined,
        orderId: undefined,
        doctorDate: undefined,
        registeredStateCode: undefined,
        page: 1,
        per_Page: 10
      }
    }
  },
  filters: {
    formatDate (time) {
      if (time === null) {
        return ''
      } else {
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd')
      }
    },
    formatDateTime (time) {
      if (time === null) {
        return ''
      } else {
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
    }
  },
  created () {
    this.getOrgSelects()
    this.getRegisteredStateSelects()
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
      getRegistereds(this.listQuery).then(response => {
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
    getRegisteredStateSelects () {
      getDictonarySelect('RegisteredState').then(response => {
        this.registeredStateSelects = response.data
      })
    },
    setListQueryDoctorDate (val) {
      this.listQuery.doctorDate = val
    },
    takeRegistered (id) {
      takeRegistered(id).then(response => {
        if (response.status === 204) {
          this.$notify({
            title: '成功',
            message: '取号成功',
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
    handleTake (row) {
      this.$confirm('确定要取号？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        this.takeRegistered(row.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消取号!'
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
    width: 150px;
  }

  .handle-input{
    width: 180px;
    display: inline-block;
  }

  .table-expand {
    font-size: 0;
  }
  .table-expand label {
    width: 180px;
    color: #99a9bf;
  }
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 33%;
  }
</style>
