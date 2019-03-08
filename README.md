# node-couchdb-client
A typescript package built around the [CouchDB API](http://docs.couchdb.org/en/latest/api) for NodeJS using OOP practices. The foundation of this repo was inspired by [pmorjan/couchdb-promise](https://github.com/pmorjan/couchdb-promises)!
* Written in typescript
* Uses [request-promise](https://github.com/request/request-promise) under the hood
* Object Oriented for easy dependency injection

# Getting started
```
npm i @teammaestro/node-couchdb-client
```
Once the package is installed, you just need to import it and use it!
```javascript
import { CouchDB } from '@teammaestro/node-couchdb-client';

// Instatiate new CouchDB request class
const couchDb = new CouchDb({
    auth: {
        username: 'admin',
        password: 'password'
    }
});
```

# Documentation
## Overview
### new CouchDb()
**Parameters:**
* host (string | _optional_ | _default: 127.0.0.1_) - The domain that the couchDb is located at
* port (number | _optional_| _default: 5984_) - The port that couchDb is running on
* auth (object | _optional_)
    * username (string) - The basic auth username
    * password (string) - The basic auth password
* logging (boolean | _optional_ | _default: false_) - Use this to turn on logging of all requests
* defaultDatabase (string | _optional_) - You can set the default database for database specific calls

**Request Example:**
```javascript
new CouchDb({
    host: 'https://couchdb.example.com';
    port: 1433;
    auth: {
        username: 'admin',
        password: 'password'
    },
    logging: true
    defaultDatabase: 'test'
})
```

### .catch()
Whenever the API makes a call and runs into a catch block, you will get an error block that looks consistently like this:
* error (Error) - The exception that was thrown
* status (number) - The HTTP Status Code
* message (string) - The HTTP error message (some are custom mapped)
* duration (number) - How long the response took in miliseconds
**Response Example:**
```
{
    error: Error
    status: 500,
    message: 'Internal Server Error',
    duration: 300
}
```


### getInfo() [GET /](http://docs.couchdb.org/en/latest/api/server/common.html#api-server-root)
This is essentially a "ping" endpoint .. just returns basic information if the server is up.

**Request Example:**
```javascript
couchDb.getInfo()
```
**Response Example:**
```
{
    "couchdb": "Welcome",
    "uuid": "85fb71bf700c17267fef77535820e371",
    "vendor": {
        "name": "The Apache Software Foundation",
        "version": "1.3.1"
    },
    "version": "1.3.1"
}
```

## Database

### getDatabases() [GET \_all\_dbs](http://docs.couchdb.org/en/latest/api/server/common.html#get--_all_dbs)
This endpoint just returns an array of all the database names

**Request Example:**
```javascript
couchDb.getDatabases()
```

**Response Example:**
```
[
   "_users",
   "contacts",
   "docs",
   "invoices",
   "locations"
]
```

### getDatabase(dbName?: string) [GET /{db}](http://docs.couchdb.org/en/latest/api/database/common.html#get--db)
Gets information about the specified database.

**Parameters:**
* dbName (string | _optional_ | _default: couchDb.defaultDatabase)

**Request Example:**
```javascript
couchDb.getDatabase('testDB')
```

**Response Example:**
```
{
    "db_name": "test",
    "update_seq": "37-g1AAAABXeJ",
    "sizes": {
        "file": 172428,
        "external": 3427,
        "active": 13135
    },
    "purge_seq": 0,
    "other": {
        "data_size": 3427
    },
    "doc_del_count": 5,
    "doc_count": 23,
    "disk_size": 172428,
    "disk_format_version": 6,
    "data_size": 13135,
    "compact_running": false,
    "instance_start_time": "0"
}
```

### getDatabaseRevisionLimit(dbName?: string) [GET /{db}/_revs_limit](http://docs.couchdb.org/en/latest/api/database/misc.html#db-revs-limit)
Gets the revision limit for the specified database.

**Parameters:**
* dbName (string)

**Request Example:**
```javascript
couchDb.getDatabaseRevisionLimit('testDB')
```

**Response Example:**
```
2
```

### createDatabase(dbName?: string, options?: { revisionLimit: number; }) [PUT /{db}](http://docs.couchdb.org/en/latest/api/database/common.html#put--db)
Creates a new database. If a revisionLimit is passed to the options object it will also set the revision limit for that database. The database name {db} must be composed by following next rules:
* Name must begin with a lowercase letter (a-z)
* Lowercase characters (a-z)
* Digits (0-9)
* Any of the characters _, $, (, ), +, -, and /.

**Parameters:**
* dbName (string | _optional_ | _default: couchDb.defaultDatabase)
* options (object | _optional_)
    * revisionLimit (number)

**Request Example:**
```javascript
couchDb.createDatabase('testDB', { revisionLimit: 2 })
```

**Response Example:**
```
{
    "ok": true
}
```

### checkDatabaseExists(dbName?: string) [HEAD /{db}](http://docs.couchdb.org/en/latest/api/database/common.html#head--db)
Returns the HTTP Headers containing a minimal amount of information about the specified database. Since the response body is empty, using the HEAD method is a lightweight way to check if the database exists already or not.

**Parameters:**
* dbName (string | _optional_ | _default: couchDb.defaultDatabase)

**Request Example:**
```javascript
couchDb.checkDatabaseExists('testDB')
```

**Response:**
This just returns a boolean if the database exists or not.

**Response Example:**
```
true
```

### compactDatabase(dbName: string) [POST /{db}/_compact](http://docs.couchdb.org/en/latest/api/database/compact.html)
Request compaction of the specified database. Compaction compresses the disk database file by writing a new optimized version of the database and removing any old revisions, up to the database specific revision limit.


**Parameters:**
* dbName (string)

**Request Example:**
```javascript
couchDb.compactDatabase('testDB')
```

**Response Example:**
```
{
    "ok": true
}
```

### setDatabaseRevisionLimit(dbName: string, revisionLimit: number) [PUT /{db}/_revs_limit](http://docs.couchdb.org/en/latest/api/database/misc.html#db-revs-limit)
Set the revision limit on the specified database.


**Parameters:**
* dbName (string)
* revisionLimit (number)

**Request Example:**
```javascript
couchDb.setDatabaseRevisionLimit('testDB', 2)
```

**Response Example:**
```
{
    "ok": true
}
```

### deleteDatabase(dbName?: string) [DELETE /{db}](http://docs.couchdb.org/en/latest/api/database/common.html#delete--db)
Deletes the specified database, and all the documents and attachments contained within it.

**Parameters:**
* dbName (string | _optional_ | _default: couchDb.defaultDatabase)

**Request Example:**
```javascript
couchDb.deleteDatabase('testDB')
```

**Response Example:**
```
{
    "ok": true
}
```

### updateDatabaseSecurity({ dbName?: string, admins: any, members: any }) [PUT /{db}/_security](http://docs.couchdb.org/en/2.1.1/api/database/security.html#put--db-_security)
Sets the security object for the given database. Use the member permissions to lock down this database to either a username or role.

**Parameters:**
* dbName (string | _optional_ | _default: couchDb.defaultDatabase)
* admins:
    * names (string[] | _optional_) - This is the list of usernames that have admin permissions
    * roles (string[] | _optional_) - This is the list of roles that have admin permissions
* members:
    * names (string[] | _optional_) - This is the list of usernames that have member permissions
    * roles (string[] | _optional_) - This is the list of roles that have member permissions

**Request Example:**
```javascript
couchDb.updateDatabaseSecurity({
    dbName: 'testDB',
    admins: {
        names: ['johnsmith']
    },
    members: {
        names: ['johnsmith']
    }
})
```

**Response Example:**
```
{
    "ok": true,

}
```

## Users

### createUser({ username: string, password: string, roles?: string[]}) [POST /_users](https://stackoverflow.com/questions/3684749/creating-regular-users-in-couchdb)
This will create a member user which would be used to help lock down a database

**Parameters:**
* username (string | _required_) - The users username
* password (string | _required_) - The users password
* roles (string[] | _optional_) - The users list of roles (These roles are made up by you .. used for Database security)

**Request Example:**
```javascript
couchDb.createUser({
    username: 'johnsmith',
    password: 'password',
    roles: [
        'reporter'
    ]
})
```

**Response Example:**
```
{
    "ok": true,
    "id": "org.couchdb.user:johnsmith",
    "rev": "1-c7b59092b8e3e85eed24cce19e9350f7"
}
```

### checkUserExists(username: string) [HEAD /_users/org.couchdb.user:{username}]()
Returns a boolean for if the user exists or not.

**Parameters:**
* username (string) - The user's username you are checking on

**Request Example:**
```javascript
couchDb.checkUserExists(username)
```

**Response:**
This just returns a boolean if the database exists or not.

**Response Example:**
```
true
```

### getUser(username : string) [GET /{db}/{docId}](http://docs.couchdb.org/en/latest/api/document/common.html#get--db-docid)
Returns document by the specified docid from the specified db. Unless you request a specific revision, the latest revision of the document will always be returned.

Parameters (_All optional_):
* dbName (string | _default: couchDb.defaultDatabase)
* docId (string | _required_) - The documents Id

**Request Example:**
```javascript
couchDb.getDocument({
    dbName: 'testDB',
    docId: '4342-432432-432432-4324'
})
```

**Response:**
* _id (string) – Document ID
* _rev (string) – Revision MVCC token
* _deleted (boolean) – Deletion flag. Available if document was removed
* _attachments (object) – Attachment’s stubs. Available if document has any attachments
* _conflicts (array) – List of conflicted revisions. Available if requested with conflicts=true query * parameter
* _deleted_conflicts (array) – List of deleted conflicted revisions. Available if requested with * deleted_conflicts=true query parameter
* _local_seq (string) – Document’s update sequence in current database. Available if requested with * local_seq=true query parameter
* _revs_info (array) – List of objects with information about local revisions and their status. * Available if requested with open_revs query parameter
* _revisions (object) – List of local revision tokens without. Available if requested with revs=true query parameter

**Response Example:**
```json
{
    "id": "16e458537602f5ef2a710089dffd9453",
    "rev": "1-967a00dff5e02add41819138abb3284d"
}
```


## Documents

### findDocuments({ dbName?: string, findOptions: any }) [POST /{db}/_find](http://docs.couchdb.org/en/latest/api/database/find.html#post--db-_find)
Find documents using a declarative JSON querying syntax. Queries can use the built-in _all_docs index or custom indices, specified using the _index endpoint.

**Parameters:**
* dbName (string | _optional_ | _default: couchDb.defaultDatabase)
* findOptions:
    * selector (json | _required_) – A JSON object describing criteria used to select documents. More information provided in the section on selector syntax.
    * limit (number | _otional_) – Maximum number of results returned. Default is 25.
    * skip (number | _optional_) – Skip the first ‘n’ results, where ‘n’ is the value specified.
    * sort (json | _optional_) – JSON array following sort syntax.
    * fields (array | _optional_) – JSON array specifying which fields of each object should be returned. If it is omitted, the entire object is returned. More information provided in the section on filtering fields.
    * use_index (string|array | _optional_ | _default: 1_) – Instruct a query to use a specific index. Specified either as "<design_document>" or ["<design_document>", "<index_name>"].
    * r (number | _optional_) – Read quorum needed for the result. This defaults to 1, in which case the document found in the index is returned. If set to a higher value, each document is read from at least that many replicas before it is returned in the results. This is likely to take more time than using only the document stored locally with the index.
    * bookmark (string | _optional_) – A string that enables you to specify which page of results you require. Used for paging through result sets. Every query returns an opaque string under the bookmark key that can then be passed back in a query to get the next page of results. If any part of the selector query changes between requests, the results are undefined.
    * update (boolean | _optional_) – Whether to update the index prior to returning the result. Default is true.
    * stable (boolean | _optional_) – Whether or not the view results should be returned from a “stable” set of shards.
    * stale (string | _optional_) – Combination of update=false and stable=true options. Possible options: "ok", false (default)
    * execution_stats (boolean | _optional_ | _default: false_) – Include execution statistics in the query response.

**Request Example:**
```javascript
couchDb.findDocuments({
    dbName: 'testDB',
    findOptions: {
        selector: {
            year: {'$gt': 2010}
        },
        fields: ['_id', '_rev', 'year', 'title'],
        sort: [{year: 'asc'}],
        limit: 2,
        skip: 0,
        execution_stats: true
    }
})
```

**Response:**
* docs (any[]) – Array of documents matching the search. In each matching document, the fields specified in the fields part of the request body are listed, along with their values.
* warning (string) – Execution warnings
* execution_stats (object) – Execution statistics

**Response Example:**
```json
{
    "docs": [
        {
            "_id": "176694",
            "_rev": "1-54f8e950cc338d2385d9b0cda2fd918e",
            "year": 2011,
            "title": "The Tragedy of Man"
        },
        {
            "_id": "780504",
            "_rev": "1-5f14bab1a1e9ac3ebdf85905f47fb084",
            "year": 2011,
            "title": "Drive"
        },
        ...
    ],
    "execution_stats": {
        "total_keys_examined": 0,
        "total_docs_examined": 200,
        "total_quorum_docs_examined": 0,
        "results_returned": 2,
        "execution_time_ms": 5.52
    }
}
```

### getDocuments({ dbName?: string, options?: any }) [GET /{db}/_all_docs](http://docs.couchdb.org/en/latest/api/database/bulk-api.html#get--db-_all_docs)
Returns a JSON structure of all of the documents in a given database. The information is returned as a JSON structure containing meta information about the return structure, including a list of all documents and basic contents, consisting the ID, revision and key. The key is the from the document’s _id.

Parameters (_All optional_):
* dbName (string | _default: couchDb.defaultDatabase)
* options:
    * conflicts (boolean | _default: false_) – Includes conflicts information in response. Ignored if include_docs isn’t true.
    * descending (boolean | _default: false_) – Return the documents in descending by key order.
    * endkey (string) – Stop returning records when the specified key is reached.
    * end_key (string) – Alias for endkey param.
    * endkey_docid (string) – Stop returning records when the specified document ID is reached.
    * end_key_doc_id (string) – Alias for endkey_docid param.
    * include_docs (boolean | _default: false_) – Include the full content of the documents in the return.
    * inclusive_end (boolean| _default: true_) – Specifies whether the specified end key should be included in the result.
    * key (string) – Return only documents that match the specified key.
    * keys (string) – Return only documents that match the specified keys.
    * limit (number) – Limit the number of the returned documents to the specified number.
    * skip (number | _default: 0_) – Skip this number of records before starting to return the results.
    * stale (string) – Allow the results from a stale view to be used, without triggering a rebuild of all views within the encompassing design doc. Supported values: ok and update_after.
    * startkey (string) – Return records starting with the specified key.
    * start_key (string) – Alias for startkey param.
    * startkey_docid (string) – Return records starting with the specified document ID.
    * start_key_doc_id (string) – Alias for startkey_docid param.
    * update_seq (boolean | _default: false_) – Response includes an update_seq value indicating which sequence id of the underlying database the view reflects.

**Request Example:**
```javascript
couchDb.getDocuments({
    dbName: 'testDB',
    options: {
        startKey: 'user'
    }
})
```

**Response:**
* offset (number) – Offset where the document list started
* rows (array) – Array of view row objects. By default the information returned contains only the document ID and revision.
* total_rows (number) – Number of documents in the database/view. Note that this is not the number of rows returned in the actual query.
* update_seq (number) – Current update sequence for the database

**Response Example:**
```json
{
    "offset": 0,
    "rows": [
        {
            "id": "16e458537602f5ef2a710089dffd9453",
            "key": "16e458537602f5ef2a710089dffd9453",
            "value": {
                "rev": "1-967a00dff5e02add41819138abb3284d"
            }
        },
        {
            "id": "a4c51cdfa2069f3e905c431114001aff",
            "key": "a4c51cdfa2069f3e905c431114001aff",
            "value": {
                "rev": "1-967a00dff5e02add41819138abb3284d"
            }
        },
        {
            "id": "a4c51cdfa2069f3e905c4311140034aa",
            "key": "a4c51cdfa2069f3e905c4311140034aa",
            "value": {
                "rev": "5-6182c9c954200ab5e3c6bd5e76a1549f"
            }
        }
    ],
    "total_rows": 3
}
```

### getDocument({ dbName?: string, docId: string }) [GET /{db}/{docId}](http://docs.couchdb.org/en/latest/api/document/common.html#get--db-docid)
Returns document by the specified docid from the specified db. Unless you request a specific revision, the latest revision of the document will always be returned.

Parameters (_All optional_):
* dbName (string | _default: couchDb.defaultDatabase)
* docId (string | _required_) - The documents Id

**Request Example:**
```javascript
couchDb.getDocument({
    dbName: 'testDB',
    docId: '4342-432432-432432-4324'
})
```

**Response:**
* _id (string) – Document ID
* _rev (string) – Revision MVCC token
* _deleted (boolean) – Deletion flag. Available if document was removed
* _attachments (object) – Attachment’s stubs. Available if document has any attachments
* _conflicts (array) – List of conflicted revisions. Available if requested with conflicts=true query * parameter
* _deleted_conflicts (array) – List of deleted conflicted revisions. Available if requested with * deleted_conflicts=true query parameter
* _local_seq (string) – Document’s update sequence in current database. Available if requested with * local_seq=true query parameter
* _revs_info (array) – List of objects with information about local revisions and their status. * Available if requested with open_revs query parameter
* _revisions (object) – List of local revision tokens without. Available if requested with revs=true query parameter

**Response Example:**
```json
{
    "id": "16e458537602f5ef2a710089dffd9453",
    "rev": "1-967a00dff5e02add41819138abb3284d"
}
```

### checkDocumentExists({ dbName?: string, docId: string }) [HEAD /{db}/{docId}](http://docs.couchdb.org/en/latest/api/document/common.html#head--db-docid)
Returns the HTTP Headers containing a minimal amount of information about the specified document. The method supports the same query arguments as the GET /{db}/{docid} method, but only the header information (including document size, and the revision as an ETag), is returned.

The ETag header shows the current revision for the requested document, and the Content-Length specifies the length of the data, if the document were requested in full.

Adding any of the query arguments (see GET /{db}/{docid}), then the resulting HTTP Headers will correspond to what would be returned.

**Parameters:**
* dbName (string | _optional_ | _default: couchDb.defaultDatabase)
* docId (string) - The document id

**Request Example:**
```javascript
couchDb.checkDocumentExists({
    dbName: 'testDB',
    docId: 'user'
})
```

**Response:**
This just returns a boolean if the database exists or not.

**Response Example:**
```
true
```

### copyDocument({ dbName?: string, docId: string, newDocId: string }) [COPY /{db}/{docId}](http://docs.couchdb.org/en/latest/api/document/common.html#copy--db-docid)
The COPY (which is non-standard HTTP) copies an existing document to a new or existing document. Copying a document is only possible within the same database.

The source document is specified on the request line, with the Destination header of the request specifying the target document.

**Parameters:**
* dbName (string | _optional_ | _default: couchDb.defaultDatabase)
* docId (string | _required_) - The document id that you will be copying
* newDocId (string | _required_) - The new document id

**Request Example:**
```javascript
couchDb.copyDocuments({
    dbName: 'testDB',
    docId: 'user',
    newDocId: 'newUser'
})
```

**Response Example:**
```
{
    "id": "newUser",
    "ok": true,
    "rev": "1-e86fdf912560c2321a5fcefc6264e6d9"
}
```

### createDocument({ dbName?: string, doc: any, docId?: string }) [POST /{db}(/{docId})](http://docs.couchdb.org/en/latest/api/database/common.html#post--db)
Creates a new document in the specified database, using the supplied JSON document structure. It will also, create the document under the docId if specified.

If the JSON structure includes the _id field, then the document will be created with the specified document ID.

If the _id field is not specified, a new unique ID will be generated, following whatever UUID algorithm is configured for that server.

**Parameters:**
* dbName (string | _optional_ | _default: couchDb.defaultDatabase)
* doc (any | _required_) - The document you want to create
* docId (string | _optional_) - An optional ID you want to create the document with

**Request Example:**
```javascript
couchDb.createDocument({
    dbName: 'testDB',
    doc: {
        firstName: 'John',
        lastName: 'Doe'
    },
    docId: 'currentUser'
})
```

**Response Example:**
```
{
    "id": "currentUser"
    "ok": true,
    "rev": "1-9c65296036141e575d32ba9c034dd3ee"
}
```


### upsertDocuments({ dbName?: string, docs: any[] }) [POST /{db}/_bulk_docs](http://docs.couchdb.org/en/latest/api/database/bulk-api.html#post--db-_bulk_docs)
The bulk document API allows you to create multiple documents at the same time within a single request. The basic operation is similar to creating single document, except that you batch the document structure and information. When creating new documents the document ID (`_id`) is optional.

**Parameters:**
* dbName (string | _optional_ | _default: couchDb.defaultDatabase)
* docs (any[]) - An array of all the documents you are looking to create

**Request Example:**
```javascript
couchDb.upsertDocuments({
    dbName: 'testDB',
    docs: [{
        firstName: 'John',
        lastName: 'Doe'
    }, {
        _id: '3f32022a25e9b2b81b67a766b9004517',
        _rev: '2-d538c7aaebdf4eb144b5d0070d3165ba',
        firstName: 'Jan',
        lastName: 'Doe'
    }]
})
```

**Response Example:**
```
{
    "ok": true
}
```

### deleteDocument({ dbName?: string, docId: string, rev: string }) [DELETE /{db}/{docId}](http://docs.couchdb.org/en/latest/api/database/bulk-api.html#post--db-_bulk_docs)
Marks the specified document as deleted by adding a field _deleted with the value true. Documents with this field will not be returned within requests anymore, but stay in the database. You must supply the current (latest) revision

**Parameters:**
* dbName (string | _optional_ | _default: couchDb.defaultDatabase)
* docId (string | _required_) - The document Id
* rev (string | _required_) - This is the revision

**Request Example:**
```javascript
couchDb.deleteDocument({
    dbName: 'testDB',
    docId: 'currentUser',
    rev: '1-9c65296036141e575d32ba9c034dd3ee'
})
```

**Response Example:**
```
{
    "id": "currentUser",
    "ok": true,
    "rev": "1-9c65296036141e575d32ba9c034dd3ee"
}
```

## Utils

### getUuids(count: number) [GET /_uuids](http://docs.couchdb.org/en/latest/api/server/common.html#uuids)
Requests one or more Universally Unique Identifiers (UUIDs) from the CouchDB instance. The response is a JSON object providing a list of UUIDs.

**Parameters:**
* count (number | _optional_ | _default: 1_)

**Request Example:**
```javascript
couchDb.getUuids(2)
```

**Response Example:**
```
{
    "uuids":[
        "6e1295ed6c29495e54cc05947f18c8af",
        "4325432rfdf432weds3r4tregf454fg4"
    ]
}
```

## Design Docs

### getDesignDocument({dbName?: string, docId: string, options: any }) [GET /_design](http://docs.couchdb.org/en/latest/api/ddoc/index.html)
To come later

### getDesignDocumentInfo({dbName?: string, docId: string }) [GET /_design](http://docs.couchdb.org/en/latest/api/ddoc/index.html)
To come later

### createDesignDocument({dbName?: string, doc: any, docId: string }) [GET /_design](http://docs.couchdb.org/en/latest/api/ddoc/index.html)
To come later

### deleteDesignDocument({dbName?: string, docId: string, rev: string }) [GET /_design](http://docs.couchdb.org/en/latest/api/ddoc/index.html)
To come later


### getView({dbName?: string, docId: string, viewName: string, options?: any }) [GET /_design](http://docs.couchdb.org/en/latest/api/ddoc/views.html)
To come later

## Index

### getIndexes(dbName?: string) [GET /{db}/_index](http://docs.couchdb.org/en/latest/api/database/find.html#db-index)
To come later

### createIndex({ dbName?: string, index: any, name?: string }) [POST /{db}/_index](http://docs.couchdb.org/en/latest/api/database/find.html#db-index)
To come later

### deleteIndex({ dbName?: string, docId: string, indexName: string }) [DELETE /{db}/_index/{docId}/json/{indexName}](http://docs.couchdb.org/en/latest/api/database/find.html#db-index)
To come later

## Usuage
```javascript
// Import package
import { CouchDB } from '@teammaestro/node-couchdb-client';

// Instatiate new CouchDB request class
const couchDb = new CouchDb({
    auth: {
        username: 'admin',
        password: 'password'
    }
});

// Async example
async function getAllDatabases() {
    try {
        const databases =  await this.couchDb.getAllDatabases();
        // do something
    }
    catch(error) {
        // catch error
    }
}

// Promise (ES6) example
couchDb.getDocuments('databaseName').then(docs => {
    // do something
}).catch(error => {
    // catch error
});
```


## Contributors

[<img alt="John Pinkster" src="https://avatars1.githubusercontent.com/u/5350861?v=3&s=460" width="117">](https://github.com/jpinkster)|
:---: |
[John Pinkster](https://github.com/jpinkster)|
