import { MgmLogger } from './MgmLogger.mjs'

test('Simple log', () => {
  const logger = new MgmLogger('KinectifyProcessor', 'aml-kinectify')

  const winstonLogger = logger.info('1', '2', '3', '4', '5')

  expect(winstonLogger).toBeTruthy()
})
