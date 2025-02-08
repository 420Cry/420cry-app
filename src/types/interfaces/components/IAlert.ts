export interface IAlert {
  show: boolean
  type: 'info' | 'success' | 'danger' | 'warning'
  message: string
}
