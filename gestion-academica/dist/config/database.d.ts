import { PoolClient, QueryResult } from "pg";
declare class Database {
    private static instance;
    private pool;
    private constructor();
    static getInstance(): Database;
    query(text: string, params?: any[]): Promise<QueryResult>;
    getClient(): Promise<PoolClient>;
    close(): Promise<void>;
}
export default Database;
//# sourceMappingURL=database.d.ts.map