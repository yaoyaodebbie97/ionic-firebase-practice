import {
  IonApp, IonLoading,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router'; 
// can also just use BroswerRouter 
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import AppTabs from './AppTabs';
import { AuthContext, useAuthInit } from './auth';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import RegisterPage from './pages/RegisterPage';

const App: React.FC = () => {
  const { loading, auth } =  useAuthInit();
  if (loading) {
    return <IonLoading isOpen />;
  }
  console.log(`rendering App with auth:`, auth);
  
  return (
    <IonApp>
      <AuthContext.Provider value={auth}> 
      {/* wrap everuthing inside auth context provider, value = {{loggedIn}} */}
        <IonReactRouter> 
          <Switch>

            <Route exact path="/login">
                <LoginPage />
            </Route>

            <Route exact path="/register">
              <RegisterPage />
            </Route>

            <Route path="/my">
              <AppTabs />
            </Route>

            {/* <Redirect exact path="/" to="/my/entries" /> */}

            <Route>
              <NotFoundPage />
            </Route>

          </Switch>
        </IonReactRouter>
      </AuthContext.Provider>
    </IonApp>
  );
};

export default App;



// const [loggedIn, setLoggedIn] = useState(false);

// <Route exact path = '/entries'>
//   {loggedin? <HomePage/> : <Redirect to = '/login' />}
// </Route>

// if route is /login, <LoginPge onLogin = {()=> setLoggedIn(true)} also use ? : here to redirect to entries
// in the login page component , button onClick = {onLogin} call the obLogin function 
// OR pass in  both loggedIn, onLogin 
// in login page component: if (loggedIn) return <redirect to> else .... 
// so that no need ternary here 

// same idea for AppTabs 
{/* <AppTabs loggedIn = {loggedIn}
then in AppTabs
if (!loggedIn) redirect to logged in path  */}

// using auth context, no need to pass loggedIn props down 