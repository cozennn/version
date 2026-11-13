import { Create, Datagrid, DateField, Edit, List, NumberField, NumberInput, ReferenceInput, SelectInput, SimpleForm, TextField, TextInput } from "react-admin";

const statusChoices = ["draft","pending","confirmed","in_progress","completed","cancelled"].map(value => ({ id:value, name:value.replace("_"," ") }));
const paymentChoices = ["unpaid","pending","paid","refunded"].map(value => ({ id:value, name:value }));
const currencyChoices = ["EUR","USD","DZD"].map(value => ({ id:value, name:value }));

export function OrderList() {
  return <List perPage={25} sort={{ field:"created_at", order:"DESC" }} filters={[<TextInput source="q" label="Search orders" alwaysOn key="q" />]}>
    <Datagrid rowClick="edit">
      <TextField source="order_number" label="Order" />
      <TextField source="customer_name" label="Customer" />
      <TextField source="product_name" label="Product" />
      <NumberField source="quantity" />
      <NumberField source="total_amount" />
      <TextField source="currency" />
      <TextField source="status" />
      <TextField source="payment_status" label="Payment" />
      <DateField source="created_at" showTime />
    </Datagrid>
  </List>;
}
const OrderFields = () => <>
  <ReferenceInput source="customer_id" reference="customers" perPage={100} sort={{field:"name",order:"ASC"}}>
    <SelectInput optionText="name" fullWidth />
  </ReferenceInput>
  <ReferenceInput source="product_id" reference="products" perPage={100} sort={{field:"name",order:"ASC"}}>
    <SelectInput optionText="name" emptyText="Custom / no catalog product" fullWidth />
  </ReferenceInput>
  <TextInput source="product_name" helperText="Required when no catalog product is selected" fullWidth />
  <NumberInput source="quantity" min={1} defaultValue={1} />
  <NumberInput source="unit_price" min={0} />
  <SelectInput source="currency" choices={currencyChoices} defaultValue="EUR" />
  <SelectInput source="status" choices={statusChoices} defaultValue="pending" />
  <SelectInput source="payment_status" choices={paymentChoices} defaultValue="unpaid" />
  <TextInput source="payment_method" fullWidth />
  <TextInput source="notes" multiline minRows={3} fullWidth />
</>;
export function OrderCreate() {
  return <Create><SimpleForm><OrderFields /></SimpleForm></Create>;
}
export function OrderEdit() {
  return <Edit><SimpleForm><OrderFields /></SimpleForm></Edit>;
}
