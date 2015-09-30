var React = require('react')
  , Panel = require('./components/pricePanel.js')
  , Stats = require('./components/stats.js')
  , __    = require('./lib/constants.js')
  , _     = require('ramda')
  , $     = require('./lib/helpers.js')

var App = React.createClass({
  componentWillMount () {
    $.log(__.sell)
  }

  , getInitialState () {
    return {
      stats: {
            cash: 10000
          , BTC: 0
          , netCash: 0
          , netBTC: 0
        }
      }
  }
  , orderHandler (x) {
    this.setState({stats: $.diffStateStats(this.state.stats, x)})
  }
  , render () {
    return (
      <section>
        <div id="title">
          <h1>Welcome to Coin Stream!</h1>
        </div>
        <Stats stats={this.state.stats}></Stats>
        <Panel
          src={__.coinbaseWsFeed}
          sub={__.BTC_USDSub}
          filter={__.sell}
          type="active" 
          handleClick={this.orderHandler} >
            Coinbase last open sell order
        </Panel>
        <Panel
          src={__.coinbaseWsFeed}
          sub={__.BTC_USDSub}
          filter={__.buy}
          type="active"
          handleClick={this.orderHandler} >
            Coinbase last open buy order
        </Panel>
        <Panel
          src={__.coinbaseWsFeed}
          sub={__.BTC_USDSub}
          filter={__.match}
          type="info"
          handleClick={_.identity}>
            Coinbase last matched order
          </Panel>
      </section>
    )
  }
})

React.render(<App />, document.querySelector('#react'))
