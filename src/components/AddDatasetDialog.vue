<template>
  <el-dialog v-model="dialogVisible" title="添加新数据集" :width="dialogWidth" @close="handleClose">
    <el-form :model="formData" :label-width="labelWidth" class="compact-form">
      <el-form-item label="数据集ID">
        <el-input v-model="formData.id" placeholder="如: physics" size="small" />
      </el-form-item>
      <el-form-item label="数据集名称">
        <el-input v-model="formData.name" placeholder="如: Physics" size="small" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="formData.description" placeholder="如: 物理" size="small" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useModelStore } from '@/stores/modelStore'
import type { Dataset } from '@/types'

const modelStore = useModelStore()
const { showAddDatasetDialog } = storeToRefs(modelStore)

// 响应式窗口宽度
const windowWidth = ref(window.innerWidth)
const dialogWidth = computed(() => {
  if (windowWidth.value < 640) return '90%'
  if (windowWidth.value < 768) return '80%'
  return '500px'
})
const labelWidth = computed(() => {
  if (windowWidth.value < 640) return '80px'
  if (windowWidth.value < 768) return '90px'
  return '110px'
})

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 表单数据
const formData = ref<Dataset>({
  id: '',
  name: '',
  description: '',
})

// 双向绑定弹窗显示状态
const dialogVisible = computed({
  get: () => showAddDatasetDialog.value,
  set: (value: boolean) => {
    showAddDatasetDialog.value = value
  },
})

// 重置表单
const resetForm = () => {
  formData.value.id = ''
  formData.value.name = ''
  formData.value.description = ''
}

// 处理取消
const handleCancel = () => {
  dialogVisible.value = false
  resetForm()
}

// 处理关闭
const handleClose = () => {
  resetForm()
}

// 处理提交
const handleSubmit = () => {
  // 验证
  if (!formData.value.id || !formData.value.name) {
    ElMessage.error('请填写完整的数据集信息')
    return
  }

  try {
    modelStore.addDataset(formData.value)
    ElMessage.success(`成功添加数据集: ${formData.value.name}`)
    dialogVisible.value = false
    resetForm()
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}

// 监听弹窗打开，重置表单
watch(showAddDatasetDialog, (newVal) => {
  if (newVal) {
    resetForm()
  }
})
</script>

<style scoped>
.compact-form :deep(.el-form-item) {
  margin-bottom: 18px;
}

.compact-form :deep(.el-form-item__label) {
  font-size: 14px;
  padding-right: 8px;
}

/* 移动端优化 */
@media (max-width: 640px) {
  .compact-form :deep(.el-form-item) {
    margin-bottom: 14px;
  }

  .compact-form :deep(.el-form-item__label) {
    font-size: 13px;
  }
}
</style>
