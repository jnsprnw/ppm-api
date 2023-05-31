import { Context } from 'netlify:edge';

// import data from '../../src/data/co2-ppm-daily_json.json';

// console.log(data)

export default async (req: Request, { log }: Context) => {
  log("Processing request for", req.url);

  return new Response("Hello world");
};