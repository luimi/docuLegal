import { IonCard, IonCardContent, IonChip, IonIcon, IonItem, IonLabel, IonText, useIonRouter } from '@ionic/react';
import { documentText, lockClosed, lockOpen } from 'ionicons/icons';
import React, { FC, useEffect } from 'react';
import Parse from 'parse';
import "./styles/ChatMessage.css";

interface ChatMessageProps {
    message: any;
}

const ChatMessage: FC<ChatMessageProps> = ({ message }) => {
    const [document, setDocument] = React.useState<any>(null);
    const router = useIonRouter();
    useEffect(() => {
        if(message.documentId) {
            getDocument();
        }
    }, [])

    const getDocument = async () => {
        const document = await new Parse.Query('Document').include("category").get(message.documentId);
        if(document) setDocument(document);
    }
    return (
        <div>
            <div className={message.role === 'user' ? 'ion-text-end' : 'ion-text-start'}>
                <IonLabel className={message.role === 'user' ? 'ion-text-right' : 'ion-text-left'}>
                    <IonText className={`chat-message ${message.role}`} color={message.role === 'user' ? 'secondary' : 'dark'}>
                        <p>
                            {message.text}
                        </p>
                        <br/>
                        <small>{message.dateTime}</small>
                    </IonText>
                </IonLabel>
            </div>
            {document && <IonCard className='ion-no-padding ion-margin-horizontal' onClick={() => router.push(`/custom-form/${document.id}`)}>
                <IonCardContent className='ion-no-padding'>
                    <IonItem lines="none">
                        <IonIcon icon={documentText} slot="start" color="primary" />
                        <IonLabel>
                            <p>{document.get('title')}</p>
                        </IonLabel>
                        <IonIcon icon={document.get('type') === "free" ? lockOpen : lockClosed} slot="end" color="medium" />
                    </IonItem>
                </IonCardContent>
            </IonCard>}
        </div>
    )
}

export default ChatMessage;