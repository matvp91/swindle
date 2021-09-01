import * as jwt from 'jsonwebtoken';

export function createToken(iss: string) {
  return jwt.sign(
    {
      iss,
    },
    process.env.PRIVATE_KEY
  );
}

export function unpackToken(token: string) {
  const data = jwt.verify(token, process.env.PRIVATE_KEY);
  if (!(data instanceof Object)) {
    throw new Error('Invalid token format');
  }

  return data;
}
