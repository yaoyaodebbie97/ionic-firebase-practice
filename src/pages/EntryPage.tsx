import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { trash as trashIcon } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useAuth } from '../auth';
import { formatDate } from '../date';
import { firestore } from '../firebase';
import { Entry, toEntry } from '../models';

interface RouteParams {
  id: string;
}

const EntryPage: React.FC = () => {
  const { userId } = useAuth();
  const history = useHistory();

  const { id } = useParams<RouteParams>(); // use Params for route params!!!!  i.e., match.params
  const [entry, setEntry] = useState<Entry>();
  // fetch single entry 
  useEffect(() => {
    const entryRef = firestore.collection('users').doc(userId)
      .collection('entries').doc(id);
    entryRef.get().then((doc) => setEntry(toEntry(doc))); // toEntry, convert doc to an entry 
  }, [userId, id]);

  const handleDelete = async () => {
    const entryRef = firestore.collection('users').doc(userId)
      .collection('entries').doc(id);
    await entryRef.delete();
    history.goBack();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>

          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          {/* button for going back to home page where all entries are listed */}
{/* ?. optional chaining, otherwise will evaluate to undefined, meaning not display anything  */}
          <IonTitle>{formatDate(entry?.date)}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleDelete}>
              <IonIcon icon={trashIcon} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>{entry?.title}</h2>
  {/* Display image */}
        <img src={entry?.pictureUrl} alt={entry?.title} />
        <p>{entry?.description}</p>
      </IonContent>
    </IonPage>
  );
};

export default EntryPage;
