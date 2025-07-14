import type { ValueChangeHandler } from '../models/id-name.mjs'
import type { IValue } from '../models/interfaces.mjs'
import { isArray, safeArray } from '../services/array-helper.mjs'
import { isNullOrUndefined } from '../services/general.mjs'
import {
  InterpolateColorRange,
  InterpolateWeightedColorRange,
  type ColorRange,
} from '../services/html-helper.mjs'
import {
  type PolitiscaleName,
  type IPolitiscale,
  IHasPolitiscales,
} from './politiscale.mjs'

const CONST_ScaleNameClimate = 'climate'
const CONST_ScaleNameFreeSpeech = 'freeSpeech'
const CONST_ScaleNameReligion = 'religion'

const ColorRangeLeft: ColorRange = ['#FF0000', '#0000FF']
const ColorRangeRight: ColorRange = ['#0000FF', '#FF0000']

export type PolitiscaleHeading = {
  name: PolitiscaleName
  heading: string
}

export interface PolitiRating extends IValue<number> {
  active: boolean
  isPrimary: boolean
  weight: number
}
export type PolitiRatingLeftRight = {
  left: PolitiRating
  right: PolitiRating
}

interface PolitiscaleSetting extends PolitiscaleHeading {
  rating: PolitiRatingLeftRight // Where on the scale from left to right (0 - 100)
  colorRange: ColorRange
}

function reduceRatings(ratings: number[]) {
  if (ratings && ratings.length) {
    const scalesRating = ratings.reduce((acc, curNumber) => acc + curNumber, 0)

    return Math.round(scalesRating / ratings.length)
  }

  return 0
}

type PolitiscaleGlobals = {
  ColorRangeLeft: ColorRange
  ColorRangeRight: ColorRange
  settings: [PolitiscaleSetting, PolitiscaleSetting, PolitiscaleSetting]

  combineRatings: (
    primary: PolitiRatingLeftRight,
    applied: PolitiRatingLeftRight
  ) => PolitiRatingLeftRight
  findSetting: (name: PolitiscaleName | string) => PolitiscaleSetting
  getColorRange: (name: PolitiscaleName | string) => ColorRange
  getColorRangeOfParty: (isLeft: boolean) => ColorRange
  getHeadings: () => PolitiscaleHeading[]

  isPolileft: (rating?: number) => boolean
  isPoliright: (rating?: number) => boolean

  politiRating: (
    name: string | PolitiscaleName,
    rating?: number,
    isLeft?: boolean
  ) => PolitiRatingLeftRight

  rating: (name: PolitiscaleName, rating?: number, isLeft?: boolean) => number
  ratingOverall: (scales: IPolitiscale[]) => PolitiRatingLeftRight
}

const politiscaleGlobal: PolitiscaleGlobals = {
  ColorRangeLeft: ColorRangeLeft,
  ColorRangeRight: ColorRangeRight,
  settings: [
    {
      name: CONST_ScaleNameClimate,
      heading: 'Climate Rating',
      rating: {
        left: {
          active: true,
          isPrimary: true,
          value: 0,
          weight: 1,
        },
        right: {
          active: true,
          isPrimary: false,
          value: 0,
          weight: 0.1,
        },
      },
      colorRange: InterpolateWeightedColorRange(ColorRangeLeft, 90, 100),
    },
    {
      name: CONST_ScaleNameFreeSpeech,
      heading: 'Free Speech',
      rating: {
        left: {
          active: true,
          isPrimary: false,
          value: 0,
          weight: 0.4,
        },
        right: {
          active: true,
          isPrimary: true,
          value: 0,
          weight: 0.5,
        },
      },
      colorRange: InterpolateWeightedColorRange(ColorRangeRight, 40, 60),
    },
    {
      name: CONST_ScaleNameReligion,
      heading: 'Religious Freedom',
      rating: {
        left: {
          active: true,
          isPrimary: false,
          value: 0,
          weight: 0.1,
        },
        right: {
          active: true,
          isPrimary: true,
          value: 0,
          weight: 1,
        },
      },
      colorRange: InterpolateWeightedColorRange(ColorRangeRight, 90, 100),
    },
  ],

  combineRatings: function (primary, applied) {
    if (
      !primary.left.active ||
      !primary.right.active ||
      !applied.left.active ||
      !applied.right.active
    ) {
      return primary
    }

    let isLeft = primary.left.isPrimary
    let isRight = primary.right.isPrimary
    let ratingLeft = primary.left.active ? primary.left.value : 0
    let ratingRight = primary.right.active ? primary.right.value : 0

    if (ratingLeft && applied.left.active && applied.left.value) {
      ratingLeft += applied.left.value
      ratingLeft = Math.round(ratingLeft / 2)

      if (isLeft && !applied.left.isPrimary) {
        isLeft = this.isPolileft(ratingLeft)
      }
    }

    if (ratingRight && applied.right.active && applied.right.isPrimary) {
      ratingRight += applied.right.value
      ratingRight = Math.round(ratingRight / 2)

      if (isRight && !applied.right.isPrimary) {
        isRight = this.isPoliright(ratingRight)
      }
    }

    return {
      left: {
        isPrimary: isLeft,
        active: primary.left.active,
        value: ratingLeft,
        weight: applied.left.weight
          ? primary.left.weight * applied.left.weight
          : primary.left.weight,
      },
      right: {
        isPrimary: isRight,
        active: primary.right.active,
        value: ratingRight,
        weight: applied.right.weight
          ? primary.right.weight * applied.right.weight
          : primary.right.weight,
      },
    }
  },

  findSetting: function (name) {
    const setting = this.settings.find((x) => x.name === name)
    if (!setting) {
      throw new Error(`Attempt to find setting for invalid name ${name}.`)
    }

    return setting
  },
  getColorRange: function (name) {
    return this.findSetting(name).colorRange
  },
  getColorRangeOfParty: function (isLeft) {
    return isLeft ? ColorRangeLeft : ColorRangeRight
  },
  getHeadings: function () {
    return this.settings.map((x) => {
      const heading: PolitiscaleHeading = {
        name: x.name,
        heading: x.heading,
      }

      return heading
    })
  },

  isPolileft: function (rating) {
    return (rating ?? 0) < 60
  },
  isPoliright: function (rating) {
    return (rating ?? 0) > 50
  },

  /**
   * Retrieves the PolitiRating based on the PolitiscaleName and the rating passed in.
   * @param name The PolitiscaleName to get the ratings for.
   * @param rating The rating to be translated.
   */
  politiRating(name, rating) {
    let left = rating ?? 0
    let right = rating ?? 0

    const setting = this.findSetting(name).rating

    if (rating) {
      if (setting.left.active) {
        left = Math.round(rating * setting.left.weight)
      }

      if (setting.right.active) {
        right = Math.round(rating * setting.right.weight)
      }
    }
    return {
      left: {
        isPrimary: setting.left.isPrimary,
        active: setting.left.active,
        value: left,
        weight: setting.left.weight,
      },
      right: {
        isPrimary: setting.right.isPrimary,
        active: setting.right.active,
        value: right,
        weight: setting.right.weight,
      },
    }
  },

  rating(name, rating) {
    const pr = this.politiRating(name, rating)

    return pr.left.isPrimary ? pr.left.value : pr.right.value
  },

  ratingOverall: function (scales) {
    const ratingsLeft: number[] = []
    const ratingsRight: number[] = []

    scales.forEach((scale) => {
      const pr = this.politiRating(scale.name, scale.value)

      if (pr.left.active && pr.left.value) {
        ratingsLeft.push(pr.left.value)
      }

      if (pr.right.active && pr.right.value) {
        ratingsRight.push(pr.right.value)
      }
    })

    const left = reduceRatings(ratingsLeft)
    const right = reduceRatings(ratingsRight)

    return {
      left: {
        isPrimary: this.isPolileft(left),
        active: true,
        value: left,
        weight: 0,
      },
      right: {
        isPrimary: this.isPoliright(right),
        active: true,
        value: right,
        weight: 0,
      },
    }
  },
}

export type PolitiscalesSliderProps = {
  componentSuffix: string
  disabled: boolean
  formData: IPolitiscale
  colorRange: ColorRange
  onChangeCommittedHandler?: ValueChangeHandler<IPolitiscale>
  onChangeHandler?: ValueChangeHandler<IPolitiscale>
  showMarks?: boolean
  title?: string
}

type PolitiformHelper = {
  colorFromScales: (
    scales?: IHasPolitiscales | IPolitiscale[],
    userScales?: IHasPolitiscales | IPolitiscale[],
    colorIfEmpty?: string
  ) => string
  politiscaleValue: (
    scaleName: PolitiscaleName,
    formDataOrScaleArray?: IHasPolitiscales | IPolitiscale[],
    valueIfEmpty?: number
  ) => number

  getRating: (scales: IHasPolitiscales | IPolitiscale[]) => number
  ratingClimate: (
    scaleval?: number | IHasPolitiscales | IPolitiscale[],
    isLeft?: boolean
  ) => number
  ratingForScale: (
    name: PolitiscaleName,
    formDataOrScaleArray?: IHasPolitiscales | IPolitiscale[] | number,
    isLeft?: boolean
  ) => number
  ratingForScaleRaw: (
    name: PolitiscaleName,
    formDataOrScaleArray?: IHasPolitiscales | IPolitiscale[] | number
  ) => number
  ratingFreeSpeech: (
    scaleval?: number | IHasPolitiscales | IPolitiscale[],
    isLeft?: boolean
  ) => number
  ratingOverall: (
    scales?: IHasPolitiscales | IPolitiscale[],
    userScales?: IHasPolitiscales | IPolitiscale[]
  ) => PolitiRatingLeftRight
  ratingReligion: (
    scaleval?: number | IHasPolitiscales | IPolitiscale[],
    isLeft?: boolean
  ) => number

  getScale: (
    name: PolitiscaleName,
    formDataOrScaleArray?: IHasPolitiscales | IPolitiscale[]
  ) => IPolitiscale | undefined
  getScales: (scales?: IHasPolitiscales | IPolitiscale[]) => IPolitiscale[]
}

const formHelper: PolitiformHelper = {
  colorFromScales: function (scales, userScales, colorIfEmpty = '#EEEEEE') {
    const status = this.ratingOverall(scales, userScales)

    if (status.left.active && status.left.value) {
      return InterpolateColorRange(
        politiscaleGlobal.ColorRangeLeft,
        status.left.value
      )
    }

    return colorIfEmpty
  },

  getRating: function (
    scales: IHasPolitiscales | IPolitiscale[],
    isLeft?: boolean
  ) {
    const overall = politiscaleGlobal.ratingOverall(this.getScales(scales))

    return isNullOrUndefined(isLeft) || isLeft
      ? overall.left.value
      : overall.right.value
  },

  getScale: function (name, formDataOrScaleArray) {
    const arrScales = this.getScales(formDataOrScaleArray)

    const scale = arrScales.find((x) => name === x.name)
    // if (!scale) {
    //   throw new Error(`Attempt to get PolitiScale for invalid name ${name}.`)
    // }

    return scale
  },

  getScales: function (scales) {
    const arrScales: IPolitiscale[] = isArray(scales as unknown)
      ? (scales as IPolitiscale[])
      : safeArray((scales as IHasPolitiscales)?.scales)

    return safeArray(arrScales)
  },

  politiscaleValue: function (scaleName, formDataOrScaleArray, valueIfEmpty) {
    return (
      this.getScale(scaleName, formDataOrScaleArray)?.value ?? valueIfEmpty ?? 0
    )
  },

  ratingClimate: function (scaleval, isLeft) {
    return this.ratingForScale(CONST_ScaleNameClimate, scaleval, isLeft)
  },

  ratingForScale: function (name, formDataOrScaleArray, isLeft) {
    const rating = this.ratingForScaleRaw(name, formDataOrScaleArray)

    return politiscaleGlobal.rating(name, rating, isLeft)
  },
  ratingForScaleRaw: function (name, formDataOrScaleArray) {
    if (isNullOrUndefined(formDataOrScaleArray)) {
      return 0
    }

    if ('number' === typeof formDataOrScaleArray) {
      return formDataOrScaleArray
    }

    return this.getScale(name, formDataOrScaleArray)?.value ?? 0
  },

  ratingFreeSpeech: function (scaleval, isLeft) {
    return this.ratingForScale(CONST_ScaleNameFreeSpeech, scaleval, isLeft)
  },

  ratingOverall: function (scales, userScales) {
    const rating = politiscaleGlobal.ratingOverall(this.getScales(scales))

    if (userScales) {
      const userRating = politiscaleGlobal.ratingOverall(
        this.getScales(userScales)
      )

      return politiscaleGlobal.combineRatings(rating, userRating)
    }

    return rating
  },

  ratingReligion: function (scaleval, isLeft) {
    return this.ratingForScale(CONST_ScaleNameReligion, scaleval, isLeft)
  },
}

export function PolitiscaleHeadings() {
  return politiscaleGlobal.getHeadings()
}

export interface PolirangeProps {
  scale: IPolitiscale
  title: string
  componentSuffix: string
  minValue?: number
  maxValue?: number
  disabled: boolean
  colorRange: ColorRange
  onChangeCommittedHandler?: ValueChangeHandler<IPolitiscale>
  onChangeHandler?: ValueChangeHandler<IPolitiscale>
  showMarks?: boolean
  valueLabelDisplay: 'on' | 'auto' | 'off'
}

export function PolitiscaleColor(
  name: PolitiscaleName | string,
  rating: number
) {
  return InterpolateColorRange(PolitiscaleColorRange(name), rating)
}
export function PoliticalColorFromScales(
  scales?: IHasPolitiscales | IPolitiscale[],
  userScales?: IHasPolitiscales | IPolitiscale[],
  colorIfEmpty = '#EEEEEE'
) {
  return formHelper.colorFromScales(scales, userScales, colorIfEmpty)
}
export function PolitiscaleColorRange(name: PolitiscaleName | string) {
  return politiscaleGlobal.getColorRange(name)
}

export function PolitiscaleRating(scales?: IHasPolitiscales | IPolitiscale[]) {
  return formHelper.ratingOverall(scales)
}

export function PolitiscaleValue(
  name: PolitiscaleName,
  scales?: IHasPolitiscales | IPolitiscale[],
  valueIfEmpty?: number
) {
  return formHelper.politiscaleValue(name, scales, valueIfEmpty)
}
export function PolitiscaleValueClimate(
  scales?: IHasPolitiscales | IPolitiscale[],
  valueIfEmpty?: number
) {
  return PolitiscaleValue(CONST_ScaleNameClimate, scales, valueIfEmpty)
}
export function PolitiscaleValueFreeSpeech(
  scales?: IHasPolitiscales | IPolitiscale[],
  valueIfEmpty?: number
) {
  return PolitiscaleValue(CONST_ScaleNameFreeSpeech, scales, valueIfEmpty)
}
export function PolitiscaleValueReligion(
  scales?: IHasPolitiscales | IPolitiscale[],
  valueIfEmpty?: number
) {
  return PolitiscaleValue(CONST_ScaleNameReligion, scales, valueIfEmpty)
}

export function setPolitiscaleValue(
  scale: IPolitiscale,
  value: string | number
) {
  const newFormData: IPolitiscale = { ...scale, value: Number(value) }

  return newFormData
}

export function getNewPolitiscales(
  scales: IPolitiscale[],
  scale: IPolitiscale
) {
  const newarr = Array.from(safeArray(scales))
  const findScale = newarr.find((x) => x.name === scale.name)
  if (findScale) {
    findScale.value = scale.value
  } else {
    newarr.push(scale)
  }

  return newarr
}

// export function IsPoliticallyLeft(scales?: IHasPolitiscales | IPolitiscale[]) {
//   return formHelper.ratingOverall(scales).isLeft
// }

export type PolitiscalesEditorProps = {
  componentSuffix: string
  politiscales: IPolitiscale[]
  showMarks?: boolean
  onChangeCommittedHandler?: ValueChangeHandler<IPolitiscale[]>
  onChangeHandler?: ValueChangeHandler<IPolitiscale[]>
}
