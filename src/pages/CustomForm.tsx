import { IonBackButton, IonButton, IonButtons, IonContent, IonDatetime, IonDatetimeButton, IonInput, IonItem, IonList, IonModal, IonPage, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import React, { FC, useCallback, useEffect } from 'react'
import { RouteComponentProps } from 'react-router';
import GenericForm from '../components/GenericForm';
import type { Field } from '../components/GenericForm';
import Parse from 'parse';
import { extractMarkdownContent, insertDocument } from '../utils/documentsCtrl';
import 'survey-core/survey-core.css';
import { Survey } from 'survey-react-ui';
import { Model } from 'survey-core';

interface CustomFormProps extends RouteComponentProps<{
    id: string;
}> { }

// Import the Field type from the GenericForm component


const sampleForm: Field[] = [
    {
        type: 'text',
        label: 'Nombre completo',
        name: 'name',
        placeholder: 'Ingrese su nombre',
        required: true
    },
    {
        type: 'email',
        label: 'Correo electrónico',
        name: 'email',
        placeholder: 'Ingrese su correo electrónico',
        required: true
    },
    {
        type: 'select',
        label: 'Categoría',
        name: 'category',
        options: [
            { value: 'option1', label: 'Opción 1' },
            { value: 'option2', label: 'Opción 2' },
            { value: 'option3', label: 'Opción 3' }
        ],
        required: true
    },
    {
        type: 'textarea',
        label: 'Descripción',
        name: 'description',
        placeholder: 'Ingrese una descripción',
        required: false
    },
    {
        type: 'date',
        label: 'Fecha',
        name: 'date',
        required: true
    },
    {
        type: 'checkbox',
        label: 'Acepto los términos y condiciones',
        name: 'terms',
        required: true
    },
    {
        type: 'number',
        label: 'Cantidad',
        name: 'quantity',
        placeholder: 'Ingrese una cantidad',
    }
]

const sampleModel: any = {
    pages: [{
        name: "Name",
        elements: [{
            name: "FirstName",
            title: "Enter your first name:",
            type: "text"
        }, {
            name: "LastName",
            title: "Enter your last name:",
            type: "text"
        }]
    }]
}

const CustomForm: FC<CustomFormProps> = ({ match }) => {
    const router = useIonRouter();
    const [title, setTitle] = React.useState<string>('Custom Form');
    const [survey, setSurvey] = React.useState<any>(null);
    useEffect(() => {
        if (match.params.id) {
            getForm();
        }
    }, []);
    const surveyComplete = useCallback((survey: Model) => {
        Parse.Cloud.run('getDocument', { id: match.params.id, answers: survey.data })
            .then((result) => {
                const document = extractMarkdownContent(result)
                if (document) {
                    const id = crypto.randomUUID()
                    insertDocument({
                        date: new Date().toISOString(),
                        title: title,
                        id: id,
                        document: document
                    })
                    router.push(`/document/${id}`);
                }
            })
        //setResult(JSON.stringify(survey.data));
    }, []);
    const getForm = async () => {
        let result = await new Parse.Query('Document').get(match.params.id);
        setTitle(result.get('title'));
        const survey = new Model(result.get('model') || {});
        survey.onComplete.add(surveyComplete);
        setSurvey(survey);
    }

    return (
        <IonPage>
            <IonContent>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/"></IonBackButton>
                    </IonButtons>
                    <IonTitle>{title}</IonTitle>
                </IonToolbar>
                <div className=''>
                    {survey && <Survey model={survey} />}
                </div>

            </IonContent>
        </IonPage>
    )
}

export default CustomForm;