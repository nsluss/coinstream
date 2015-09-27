var React      = require('react')
  , PriceEntry = require('./priceEntry.js')
  , _          = require('ramda')
  , Rx         = require('rx')
  , $          = require('../lib/helpers.js')
  , __         = require('../lib/constants.js')

var Panel = React.createClass({
  getInitialState () {
    return __.empty
  }
  //impure
  , setPrice (x) {
    this.setState(x)
  }
  , orderPrices (x) {
    //order is correct and price exists
    if (this.state.index < x.index && !!x.price) {
      this.setPrice(x);
    }
  }
  //impure
  , transform () {
    $.observeSocket(this.props.src, this.props.sub)
        .map($.standardize(this.props.src))
        .filter(_.whereEq(this.props.filter))
        .do($.log)
        .subscribe((x) => {this.orderPrices(x)}, $.log, $.log);
  }
  //impure
  , componentWillMount () {
    this.setState({side: this.props.filter.side})
    this.transform();
    //console.log($);
    $.log(this.props.filter)
  }

  , render () {
    return (
      <div className='panel'>
        <h2>{this.props.children}</h2>
        <p className="price">Price: {this.state.price}</p>
        <input 
          className={this.props.type==="info"?"hidden":"goButton"}
          type="button" 
          value="Take Order"
          onClick={_ => this.props.handleClick(this.state)} />
        <PriceEntry>test</PriceEntry>
      </div>
      )
  }


})

module.exports = Panel



// var Rx = require('rx'),
//     Chart = require('../Chart/index.jsx')
// import Header from '../Header';
// import Feed from '../Feed';
// import styles from './style';



// function test() {
// var observable = Rx.Observable
//   .interval()
//   .timeInterval()
//   .forEach(function(x){
//     observer.onNext(1);
//   }, function(err){
//     console.log('Error: ', err);
//   }, function(){
//     console.log('DONE!');
//   });
// }


// var Application = React.createClass ({
//   getInitialState () {
//       var observer = Rx.Observer.create(
//         (x) => {console.log("I have observed: " + x)},
//         log('Error: '),
//         log('DONE!')
//       );
//       var prices = {
//         open: {
//           buy:  {value: "000.00"},
//           sell: {value: "000.00"},
//           diff: {value: "000.00"},
//           lastUpdated: Date.now()
//         },
//         match: {
//           buy:  {value: "000.00"},
//           sell: {value: "000.00"},
//           diff: {value: "000.00"},
//           lastUpdated: Date.now()
//         }
//     }
//     return this.setPriceState(this.observeSocket(), prices);
//   },

//   setPriceState (stream, prices) {
//     stream
//       .filter(x => x.type === 'match' || x.type === 'open')
//       .map(x => {
//         var newState = this.state;
//         newState[x.type][x.side].value = x.price;
//         newState[x.type].lastUpdated = x.time;
//         this.setState(newState)
//         newState[x.type].diff.value = newState[x.type].buy.value - newState[x.type].sell.value
//         this.setState(newState)
//         x
//       })
//       .subscribe(
//         log('recieved'),
//         log('error'),
//         log('DONE!')
//         )
//       return prices;
//   },

//   observeSocket () {
//     function socket () {
//       var sock = new WebSocket('wss://ws-feed.exchange.coinbase.com')
//       sock.onopen = function () {
//         sock.send('{"type": "subscribe","product_id": "BTC-USD"}');
//       }
//       return sock;
//     }

//     var src = Rx.Observable
//       .fromEvent(socket(), 'message')
//       .map(e => JSON.parse(e.data))
//       //.debounce('20')

//     return src;
//   },

//   render () {
//     return (<div >
//       <div >
//         <main >
//         </main>
//           <label> Orders:
//             <ol>
//               <li><strong>Buy: </strong><Feed price={this.state.open.buy.value}/></li>
//               <li><strong>Sell: </strong><Feed price={this.state.open.sell.value}/></li>
//               <li><strong>Diff: </strong><Feed price={this.state.open.diff.value}/></li>
//             </ol>
//           </label>
//           <Chart></Chart>
//           <label> Trades:
//             <ol>
//               <li><strong>Buy: </strong><Feed price={this.state.match.buy.value}/></li>
//               <li><strong>Sell: </strong><Feed price={this.state.match.sell.value}/></li>
//               <li><strong>Diff: </strong><Feed price={this.state.match.diff.value}/></li>
//             </ol>
//           </label>
//       </div>
//     </div>)
//   }
// })
