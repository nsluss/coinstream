var PriceEntry = require('./priceEntry.js')
  , React = require('react')
  , _     = require('ramda')
  , $     = require('../lib/helpers.js')

var OrderList = React.createClass({
    renderOrders (orders) {

      return _.props(_.keys(orders), _.mapObj(
        (x) => {
          return (
            <PriceEntry 
              price={x.price}
              size={x.size} >
            </PriceEntry>
          )
        }
        , orders))
    }
  , componentWillMount () {
    $.log(this.props)
  }

  , render () {
    return (
      <div>
        {this.renderOrders(this.props.list)}
      </div>
    )
  }
})

module.exports = OrderList
