import api from './client'

// API响应类型定义
export interface ModelApiResponse {
  id: string
  name: string
  description: string
  type: string
}

export interface DatasetApiResponse {
  id: string
  name: string
  description: string
  path: string
  full_path: string
}

export interface ModelAnalysisResult {
  model: string
  dataset_path: string
  num_samples: number
  steps: number[]
  accuracy: number[]
  final_accuracy: number
}

export interface AnalysisApiResponse {
  status: string
  dataset_id: string
  models: string[]
  results: Record<string, ModelAnalysisResult>
  combined_file: string
}

// 获取支持的模型列表
export const getSupportedModels = async (): Promise<ModelApiResponse[]> => {
  const response = await api.get('/api/v1/models')
  return response.data.models || []
}

// 获取支持的数据集列表
export const getSupportedDatasets = async (): Promise<DatasetApiResponse[]> => {
  const response = await api.get('/api/v1/datasets')
  return response.data.datasets || []
}

// 运行模型分析
export const runModelAnalysis = async (
  models: string[],
  datasetId: string
): Promise<AnalysisApiResponse> => {
  const response = await api.post('/api/v1/analyze', {
    models,
    dataset_id: datasetId,
  })
  return response.data
}
