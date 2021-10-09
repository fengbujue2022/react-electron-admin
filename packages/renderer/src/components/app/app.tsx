import { useUserState } from '@/context/UserContext';
import React from 'react';
import { Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import Layout from '../layout/layout';
import Login from '@/pages/login';
import HashRouter from '@/components/rehistory/hashRouter';

export default function App() {
  var { user } = useUserState();
  const isAuthenticated = !!user;
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/app/dashboard" />} />
        <PrivateRoute path="/app" component={Layout} />
        <PublicRoute path="/login" component={Login} />
      </Switch>
    </HashRouter>
  );

  function PrivateRoute({ component, ...rest }: RouteProps) {
    return (
      <Route
        {...rest}
        render={(props) =>
          isAuthenticated ? (
            React.createElement(component as any, props)
          ) : (
            <Redirect
              to={{
                pathname: '/login',
                state: {
                  from: props.location,
                },
              }}
            />
          )
        }
      />
    );
  }

  function PublicRoute({ component, ...rest }: RouteProps) {
    return (
      <Route
        {...rest}
        render={(props) =>
          isAuthenticated ? (
            <Redirect
              to={{
                pathname: '/',
              }}
            />
          ) : (
            React.createElement(component as any, props)
          )
        }
      />
    );
  }
}
