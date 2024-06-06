import { ES256KSigner,createJWT, decodeJWT, verifyJWT, hexToBytes } from 'did-jwt'
import { Resolver } from 'did-resolver';
import { getResolver } from 'web-did-resolver';
import { createVerifiableCredentialJwt, createVerifiablePresentationJwt } from 'did-jwt-vc';


//This document creates, verifies and validates the JWT

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

//This is an example of an Academic Credential payload
const verc_pd = {
    sub: 'did:web:ruthikaxo.github.io',   //referring to the subject/the identifier(DID) for the entity that claims the credential
    nbf: 1717646065, //the tiemstamp showing when teh credential became valid
    vc: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', 'AcademicCredential'],
        credentialSubject: {
            id: 'did:web:ruthikaxo.github.io',
            firstname: 'Ruth',
            lastname: 'Ogadina',
            degrees: [
                {
                    type: 'BachelorDegree',
                    name: 'Bachelor of Science in Computer Science',
                    institution: 'University of Cash, Donlination',
                    dateawarded: '2022-05-12'
                },
                {
                    type: 'MasterDegree',
                    name: 'Master of Science in Artificial Intelligence',
                    institution: 'University of Serotonin, Tashista',
                    dateawarded: '2024-05-15'
                }
            ]
        }

    }
};

//This is an Example of an Employment Credential payload
const empverc_pd = {
    sub: 'did:web:ruthikaxo.github.io', 
    nbf: 1717646065, 
    vc: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', 'EmploymentCredential'],
        credentialSubject: {
            id: 'did:web:ruthikaxo.github.io',
            firstname: 'Ruth',
            lastname: 'Ogadina',
            employer: 'Google',
            jobtitle: 'Software Engineer',
            startDate: '2022-01-01',
            endDate: '2027-01-01'  //implying a contract worker
        }
    }
};

//Creating an Issuer Object, which contains our DID and previous signer
const issuer = {
    did: 'did:web:ruthikaxo.github.io',
    signer: signer
};

//The Verifiable Credential is a digital credential which is issued by an issuer that can be cryptographically verified containing claims about a subject.

//Creating the Academic Credential 
const avcJwt = await createVerifiableCredentialJwt(verc_pd, issuer);
console.log('The Academic Credential -> \n', avcJwt);

//Creating the Employment Credential
const evcJwt = await createVerifiableCredentialJwt(empverc_pd, issuer);
console.log('The employment Credential -> \n', evcJwt);

//Creating the Verifiable Presentation - a collection of VCs with the proof that the holder can claim the credentials, it presents the credentials in a way that it can be verified.
const verp_pd = {
    vp:{
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiablePresentation'],
        verifiableCredential: [avcJwt, evcJwt],
        foo: "bar"
    }
};

const verp_jwt = await createVerifiablePresentationJwt(verp_pd, issuer);
console.log('The Verifiable Presentation containing the Academic and Employment Credentials -> \n', verp_jwt);
