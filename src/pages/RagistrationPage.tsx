import React, { useState } from "react";
import {
  IonItem,
  IonLabel,
  IonButton,
  IonInput,
  IonToast,
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,IonButtons, IonBackButton, IonList
} from "@ionic/react";
import {usePlatform} from '@ionic/react-hooks/platform';
import { MobXProviderContext, observer } from "mobx-react";
import { useHistory } from "react-router";

const RegistrationPage:React.FC = () => {
  const { store } = React.useContext(MobXProviderContext);
  const history = useHistory();
  const [errorInfo, setErrorInfo] = useState({showErrorToast: false, errMsg: ""});
  const [email, setEmail] = useState({});
  const [password, setPassword] = useState({});
  const [firstName, setFirstName] = useState({});
  const [lastName, setLastName] = useState({});

  const { platform } = usePlatform();

  const _doCreateAccount = async () => {
    try {
      let r = await store.doCreateUser({
        email,
        password,
        firstName,
        lastName,
      });

      if (r.code) {
        throw r;
      } else {
        history.replace("/tabs/home");
      }
    } catch (e) {
      console.log(e);
      setErrorInfo({ showErrorToast: true, errMsg: e.message });
    }
  };

  // const Content_A =()=>{

  //   return(
  //     <div className="content_A">  
  //     <div style={{display:'flex',marginTop:20}}>
  //       <IonLabel >メールアドレス: &nbsp;</IonLabel>
  //       <input
  //         type="email"
  //         style={{  width:'200px',height:30 }}
  //         onChange={(e) => {
  //           setEmail(e.target.value);
  //         }}
  //         name="email"
  //       />
  //     </div>

  //     <div style={{display:'flex',marginTop:20}}>
  //     <IonLabel >
  //       名  &emsp;前:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  //     </IonLabel>
  //     <IonItem>
  //       <IonLabel>姓</IonLabel>
  //       <input
  //         type="text"
  //         style={{  width:'100px',height:30}}
  //         onChange={(e) => {
  //           setFirstName(e.target.value);
  //         }}
  //         name="firstName"
  //       />
  //     </IonItem>

  //     <IonItem>
  //       <IonLabel>名</IonLabel>
  //       <input
  //         type="text"
  //         style={{  width:'100px',height:30 }}
  //         onChange={(e) => {
  //           setLastName(e.target.value);
  //         }}
  //         name="lastName"
  //       />
  //     </IonItem>
  //     </div>
  //     <div style={{display:'flex',marginTop:20}}>
  //       <IonLabel >パスワード:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</IonLabel>
  //       <input
  //       style={{  width:'200px',height:30 }}
  //         type="password"
  //         onChange={(e) => {
  //           setPassword(e.target.value);
  //         }}
  //         name="password"
  //       />
  //     </div>
      
  //     <div style={{ padding: 8 }}>
  //       <IonButton
  //         color = "dark"
  //         style={{ margin: 14 }}
  //         onClick={(e) => {
  //           if (!e.currentTarget) {
  //             return;
  //           }
  //           e.preventDefault();
  //           _doCreateAccount();
  //         }}
  //       >
  //         アカウント作成
  //       </IonButton>
  //       <IonButton
  //         color="dark"
  //         style={{ margin: 14 }}
  //         onClick={(e) => {
  //           e.preventDefault();
  //           history.goBack();
  //         }}
  //       >
  //         キャンセル
  //       </IonButton>
  //     </div>
  //     </div>
  //   );

  //}
  // const Content_B = () =>{
  //   return (
  //     <div className="content_B">
  //       <IonItem>
  //         <IonLabel position="floating">Email Address</IonLabel>
  //         <IonInput
  //           type="email"
  //           onIonChange={(e:CustomEvent) => {
  //             setEmail(e.detail.value);
  //           }}
  //           name="email"
  //         />
  //       </IonItem>

  //       <IonItem>
  //         <IonLabel position="floating">First Name</IonLabel>
  //         <IonInput
  //           type="text"
  //           onIonChange={(e:CustomEvent) => {
  //             setFirstName(e.detail.value);
  //           }}
  //           name="firstName"
  //         />
  //       </IonItem>

  //       <IonItem>
  //         <IonLabel position="floating">Last Name</IonLabel>
  //         <IonInput
  //           type="text"
  //           onIonChange={(e:CustomEvent) => {
  //             setLastName(e.detail.value);
  //           }}
  //           name="lastName"
  //         />
  //       </IonItem>
  //       <IonItem>
  //         <IonLabel position="floating">Password</IonLabel>
  //         <IonInput
  //           type="password"
  //           onIonChange={(e:CustomEvent) => {
  //             setPassword(e.detail.value);
  //           }}
  //           name="password"
  //         />
  //       </IonItem>
  //       <div style={{ padding: 8 }}>
  //         <IonButton
  //           expand="full"
  //           style={{ margin: 14 }}
  //           onClick={(e) => {
  //             if (!e.currentTarget) {
  //               return;
  //             }
  //             e.preventDefault();
  //             _doCreateAccount();
  //           }}
  //         >
  //           Create Account
  //         </IonButton>
  //         <IonButton
  //           expand="full"
  //           style={{ margin: 14 }}
  //           onClick={(e) => {
  //             e.preventDefault();
  //             history.goBack();
  //           }}
  //         >
  //           Cancel
  //         </IonButton>
  //       </div>


  //     </div>
  //   );

  // }



  return (
    <IonPage>
      <IonHeader>
        <IonToolbar  color="light">
        <IonButtons slot="start">
            <IonBackButton/>
          </IonButtons>
          <h1> Registration</h1>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">      
      <div className="content_A">  
      <div style={{display:'flex',marginTop:20}}>
        <IonLabel >メールアドレス: &nbsp;</IonLabel>
        <input
          type="email"
          style={{  width:'200px',height:30 }}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          name="email"
        />
      </div>

      <div style={{display:'flex',marginTop:20}}>
      <IonLabel >
        名  &emsp;前:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </IonLabel>
      <IonItem>
        <IonLabel>姓</IonLabel>
        <input
          type="text"
          style={{  width:'100px',height:30}}
          onChange={(e) => {
            setFirstName(e.target.value);
          }}
          name="firstName"
        />
      </IonItem>

      <IonItem>
        <IonLabel>名</IonLabel>
        <input
          type="text"
          style={{  width:'100px',height:30 }}
          onChange={(e) => {
            setLastName(e.target.value);
          }}
          name="lastName"
        />
      </IonItem>
      </div>
      <div style={{display:'flex',marginTop:20}}>
        <IonLabel >パスワード:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</IonLabel>
        <input
        style={{  width:'200px',height:30 }}
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          name="password"
        />
      </div>
      
      <div style={{ padding: 8 }}>
        <IonButton
          color = "dark"
          style={{ margin: 14 }}
          onClick={(e) => {
            if (!e.currentTarget) {
              return;
            }
            e.preventDefault();
            _doCreateAccount();
          }}
        >
          アカウント作成
        </IonButton>
        <IonButton
          color="dark"
          style={{ margin: 14 }}
          onClick={(e) => {
            e.preventDefault();
            history.goBack();
          }}
        >
          キャンセル
        </IonButton>
      </div>
      </div>
        <IonToast
          color="danger"
          isOpen={errorInfo.showErrorToast}
          onDidDismiss={() => setErrorInfo({ showErrorToast: false, errMsg: ""})}
          message={errorInfo.errMsg}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default observer(RegistrationPage);