import type { DataProvider } from "react-admin";
const API=import.meta.env.VITE_API_URL||"https://norda-api.houda2004houdaa.workers.dev";
async function call(path:string,init:RequestInit={}){
 const headers=new Headers(init.headers);headers.set("Accept","application/json");
 const token=localStorage.getItem("norda_admin_token");if(token)headers.set("Authorization","Bearer "+token);
 if(init.body)headers.set("Content-Type","application/json");
 const response=await fetch(API+path,{...init,headers});
 if(response.status===401){localStorage.removeItem("norda_admin_token");window.location.reload();}
 const payload=await response.json().catch(()=>({}));
 if(!response.ok)throw Object.assign(new Error(payload.error||"Request failed"),{status:response.status});
 return payload;
}
export const dataProvider:DataProvider={
 async getList(resource,params){const pagination=params.pagination||{page:1,perPage:25};const sort=params.sort||{field:"created_at",order:"DESC"};const q=new URLSearchParams({page:String(pagination.page),perPage:String(pagination.perPage),sort:String(sort.field),order:String(sort.order)});if(params.filter?.q)q.set("q",String(params.filter.q));return call("/admin/"+resource+"?"+q).then(x=>({data:x.data||[],total:x.total||0}));},
 async getOne(resource,params){const x=await call("/admin/"+resource+"/"+encodeURIComponent(String(params.id)));return{data:x.data||x};},
 async getMany(resource,params){const q=new URLSearchParams({ids:params.ids.join(",")});const x=await call("/admin/"+resource+"?"+q);return{data:x.data||[]};},
 async getManyReference(resource,params){const pagination=params.pagination||{page:1,perPage:25};const q=new URLSearchParams({page:String(pagination.page),perPage:String(pagination.perPage),[params.target]:String(params.id)});const x=await call("/admin/"+resource+"?"+q);return{data:x.data||[],total:x.total||0};},
 async create(resource,params){const x=await call("/admin/"+resource,{method:"POST",body:JSON.stringify(params.data)});return{data:x.data||x};},
 async update(resource,params){const x=await call("/admin/"+resource+"/"+encodeURIComponent(String(params.id)),{method:"POST",body:JSON.stringify(params.data)});return{data:x.data||x};},
 async updateMany(resource,params){await Promise.all(params.ids.map(id=>call("/admin/"+resource+"/"+encodeURIComponent(String(id)),{method:"POST",body:JSON.stringify(params.data)})));return{data:params.ids};},
 async delete(resource,params){const x=await call("/admin/"+resource+"/"+encodeURIComponent(String(params.id))+"/delete",{method:"POST",body:"{}"});return{data:x.data||{id:params.id}};},
 async deleteMany(resource,params){await Promise.all(params.ids.map(id=>call("/admin/"+resource+"/"+encodeURIComponent(String(id))+"/delete",{method:"POST",body:"{}"})));return{data:params.ids};}
};