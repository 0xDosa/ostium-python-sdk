export function formatWithPrecision(numberInput: unknown, precision: number): number {
  if (typeof numberInput === 'function') {
    throw new TypeError('Input cannot be a function');
  }
  const num = Number(numberInput);
  if (Number.isNaN(num) || Number.isNaN(precision)) {
    throw new TypeError('Invalid input');
  }
  const formatted = num.toFixed(precision).replace(/\.0+$|(?<=\.[0-9]*?)0+$/g, '').replace(/\.$/, '');
  return Number(formatted);
}

export function calculateFeePerHours(curFundingRate: number | string, hours = 24): number {
  const period = hours * (10 / 3) * 60 * 60 * 100;
  return Number(curFundingRate) * period;
}

export function fromErrorCodeToMessage(errorCode: unknown): [string, string | null] {
  const errorMap: Record<string, string> = {
    '80a71fc5': 'AboveMaxAllowedCollateral()',
    'f77a8069': 'AlreadyMarketClosed(address,uint16,uint8)',
    'eca695e1': 'BelowMinLevPos()',
    '5be5878a': 'DelegatedActionFailed()',
    '46c4ede2': 'ExposureLimits()',
    '4f285592': 'IsContract(address)',
    '084986e7': 'IsDone()',
    '1309a563': 'IsPaused()',
    '5c12ea62': 'MaxPendingMarketOrdersReached(address)',
    'e6f47fab': 'MaxTradesPerPairReached(address,uint16)',
    '2a917859': 'NoDelegate(address)',
    'a35ee470': 'NoLimitFound(address,uint16,uint8)',
    '17e08e97': 'NoTradeFound(address,uint16,uint8)',
    'efa9e5be': 'NoTradeToTimeoutFound(uint256)',
    'c7fe4d00': 'NotCloseMarketTimeoutOrder(uint256)',
    '502b946d': 'NotDelegate(address,address)',
    '093650d5': 'NotGov(address)',
    '1add0915': 'NotOpenMarketTimeoutOrder(uint256)',
    '432b6c83': 'NotTradesUpKeep(address)',
    'df17e316': 'NotWhitelisted(address)',
    '5ac89f62': 'NotYourOrder(uint256,address)',
    'f3d0b126': 'NullAddr()',
    'cb87b762': 'PairNotListed(uint16)',
    'dd9397bb': 'TriggerPending(address,uint16,uint8)',
    '3e0b1869': 'WaitTimeout(uint256)',
    '35fe85c5': 'WrongLeverage(uint32)',
    '5863f789': 'WrongParams()',
    '083fbd78': 'WrongSL()',
    'a41bb918': 'WrongTP()'
  };

  for (const [hash, message] of Object.entries(errorMap)) {
    if (String(errorCode).includes(hash)) {
      return [message, null];
    }
  }

  try {
    const errObj = typeof errorCode === 'object' ? (errorCode as any) : JSON.parse(String(errorCode));
    if (errObj && typeof errObj.message === 'string') {
      if (errObj.message.includes('insufficient funds for gas * price + value')) {
        return [errObj.message, 'Please top up your account with more ETH'];
      }
      return [errObj.message, null];
    }
  } catch {
    // ignore parse errors
  }

  if (String(errorCode).includes('execution reverted: ERC20: transfer amount exceeds balance')) {
    return ['execution reverted: ERC20: transfer amount exceeds balance', 'Please top up your account with more USDC'];
  }

  return ['Unknown error (missing in error_map?)', null];
}

export function toBaseUnits(amount: number | string, decimals = 6): bigint {
  const num = Number(amount);
  if (Number.isNaN(num)) throw new Error('Invalid amount');
  const scaled = Math.round(num * 10 ** decimals);
  return BigInt(scaled);
}

export function convertToScaledInteger(value: number | string, precision = 5, scale = 18): bigint {
  const precise = Math.round(Number(value) * 10 ** precision);
  return BigInt(precise) * BigInt(10) ** BigInt(scale - precision);
}

export function isValidDecimal(value: string, mustBePositive = true): boolean {
  const num = Number(value);
  if (Number.isNaN(num)) return false;
  if (mustBePositive && num < 0) return false;
  return true;
}

export function isNumeric(value: unknown): boolean {
  return typeof value === 'number' ? !Number.isNaN(value) : !Number.isNaN(Number(value));
}
