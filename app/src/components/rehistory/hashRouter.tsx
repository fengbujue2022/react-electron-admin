import React from 'react'
import { HashHistoryBuildOptions } from 'history'
import { createHashRehistory } from '.'
import { Router } from 'react-router'

export default class HashRouter extends React.Component<HashHistoryBuildOptions> {
  history = createHashRehistory(this.props)

  render() {
    return <Router history={this.history} children={this.props.children} />
  }
}
