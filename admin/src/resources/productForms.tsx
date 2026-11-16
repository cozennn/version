import { Create, Edit, SimpleForm, TextInput, NumberInput, SelectInput, BooleanInput, required } from "react-admin";
const typeChoices=[{id:"template",name:"Template"},{id:"digital",name:"Digital"}];
const statusChoices=[{id:"draft",name:"Draft — hidden from the public site"},{id:"active",name:"Active"},{id:"inquiry",name:"Inquiry only"},{id:"archived",name:"Archived"}];
function ProductFields(){return <>
 <TextInput source="id" helperText="Stable product ID, e.g. tpl-new" disabled />
 <SelectInput source="type" choices={typeChoices} validate={required()}/>
 <TextInput source="name" validate={required()} fullWidth/>
 <TextInput source="tagline" fullWidth/>
 <NumberInput source="price" min={0} validate={required()}/>
 <SelectInput source="currency" choices={[{id:"USD",name:"USD"},{id:"EUR",name:"EUR"},{id:"DZD",name:"DZD"}]} defaultValue="USD"/>
 <TextInput source="ggsoma_slug" label="GGSoma product slug" helperText="Exact slug from Partner API catalog. Required to enable supplier fulfillment." fullWidth/>
 <TextInput source="category"/>
 <TextInput source="image" fullWidth/>
 <TextInput source="paypal_url" label="PayPal payment link" helperText="Paste the HTTPS PayPal Payment Link created for this product. Leave blank to keep the current manual/contact flow." fullWidth/>
 <TextInput source="tags" helperText="Comma-separated tags" format={v=>Array.isArray(v)?v.join(", "):v} parse={v=>String(v||"").split(",").map(x=>x.trim()).filter(Boolean)}/>
 <TextInput source="description" multiline minRows={4} fullWidth/>
 <TextInput source="includes" helperText="Comma-separated included items" format={v=>Array.isArray(v)?v.join(", "):v} parse={v=>String(v||"").split(",").map(x=>x.trim()).filter(Boolean)}/>
 <BooleanInput source="featured"/>
 <BooleanInput source="subscription"/>
 <SelectInput source="interval" choices={[{id:"month",name:"Monthly"},{id:"year",name:"Yearly"}]}/>
 <SelectInput source="status" choices={statusChoices}/>
 </>;}
export function ProductCreate(){return <Create><SimpleForm><ProductFields/></SimpleForm></Create>;}
export function ProductEdit(){return <Edit><SimpleForm><ProductFields/></SimpleForm></Edit>;}