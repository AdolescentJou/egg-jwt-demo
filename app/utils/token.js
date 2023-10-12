const crypto = require('crypto');

const DEFAULT_EXP = 10;
const SECONDS_TO_MILLISECONDS = 1000;
const HASH_ALGORITHM = 'sha256';
const BASE64 = 'base64';
const UTF8 = 'utf8';

function getUnixTimestampSeconds() {
  return Math.floor(Date.now() / SECONDS_TO_MILLISECONDS);
}

function createHash(data, secret) {
  const hash = crypto.createHmac(HASH_ALGORITHM, secret);
  hash.update(data);
  return hash.digest(BASE64);
}

function createToken(payload, exp = DEFAULT_EXP, secret) {
  const tokenOptions = {
    data: payload,
    created: getUnixTimestampSeconds(),
    exp: exp || DEFAULT_EXP,
  };

  const payloadString = Buffer.from(JSON.stringify(tokenOptions), UTF8).toString(BASE64);
  const signature = createHash(payloadString, secret);

  return `${payloadString}.${signature}`;
}

function decodeToken(token, secret) {
  const [ payloadString, signature ] = token.split('.');

  if (!payloadString || !signature) {
    return false;
  }

  let payload;

  try {
    payload = JSON.parse(Buffer.from(payloadString, BASE64).toString(UTF8));
  } catch (e) {
    return false;
  }

  const checkSignature = createHash(payloadString, secret);

  return {
    payload,
    signature,
    checkSignature,
  };
}

function isValidToken(token, secret) {
  const tokenInfo = decodeToken(token, secret);

  if (!tokenInfo) return false;

  const isExpired = getUnixTimestampSeconds() - tokenInfo.payload.created > tokenInfo.payload.exp;

  return tokenInfo.signature === tokenInfo.checkSignature && !isExpired;
}

exports.decodeToken = decodeToken;
exports.createToken = createToken;
exports.isValidToken = isValidToken;
