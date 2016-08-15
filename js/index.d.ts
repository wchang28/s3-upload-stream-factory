import * as busboyPipe from 'busboy-pipe';
export interface KeyMaker {
    (params: busboyPipe.FilePipeParams): string;
}
export interface Options {
    Bucket: string;
    KeyMaker: KeyMaker;
    additonalS3Options?: any;
}
export declare function get(options: Options): busboyPipe.WriteStreamFactory;
