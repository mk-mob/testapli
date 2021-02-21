import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>HomePage</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">HomePage</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="HomePage" />
      </IonContent>
    </IonPage>
  );
};

export default HomePage;