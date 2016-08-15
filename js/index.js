var aws_sdk_1 = require('aws-sdk');
var _ = require('lodash');
var s3Stream = require('s3-upload-stream')(new aws_sdk_1.S3());
function get(options) {
    return (function (params) {
        var s3Params = {
            "Bucket": options.Bucket,
            "Key": options.KeyMaker(params)
        };
        if (options.additonalS3Options)
            s3Params = _.assignIn(s3Params, options.additonalS3Options);
        var upload = s3Stream.upload(s3Params);
        upload.on('uploaded', function (details) {
            upload.emit('close');
        });
        return { stream: upload, streamInfo: s3Params };
    });
}
exports.get = get;
