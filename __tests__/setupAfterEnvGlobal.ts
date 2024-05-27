import { jest } from '@jest/globals'
import { HttpHandler, HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { JwtHeader, SignOptions } from 'jsonwebtoken'
import CryptoHelper from '../src/services/CryptoHelper.js'
import { ApiProps } from '../src/models/types.js'
import { HTTP_Ok } from '../src/models/MgmExceptionTypes.js'
import { MgmLogger } from '../src/services/MgmLogger.js'
import { JwtSign } from '../src/services/jwt.js'

// Set to 60 seconds. We are going over Global VPN.
jest.setTimeout(600000)

const mgmHandlers: HttpHandler[] = [
  http.get('/api/ace/keepAlive', () => {
    return new HttpResponse(null, { status: HTTP_Ok })
  }),
]

export const mockServer = setupServer(...mgmHandlers)

beforeAll(() => {
  // process.env.NODE_ENV = 'test'
  // process.env.APPLICATIONINSIGHTS_CONNECTION_STRING =
  //   'InstrumentationKey=771cff7b-216b-4919-9aee-686918a3c877;IngestionEndpoint=https://westus-0.in.applicationinsights.azure.com/;LiveEndpoint=https://westus.livediagnostics.monitor.azure.com/'
  const header: JwtHeader = {
    alg: 'HS256',
    typ: 'JWT',
  }

  const signOptions: SignOptions = {
    header,
  }

  const payload = {
    'com.mgm.mlife_number': getTestParameters().UserToTestPlayerIdGood,
    mlife: getTestParameters().UserToTestPlayerIdGood,
  }

  const jwtToken = JwtSign(payload, '1234567890', signOptions)
  console.log('JWT:', jwtToken)

  getTestParameters().jwt = jwtToken

  mockServer.listen()
})
afterEach(() => {
  mockServer.resetHandlers()
})
afterAll(() => {
  mockServer.close()
})

const aceConfigQa4 = {
  MgmDebugLevel: 1,
  UseMgmJwtForPlayerId: false,
  logger: {
    logFileName: 'ACE Pin Reset',
    logLevelDefault: 'all',
  },
  KeyVaultUrl: 'https://ace-pin-reset-uw-d.azurewebsites.net',

  ace: {
    apiBaseUrl: 'https://gameng.lb.devtest.vegas/v2.3/bearer/PlayerTracking.svc',
    CrmAcresPinCheck: true,
    CrmAcresBaseUrl: 'https://pinresetacedev.mgmresorts.com',
    adminLogin: {
      // This account is the admin for making changes to player PINs.
      UserName: 'devpinreseteng',
      Password: 'Welcome6',
      Domain: 'MGMMIRAGE.ORG',
      TimeToLive: 600,
    },
    keepAlive: {
      startPingAfterSeconds: 2,
      pingIntervalInSeconds: 0, // 19,
    },

    pinResetSettings: {
      birthdayYear: {
        check: false,
        errorMessage: 'We disallow using your birthday as a PIN for security reasons.',
      },
      previousPin: {
        check: true,
        errorMessage: 'You may not reuse a previous PIN. Please try again with a new PIN.',
      },
      beginWithZero: {
        check: false,
        errorMessage: 'Your PIN may not start with 0 for security reasons.',
      },
      consecutiveNumbers: {
        check: false,
        errorMessage: 'Consecutive numbers are not allowed for security reasons.',
      },
      easilyGuessable: {
        check: false,
        errorMessage: 'Your PIN cannot be easily guessable.',
      },
      maxRepeatedCharacters: {
        max: 0, // Anything less than 1 is Infinite
        errorMessage:
          'Each number in your PIN must be unique. No two of the same number are permitted in your PIN for security reasons.',
      },
      numbersOnly: {
        check: true,
        errorMessage: 'Your PIN must be numbers only.',
      },
      maxNumberOfCharacters: 4,
      minNumberOfCharacters: 4,
    },
  },

  crypto: {
    aes256key: '6fa979f20126cb08aa645a8f495f6d85',
    aes256iv: 'I8zyA4lVhMCaJ5Kg',
    PinEncryptionKey: 'We need an encryption key',
    rsaPrivateKey:
      '-----BEGIN RSA PRIVATE KEY-----\n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\n-----END RSA PRIVATE KEY-----',
    rsaPublicKey:
      '-----BEGIN RSA PUBLIC KEY-----\nMIICCgKCAgEA4MysBA8jNsSNj82sVCB+CfYrcl81/jIxU7hQba4rxkL+ry0G4NmltxVCtNzCGjJVhppIM63PXccbg7UNim/1sVUV2YQEg8DHdQnsUK0eE58hqNn/34r5QWjEaXf8oRzhLadxt1yD7oc8efWPGlCn1ulJlPSEYOoR31Mx5zuAfZ5/3BPOyHv36HZN1cqHpz/f6CLovBb6/Y47rimfbV7MgTBQKT+R/SFIY0FjyjBtubqBMJ2eVXxr9npoXJfQYjtTlp26NHNGnpqWFmiIiIeVeZZLramEHrGE1qHCUZfAClTtVYJwvd6E44Z6JvTMl4pNU/EzcjUGNe6tLvGvu2gC+BujRz6cMZhJF1rrHDH6qGCunXdNV7tNsnQWeIgR1mlkQ0Ni8Sjd7Iwqsv6wtD7CybtAe07JIClQsBSlELRj6cBELpkGjWCrYyJjNwgcT1/rTpeJAzAmha6Ksc75bjOpkzuBm+09DgzXNd/1GSlZrkjgs5yO4xBWUBC03EAJSlUgSXPe6NLDJQuzjUJuULBFox/9BycgJvHNDpUEiIUINJW8HQ5mv0+FNK/g+RKDh1S0/EI7FwbfKYi9pZfJNREOQihsAO0PFhYJLqJkM6YCRbCNvSPmS8KcaYQj4Jbb1qZc0A6HZ3HENGSHEcDU0e2RdbvOU89sVHsmWuJElR2cg7sCAwEAAQ==\n-----END RSA PUBLIC KEY-----',
    rsaPassphrase: undefined,
  },

  // API support
  expressServer: {
    apiServerListeningPort: 443,
    apiServerListeningPortIsHttps: true,
    sslCertificateCaPath: [],
    // sslCertificateCaPath: ['MGM Secondary Root Cert.cer', 'MGM Root.cer'],
    sslPrivateCertificateKey: 'server.key',
    sslPublicCertificateFile: 'server.cert',
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    },
    enableJson: true,
    staticPaths: [[undefined, 'public']],
  },
}

export function getAceConfig() {
  return aceConfigQa4
}

const TEST_Parameters_DEV = {
  jwt: '',
  siteId: 1,

  playerId_DavidDietrich: 101375028,
  playerId_JakRatiwanich: 101380519,

  playerIdSetAndNotLocked: 101380519, // 102204086,
  playerIdNotSetAndLocked: 100131916,

  UserToTestPlayerIdGood: 101375028, // PlayerId_DavidDietrich,
  UserToTestPlayerIdBad: 102204086, // 100131916

  // playerCardId: 101380519,
  // playerCardNumberGood: '657503634',
  playerCardNumberGood: '80973265453569573513',
  playerCardNumberProdTwoAddresses: '80973265482692483891',
  playerCardNumberBad: '80973265367246392147',
}

export function getTestParameters() {
  return TEST_Parameters_DEV
}

export function GenerateRandomPinEncrypted() {
  return CryptoHelper.rsaEncryptStatic(
    CryptoHelper.GenerateRandomPin(4),
    getAceConfig().crypto.rsaPublicKey
  )
}

export function getAceApiParams() {
  const apiParams: ApiProps = {
    baseUrl: getAceConfig().ace.apiBaseUrl,
  }

  return apiParams
}

export function getNewMgmLogger() {
  const logger = new MgmLogger('ACE REST Test', getAceConfig().logger.logFileName, 'info')

  return logger
}
