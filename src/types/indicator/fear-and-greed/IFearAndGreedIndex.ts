export interface IFearAndGreedIndexData {
  data: IFearAndGreedIndex
}

export interface IFearAndGreedIndex {
  value: number
  value_classification: string
  update_time: string // ISO 8601 timestamp
}
