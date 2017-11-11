export namespace CouchDbOptions {

    export interface connection {
        host?: string;
        port?: number;
        auth?: authOptions;
        logging?: boolean;
    }

    export interface authOptions {
        user?: string;
        username?: string;
        pass?: string;
        password?: string;
        sendImmediately?: boolean;
        bearer?: string | (() => string);
    }

    export interface requestOptions {
        path?: string;
        uri?: string;
        postData?: any;
        resolveWithFullResponse?: boolean;
        auth?: authOptions;
        json?: boolean;
        statusCodes?: { [key: number]: string };
        headers?: { [key: string]: any }
        body?: any;
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'COPY' | 'HEAD'
    }

    export interface findOptions {
        // JSON object describing criteria used to select documents. More information provided in the section on selector syntax.
        selector?: any;
        // Maximum number of results returned. Default is 25. Optional
        limit?: number;
        // Skip the first ‘n’ results, where ‘n’ is the value specified. Optional
        skip?: number;
        // JSON array following sort syntax. Optional
        sort?: any;
        // JSON array specifying which fields of each object should be returned. If it is omitted, the entire object is returned. More information provided in the section on filtering fields. Optional
        fields?: any;
        // Instruct a query to use a specific index. Specified either as "<design_document>" or ["<design_document>", "<index_name>"]. Optional
        use_index?: any;
    }

    export interface query {
        // Includes conflicts information in response. Ignored if include_docs isn’t true. Default is false.
        conflicts?: boolean;
        // Return the documents in descending by key order. Default is false.
        descending?: boolean;
        // Stop returning records when the specified key is reached. Optional.
        endkey?: string;
        // Alias for endkey param.
        end_key?: string;
        // Stop returning records when the specified document ID is reached. Optional.
        endkey_docid?: string;
        // Alias for endkey_docid param.
        end_key_doc_id?: string;
        // Include the full content of the documents in the return. Default is false.
        include_docs?: boolean;
        // Specifies whether the specified end key should be included in the result. Default is true.
        inclusive_end?: boolean;
        // Return only documents that match the specified key. Optional.
        key?: string;
        // Return only documents that match the specified keys. Optional.
        keys?: string;
        // Limit the number of the returned documents to the specified number. Optional.
        limit?: number;
        // Skip this number of records before starting to return the results. Default is 0.
        skip?: number;
        // Allow the results from a stale view to be used, without triggering a rebuild of all views within the encompassing design doc. Supported values?: ok and update_after. Optional.;
        stale?: string;
        // Return records starting with the specified key. Optional.
        startkey?: string;
        // Alias for startkey param.
        start_key?: string;
        // Return records starting with the specified document ID. Optional.
        startkey_docid?: string;
        // Alias for startkey_docid param.
        start_key_doc_id?: string;
        // Response includes an update_seq value indicating which sequence id of the underlying database the view reflects. Default is false.
        update_seq?: boolean;
    }
}
