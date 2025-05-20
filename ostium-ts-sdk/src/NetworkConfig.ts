export interface Contracts {
  usdc: string;
  trading: string;
  tradingStorage: string;
}

/**
 * Runtime configuration for the Ostium network.
 */
export class NetworkConfig {
  graphUrl: string;
  contracts: Contracts;
  isTestnet: boolean;
  network: string;

  constructor(graphUrl: string, contracts: Contracts, isTestnet: boolean) {
    this.graphUrl = graphUrl;
    this.contracts = contracts;
    this.isTestnet = isTestnet;
    this.network = isTestnet ? 'testnet' : 'mainnet';
  }

  static mainnet(): NetworkConfig {
    return new NetworkConfig(
      'https://subgraph.satsuma-prod.com/391a61815d32/ostium/ost-prod/api',
      {
        usdc: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
        trading: '0x6D0bA1f9996DBD8885827e1b2e8f6593e7702411',
        tradingStorage: '0xcCd5891083A8acD2074690F65d3024E7D13d66E7'
      },
      false
    );
  }

  static testnet(): NetworkConfig {
    return new NetworkConfig(
      'https://subgraph.satsuma-prod.com/391a61815d32/ostium/ost-sep-final/api',
      {
        usdc: '0xe73B11Fb1e3eeEe8AF2a23079A4410Fe1B370548',
        trading: '0x2A9B9c988393f46a2537B0ff11E98c2C15a95afe',
        tradingStorage: '0x0b9F5243B29938668c9Cfbd7557A389EC7Ef88b8'
      },
      true
    );
  }
}
