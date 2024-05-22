import { DefaultAzureCredential } from '@azure/identity'
import { SecretClient } from '@azure/keyvault-secrets'

export default abstract class KeyVault {
  static async RetrieveSecret(keyVaultUrl: string, keyName: string) {
    const credential = new DefaultAzureCredential()
    const client = new SecretClient(keyVaultUrl, credential)

    const secret = await client.getSecret(keyName)

    return secret
  }
}
