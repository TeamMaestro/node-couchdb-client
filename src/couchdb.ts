import * as request from 'request-promise';
import { CouchDBOptions } from './couchdb-options.interface';

export class CouchDBAdmin {
    private host: string;
    private port: number;
    private auth: CouchDBOptions.auth;

    constructor(options: CouchDBOptions.connection = {}) {
        this.host = options.host || 'http://127.0.0.1';
        this.port = options.port = 5984;
        this.auth = options.auth;
    }

    private getOptions(path: string = '') {
        return {
            uri: `${this.host}:${this.port}/${path}`,
            auth: this.auth,
            json: true,
            headers: {
                'user-agent': 'couchdb-promises',
                'accept': 'application/json'
            }
        };
    }

    getInfo() {
        return request.get(this.getOptions(''));
    }

    /**
     * Get the list of all databases.
     * @return {Promise}
     */
    listDatabases() {
        return request.get(this.getOptions('_all_dbs'));
    }

}
