var priceEntry = require('../components/priceEntry.js')
  , React      = require('react')
  , __         = require('./constants.js')
  , Rx         = require('rx')
  , _          = require('ramda')

var utilities = {
  log (x) {
    console.log(x);
    return x;
  }

  , standardize (src) {
    if (src === __.coinbaseWsFeed) {
      return (x) => {
        return {
          type:  x.type
        , price: x.price
        , side:  x.side
        , size:  x.size || x.remaining_size || new_size
        , time:  x.time
        , index: x.sequence
        , id:    x.order_id
        }
      }
    }
  }

  , compPrice (a, b) {
    return a.price > b.price
  }
  , makeEntry () {}

  , diffStateStats (state, order) {
    order.size = order.size || 1
    if (order.side === 'sell') {
      state.BTC += order.size;
      state.cash -= (order.price * order.size);
      state.netCash -= (order.price * order.size);
      state.netBTC += order.size;
    } else if (order.side === 'buy') {
      state.BTC -= order.size;
      state.cash += (order.price * order.size);
      state.netCash += (order.price * order.size);
      state.netBTC -= order.size;
    }
    return state;
  }

  , observeSocket (url, open) {
    function socket () {
      var sock = new WebSocket(url)
      sock.onopen = function () {
        sock.send(open);
      }
      return sock;
    }
  var src = Rx.Observable
     .fromEvent(socket(), 'message')
     .map(e => JSON.parse(e.data))
   return src;
 }
}

module.exports = _.mapObj(_.curry, utilities)