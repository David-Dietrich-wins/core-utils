export const mockPlayerCardsRequest =
  '<CRMAcresMessage xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="C:\\XSD\\CRM.xsd"><Header><TimeStamp>2023-11-20T10:05:26.113</TimeStamp><Operation Data="PlayerCard" Operand="Request"/></Header><PlayerID>12345678</PlayerID></CRMAcresMessage>'
export const mockPlayerFindByCardIdRequest =
  '<CRMAcresMessage xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><Header><MessageID>1</MessageID><TimeStamp>2022-01-09T21:18:51</TimeStamp><Operation Data="PlayerFind" Operand="Request"/></Header><Body><PlayerFind><Filter><SearchCardID><CardID>80973265366444022351</CardID></SearchCardID></Filter></PlayerFind></Body></CRMAcresMessage>'

export const mockSearchCardIdRequest =
  '<CRMAcresMessage xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><Header><MessageID>1</MessageID><TimeStamp>2022-01-09T21:18:51</TimeStamp><Operation Data="PlayerFind" Operand="Request"/></Header><Body><PlayerFind><Filter><SearchCardID><CardID>657503634</CardID></SearchCardID></Filter></PlayerFind></Body></CRMAcresMessage>'
export const mockSearchCardIdResponse =
  '<CRMAcresMessage xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://localhost/CRMAcres.xsd"><Header><OriginalMessageID>1</OriginalMessageID><TimeStamp>2023-11-20T11:58:57.853</TimeStamp><Operation Data="PlayerFind" Operand="Information"/></Header><Site><SiteID>15</SiteID></Site><Body><PlayerFind><PlayersFound><PlayerFound><PlayerID>34076</PlayerID><FirstName>OSCAR</FirstName><LastName>THOMAS</LastName><Ranking>19</Ranking><Gender>M</Gender><DiscreetPlayer>N</DiscreetPlayer></PlayerFound></PlayersFound></PlayerFind></Body></CRMAcresMessage>'

export const mockSearchCardIdErrorResponse =
  '<CRMAcresMessage xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://localhost/CRMAcres.xsd"><Header><OriginalMessageID>1700585985</OriginalMessageID><TimeStamp>2023-11-21T08:59:45.300</TimeStamp><Operation Data="Error" Operand="Error"/></Header><Body><Error><ErrorCode>NORECORDS</ErrorCode><ErrorDescription>There are no Active Players that match the filter given.</ErrorDescription></Error></Body></CRMAcresMessage>'

export interface PlayerCardResponse {
  playerId: string
  firstName: string
  lastName: string
  cardNumber: string
  status: string
}

export const mockPlayerCardsFromSql: PlayerCardResponse[] = [
  {
    playerId: '150001170',
    firstName: 'ONE',
    lastName: 'QA4TEST',
    cardNumber: '80973265453569573513',
    status: 'Inactive',
  },
  {
    playerId: '150001171',
    firstName: 'TWO',
    lastName: 'QA4TEST',
    cardNumber: '80973265453569583911',
    status: '',
  },
  {
    playerId: '150001172',
    firstName: 'THREE',
    lastName: 'QA4TEST',
    cardNumber: '80973265453569593991',
    status: 'Inactive',
  },
  {
    playerId: '150001173',
    firstName: 'FOUR',
    lastName: 'QA4TEST',
    cardNumber: '80973265453569603183',
    status: '',
  },
  {
    playerId: '150001174',
    firstName: 'FIVE',
    lastName: 'QA4TEST',
    cardNumber: '80973265453569613103',
    status: '',
  },
  {
    playerId: '150001175',
    firstName: 'SIX',
    lastName: 'QA4TEST',
    cardNumber: '89073265453569623024',
    status: 'Inactive',
  },
  {
    playerId: '150001176',
    firstName: 'SEVEN',
    lastName: 'QA4TEST',
    cardNumber: '80973265453569632961',
    status: '',
  },
  {
    playerId: '150001177',
    firstName: 'EIGHT',
    lastName: 'QA4TEST',
    cardNumber: '80973265453569642932',
    status: '',
  },
  {
    playerId: '150001178',
    firstName: 'NINE',
    lastName: 'QA4TEST',
    cardNumber: '80973265453569652852',
    status: 'Inactive',
  },
  {
    playerId: '150001179',
    firstName: 'TEN',
    lastName: 'QA4TEST',
    cardNumber: '80973265453569662806',
    status: '',
  },
]
