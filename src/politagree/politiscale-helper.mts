import { AppException } from '../models/AppException.mjs'
import type { ValueChangeHandler } from '../models/id-name.mjs'
import type { IValue } from '../models/interfaces.mjs'
import { isArray, safeArray } from '../services/array-helper.mjs'
import { isNullOrUndefined } from '../services/general.mjs'
import { ColorHelper, type ColorRange } from '../services/color-helper.mjs'
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

export abstract class PolitiscaleHelper {
  static readonly settings: [
    PolitiscaleSetting,
    PolitiscaleSetting,
    PolitiscaleSetting
  ] = [
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
      colorRange: ColorHelper.InterpolateWeightedColorRange(
        ColorRangeLeft,
        90,
        100
      ),
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
      colorRange: ColorHelper.InterpolateWeightedColorRange(
        ColorRangeRight,
        40,
        60
      ),
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
      colorRange: ColorHelper.InterpolateWeightedColorRange(
        ColorRangeRight,
        90,
        100
      ),
    },
  ]

  static FindSetting(name: string | PolitiscaleName): PolitiscaleSetting {
    const setting = PolitiscaleHelper.settings.find((x) => x.name === name)
    if (!setting) {
      throw new AppException(
        `Attempt to find setting for invalid name ${name}.`,
        PolitiscaleHelper.FindSetting.name
      )
    }

    return setting
  }

  static getColorRange(name: string | PolitiscaleName): ColorRange {
    return PolitiscaleHelper.FindSetting(name).colorRange
  }

  static PolitiscaleHeadings(): PolitiscaleHeading[] {
    return this.settings.map((x) => {
      const heading: PolitiscaleHeading = {
        name: x.name,
        heading: x.heading,
      }

      return heading
    })
  }

  /**
   * Retrieves the PolitiRating based on the PolitiscaleName and the rating passed in.
   * @param name The PolitiscaleName to get the ratings for.
   * @param rating The rating to be translated.
   */
  static CoreRating(
    name: string | PolitiscaleName,
    rating?: number
  ): PolitiRatingLeftRight {
    let left = rating ?? 0
    let right = rating ?? 0

    const setting = PolitiscaleHelper.FindSetting(name).rating

    if (rating) {
      // if (setting.left.active) {
      left = Math.round(rating * setting.left.weight)
      // }

      // if (setting.right.active) {
      right = Math.round(rating * setting.right.weight)
      // }
    }

    const leaning: Readonly<PolitiRatingLeftRight> = {
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

    return leaning
  }
  static CoreRatingValueTuple(
    name: string | PolitiscaleName,
    rating?: number
  ): [number, number] {
    const pr = PolitiscaleHelper.CoreRating(name, rating)

    return [
      pr.left.active && pr.left.value ? pr.left.value : 0,
      pr.right.active && pr.right.value ? pr.right.value : 0,
    ]
  }

  static PrimaryRating(
    name: string | PolitiscaleName,
    rating?: number
  ): number {
    const pr = PolitiscaleHelper.CoreRating(name, rating)

    return pr.left.isPrimary ? pr.left.value : pr.right.value
  }

  static RatingOverall(
    scales: { name: string | PolitiscaleName; value?: number }[] = []
  ): PolitiRatingLeftRight {
    const ratingsLeft: number[] = []
    const ratingsRight: number[] = []

    safeArray(scales).forEach((scale) => {
      const pr = PolitiscaleHelper.CoreRating(scale.name, scale.value)

      if (pr.left.active && pr.left.value) {
        ratingsLeft.push(pr.left.value)
      }

      if (pr.right.active && pr.right.value) {
        ratingsRight.push(pr.right.value)
      }
    })

    const left = reduceRatings(ratingsLeft)
    const right = reduceRatings(ratingsRight)

    const leaning: PolitiRatingLeftRight = {
      left: {
        isPrimary: PolitiscaleHelper.IsLeftLeaning(left),
        active: true,
        value: left,
        weight: 0,
      },
      right: {
        isPrimary: PolitiscaleHelper.IsRightLeaning(right),
        active: true,
        value: right,
        weight: 0,
      },
    }

    return leaning
  }

  static UserRatingOverall(
    scales: IHasPolitiscales | IPolitiscale[] = [],
    userScales: IHasPolitiscales | IPolitiscale[] = []
  ) {
    const rating = PolitiscaleHelper.RatingOverall(
      PolitiscaleHelper.getScales(scales)
    )

    if (isArray(userScales as unknown)) {
      const userRating = PolitiscaleHelper.RatingOverall(
        PolitiscaleHelper.getScales(userScales)
      )

      return PolitiscaleHelper.CombineRatings(rating, userRating)
    }

    return rating
  }

  static IsLeftLeaning(rating?: number) {
    return (rating ?? 0) < 60
  }
  static IsRightLeaning(rating?: number) {
    return (rating ?? 0) > 50
  }
  static ColorRangeOfParty(isLeft: boolean) {
    return isLeft ? ColorRangeLeft : ColorRangeRight
  }

  static CombineRatings(
    primary: PolitiRatingLeftRight,
    applied: PolitiRatingLeftRight
  ) {
    // if (
    //   !primary.left.active ||
    //   !primary.right.active ||
    //   !applied.left.active ||
    //   !applied.right.active
    // ) {
    //   return primary
    // }

    let isLeft = primary.left.isPrimary
    let isRight = primary.right.isPrimary
    let ratingLeft = primary.left.active ? primary.left.value : 0
    let ratingRight = primary.right.active ? primary.right.value : 0

    if (ratingLeft && applied.left.active && applied.left.value) {
      ratingLeft += applied.left.value
      ratingLeft = Math.round(ratingLeft / 2)

      if (isLeft && !applied.left.isPrimary) {
        isLeft = PolitiscaleHelper.IsLeftLeaning(ratingLeft)
      }
    }

    if (ratingRight && applied.right.active && applied.right.value) {
      ratingRight += applied.right.value
      ratingRight = Math.round(ratingRight / 2)

      if (isRight && !applied.right.isPrimary) {
        isRight = PolitiscaleHelper.IsRightLeaning(ratingRight)
      }
    }

    const pl: PolitiRatingLeftRight = {
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

    return pl
  }

  static PolitiscaleColor(name: PolitiscaleName | string, rating: number) {
    return ColorHelper.InterpolateColorRange(
      PolitiscaleHelper.PolitiscaleColorRange(name),
      rating
    )
  }
  static UserColorFromScales(
    scales?: IHasPolitiscales | IPolitiscale[],
    userScales?: IHasPolitiscales | IPolitiscale[],
    colorIfEmpty = '#EEEEEE'
  ) {
    const status = PolitiscaleHelper.UserRatingOverall(scales, userScales)

    if (status.left.active && status.left.value) {
      return ColorHelper.InterpolateColorRange(
        ColorRangeLeft,
        status.left.value
      )
    }

    return colorIfEmpty
  }
  static PolitiscaleColorRange(name: PolitiscaleName | string) {
    return PolitiscaleHelper.getColorRange(name)
  }

  static PolitiscaleRating(
    scales?: { name: string | PolitiscaleName; value?: number }[]
  ) {
    return PolitiscaleHelper.RatingOverall(scales)
  }

  static PolitiscaleValue(
    name: PolitiscaleName,
    scales?: IHasPolitiscales | IPolitiscale[],
    valueIfEmpty?: number
  ) {
    return PolitiscaleHelper.politiscaleValue(name, scales, valueIfEmpty)
  }
  static PolitiscaleValueClimate(
    scales?: IHasPolitiscales | IPolitiscale[],
    valueIfEmpty?: number
  ) {
    return PolitiscaleHelper.PolitiscaleValue(
      CONST_ScaleNameClimate,
      scales,
      valueIfEmpty
    )
  }
  static PolitiscaleValueFreeSpeech(
    scales?: IHasPolitiscales | IPolitiscale[],
    valueIfEmpty?: number
  ) {
    return PolitiscaleHelper.PolitiscaleValue(
      CONST_ScaleNameFreeSpeech,
      scales,
      valueIfEmpty
    )
  }
  static PolitiscaleValueReligion(
    scales?: IHasPolitiscales | IPolitiscale[],
    valueIfEmpty?: number
  ) {
    return PolitiscaleHelper.PolitiscaleValue(
      CONST_ScaleNameReligion,
      scales,
      valueIfEmpty
    )
  }

  static setPolitiscaleValue(scale: IPolitiscale, value: string | number) {
    const newFormData: IPolitiscale = { ...scale, value: Number(value) }

    return newFormData
  }

  static getNewPolitiscales(scales: IPolitiscale[], scale: IPolitiscale) {
    const newarr = Array.from(safeArray(scales))
    const findScale = newarr.find((x) => x.name === scale.name)
    if (findScale) {
      findScale.value = scale.value
    } else {
      newarr.push(scale)
    }

    return newarr
  }

  static getScale(
    name: PolitiscaleName | string,
    formDataOrScaleArray?: IHasPolitiscales | IPolitiscale[]
  ) {
    const arrScales = this.getScales(formDataOrScaleArray)

    const scale = arrScales.find((x) => name === x.name)
    // if (!scale) {
    //   throw new Error(`Attempt to get PolitiScale for invalid name ${name}.`)
    // }

    return scale
  }

  static getScales(scales: IHasPolitiscales | IPolitiscale[] = []) {
    const arrScales: IPolitiscale[] = isArray(scales as unknown)
      ? (scales as IPolitiscale[])
      : safeArray((scales as IHasPolitiscales)?.scales)

    return safeArray(arrScales)
  }

  static ratingForScale(
    name: PolitiscaleName | string,
    formDataOrScaleArray: number | IHasPolitiscales | IPolitiscale[]
  ) {
    const rating = PolitiscaleHelper.ratingForScaleRaw(
      name,
      formDataOrScaleArray
    )

    return PolitiscaleHelper.PrimaryRating(name, rating)
  }

  static ratingForScaleRaw(
    name: PolitiscaleName | string,
    formDataOrScaleArray?: number | IHasPolitiscales | IPolitiscale[] | null
  ) {
    if (isNullOrUndefined(formDataOrScaleArray)) {
      return 0
    }

    if ('number' === typeof formDataOrScaleArray) {
      return formDataOrScaleArray
    }

    return PolitiscaleHelper.getScale(name, formDataOrScaleArray)?.value ?? 0
  }

  static getRating(
    scales: IHasPolitiscales | IPolitiscale[],
    isLeft?: boolean
  ) {
    const overall = PolitiscaleHelper.RatingOverall(
      PolitiscaleHelper.getScales(scales)
    )

    return isNullOrUndefined(isLeft) || isLeft
      ? overall.left.value
      : overall.right.value
  }

  static politiscaleValue(
    scaleName: PolitiscaleName,
    formDataOrScaleArray?: IHasPolitiscales | IPolitiscale[],
    valueIfEmpty?: number
  ) {
    return (
      PolitiscaleHelper.getScale(scaleName, formDataOrScaleArray)?.value ??
      valueIfEmpty ??
      0
    )
  }

  static ratingClimate(scaleval: number | IHasPolitiscales | IPolitiscale[]) {
    return PolitiscaleHelper.ratingForScale(CONST_ScaleNameClimate, scaleval)
  }

  static ratingFreeSpeech(scaleval) {
    return PolitiscaleHelper.ratingForScale(CONST_ScaleNameFreeSpeech, scaleval)
  }

  static ratingReligion(scaleval) {
    return PolitiscaleHelper.ratingForScale(CONST_ScaleNameReligion, scaleval)
  }

  // static  IsPoliticallyLeft(scales?: IHasPolitiscales | IPolitiscale[]) {
  //   return formHelper.ratingOverall(scales).isLeft
  // }
}

export type PolitiscalesEditorProps = {
  componentSuffix: string
  politiscales: IPolitiscale[]
  showMarks?: boolean
  onChangeCommittedHandler?: ValueChangeHandler<IPolitiscale[]>
  onChangeHandler?: ValueChangeHandler<IPolitiscale[]>
}
