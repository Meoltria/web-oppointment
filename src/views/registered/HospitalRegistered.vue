<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 挂号平台</el-breadcrumb-item>
        <el-breadcrumb-item>预约挂号</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="handle-box">
      <el-cascader :options="orgSelects" :props="defaultProps" v-model="orgSelected"  placeholder="选择科室" @change="handleOrgChange" change-on-select clearable >
      </el-cascader>
      <el-select v-model="listQuery.userId" placeholder="选择医生" clearable >
        <el-option v-for="item in userSelects" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-date-picker v-model="listQuery.surgeryDate" type="date" placeholder="选择就诊日期" @change="setListQuerySurgeryDate">
      </el-date-picker>
      <el-select v-model="listQuery.endTreatCode" placeholder="是否停诊" clearable>
        <el-option v-for="item in endTreatSelects" :key="item.code" :label="item.name" :value="item.code">
        </el-option>
      </el-select>
      <el-button type="primary" icon="search" @click="search">查询</el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="正在加载数据..." borde fit highlight-current-row style="width:100%">
      <el-table-column type="expand">
        <template scope="scope">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="科室">
               <span>{{scope.row.organazitionName}}</span>
            </el-form-item>
            <el-form-item label="医生">
               <span>{{scope.row.userName}}</span>
            </el-form-item>
            <el-form-item label="出诊日期">
               <span>{{scope.row.surgeryDate | formatDate}}</span>
            </el-form-item>
            <el-form-item label="班次时段">
               <span>{{scope.row.periodTypeName}}</span>
            </el-form-item>
            <el-form-item label="开始时间">
               <span>{{scope.row.startTime}}</span>
            </el-form-item>
            <el-form-item label="结束时间">
               <span>{{scope.row.endTime}}</span>
            </el-form-item>
            <el-form-item label="医生职称">
               <span>{{scope.row.userRankName}}</span>
            </el-form-item>
            <el-form-item label="挂号级别">
               <span>{{scope.row.registeredRankName}}</span>
            </el-form-item>
            <el-form-item label="最大预约数">
               <span>{{scope.row.maxCount}}</span>
            </el-form-item>
            <el-form-item label="剩余预约数">
               <span>{{scope.row.remainCount}}</span>
            </el-form-item>
            <el-form-item label="总放号量">
               <span>{{scope.row.totalCount}}</span>
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
            <el-form-item label="就诊地址">
               <span>{{scope.row.address}}</span>
            </el-form-item>
            <el-form-item label="是否停诊">
               <span>{{scope.row.endTreatName}}</span>
            </el-form-item>
            <el-form-item label="停诊原因">
               <span>{{scope.row.endTreatReason}}</span>
            </el-form-item>
            <el-form-item label="停诊时间">
               <span>{{scope.row.endTreatDate | formatDateTime}}</span>
            </el-form-item>
            <el-form-item label="复诊时间">
               <span>{{scope.row.recoveryTreatDate | formatDateTime}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
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
          <span>{{scope.row.surgeryDate | formatDate }}</span>
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
      <el-table-column align="center" label="挂号费(分)">
        <template scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否停诊">
        <template scope="scope">
          <span>{{scope.row.endTreatName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="剩余预约数">
        <template scope="scope">
          <span>{{scope.row.remainCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180px">
        <template scope="scope">
          <el-button v-if="scope.row.endTreatCode==0 && scope.row.remainCount > 0" type="success" icon="circle-check" size="small" @click="handleCreate(scope.row)">预约</el-button>
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
import { getSchedulings } from '@/api/scheduling'
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
      endTreatSelects: null,
      listLoading: true,
      listQuery: {
        OrganazitionId: undefined,
        userId: undefined,
        surgeryDate: undefined,
        endTreatCode: undefined,
        page: 1,
        per_Page: 10
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: '预约挂号'
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
    setListQuerySurgeryDate (val) {
      this.list.surgeryDate = val
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
    handleCreate () {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
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