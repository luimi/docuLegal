import { IonBackButton, IonButtons, IonContent, IonPage, IonSpinner, IonTitle, IonToolbar, useIonLoading, useIonRouter } from '@ionic/react';
import React, { FC, useCallback, useEffect } from 'react'
import { RouteComponentProps } from 'react-router';
import Parse from 'parse';
import { extractMarkdownContent, insertDocument } from '../utils/documentsCtrl';
import 'survey-core/survey-core.css';
import { Survey } from 'survey-react-ui';
import { Model } from 'survey-core';

interface CustomFormProps extends RouteComponentProps<{
    id: string;
}> { }


const CustomForm: FC<CustomFormProps> = ({ match }) => {
    const router = useIonRouter();
    const [survey, setSurvey] = React.useState<any>(null);
    const [form, setForm] = React.useState<any>();
    const [present, dismiss] = useIonLoading();
    useEffect(() => {
        if (match.params.id && !form) {
            getForm();
        }
    }, []);
    const getDocument = async (survey: any, form: any) => {
        present({ message: "Generando documento..." })
        const result = await Parse.Cloud.run('getDocument', { id: match.params.id, answers: survey.data })
        dismiss();
        const document = extractMarkdownContent(result)
        if (document) {
            const id = crypto.randomUUID()
            insertDocument({
                date: new Date().toISOString(),
                title: form.get('title') || 'Documento sin titulo',
                id: id,
                document: document
            })
            router.push(`/document/${id}`);
        }
    }
    const getForm = async () => {
        let result = await new Parse.Query('Document').get(match.params.id);
        if (!result) {
            alert('Documento no encontrado');
            router.push('/documents');
            return;
        }
        setForm(result);
        const survey = new Model(result.get('model') || {});
        survey.onComplete.add((sv) => {
            getDocument(sv, result);
        });
        setSurvey(survey);
    }

    return (
        <IonPage>
            <IonContent>
                <IonToolbar color="secondary">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/"></IonBackButton>
                    </IonButtons>
                    <IonTitle>{form ? form.get('title') : "Cargando..."}</IonTitle>
                </IonToolbar>
                <div>
                    {survey && <Survey model={survey} />}
                    {!survey && <div style={{
                        textAlign: 'center',
                        marginTop: '50px',
                    }}><IonSpinner></IonSpinner></div>}
                </div>

            </IonContent>
        </IonPage>
    )
}

export default CustomForm;