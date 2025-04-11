interface User {
  id: number | bigint,
  username: string,
  email: string,
  dateJoined: string,
  watchlist: string[],
  portfolio: Transaction[]
}

interface Transaction {
  id: number | bigint,
  coinId: string,
  type: 'buy' | 'sell',
  quantity: number,
  pricePerCoin: number,
  date: string,
}