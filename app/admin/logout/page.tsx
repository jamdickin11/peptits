'use client';
import {authClient} from '../../../lib/auth-client';
export default function Logout(){return <main className="page-wrap"><div className="article"><h1>Sign out.</h1><p>End your administrator session on this browser.</p><button className="button dark" onClick={async()=>{await authClient.signOut();location.assign('/admin')}}>Confirm sign out ↗</button></div></main>}
