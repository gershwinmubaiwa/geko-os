import app from "../src/index";

export default async function handler(req: any, res: any) {
  return app(req, res);
}
