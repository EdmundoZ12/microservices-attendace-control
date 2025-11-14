"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = __importDefault(require("url"));
class HttpHelper {
    static sendJSON(res, statusCode, data) {
        res.writeHead(statusCode, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        });
        res.end(JSON.stringify(data));
    }
    static parseBody(req) {
        return new Promise((resolve, reject) => {
            let body = "";
            req.on("data", (chunk) => (body += chunk.toString()));
            req.on("end", () => {
                try {
                    resolve(body ? JSON.parse(body) : {});
                }
                catch (error) {
                    reject(new Error("JSON inválido"));
                }
            });
        });
    }
    static parseQuery(urlString) {
        const urlParts = url_1.default.parse(urlString, true);
        return urlParts.query;
    }
}
exports.default = HttpHelper;
