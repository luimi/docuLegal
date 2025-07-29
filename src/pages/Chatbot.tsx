import React, { use, useEffect, useRef, useState } from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonFooter,
    IonText,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner,
    IonTextarea,
    IonButtons,
    IonMenuButton,
    useIonAlert,
} from '@ionic/react';
import { document, send, trash } from 'ionicons/icons';
import ChatMessage from '../components/ChatMessage';
import Parse from 'parse';
import { ChatbotCtrl, ChatbotMessage } from '../utils/chatbotCtrl';


const Chatbot: React.FC = () => {
    const chatbotCtrl = new ChatbotCtrl();
    const [messages, setMessages] = useState<ChatbotMessage[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const contentRef = useRef<HTMLIonContentElement>(null);
    const [presentAlert] = useIonAlert();

    useEffect(() => {
        getMessages();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getMessages = async () => {
        setMessages(await chatbotCtrl.readAllMessages());
    }

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;
        setLoading(true);
        const id = crypto.randomUUID();
        const userMessage: ChatbotMessage = {
            id: id,
            text: newMessage,
            role: 'user',
            dateTime: new Date().toISOString(),
            order: messages.length + 1,
            documentId: null,
        };
        setMessages([...messages, userMessage]);
        await chatbotCtrl.createMessage(userMessage);
        setNewMessage('');
        const history = messages.map(msg => ({ text: msg.text, role: msg.role }));
        const result = await Parse.Cloud.run('askChatbot', { question: newMessage, history: history });
        if (result) {
            const botResponse: ChatbotMessage = {
                id: crypto.randomUUID(),
                text: result.answer,
                role: 'model',
                dateTime: new Date().toISOString(),
                documentId: result.documentId || null,
                order: messages.length + 1,
            };
            setMessages((prevMessages) => [...prevMessages, botResponse]);
            await chatbotCtrl.createMessage(botResponse);
        }
        setLoading(false);
    };

    const scrollToBottom = () => {
        if (contentRef.current) {
            contentRef.current.scrollToBottom(300);
        }
    };

    const clearChat = async () => {
        presentAlert({
          header: 'Nuevo chat',
          message: '¿Deseas iniciar un nuevo chat?',
          buttons: [
          {
            text: 'No',
            role: 'cancel',
          },
          {
            text: 'Si',
            role: 'confirm',
            handler: async () => {
              await chatbotCtrl.deleteAllMessages();
              getMessages();
            },
          },
        ],
        })
    }
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Chatbot</IonTitle>
                    <IonButtons slot="end">
                        <IonButton slot="icon-only" onClick={clearChat}>
                            <IonIcon icon={document} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>

            </IonHeader>
            <IonContent ref={contentRef} className="ion-padding background">
                {messages.length === 0 && <IonGrid>
                    <IonRow>
                        <IonCol size='8' offset='2' style={{
                            fontSize: '0.8em',
                            background: 'antiquewhite',
                            borderRadius: '10px',
                            padding: '10px',
                        }}>
                            Chatea con nuestro agente de IA y resuelve tus dudas legales.

                            Limpia el chat cuando necesites cambiar de tema de contrario el chatbot podría estar analizando datos innecesarios.
                        </IonCol>
                    </IonRow>
                </IonGrid>}
                <IonList className="background" onClick={scrollToBottom}>
                    {messages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                    ))}
                </IonList>
            </IonContent>
            <IonFooter>
                <IonToolbar>
                    <IonTextarea
                        value={newMessage}
                        onIonChange={(e) => setNewMessage(e.detail.value!)}
                        placeholder="Escribe un mensaje..."
                        className="ion-padding-start"
                        onKeyDown={(e) => {
                            console.log(e.key);
                            if (e.key === 'Enter') {
                                handleSendMessage();
                            }
                        }}
                        autoGrow={true}
                    />
                    <IonButton slot="end" onClick={handleSendMessage} disabled={loading}>
                        {loading ? <IonSpinner /> : <IonIcon icon={send} />}
                    </IonButton>
                </IonToolbar>
            </IonFooter>
        </IonPage>
    );
};

export default Chatbot;