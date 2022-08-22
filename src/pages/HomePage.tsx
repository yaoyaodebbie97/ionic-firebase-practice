import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonThumbnail,
  IonImg,
} from '@ionic/react';
import { add as addIcon } from 'ionicons/icons';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth';
import { formatDate } from '../date';
// convert iso string 
import { firestore } from '../firebase';
import { Entry, toEntry } from '../models';

const HomePage: React.FC = () => {
  const { userId } = useAuth(); // get userId 
  const [entries, setEntries] = useState<Entry[]>([]); 
  // fetch data from firestore 
  useEffect(() => {
    // return collection reference  entriesRef = fireStore.collection('entries')
    // entriesRef.get().then((snapshot)=>{console.log(snapshot)})
    // get the snapshot object 
    // within.then : const entries = snapshot.docts.map((docs))=>({id: doc.id, ...doc.data()}); setEntries(entries)
    const entriesRef = firestore.collection('users').doc(userId)
      .collection('entries');
    return entriesRef.orderBy('date', 'desc').limit(7)
      .onSnapshot(({ docs }) => setEntries(docs.map(toEntry))) // use onsnapshot, when going back here, will display the most updted; instead of using entriesRef.get()
  }, [userId]);
  
  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonTitle>Daily Moments</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* ionlist with clickable ion items  */}
        <IonList>
          {entries.map((entry) =>
            <IonItem button key={entry.id}
              routerLink={`/my/entries/view/${entry.id}`}>
    {/* small preview for the picture */}
              <IonThumbnail slot="end">
                <IonImg src={entry.pictureUrl} />
              </IonThumbnail>
              <IonLabel>
                <h2>{formatDate(entry.date)}</h2>
                <h3>{entry.title}</h3>
              </IonLabel>
            </IonItem>
          )}
        </IonList>
        <IonFab vertical="bottom" horizontal="end">
          <IonFabButton routerLink="/my/entries/add">
            <IonIcon icon={addIcon} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
