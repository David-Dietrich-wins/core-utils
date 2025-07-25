import { ColorHelper, type ColorRange } from '../services/color-helper.mjs'
import type { ICity, IdNameSlugWithScales } from './city.mjs'
import {
  IHasPolitiscales,
  type IPolitiscale,
  type PolitiscaleName,
} from './politiscale.mjs'
import type { ISymbolDetail, ITickerSearch } from '../models/ticker-info.mjs'
import type { IdNameValue, ValueChangeHandler } from '../models/id-name.mjs'
import { isArray, safeArray } from '../services/array-helper.mjs'
import { safestr, safestrLowercase } from '../services/string-helper.mjs'
import { AppException } from '../models/AppException.mjs'
import type { IValue } from '../models/interfaces.mjs'
import { isNullOrUndefined } from '../services/general.mjs'

const CONST_ScaleNameClimate = 'climate',
  CONST_ScaleNameFreeSpeech = 'freeSpeech',
  CONST_ScaleNameReligion = 'religion',
  ColorRangeLeft: ColorRange = ['#FF0000', '#0000FF'],
  ColorRangeRight: ColorRange = ['#0000FF', '#FF0000']

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
  // Where on the scale from left to right (0 - 100)
  rating: PolitiRatingLeftRight
  colorRange: ColorRange
}

function reduceRatings(ratings: number[]) {
  if (ratings.length) {
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

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class PolitiscaleHelper {
  static readonly settings: [
    PolitiscaleSetting,
    PolitiscaleSetting,
    PolitiscaleSetting
  ] = [
    {
      colorRange: ColorHelper.InterpolateWeightedColorRange(
        ColorRangeLeft,
        90,
        100
      ),
      heading: 'Climate Rating',
      name: CONST_ScaleNameClimate,
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
    },
    {
      colorRange: ColorHelper.InterpolateWeightedColorRange(
        ColorRangeRight,
        40,
        60
      ),
      heading: 'Free Speech',
      name: CONST_ScaleNameFreeSpeech,
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
    },
    {
      colorRange: ColorHelper.InterpolateWeightedColorRange(
        ColorRangeRight,
        90,
        100
      ),
      heading: 'Religious Freedom',
      name: CONST_ScaleNameReligion,
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
    },
  ]

  static FindSetting(name: PolitiscaleName): PolitiscaleSetting {
    const setting = PolitiscaleHelper.settings.find((x) => x.name === name)
    if (!setting) {
      throw new AppException(
        `Attempt to find setting for invalid name ${name}.`,
        PolitiscaleHelper.FindSetting.name
      )
    }

    return setting
  }

  static getColorRange(name: PolitiscaleName): ColorRange {
    return PolitiscaleHelper.FindSetting(name).colorRange
  }

  static PolitiscaleHeadings(): PolitiscaleHeading[] {
    return this.settings.map((x) => {
      const heading: PolitiscaleHeading = {
        heading: x.heading,
        name: x.name,
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
    name: PolitiscaleName,
    rating?: number
  ): PolitiRatingLeftRight {
    let left = rating ?? 0,
      right = rating ?? 0

    const setting = PolitiscaleHelper.FindSetting(name).rating

    if (rating) {
      // If (setting.left.active) {
      left = Math.round(rating * setting.left.weight)
      // }

      // If (setting.right.active) {
      right = Math.round(rating * setting.right.weight)
      // }
    }

    const leaning: Readonly<PolitiRatingLeftRight> = {
      left: {
        active: setting.left.active,
        isPrimary: setting.left.isPrimary,
        value: left,
        weight: setting.left.weight,
      },
      right: {
        active: setting.right.active,
        isPrimary: setting.right.isPrimary,
        value: right,
        weight: setting.right.weight,
      },
    }

    return leaning
  }
  static CoreRatingValueTuple(
    name: PolitiscaleName,
    rating?: number
  ): [number, number] {
    const pr = PolitiscaleHelper.CoreRating(name, rating)

    return [
      pr.left.active && pr.left.value ? pr.left.value : 0,
      pr.right.active && pr.right.value ? pr.right.value : 0,
    ]
  }

  static PrimaryRating(name: PolitiscaleName, rating?: number): number {
    const pr = PolitiscaleHelper.CoreRating(name, rating)

    return pr.left.isPrimary ? pr.left.value : pr.right.value
  }

  static RatingOverall(
    scales: { name: PolitiscaleName; value?: number }[] = []
  ): PolitiRatingLeftRight {
    const ratingsLeft: number[] = [],
      ratingsRight: number[] = []

    safeArray(scales).forEach((scale) => {
      const pr = PolitiscaleHelper.CoreRating(scale.name, scale.value)

      if (pr.left.active && pr.left.value) {
        ratingsLeft.push(pr.left.value)
      }

      if (pr.right.active && pr.right.value) {
        ratingsRight.push(pr.right.value)
      }
    })

    const aleft = reduceRatings(ratingsLeft),
      aright = reduceRatings(ratingsRight),
      leaning: PolitiRatingLeftRight = {
        left: {
          active: true,
          isPrimary: PolitiscaleHelper.IsLeftLeaning(aleft),
          value: aleft,
          weight: 0,
        },
        right: {
          active: true,
          isPrimary: PolitiscaleHelper.IsRightLeaning(aright),
          value: aright,
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
        PolitiscaleHelper.getScales(userScales as IPolitiscale[])
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
    // If (
    //   !primary.left.active ||
    //   !primary.right.active ||
    //   !applied.left.active ||
    //   !applied.right.active
    // ) {
    //   Return primary
    // }

    let isLeft = primary.left.isPrimary,
      isRight = primary.right.isPrimary,
      ratingLeft = primary.left.active ? primary.left.value : 0,
      ratingRight = primary.right.active ? primary.right.value : 0

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
        active: primary.left.active,
        isPrimary: isLeft,
        value: ratingLeft,
        weight: applied.left.weight
          ? primary.left.weight * applied.left.weight
          : primary.left.weight,
      },
      right: {
        active: primary.right.active,
        isPrimary: isRight,
        value: ratingRight,
        weight: applied.right.weight
          ? primary.right.weight * applied.right.weight
          : primary.right.weight,
      },
    }

    return pl
  }

  static PolitiscaleColor(name: PolitiscaleName, rating: number) {
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
  static PolitiscaleColorRange(name: PolitiscaleName) {
    return PolitiscaleHelper.getColorRange(name)
  }

  static PolitiscaleRating(
    scales?: { name: PolitiscaleName; value?: number }[]
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
    const farr = Array.from(safeArray(scales)),
      findScale = farr.find((x) => x.name === scale.name)
    if (findScale) {
      findScale.value = scale.value
    } else {
      farr.push(scale)
    }

    return farr
  }

  static getScale(
    name: PolitiscaleName,
    formDataOrScaleArray?: IHasPolitiscales | IPolitiscale[]
  ) {
    const arrScales = this.getScales(formDataOrScaleArray),
      scale = arrScales.find((x) => name === x.name)
    // If (!scale) {
    //   throw new AppException(`Attempt to get PolitiScale for invalid name ${name}.`)
    // }

    return scale
  }

  static getScales(
    scales: IHasPolitiscales | IPolitiscale[] | null | undefined = []
  ) {
    if (isNullOrUndefined(scales)) {
      return []
    }

    const arrScales: IPolitiscale[] = isArray(scales as unknown)
      ? (scales as IPolitiscale[])
      : safeArray((scales as IHasPolitiscales).scales)

    return safeArray(arrScales)
  }

  static ratingForScale(
    name: PolitiscaleName,
    formDataOrScaleArray: number | IHasPolitiscales | IPolitiscale[]
  ) {
    const rating = PolitiscaleHelper.ratingForScaleRaw(
      name,
      formDataOrScaleArray
    )

    return PolitiscaleHelper.PrimaryRating(name, rating)
  }

  static ratingForScaleRaw(
    name: PolitiscaleName,
    formDataOrScaleArray?: number | IHasPolitiscales | IPolitiscale[] | null
  ) {
    if (isNullOrUndefined(formDataOrScaleArray)) {
      return 0
    }

    if (typeof formDataOrScaleArray === 'number') {
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

  static ratingFreeSpeech(
    scaleval: number | IHasPolitiscales | IPolitiscale[]
  ) {
    return PolitiscaleHelper.ratingForScale(CONST_ScaleNameFreeSpeech, scaleval)
  }

  static ratingReligion(scaleval: number | IHasPolitiscales | IPolitiscale[]) {
    return PolitiscaleHelper.ratingForScale(CONST_ScaleNameReligion, scaleval)
  }

  // Static  IsPoliticallyLeft(scales?: IHasPolitiscales | IPolitiscale[]) {
  //   Return formHelper.ratingOverall(scales).isLeft
  // }
}

export type PolitiscalesEditorProps = {
  componentSuffix: string
  politiscales: IPolitiscale[]
  showMarks?: boolean
  onChangeCommittedHandler?: ValueChangeHandler<IPolitiscale[]>
  onChangeHandler?: ValueChangeHandler<IPolitiscale[]>
}

export type PolitiscaleCardProps = {
  description?: string
  name: string
  scales?: IPolitiscale[]
  slug: string
  titleHref?: string
  titleImageSrc?: string
  visitText?: string
}

export function MapSlugWithScalesToIdNameValue(
  slugsWithScales: IdNameSlugWithScales[]
) {
  return safeArray(slugsWithScales).map((x) => {
    const inv: IdNameValue = {
      id: x.slug,
      name: x.name,
      value: PolitiscaleHelper.UserColorFromScales(safeArray(x.scales)),
    }

    return inv
  })
}

export function MapTickerSearchToIdNameValue(tickers: ITickerSearch[]) {
  return safeArray(tickers).map((x) => {
    const inv: IdNameValue = {
      id: x.ticker,
      name: x.name,
      value: PolitiscaleHelper.UserColorFromScales(safeArray(x.scales)),
    }

    return inv
  })
}

export function MapSymbolDetailToPolitiscaleCardProps(
  symbolDetail: ISymbolDetail
): PolitiscaleCardProps {
  const inv: PolitiscaleCardProps = {
    description: safestr(symbolDetail.profile?.description),
    name: symbolDetail.name,
    scales: safeArray(symbolDetail.scales),
    slug: symbolDetail.ticker,
    titleHref: `/company/${safestrLowercase(symbolDetail.ticker)}`,
    titleImageSrc: safestr(symbolDetail.profile?.image),
    visitText: 'Open company website in new window',
  }

  return inv
}

export function MapCityToPolitiscaleCardProps(
  symbolDetail: ICity
): PolitiscaleCardProps {
  const inv: PolitiscaleCardProps = {
    description: safestr(symbolDetail.description),
    name: symbolDetail.name,
    scales: safeArray(symbolDetail.scales),
    slug: symbolDetail.slug,
    titleHref: `/city/${safestrLowercase(symbolDetail.slug)}`,
    titleImageSrc: symbolDetail.city_img,
    visitText: 'Link to more details',
  }

  return inv
}
