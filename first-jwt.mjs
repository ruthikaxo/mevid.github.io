import { ES256KSigner, hexToBytes, createJWT, decodeJWT, verifyJWT } from 'did-jwt';
import { Resolver } from 'did-resolver';
import { getResolver } from 'web-did-resolver';


//using a private 32-bit key to create a signer
const key32 = '1f4591997b9924ed8dadb58e006d370545153c0487cc2c6b486ba720cb167349';
const signer = ES256KSigner(hexToBytes(key32));

//Creating the JSON Web Token
const jsonwt = await createJWT(
    {aud: 'did:web:ruthikaxo.github.io', name: 'ruthikaxo'},
    {issuer: 'did:web:ruthikaxo.github.io', signer},
    {alg: 'ES256K'}
);

//Displaying the JWT in a user friendly version
const jwt_uf = decodeJWT(jsonwt);

console.log('The Raw JWT is ->\n', jsonwt);
console.log('The JWT is ->\n', jwt_uf);

const web_res = getResolver();
const resolver = new Resolver({
    ...web_res
});


//Verifying the JWT
verifyJWT(jsonwt, {
    resolver,
    audience: 'did:web:ruthikaxo.github.io'
 }).then(({payload, doc, did, signer, jsonwt}) => {
        console.log('The JWT is valid ->\n', payload)
}).catch(error => {
    console.error('JWT could not be verified ->\n', error);
});

