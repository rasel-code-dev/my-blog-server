import errorConsole from "../logger/errorConsole";

const { createClient } = require('redis');
import { MongoClient, Db, Collection, ServerApiVersion } from 'mongodb';

export function redisConnect(){
  return new Promise( async (resolve, reject)=>{

    let client;

    if(process.env.NODE_ENV === "development"){
      client = await createClient();
    } else {
      client = await createClient( {
        url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_ENDPOINT}:${process.env.REDIS_PORT}`
      });
    }

    await client.on('error', (err) => console.log('---------Redis Client Error-----------', err));
    console.log("redis connected...")
    await client.connect();
    resolve(client)

  })
}

export function mongoConnect(collectionName?: string){
  
  const uri = "mongodb+srv://rasel:EducationRY5@cluster0.4ywhd.mongodb.net/dev-story?retryWrites=true&w=majority";
 
  const client = new MongoClient(uri, {
    // @ts-ignore
    useNewUrlParser: true, useUnifiedTopology: true,
    // serverApi: ServerApiVersion.v1
  });
  return new Promise<{c?: Collection, client: MongoClient, db: Db}>(async (resolve, reject)=>{
    
      try {
        // Connect the client to the server
        await client.connect();
        
        let db = await client.db("dev-story")
        // perform actions on the collection object
        console.log("Connected successfully to server");
        
        if(collectionName){
            let c = await db.collection(collectionName)
            resolve({c: c, client, db: db})
          } else {
            resolve({db: db, client})
          }
      } catch (ex){
        errorConsole(ex)
        reject(ex)
      } finally {
        // await client.close();
      }
    
    // if(collectionName){
    //   let c = await db.collection(collectionName)
    //   resolve({c: c, client})
    // } else {
    //   resolve({db: db, client})
    // }
    
      // client.close();
  })
}
