// tslint:disable-next-line:no-namespace
export namespace CouchDbResponse {
    /**
     * Generic Base Respoinse
     */

    export interface Info {
        couchdb: string;
        uuid: string;
        vendor: {
            name: string;
            version: string;
        };
        version: string;
    }

    export interface Generic {
        ok: boolean;
    }

    export interface Create extends Generic {
        _id: string;
        rev: string;
    }

    export interface DatabaseInfo {
        // The number of committed update.
        committed_update_seq: number;
        // Set to true if the database compaction routine is operating on this database.
        compact_running: boolean;
        // The name of the database.
        db_name: string;
        // The version of the physical format used for the data when it is stored on disk.
        disk_format_version: number;
        // The number of bytes of live data inside the database file.
        data_size: number;
        // Object
        sizes: {
            // The size of live data inside the database, in bytes.
            active: number;
            // – The uncompressed size of database contents in bytes.
            external: number;
            // – The size of the database file on disk in bytes. Views indexes are not included in the calculation.
            file: number;
        };
        // The length of the database file on disk. Views indexes are not included in the calculation.
        disk_size: number;
        // A count of the documents in the specified database.
        doc_count: number;
        // Number of deleted documents
        doc_del_count: number;
        // Timestamp of when the database was opened, expressed in microseconds since the epoch.
        instance_start_time: string;
        // The number of purge operations on the database.
        purge_seq: number;
        // The current number of updates to the database.
        update_seq: number;
    }

    export interface Document {
        // Document ID
        _id: string;
        // Revision MVCC token
        _rev: string;
        // Deletion flag. Available if document was removed
        _deleted: boolean;
        // Attachment’s stubs. Available if document has any attachments
        _attachments: object;
        // List of conflicted revisions. Available if requested with conflicts=true query parameter
        _conflicts: any[];
        // List of deleted conflicted revisions. Available if requested with deleted_conflicts=true query parameter
        _deleted_conflicts: any[];
        // Document’s update sequence in current database. Available if requested with local_seq=true query parameter
        _local_seq: string;
        // List of objects with information about local revisions and their status. Available if requested with open_revs query parameter
        _revs_info: any[];
        // List of local revision tokens without. Available if requested with revs=true query parameter
        _revisions: object;

        // Any custom keys
        [key: string]: any;
    }

    export interface AllDocuments {
        // Offset where the document list started
        offset: number;
        // Array of view row objects. By default the information returned contains only the document ID and revision.
        rows: Document[];
        // Number of documents in the database/view. Note that this is not the number of rows returned in the actual query.
        total_rows: number;
        // Current update sequence for the database
        update_seq: number;
    }

    export interface Docs {
        docs: Document[];
    }

    export interface Find extends Docs {
        // Execution warnings
        warning: string;
        // Execution statistics
        execution_stats: any;
    }
}
