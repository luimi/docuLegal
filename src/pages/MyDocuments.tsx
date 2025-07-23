import { IonContent, IonItem, IonLabel, IonList, IonPage, IonIcon, useIonAlert, useIonRouter } from '@ionic/react';
import React, { FC, useEffect } from 'react'
import { deleteDocument, getAllDocuments } from '../utils/documentsCtrl';
import MyDocument from '../components/MyDocument';
import { documentTextOutline } from 'ionicons/icons';

interface MyDocumentsProps {
}

const MyDocuments: FC<MyDocumentsProps> = ({ }) => {
    const [documents, setDocuments] = React.useState<any[]>([]);

    const router = useIonRouter();
    const [presentAlert] = useIonAlert();

    useEffect(() => {
        getMyDocuments()
    }, []);

    const getMyDocuments = async () => {
        const result = await getAllDocuments();
        setDocuments(result);
    }
    const handleDelete = async (id: string) => {
            presentAlert({
                header: 'Eliminar Documento',
                message: '¿Deseas eliminar este documento permanentemente?',
                buttons: [
                    {
                        text: 'No',
                        role: 'cancel',
                    },
                    {
                        text: 'Si',
                        role: 'confirm',
                        handler: () => {
                            deleteDocument(id)
                            getMyDocuments();
                        },
                    },
                ],
            })
        }
    return (
        <IonPage>
            <IonContent>
                <IonItem lines="none" className="ion-text-center">
                    <IonLabel>
                        <h1>Mis Documentos</h1>
                        <p>Todos mis documentos generados</p>
                    </IonLabel>

                </IonItem>
                {documents.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '2rem', color: '#888' }}>
                        <IonIcon icon={documentTextOutline} style={{ fontSize: '64px', color: '#b0b0b0' }} />
                        <p>Crea tu primer documento para verlo aquí.</p>
                    </div>
                ) : (
                    <IonList inset={true}>
                        {documents.map((doc, index) => (
                            <MyDocument key={index} doc={doc} handleDelete={handleDelete}/>
                        ))}
                    </IonList>
                )}
            </IonContent>
        </IonPage>
    )
}
function formatISODateToDDMMYYYY(isoDateString: string) {
  // Crea un objeto Date a partir de la cadena ISO
  const date = new Date(isoDateString);

  // Obtiene el día, mes y año
  const day = String(date.getUTCDate()).padStart(2, '0'); // getUTCDate para evitar problemas de zona horaria
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // getUTCMonth es base 0, por eso se suma 1
  const year = date.getUTCFullYear();

  // Retorna la fecha en el formato deseado
  return `${day}/${month}/${year}`;
}
export default MyDocuments;