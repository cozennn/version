import { Datagrid, DateField, List, TextField, TextInput } from "react-admin";

export function ActivityList() {
  return (
    <List
      filters={[<TextInput source="q" label="Search activity" alwaysOn key="q" />]}
      perPage={25}
      sort={{ field: "created_at", order: "DESC" }}
    >
      <Datagrid rowClick={false}>
        <DateField source="created_at" showTime />
        <TextField source="username" />
        <TextField source="action" />
        <TextField source="resource" />
        <TextField source="resource_id" />
      </Datagrid>
    </List>
  );
}
