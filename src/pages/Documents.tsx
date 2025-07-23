import { IonCard, IonCol, IonContent, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonPage, IonRow, IonSearchbar, IonSkeletonText, IonThumbnail, useIonRouter } from '@ionic/react';
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
                {documents.length === 0 ? (
                    <IonList className="ion-no-margin ion-text-center">
                        {[1, 2, 3, 4, 5, 6].map((_, index) => <IonItem key={index}>
                            <IonThumbnail slot="start">
                                <IonSkeletonText animated={true}></IonSkeletonText>
                            </IonThumbnail>
                            <IonLabel>
                                <h3>
                                    <IonSkeletonText animated={true} style={{ width: '80%' }}></IonSkeletonText>
                                </h3>
                                <p>
                                    <IonSkeletonText animated={true} style={{ width: '30%' }}></IonSkeletonText>
                                </p>
                            </IonLabel>
                        </IonItem>)}
                    </IonList>
                ) : null}
                <IonList className="ion-no-margin">
                    {documents.filter((doc) => doc.get('title').toLowerCase().includes(filter.toLowerCase()) || doc.get('category').get('name').toLowerCase().includes(filter.toLowerCase())).map((doc, index) => (
                        <Document key={index} doc={doc} />
                    ))}
                </IonList>
            </IonContent>
        </IonPage>
    )
}

export default Documents;