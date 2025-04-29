interface DialogData {
  title: string,
  message: string,
  actionButton: string
}

interface ChartDataPoint {
  time: UTCTimestamp,
  value: number
};

interface CategoryData {
  header: string,
  marketCap: number,
  marketCapchange: number,
  volume: number,
  indicatorClass: string
};

const coinSortKeys = {
  market_cap_rank: '',
  name: '',
  current_price: '',
  price_change_percentage_24h: '',
  market_cap: '',
  total_volume: '',
  circulating_supply: '',
  '': ''
} as const;

type CoinSortKey = keyof typeof coinSortKeys;

const assetSortKeys = {
  name: '',
  current_price: '',
  price_change_percentage_24h: '',
  current_value: '',
  avrg_buy_price: '',
  profit_loss: '',
  '': ''
} as const;

type AssetSortKey = keyof typeof assetSortKeys;


const transactionSortKeys = {
  date: '',
  coin_price_usd: '',
  quantity: '',
  '': ''
} as const;

type TransactionSortKey = keyof typeof transactionSortKeys;