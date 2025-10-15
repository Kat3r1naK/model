<template>
  <div class="result-chart">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-white text-xl font-semibold">
        结果对比图 <span class="text-gray-400 text-base">(Accuracy)</span>
      </h3>
      <!-- 导出按钮 -->
      <el-dropdown v-if="hasResults" trigger="click" @command="handleExport">
        <el-button type="success" size="default">
          <el-icon class="mr-2">
            <Download />
          </el-icon>
          导出
          <el-icon class="ml-2">
            <ArrowDown />
          </el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="png">
              <el-icon class="mr-2">
                <Picture />
              </el-icon>
              导出为 PNG 图片
            </el-dropdown-item>
            <el-dropdown-item command="csv" divided>
              <el-icon class="mr-2">
                <Document />
              </el-icon>
              导出数据为 CSV
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div v-if="hasResults" ref="chartRef" class="chart-container"></div>
    <div v-else class="empty-state">
      <el-empty description="暂无结果，请选择模型和数据集后运行对比" :image-size="200">
        <template #image>
          <div class="text-6xl">📊</div>
        </template>
      </el-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowDown, Document, Download, Picture } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { useModelStore } from '@/stores/modelStore'

const modelStore = useModelStore()
const { currentResult } = storeToRefs(modelStore)

const chartRef = ref<HTMLDivElement>()
let chartInstance: ECharts | null = null

const hasResults = computed(() => {
  return currentResult.value && currentResult.value.results.length > 0
})

const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  const option = {
    backgroundColor: 'transparent',
    grid: {
      left: '5%',
      right: '5%',
      bottom: '10%',
      top: '10%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderColor: 'rgba(71, 85, 105, 0.5)',
      textStyle: {
        color: '#e2e8f0',
      },
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#475569',
        },
      },
    },
    legend: {
      data: [] as string[],
      textStyle: {
        color: '#e2e8f0',
      },
      top: 0,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      name: 'Step',
      nameTextStyle: {
        color: '#94a3b8',
      },
      axisLine: {
        lineStyle: {
          color: '#475569',
        },
      },
      axisLabel: {
        color: '#94a3b8',
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(71, 85, 105, 0.2)',
          type: 'dashed',
        },
      },
    },
    yAxis: {
      type: 'value',
      name: 'Accuracy',
      nameTextStyle: {
        color: '#94a3b8',
      },
      min: 0.4,
      max: 1.0,
      axisLine: {
        lineStyle: {
          color: '#475569',
        },
      },
      axisLabel: {
        color: '#94a3b8',
        formatter: '{value}',
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(71, 85, 105, 0.2)',
          type: 'dashed',
        },
      },
    },
    series: [] as any[],
  }

  chartInstance.setOption(option)
}

const updateChart = () => {
  if (!chartInstance || !currentResult.value) return

  const results = currentResult.value.results
  const legendData = results.map((r: { modelName: string }) => r.modelName)
  const series = results.map((result: any) => ({
    name: result.modelName,
    type: 'line',
    smooth: true,
    symbol: 'circle',
    symbolSize: 4,
    lineStyle: {
      width: 3,
      color: result.color,
    },
    itemStyle: {
      color: result.color,
    },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: result.color + '40',
          },
          {
            offset: 1,
            color: result.color + '00',
          },
        ],
      },
    },
    data: result.data.map((d: { accuracy: number }) => d.accuracy),
  }))

  // 假设所有结果有相同的步数
  const xAxisData = results[0]?.data.map((d: { step: number }) => d.step.toString()) || []

  chartInstance.setOption({
    legend: {
      data: legendData,
    },
    xAxis: {
      data: xAxisData,
    },
    yAxis: {
      type: 'value',
      name: 'Accuracy',
      min: 0.4,
      max: 1.0,
    },
    series,
  })
}

const handleResize = () => {
  chartInstance?.resize()
}

const clearChart = () => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
}

/**
 * 导出图表为 PNG 格式
 */
const exportToPNG = () => {
  if (!chartInstance) {
    ElMessage.warning('图表未初始化，无法导出')
    return
  }

  try {
    // 获取图表的 base64 数据
    const url = chartInstance.getDataURL({
      type: 'png',
      pixelRatio: 2, // 使用 2 倍分辨率，导出更清晰的图片
      backgroundColor: '#1e293b', // 设置背景色
    })

    // 创建下载链接
    const link = document.createElement('a')
    link.href = url
    link.download = `model-comparison-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    ElMessage.success('PNG 图片导出成功！')
  } catch (error) {
    console.error('导出 PNG 失败:', error)
    ElMessage.error('导出 PNG 失败，请重试')
  }
}

/**
 * 导出数据为 CSV 格式
 */
const exportToCSV = () => {
  if (!currentResult.value || !currentResult.value.results.length) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  try {
    const results = currentResult.value.results

    // 构建 CSV 表头
    const headers = ['Step']
    results.forEach((result) => {
      headers.push(result.modelName)
    })

    // 构建 CSV 数据行
    const rows: string[][] = [headers]

    // 假设所有模型的数据点数量相同
    const dataLength = results[0].data.length

    for (let i = 0; i < dataLength; i++) {
      const row: string[] = [results[0].data[i].step.toString()]

      results.forEach((result) => {
        row.push(result.data[i].accuracy.toFixed(6))
      })

      rows.push(row)
    }

    // 将数组转换为 CSV 字符串
    const csvContent = rows.map((row) => row.join(',')).join('\n')

    // 创建 Blob 对象（使用 UTF-8 BOM 以支持 Excel 正确识别中文）
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    // 创建下载链接
    const link = document.createElement('a')
    link.href = url
    link.download = `model-comparison-data-${Date.now()}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // 释放 URL 对象
    URL.revokeObjectURL(url)

    ElMessage.success('CSV 数据导出成功！')
  } catch (error) {
    console.error('导出 CSV 失败:', error)
    ElMessage.error('导出 CSV 失败，请重试')
  }
}

/**
 * 处理导出命令
 * @param command - 导出类型：'png' | 'svg' | 'csv'
 */
const handleExport = (command: string) => {
  switch (command) {
    case 'png':
      exportToPNG()
      break
    case 'csv':
      exportToCSV()
      break
    default:
      ElMessage.warning('未知的导出格式')
  }
}

watch(currentResult, () => {
  console.log('currentResult', currentResult.value)
  if (hasResults.value) {
    if (!chartInstance) {
      setTimeout(() => {
        initChart()
        updateChart()
      }, 100)
    } else {
      updateChart()
    }
  } else {
    // 当结果被清空时，清除图表
    clearChart()
  }
})

onMounted(() => {
  window.addEventListener('resize', handleResize)
  if (hasResults.value) {
    initChart()
    updateChart()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<style scoped>
.result-chart {
  padding: 1.5rem;
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(71, 85, 105, 0.5);
  backdrop-filter: blur(10px);
  margin-top: 2rem;
}

.chart-container {
  width: 100%;
  height: 450px;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

:deep(.el-empty__description) {
  color: #94a3b8;
}
</style>
