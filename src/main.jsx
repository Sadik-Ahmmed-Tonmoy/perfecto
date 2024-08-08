import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { router } from "./Routes/Routes.jsx";
import "./index.css";
import AuthProvider from "./providers/AuthProvider.jsx";
import LogicProvider from "./providers/LogicProvider.jsx";
import { persistor, store } from "./redux/store.js";
import "./scss/styles.scss";

axios.defaults.baseURL = "https://app.perfectoblog.com/api/";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
    // <React.StrictMode>
    <AuthProvider>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <LogicProvider>
                    <QueryClientProvider client={queryClient}>
                        <RouterProvider router={router}/>
                    </QueryClientProvider>
                </LogicProvider>
            </PersistGate>
        </Provider>
        {/* <Toaster /> */}
    </AuthProvider>
    // </React.StrictMode>
);
