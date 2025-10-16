import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { getSupportedDatasets, getSupportedModels, runModelAnalysis } from '@/api/models'
import type {
  ApiAnalysisResponse,
  ComparisonResult,
  DataPoint,
  Dataset,
  Model,
  ModelParameterValues,
  ModelResult,
} from '@/types'

export const useModelStore = defineStore('model', () => {
  // 可用的模型列表
  const availableModels = ref<Model[]>([
    {
      id: 'bkt',
      name: 'BKT',
      fullName: 'Bayesian Knowledge Tracing',
      description: '贝叶斯知识追踪',
      color: '#3b82f6', // blue
      parameters: [
        {
          key: 'initialKnowledge',
          label: '初始知识水平',
          min: 0.3,
          max: 0.7,
          step: 0.05,
          default: 0.48,
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
          default: 0.035,
          description: '数据的随机波动程度',
        },
      ],
    },
    {
      id: 'pfa',
      name: 'PFA',
      fullName: 'Performance Factors Analysis',
      description: '表现因素分析',
      color: '#ef4444', // red
      parameters: [
        {
          key: 'initialKnowledge',
          label: '初始知识水平',
          min: 0.3,
          max: 0.7,
          step: 0.05,
          default: 0.45,
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
          default: 0.04,
          description: '数据的随机波动程度',
        },
      ],
    },
    {
      id: 'irt',
      name: 'IRT',
      fullName: 'Item Response Theory',
      description: '题目反应理论',
      color: '#10b981', // green
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
    },
  ])

  // 可用的数据集列表
  const availableDatasets = ref<Dataset[]>([
    {
      id: 'algebra1',
      name: 'Algebra I',
      description: '代数一',
      fullDescription:
        '这是一个包含代数一课程学习数据的数据集，记录了学生在代数基础概念学习过程中的表现。',
      source: 'Carnegie Learning DataShop',
      sampleCount: 15000,
      features: ['学生ID', '题目ID', '答题时间', '正确性', '技能标签'],
      domain: '数学教育',
      year: 2019,
    },
    {
      id: 'geometry',
      name: 'Geometry',
      description: '几何',
      fullDescription:
        '几何学习数据集，包含学生在几何概念和定理学习中的详细记录，涵盖平面几何和立体几何。',
      source: 'ASSISTments Platform',
      sampleCount: 12500,
      features: ['学生ID', '题目类型', '解题步骤', '错误类型', '几何概念'],
      domain: '数学教育',
      year: 2020,
    },
    {
      id: 'programming101',
      name: 'Programming 101',
      description: '编程入门',
      fullDescription:
        '编程入门课程数据集，记录了初学者在学习基础编程概念时的学习轨迹和编程练习表现。',
      source: 'CodeLab Educational Platform',
      sampleCount: 8900,
      features: ['学生ID', '编程题目', '代码提交', '编译错误', '运行结果', '编程概念'],
      domain: '计算机科学教育',
      year: 2021,
    },
  ])

  // 当前选中的模型
  const selectedModels = ref<string[]>([])

  // 当前选中的数据集
  const selectedDataset = ref<string>('')

  // 模型参数值
  const modelParameters = ref<ModelParameterValues>({})

  // 比较结果历史
  const comparisonResults = ref<ComparisonResult[]>([])

  // 当前结果
  const currentResult = ref<ComparisonResult | null>(null)

  // 是否正在运行
  const isRunning = ref(false)

  // 是否正在加载数据
  const isLoading = ref(false)

  // 错误信息
  const error = ref<string | null>(null)

  // 弹窗状态
  const showAddModelDialog = ref(false)
  const showAddDatasetDialog = ref(false)

  // 初始化模型参数为默认值
  const initializeModelParameters = (modelId: string) => {
    if (!modelParameters.value[modelId]) {
      const model = availableModels.value.find((m) => m.id === modelId)
      if (model) {
        modelParameters.value[modelId] = {}
        model.parameters.forEach((param) => {
          modelParameters.value[modelId][param.key] = param.default
        })
      }
    }
  }

  // 设置模型参数
  const setModelParameter = (modelId: string, paramKey: string, value: number) => {
    if (!modelParameters.value[modelId]) {
      initializeModelParameters(modelId)
    }
    modelParameters.value[modelId][paramKey] = value
  }

  // 获取模型参数值
  const getModelParameter = (modelId: string, paramKey: string): number => {
    if (!modelParameters.value[modelId]) {
      initializeModelParameters(modelId)
    }
    return modelParameters.value[modelId]?.[paramKey] ?? 0
  }

  // 重置模型参数为默认值
  const resetModelParameters = (modelId: string) => {
    const model = availableModels.value.find((m) => m.id === modelId)
    if (model) {
      modelParameters.value[modelId] = {}
      model.parameters.forEach((param) => {
        modelParameters.value[modelId][param.key] = param.default
      })
    }
  }

  // 计算属性：是否可以运行
  const canRun = computed(() => {
    return selectedModels.value.length > 0 && selectedDataset.value !== ''
  })

  // 从API获取模型列表
  const fetchModels = async () => {
    try {
      isLoading.value = true
      error.value = null
      const apiModels = await getSupportedModels()

      // 将API模型转换为前端模型格式
      const models: Model[] = apiModels.map((apiModel, index) => ({
        id: apiModel.id,
        name: apiModel.id.toUpperCase(),
        fullName: apiModel.name,
        description: apiModel.description,
        color: getModelColor(index),
        parameters: getDefaultModelParameters(),
      }))

      availableModels.value = models
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取模型列表失败'
      console.error('Failed to fetch models:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 从API获取数据集列表
  const fetchDatasets = async () => {
    try {
      isLoading.value = true
      error.value = null
      const apiDatasets = await getSupportedDatasets()

      // 将API数据集转换为前端数据集格式
      const datasets: Dataset[] = apiDatasets.map((apiDataset) => ({
        id: apiDataset.id,
        name: apiDataset.name,
        description: apiDataset.description,
        fullDescription: `数据集路径: ${apiDataset.full_path}`,
        source: 'API',
        sampleCount: 0, // API没有返回这个信息
        features: [],
        domain: '教育数据',
        year: new Date().getFullYear(),
      }))

      availableDatasets.value = datasets
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取数据集列表失败'
      console.error('Failed to fetch datasets:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 获取模型颜色
  const getModelColor = (index: number): string => {
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']
    return colors[index % colors.length]
  }

  // 获取默认模型参数
  const getDefaultModelParameters = () => {
    // 为不同的模型提供不同的默认参数
    const baseParameters = [
      {
        key: 'initialKnowledge',
        label: '初始知识水平',
        min: 0.3,
        max: 0.7,
        step: 0.05,
        default: 0.48,
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
        default: 0.035,
        description: '数据的随机波动程度',
      },
    ]

    // 可以根据模型ID调整默认参数
    return baseParameters
  }

  // 运行模型对比
  const runComparison = async () => {
    if (!canRun.value) return

    isRunning.value = true
    error.value = null

    try {
      // 调用API进行模型分析
      const apiResponse: ApiAnalysisResponse = await runModelAnalysis(
        selectedModels.value,
        selectedDataset.value
      )

      // 转换API响应为前端格式
      const results: ModelResult[] = []

      for (const modelId of selectedModels.value) {
        const model = availableModels.value.find((m) => m.id === modelId)
        const dataset = availableDatasets.value.find((d) => d.id === selectedDataset.value)
        const apiResult = apiResponse.results[modelId]

        if (model && dataset && apiResult) {
          // 将API的steps和accuracy转换为DataPoint数组
          const data: DataPoint[] = apiResult.steps.map((step, index) => ({
            step: step,
            accuracy: apiResult.accuracy[index] || 0,
          }))

          results.push({
            modelId: model.id,
            modelName: model.name,
            datasetId: dataset.id,
            datasetName: dataset.name,
            data: data,
            color: model.color,
          })
        }
      }

      const result: ComparisonResult = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        models: selectedModels.value,
        dataset: selectedDataset.value,
        results,
      }

      currentResult.value = result
      comparisonResults.value.unshift(result)
    } catch (err) {
      error.value = err instanceof Error ? err.message : '模型分析失败'
      console.error('Failed to run comparison:', err)
    } finally {
      isRunning.value = false
    }
  }

  // 清空结果
  const clearResults = () => {
    currentResult.value = null
  }

  // 初始化：获取模型和数据集列表
  const initialize = async () => {
    await Promise.all([fetchModels(), fetchDatasets()])
  }

  // 重置所有选择
  const resetSelections = () => {
    selectedModels.value = []
    selectedDataset.value = ''
    currentResult.value = null
  }

  // 添加新模型
  const addModel = (model: Model) => {
    // 检查是否已存在相同 ID
    if (availableModels.value.some((m) => m.id === model.id)) {
      throw new Error('模型 ID 已存在')
    }
    availableModels.value.push(model)
    // 初始化参数
    initializeModelParameters(model.id)
  }

  // 删除模型
  const removeModel = (modelId: string) => {
    const index = availableModels.value.findIndex((m) => m.id === modelId)
    if (index > -1) {
      availableModels.value.splice(index, 1)
      // 从选中列表中移除
      const selectedIndex = selectedModels.value.indexOf(modelId)
      if (selectedIndex > -1) {
        selectedModels.value.splice(selectedIndex, 1)
      }
      // 删除参数
      delete modelParameters.value[modelId]
    }
  }

  // 添加新数据集
  const addDataset = (dataset: Dataset) => {
    // 检查是否已存在相同 ID
    if (availableDatasets.value.some((d) => d.id === dataset.id)) {
      throw new Error('数据集 ID 已存在')
    }
    availableDatasets.value.push(dataset)
  }

  // 删除数据集
  const removeDataset = (datasetId: string) => {
    const index = availableDatasets.value.findIndex((d) => d.id === datasetId)
    if (index > -1) {
      availableDatasets.value.splice(index, 1)
      // 如果当前选中的是被删除的数据集，清空选择
      if (selectedDataset.value === datasetId) {
        selectedDataset.value = ''
      }
    }
  }

  return {
    // 状态
    availableModels,
    availableDatasets,
    selectedModels,
    selectedDataset,
    modelParameters,
    comparisonResults,
    currentResult,
    isRunning,
    isLoading,
    error,
    showAddModelDialog,
    showAddDatasetDialog,

    // 计算属性
    canRun,

    // 方法
    initialize,
    runComparison,
    fetchModels,
    fetchDatasets,
    clearResults,
    resetSelections,
    initializeModelParameters,
    setModelParameter,
    getModelParameter,
    resetModelParameters,
    addModel,
    removeModel,
    addDataset,
    removeDataset,
  }
})
