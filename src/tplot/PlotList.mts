import { IIdName } from '../models/id-name.mjs'
import { ITradePlot } from './TradePlot.mjs'

export interface IPlotList extends IIdName {
  plots: ITradePlot[]
}
