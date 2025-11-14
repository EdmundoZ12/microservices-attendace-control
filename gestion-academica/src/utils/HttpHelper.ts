import { IncomingMessage, ServerResponse } from "http";
import url from "url";

class HttpHelper {
  static sendJSON(res: ServerResponse, statusCode: number, data: any): void {
    res.writeHead(statusCode, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });
    res.end(JSON.stringify(data));
  }

  static parseBody(req: IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch (error) {
          reject(new Error("JSON inválido"));
        }
      });
    });
  }

  static parseQuery(urlString: string): any {
    const urlParts = url.parse(urlString, true);
    return urlParts.query;
  }
}

export default HttpHelper;
