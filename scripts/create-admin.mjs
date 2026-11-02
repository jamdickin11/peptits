import {buildAuth} from '../lib/auth.ts';
import {getPool} from '../lib/postgres.ts';
const email=process.env.ADMIN_SETUP_EMAIL?.toLowerCase(),password=process.env.ADMIN_SETUP_PASSWORD;
if(!email||!password||password.length<16)throw Error('Set ADMIN_SETUP_EMAIL and ADMIN_SETUP_PASSWORD (16+ characters) in the local secret environment.');
if(!(process.env.ADMIN_EMAILS||'').toLowerCase().split(',').map(x=>x.trim()).includes(email))throw Error('The setup email must also be listed in ADMIN_EMAILS.');
try{await buildAuth(true).api.signUpEmail({body:{email,password,name:'Peptidelife Administrator'}});console.log('Administrator created. Public sign-up remains disabled. Remove ADMIN_SETUP_PASSWORD after setup.');}finally{await getPool().end();}
