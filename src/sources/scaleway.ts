import fs from 'fs';
import aws4 from 'aws4';
import axios from 'axios';
import { injectable } from 'inversify';
import { SECRET_SCALEWAY_JSON } from '../constants';

// Load Scaleway file exists
let config: ScalewayConfig;
try {
    const jsonConfig = fs.readFileSync(SECRET_SCALEWAY_JSON, 'utf8');
    config = JSON.parse(jsonConfig);
} catch (err) {
    if (err.code === 'ENOENT') {
        console.error('Scaleway config file not found');
        process.exit(1);
    } else {
        throw err;
    }
}


export interface ScalewayConfig {
    accessKeyId: string,
    secretAccessKey: string,
    region: string,
    endpoint: string
}

export interface AWS4Sign {
    path: string,
    host: string,
    headers: { [ key: string ]: string }
}

@injectable()
export class Scaleway {
    /**
      * Upload a file to the app's Scaleway bucket.
      * The file is uploaded by default as world-readable
      *
      * @param file File path or already opened read stream
      * @param path Path where to save the file on the remote bucket
      */
    async uploadFile(file: string | NodeJS.ReadableStream, path: string): Promise<void> {
        let stream: NodeJS.ReadableStream;

        if (typeof file === 'string')
            stream = fs.createReadStream(file);
        else
            stream = file;

        const sign = this.sign(config, 'PUT', path);
        const url = 'https://' + config.endpoint + '/' + path;
        return axios.put(url, stream, {
            headers: {
                ...sign.headers,
                'x-amz-acl': 'public-read'
            }
        });
    } 

    /**
      * The request is signed with AWS4
      *
      * @param config JSON Scaleway configuration
      * @param method HTTP method
      * @param path HTTP path to the object
      * @return AWS4 signed request info
      */
    private sign(config: ScalewayConfig,
                 method: string,
                 path: string): AWS4Sign {
        return aws4.sign({
            service: 's3',
            region: config.region,
            method,
            path,
            host: config.endpoint,
            headers: {
                'Content-Type': 'application/octet-stream'
            },
        }, config);
    }
}
