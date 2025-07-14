import { IonAvatar, IonChip, IonIcon, IonItem, IonLabel, IonNote, IonThumbnail, useIonRouter } from '@ionic/react';
import { chevronForward, documentText, documentTextOutline } from 'ionicons/icons';
import React, { FC } from 'react'

interface DocumentProps {
    doc: any;
}
const types: any = {
    'free': "Gratis",
    'paid': "Pago",
}
const Document: FC<DocumentProps> = ({ doc }) => {
    const router = useIonRouter();
    return (
        <IonItem className="document" onClick={() => router.push(`/custom-form/${doc.id}`)} detail={true}>
            <IonThumbnail slot="start">
                <IonIcon aria-hidden="true" icon={documentTextOutline} color='primary'></IonIcon>
            </IonThumbnail>
            <IonLabel>
                <h2 className='ion-text-wrap'>{doc.get('title')}</h2>
                <small><IonChip color="tertiary">{doc.get('category').get('name')}</IonChip></small>
            </IonLabel>
            <div className="metadata-end-wrapper" slot="end">
              <IonNote color="medium">{types[doc.get('type')|| "free"]}</IonNote>
            </div>
        </IonItem>
    )
}

export default Document;