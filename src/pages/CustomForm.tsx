import { IonBackButton, IonButton, IonButtons, IonContent, IonDatetime, IonDatetimeButton, IonInput, IonItem, IonList, IonModal, IonPage, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import React, { FC, useEffect } from 'react'
import { RouteComponentProps } from 'react-router';
import GenericForm from '../components/GenericForm';
import type { Field } from '../components/GenericForm';
import Parse from 'parse';
import { extractMarkdownContent, insertDocument } from '../utils/documentsCtrl';

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


const CustomForm: FC<CustomFormProps> = ({ match }) => {
    const router = useIonRouter();
    const [data, setData] = React.useState<any>({});
    const [form, setForm] = React.useState<Field[]>([]);
    const [title, setTitle] = React.useState<string>('Custom Form');
    useEffect(() => {
        if (match.params.id) {
            getForm();
        }
    }, []);
    const getForm = async () => {
        let result = await new Parse.Query('Document').get(match.params.id);
        setTitle(result.get('title'));
        setForm(result.get('form'));
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
                <div className='ion-padding'>
                    <GenericForm fields={form} onSubmit={(data) => {
                        Parse.Cloud.run('getDocument', { id: match.params.id, answers: data })
                        .then((result) => {
                            const document = extractMarkdownContent(result)
                            if(document) {
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
                }}/>
                </div>
                
            </IonContent>
        </IonPage>
    )
}

export default CustomForm;