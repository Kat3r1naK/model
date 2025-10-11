<template>
  <div class="result-chart">
    <h3 class="text-white text-xl font-semibold mb-4">
      结果对比图 <span class="text-gray-400 text-base">(Accuracy)</span>
    </h3>
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
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
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
