import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Model,
  Dataset,
  ComparisonResult,
  ModelResult,
  DataPoint,
  ModelParameterValues,
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

  // 模拟模型运行，生成数据
  const generateModelData = (modelId: string, steps = 60): DataPoint[] => {
    const data: DataPoint[] = []

    if (!modelId) return data

    // 确保模型参数已初始化
    if (!modelParameters.value[modelId]) {
      initializeModelParameters(modelId)
    }

    // 从参数中获取值
    const baseAccuracy = getModelParameter(modelId, 'initialKnowledge')
    const learningRate = getModelParameter(modelId, 'learningRate')
    const noise = getModelParameter(modelId, 'noise')

    for (let i = 0; i < steps; i++) {
      // 使用 sigmoid 曲线模拟学习过程
      const progress = i / steps
      const sigmoid = 1 / (1 + Math.exp(-10 * (progress - 0.5)))
      const trend = baseAccuracy + sigmoid * learningRate

      // 添加随机噪声
      const randomNoise = (Math.random() - 0.5) * noise * 2

      // 添加一些周期性波动
      const wave = Math.sin(i / 5) * 0.01

      let accuracy = trend + randomNoise + wave

      // 确保准确率在合理范围内
      accuracy = Math.max(0.4, Math.min(0.95, accuracy))

      data.push({
        step: i + 1,
        accuracy: Number(accuracy.toFixed(4)),
      })
    }

    return data
  }

  // 运行模型对比
  const runComparison = async () => {
    if (!canRun.value) return

    isRunning.value = true

    // 模拟异步运行
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const results: ModelResult[] = []

    for (const modelId of selectedModels.value) {
      const model = availableModels.value.find((m: Model) => m.id === modelId)
      const dataset = availableDatasets.value.find((d: Dataset) => d.id === selectedDataset.value)

      if (model && dataset) {
        results.push({
          modelId: model.id,
          modelName: model.name,
          datasetId: dataset.id,
          datasetName: dataset.name,
          data: generateModelData(model.id),
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

    isRunning.value = false
  }

  // 清空结果
  const clearResults = () => {
    currentResult.value = null
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
    showAddModelDialog,
    showAddDatasetDialog,

    // 计算属性
    canRun,

    // 方法
    runComparison,
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
