<template>
  <el-dialog v-model="dialogVisible" title="添加新模型" width="600px" @close="handleClose">
    <el-form :model="formData" label-width="100px">
      <el-form-item label="模型ID">
        <el-input v-model="formData.id" placeholder="如: dkt" />
      </el-form-item>
      <el-form-item label="模型名称">
        <el-input v-model="formData.name" placeholder="如: DKT" />
      </el-form-item>
      <el-form-item label="完整名称">
        <el-input v-model="formData.fullName" placeholder="如: Deep Knowledge Tracing" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="formData.description" placeholder="如: 深度知识追踪" />
      </el-form-item>
      <el-form-item label="颜色">
        <el-color-picker v-model="formData.color" show-alpha :predefine="predefineColors" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useModelStore } from '@/stores/modelStore'
import type { Model } from '@/types'

const modelStore = useModelStore()
const { showAddModelDialog } = storeToRefs(modelStore)

// 表单数据
const formData = ref({
  id: '',
  name: '',
  fullName: '',
  description: '',
  color: '#8b5cf6',
  parameters: [
    {
      key: 'initialKnowledge',
      label: '初始知识水平',
      min: 0.3,
      max: 0.7,
      step: 0.05,
      default: 0.5,
      description: '学习者的初始知识掌握程度',
    },
    {
      key: 'learningRate',
      label: '学习率',
      min: 0.05,
      max: 0.5,
      step: 0.05,
      default: 0.35,
      description: '学习新知识的速度',
    },
    {
      key: 'noise',
      label: '噪声水平',
      min: 0.01,
      max: 0.08,
      step: 0.005,
      default: 0.03,
      description: '数据的随机波动程度',
    },
  ],
})

// 预定义颜色
const predefineColors = [
  '#3b82f6',
  '#ef4444',
  '#10b981',
  '#8b5cf6',
  '#f59e0b',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
]

// 双向绑定弹窗显示状态
const dialogVisible = computed({
  get: () => showAddModelDialog.value,
  set: (value: boolean) => {
    showAddModelDialog.value = value
  },
})

// 重置表单
const resetForm = () => {
  formData.value.id = ''
  formData.value.name = ''
  formData.value.fullName = ''
  formData.value.description = ''
  formData.value.color = '#8b5cf6'
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
  if (!formData.value.id || !formData.value.name || !formData.value.fullName) {
    ElMessage.error('请填写完整的模型信息')
    return
  }

  try {
    modelStore.addModel(formData.value as Model)
    ElMessage.success(`成功添加模型: ${formData.value.name}`)
    dialogVisible.value = false
    resetForm()
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}

// 监听弹窗打开，重置表单
watch(showAddModelDialog, (newVal) => {
  if (newVal) {
    resetForm()
  }
})
</script>

<style scoped>
/* 如需自定义样式可在此添加 */
</style>
