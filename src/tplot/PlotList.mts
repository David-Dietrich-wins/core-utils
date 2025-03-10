import { IUserTable } from '../models/user.mjs'
import { ITradePlot } from './trade-plot.mjs'

export interface IPlotList extends IUserTable {
  name: string
  plots: ITradePlot[]
}
