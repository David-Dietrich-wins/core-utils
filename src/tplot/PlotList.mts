import { IId, IUserId } from '../index.mjs'
import { ITradePlot } from './trade-plot.mjs'

export interface IPlotList extends IId, IUserId {
  name: string
  plots: ITradePlot[]
}
