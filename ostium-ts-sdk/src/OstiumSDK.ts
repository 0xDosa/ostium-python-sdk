import { NetworkConfig } from './NetworkConfig';
import { Price } from './Price';
import { SubgraphClient } from './SubgraphClient';

/**
 * High level SDK that composes sub modules for interacting with Ostium.
 */
export class OstiumSDK {
  readonly networkConfig: NetworkConfig;
  readonly price: Price;
  readonly subgraph: SubgraphClient;
  constructor(network: 'mainnet' | 'testnet' | NetworkConfig, readonly verbose = false) {
    if (network instanceof NetworkConfig) {
      this.networkConfig = network;
    } else {
      this.networkConfig = network === 'mainnet' ? NetworkConfig.mainnet() : NetworkConfig.testnet();
    }
    this.price = new Price(verbose);
    this.subgraph = new SubgraphClient(this.networkConfig.graphUrl, verbose);
  }

  async getFormattedPairsDetails(): Promise<any[]> {
    const pairs = await this.subgraph.getPairs();
    const formatted = [] as any[];
    for (const pair of pairs) {
      const details = await this.subgraph.getPairDetails(pair.id);
      let priceData: any = {};
      try {
        priceData = await this.price.getLatestPriceJson(details.from, details.to);
      } catch {
        priceData = { mid: 0, isMarketOpen: false };
      }
      formatted.push({
        id: Number(details.id),
        from: details.from,
        to: details.to,
        price: Number(priceData.mid ?? 0),
        isMarketOpen: Boolean(priceData.isMarketOpen),
        longOI: Number(details.longOI),
        shortOI: Number(details.shortOI),
        maxOI: Number(details.maxOI),
        makerFeeP: Number(details.makerFeeP),
        takerFeeP: Number(details.takerFeeP),
        makerMaxLeverage: Number(details.makerMaxLeverage),
        group: details.group?.name
      });
    }
    return formatted;
  }
}
