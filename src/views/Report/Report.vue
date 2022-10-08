<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'


export default {
  data() {
    return {

    }
  },
  created() { },
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) return this.$message.error('获取失败')
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(res.data);
  },
  methods: {}
}
</script>

<style lang="less" scoped>

</style>