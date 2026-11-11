import React from "react";
import ReactDOM from "react-dom/client";
import { Admin, Resource } from "react-admin";
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
import "./theme.css";
ReactDOM.createRoot(document.getElementById("root")!).render(
 <React.StrictMode><Admin title="NORDA" dashboard={Dashboard} dataProvider={dataProvider} authProvider={authProvider} requireAuth>
  <Resource name="products" list={ProductList} create={ProductCreate} edit={ProductEdit}/>
  <Resource name="customers" list={CustomerList} create={CustomerCreate} edit={CustomerEdit}/>
  <Resource name="orders" list={OrderList} create={OrderCreate} edit={OrderEdit}/>
  <Resource name="inquiries" list={InquiryList}/>
  <Resource name="tickets" list={TicketList} show={TicketShow}/>
  <Resource name="activity" list={ActivityList}/>
 </Admin></React.StrictMode>
);