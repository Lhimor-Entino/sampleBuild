import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip"
import { configureStore } from '@reduxjs/toolkit';
import requestReducer from './reducers/requestReducer.tsx';
import { Provider } from "react-redux";
import { Toaster } from 'sonner'
import { Toaster as ShadcnToaster } from "@/components/ui/toaster"
import { ThemeProvider } from './MyComponents/Theme/ThemeProvider.tsx';
import themeReducer from './reducers/themeReducer.tsx';

const store = configureStore({
  reducer: {
    request_reducer: requestReducer,
    theme_reducer :themeReducer
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>

      <BrowserRouter basename="ddcIntelligence_v1">
        <ThemeProvider  defaultTheme="dark" storageKey="vite-ui-theme">
          <TooltipProvider >

            <App />

            <ShadcnToaster />
            <Toaster richColors theme='light' closeButton duration={2323} position='top-center' />
          </TooltipProvider>
        </ThemeProvider>

      </BrowserRouter>

    </Provider>
  </React.StrictMode>,
)
