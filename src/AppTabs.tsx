// tab at the bottom for navigation 
// then no need to say go to settings in home page /go to home in setting 
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { home as homeIcon, settings as settingsIcon } from 'ionicons/icons';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useAuth } from './auth';
import AddEntryPage from './pages/AddEntryPage';
import EntryPage from './pages/EntryPage';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';

const AppTabs: React.FC = () => {
  const { loggedIn } = useAuth();
  if (!loggedIn) {
    return <Redirect to="/login" />;
  }
  return (
    <IonTabs>
      <IonRouterOutlet>
        {/* adding my meaning it is a private page  */}
        <Route exact path="/my/entries">
          <HomePage />
        </Route>
        <Route exact path="/my/entries/add">
          <AddEntryPage />
        </Route>
        <Route exact path="/my/entries/view/:id">
          <EntryPage />
        </Route>
        <Route exact path="/my/settings">
          <SettingsPage />
        </Route>
      </IonRouterOutlet>

{/* display ion tab bar at the bottom */}
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/my/entries">
          <IonIcon icon={homeIcon} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>

        <IonTabButton tab="settings" href="/my/settings">
          {/* use href on button */}
          <IonIcon icon={settingsIcon} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default AppTabs;
