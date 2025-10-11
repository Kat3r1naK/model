<template>
  <div class="dataset-selector">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-white text-base md:text-lg font-semibold">数据集选择</h3>
      <el-button size="small" type="primary" @click="openAddDatasetDialog">
        <el-icon class="mr-1"><Plus /></el-icon>
        <span class="hidden sm:inline">添加数据集</span>
        <span class="sm:hidden">添加</span>
      </el-button>
    </div>
    <el-radio-group v-model="localSelectedDataset" class="flex flex-col gap-3">
      <div v-for="dataset in datasets" :key="dataset.id" class="dataset-item">
        <el-radio :label="dataset.id" :value="dataset.id" class="dataset-radio">
          <div class="dataset-info">
            <span class="dataset-name" :title="dataset.name">{{ dataset.name }}</span>
            <span class="dataset-desc" :title="dataset.description"
              >({{ dataset.description }})</span
            >
          </div>
        </el-radio>
        <div class="dataset-actions">
          <button class="info-btn" title="查看数据集说明" @click.stop="showDatasetInfo(dataset)">
            <el-icon><InfoFilled /></el-icon>
          </button>
          <button
            class="delete-btn"
            title="删除数据集"
            @click.stop="handleDeleteDataset(dataset.id)"
          >
            <el-icon><Close /></el-icon>
          </button>
        </div>
      </div>
    </el-radio-group>
    <p class="text-sm text-gray-400 mt-4">请选择一个数据集后运行</p>

    <!-- 数据集信息对话框 -->
    <el-dialog
      v-model="showInfoDialog"
      title="数据集详细信息"
      width="600px"
      append-to-body
      center
      :modal="true"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
    >
      <div v-if="currentDatasetInfo" class="dataset-info-content">
        <div class="info-item">
          <label class="info-label">数据集名称：</label>
          <span class="info-value">{{ currentDatasetInfo.name }}</span>
        </div>
        <div class="info-item">
          <label class="info-label">简短描述：</label>
          <span class="info-value">{{ currentDatasetInfo.description }}</span>
        </div>
        <div v-if="currentDatasetInfo.fullDescription" class="info-item">
          <label class="info-label">详细描述：</label>
          <p class="info-value">{{ currentDatasetInfo.fullDescription }}</p>
        </div>
        <div v-if="currentDatasetInfo.source" class="info-item">
          <label class="info-label">数据来源：</label>
          <span class="info-value">{{ currentDatasetInfo.source }}</span>
        </div>
        <div v-if="currentDatasetInfo.domain" class="info-item">
          <label class="info-label">应用领域：</label>
          <span class="info-value">{{ currentDatasetInfo.domain }}</span>
        </div>
        <div v-if="currentDatasetInfo.sampleCount" class="info-item">
          <label class="info-label">样本数量：</label>
          <span class="info-value">{{ currentDatasetInfo.sampleCount?.toLocaleString() }} 条</span>
        </div>
        <div v-if="currentDatasetInfo.year" class="info-item">
          <label class="info-label">数据年份：</label>
          <span class="info-value">{{ currentDatasetInfo.year }}</span>
        </div>
        <div
          v-if="currentDatasetInfo.features && currentDatasetInfo.features.length > 0"
          class="info-item"
        >
          <label class="info-label">数据特征：</label>
          <div class="features-list">
            <span v-for="feature in currentDatasetInfo.features" :key="feature" class="feature-tag">
              {{ feature }}
            </span>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCloseInfoDialog">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Close, InfoFilled } from '@element-plus/icons-vue'
import { useModelStore } from '@/stores/modelStore'
import type { Dataset } from '@/types'

const modelStore = useModelStore()
const { availableDatasets, selectedDataset } = storeToRefs(modelStore)

const datasets = computed(() => availableDatasets.value)

// 数据集信息弹出对话框相关
const showInfoDialog = ref(false)
const currentDatasetInfo = ref<Dataset | null>(null)

const localSelectedDataset = computed({
  get: () => selectedDataset.value,
  set: (value: string) => {
    selectedDataset.value = value
  },
})

// 打开添加数据集对话框
const openAddDatasetDialog = () => {
  modelStore.showAddDatasetDialog = true
}

// 显示数据集信息
const showDatasetInfo = (dataset: Dataset) => {
  currentDatasetInfo.value = dataset
  showInfoDialog.value = true
}

// 关闭数据集信息对话框
const handleCloseInfoDialog = () => {
  showInfoDialog.value = false
  currentDatasetInfo.value = null
}

// 处理删除数据集
const handleDeleteDataset = (datasetId: string) => {
  const dataset = datasets.value.find((d) => d.id === datasetId)
  if (!dataset) return

  ElMessageBox.confirm(`确定要删除数据集 "${dataset.name}" 吗？`, '确认删除', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      modelStore.removeDataset(datasetId)
      ElMessage.success('删除成功')
    })
    .catch(() => {
      // 取消删除
    })
}
</script>

<style scoped>
.dataset-selector {
  padding: 1rem;
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(71, 85, 105, 0.5);
  backdrop-filter: blur(10px);
}

@media (min-width: 768px) {
  .dataset-selector {
    padding: 1.5rem;
  }
}

.dataset-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  width: 100%;
  min-width: 0; /* 允许 flex 子元素收缩 */
}

:deep(.el-radio) {
  --el-radio-text-color: #e2e8f0;
  height: auto;
  margin-right: 0;
  flex: 1;
  min-width: 0; /* 允许 flex 子元素收缩 */
}

:deep(.el-radio__label) {
  width: 100%;
  min-width: 0; /* 允许 flex 子元素收缩 */
}

/* 数据集信息容器 */
.dataset-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  min-width: 0; /* 允许 flex 子元素收缩 */
}

/* 数据集名称 */
.dataset-name {
  font-weight: 600;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 10rem;
  flex-shrink: 0;
}

/* 数据集描述 */
.dataset-desc {
  font-size: 0.875rem;
  color: #9ca3af;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .dataset-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .dataset-name,
  .dataset-desc {
    max-width: 100%;
    width: 100%;
  }

  .dataset-name {
    font-size: 0.875rem;
  }

  .delete-btn {
    padding: 0.375rem;
  }
}

:deep(.el-radio__input.is-checked .el-radio__inner) {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.dataset-radio {
  padding: 0.75rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.dataset-radio:hover {
  background: rgba(59, 130, 246, 0.1);
}

.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 6px;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
  color: #fee2e2;
}

/* 数据集操作按钮组 */
.dataset-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 信息按钮 */
.info-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 6px;
  color: #3b82f6;
  cursor: pointer;
  transition: all 0.3s ease;
}

.info-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  border-color: #3b82f6;
  color: #dbeafe;
}

/* 数据集信息对话框内容 */
.dataset-info-content {
  padding: 1rem 0;
}

.info-item {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.info-value {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
}

/* 特征标签列表 */
.features-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.feature-tag {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 4px;
  color: #3b82f6;
  font-size: 0.75rem;
  font-weight: 500;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .dataset-actions {
    gap: 0.375rem;
  }

  .info-btn,
  .delete-btn {
    padding: 0.375rem;
  }
}
</style>
