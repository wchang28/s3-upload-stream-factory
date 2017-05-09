"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var AWS = require("aws-sdk");
var _ = require("lodash");
var stream = require("stream");
var Transformer = (function (_super) {
    __extends(Transformer, _super);
    function Transformer(opts) {
        return _super.call(this, opts) || this;
    }
    Transformer.prototype._transform = function (chunk, encoding, callback) {
        callback(null, chunk);
    };
    return Transformer;
}(stream.Transform));
function get(options) {
    return (function (params) {
        var Bucket = (options && options.Bucket ? options.Bucket : null);
        var Key = null;
        if (options && options.KeyMaker && typeof options.KeyMaker === 'function')
            Key = options.KeyMaker(params);
        if (Bucket && Key) {
            var transformer_1 = new Transformer();
            var s3_1 = new AWS.S3();
            var s3Params_1 = {
                Bucket: Bucket,
                Key: Key,
                Body: transformer_1,
                ContentType: params.fileInfo.mimetype
            };
            if (options && options.additonalS3Options)
                s3Params_1 = _.assignIn(s3Params_1, options.additonalS3Options);
            transformer_1.on('pipe', function () {
                s3_1.upload(s3Params_1, function (err, data) {
                    if (err)
                        transformer_1.emit('error', err);
                    else {
                        if (data.ETag)
                            s3Params_1.ETag = data.ETag;
                        if (data.Location)
                            s3Params_1.Location = data.Location;
                        transformer_1.emit('close');
                    }
                });
            });
            var ws = transformer_1;
            return { stream: ws, streamInfo: s3Params_1 };
        }
        else {
            return { stream: null, streamInfo: null };
        }
    });
}
exports.get = get;
