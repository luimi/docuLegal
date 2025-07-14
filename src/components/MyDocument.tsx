import { IonIcon, IonItem, IonLabel, IonThumbnail, useIonRouter } from '@ionic/react';
import { documentTextOutline } from 'ionicons/icons';
import React, { FC } from 'react'

interface MyDocumentProps {
    doc: any;
}

const MyDocument: FC<MyDocumentProps> = ({ doc }) => {
    const router = useIonRouter();
    return (
        <IonItem className="document" detail={true} onClick={() => router.push(`/document/${doc.id}`)}>
            <IonThumbnail slot="start">
                <IonIcon aria-hidden="true" icon={documentTextOutline} color='primary'></IonIcon>
            </IonThumbnail>
            <IonLabel>
                <h3>{doc.title}</h3>
                <p>{formatISODateToDDMMYYYY(doc.date)}</p>
            </IonLabel>
        </IonItem>
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