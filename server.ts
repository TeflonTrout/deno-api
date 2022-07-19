import {
    Application,
    Router,
    RouterContext,
  } from 'https://deno.land/x/oak@v10.4.0/mod.ts';
import { parse } from "https://deno.land/std@0.130.0/flags/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { getJOYtoys, insertJOYtoy } from './db.ts';
import newJOYtoy from "./db.ts";

const app = new Application();
const router = new Router();
const PORT = 8000;

router.put("/api/put", async ({request, response}: RouterContext<any>) => {
  try {
    const newToy:newJOYtoy = await request.body().value
    const data = await insertJOYtoy(newToy)
    data === undefined
    ? response.body = { message: "Success", data: "Something isn't right", status: 200 }
    : response.body = { message: "Success", data: data, status: 200 }
  }catch(e){
    response.body = { message: `Something went wrong : ${e}`, status: 500 }
  }
})

router.get("/api/get", async ({response}: RouterContext<any>) => {
  try {
    const data = await getJOYtoys()
    response.body = { message: "Success", data: data, status: 200 }
  } catch(e) {
    response.body = { message: `Something went wrong : ${e}`, status: 500 }
  }
})

app.use(oakCors())
app.use(router.routes())
app.use(router.allowedMethods())

const argPort = parse(Deno.args).port;
console.log(`***LISTENING ON PORT: ${argPort ? argPort : PORT}***`)
await app.listen({ port: argPort ?? PORT });
