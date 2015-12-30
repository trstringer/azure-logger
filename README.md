# Azure Logger

Node.js is a first-class citizen in Azure.  Logging is a necessary and important requirement of any application, and this module makes it extremely easy to quickly log entries (and subsequently read them) into an Azure storage table for later consumption/troubleshooting/etc.

**TL;DR** *an easy way to log messages/entries/errors in Azure*

## Installation

```
npm install azure-logger
```

## Usage

*This module uses the [`azure-storage`](https://www.npmjs.com/package/azure-storage) module to connect to Azure storage, therefore you should set the following environment variables...*
 - *AZURE_STORAGE_ACCOUNT*: storage account (found in Azure portal)
 - *AZURE_STORAGE_ACCESS_KEY*: storage account access key (found in Azure portal)

### Write entry to Azure log (using defaults)

```javascript
var logger = require('azure-logger');

// use the default options including the default 
// table name "loggerdefault" and an entry type 
// of "information"
logger.log(myObject, function (err, res) {
    if (!err) {
        // successfully inserted object, which 
        // is returned as the res param
    }
});
```
### Write entry to Azure log (options)

```javascript
var logger = require('azure-logger');

// log to a specific table and with a specified 
// entry type
var options = {
    table: 'mytable',
    entryType: 'warning'
};
logger.log(myObject, options, function (err, res) {
    if (!err) {
        // success
    }
});
```

**options** *(optional)*
- *table*: the name of the specific table to insert the entry into (default: "loggerdefault")
- *partition*: the name of the partition to insert entry into (default: "default")
- *entryType*: type of entry (default: "information")

### Read entries from the Azure log (default table)

```javascript
var logger = require('azure-logger');

logger.get(function (err, entries) {
    if (!err) {
        // success
    }
});
```

### Read entries from the Azure log (specific table)

```javascript
var logger = require('azure-logger');

var options = {
    table: 'mytable'
};
logger.get(options, function (err, entries) {
    if (!err) {
        // success
    }
});
```

**entries** *array of entries in log table returned by get()*
 - *entry*: this is the original inserted object
 - *type*: the specified entry type
 - *Timestamp*: the date when the entry was originally inserted