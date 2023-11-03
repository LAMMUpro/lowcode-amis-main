import React from 'react';
import { Route, Redirect } from 'react-router-dom';

/**
 * /preview/:id路由限制
 * 如果store.currentApplicationId不存在，则返回/home
 */
const PreviewRoute = ({ component: Component, ...rest }: {component: React.FC<any>, path: string}) => (
  <Route
    {...rest}
    render={(props) =>
      window.store.currentApplicationId ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/home' }} />
      )
    }
  />
);

export default PreviewRoute;