<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-row>
        <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
        </el-alert>
      </el-row>

      <!-- 步骤条 -->
      <el-row>
        <el-steps :space="300" :active="activeIndex - 0" finish-status="success" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
      </el-row>

      <!-- tab栏区域 -->
      <el-form ref="addFormRef" :model="addForm" label-width="80px" :rules="addFormRules" label-position="top">
        <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <!-- 级联选择器 -->
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader expand-trigger="hover" v-model="addForm.goods_cat" :options="catelist" :props="cateProps"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 步骤激活
      activeIndex: '0',
      // 添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
      },
      addFormRules: {
        goods_name: [{
          required: true,
          message: '请输入商品名称',
          trigger: 'blur'
        }],
        goods_price: [{
          required: true,
          message: '请输入商品价格',
          trigger: 'blur',
        }],
        goods_weight: [{
          required: true,
          message: '请输入商品重量',
          trigger: 'blur',
        }],
        goods_number: [{
          required: true,
          message: '请输入商品数量',
          trigger: 'blur',
        }],
        goods_cat: [{
          required: true,
          message: '请选择商品分类',
          trigger: 'blur',
        }],
      },
      // 商品分类列表
      catelist: [],
      // 级联选择器配置对象
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
    }
  },

  created() {
    this.getCateList()
  },

  methods: {
    // 获取分类
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) this.$message.error('获取失败')
      this.catelist = res.data
    },

    // 级联选择器选中项变化触发
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        return
      }
    },

    // 标签选择
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
  },

}
</script>

<style lang="less" scoped>

</style>