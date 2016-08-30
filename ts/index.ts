import * as busboyPipe from 'busboy-pipe';
import * as express from 'express';
import {S3} from 'aws-sdk';
import * as _ from 'lodash';
import * as stream from 'stream';

export interface KeyMaker {
    (params: busboyPipe.FilePipeParams) : string
}

export interface Options {
    Bucket: string;
    KeyMaker: KeyMaker;
    additonalS3Options?: any
}

class Transformer extends stream.Transform {
    constructor(opts?: stream.TransformOptions) {
        super(opts);
    }
    _transform(chunk: any, encoding: string, callback: Function): void {
        callback(null, chunk);
    }
}

export function get(options: Options) : busboyPipe.WriteStreamFactory {
    return ((params: busboyPipe.FilePipeParams) : busboyPipe.WriteStreamInfo => {
        let transformer = new Transformer();
        let s3 = new S3();
        let s3Params:any = {
            "Bucket": options.Bucket,
            "Key": options.KeyMaker(params)
            ,"Body": transformer
        };
        if (options.additonalS3Options) s3Params = _.assignIn(s3Params, options.additonalS3Options);
        transformer.on('pipe', () => {
            s3.upload(s3Params, (err:any, data: any) => {
                if (err)
                    transformer.emit('error', err);
                else
                    transformer.emit('close');
            })
        });
        let ws:any = transformer;
        return {stream: ws, streamInfo: s3Params};
    });
}