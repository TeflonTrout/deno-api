import { MongoClient } from "https://deno.land/x/mongo@v0.29.2/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import { parse } from "https://deno.land/std@0.130.0/flags/mod.ts";

const env = config();

export default interface newJOYtoy {
  name: string,
  tokenId: string
}

async function connect(): Promise<any> {
  const client = new MongoClient();
  await client.connect({
    db: "tokenIds",
    tls: true,
    servers: [
      {
        host: String(Deno.env.get("HOST1")),
        port: 27017,
      },
      {
        host: String(Deno.env.get("HOST2")),
        port: 27017,
      },
      {
        host: String(Deno.env.get("HOST3")),
        port: 27017,
      },
      
    ],
    credential: {
      username: parse(Deno.args).username,
      password: parse(Deno.args).password,
      db: "tokenIds",
      mechanism: "SCRAM-SHA-1",
    },
  })
  return client;
}

export async function getJOYtoys(): Promise<any> {
  try {
    const client = await connect();
    const db = client.database("tokenIds")
    const data = await db.collection("map").find().toArray()
    return data
  } catch(e) {
    return e
  }
}

export async function insertJOYtoy(joytoy:newJOYtoy): Promise<any> {
  try{
    const joytoyName = joytoy.name;
    const client = await connect();
    const db = client.database("tokenIds")
    const id = await db.collection("map").find().toArray()
    const JOYtoyCollection = await db.collection("map").findOne(
      {"_id": id._id}
    )
    if(JOYtoyCollection.map[joytoyName] === undefined){
      // Create new JOYtoy
      const query = `map.${joytoyName}`
      await db.collection("map").updateOne(
        { "_id": id._id },
        {$push: { [query]: joytoy.tokenId}}
      )
      return {
        tokenIds: JOYtoyCollection.map[joytoyName],
        message: "New JOYtoy Created"
      }
    } else {
      // append tokenId to current object
      const query = `map.${joytoyName}`
      await db.collection("map").updateOne(
        { "_id": id._id },
        {$push: { [query]: joytoy.tokenId}}
      )
      return {
        tokenIds: JOYtoyCollection.map[joytoyName],
        message: "TokenIds Updated Succesfully!"
      }
    }
  } catch(e) {
    console.log(e)
    return e
  }
}