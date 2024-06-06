//Creating Verifiable Credentials and Presentartions using the W3C standard

import { ES256KSigner, hexToBytes } from "did-jwt";
import { createVerifiableCredentialJwt, createVerifiablePresentationJwt } from 'did-jwt-vc';

//Using our previously made signer to sign our credentials
//According to W3C, the vc variable must be defined in the payload and so
const privkey = '1f4591997b9924ed8dadb58e006d370545153c0487cc2c6b486ba720cb167349';
const signer = ES256KSigner(hexToBytes(privkey));

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
