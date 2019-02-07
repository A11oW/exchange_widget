import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './Home';
import Exchange from './Exchange';
import { ROUTES } from '../constants';

const Routes = () => (
  <Router>
    <div>
      <Route path={ROUTES.HOME} exact component={Home} />
      <Route path={ROUTES.EXCHANGE} component={Exchange} />
    </div>
  </Router>
);

export default Routes;
