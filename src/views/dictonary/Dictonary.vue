<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 系统设置</el-breadcrumb-item>
        <el-breadcrumb-item>数据字典</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="handle-box">
      <el-input v-model="listQuery.typeCode" placeholder="字典类别代码" class="handle-input"></el-input>
      <el-input v-model="listQuery.typeName" placeholder="字典类别名称" class="handle-input"></el-input>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="正在加载数据..." borde fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="Id" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="字典类别代码">
        <template scope="scope">
          <span>{{scope.row.typeCode}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { getDictionaries } from '@/api/dictionary'

  export default {
    data () {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          typeCode: undefined,
          typeName: undefined,
          page: 1,
          per_Page: 10
        }
      }
    },
    created () {
      this.getList()
    },
    methods: {
      getList () {
        this.listLoading = true
        getDictionaries(this.listQuery).then(response => {
          this.list = response.data
          this.total = response.headers['x-totalcount']
          this.listLoading = false
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

