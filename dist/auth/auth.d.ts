import { HttpClient } from '../utils/api-request';
import { HcmConfig } from '../types';
export declare class AuthClient {
    private _httpClient;
    private config;
    private _token;
    constructor(conf: HcmConfig);
    readonly httpClient: HttpClient;
    readonly token: string;
    refreshToken(): Promise<string>;
}
//# sourceMappingURL=auth.d.ts.map