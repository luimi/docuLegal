import { IonContent, IonItem, IonLabel, IonList, IonPage, useIonRouter } from '@ionic/react';
import React, { FC, useEffect } from 'react'
import { getAllDocuments } from '../utils/documentsCtrl';
import MyDocument from '../components/MyDocument';

interface MyDocumentsProps {
}

const MyDocuments: FC<MyDocumentsProps> = ({ }) => {
    const [documents, setDocuments] = React.useState<any[]>([]);

    const router = useIonRouter();

    useEffect(() => {
        getMyDocuments()
    }, []);

    const getMyDocuments = async () => {
        const result = await getAllDocuments();
        console.log("Mis documentos:", result);
        setDocuments(result);
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
                <IonList inset={true}>
                    {documents.map((doc, index) => (
                        <MyDocument key={index} doc={doc} />
                    ))}
                </IonList>
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