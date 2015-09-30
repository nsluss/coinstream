var React = require('react')

var priceEntry = React.createClass({
  render () {
    return (
        <div className="priceEntry">
          <p>Price: 
            <span>{this.props.price}</span>
            <span style={{marginLeft: 25 + 'px'}}>QTY:{this.props.size}</span>
            <button style={{float: 'right'}} className="goButton">take order</button>
          </p>
        </div>
      )
  }
})

module.exports = priceEntry