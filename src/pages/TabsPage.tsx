import { Route, Redirect } from "react-router";
import React from "react";
import HomePage from "./HomePage";
import SettingsPage from "./SettingsPage";

import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonRouterOutlet,
} from "@ionic/react";

// MOBX
import { observer } from "mobx-react";

const TabsPage = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
      <Redirect exact path="/" to="/tabs/home" />
      <Route path="/tabs/home" render={()=><HomePage />} exact={true}/>
      <Route path="/tabs/settings"   render={()=><SettingsPage />} exact={true}/>
      
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/tabs/home">
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/tabs/settings">
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default observer(TabsPage);