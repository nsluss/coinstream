var React     = require('react')
  , OrderList = require('./orderList.js')
  , _         = require('ramda')
  , Rx        = require('rx')
  , $         = require('../lib/helpers.js')
  , __        = require('../lib/constants.js')

var Panel = React.createClass({
  getInitialState () {
    return {
        side: this.props.filter.side
      , orders: {
        size: 0
      }
    }
  }

  , orderPrices (x) {
    //order is correct and price exists
    //if (this.state.index < x.index && !!x.price) {
      
      this.setState($.log({orders: this.updateOrders(x)}));
    //}
  }

  , transform () {
    $.observeSocket(this.props.src, this.props.sub)
        .map($.standardize(this.props.src))
        .filter(_.whereEq(this.props.filter))
        .subscribe((x) => {this.orderPrices(x)}, $.log, $.log);
  }

  , updateOrders (open) {
    var orders = this.state.orders.size
    if (open.type === 'done') {
      return _.merge({}, _.dissoc(open.id, this.state.orders))
    } else if (open.type === 'open'){

      return _.merge({}, _.assoc(open.id, open, this.state.orders))
    } else if (open.type === 'change') {
      return _.merge(this.state.orders, open)
    } else {
      return this.state.orders
    }
  }

  , componentWillMount () {
    this.setState({side: this.props.filter.side})
    this.transform();
  }

  , render () {
    return (
      <div className='panel'>
        <h2>{this.props.children}</h2>
        <h3>Open Orders: {this.state.orders.size}</h3>
        <OrderList list={this.state.orders}></OrderList>
      </div>
      )
  }
})

module.exports = Panel