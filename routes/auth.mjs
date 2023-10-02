/* eslint-disable no-unused-vars */
import * as express from 'express'
import jwt from 'jsonwebtoken'
import * as uuid from 'uuid'
import NodeRSA from 'node-rsa'

const authRouter = express.Router()

function isKeyExpired(key) {
    const now = Math.floor(Date.now() / 1000)
    return key.expiresAt <= now
}

// Define a function to generate RSA key pairs
function generateRSAKeyPair() {
    const key = new NodeRSA({ b: 2048 }) // You can adjust the key size
    const privateKey = key.exportKey('private')
    const publicKey = key.exportKey('public')

    // Generate a unique key ID (kid) for the key pair
    const kid = uuid.v4()

    // Set the key's expiry timestamp (e.g., 1 day from now)
    const expiresAt = Math.floor(Date.now() / 1000) + 24 * 60 * 60 // 1 day expiration

    return {
        kid,
        privateKey,
        publicKey,
        expiresAt,
    }
}
/* GET Route. */
authRouter.post('/', (req, res) => {
 
    let token = ''
    const keyPairs = req.app.get('keypairs')
    const { expired,kid } = req.query

    if (expired) {
      console.log(req.body)
      console.log(kid)
        // Issue a JWT signed with an expired key pair
        // const foundElement = keyPairs.find((element) => element.kid === targetKid);

        const expiredKey = keyPairs.find((key) => isKeyExpired(key))
      
        token = jwt.sign({}, expiredKey.privateKey, {
            algorithm: 'RS256',
            expiresIn: '0',
            keyid: expiredKey.kid,
        })
        // token = 'JWT is Expired'
    } else {
        // Issue a JWT signed with a valid key pair
        const key = generateRSAKeyPair()

        token = jwt.sign({}, key.privateKey, {
            algorithm: 'RS256',
            expiresIn: '1h',
            keyid: key.kid,
        })
        // console.log(token)
        console.log(key.kid)
        res.setHeader('kid', key.kid)
        keyPairs.push({ kid: key.kid, token, key })
        req.app.set('keypairs',keyPairs)
    }
    return res.send(token)
})

authRouter.get('/', (req, res) => res.status(405).send())
authRouter.put('/', (req, res) => res.status(405).send())
authRouter.delete('/', (req, res) => res.status(405).send())
authRouter.patch('/', (req, res) => res.status(405).send())
authRouter.head('/', (req, res) => res.status(405).send())

export default authRouter
