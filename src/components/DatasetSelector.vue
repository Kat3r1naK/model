<template>
  <div class="dataset-selector">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-white text-lg font-semibold">数据集选择</h3>
      <el-button size="small" type="primary" @click="openAddDatasetDialog">
        <el-icon class="mr-1"><Plus /></el-icon>
        添加数据集
      </el-button>
    </div>
    <el-radio-group v-model="localSelectedDataset" class="flex flex-col gap-3">
      <div v-for="dataset in datasets" :key="dataset.id" class="dataset-item">
        <el-radio :label="dataset.id" :value="dataset.id" class="dataset-radio">
          <div class="flex items-center gap-2">
            <span class="font-semibold text-white">{{ dataset.name }}</span>
            <span class="text-sm text-gray-400">({{ dataset.description }})</span>
          </div>
        </el-radio>
        <button @click.stop="handleDeleteDataset(dataset.id)" class="delete-btn" title="删除数据集">
          <el-icon><Close /></el-icon>
        </button>
      </div>
    </el-radio-group>
    <p class="text-sm text-gray-400 mt-4">请选择一个数据集后运行</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Close } from '@element-plus/icons-vue'
import { useModelStore } from '@/stores/modelStore'

const modelStore = useModelStore()
const { availableDatasets, selectedDataset } = storeToRefs(modelStore)

const datasets = computed(() => availableDatasets.value)

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
  padding: 1.5rem;
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(71, 85, 105, 0.5);
  backdrop-filter: blur(10px);
}

.dataset-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  width: 100%;
}

:deep(.el-radio) {
  --el-radio-text-color: #e2e8f0;
  height: auto;
  margin-right: 0;
  flex: 1;
}

:deep(.el-radio__label) {
  width: 100%;
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
</style>
