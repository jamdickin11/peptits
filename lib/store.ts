import {postgresDb} from './postgres';
import {getAuth} from './auth';
const env=process.env;
import {catalog,Product} from './catalog';
export const settings=()=>env as unknown as Record<string,string>;
export const db=()=>postgresDb;
export async function getProducts():Promise<Product[]> {const result=await db().prepare('SELECT * FROM products').all();const rows=result.results as {id:string,data:string,stock:number}[];return catalog.map(p=>{const row=rows.find(r=>r.id===p.id);return row?{...p,...JSON.parse(row.data),stock:row.stock}:p})}
export async function isAdmin(request:Request){if(!env.DATABASE_URL||!env.BETTER_AUTH_SECRET)return false;const session=await getAuth().api.getSession({headers:request.headers});if(!session?.user?.email)return false;return (env.ADMIN_EMAILS||'').toLowerCase().split(',').map(s=>s.trim()).includes(session.user.email.toLowerCase());}
export function sameOrigin(r:Request){return r.headers.get('origin')===new URL(r.url).origin;}
export const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export function paymentConfig(){const s=settings();return {live:s.LIVE_COMMERCE==='1',card:!!(s.HYPERSWITCH_URL&&s.HYPERSWITCH_API_KEY),crypto:!!((s.BITCART_URL&&s.BITCART_STORE_ID&&s.BITCART_TOKEN&&s.BITCART_CHECKOUT_URL)||(s.BTCPAY_URL&&s.BTCPAY_API_KEY&&s.BTCPAY_STORE_ID)),cryptoProvider:s.BITCART_URL?'Bitcart':'BTCPay'}}
export type CountryRule={code:string;name:string;products:string[];reference:string;reviewed:string;expires:string};
export type CommerceConfig={countries:CountryRule[];shipping:number;freeShipping:number;taxBps:number;taxLabel:string;policiesReady:boolean;taxReady:boolean};
export async function getConfig():Promise<CommerceConfig>{const r=await db().prepare('SELECT data FROM configuration WHERE id=?').bind('commerce').first<{data:string}>();return r?JSON.parse(r.data):{countries:[],shipping:1200,freeShipping:15000,taxBps:0,taxLabel:'Tax not configured',policiesReady:false,taxReady:false};}
export async function providerFetch(url:string,options:RequestInit){if(!url.startsWith('https://'))throw Error('Payment server must use HTTPS');const response=await fetch(url,{...options,signal:AbortSignal.timeout(15000),redirect:'manual'});if(response.status>=300&&response.status<400)throw Error('Unexpected payment or API redirect rejected');return response;}
