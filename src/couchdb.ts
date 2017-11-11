import * as request from 'request-promise';
import * as http from 'http';
import * as querystring from 'query-string';
import { CouchDbOptions, CouchDbResponse } from './index';
import { AuthOptions } from 'request';

export class CouchDBAdmin {
    private host: string;
    private port: number;
    private auth: AuthOptions;
    private logging: boolean;
    private QUERY_KEYS_JSON = ['key', 'keys', 'startkey', 'endkey']

    constructor(options: CouchDbOptions.connection = {}) {
        this.host = options.host || 'http://127.0.0.1';
        this.port = options.port = 5984;
        this.auth = options.auth;
        this.logging = options.logging || false;
    }

    private createQueryString(queryObj: CouchDbOptions.query) {
        const obj = Object.assign({}, queryObj)
        this.QUERY_KEYS_JSON.forEach(key => {
            if (key in obj) {
                obj[key] = JSON.stringify(obj[key])
            }
        })
        return Object.keys(obj).length ? `?${querystring.stringify(obj)}` : ''
    }

    private get defaultRequestOptions(): CouchDbOptions.requestOptions {
        return {
            uri: `${this.host}:${this.port}`,
            auth: this.auth,
            method: 'GET',
            json: true,
            headers: {
                'user-agent': 'couchdb-promises',
                'accept': 'application/json'
            },
            resolveWithFullResponse: true
        }
    }

    private request<T>(options: CouchDbOptions.requestOptions = {}): Promise<T> {
        const startTime = Date.now();
        const requestOptions = this.defaultRequestOptions;
        requestOptions.method = options.method || requestOptions.method;
        requestOptions.uri += `/${options.path}`;
        requestOptions.body = options.postData

        if (options.headers && options.headers.length > 0) {
            requestOptions.headers = Object.assign({}, requestOptions.headers, options.headers);
        }

        return new Promise((resolve, reject) => {
            request(requestOptions as any).then(response => {
                if(this.logging) {
                    console.info({
                        statusCode: response.statusCode,
                        message: this.statusCode(options.statusCodes, response.statusCode),
                        body: response.body,
                        duration: Date.now() - startTime
                    });
                }
                resolve(response.body);
            }).catch(error => {
                reject({
                    error,
                    status: error.statusCode || 500,
                    message: this.statusCode(options.statusCodes, error.statusCode),
                    duration: Date.now() - startTime
                });
            });
        })
    }

    private statusCode(statusCodes: { [key: number]: string }, status: number): string {
        const codes = Object.assign({}, http.STATUS_CODES, statusCodes)
        return codes[status] || 'unknown status';
    }

    /**
     * Get basic info on couchdb
     * @return {Promise}
     */
    getInfo() {
        return this.request<CouchDbResponse.info>({
            statusCodes: {
                200: 'OK - Request completed successfully'
            }
        });
    }

    /***** DATABASE *****/

    /**
     * Get the list of all databases.
     * @return {Promise}
     */
    listDatabases() {
        return this.request<string[]>({
            path: '_all_dbs',
            statusCodes: {
                200: 'OK - Request completed successfully'
            }
        });
    }

    /**
   * Create database
   * @param  {String} dbName
   * @return {Promise}
   */
    createDatabase(dbName: string) {
        if(!dbName.match('^[a-z][a-z0-9_$()+/-]*$')) {
            return Promise.reject('Invalid DB Name: http://docs.couchdb.org/en/latest/api/database/common.html#put--db')
        }
        return this.request<CouchDbResponse.generic>({
            path: encodeURIComponent(dbName),
            method: 'PUT',
            statusCodes: {
                201: 'Created - Database created successfully',
                400: 'Bad Request - Invalid database name',
                401: 'Unauthorized - CouchDB Server Administrator privileges required',
                412: 'Precondition Failed - Database already exists'
            }
        })
    }

    /**
     * Get database
     * @param  {String} dbName
     * @return {Promise}
     */
    getDatabase(dbName: string) {
        return this.request<CouchDbResponse.databaseInfo>({
            path: encodeURIComponent(dbName),
            statusCodes: {
                200: 'OK - Request completed successfully',
                404: 'Not Found – Requested database not found'
            }
        })
    }

    /**
     * Get database head
     * @param  {String} dbName
     * @return {Promise}
     */
    getDatabaseHead(dbName: string) {
        return this.request({
            path: encodeURIComponent(dbName),
            method: 'HEAD',
            statusCodes: {
                200: 'OK - Database exists',
                404: 'Not Found – Requested database not found'
            }
        })
    }

    /**
     * Delete database
     * @param  {String} dbName
     * @return {Promise}
     */
    deleteDatabase(dbName: string) {
        return this.request<CouchDbResponse.generic>({
            path: encodeURIComponent(dbName),
            method: 'DELETE',
            statusCodes: {
                200: 'OK - Database removed successfully',
                400: 'Bad Request - Invalid database name or forgotten document id by accident',
                401: 'Unauthorized - CouchDB Server Administrator privileges required',
                404: 'Not Found - Database doesn’t exist'
            }
        })
    }

    /***** DOCUMENTS *****/

    /**
     * Get all documents
     * @param  {String} dbName
     * @param  {Object} [query]
     * @return {Promise}
     */
    getAllDocuments(dbName: string, queryObj?: CouchDbOptions.query) {
        const queryStr = this.createQueryString(queryObj)
        return this.request<CouchDbResponse.allDocuments>({
            path: `${encodeURIComponent(dbName)}/_all_docs${queryStr}`,
            statusCodes: {
                200: 'OK - Request completed successfully'
            }
        })
    }

    /**
     * Get Document Head
     * @param  {String} dbName
     * @param  {String} docId
     * @param  {Object} [query]
     * @return {Promise}
     */
     getDocumentHead(dbName: string, docId: string, queryObj?: CouchDbOptions.query) {
        const queryStr = this.createQueryString(queryObj)
        return this.request({
            path: `${encodeURIComponent(dbName)}/${encodeURIComponent(docId)}${queryStr}`,
            method: 'HEAD',
            statusCodes: {
                200: 'OK - Document exists',
                304: 'Not Modified - Document wasn’t modified since specified revision',
                401: 'Unauthorized - Read privilege required',
                404: 'Not Found - Document not found'
            }
        })
    }

    /**
     * Get Document
     * @param  {String} dbName
     * @param  {String} docId
     * @param  {Object} [query]
     * @return {Promise}
     */
     getDocument(dbName:string, docId: string, queryObj?: CouchDbOptions.query) {
        const queryStr = this.createQueryString(queryObj)
        return this.request<CouchDbResponse.document>({
            path: `${encodeURIComponent(dbName)}/${encodeURIComponent(docId)}${queryStr}`,
            statusCodes: {
                200: 'OK - Request completed successfully',
                304: 'Not Modified - Document wasn’t modified since specified revision',
                400: 'Bad Request - The format of the request or revision was invalid',
                401: 'Unauthorized - Read privilege required',
                404: 'Not Found - Document not found'
            }
        })
    }

    /**
     * Copy an existing document to a new document
     * @param  {String} dbName
     * @param  {String} docId
     * @param  {String} newDocId
     * @return {Promise}
     */
     copyDocument(dbName: string, docId: string, newDocId: string) {
        if (docId && newDocId) {
            return this.request<CouchDbResponse.create>({
                path: `${encodeURIComponent(dbName)}/${encodeURIComponent(docId)}`,
                method: 'COPY',
                headers: { Destination: newDocId },
                statusCodes: {
                    201: 'Created – Document created and stored on disk',
                    202: 'Accepted – Document data accepted, but not yet stored on disk',
                    400: 'Bad Request – Invalid request body or parameters',
                    401: 'Unauthorized – Write privileges required',
                    404: 'Not Found – Specified database or document ID doesn’t exists',
                    409: 'Conflict – Document with the specified ID already exists or specified revision is not latest for target document'
                }
            })
        }
        return Promise.reject('Invalid docId or newDocId');
    }

    /**
     * Create a new document or new revision of an existing document
     * @param  {String} dbName
     * @param  {Object} doc
     * @param  {String} [docId]
     * @return {Promise}
     */
     createDocument(dbName: string, doc: any, docId?: string) {
        if (docId) {
            // create document by id (PUT)
            return this.request<CouchDbResponse.create>({
                path: `${encodeURIComponent(dbName)}/${encodeURIComponent(docId)}`,
                method: 'PUT',
                postData: doc,
                headers: {
                    'content-type': 'application/json'
                },
                statusCodes: {
                    201: 'Created – Document created and stored on disk',
                    202: 'Accepted – Document data accepted, but not yet stored on disk',
                    400: 'Bad Request – Invalid request body or parameters',
                    401: 'Unauthorized – Write privileges required',
                    404: 'Not Found – Specified database or document ID doesn’t exists',
                    409: 'Conflict – Document with the specified ID already exists or specified revision is not latest for target document'
                }
            })
        }
        // create document without explicit id (POST)
        return this.request({
            path: encodeURIComponent(dbName),
            method: 'POST',
            postData: doc,
            statusCodes: {
                201: 'Created – Document created and stored on disk',
                202: 'Accepted – Document data accepted, but not yet stored on disk',
                400: 'Bad Request – Invalid database name',
                401: 'Unauthorized – Write privileges required',
                404: 'Not Found – Database doesn’t exists',
                409: 'Conflict – A Conflicting Document with same ID already exists'
            }
        })
    }

    /**
     * Create documents in Bulk
     * @param  {String} dbName
     * @param  {Array} docs
     * @param  {Object} [opts]
     * @return {Promise}
     */
    createDocuments(dbName: string, docs: any[], opts?: any) {
        const postData = {
            docs: docs
        }
        Object.assign(postData, opts)
        return this.request<CouchDbResponse.create[]>({
            path: `${encodeURIComponent(dbName)}/_bulk_docs`,
            method: 'POST',
            postData,
            statusCodes: {
                201: 'Created – Document(s) have been created or updated',
                400: 'Bad Request – The request provided invalid JSON data',
                417: 'Expectation Failed – Occurs when all_or_nothing option set as true and at least one document was rejected by validation function',
                500: 'Internal Server Error – Malformed data provided, while it’s still valid JSON'
            }
        })
    }


    /**
     * Delete a named document
     * @param  {String} dbName
     * @param  {String} docId
     * @param  {String} rev
     * @return {Promise}
     */
     deleteDocument(dbName: string, docId: string, rev: string) {
        return this.request<CouchDbResponse.generic>({
            path: `${encodeURIComponent(dbName)}/${encodeURIComponent(docId)}?rev=${rev}`,
            method: 'DELETE',
            statusCodes: {
                200: 'OK - Document successfully removed',
                202: 'Accepted - Request was accepted, but changes are not yet stored on disk',
                400: 'Bad Request - Invalid request body or parameters',
                401: 'Unauthorized - Write privilege required',
                404: 'Not Found - Specified database or document ID doesn\'t exist',
                409: 'Conflict - Specified revision is not the latest for target document'
            }
        })
    }

    /**
     * Find documents (requires CouchDB >= 2.0.0)
     * @param  {String} dbName
     * @param  {Object} queryObj
     * @return {Promise}
     */
     findDocuments(dbName: string, findOptions: CouchDbOptions.findOptions) {
        return this.request<CouchDbResponse.docs>({
            path: `${encodeURIComponent(dbName)}/_find`,
            method: 'POST',
            postData: findOptions,
            statusCodes: {
                200: 'OK - Request completed successfully',
                400: 'Bad Request - Invalid request',
                401: 'Unauthorized - Read permission required',
                500: 'Internal Server Error - Query execution error'
            }
        })
    }

    /***** UTILS *****/

    /**
     * Get one or more UUIDs
     * @param  {Number} [count = 1]
     * @return {Promise}
     */
     getUuids(count: number = 1) {
        return this.request<string[]>({
            path: `_uuids?count=${count}`,
            statusCodes: {
                200: 'OK - Request completed successfully',
                403: 'Forbidden – Requested more UUIDs than is allowed to retrieve'
            }
        })
    }

    /***** DESIGN DOCUMENTS *****/

    /**
     * Get design document
     * @param  {String} dbName
     * @param  {String} docId
     * @param  {Object} [query]
     * @return {Promise}
     */
     getDesignDocument(dbName: string, docId: string, queryObj?: CouchDbOptions.query) {
        const queryStr = this.createQueryString(queryObj)
        return this.request({
            path: `${encodeURIComponent(dbName)}/_design/${encodeURIComponent(docId)}${queryStr}`,
            statusCodes: {
                200: 'OK - Request completed successfully',
                304: 'Not Modified - Document wasn’t modified since specified revision',
                400: 'Bad Request - The format of the request or revision was invalid',
                401: 'Unauthorized - Read privilege required',
                404: 'Not Found - Document not found'
            }
        })
    }

    /**
     * Get design document info
     * @param  {String} dbName
     * @param  {String} docId
     * @return {Promise}
     */
     getDesignDocumentInfo(dbName: string, docId: string) {
        return this.request({
            path: `${encodeURIComponent(dbName)}/_design/${encodeURIComponent(docId)}/_info`,
            statusCodes: {
                200: 'OK - Request completed successfully'
            }
        })
    }

    /**
     * Create a new design document or new revision of an existing design document
     * @param  {String} dbName
     * @param  {Object} doc
     * @param  {String} docId
     * @return {Promise}
     */
     createDesignDocument(dbName: string, doc: any, docId: string) {
        return this.request({
            path: `${encodeURIComponent(dbName)}/_design/${encodeURIComponent(docId)}`,
            method: 'PUT',
            postData: doc,
            statusCodes: {
                201: 'Created – Document created and stored on disk',
                202: 'Accepted – Document data accepted, but not yet stored on disk',
                400: 'Bad Request – Invalid request body or parameters',
                401: 'Unauthorized – Write privileges required',
                404: 'Not Found – Specified database or document ID doesn’t exists',
                409: 'Conflict – Document with the specified ID already exists or specified revision is not latest for target document'
            }
        })
    }

    /**
     * Delete a named design document
     * @param  {String} dbName
     * @param  {String} docId
     * @param  {String} rev
     * @return {Promise}
     */
     deleteDesignDocument(dbName: string, docId: string, rev: string) {
        return this.request({
            path: `${encodeURIComponent(dbName)}/_design/${encodeURIComponent(docId)}?rev=${rev}`,
            method: 'DELETE',
            statusCodes: {
                200: 'OK - Document successfully removed',
                202: 'Accepted - Request was accepted, but changes are not yet stored on disk',
                400: 'Bad Request - Invalid request body or parameters',
                401: 'Unauthorized - Write privilege required',
                404: 'Not Found - Specified database or document ID doesn\'t exist',
                409: 'Conflict - Specified revision is not the latest for target document'
            }
        })
    }

    /***** VIEWS *****/

    /**
     * Get view
     * @param  {String} dbName
     * @param  {String} docId
     * @param  {String} viewName
     * @param  {Object} [query]
     * @return {Promise}
     */
     getView(dbName: string, docId: string, viewName: string, queryObj?: CouchDbOptions.query) {
        const queryStr = this.createQueryString(queryObj)
        return this.request({
            path: `${encodeURIComponent(dbName)}/_design/${encodeURIComponent(docId)}/_view/${encodeURIComponent(viewName)}${queryStr}`,
            statusCodes: {
                200: 'OK - Request completed successfully'
            }
        })
    }

    /***** INDEX *****/

    /**
     * create index (requires CouchDB >= 2.0.0)
     * @param  {String} dbName
     * @param  {Object} queryObj
     * @return {Promise}
     */
     createIndex(dbName: string, queryObj: CouchDbOptions.query) {
        return this.request({
            path: `${encodeURIComponent(dbName)}/_index`,
            method: 'POST',
            postData: queryObj,
            statusCodes: {
                200: 'OK - Index created successfully or already exists',
                400: 'Bad Request - Invalid request',
                401: 'Unauthorized - Admin permission required',
                500: 'Internal Server Error - Execution error'
            }
        })
    }

    /**
     * get index (requires CouchDB >= 2.0.0)
     * @param  {String} dbName
     * @return {Promise}
     */
     getIndex(dbName: string) {
        return this.request({
            path: `${encodeURIComponent(dbName)}/_index`,
            method: 'GET',
            statusCodes: {
                200: 'OK - Success',
                400: 'Bad Request - Invalid request',
                401: 'Unauthorized - Read permission required',
                500: 'Internal Server Error - Execution error'
            }
        })
    }

    /**
     * delete index (requires CouchDB >= 2.0.0)
     * @param  {String} dbName
     * @param  {String} docId - design document id
     * @param  {String} name - index name
     * @return {Promise}
     */
     deleteIndex(dbName: string, docId: string, indexName: string) {
        return this.request({
            path: `${encodeURIComponent(dbName)}/_index/${encodeURIComponent(docId)}/json/${encodeURIComponent(indexName)}`,
            method: 'DELETE',
            statusCodes: {
                200: 'OK - Success',
                400: 'Bad Request - Invalid request',
                401: 'Unauthorized - Writer permission required',
                404: 'Not Found - Index not found',
                500: 'Internal Server Error - Execution error'
            }
        })
    }
}
