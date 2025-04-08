interface CoinBasic {
  id: string,
  symbol: string,
  name: string,
  image: string,
  current_price: number,
  market_cap: number,
  market_cap_rank: number,
  fully_diluted_valuation: number,
  total_volume: number,
  high_24h: number,
  low_24h: number,
  price_change_24h: number,
  price_change_percentage_24h: number,
  market_cap_change_24h: number,
  market_cap_change_percentage_24h: number,
  circulating_supply: number,
  total_supply: number,
  max_supply: number | null,
  ath: number,
  ath_change_percentage: number,
  ath_date: string,
  atl: number,
  atl_change_percentage: number,
  atl_date: string,
  roi: any,
  last_updated: string,
  sparkline_in_7d: { price: number[] },
};

interface CoinDetails {
  id: string,
  symbol: string,
  name: string,
  web_slug: string,
  asset_platform_id: null,
  platforms: { [key: string]: string },
  detail_platforms: {
    [key: string]: {
      decimal_place: null,
      contract_address: string
    }
  },
  block_time_in_minutes: number,
  hashing_algorithm: string,
  categories: string[],
  preview_listing: boolean,
  public_notice: null,
  additional_notices: any[],
  contract_address?: string,
  description: { en: string },
  links: {
    homepage: string[],
    whitepaper: string,
    blockchain_site: string[],
    official_forum_url: string[],
    chat_url: string[],
    announcement_url: string[],
    twitter_screen_name: string,
    facebook_username: string,
    bitcointalk_thread_identifier: null,
    telegram_channel_identifier: string,
    subreddit_url: string,
    repos_url: {
      github: string[],
      bitbucket: any[]
    }
  },
  image: {
    thumb: string,
    small: string,
    large: string
  },
  country_origin: string,
  genesis_date: string,
  sentiment_votes_up_percentage: number,
  sentiment_votes_down_percentage: number,
  watchlist_portfolio_users: number,
  market_cap_rank: number,
  market_data: {
    current_price: { [key: string]: number },
    total_value_locked: number | null,
    mcap_to_tvl_ratio: number | null,
    fdv_to_tvl_ratio: number | null,
    roi: number | null,
    ath: { [key: string]: number },
    ath_change_percentage: { [key: string]: number },
    ath_date: { [key: string]: string },
    atl: { [key: string]: number },
    atl_change_percentage: { [key: string]: number },
    atl_date: { [key: string]: string },
    market_cap: { [key: string]: number },
    market_cap_rank: number,
    fully_diluted_valuation: { [key: string]: number },
    market_cap_fdv_ratio: number,
    total_volume: { [key: string]: number },
    high_24h: { [key: string]: number },
    low_24h: { [key: string]: number },
    price_change_24h: number,
    price_change_percentage_24h: number,
    price_change_percentage_7d: number,
    price_change_percentage_14d: number,
    price_change_percentage_30d: number,
    price_change_percentage_60d: number,
    price_change_percentage_200d: number,
    price_change_percentage_1y: number,
    market_cap_change_24h: number,
    market_cap_change_percentage_24h: number,
    price_change_24h_in_currency: { [key: string]: number },
    price_change_percentage_1h_in_currency: { [key: string]: number },
    price_change_percentage_24h_in_currency: { [key: string]: number },
    price_change_percentage_7d_in_currency: { [key: string]: number },
    price_change_percentage_14d_in_currency: { [key: string]: number },
    price_change_percentage_30d_in_currency: { [key: string]: number },
    price_change_percentage_60d_in_currency: { [key: string]: number },
    price_change_percentage_200d_in_currency: { [key: string]: number },
    price_change_percentage_1y_in_currency: { [key: string]: number },
    market_cap_change_24h_in_currency: { [key: string]: number },
    market_cap_change_percentage_24h_in_currency: { [key: string]: number },
    total_supply: number,
    max_supply: number,
    circulating_supply: number,
    last_updated: string
  },
  status_updates: any[],
  last_updated: string
}

const sortKeys = {
  market_cap_rank: '',
  name: '',
  current_price: '',
  price_change_percentage_24h: '',
  market_cap: '',
  total_volume: '',
  circulating_supply: ''
} as const;

type SortKey = keyof typeof sortKeys;

interface CoinCategory {
  id: string,
  name: string,
  market_cap: number | null,
  market_cap_change_24h: number | null,
  content: string | null,
  top_3_coins_id: string[],
  top_3_coins: string[],
  volume_24h: number | null,
  updated_at: string | null
};

interface CategoryData {
  header: string,
  marketCap: number,
  marketCapchange: number,
  volume: number,
  indicatorClass: string
};

interface CoinCharts {
  prices: number[][],
  market_caps: number[][],
  total_volumes: number[][]
};

interface ChartDataPoint {
  time: UTCTimestamp,
  value: number
};

interface SearchResults {
  coins: CoinSearch[],
  exchanges: ExchangeSearch[],
  categories: CategorySearch[],
  nfts: NFTSearch[],
  icos: string[]
}

interface CoinSearch {
  id: string,
  name: string,
  api_symbol: string,
  symbol: string,
  market_cap_rank: number,
  thumb: string,
  large: string
}

interface ExchangeSearch {
  id: string,
  name: string,
  market_interface: string,
  thumb: string,
  large: string
}

interface CategorySearch {
  id: number,
  name: string,
}

interface NFTSearch {
  id: string,
  name: string,
  symbol: string,
  thumb: string,
}

interface TrendingAssets {
  coins: CoinTrendingItem[],
  nfts: NFTTrending[],
  categories: CategoryTrending[]
}

interface CoinTrendingItem {
  item: CoinTrending
}

interface CoinTrending {
  id: string,
  coin_id: number,
  name: string,
  symbol: string,
  market_cap_rank: number,
  thumb: string,
  small: string,
  large: string,
  slug: string,
  price_btc: number,
  score: number,
  data: {
    price: number,
    price_btc: string,
    price_change_percentage_24h: { [key: sting]: number }
    market_cap: string,
    market_cap_btc: string,
    total_volume: string,
    total_volume_btc: string,
    sparkline: string,
    content: {
      title: string,
      description: string
    }
  }
}

interface NFTTrending {
  id: string,
  name: string,
  symbol: string,
  thumb: string,
  nft_contract_id: number,
  native_currency_symbol: string,
  floor_price_in_native_currency: number
  floor_price_24h_percentage_change: number,
  data: {
    floor_price: string,
    floor_price_in_usd_24h_percentage_change: string,
    h24_volume: string,
    h24_average_sale_price: string,
    sparkline: string,
    content: null
  }
}

interface CategoryTrending {
  id: number,
  name: string,
  market_cap_1h_change: number,
  slug: string,
  coins_count: number,
  data: {
    market_cap: number,
    market_cap_btc: number,
    total_volume: number,
    total_volume_btc: number,
    market_cap_change_percentage_24h: { [key: sting]: number },
    sparkline: string
  }
}