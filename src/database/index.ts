const { createClient } = require('redis');


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