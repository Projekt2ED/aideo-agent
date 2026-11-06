declare module 'sql.js' {
  interface SqlJsStatic {
    Database: typeof Database;
  }

  interface SqlJsConfig {
    locateFile?: (file: string) => string;
  }

  class Database {
    constructor(data?: ArrayLike<number> | Buffer | null, config?: SqlJsConfig);
    run(sql: string, params?: any[]): Database;
    exec(sql: string, params?: any[]): QueryExecResult[];
    prepare(sql: string): Statement;
    export(): Uint8Array;
    close(): void;
  }

  interface QueryExecResult {
    columns: string[];
    values: any[][];
  }

  class Statement {
    bind(params?: any[]): boolean;
    step(): boolean;
    getAsObject(params?: any[]): { [key: string]: any };
    get(params?: any[]): any[];
    free(): boolean;
    reset(): void;
  }

  function initSqlJs(config?: SqlJsConfig): Promise<SqlJsStatic>;
  export default initSqlJs;
  export { Database, Statement, QueryExecResult, SqlJsStatic };
}
