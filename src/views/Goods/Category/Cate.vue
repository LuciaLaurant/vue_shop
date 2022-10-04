<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <tree-table class="treeTable" :data="catelist" :columns="columns" :selection-type="false" :expand-type="false"
        :show-index="true" border>
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button size="mini">编辑</el-button>
          <el-button size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区 -->
      <el-pagination @size-change="pageSizeChange" @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pagenum" :page-sizes="[3,5,10,15]" :page-size="100"
        layout="total, sizes,prev, pager, next,jumper" :total="1000">
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @closed="addCateDialogClosed">
      <!-- 添加分类表单 -->
      <el-form ref="addCateFormRef" :model="addCateForm" :rules="addCateFormRules" label-width="100px">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader clearable change-on-select v-model="selectedKeys" :options="parentCateList"
            @change="parentCateChanged" :props="cascaderProps">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类数据列表
      catelist: [],
      // 商品总数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          // 使用模板
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      // 控制添加分类对话框的显示
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类名称
        cat_name: '',
        // 分类父 ID
        cat_pid: 0,
        // 分类层级
        cat_level: 1,
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      },
      // 父级分类列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的ID数组
      selectedKeys: [],
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.catelist = res.data.result
      this.total = res.data.total
      console.log(res);
    },

    // 监听pagesize改变的事件
    pageSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },

    // 监听pagenum的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },

    // 点击按钮，展示添加分类的对话框
    showAddCateDialog() {
      // 获取父级分类的列表
      this.getParentCateList()
      // 展示对话框
      this.addCateDialogVisible = true
    },

    // 获取父级分类
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.parentCateList = res.data
    },

    // 选择项发生变化
    parentCateChanged() {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },

    // 添加分类
    async addCate() {
      const { data: res } = await this.$http.post('categories', this.addCateForm)
      console.log(res);
      if (res.meta.status !== 201) return this.$message.error('创建失败')
      this.$message.success('创建成功')
      this.addCateDialogVisible = false
      this.getCateList()
    },

    // 监听对话框关闭，重置表单数据
    addCateDialogClosed(){
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
    },
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
</style>