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
  coins: string[]
}

interface Portfolio {
  id: number | bigint,
  transactions: Transaction[]
}

interface Transaction {
  id: number | bigint,
  coin_id: string,
  type: 'buy' | 'sell',
  quantity: number,
  pricePerCoin: number,
  date: string,
}