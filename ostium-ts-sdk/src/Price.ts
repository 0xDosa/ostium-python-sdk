/**
 * Helper for fetching price information from the Ostium listener service.
 */
export class Price {
  private baseUrl = 'https://listener.ostium.io';
  constructor(private verbose = false) {}

  private log(message: string): void {
    if (this.verbose) console.log(message);
  }

  async getLatestPrices(): Promise<any[]> {
    const resp = await fetch(`${this.baseUrl}/PricePublish/latest-prices`);
    if (!resp.ok) {
      throw new Error(`Failed to fetch prices: ${resp.status}`);
    }
    return resp.json();
  }

  async getLatestPriceJson(from: string, to: string): Promise<any> {
    const prices = await this.getLatestPrices();
    for (const price of prices) {
      if (price.from === from && price.to === to) {
        this.log(`getLatestPriceJson: ${JSON.stringify(price)}`);
        return price;
      }
    }
    throw new Error(`No price found for pair: ${from}/${to}`);
  }

  async getPrice(from: string, to: string): Promise<{ price: number; isMarketOpen: boolean }>
  {
    this.log(`Getting price for ${from}/${to}`);
    const prices = await this.getLatestPrices();
    for (const priceData of prices) {
      if (priceData.from === from && priceData.to === to) {
        return { price: Number(priceData.mid ?? 0), isMarketOpen: Boolean(priceData.isMarketOpen) };
      }
    }
    throw new Error(`No price found for pair: ${from}/${to}`);
  }
}
