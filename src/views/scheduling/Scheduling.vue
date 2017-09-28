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
      <el-date-picker v-model="listQuery.surgeryDate" type="date" placeholder="选择出诊日期" @change="setListQuerySurgeryDate">
      </el-date-picker>
      <el-select v-model="listQuery.endTreatCode" placeholder="是否停诊" clearable>
        <el-option v-for="item in endTreatSelects" :key="item.code" :label="item.name" :value="item.code">
        </el-option>
      </el-select>
      <el-button type="primary" icon="search" @click="search">查询</el-button>
      <el-button type="primary" icon="plus" @click="handleCreate">排班</el-button>
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
      <el-table-column align="center" label="操作" width="180px">
        <template scope="scope">
          <el-button v-if="scope.row.endTreatCode==0" type="warning" icon="circle-close" size="small" @click="handleEndTreat(scope.row)">停诊</el-button>
          <el-button v-if="scope.row.endTreatCode==1" type="success" icon="circle-check" size="small" @click="handleRecoveryTreat(scope.row)">复诊</el-button>
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
        <el-form-item label="科室">
          <el-cascader :options="orgSelects" :props="defaultProps" v-model="tempOrgSelected"  placeholder="选择科室" @change="handleTempOrgChange" change-on-select clearable >
          </el-cascader>
        </el-form-item>
        <el-form-item label="医生" prop="userId">
          <el-select v-model.number="temp.userId" placeholder="选择医生" clearable @change="handleTempUserChange">
            <el-option v-for="item in tempUserSelects" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出诊日期" prop="surgeryDate">
          <el-date-picker v-model="temp.surgeryDate" type="date" placeholder="出诊日期" @change="setTempSurgeryDate">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="班次时段" prop="periodTypeCode">
          <el-select v-model="temp.periodTypeCode">
            <el-option v-for="item in periodTypeSelects" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-time-select v-model="temp.startTime" :picker-options="{start: '08:00',step: '00:30',end: '18:00'}" placeholder="开始时间">
          </el-time-select>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-time-select v-model="temp.endTime" :picker-options="{start: '08:00',step: '00:30',end: '18:00',minTime: temp.startTime}" placeholder="结束时间">
          </el-time-select>
        </el-form-item>
        <el-form-item label="最大预约数" prop="maxCount">
          <el-input  v-model.number="temp.maxCount"></el-input>
        </el-form-item>
        <el-form-item label="总放号量" prop="totalCount">
           <el-input  v-model.number="temp.totalCount"></el-input>
        </el-form-item>
        <el-form-item label="挂号费(分)" prop="price">
          <el-input v-model.number="temp.price"></el-input>
        </el-form-item>
        <el-form-item label="诊疗费(分)" prop="treatPrice">
          <el-input v-model.number="temp.treatPrice"></el-input>
        </el-form-item>
        <el-form-item label="加收费(分)" prop="plusPrice">
          <el-input v-model.number="temp.plusPrice"></el-input>
        </el-form-item>
        <el-form-item label="就诊地址">
          <el-input type="textarea" v-model="temp.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createTemp">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogEndTreatVisible">
      <el-form class="small-space" :model="endTreateTemp" :rules="endRules" ref="endTreateTemp" label-position="left" label-width="120px" style='width: 450px; margin-left:50px;'>
        <el-form-item label="停诊原因" prop="endTreatReason">
          <el-input type="textarea" v-model="endTreateTemp.endTreatReason"></el-input>
        </el-form-item>
        <el-form-item label="是否发送短信">
          <el-radio-group v-model="endTreateTemp.isSms">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发送日期">
          <el-date-picker v-model="endTreateTemp.smsDate" type="date" placeholder="发送日期" @change="setEndTreatSmsDate">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发送时间">
          <el-time-select v-model="endTreateTemp.smsTime" :picker-options="{start: '08:00',step: '00:30',end: '18:00'}" placeholder="发送时间">
          </el-time-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEndTreatVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='endTreat'" type="primary" @click="endTreat">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogRecoveryVisible">
      <el-form class="small-space" :model="recoveryTreateTemp" label-position="left" label-width="120px" style='width: 450px; margin-left:50px;'>
        <el-form-item label="是否发送短信">
          <el-radio-group v-model="recoveryTreateTemp.isSms">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发送日期">
          <el-date-picker v-model="recoveryTreateTemp.smsDate" type="date" placeholder="发送日期" @change="setRecoveryTreatSmsDate">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发送时间">
          <el-time-select v-model="recoveryTreateTemp.smsTime" :picker-options="{start: '08:00',step: '00:30',end: '18:00'}" placeholder="发送时间">
          </el-time-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRecoveryVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='recoveryTreat'" type="primary" @click="recoveryTreate">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getSchedulings, createScheduling, deleteScheduling, endTreatScheduling, recoveryTreatScheduling } from '@/api/scheduling'
import { getOrgTreeByType, getOrg } from '@/api/orgnazition'
import { getOrgUsersByType, getUser } from '@/api/user'
import { getDictonarySelect, getDictonaryByTypeAndCode } from '@/api/dictionary'
import { formatDate } from '@/utils/date'

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
      periodTypeSelects: null,
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
        userId: undefined,
        surgeryDate: undefined,
        schedulingDate: undefined,
        endTreatDate: undefined,
        recoveryTreatDate: undefined,
        endTreatReason: '',
        maxCount: 0,
        totalCount: 0,
        periodTypeCode: '',
        periodTypeName: '',
        startTime: '',
        endTime: '',
        price: 0,
        treatPrice: 0,
        plusPrice: 0,
        address: '',
        status: '正常'
      },
      rules: {
        userId: [
          {required: true, message: '请选择医生'}
        ],
        surgeryDate: [
          {required: true, message: '请选择出诊日期', trigger: 'change'}
        ],
        periodTypeCode: [
          {required: true, message: '请选择班次时段', trigger: 'change'}
        ],
        startTime: [
          {required: true, message: '请选择开始时间', trigger: 'change'}
        ],
        endTime: [
          {required: true, message: '请选择结束时间', trigger: 'change'}
        ],
        maxCount: [
          {required: true, message: '最大预约数不能为空'},
          {type: 'number', message: '最大预约数必须为数字'}
        ],
        totalCount: [
          {required: true, message: '放号总量不能为空'},
          {type: 'number', message: '放号总量必须为数字'}
        ],
        price: [
          {required: true, message: '挂号费不能为空'},
          {type: 'number', message: '挂号费必须为数字'}
        ],
        treatPrice: [
          {required: true, message: '诊疗费不能为空'},
          {type: 'number', message: '诊疗费必须为数字'}
        ],
        plusPrice: [
          {required: true, message: '加收费不能为空'},
          {type: 'number', message: '加收费必须为数字'}
        ]
      },
      endTreateTemp: {
        id: undefined,
        endTreatReason: '',
        isSms: '0',
        smsDate: '',
        smsTime: ''
      },
      endRules: {
        endTreatReason: [
          {required: true, message: '请输入停诊原因', trigger: 'blur'}
        ]
      },
      recoveryTreateTemp: {
        id: undefined,
        isSms: '0',
        smsDate: '',
        smsTime: ''
      },
      dialogFormVisible: false,
      dialogEndTreatVisible: false,
      dialogRecoveryVisible: false,
      dialogStatus: '',
      textMap: {
        create: '单次排班',
        batch: '批量排班',
        endTreat: '停诊',
        recoveryTreat: '复诊'
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
    this.getPeriodTypeSelects()
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
    getTempUserSelects () {
      var orgId = this.tempOrgSelected.length === 0 ? null : this.tempOrgSelected[this.tempOrgSelected.length - 1]
      getOrgUsersByType(orgId, '01').then(response => {
        this.tempUserSelects = response.data
      })
    },
    getEndTreatSelects () {
      getDictonarySelect('EndTreat').then(response => {
        this.endTreatSelects = response.data
      })
    },
    getPeriodTypeSelects () {
      getDictonarySelect('PeriodType').then(response => {
        this.periodTypeSelects = response.data
      })
    },
    setTempPrice () {
      var userId = this.temp.userId
      console.log(userId)
      if (userId !== null && userId !== undefined && userId !== 0) {
        getUser(userId).then(response => {
          var registeredRankCode = response.data.registeredRankCode
          if (registeredRankCode !== undefined) {
            getDictonaryByTypeAndCode('RegisteredRank', registeredRankCode).then(resp => {
              this.temp.price = parseInt(resp.data.remarkValue)
            })
          }
        })
      }
    },
    setTempAddress () {
      var orgId = this.tempOrgSelected.length === 0 ? null : this.tempOrgSelected[this.tempOrgSelected.length - 1]
      if (orgId !== null && orgId !== undefined && orgId !== 0) {
        getOrg(orgId).then(response => {
          this.temp.address = response.data.address
        })
      }
    },
    setTempSurgeryDate (val) {
      this.temp.surgeryDate = val
    },
    setListQuerySurgeryDate (val) {
      this.listQuery.surgeryDate = val
    },
    setEndTreatSmsDate (val) {
      this.endTreateTemp.smsDate = val
    },
    setRecoveryTreatSmsDate (val) {
      this.recoveryTreateTemp.smsDate = val
    },
    createTemp () {
      this.$refs.temp.validate(valid => {
        if (valid) {
          this.temp.periodTypeName = this.periodTypeSelects.find(item => item.code === this.temp.periodTypeCode).name
          createScheduling(this.temp).then(response => {
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
    deleteTemp (id) {
      deleteScheduling(id).then(response => {
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
    endTreat () {
      this.$refs.endTreateTemp.validate(valid => {
        if (valid) {
          endTreatScheduling(this.endTreateTemp).then(response => {
            if (response.status === 204) {
              this.dialogEndTreatVisible = false
              this.$notify({
                title: '成功',
                message: '停诊成功',
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
    recoveryTreate () {
      recoveryTreatScheduling(this.recoveryTreateTemp).then(response => {
        if (response.status === 204) {
          this.dialogRecoveryVisible = false
          this.$notify({
            title: '成功',
            message: '复诊成功',
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
        schedulingTypeCode: '1',
        schedulingTypeName: '医生排班',
        endTreatCode: '0',
        endTreatName: '未停诊',
        userId: undefined,
        surgeryDate: undefined,
        schedulingDate: undefined,
        endTreatDate: undefined,
        recoveryTreatDate: undefined,
        endTreatReason: '',
        maxCount: 0,
        totalCount: 0,
        periodTypeCode: '',
        periodTypeName: '',
        startTime: '',
        endTime: '',
        price: 0,
        treatPrice: 0,
        plusPrice: 0,
        address: '',
        status: '正常'
      }
    },
    resetEndTreatTemp () {
      this.endTreateTemp = {
        id: undefined,
        endTreatReason: '',
        isSms: 0,
        smsDate: '',
        smsTime: ''
      }
    },
    resetRecoveryTreateTemp () {
      this.recoveryTreateTemp = {
        id: undefined,
        isSms: 0,
        smsDate: '',
        smsTime: ''
      }
    },
    handleOrgChange () {
      this.getUserSelects()
    },
    handleTempOrgChange () {
      this.getTempUserSelects()
      this.setTempAddress()
    },
    handleTempUserChange () {
      this.setTempPrice()
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
      this.tempOrgSelected = this.orgSelected
      this.dialogStatus = 'create'
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
    },
    handleEndTreat (row) {
      this.resetEndTreatTemp()
      this.endTreateTemp.id = row.id
      this.dialogStatus = 'endTreat'
      this.dialogEndTreatVisible = true
    },
    handleRecoveryTreat (row) {
      this.resetRecoveryTreateTemp()
      this.recoveryTreateTemp.id = row.id
      this.dialogStatus = 'recoveryTreat'
      this.dialogRecoveryVisible = true
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
