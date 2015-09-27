var React = require('react')
  , _     = require('ramda')
var Stats = React.createClass({
  render () {
    return (
      <div className="stats">
        <h2>your stats:</h2>
        <ul>
          <li>Total Cash: <span>{this.props.stats.cash}</span>$</li>
          <li>Total Coin: <span>{this.props.stats.BTC}</span>BTC</li>
          <li>Net Cash: <span>{this.props.stats.netCash}</span>$</li>
          <li>Net Coin: <span>{this.props.stats.netBTC}</span>BTC</li>
        </ul>
      </div>
    )
  }
})

module.exports = Stats;