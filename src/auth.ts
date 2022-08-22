import React, { useContext, useEffect, useState } from 'react';
import { auth as firebaseAuth } from './firebase';

// interface Auth {
//   loggedIn: boolean;
//   userId?: string; // optional property 
// }

// interface AuthInit {
//   loading: boolean;
//   auth?: Auth;
// }

////////////////////////////////
// auth context !!!!!!!
export const AuthContext = React.createContext<Auth>({ loggedIn: false });

// custom hook, so other components do not to use useContext 
// so that can grab loggedin state 
// return an objet with loggedin property 

export function useAuth(): Auth { 
  return useContext(AuthContext);
}

///////////////////////////////
// initialize the authentication sate 
// customize hook 
// loading flag+  auth object (loggedin + userId)
// only used for App component, if still loading ......
export function useAuthInit(): AuthInit {
  const [authInit, setAuthInit] = useState<AuthInit>({ loading: true });
  useEffect(() => { // useEffect, so onAuthStateChanged is only calle once 
    // remembering authentication state, so after refresh, still logged in 
    return firebaseAuth.onAuthStateChanged((firebaseUser) => { // pass in a user object 
      const auth = firebaseUser ?
        { loggedIn: true, userId: firebaseUser.uid } :
        { loggedIn: false };
      setAuthInit({ loading: false, auth });
    });
  }, []);
  return authInit;
}
