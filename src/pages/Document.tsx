import { IonBackButton, IonButton, IonButtons, IonContent, IonFooter, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { FC, useEffect, useRef } from 'react'
import { RouteComponentProps } from 'react-router';
import { getDocumentById } from '../utils/documentsCtrl';
import Markdown from 'react-markdown';
import { generatePDF, generatePDF2 } from '../utils/generatePDF';
import { copyOutline, documentOutline } from 'ionicons/icons';

interface DocumentProps extends RouteComponentProps<{
  id: string;
}> { }

const Document: FC<DocumentProps> = ({ match }) => {

  const contentRef = useRef<HTMLDivElement>(null);
  const [document, setDocument] = React.useState<any>(null);
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
  return (
    <IonPage>
      <IonContent>
        <IonToolbar>
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
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButton expand="block" onClick={() => generatePDF2(contentRef, document.title)}>
            Guardar PDF
            <IonIcon slot="end" icon={documentOutline}></IonIcon>
          </IonButton>
          <IonButton expand="block" onClick={() => handleCopyToClipboard()}>
            Copiar texto
            <IonIcon slot="end" icon={copyOutline}></IonIcon>
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  )
}

export default Document;