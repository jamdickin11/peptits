import {Pool,type PoolClient} from 'pg';
let pool:Pool|undefined;
export function getPool(){if(!process.env.DATABASE_URL)throw Error('Set DATABASE_URL to a persistent PostgreSQL database and run the migrations.');return pool??=new Pool({connectionString:process.env.DATABASE_URL,max:5,idleTimeoutMillis:20000,connectionTimeoutMillis:10000});}
function convertSql(sql:string){let count=0;return sql.replace(/\bwindow\b/g,'"window"').replace(/\?/g,()=>'$'+(++count));}
class Statement{
 readonly sql:string;readonly values:unknown[];
 constructor(sql:string,values:unknown[]=[]){this.sql=sql;this.values=values;}
 bind(...values:unknown[]){return new Statement(this.sql,values);}
 async execute(client?:PoolClient){return (client||getPool()).query(convertSql(this.sql),this.values);}
 async first<T=Record<string,unknown>>():Promise<T|null>{return (await this.execute()).rows[0] as T||null;}
 async all(){return {results:(await this.execute()).rows,success:true};}
 async run(){const result=await this.execute();return {success:true,meta:{changes:result.rowCount||0}};}
}
export const postgresDb={prepare:(sql:string)=>new Statement(sql),async batch(statements:Statement[]){const client=await getPool().connect();try{await client.query('BEGIN');const results=[];for(const s of statements)results.push(await s.execute(client));await client.query('COMMIT');return results;}catch(error){await client.query('ROLLBACK');throw error;}finally{client.release();}}};
