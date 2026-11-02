import {betterAuth} from 'better-auth';
import {nextCookies} from 'better-auth/next-js';
import {getPool} from './postgres.ts';
export function buildAuth(bootstrap=false){
 if(!process.env.BETTER_AUTH_SECRET||process.env.BETTER_AUTH_SECRET.length<32)throw Error('Set BETTER_AUTH_SECRET to a high-entropy secret of at least 32 characters.');
 return betterAuth({database:getPool(),secret:process.env.BETTER_AUTH_SECRET,...(process.env.BETTER_AUTH_URL?{baseURL:process.env.BETTER_AUTH_URL}:{}),emailAndPassword:{enabled:true,disableSignUp:!bootstrap,minPasswordLength:16},session:{expiresIn:28800,updateAge:3600},rateLimit:{enabled:true,storage:'database',window:60,max:10},plugins:bootstrap?[]:[nextCookies()]});
}
let auth:ReturnType<typeof buildAuth>|undefined;
export const getAuth=()=>auth??=buildAuth();
