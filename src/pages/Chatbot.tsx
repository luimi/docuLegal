import React, { use, useEffect, useState } from 'react';
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
} from '@ionic/react';
import { send } from 'ionicons/icons';
import ChatMessage from '../components/ChatMessage';
import Parse from 'parse';
import { ChatbotCtrl, ChatbotMessage } from '../utils/chatbotCtrl';


const Chatbot: React.FC = () => {
    const chatbotCtrl = new ChatbotCtrl();
    const [messages, setMessages] = useState<ChatbotMessage[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        getMessages()
    }, []);

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

    return (
        <IonPage>
            <IonContent className="ion-padding background">
                {messages.length === 0 && <IonGrid>
                    <IonRow>
                        <IonCol size='8' offset='2' style={{
                            fontSize: '0.8em',
                            background: 'antiquewhite',
                            borderRadius: '10px',
                            padding: '10px',
                        }}>
                            Nuestro chatbot legal, diseñado con la precisión de un experto en jurisprudencia, está aquí para ser tu guía inicial. Obtén respuestas claras y rápidas a tus dudas, comprende términos complejos y visualiza los próximos pasos a seguir, todo sin demoras ni costes iniciales. Es tu primer paso hacia la claridad legal y el empoderamiento a través del conocimiento. Consulta a nuestro chatbot hoy mismo y empieza a tomar decisiones más informadas.
                        </IonCol>
                    </IonRow>
                </IonGrid>}
                <IonList className="background">
                    {messages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                    ))}
                </IonList>
            </IonContent>
            <IonFooter>
                <IonToolbar>
                    <IonInput
                        value={newMessage}
                        onIonChange={(e) => setNewMessage(e.detail.value!)}
                        placeholder="Escribe un mensaje..."
                        className="ion-padding-start"
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