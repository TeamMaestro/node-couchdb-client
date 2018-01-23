// tslint:disable-next-line:no-namespace
export namespace CouchDbOptions {

    export interface Connection {
        host?: string;
        port?: number;
        auth?: AuthOptions;
        logging?: boolean;
        defaultDatabase?: string;
    }

    export interface AuthOptions {
        username?: string;
        password?: string;
    }

    export interface RequestOptions {
        path?: string;
        uri?: string;
        postData?: any;
        resolveWithFullResponse?: boolean;
        auth?: AuthOptions;
        json?: boolean;
        statusCodes?: { [key: number]: string };
        headers?: { [key: string]: any };
        body?: any;
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'COPY' | 'HEAD';
    }

    export interface FindOptions {
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

    export interface FindAllOptions {
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

    export interface DocumentOptions {
        // Includes attachments bodies in response. Default is false
        attachments: boolean;
        // Includes encoding information in attachment stubs if the particular attachment is compressed. Default is false.
        att_encoding_info: boolean;
        // Includes attachments only since specified revisions. Doesn’t includes attachments for specified revisions. Optional
        atts_since: any[];
        // Includes information about conflicts in document. Default is false
        conflicts: boolean;
        // Includes information about deleted conflicted revisions. Default is false
        deleted_conflicts: boolean;
        // Forces retrieving latest “leaf” revision, no matter what rev was requested. Default is false
        latest: boolean;
        // Includes last update sequence for the document. Default is false
        local_seq: boolean;
        // Acts same as specifying all conflicts, deleted_conflicts and revs_info query parameters. Default is false
        meta: boolean;
        // Retrieves documents of specified leaf revisions. Additionally, it accepts value as all to return all leaf revisions. Optional
        open_revs: any[];
        // Retrieves document of specified revision. Optional
        rev: string;
        // Includes list of all known document revisions. Default is false
        revs: boolean;
        // Includes detailed information for all known document revisions. Default is false
        revs_info: boolean;
    }
}
