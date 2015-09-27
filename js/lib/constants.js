module.exports = {
    coinbaseWsFeed: 'wss://ws-feed.exchange.coinbase.com'
  , BTC_USDSub: '{"type": "subscribe","product_id": "BTC-USD"}'
  , empty: {
      type:  ''
    , price: ''
    , side:  ''
    , size:  ''
    , time:  ''
    , index: 0
  }
  , sell: {
       side:  'sell'
    }
  , buy: {
       side:  'buy'
    }
  , open: {
    type: 'open'
  }
  , match: {
    type: 'match'
  }
}