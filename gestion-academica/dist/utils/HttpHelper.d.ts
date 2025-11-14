import { IncomingMessage, ServerResponse } from "http";
declare class HttpHelper {
    static parseBody(req: IncomingMessage): Promise<any>;
    static sendJSON(res: ServerResponse, statusCode: number, data: any): void;
    static parseQueryParams(url: string): Record<string, string>;
}
export default HttpHelper;
//# sourceMappingURL=HttpHelper.d.ts.map