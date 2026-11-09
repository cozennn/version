import { Datagrid, DateField, List, TextField, TextInput } from "react-admin";

export function InquiryList() {
  return (
    <List
      filters={[<TextInput source="q" label="Search inquiries" alwaysOn key="q" />]}
      perPage={25}
      sort={{ field: "created_at", order: "DESC" }}
    >
      <Datagrid rowClick={false}>
        <TextField source="name" />
        <TextField source="email" />
        <TextField source="subject" />
        <TextField source="message" />
        <DateField source="created_at" showTime />
        <TextField source="delivery_status" />
      </Datagrid>
    </List>
  );
}
