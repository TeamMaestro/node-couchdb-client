export namespace CouchDBOptions {

    export interface connection {
        host?: string;
        port?: number;
        auth?: auth;
    }

    export interface auth {
        username: string;
        password: string;
    }
}
