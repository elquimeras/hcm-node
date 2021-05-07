import {
  HttpClient,
  HttpRequestConfig,
  HttpMethod,
} from '../utils/api-request';
import { HcmConfig } from '../types';
const REFRESH_TOKEN_METHOD: HttpMethod = 'POST';
const ENDPOINT = 'https://logintestlf.hwcloudtest.cn/oauth2/token';

export class AuthClient {
  private _httpClient: HttpClient;
  private config: HcmConfig;
  private _token: string;
  constructor(conf: HcmConfig) {
    this._httpClient = new HttpClient();
    this.config = conf;
  }

  get httpClient(): HttpClient {
    return this._httpClient;
  }

  get token(): string {
    return this._token;
  }

  public async refreshToken() {
    let option: HttpRequestConfig = {} as any;
    option.uri = this.config.authUrl ? this.config.authUrl : ENDPOINT;
    option.headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    option.form = {
      grant_type: 'client_credentials',
      client_secret: this.config.appSecret,
      client_id: this.config.appId,
    };
    option.method = REFRESH_TOKEN_METHOD;
    option.json = true;
    return this._httpClient.sendWithRetry(option).then((res) => {
      this._token = res.data.access_token;
      return this._token;
    });
  }
}
