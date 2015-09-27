var React = require('react')

var priceEntry = React.createClass({
  render () {
    return (
        <div className="priceEntry">
          <span>{this.props.children}</span>
        </div>
      )
  }
})

module.exports = priceEntry