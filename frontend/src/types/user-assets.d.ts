interface User {
  id: number | bigint,
  username: string,
  email: string,
  role: 'admin' | 'user'
  date_joined: string,
  last_login: string
}

interface Watchlist {
  id: number | bigint,
  name: string,
  is_main: boolean,
  coins: string[]
}

interface Portfolio {
  id: number | bigint,
  name: string,
  is_main: boolean
}

interface PortfolioData {
  stats: PortfolioStats,
  allocation_chart: AllocationChartDataPoint[],
  assets: Asset[],
  transactions_by_coin: Record<string, Transaction[]> // keys are coin_ids
}

interface PortfolioStats {
  total_balance: number,
  total_profit_loss: number,
  total_profit_loss_percentage: number,
  top_gainer_id: string, // references an asset(coin_id)
  worst_gainer_id: string // references an asset(coin_id)
}

interface AllocationChartDataPoint {
  name: string,
  value: number
}

interface Asset {
  coin_id: string,
  name: string,
  symbol: string,
  image: string,
  current_price: number,
  price_change_percentage_24h: number,
  avrg_buy_price: number,
  current_quantity: number,
  current_value: number,
  profit_loss: number,
  profit_loss_percentage: number
  sparkline: number[],
}

interface Transaction {
  id: number | bigint,
  portfolio_id: number | bigint,
  coin_id: string,
  type: 'buy' | 'sell',
  quantity: number,
  coin_price_usd: number,
  date: string
}