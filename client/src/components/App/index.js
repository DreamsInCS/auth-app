import React, { useCallback } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import { useMappedState } from 'redux-react-hook'
import './App.css'
import Home from '../Home/'
import Login from '../Login'
import Navigation from '../Navigation'
import NotFound from '../NotFound'
import useWithAuthenticate from '../WithAuthenticate'
import Signup from '../Signup'
import * as routes from '../../constants/routes'

function App() {
  useWithAuthenticate() // Token check

  const mapState = useCallback((state) => ({
    loading: state.sessionState.loading
  }), [])

  const { loading } = useMappedState(mapState)

  if (loading) return <h1>Loading...</h1>

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="App">
        <Navigation />
        <header className="App-header">
          <Switch>
            <Route exact path={routes.HOME} component={Home} />
            <Route exact path={routes.LOGIN} component={Login} />
            <Route exact path={routes.SIGN_UP} component={Signup} />
            <Route component={NotFound} />
          </Switch>
        </header>
      </div>
    </Router>
  )
}

export default App;
