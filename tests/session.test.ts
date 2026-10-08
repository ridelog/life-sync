import {test} from 'node:test';
import assert from 'node:assert/strict';
test('auth survives reload in the same tab, refreshes expired tokens, and clears on logout',async()=>{
process.env.NEXT_PUBLIC_SUPABASE_URL='https://example.supabase.co';process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY='public-test-key';
const values=new Map<string,string>();Object.defineProperty(globalThis,'sessionStorage',{configurable:true,value:{getItem:(k:string)=>values.get(k)||null,setItem:(k:string,v:string)=>values.set(k,v),removeItem:(k:string)=>values.delete(k)}});
const original=globalThis.fetch;const calls:string[]=[];
globalThis.fetch=async(input:any)=>{calls.push(String(input));if(String(input).includes('/rest/v1/'))return new Response(null,{status:201});if(String(input).endsWith('/logout'))return new Response(null,{status:204});return new Response(JSON.stringify({access_token:'test-token',refresh_token:'test-refresh',expires_in:3600,user:{id:'test-user'}}),{status:200,headers:{'Content-Type':'application/json'}});};
try{const api=await import('../lib/cloud.ts');await api.authenticate('login','test@example.com','test-password');assert.equal(values.size,1);await assert.doesNotReject(api.save('pets',{id:'test-pet',name:'保存確認'} as any));await assert.doesNotReject(api.save('entries',{id:'test-entry',petId:'test-pet',kind:'diary'} as any));assert.equal((await api.restoreSession())?.user.id,'test-user');const key=[...values.keys()][0];const saved=JSON.parse(values.get(key)!);saved.expires_at=1;values.set(key,JSON.stringify(saved));await api.restoreSession();assert.ok(calls.some(x=>x.includes('grant_type=refresh_token')));await api.signout();assert.equal(values.size,0);assert.equal(await api.restoreSession(),null);}finally{globalThis.fetch=original;}
});
