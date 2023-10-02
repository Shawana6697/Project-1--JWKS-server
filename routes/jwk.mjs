import * as express from 'express'

const jwksRouter = express.Router()

function isKeyExpired(key) {
    const now = Math.floor(Date.now() / 1000)
    return key.expiresAt <= now
}

// RESTful JWKS endpoint
jwksRouter.get('/jwks.json', (req, res) => {
    const keyPairs = req.app.get('keypairs')
    // Filter out keys that are not expired
    const validKeys = keyPairs.filter((key) => !isKeyExpired(key))

    const jwks = {
        keys: validKeys.map((key) => ({
            kty: 'RSA',
            kid: key.kid,
            use: 'sig',
            n: key.key.publicKey,
            e: 'AQAB'
        })),
    }
    res.json(jwks)
})

jwksRouter.post('/jwks.json', (req, res) => res.status(405).send())
jwksRouter.put('/jwks.json', (req, res) => res.status(405).send())
jwksRouter.delete('/jwks.json', (req, res) => res.status(405).send())
jwksRouter.patch('/jwks.json', (req, res) => res.status(405).send())
jwksRouter.head('/jwks.json', (req, res) => res.status(405).send())

export default jwksRouter
