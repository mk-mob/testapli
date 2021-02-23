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
  IonModal,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import {usePlatform} from '@ionic/react-hooks/platform';
import { observer, MobXProviderContext } from "mobx-react";
import { EmailComposer } from '@ionic-native/email-composer';

const emailComposer = EmailComposer;


const LoginPage:React.FC = () => {
  const { store } = React.useContext(MobXProviderContext);
  let { isAuth, initializationError } = store;
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorInfo, setErrorInfo] = useState({showErrorToast: false, errMsg: ""});
  const [showModal, setShowModal] = useState(false);

  const { platform } = usePlatform();
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
  
  


  // const Content_A =()=>{
  //   return (
  //     <div className="content_A">

  //     <div style={{display:'flex',marginTop:20}}>
  //       <IonLabel >メールアドレス: &nbsp;</IonLabel>
  //       <input
  //         type="email"
  //         style={{  width:'200px',height:30 }}
  //         onChange={(e) => {
  //           setEmail(e.target.value);
  //         }}
  //         value ={email}
  //         name="email"
  //       />
  //     </div>
  //     <div style={{display:'flex',marginTop:20}}>
  //       <IonLabel >パスワード:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</IonLabel>
  //       <input
  //         style={{  width:'200px',height:30 }}
  //         type="password"
  //         onChange={(e) => {
  //           setPassword(e.target.value);
  //         }}
  //         name="password"
  //         value={password}
  //       />
  //     </div>
  //       <div style={{ padding: 10, paddingTop: 20 }}>
  //         <IonButton
  //           color ="dark"
  //           style={{ margin: 14 }}
  //           onClick={(e) => {
  //             if (!e.currentTarget) {
  //               return;
  //             }
  //             e.preventDefault();
  //             _doLogin();
  //           }}
  //         >
  //           {isAuth ? "ログインしています" : "ログイン"}
  //         </IonButton>
  //         <IonButton
  //          color="dark"
  //           style={{ margin: 14 }}
  //           onClick={(e) => setShowModal(true) }
  //         >
  //           Create Account
  //         </IonButton>
  //       </div>
       
  //     </div>

  //   );
  // }
  // const Content_B =()=>{
  //   return (
  //     <div className="content_B">

  //       <IonItem>
  //         <IonLabel position="floating">Email Address</IonLabel>
  //         <IonInput
  //           type="email"
  //           onIonChange={e => setEmail(e.detail.value!)}
  //           name="email"
  //           value ={email}
  //         ></IonInput>
  //       </IonItem>
  //       <IonItem>
  //         <IonLabel position="floating">Password</IonLabel>
  //         <IonInput
  //           type="password"
  //           onIonChange={e =>  setPassword(e.detail.value!)}
  //           name="password"
  //           value={password}
  //         ></IonInput>
  //       </IonItem>
  //       <div style={{ padding: 10, paddingTop: 20 }}>
  //         <IonButton
  //           expand="block"
  //           style={{ margin: 14 }}
  //           onClick={(e) => {
  //             if (!e.currentTarget) {
  //               return;
  //             }
  //             e.preventDefault();
  //             _doLogin();
  //           }}
  //         >
  //           {isAuth ? "ログインしています" : "ログイン"}
  //         </IonButton>
  //         <IonButton
  //           expand="block"
  //           style={{ margin: 14 }}
  //           onClick={(e) => setShowModal(true) }
  //         >
  //           新規アカウントを作成
  //         </IonButton>
  //       </div>

  //     </div>
  //   );
  // }

  // const RegisterModal =()=>{
  //   return(
  //   <IonModal isOpen={showModal} cssClass='regist-modal-class'>
  //   <p>登録するには、メールアドレスを送信してください</p>

  //     <IonItem>
  //       <IonLabel position="floating">メールアドレス</IonLabel>
  //       <IonInput
  //         type="email"
  //         onIonChange={(e:CustomEvent) => {
  //           setEmail(e.detail.value);
  //         }}
  //         name="email"
  //         value ={email}
  //       />
  //     </IonItem>
  //     <div style={{display:'flex',marginTop:20}}>
  //   <IonButton onClick={() => sendMail()}>送信</IonButton>
  //   <IonButton onClick={() => setShowModal(false)}>キャンセル</IonButton>
  //   </div>
  //   <div><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/></div>
  // </IonModal>

  //   );
  // }

  const sendMail =() =>{
     {
      if(!emailComposer.isAvailable()) {
        setErrorInfo({ showErrorToast: true, errMsg: "Mail Unavailable!" });
      }
    }
    let intro_text = email+"様、会員登録の申込みありがとうございます。次のリンクから会員登録を行ってください。";
    let link = 'http://purelabo777.netlify.app/register'
    let conf_text ="このメールに心当たりがない場合、削除してください";
    let mail_body = intro_text + '<br>' + link +'<br>' + conf_text;
    let sendmail = {
      to: email,
      subject: '会員登録用メール',
      body: mail_body,
      isHtml: true
    }
    console.log(sendmail);
    emailComposer.open(sendmail);
    setShowModal(false);
  }

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
       
      <div style={{display:'flex',marginTop:20}}>
      <IonLabel >メールアドレス: &nbsp;</IonLabel>
      <input
        type="email"
        style={{  width:'200px',height:30 }}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        value ={email}
        name="email"
      />
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
        value={password}
      />
      </div>
      <div style={{ padding: 10, paddingTop: 20 }}>
        <IonButton
          color ="dark"
          style={{ margin: 14 }}
          onClick={(e) => {
            if (!e.currentTarget) {
              return;
            }
            e.preventDefault();
            _doLogin();
          }}
        >
          {isAuth ? "ログインしています" : "ログイン"}
        </IonButton>
        <IonButton
        color="dark"
          style={{ margin: 14 }}
          onClick={(e) => setShowModal(true) }
        >
          Create Account
        </IonButton>
        </div>

        <IonModal isOpen={showModal} cssClass='regist-modal-class'>
          <p>登録するには、メールアドレスを送信してください</p>

          <div style={{display:'flex',marginTop:20}}>
          <IonLabel >メールアドレス:&nbsp;</IonLabel>
          <input
            type="email"
            style={{  width:'200px',height:30 }}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value ={email}
            name="email"
          />
          </div>
          <div style={{display:'flex',marginTop:20}}>
        <IonButton 
         color ="dark"
         style={{ margin: 14 }}
        onClick={() => sendMail()}>送信
        </IonButton>
        <IonButton
         color ="dark"
         style={{ margin: 14 }}
         onClick={() => setShowModal(false)}>キャンセル
         </IonButton>
        </div>
        <div style={{height:"300px"}}><br/></div>
       </IonModal>
        <IonToast
          color="danger"
          isOpen={errorInfo.showErrorToast}
          onDidDismiss={() => setErrorInfo({ showErrorToast: false, errMsg: "" })}
          message={errorInfo.errMsg}
          duration={2000}
        />
         <div style={{ padding: 10, paddingTop: 20 }} />
      </IonContent>
    </IonPage>
  );
};

export default observer(LoginPage);
