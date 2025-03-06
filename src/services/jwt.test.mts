import { JwtHeader, JwtPayload, Secret, SignOptions } from 'jsonwebtoken'
import {
  IJwtExtended,
  JwtDecode,
  JwtRetrieveUserId,
  JwtSign,
  JwtVerify,
} from './jwt.mjs'
import { safestr } from './general.mjs'
import { TEST_Parameters_DEV } from '../jest.setup.mjs'

describe('JwtDecode', () => {
  test('good', () => {
    const jwtdata = JwtDecode(TEST_Parameters_DEV.jwt)

    expect(jwtdata.userId).toBe(TEST_Parameters_DEV.userIdGood)
  })

  test('bad', () => {
    try {
      JwtDecode('bad')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      expect(e).toBeInstanceOf(Error)
      expect(e.message).toBe(
        'Invalid security token when attempting to decode the JWT.'
      )
      expect(e.stack).toMatch(
        /^Error: Invalid security token when attempting to decode the JWT./
      )
    }

    expect.assertions(3)
  })
})

test('JwtRetrieveUserId', () => {
  const jwtdata = JwtRetrieveUserId(TEST_Parameters_DEV.jwt)

  expect(jwtdata).toBe(TEST_Parameters_DEV.userIdGood)
})

test('JwtDecode', () => {
  const jwtdata: string | JwtPayload | null = JwtDecode(TEST_Parameters_DEV.jwt)

  expect(jwtdata.userId).toBe(TEST_Parameters_DEV.userIdGood)
})

test('JwtSign', () => {
  const header: JwtHeader = {
    alg: 'HS256',
    typ: 'JWT',
  }

  const signOptions: SignOptions = {
    header,
  }

  const payload = {
    userId: TEST_Parameters_DEV.userIdGood,
  }

  const jwtToken = JwtSign(
    payload,
    safestr(TEST_Parameters_DEV.rsaPassPhrase),
    signOptions
  )
  expect(jwtToken.length).toBeGreaterThan(10)

  const jwtdata = JwtDecode(jwtToken)

  expect(jwtdata.userId).toBe(TEST_Parameters_DEV.userIdGood)
})

test('JwtVerify bad', () => {
  const secretOrPublicKey: Secret = 'anything'

  expect(() => JwtVerify(TEST_Parameters_DEV.jwt, secretOrPublicKey)).toThrow()
})

test('JwtVerify good', () => {
  const header: JwtHeader = {
    alg: 'HS256',
    typ: 'JWT',
  }

  const signOptions: SignOptions = {
    header,
  }

  const payload = {
    userId: TEST_Parameters_DEV.userIdGood,
  }

  const jwtToken = JwtSign(
    payload,
    safestr(TEST_Parameters_DEV.rsaPassPhrase),
    signOptions
  )
  expect(jwtToken.length).toBeGreaterThan(10)

  const jwtdata = JwtDecode(jwtToken)

  expect(jwtdata.userId).toBe(TEST_Parameters_DEV.userIdGood)

  const secretOrPublicKey: Secret = safestr(TEST_Parameters_DEV.rsaPassPhrase)

  const verified = JwtVerify(jwtToken, secretOrPublicKey)
  expect((verified as IJwtExtended).userId).toBe(TEST_Parameters_DEV.userIdGood)
})
