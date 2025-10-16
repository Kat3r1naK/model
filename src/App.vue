<template>
  <div id="app" class="min-h-screen py-4 md:py-8 px-3 md:px-4">
    <div class="max-w-7xl mx-auto">
      <!-- 标题 -->
      <header class="text-center mb-6 md:mb-8">
        <h1 class="text-2xl md:text-4xl font-bold text-white mb-2">学习追踪模型系统</h1>
        <p class="text-gray-400 text-sm md:text-lg">勾选模型与数据集，一键生成图像并进行对比</p>
      </header>

      <!-- 选择区域 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ModelSelector />
        <DatasetSelector />
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="text-center mb-6">
        <el-alert :title="error" type="error" center :closable="false" show-icon />
      </div>

      <!-- 加载提示 -->
      <div v-if="isLoading" class="text-center mb-6">
        <el-alert title="正在加载数据..." type="info" center :closable="false" show-icon />
      </div>

      <!-- 操作按钮 -->
      <div class="flex items-center justify-center gap-2 md:gap-4 mb-6">
        <el-button
          type="primary"
          :size="isMobile ? 'default' : 'large'"
          :disabled="!canRun || isRunning"
          :loading="isRunning"
          class="flex-1 md:flex-initial md:px-8"
          @click="handleRunComparison"
        >
          <el-icon class="mr-1 md:mr-2">
            <Operation />
          </el-icon>
          <span class="text-sm md:text-base">{{ isRunning ? '运行中...' : '运行对比' }}</span>
        </el-button>
        <el-button
          :size="isMobile ? 'default' : 'large'"
          :disabled="!hasResults"
          class="flex-1 md:flex-initial md:px-8"
          @click="handleClearResults"
        >
          <el-icon class="mr-1 md:mr-2">
            <Delete />
          </el-icon>
          <span class="text-sm md:text-base">清空结果</span>
        </el-button>
      </div>

      <!-- 提示信息 -->
      <div v-if="!canRun" class="text-center mb-6">
        <el-alert
          title="请至少选择一个模型和一个数据集"
          type="warning"
          center
          :closable="false"
          show-icon
        />
      </div>

      <!-- 结果展示 -->
      <ResultChart />

      <!-- 添加模型对话框 -->
      <AddModelDialog />

      <!-- 添加数据集对话框 -->
      <AddDatasetDialog />

      <!-- 模型说明 - 已禁用 -->
      <!--
      <div
        class="mt-6 md:mt-8 p-4 md:p-6 bg-slate-800 bg-opacity-50 rounded-lg border border-slate-600"
      >
        <h3 class="text-white text-base md:text-lg font-semibold mb-3 md:mb-4">📚 模型说明</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <div class="p-4 bg-slate-700 bg-opacity-30 rounded-lg">
            <h4 class="text-blue-400 font-semibold mb-2">BKT (贝叶斯知识追踪)</h4>
            <p class="text-gray-300 text-sm">
              使用贝叶斯推理追踪学生知识状态的变化，适用于技能掌握度预测。
            </p>
          </div>
          <div class="p-4 bg-slate-700 bg-opacity-30 rounded-lg">
            <h4 class="text-red-400 font-semibold mb-2">PFA (表现因素分析)</h4>
            <p class="text-gray-300 text-sm">
              考虑学生在不同题目上的成功和失败次数，更细粒度地建模学习过程。
            </p>
          </div>
          <div class="p-4 bg-slate-700 bg-opacity-30 rounded-lg">
            <h4 class="text-green-400 font-semibold mb-2">IRT (题目反应理论)</h4>
            <p class="text-gray-300 text-sm">
              基于题目难度和学生能力建模，广泛应用于标准化测试和自适应学习。
            </p>
          </div>
        </div>
      </div>
      -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { Delete, Operation } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref } from 'vue'

import AddDatasetDialog from '@/components/AddDatasetDialog.vue'
import AddModelDialog from '@/components/AddModelDialog.vue'
import DatasetSelector from '@/components/DatasetSelector.vue'
import ModelSelector from '@/components/ModelSelector.vue'
import ResultChart from '@/components/ResultChart.vue'
import { useModelStore } from '@/stores/modelStore'
import type { Dataset, Model } from '@/types'

const modelStore = useModelStore()
const {
  canRun,
  isRunning,
  currentResult,
  selectedModels,
  selectedDataset,
  availableModels,
  availableDatasets,
  error,
  isLoading,
} = storeToRefs(modelStore)

const hasResults = computed(() => currentResult.value !== null)

// 检测移动端
const windowWidth = ref(window.innerWidth)
const isMobile = computed(() => windowWidth.value < 768)

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(async () => {
  window.addEventListener('resize', handleResize)

  // 初始化：获取模型和数据集列表
  try {
    await modelStore.initialize()
  } catch (error) {
    ElMessage.error('初始化失败，请刷新页面重试')
    console.error('Failed to initialize:', error)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const handleRunComparison = async () => {
  const modelNames = selectedModels.value
    .map((id: string) => availableModels.value.find((m: Model) => m.id === id)?.name)
    .filter(Boolean)
    .join(', ')
  const datasetName = availableDatasets.value.find(
    (d: Dataset) => d.id === selectedDataset.value
  )?.description

  ElMessage.info(`开始运行 ${modelNames} 在 ${datasetName} 数据集上的对比...`)

  try {
    await modelStore.runComparison()
    ElMessage.success('对比完成！')
  } catch (error) {
    // 错误已经在store中处理，这里不需要额外处理
    console.error('Comparison failed:', error)
  }
}

const handleClearResults = () => {
  modelStore.clearResults()
  ElMessage.info('已清空结果')
}
</script>

<style scoped>
:deep(.el-button--primary) {
  --el-button-bg-color: #3b82f6;
  --el-button-border-color: #3b82f6;
  --el-button-hover-bg-color: #2563eb;
  --el-button-hover-border-color: #2563eb;
}

:deep(.el-alert) {
  background-color: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.3);
}
</style>
