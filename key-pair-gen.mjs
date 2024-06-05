import crypto from 'crypto';
import elliptic from 'elliptic';

const key32 = crypto.randomBytes(32).toString("hex");

// Calculate the `secp256k1` curve and build the public key
const ec256k1 = new elliptic.ec('secp256k1');
const privkey = ec256k1.keyFromPrivate(key32, 'hex');

const pubkey = privkey.getPublic();

console.log("32bit sized Key->", key32);

console.log(`Public (hex), ${privkey.getPublic('hex')}`);

console.log(`x (hex): ${pubkey.x.toBuffer().toString('hex')}`);
console.log(`y (hex): ${pubkey.y.toBuffer().toString('hex')}`);

console.log(`x (base64): ${pubkey.x.toBuffer().toString('base64')}`);
console.log(`y (base64): ${pubkey.y.toBuffer().toString('base64')}`);

console.log(`-- kty: EC, crv: secp256k1`);

console.log("Public Key->", pubkey);