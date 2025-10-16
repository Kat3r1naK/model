//1 模型参数定义
export interface ModelParameter {
  key: string
  label: string
  min: number
  max: number
  step: number
  default: number
  description: string
}

// 模型类型 (前端使用)
export interface Model {
  id: string
  name: string
  fullName: string
  description: string
  color: string
  parameters: ModelParameter[]
}

// API返回的模型类型
export interface ApiModel {
  id: string
  name: string
  description: string
  type: string
}

// 模型参数值
export interface ModelParameterValues {
  [modelId: string]: {
    [paramKey: string]: number
  }
}

// 数据集类型 (前端使用)
export interface Dataset {
  id: string
  name: string
  description: string
  fullDescription?: string // 详细描述
  source?: string // 数据来源
  sampleCount?: number // 样本数量
  features?: string[] // 特征列表
  domain?: string // 领域
  year?: number // 年份
}

// API返回的数据集类型
export interface ApiDataset {
  id: string
  name: string
  description: string
  path: string
  full_path: string
}

// 结果数据点
export interface DataPoint {
  step: number
  accuracy: number
}

// 模型运行结果
export interface ModelResult {
  modelId: string
  modelName: string
  datasetId: string
  datasetName: string
  data: DataPoint[]
  color: string
}

// API分析结果类型
export interface ApiModelResult {
  model: string
  dataset_path: string
  num_samples: number
  steps: number[]
  accuracy: number[]
  final_accuracy: number
}

export interface ApiAnalysisResponse {
  status: string
  dataset_id: string
  models: string[]
  results: Record<string, ApiModelResult>
  combined_file: string
}

// 比较结果
export interface ComparisonResult {
  id: string
  timestamp: number
  models: string[]
  dataset: string
  results: ModelResult[]
}
