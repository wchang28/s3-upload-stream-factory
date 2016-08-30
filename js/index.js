var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var aws_sdk_1 = require('aws-sdk');
var _ = require('lodash');
var stream = require('stream');
var Transformer = (function (_super) {
    __extends(Transformer, _super);
    function Transformer(opts) {
        _super.call(this, opts);
    }
    Transformer.prototype._transform = function (chunk, encoding, callback) {
        callback(null, chunk);
    };
    return Transformer;
}(stream.Transform));
function get(options) {
    return (function (params) {
        var transformer = new Transformer();
        var s3 = new aws_sdk_1.S3();
        var s3Params = {
            "Bucket": options.Bucket,
            "Key": options.KeyMaker(params),
            "Body": transformer
        };
        if (options.additonalS3Options)
            s3Params = _.assignIn(s3Params, options.additonalS3Options);
        transformer.on('pipe', function () {
            s3.upload(s3Params, function (err, data) {
                if (err)
                    transformer.emit('error', err);
                else
                    transformer.emit('close');
            });
        });
        var ws = transformer;
        return { stream: ws, streamInfo: s3Params };
    });
}
exports.get = get;
