/**
 * Minimal GraphQL client for interacting with the Ostium subgraph.
 */
export class SubgraphClient {
  constructor(private url: string, private verbose = false) {}

  private log(msg: string): void {
    if (this.verbose) console.log(msg);
  }

  private async query<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
    const resp = await fetch(this.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables })
    });
    if (!resp.ok) {
      throw new Error(`GraphQL query failed: ${resp.status}`);
    }
    const json = await resp.json();
    return json.data;
  }

  async getPairs(): Promise<any[]> {
    this.log('Fetching available pairs');
    const q = `query { pairs(first: 1000) { id from to feed } }`;
    const data = await this.query<{ pairs: any[] }>(q);
    return data.pairs;
  }

  async getPairDetails(pairId: number | string): Promise<any> {
    const q = `query getPairDetails($pair_id: ID!) { pair(id: $pair_id) {
        id from to longOI shortOI maxOI makerFeeP takerFeeP makerMaxLeverage
        curFundingLong curFundingShort curRollover totalOpenTrades
        totalOpenLimitOrders accRollover lastRolloverBlock rolloverFeePerBlock
        accFundingLong accFundingShort lastFundingBlock maxFundingFeePerBlock
        lastFundingRate hillInflectionPoint hillPosScale hillNegScale springFactor
        sFactorUpScaleP sFactorDownScaleP lastTradePrice maxLeverage
        group { id name minLeverage maxLeverage maxCollateralP longCollateral shortCollateral }
        fee { minLevPos }
      } }`;
    const data = await this.query<{ pair: any }>(q, { pair_id: String(pairId) });
    if (!data.pair) throw new Error(`No pair details found for pair ID: ${pairId}`);
    return data.pair;
  }
}
