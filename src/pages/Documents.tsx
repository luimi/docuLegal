import { IonCard, IonCol, IonContent, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonPage, IonRow, useIonRouter } from '@ionic/react';
import React, { FC, useEffect } from 'react'
import Parse from 'parse';
import { document, documentText } from 'ionicons/icons';

interface DocumentsProps {

}

const Documents: FC<DocumentsProps> = ({ }) => {
    const [documents, setDocuments] = React.useState<any[]>([]);
    const router = useIonRouter();
    useEffect(() => {
        getDocuments()
    }, []);
    const getDocuments = async () => {
        const result = await new Parse.Query('Document').include('category').find();
        setDocuments(result);
    }
    return (
        <IonPage>
            <IonContent>
                <IonItem lines="none" className="ion-text-center">
                    <IonLabel>
                        <h1>Documentos</h1>
                        <p>Genera documentos ingresando algunos datos necesarios.</p>
                    </IonLabel>

                </IonItem>
                <IonList inset={true}>
                    {documents.map((doc, index) => (
                        <IonItem key={index} onClick={() => router.push(`/custom-form/${doc.id}`)} detail={true}>
                            <IonIcon aria-hidden="true" icon={documentText} slot="start"></IonIcon>
                            <IonLabel>
                                <h2>{doc.get('title')}</h2>
                                <p>{doc.get('category').get('name')}</p>
                            </IonLabel>
                        </IonItem>
                    ))}
                </IonList>
            </IonContent>
        </IonPage>
    )
}

export default Documents;