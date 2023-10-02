import { expect,supertest } from "chai";
import { describe, it } from "mocha";
import app from '../app.mjs'


const request = supertest(app);

describe('Authentication Router', () => {
    it('should issue a valid JWT with a valid key pair', async () => {
        const response = await request.post('/auth').query({});
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('token');
    });

    it('should issue an expired JWT with an expired key pair', async () => {
        const response = await request.post('/auth').query({ expired: true });
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('token');
        // You can add more assertions to check if the JWT is expired here
    });

    it('should return a 405 status code for unsupported HTTP methods', async () => {
        const unsupportedMethods = ['get', 'put', 'delete', 'patch', 'head'];

        // eslint-disable-next-line no-restricted-syntax
        for (const method of unsupportedMethods) {
            // eslint-disable-next-line no-await-in-loop
            const response = await request[method]('/auth').query({});
            expect(response.status).to.equal(405);
        }
    });
});
