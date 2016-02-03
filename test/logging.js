var assert = require('assert');
var logger = require('../index');
var uuid = require('node-uuid');

describe('Logging to Azure table', function () {
    this.timeout(0);
  
    it('should successfully log entry with defaults', function (done) {
        logger.log({myData: 1, whatever: uuid.v4()}, function (err, res) {
            assert.equal(err, null);
            done();
        });
    });
    
    it('should return an equal object after insert with defaults', function (done) {
        var entry = {myData: 1, whatever: uuid.v4()};
        logger.log(entry, function (err, res) {
            assert.deepEqual(entry, res);
            done();
        });
    });
    
    it('should have entries when read with defaults', function (done) {
        var entry = {myData: 1, whatever: uuid.v4()};
        logger.log(entry, function (err, res) {
            logger.get(function (err, entries) {
                assert.ok(entries.length > 0);
                done();
            });
        });
    });
    
    it('should successfully log entry with non default options', function (done) {
        var entry = {myData: 1, whatever: uuid.v4()};
        var options = {
            table: 'nondefault',
            entryType: 'warning'
        };
        logger.log(entry, options, function (err, res) {
            assert.equal(err, null);
            done();
        });
    });
    
    it('should return an equal object after insert with non default options', function (done) {
        var entry = {myData: 1, whatever: uuid.v4()};
        var options = {
            table: 'nondefault',
            entryType: 'warning'
        };
        logger.log(entry, options, function (err, res) {
            assert.deepEqual(res, entry);
            done();
        });
    });
    
    it('should have entries when read with non default options', function (done) {
        var entry = {myData: 1, whatever: uuid.v4()};
        var options = {
            table: 'nondefault',
            entryType: 'warning'
        };
        logger.log(entry, options, function (err, res) {
            logger.get(options, function (err, entries) {
                assert.ok(entries.length > 0);
                done();
            });
        });
    });
});