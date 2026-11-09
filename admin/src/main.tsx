import React from "react";
import ReactDOM from "react-dom/client";
import { Admin, Resource, ListGuesser } from "react-admin";
import { authProvider } from "./providers/authProvider";
import { dataProvider } from "./providers/dataProvider";
import { ProductList } from "./resources/products";
import "./theme.css";
ReactDOM.createRoot(document.getElementById("root")!).render(
 <React.StrictMode><Admin title="NORDA" dataProvider={dataProvider} authProvider={authProvider} requireAuth>
  <Resource name="products" list={ProductList}/>
  <Resource name="inquiries" list={ListGuesser}/>
  <Resource name="tickets" list={ListGuesser}/>
  <Resource name="activity" list={ListGuesser}/>
 </Admin></React.StrictMode>
);