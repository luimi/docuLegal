import { IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonThumbnail, useIonAlert, useIonRouter } from '@ionic/react';
import { documentTextOutline, pencil, trash } from 'ionicons/icons';
import React, { FC } from 'react'
import { deleteDocument } from '../utils/documentsCtrl';

interface MyDocumentProps {
    doc: any;
    handleDelete: (id: string) => void;
}

const MyDocument: FC<MyDocumentProps> = ({ doc, handleDelete }) => {
    const router = useIonRouter();
    
    
    return (
        <IonItemSliding>
            <IonItem className="document" detail={true} onClick={() => router.push(`/document/${doc.id}`)}>
                <IonThumbnail slot="start">
                    <IonIcon aria-hidden="true" icon={documentTextOutline} color='primary'></IonIcon>
                </IonThumbnail>
                <IonLabel>
                    <h3>{doc.title}</h3>
                    <p>{formatISODateToDDMMYYYY(doc.date)}</p>
                </IonLabel>
            </IonItem>

            <IonItemOptions>
                {doc.documentId && <IonItemOption color="warning" onClick={() => router.push(`/custom-form/${doc.documentId}/${doc.id}`)}>
                    <IonIcon icon={pencil} size='large'/>
                </IonItemOption>}
                <IonItemOption color="danger" onClick={() => handleDelete(doc.id)}>
                    <IonIcon icon={trash} size='large'/>
                </IonItemOption>
            </IonItemOptions>
        </IonItemSliding>

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
export default MyDocument;