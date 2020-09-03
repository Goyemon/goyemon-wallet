import Tx from './Tx';
const GlobalConfig = require('../../config.json');

export const hexToBuf = (hex: string | null): Buffer =>
  hex
    ? Buffer.from(hex.startsWith('0x') ? hex.substr(2) : hex, 'hex')
    : Buffer.from('');

export const dropHexPrefix = (hex: string | null): string =>
  hex ? (hex.startsWith('0x') ? hex.substr(2) : hex) : '';

export const maxNonceKey: string = '_tx[maxnonce]';
export const txNoncePrefix: string = 'nonce_';
export const txFailPrefix: string = 'fail_';
export const txStatePrefix: string = 'state_';
export const lastCheckpointKey: string = '_txsync[checkpoint]';
export const storage_bucket_size = Math.floor(4096 / (64 + 1));

export const getApplication = (to: string | null): string => {
  const UniswapV1 = '0x2a1530c4c41db0b0b2bb646cb5eb1a67b7158667';
  const UniswapV2 = '0xf164fc0ec4e93095b804a4795bbe1e041497b92a';
  if (to)
    switch (to.toLowerCase()) {
      case GlobalConfig.cDAIcontract.toLowerCase():
        return 'Compound';
      case UniswapV1:
      case UniswapV2:
      case GlobalConfig.RouterUniswapV2.toLowerCase():
        return 'Uniswap';
      case GlobalConfig.DAIPoolTogetherContractV2.toLowerCase():
        return 'PoolTogether';
      default:
        return '';
    }
  else return '';
};

export const __decodeBucket = (b: string | null): string[] =>
  b ? b.split(',') : [];

export const __encodeBucket = (ba: any[]) => ba.join(',');

export const __decodeTx = (hash: string, data: any) => {
  if (!data) return null;
  data = JSON.parse(data);
  return new Tx(data[7]).setHash(hash).fromDataArray(data, false);
};

export const bstats = (buck: any): string => {
  if (typeof buck !== 'string') return JSON.stringify(buck);

  let itemlens: number[] = [];
  let cnt = 0;
  buck.split(',').forEach((x) => {
    itemlens[x.length] = itemlens[x.length] ? itemlens[x.length] + 1 : 1;
    ++cnt;
  });

  return `cnt:${cnt} lengths:${JSON.stringify(itemlens)}`;
};
