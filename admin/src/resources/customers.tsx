import { Create, Datagrid, DateField, Edit, EmailField, EmailInput, List, SimpleForm, TextField, TextInput } from "react-admin";

export function CustomerList() {
  return <List perPage={25} sort={{ field: "created_at", order: "DESC" }} filters={[<TextInput source="q" label="Search customers" alwaysOn key="q" />]}>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <EmailField source="email" />
      <TextField source="phone" />
      <TextField source="company" />
      <TextField source="country" />
      <TextField source="source" />
      <DateField source="created_at" showTime />
    </Datagrid>
  </List>;
}
const CustomerFields = () => <>
  <TextInput source="name" required fullWidth />
  <EmailInput source="email" fullWidth />
  <TextInput source="phone" fullWidth />
  <TextInput source="company" fullWidth />
  <TextInput source="country" fullWidth />
  <TextInput source="source" helperText="How this customer found NORDA" fullWidth />
  <TextInput source="notes" multiline minRows={3} fullWidth />
</>;
export function CustomerCreate() {
  return <Create><SimpleForm><CustomerFields /></SimpleForm></Create>;
}
export function CustomerEdit() {
  return <Edit><SimpleForm><CustomerFields /></SimpleForm></Edit>;
}
