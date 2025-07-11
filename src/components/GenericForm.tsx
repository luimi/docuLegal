import React, { useState } from 'react';
import {
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonRadioGroup,
  IonRadio,
  IonButton,
  IonNote,
  IonIcon,
  IonSpinner,
} from '@ionic/react';
import { checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';

interface FieldOption {
  label: string;
  value: string;
}

interface Field {
  type: 'text' | 'number' | 'email' | 'date' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'password' | 'url';
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  options?: FieldOption[];
  extra?: string;
}
export type { Field, FieldOption };
interface GenericFormProps {
  fields: Field[];
  onSubmit: (formData: { [key: string]: any }) => void;
}

const GenericForm: React.FC<GenericFormProps> = ({ fields, onSubmit }) => {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (name: string, value: any) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    fields.forEach((field) => {
      if (field.required) {
        if (
          formData[field.name] === undefined ||
          formData[field.name] === null ||
          String(formData[field.name]).trim() === '' ||
          (field.type === 'checkbox' && !formData[field.name])
        ) {
          newErrors[field.name] = `${field.label} es requerido.`;
          isValid = false;
        }
      }
    });
    setErrors(newErrors);
    console.log('Errores de validación:', newErrors);
    return isValid;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      setLoading(true);
      onSubmit(formData);
    } else {
      console.log('Formulario inválido. Por favor, revisa los campos requeridos.');
    }
  };

  const renderField = (field: Field) => {
    const { type, label, name, placeholder, required, options, extra } = field;
    const value = formData[name];
    const hasError = errors[name];

    switch (type) {
      case 'text':
      case 'number':
      case 'email':
      case 'date':
      case 'password':
      case 'url':
        return (
          <IonItem key={name} lines="none" className={`ion-margin-vertical ${hasError ? 'ion-invalid' : ''}`}>
            <IonInput
              label={label}
              labelPlacement="stacked"
              type={type}
              value={value || ''}
              onIonChange={(e) => handleChange(name, e.detail.value!)}
              placeholder={placeholder}
              required={required}
              errorText={hasError}
              helperText={extra}
            ></IonInput>
            {hasError && <IonIcon slot="end" icon={closeCircleOutline} color="danger" />}
            {!hasError && value && <IonIcon slot="end" icon={checkmarkCircleOutline} color="success" />}
          </IonItem>
        );
      case 'textarea':
        return (
          <IonItem key={name} lines="none" className={`ion-margin-vertical ${hasError ? 'ion-invalid' : ''}`}>
            <IonTextarea
              label={label}
              labelPlacement="stacked"
              value={value || ''}
              onIonChange={(e) => handleChange(name, e.detail.value!)}
              placeholder={placeholder}
              required={required}
              errorText={hasError}
              rows={4}
              helperText={extra}
            ></IonTextarea>
            {hasError && <IonIcon slot="end" icon={closeCircleOutline} color="danger" />}
            {!hasError && value && <IonIcon slot="end" icon={checkmarkCircleOutline} color="success" />}
          </IonItem>
        );
      case 'select':
        return (
          <IonItem key={name} lines="none" className={`ion-margin-vertical ${hasError ? 'ion-invalid' : ''}`}>
            <IonSelect
              label={label}
              labelPlacement="stacked"
              value={value || ''}
              onIonChange={(e) => handleChange(name, e.detail.value!)}
              placeholder={placeholder}
              required={required}
              interface="popover"
              helperText={extra}
            >
              {options?.map((option) => (
                <IonSelectOption key={option.value} value={option.value}>
                  {option.label}
                </IonSelectOption>
              ))}
            </IonSelect>
            {hasError && <IonNote slot="error" color="danger">{hasError}</IonNote>}
            {hasError && <IonIcon slot="end" icon={closeCircleOutline} color="danger" />}
            {!hasError && value && <IonIcon slot="end" icon={checkmarkCircleOutline} color="success" />}
          </IonItem>
        );
      case 'checkbox':
        return (
          <IonItem key={name} lines="none">
            <IonCheckbox
              justify="start"
              checked={!!value}
              onIonChange={(e) => handleChange(name, e.detail.checked)}
              helperText={extra}
            >
              <IonLabel>{label}</IonLabel>
            </IonCheckbox>
            {hasError && <IonNote slot="error" color="danger">{hasError}</IonNote>}
          </IonItem>
        );
      case 'radio':
        return (
          <IonList key={name} className='ion-margin-horizontal'>
            <IonRadioGroup
              value={value || ''}
              onIonChange={(e) => handleChange(name, e.detail.value)}
              helperText={extra}
            >
              <IonLabel>{label}</IonLabel>
              {options?.map((option) => (
                <IonItem key={option.value} lines="none">
                  <IonRadio value={option.value}>{option.label}</IonRadio>
                </IonItem>
              ))}
            </IonRadioGroup>
            {hasError && <IonNote slot="error" color="danger">{hasError}</IonNote>}
          </IonList>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <IonList>
        {fields.map(renderField)}
        <IonButton expand="block" type="submit" disabled={loading}>
          {loading ? <IonSpinner></IonSpinner> : 'Enviar'}
        </IonButton>
      </IonList>
    </form>
  );
};

export default GenericForm;