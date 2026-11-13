import React from "react";
import ReactDOM from "react-dom/client";
import { Admin, Resource } from "react-admin";
import { createTheme } from "@mui/material/styles";
import { authProvider } from "./providers/authProvider";
import { dataProvider } from "./providers/dataProvider";
import { ProductList } from "./resources/products";
import { ProductCreate, ProductEdit } from "./resources/productForms";
import { InquiryList } from "./resources/inquiries";
import { TicketList, TicketShow } from "./resources/tickets";
import { ActivityList } from "./resources/activity";
import { CustomerCreate, CustomerEdit, CustomerList } from "./resources/customers";
import { OrderCreate, OrderEdit, OrderList } from "./resources/orders";
import { Dashboard } from "./pages/Dashboard";
import { AIAssistantPage } from "./pages/AIAssistant";
import { AnalyticsPage } from "./pages/Analytics";
import { SettingsPage } from "./pages/Settings";
import "./theme.css";

const nordaTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#5a46d6", light: "#e3dcff", dark: "#4432b5", contrastText: "#fbfaff" },
    secondary: { main: "#1a1730" },
    background: { default: "#ecebf2", paper: "#fcfcfe" },
    text: { primary: "#1a1730", secondary: "#5b5872" },
    divider: "#201a4017",
    success: { main: "#187d58" },
    error: { main: "#c33a52" },
    warning: { main: "#b7791f" },
  },
  typography: {
    fontFamily: '"Manrope", "Tajawal", ui-sans-serif, system-ui, sans-serif',
    h1: { fontWeight: 800, letterSpacing: "-.04em" },
    h2: { fontWeight: 800, letterSpacing: "-.035em" },
    h3: { fontWeight: 800, letterSpacing: "-.03em" },
    h4: { fontWeight: 800, letterSpacing: "-.03em" },
    h5: { fontWeight: 750, letterSpacing: "-.02em" },
    h6: { fontWeight: 750, letterSpacing: "-.02em" },
    button: { fontWeight: 700, textTransform: "none" },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "radial-gradient(60vmax 50vmax at 12% -10%, #e3dcff, transparent 70%), radial-gradient(50vmax 40vmax at 100% 0%, #fde6d6, transparent 70%), #ecebf2",
          backgroundAttachment: "fixed",
          color: "#1a1730",
          WebkitFontSmoothing: "antialiased",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, boxShadow: "none", paddingInline: 18, minHeight: 40 },
        containedPrimary: { boxShadow: "0 12px 24px -14px #5a46d6cc" },
      },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: { borderColor: "#201a4017" },
        rounded: { borderRadius: 18 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 12, backgroundColor: "#fcfcfe" },
        notchedOutline: { borderColor: "#201a402b" },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
 <React.StrictMode><Admin title="NORDA" theme={nordaTheme} dashboard={Dashboard} dataProvider={dataProvider} authProvider={authProvider} requireAuth>
  <Resource name="products" list={ProductList} create={ProductCreate} edit={ProductEdit}/>
  <Resource name="customers" list={CustomerList} create={CustomerCreate} edit={CustomerEdit}/>
  <Resource name="orders" list={OrderList} create={OrderCreate} edit={OrderEdit}/>
  <Resource name="inquiries" list={InquiryList}/>
  <Resource name="tickets" list={TicketList} show={TicketShow}/>
  <Resource name="activity" list={ActivityList}/>
  <Resource name="ai" options={{ label: "AI Assistant" }} list={AIAssistantPage}/>
  <Resource name="analytics" options={{ label: "Analytics" }} list={AnalyticsPage}/>
  <Resource name="settings" options={{ label: "Settings & status" }} list={SettingsPage}/>
 </Admin></React.StrictMode>
);
