<template>
  <div class="model-selector">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-white text-base md:text-lg font-semibold">模型选择</h3>
      <el-button size="small" type="primary" @click="openAddModelDialog">
        <el-icon class="mr-1"><Plus /></el-icon>
        <span class="hidden sm:inline">添加模型</span>
        <span class="sm:hidden">添加</span>
      </el-button>
    </div>
    <el-checkbox-group v-model="localSelectedModels" class="flex flex-col gap-3">
      <div v-for="model in models" :key="model.id" class="model-item">
        <div class="model-header">
          <el-checkbox :label="model.id" :value="model.id" class="model-checkbox">
            <div class="model-info">
              <span class="model-name" :title="model.name">{{ model.name }}</span>
              <span class="model-fullname" :title="model.fullName">{{ model.fullName }}</span>
              <span class="model-desc" :title="model.description">({{ model.description }})</span>
            </div>
          </el-checkbox>
          <div class="model-actions">
            <button @click.stop="handleDeleteModel(model.id)" class="delete-btn" title="删除模型">
              <el-icon><Close /></el-icon>
            </button>
            <button
              @click.stop="toggleParameters(model.id)"
              class="expand-btn"
              :class="{ expanded: expandedModels.includes(model.id) }"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <!-- 参数调节区域 -->
        <el-collapse-transition>
          <div v-if="expandedModels.includes(model.id)" class="model-parameters mt-3 ml-8">
            <div class="text-sm text-gray-300 mb-2 flex items-center justify-between">
              <span>参数设置</span>
              <el-button size="small" text @click="resetParameters(model.id)" class="reset-btn">
                重置
              </el-button>
            </div>
            <div v-for="param in model.parameters" :key="param.key" class="param-item">
              <div class="param-header">
                <label class="param-label">{{ param.label }}</label>
                <span class="param-value">{{
                  getParameterValue(model.id, param.key).toFixed(3)
                }}</span>
              </div>
              <el-slider
                :model-value="getParameterValue(model.id, param.key)"
                @update:model-value="(val: number) => updateParameter(model.id, param.key, val)"
                :min="param.min"
                :max="param.max"
                :step="param.step"
                :show-tooltip="false"
              />
              <div class="param-description">{{ param.description }}</div>
            </div>
          </div>
        </el-collapse-transition>
      </div>
    </el-checkbox-group>
    <p class="text-sm text-gray-400 mt-4">可同时勾选多个模型进行对比，并调节各模型参数</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Close } from '@element-plus/icons-vue'
import { useModelStore } from '@/stores/modelStore'

const modelStore = useModelStore()
const { availableModels, selectedModels } = storeToRefs(modelStore)

const models = computed(() => availableModels.value)

// 展开的模型列表
const expandedModels = ref<string[]>([])

const localSelectedModels = computed({
  get: () => selectedModels.value,
  set: (value: string[]) => {
    selectedModels.value = value
  },
})

// 切换参数面板展开/折叠
const toggleParameters = (modelId: string) => {
  const index = expandedModels.value.indexOf(modelId)
  if (index > -1) {
    expandedModels.value.splice(index, 1)
  } else {
    expandedModels.value.push(modelId)
    // 确保参数已初始化
    modelStore.initializeModelParameters(modelId)
  }
}

// 获取参数值
const getParameterValue = (modelId: string, paramKey: string): number => {
  return modelStore.getModelParameter(modelId, paramKey)
}

// 更新参数值
const updateParameter = (modelId: string, paramKey: string, value: number) => {
  modelStore.setModelParameter(modelId, paramKey, value)
}

// 重置参数
const resetParameters = (modelId: string) => {
  modelStore.resetModelParameters(modelId)
}

// 打开添加模型对话框
const openAddModelDialog = () => {
  modelStore.showAddModelDialog = true
}

// 处理删除模型
const handleDeleteModel = (modelId: string) => {
  const model = models.value.find((m) => m.id === modelId)
  if (!model) return

  ElMessageBox.confirm(`确定要删除模型 "${model.name}" 吗？`, '确认删除', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      modelStore.removeModel(modelId)
      // 从展开列表中移除
      const expandedIndex = expandedModels.value.indexOf(modelId)
      if (expandedIndex > -1) {
        expandedModels.value.splice(expandedIndex, 1)
      }
      ElMessage.success('删除成功')
    })
    .catch(() => {
      // 取消删除
    })
}

// 监听选中模型的变化，初始化参数
watch(
  selectedModels,
  (newModels) => {
    newModels.forEach((modelId) => {
      modelStore.initializeModelParameters(modelId)
    })
  },
  { immediate: true }
)
</script>

<style scoped>
.model-selector {
  padding: 1rem;
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(71, 85, 105, 0.5);
  backdrop-filter: blur(10px);
}

@media (min-width: 768px) {
  .model-selector {
    padding: 1.5rem;
  }
}

.model-item {
  width: 100%;
}

.model-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  width: 100%;
  min-width: 0; /* 允许 flex 子元素收缩 */
}

:deep(.el-checkbox) {
  --el-checkbox-text-color: #e2e8f0;
  height: auto;
  margin-right: 0;
  flex: 1;
  min-width: 0; /* 允许 flex 子元素收缩 */
}

:deep(.el-checkbox__label) {
  width: 100%;
  min-width: 0; /* 允许 flex 子元素收缩 */
}

/* 模型信息容器 */
.model-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  min-width: 0; /* 允许 flex 子元素收缩 */
}

/* 模型名称 - 主要信息，不换行 */
.model-name {
  font-weight: 600;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 8rem;
  flex-shrink: 0;
}

/* 模型全称 - 次要信息 */
.model-fullname {
  font-size: 0.875rem;
  color: #9ca3af;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}

/* 模型描述 - 辅助信息 */
.model-desc {
  font-size: 0.75rem;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}

/* 按钮操作区 */
.model-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .model-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .model-name,
  .model-fullname,
  .model-desc {
    max-width: 100%;
    width: 100%;
  }

  .model-name {
    font-size: 0.875rem;
  }

  .model-actions {
    gap: 0.25rem;
  }

  .expand-btn,
  .delete-btn {
    padding: 0.375rem;
  }
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.model-checkbox {
  padding: 0.75rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.model-checkbox:hover {
  background: rgba(59, 130, 246, 0.1);
}

.expand-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: rgba(71, 85, 105, 0.3);
  border: 1px solid rgba(71, 85, 105, 0.5);
  border-radius: 6px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.3s ease;
}

.expand-btn:hover {
  background: rgba(71, 85, 105, 0.5);
  color: #e2e8f0;
  border-color: #3b82f6;
}

.expand-btn svg {
  transition: transform 0.3s ease;
}

.expand-btn.expanded svg {
  transform: rotate(180deg);
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

.model-parameters {
  padding: 1rem;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 8px;
  border: 1px solid rgba(71, 85, 105, 0.3);
}

.param-item {
  margin-bottom: 1rem;
}

.param-item:last-child {
  margin-bottom: 0;
}

.param-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.param-label {
  font-size: 0.875rem;
  color: #cbd5e1;
  font-weight: 500;
}

.param-value {
  font-size: 0.875rem;
  color: #3b82f6;
  font-weight: 600;
  font-family: monospace;
}

.param-description {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.25rem;
  font-style: italic;
}

:deep(.el-slider) {
  --el-slider-main-bg-color: #3b82f6;
  --el-slider-runway-bg-color: rgba(71, 85, 105, 0.5);
  --el-slider-button-size: 16px;
}

:deep(.el-slider__bar) {
  background-color: #3b82f6;
}

:deep(.el-slider__button) {
  border: 2px solid #3b82f6;
}

.reset-btn {
  color: #94a3b8;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

.reset-btn:hover {
  color: #3b82f6;
}
</style>
