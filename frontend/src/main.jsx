import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// import store from './app/store'
import {Provider} from 'react-redux'
import AlertsProvider from './alerts/alerts-context.jsx'
import { ThemeProvider } from '@mui/material'
import theme from '../utils/styles/globalstyles/theme.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* // <ThemeProvider theme={theme}>
      <AlertsProvider> */}
        {/* <Provider store={store}> */}
          <App />
        {/* </Provider> */}
        {/* </AlertsProvider>
    </ThemeProvider> */}
  </React.StrictMode>
)
