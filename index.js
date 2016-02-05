var azure = require('azure-storage');
var uuid = require('node-uuid');

var logger = {
    get: function (options, callback) {
        if (arguments.length === 1) {
            if (typeof options === 'function') {
                callback = options;
                options = null;
            }
        }
        
        var tableName = (options && options.table) ? options.table : 'loggerdefault';
        var partition = (options && options.partition) ? options.partition : 'default';
        
        var accountName = (options && options.cred && options.cred.accountName) ? options.cred.accountName : process.env.AZURE_STORAGE_ACCOUNT;
        var accountKey = (options && options.cred && options.cred.accountKey) ? options.cred.accountKey : process.env.AZURE_STORAGE_ACCESS_KEY;  
        
        var tableService = azure.createTableService(accountName, accountKey);
        var query = new azure.TableQuery()
            .where('PartitionKey eq ?', partition);
            
        tableService.queryEntities(tableName, query, null, function (err, result, response) {
            if (err) {
                callback(err);
            }
            else {
                var results = [];
                for (var i = 0; i < result.entries.length; i++) {
                    results.push({
                        entry: JSON.parse(result.entries[i].data._),
                        type: result.entries[i].type._,
                        Timestamp: result.entries[i].Timestamp._
                    });
                }
                
                callback(undefined, results);
            }
        });
    },
    
    log: function (entry, options, callback) {
        if (arguments.length === 2) {
            if (typeof options === 'function') {
                callback = options;
                options = null;
            }
        }
        
        if (!entry) {
            callback(new Error('entry object must be specified'));
            return;
        }
        
        // if user doesn't specify options then we need to assume defaults
        var entryType = (options && options.entryType) ? options.entryType : 'information';
        var tableName = (options && options.table) ? options.table : 'loggerdefault';
        var partition = (options && options.partition) ? options.partition : 'default';
        
        var tableService = azure.createTableService();
        var entityGenerator = azure.TableUtilities.entityGenerator;
        
        var newEntity = {
            PartitionKey: entityGenerator.String(partition),
            RowKey: entityGenerator.String(uuid.v4()),
            type: entityGenerator.String(entryType),
            data: entityGenerator.String(JSON.stringify(entry))
        };
        
        tableService.createTableIfNotExists(tableName, function (err, result, response) {
            if (err) {
                callback(err);
            }
            else {
                tableService.insertEntity(tableName, newEntity, {echoContent: true}, function (err, result, response) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        callback(undefined, JSON.parse(result.data._));
                    }
                });
            }
        });
    }
};

module.exports = logger;