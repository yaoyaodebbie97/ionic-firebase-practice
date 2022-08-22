import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar,
  isPlatform,
} from '@ionic/react';
import { CameraResultType, CameraSource, Plugins } from '@capacitor/core';
import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router'; 
import { useAuth } from '../auth';
import { firestore, storage } from '../firebase';
const { Camera } = Plugins;

async function savePicture(blobUrl, userId) {
  const pictureRef = storage.ref(`/users/${userId}/pictures/${Date.now()}`); // path userFolder-> picture folder 
  const response = await fetch(blobUrl); 
  const blob = await response.blob(); // getting the blob object 
  const snapshot = await pictureRef.put(blob); // upload to firebase 
  const url = await snapshot.ref.getDownloadURL();  
  console.log('saved picture:', url);
  return url;
}

const AddEntryPage: React.FC = () => {
  const { userId } = useAuth(); // getuserId 
  const history = useHistory(); // sending users back 
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [pictureUrl, setPictureUrl] = useState('/assets/placeholder.png');
  const [description, setDescription] = useState('');


  // for image ////////////////
  const fileInputRef = useRef<HTMLInputElement>();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files.length > 0) {
      const file = event.target.files.item(0);
      const pictureUrl = URL.createObjectURL(file);
      setPictureUrl(pictureUrl);
    }
  };
  useEffect(() => () => {
    if (pictureUrl.startsWith('blob:')) { // memroy management 
      URL.revokeObjectURL(pictureUrl);
    }
  }, [pictureUrl]);
  ////////////////////////////

  // const handlePictureClick = async () => {
  //   if (isPlatform('capacitor')) {
  //     try {
  //       const photo = await Camera.getPhoto({
  //         resultType: CameraResultType.Uri,
  //         source: CameraSource.Prompt,
  //         width: 600,
  //       });
  //       setPictureUrl(photo.webPath);
  //     } catch (error) {
  //       console.log('Camera error:', error);
  //     }
  //   } else {
  //     fileInputRef.current.click();
  //   }
  // };

  const handleSave = async () => {
    const entriesRef = firestore.collection('users').doc(userId)
      .collection('entries'); // get the subcollections 
    const entryData = { date, title, pictureUrl, description };
    if (!pictureUrl.startsWith('/assets')) { // save the image to Cloud , if starts with 'blob:'
      entryData.pictureUrl = await savePicture(pictureUrl, userId); // save picture defined above 
    }
    const entryRef = await entriesRef.add(entryData); // add new document  (entry) to a collection  (entry in users )
    console.log('saved:', entryRef.id);
    history.goBack(); //send the user to the home page 
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Add Entry</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Date</IonLabel>
          <IonDatetime value={date}
            onIonChange={(event) => setDate(event.detail.value)} 
            // setDate!!!
          />
        </IonItem>

        <IonList>

          <IonItem>
            <IonLabel position="stacked">Title</IonLabel>
            <IonInput value={title}
              onIonChange={(event) => setTitle(event.detail.value)}
            />
          </IonItem>

{/* no ion input for the image  */}
{/* pictureURL: where to load the picture from */}
{/* file input ref -> manipulate that element */}
{/* second onclick: ()=> fileInputRef.current.click() */}
{/* so click on image = click on "choose an image text" */}
          <IonItem>
            <IonLabel position="stacked">Picture</IonLabel><br />
            <input type="file" accept="image/*" hidden ref={fileInputRef}
              onChange={handleFileChange}
            />
            <img src={pictureUrl} alt="" style={{ cursor: 'pointer' }}
              onClick={handlePictureClick}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Description</IonLabel>
            <IonTextarea value={description}
              onIonChange={(event) => setDescription(event.detail.value)}
            />
          </IonItem>

        </IonList>

        <IonButton expand="block" onClick={handleSave}>Save</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default AddEntryPage;
