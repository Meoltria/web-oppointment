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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="temp" :rules="rules" ref="temp" label-position="left" label-width="120px" style='width: 450px; margin-left:50px;'>
        <el-form-item label="预约科室">
          <el-input v-model="organazitionName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="预约医生" >
          <el-input v-model="userName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="就诊日期" prop="doctorDate">
          <el-input v-model="temp.doctorDate" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="就诊时间" prop="doctorTime">
          <el-select v-model="temp.doctorTime">
            <el-option v-for="item in doctorTimeSelects" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="挂号类别" prop="registeredTypeCode">
          <el-select v-model="temp.registeredTypeCode">
            <el-option v-for="item in registeredTypeSelects" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="患者姓名" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="temp.phone"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="iDCard">
          <el-input v-model="temp.iDCard"></el-input>
        </el-form-item>
        <el-form-item label="患者性别" prop="genderCode">
          <el-select v-model="temp.genderCode">
            <el-option v-for="item in genderSelects" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="患者地址" prop="address">
          <el-input type="textarea" v-model="temp.address"></el-input>
        </el-form-item>
        <el-form-item label="患者生日" prop="birth">
          <el-input v-model="temp.birth"></el-input>
        </el-form-item>
        <el-form-item label="患者来源" prop="fromType">
          <el-input  v-model="temp.fromType"></el-input>
        </el-form-item>
        <el-form-item label="医保类型" prop="medicalInsuranceCode">
          <el-select v-model="temp.medicalInsuranceCode">
            <el-option v-for="item in medicalInsuranceSelects" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卡类型" prop="cardTypeCode">
          <el-select v-model="temp.cardTypeCode">
            <el-option v-for="item in cardTypeSelects" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="患者卡号" prop="cardNo">
          <el-input  v-model="temp.cardNo"></el-input>
        </el-form-item>
        <el-form-item label="患者类别" prop="medicalTypeCode">
          <el-select v-model="temp.medicalTypeCode">
            <el-option v-for="item in medicalTypeSelects" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
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
import { createRegistered } from '@/api/registered'
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
      doctorTimeSelects: [{
        code: '上午',
        name: '上午'
      }, {
        code: '下午',
        name: '下午'
      }],
      registeredTypeSelects: null,
      genderSelects: null,
      medicalInsuranceSelects: null,
      cardTypeSelects: null,
      medicalTypeSelects: null,
      listLoading: true,
      listQuery: {
        OrganazitionId: undefined,
        userId: undefined,
        surgeryDate: undefined,
        endTreatCode: undefined,
        page: 1,
        per_Page: 10
      },
      organazitionName: '',
      userName: '',
      temp: {
        id: undefined,
        schedulingId: undefined,
        doctorDate: undefined,
        doctorTime: '',
        registeredDate: undefined,
        registeredTypeCode: '',
        registeredTypeName: '',
        name: '',
        phone: '',
        iDCard: '',
        genderCode: '',
        genderName: '',
        address: '',
        birth: '',
        fromType: '',
        medicalInsuranceCode: '',
        medicalInsuranceName: '',
        cardTypeCode: '',
        cardTypeName: '',
        cardNo: '',
        medicalTypeCode: '',
        medicalTypeName: '',
        registeredStateCode: '0',
        registeredStateName: '待就诊',
        status: '正常'
      },
      rules: {
        schedulingId: [
          {required: true, message: '请选择预约班次'}
        ],
        doctorDate: [
          {required: true, message: '请输入就诊日期', trigger: 'blur'}
        ],
        doctorTime: [
          {required: true, message: '请选择就诊时间', trigger: 'change'}
        ],
        registeredTypeCode: [
          {required: true, message: '请选择挂号类别', trigger: 'change'}
        ],
        name: [
          {required: true, message: '请输入患者姓名', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入患者手机号', trigger: 'blur'}
        ],
        iDCard: [
          {required: true, message: '请输入患者身份证号', trigger: 'blur'}
        ],
        genderCode: [
          {required: true, message: '请选择患者性别', trigger: 'change'}
        ],
        address: [
          {required: true, message: '请输入患者地址', trigger: 'blur'}
        ],
        birth: [
          {required: true, message: '请输入患者生日', trigger: 'blur'}
        ],
        fromType: [
          {required: true, message: '请输入患者来源', trigger: 'blur'}
        ],
        medicalInsuranceCode: [
          {required: true, message: '请选择医保类型', trigger: 'change'}
        ],
        cardTypeCode: [
          {required: true, message: '请选择卡类型', trigger: 'change'}
        ],
        cardNo: [
          {required: true, message: '请输入患者卡号', trigger: 'blur'}
        ],
        medicalTypeCode: [
          {required: true, message: '请选择患者类别', trigger: 'change'}
        ]
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
    this.getRegisteredTypeSelects()
    this.getGenderSelects()
    this.getMedicalInsuranceSelects()
    this.getCardTypeSelects()
    this.getMedicalTypeSelects()
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
    getRegisteredTypeSelects () {
      getDictonarySelect('RegisteredType').then(response => {
        this.registeredTypeSelects = response.data
      })
    },
    getGenderSelects () {
      getDictonarySelect('Gender').then(response => {
        this.genderSelects = response.data
      })
    },
    getMedicalInsuranceSelects () {
      getDictonarySelect('MedicalInsurance').then(response => {
        this.medicalInsuranceSelects = response.data
      })
    },
    getCardTypeSelects () {
      getDictonarySelect('CardType').then(response => {
        this.cardTypeSelects = response.data
      })
    },
    getMedicalTypeSelects () {
      getDictonarySelect('MedicalType').then(response => {
        this.medicalTypeSelects = response.data
      })
    },
    setListQuerySurgeryDate (val) {
      this.listQuery.surgeryDate = val
    },
    resetTemp () {
      this.temp = {
        id: undefined,
        schedulingId: undefined,
        doctorDate: undefined,
        doctorTime: '',
        registeredDate: undefined,
        registeredTypeCode: '',
        registeredTypeName: '',
        name: '',
        phone: '',
        iDCard: '',
        genderCode: '',
        genderName: '',
        address: '',
        birth: '',
        fromType: '',
        medicalInsuranceCode: '',
        medicalInsuranceName: '',
        cardTypeCode: '',
        cardTypeName: '',
        cardNo: '',
        medicalTypeCode: '',
        medicalTypeName: '',
        registeredStateCode: '0',
        registeredStateName: '待就诊',
        status: '正常'
      }
    },
    createTemp () {
      this.$refs.temp.validate(valid => {
        if (valid) {
          this.temp.registeredTypeName = this.registeredTypeSelects.find(item => item.code === this.temp.registeredTypeCode).name
          this.temp.genderName = this.genderSelects.find(item => item.code === this.temp.genderCode).name
          this.temp.medicalInsuranceName = this.medicalInsuranceSelects.find(item => item.code === this.temp.medicalInsuranceCode).name
          this.temp.cardTypeName = this.cardTypeSelects.find(item => item.code === this.temp.cardTypeCode).name
          this.temp.medicalTypeName = this.medicalTypeSelects.find(item => item.code === this.temp.medicalTypeCode).name
          createRegistered(this.temp).then(response => {
            if (response.status === 201) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '预约成功',
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
    handleCreate (row) {
      this.resetTemp()
      this.organazitionName = row.organazitionName
      this.userName = row.userName
      this.temp.schedulingId = row.id
      this.temp.doctorDate = formatDate(new Date(row.surgeryDate), 'yyyy-MM-dd')
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