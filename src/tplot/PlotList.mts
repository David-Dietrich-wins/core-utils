import { IId, IUserId } from '../models/interfaces.mjs'
import { ITradePlot } from './trade-plot.mjs'

export interface IPlotList extends IId, IUserId {
  name: string
  plots: ITradePlot[]
}
