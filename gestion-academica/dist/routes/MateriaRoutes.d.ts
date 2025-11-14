import { IncomingMessage, ServerResponse } from "http";
declare class MateriaRoutes {
    private controller;
    constructor();
    handleRoute(req: IncomingMessage, res: ServerResponse, pathname: string, method: string, parsedUrl: any): Promise<boolean>;
}
export default MateriaRoutes;
//# sourceMappingURL=MateriaRoutes.d.ts.map