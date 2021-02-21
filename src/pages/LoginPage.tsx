import React, { useState } from "react";
import {
  IonButtons,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonToast,
  IonText,
  IonPage,
  IonContent,
} from "@ionic/react";
import { useHistory } from "react-router-dom";

import { observer, MobXProviderContext } from "mobx-react";

const LoginPage = () => {
  const { store } = React.useContext(MobXProviderContext);
  let { isAuth, initializationError } = store;
  const history = useHistory();
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("");
  const [errorInfo, setErrorInfo] = useState({showErrorToast: false, errMsg: ""});
  console.log("LoginPage!!");
  /**
   *
   */
  const _doLogin = async () => {

    try {
      let r = await store.doLogin(email, password);
      if (r.code) {  throw r;}
      setErrorInfo({showErrorToast: false, errMsg: ""});
      return history.push("/");
    } catch (e) {
      setErrorInfo({ showErrorToast: true, errMsg: e.message });
      return false;
    }
  };
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="light">
          <IonButtons slot="start" />
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonText color="danger"  style={{ fontWeight: "500" }}>
          {initializationError && initializationError.message}
        </IonText>

        <IonItem>
          <IonLabel position="floating">Email Address</IonLabel>
          <IonInput
            type="email"
            onIonChange={(e:CustomEvent<any>) => {
              setEmail(e.detail.value);
            }}
            name="email"
            
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Password</IonLabel>
          <IonInput
            type="password"
            onIonChange={(e:CustomEvent<any>) => {
              setPassword(e.detail.value);
            }}
            name="password"
          />
        </IonItem>
        <div style={{ padding: 10, paddingTop: 20 }}>
          <IonButton
            expand="full"
            style={{ margin: 14 }}
            onClick={(e) => {
              if (!e.currentTarget) {
                return;
              }
              e.preventDefault();
              _doLogin();
            }}
          >
            {isAuth ? "Logged In" : "Login"}
          </IonButton>
          <IonButton
            expand="full"
            style={{ margin: 14 }}
            onClick={(e) => {
              e.preventDefault();
              history.push("/register");
            }}
          >
            Create Account
          </IonButton>
        </div>
        <div style={{ padding: 10, paddingTop: 20 }}>
        
        </div>  
        <IonToast
          color="danger"
          isOpen={errorInfo.showErrorToast}
          onDidDismiss={() => setErrorInfo({ showErrorToast: false, errMsg: "" })}
          message={errorInfo.errMsg}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default observer(LoginPage);
