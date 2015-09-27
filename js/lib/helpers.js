var Rx = require('rx')
  , __ = require('./constants.js')
  , _  = require('ramda')

var utilities = {
  log (x) {
    console.log(x);
    return x;
  }
  //standardize :: Srting url, {} a, {} b => url -> (a -> b)
  , standardize (src) {
    if (src === __.coinbaseWsFeed) {
      return (x) => {
        return {
          type:  x.type
        , price: x.price
        , side:  x.side
        , size:  x.size || x.remaining_size
        , time:  x.time
        , index: x.sequence
        , id:    x.order_id
        }
      }
    }
  }

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
  //observeSocket :: Observable o, Ws w  => Url -> JSON -> o w (Url)
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
     //.debounce('20')

   return src;
 }
}

module.exports = _.mapObj(_.curry, utilities)