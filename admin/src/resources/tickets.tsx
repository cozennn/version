import { Datagrid, DateField, List, TextField, TextInput } from "react-admin";

export function TicketList() {
  return (
    <List
      filters={[<TextInput source="q" label="Search tickets" alwaysOn key="q" />]}
      perPage={25}
      sort={{ field: "created_at", order: "DESC" }}
    >
      <Datagrid rowClick={false}>
        <TextField source="public_id" label="Ticket ID" />
        <TextField source="user_name" label="Visitor" />
        <TextField source="status" />
        <TextField source="support_mode" label="Support mode" />
        <TextField source="handoff_status" label="Handoff" />
        <DateField source="created_at" showTime />
        <DateField source="closed_at" showTime />
      </Datagrid>
    </List>
  );
}
