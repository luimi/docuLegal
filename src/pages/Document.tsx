import { IonBackButton, IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonFabList, IonFooter, IonIcon, IonPage, IonTitle, IonToolbar, useIonAlert, useIonRouter } from '@ionic/react';
import React, { FC, useEffect, useRef } from 'react'
import { RouteComponentProps } from 'react-router';
import { deleteDocument, getDocumentById } from '../utils/documentsCtrl';
import Markdown from 'react-markdown';
import { generatePDF, generatePDF2 } from '../utils/generatePDF';
import { chevronUp, chevronUpCircle, copyOutline, documentOutline, documents, documentsOutline, download, downloadOutline, trash } from 'ionicons/icons';

interface DocumentProps extends RouteComponentProps<{
  id: string;
}> { }

const Document: FC<DocumentProps> = ({ match }) => {

  const contentRef = useRef<HTMLDivElement>(null);
  const [document, setDocument] = React.useState<any>(null);
  const [presentAlert] = useIonAlert();
  const Router = useIonRouter();
  useEffect(() => {
    if (match.params.id) {
      getDocument();
    }
  }, []);

  const getDocument = async () => {
    const result = await getDocumentById(match.params.id);
    setDocument(result);
  }
  const handleCopyToClipboard = async () => {
    if (contentRef.current) {
      try {
        // Asegúrate de que el contenido HTML esté dentro del div con ref
        const htmlContent = contentRef.current.innerHTML;

        // Escribir en el portapapeles
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([htmlContent], { type: 'text/html' }),
            'text/plain': new Blob([contentRef.current.innerText], { type: 'text/plain' })
          })
        ]);
        alert('HTML copiado al portapapeles');
      } catch (err: any) {
        console.error('Error al copiar HTML:', err);
        alert('Error al copiar HTML: ' + err.message);
      }
    }
  };
  const removeDocument = async () => {
    presentAlert({
          header: '¡Ojo!',
          message: '¿Deseas eliminar este documento?',
          buttons: [
          {
            text: 'No',
            cssClass: 'alert-button-cancel',
            role: 'cancel',
          },
          {
            text: 'Si',
            cssClass: 'alert-button-confirm',
            role: 'confirm',
            handler: async () => {
              await deleteDocument(match.params.id);
              Router.push('/MyDocuments');
            }
          },
        ],
        })
  }
  return (
    <IonPage>
      <IonContent>
        <IonToolbar color="secondary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="#"></IonBackButton>
          </IonButtons>
          <IonTitle>{document && document.title}</IonTitle>
        </IonToolbar>

        <div style={{
          padding: '11.7vw 11.7vw 0 11.7vw',
          backgroundColor: 'white',
          fontSize: '1.945vw',
        }}>
          <div ref={contentRef}>
            <Markdown >{document && document.document}</Markdown>
          </div>
        </div>
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton>
            <IonIcon icon={chevronUp}></IonIcon>
          </IonFabButton>
          <IonFabList side="top">
            <IonFabButton onClick={() => generatePDF2(contentRef, document.title)}>
              <IonIcon icon={downloadOutline}></IonIcon>
            </IonFabButton>
            <IonFabButton onClick={() => handleCopyToClipboard()}>
              <IonIcon icon={documentsOutline}></IonIcon>
            </IonFabButton>
            <IonFabButton color="danger" onClick={removeDocument}>
              <IonIcon icon={trash}></IonIcon>
            </IonFabButton>
          </IonFabList>
        </IonFab>
      </IonContent>
    </IonPage>
  )
}

export default Document;