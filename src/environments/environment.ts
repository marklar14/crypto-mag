import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000',
  frontendApiKey: 'crypto-mag-240625',
  defaultSymbols: ['BTCUSDT', 'ETHUSDT', 'XRPUSDT', 'SUIUSDT', 'XRPUSDT']
};
