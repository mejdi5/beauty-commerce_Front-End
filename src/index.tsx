import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import { Store, persistor } from "./Redux/Store";
import { PersistGate } from 'redux-persist/integration/react'
import 'bootstrap/dist/css/bootstrap.css';
import App from './App';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={Store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);


