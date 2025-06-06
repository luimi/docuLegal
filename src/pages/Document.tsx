import { IonBackButton, IonButton, IonButtons, IonContent, IonFooter, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { FC, useEffect, useRef } from 'react'
import { RouteComponentProps } from 'react-router';
import { getDocumentById } from '../utils/documentsCtrl';
import Markdown from 'react-markdown';
import { generatePDF } from '../utils/generatePDF';
import { documentOutline } from 'ionicons/icons';

interface DocumentProps extends RouteComponentProps<{
  id: string;
}> { }

const Document: FC<DocumentProps> = ({ match }) => {

  const contentRef = useRef(null);
  const [document, setDocument] = React.useState<any>(null);
  useEffect(() => {
    if (match.params.id) {
      getDocument();
    }
  }, []);

  const getDocument = async () => {
    const result = await getDocumentById(match.params.id);
    console.log(result && result.document)
    setDocument(result);
  }
  return (
    <IonPage>
      <IonContent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="#"></IonBackButton>
          </IonButtons>
          <IonTitle>{document && document.title}</IonTitle>
        </IonToolbar>

        <div ref={contentRef} style={{
          padding: '11.7vw',
          backgroundColor: 'white',
          fontSize: '1.945vw',
        }}>
          <Markdown>{document && document.document}</Markdown>
        </div>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButton expand="block" onClick={() => generatePDF(contentRef, document.title)}>
        Guardar PDF
        <IonIcon slot="end" icon={documentOutline}></IonIcon>
      </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  )
}

export default Document;