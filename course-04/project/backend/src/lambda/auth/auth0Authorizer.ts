import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth0Authorizer.ts')
const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJY3tPvt25uHc9MA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi0tbnpiMWpwbC5hdS5hdXRoMC5jb20wHhcNMjAwMjI5MTYyNzE0WhcN
MzMxMTA3MTYyNzE0WjAkMSIwIAYDVQQDExlkZXYtLW56YjFqcGwuYXUuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3a2BxD8vzLmsSCFP
jMh/sdj0rSezvwNGk1VTx7+hnc3refDWA3IVUVCtuYobbWX4xKTFp/BzS/QhTwQh
v526qqvAe3W5gP5YF5yfOz1hetoh5cMjbq1p2uyQztYOhtpKeIq3AxV8ku78V1sC
Cg64KvlBDozJ/6BNGQ6ix6tNTwFxavGn2eh1MnC4sA7agEADAsUl6h/MLOua2jNC
g40VwvOW2WFMhUqhiySVCz2DzpQCAMeuMvabtgZ9AtC8tRff9xO7xANUm4aStbCg
/6h/EY7LkZlvF/I4YOlPl/YMhfrWeDiwb3tCuGvv9FhAYYWh5nmDMRWKNtKvuHnW
Dr3cfwIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBRuTFuDsH3P
2C7tJZ/j3/fY+JjQLjAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
ALM5N4VVVEOnidf66eOqsJrVi6Rny2jFdZn2wsDhHfT0y+4mxhNmYc+GbMzWffRT
xIHMV5lFfh3ixxuQsEYzuL8idf0R2gsk+LenyHRHGGjR+Q/KsTsxmUWu1MwFoyYI
0S6ZuXgAJKqYdsq8uJMnlN9+f2cL6Xbr00jd+fkNAnHkrYJR7AyY9IsUTgnppy43
d8MuY6h+NZMYk3XeDM95Lhuw9f6yy0W62KkiE7T8FYw8EjoycClsAV0/dHzCwIWJ
wwv3EwsSXwJgcNEVmcFGHfpZyqbao9+y8jRXWQE2/ytXler/fUM6Bk3uhj82h4PQ
XWJ741YmCZBU/4Cs6KYqGmY=
-----END CERTIFICATE-----`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized: ', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized: ', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)

  return verify(token, cert, {algorithms: ['RS256']}) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}