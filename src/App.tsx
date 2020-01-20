import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
// components
import Exercise from './pages/Exercise'
const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/exercises/:id" exact component={Exercise} />
        </Switch>
      </Router>
    </div>
  )
}

export default App
