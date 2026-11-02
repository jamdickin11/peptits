import {headers} from 'next/headers';
import {isAdmin} from '../../lib/store';
import {Header,Footer} from '../components';
import Admin from './panel';
import Login from './login';
export const dynamic='force-dynamic';
export const runtime='nodejs';
export const metadata={title:'Administration',robots:{index:false,follow:false}};
export default async function AdminPage(){const h=await headers();const allowed=await isAdmin(new Request('https://internal/admin',{headers:h}));return <><Header/>{allowed?<Admin/>:<main className="page-wrap"><div className="article"><span className="eyebrow">PEPTIDELIFE OPERATIONS</span><h1>Administrator access.</h1><p>Sign in with your authorized administrator account.</p><Login/><p className="fine-print">No public registration. Configure the PostgreSQL database, authentication secret and administrator allowlist before use.</p></div></main>}<Footer/></>}
