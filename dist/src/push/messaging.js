"use strict";
/*!
 * Copyright 2020. Huawei Technologies Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
const message_validator_1 = require("./message-validator");
const SEND_METHOD = "POST";
class Messaging {
    constructor(conf, auth) {
        this.config = conf;
        this.authClient = auth;
        this._httpClient = new api_request_1.HttpClient(conf.retryConfig);
    }
    send(message, validationOnly = false, dryRun = true) {
        return __awaiter(this, void 0, void 0, function* () {
            let request = {
                validate_only: validationOnly,
                message
            };
            if (!this.authClient) {
                throw new Error("can't refresh token because getting auth client fail");
            }
            if (!this.authClient.token) {
                yield this.authClient.refreshToken();
            }
            let result = yield this.sendRequest(request, dryRun);
            if (result.code === api_request_1.TOKENTIMEOUTERR) {
                yield this.authClient.refreshToken();
                result = yield this.sendRequest(request, dryRun);
            }
            return result;
        });
    }
    sendRequest(req, dryRun) {
        return __awaiter(this, void 0, void 0, function* () {
            message_validator_1.validateMessage(req.message);
            let option = {};
            let url = this.config.messagingUrl ? this.config.messagingUrl : api_request_1.ENDPOINT;
            option.uri = `${url}/${this.config.devappid}/messages:send`;
            option.headers = {
                "Content-Type": "application/json;charset=utf-8",
                Authorization: `Bearer ${this.authClient.token}`
            };
            option.body = req;
            option.method = SEND_METHOD;
            option.json = true;
            if (dryRun) {
                return this._httpClient.sendWithRetry(option).then(res => {
                    let data = res.data;
                    return data;
                });
            }
            return this._httpClient.send(option).then(res => {
                let data = res.data;
                return data;
            });
        });
    }
}
exports.Messaging = Messaging;
//# sourceMappingURL=messaging.js.map