import { IonCard, IonCol, IonContent, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonPage, IonRow, IonSearchbar, useIonRouter } from '@ionic/react';
import React, { FC, useEffect } from 'react'
import Parse from 'parse';
import { document, documentText } from 'ionicons/icons';
import Document from '../components/Document';

interface DocumentsProps {

}

const Documents: FC<DocumentsProps> = ({ }) => {
    const [documents, setDocuments] = React.useState<any[]>([]);
    const [filter, setFilter] = React.useState('');
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
            <IonContent className='ion-padding'>
                <IonItem lines="none" className="ion-text-center">
                    <IonLabel>
                        <h1>Documentos</h1>
                        <p>Genera documentos ingresando algunos datos necesarios.</p>
                    </IonLabel>
                </IonItem>
                <IonSearchbar placeholder='Filtrar' onIonInput={(e) => setFilter(e.target.value || "")}></IonSearchbar>
                <IonList inset={true}>
                    {documents.filter((doc) => doc.get('title').toLowerCase().includes(filter.toLowerCase()) || doc.get('category').get('name').toLowerCase().includes(filter.toLowerCase())).map((doc, index) => (
                        <Document key={index} doc={doc} />
/*<IonItem key={index} onClick={() => router.push(`/custom-form/${doc.id}`)} detail={true}>
                            <IonIcon aria-hidden="true" icon={documentText} slot="start"></IonIcon>
                            <IonLabel>
                                <h2>{doc.get('title')}</h2>
                                <p>{doc.get('category').get('name')}</p>
                            </IonLabel>
                        </IonItem>*/
                    ))}
                </IonList>
            </IonContent>
        </IonPage>
    )
}

export default Documents;