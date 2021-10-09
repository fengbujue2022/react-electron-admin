import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import App from './components/app/app'
import themes from './themes/index'
import 'react-toastify/dist/ReactToastify.css'
import { LayoutProvider } from './context/LayoutContext'
import { UserProvider } from './context/UserContext'

ReactDOM.render(
  <UserProvider>
    <LayoutProvider>
      <ThemeProvider theme={themes.default}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <App />
      </ThemeProvider>
    </LayoutProvider>
  </UserProvider>,
  document.getElementById('root')
)
