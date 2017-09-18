<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 系统设置</el-breadcrumb-item>
        <el-breadcrumb-item>部门管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="handle-box">
      <el-cascader :options="selects" :props="defaultProps" v-model="selected"  placeholder="上级部门" @change="handleChange" change-on-select>
      </el-cascader>
    </div>
  </div>
</template>

<script>
import { getOrgTree } from '@/api/orgnazition'

export default {
  data () {
    return {
      list: null,
      total: null,
      selects: null,
      selected: [1],
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
      },
      listLoading: true,
      listQuery: {
        name: undefined,
        page: 1,
        per_Page: 10
      },
      temp: {
        id: undefined
      },
      rules: {
        code: [
          {required: true, message: '请输入部门编码', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入部门名称', trigger: 'blur'}
        ]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: '创建部门',
        edit: '编辑部门'
      }
    }
  },
  created () {
    this.getSelects()
  },
  methods: {
    getSelects () {
      getOrgTree(1).then(response => {
        this.selects = [response.data]
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
