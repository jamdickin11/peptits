import {money} from './catalog';
export type NotificationOrder={id:string;created:string;status:string;method:string;total:number;demo:number;data:string};
export function formatTelegramOrder(order:NotificationOrder,includeDetails:boolean){
 const d=JSON.parse(order.data),c=d.customer;
 const fields=[order.demo?'PEPTIDELIFE — PREVIEW ORDER (NO PAYMENT)':'PEPTIDELIFE — NEW ORDER',`Order: ${order.id}`,`Created: ${order.created}`,`Status: ${order.status.toUpperCase()} — ${order.status==='paid'?'payment verified':'not proof of payment'}`,`Payment method: ${order.method}`,'',...d.items.map((i:{name:string;size:number;qty:number;price:number})=>`${i.name} · ${i.size} mg × ${i.qty}: ${money(i.price*i.qty)}`),'',`Subtotal: ${money(d.subtotal)}`,`Shipping: ${money(d.shipping)}`,`Tax: ${money(d.tax)}`,`Total: ${money(order.total)}`];
 if(includeDetails)fields.push('','CUSTOMER & DELIVERY',`Name: ${c.name}`,`Email: ${c.email}`,`Institution: ${c.institution}`,`Address: ${c.address}`,`City: ${c.city}`,`Region: ${c.region||'—'}`,`Postal code: ${c.postal}`,`Country: ${c.country}`);
 else fields.push(`Destination country: ${c.country}`);
 fields.push('','Manage this order in the protected Peptidelife admin dashboard.');
 return fields.join('\n').slice(0,4000);
}
