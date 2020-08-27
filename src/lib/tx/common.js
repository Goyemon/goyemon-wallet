export const hexToBuf = (hex) =>
  typeof hex === 'string'
    ? Buffer.from(hex.startsWith('0x') ? hex.substr(2) : hex, 'hex')
    : null;

export const dropHexPrefix = (hex) =>
  typeof hex === 'string' ? (hex.startsWith('0x') ? hex.substr(2) : hex) : hex;

export const maxNonceKey = '_tx[maxnonce]';
export const txNoncePrefix = 'nonce_';
export const txFailPrefix = 'fail_';
export const txStatePrefix = 'state_';
export const lastCheckpointKey = '_txsync[checkpoint]';
export const storage_bucket_size = Math.floor(4096 / (64 + 1));
