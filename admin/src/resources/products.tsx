import { Datagrid, EditButton, List, NumberField, TextField, TextInput, BooleanField, TopToolbar, CreateButton, ExportButton } from "react-admin";

function ProductListActions() {
  return <TopToolbar><CreateButton /><ExportButton /></TopToolbar>;
}

export function ProductList() {
  return (
    <List
      actions={<ProductListActions />}
      filters={[<TextInput source="q" label="Search products" alwaysOn key="q" />]}
      perPage={25}
      sort={{ field: "updated_at", order: "DESC" }}
    >
      <Datagrid rowClick={false}>
        <TextField source="id" />
        <TextField source="name" />
        <TextField source="type" />
        <NumberField source="price" />
        <TextField source="category" />
        <BooleanField source="featured" />
        <TextField source="status" />
        <EditButton />
      </Datagrid>
    </List>
  );
}
