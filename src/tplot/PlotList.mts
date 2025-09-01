import { type IIdName } from '../models/id-name.mjs'
import { type ITradePlot } from './TradePlot.mjs'

export interface IPlotList extends IIdName {
  plots: ITradePlot[]
}
