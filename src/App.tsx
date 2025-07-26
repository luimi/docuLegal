import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { chatbubbleOutline, documentsOutline, documentTextOutline, ellipse, square, triangle } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
//import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

import Parse from 'parse';
import Documents from './pages/Documents';
import CustomForm from './pages/CustomForm';
import MyDocuments from './pages/MyDocuments';
import Document from './pages/Document';
import Chatbot from './pages/Chatbot';

setupIonicReact();

const App: React.FC = () => {

  Parse.serverURL = 'https://parseapi.back4app.com';
  Parse.initialize("JvLpbkiOzeFTYYl6psiy0oAjTh6T5Itfot64poVI", "nMaS1jEKRWlxgTv7WYaJzfVdz9AePB3tv59hpzEz");
  return <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/documents">
            <Documents />
          </Route>
          <Route exact path="/myDocuments">
            <MyDocuments />
          </Route>
          <Route exact path="/chatBot">
            <Chatbot />
          </Route>
          <Route exact path="/">
            <Redirect to="/documents" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom" color="secondary">
          <IonTabButton tab="documents" href="/documents">
            <IonIcon aria-hidden="true" icon={documentTextOutline} />
            <IonLabel>Documentos</IonLabel>
          </IonTabButton>
          <IonTabButton tab="myDocuments" href="/myDocuments">
            <IonIcon aria-hidden="true" icon={documentsOutline} />
            <IonLabel>Mis Documentos</IonLabel>
          </IonTabButton>
          <IonTabButton tab="chatBot" href="/chatBot">
            <IonIcon aria-hidden="true" icon={chatbubbleOutline} />
            <IonLabel>ChatBot</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
      <Route path="/custom-form/:id" component={CustomForm} exact={true}>
      </Route>
      <Route path="/custom-form/:id/:document" component={CustomForm} exact={true}>
      </Route>
      <Route path="/document/:id" component={Document} exact={true}>
      </Route>
    </IonReactRouter>
  </IonApp>
};

export default App;
