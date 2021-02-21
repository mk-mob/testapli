import React from "react";
import { Redirect, Route } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RagistrationPage';
import SettingsPage from './pages/SettingsPage';
import TabsPage from "./pages/TabsPage";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { observer, MobXProviderContext } from "mobx-react";
import { IonApp, IonLoading } from "@ionic/react";

const PrivateRoutes = () => {
  console.log("PrivateRoutes!")
  return (
    <IonReactRouter>
        {/****** AUTH CREATE ACCOUNT */}
        <Route path="/login" component={LoginPage} exact={true} />
        <Route path="/register" component={RegistrationPage} exact={true} />
        <Route path="/" render={() => <Redirect to="/login" />} />
    </IonReactRouter>
  );
};
const PublicRoutes = () => {
  console.log("PublicRoutes!")
  return (
    <IonReactRouter>
      <Route path="/" component={TabsPage} />
      <Route path="/login" render={() => <Redirect to="/" />} />
      
      
    </IonReactRouter>
  );
};

const App: React.FC = () => {
  const { store } = React.useContext(MobXProviderContext);
  console.log("Authenticated?:",store.authenticatedUser);

  return !store.authCheckComplete ? (
    <IonApp>
      <IonLoading
      cssClass='my-custom-class'
      isOpen={true}
      message={"Starting App..."} />
    </IonApp>
  ) : (
    <IonApp>{store.authenticatedUser ? <PublicRoutes /> : <PrivateRoutes />}</IonApp>
  );
  };

export default observer(App);