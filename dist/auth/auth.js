"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_request_1 = require("../utils/api-request");
const REFRESH_TOKEN_METHOD = 'POST';
const ENDPOINT = 'https://logintestlf.hwcloudtest.cn/oauth2/token';
class AuthClient {
    constructor(conf) {
        this._httpClient = new api_request_1.HttpClient();
        this.config = conf;
    }
    get httpClient() {
        return this._httpClient;
    }
    get token() {
        return this._token;
    }
    refreshToken() {
        return __awaiter(this, void 0, void 0, function* () {
            let option = {};
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
        });
    }
}
exports.AuthClient = AuthClient;
//# sourceMappingURL=auth.js.map