// Historical Fear and Greed data (multiple entries)
export interface IFearAndGreedHistoricalData {
  data: IFearAndGreedDataPoint[]
}

export interface IFearAndGreedDataPoint {
  timestamp: string
  value: number
  value_classification: string
}
