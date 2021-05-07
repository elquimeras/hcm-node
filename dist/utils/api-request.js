"use strict";
/*!
 * Copyright 2019 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * 2020.1.15-Changed Refer to send request method (send) and retry send
 * request method (sendWithRetry)
 *                                          Huawei Technologies Co., Ltd.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_promise_1 = __importDefault(require("request-promise"));
const validator = __importStar(require("./validator"));
function send(options) {
    return __awaiter(this, void 0, void 0, function* () {
        options.resolveWithFullResponse = true;
        return request_promise_1.default(options)
            .then(result => {
            return Promise.resolve(createHttpResponse(result));
        })
            .catch(err => {
            return Promise.reject(err);
        });
    });
}
/**
 * Default retry configuration for HTTP requests. Retries up to 4 times on connection reset and timeout errors
 * as well as HTTP 503 errors. Exposed as a function to ensure that every HttpClient gets its own RetryConfig
 * instance.
 */
function defaultRetryConfig() {
    return {
        maxRetries: 4,
        statusCodes: [503],
        ioErrorCodes: ["ECONNRESET", "ETIMEDOUT"],
        backOffFactor: 0.5,
        maxDelayInMillis: 60 * 1000
    };
}
exports.defaultRetryConfig = defaultRetryConfig;
/**
 * Ensures that the given RetryConfig object is valid.
 *
 * @param retry The configuration to be validated.
 */
function validateRetryConfig(retry) {
    if (!validator.isNumber(retry.maxRetries) || retry.maxRetries < 0) {
        throw new Error("maxRetries must be a non-negative integer");
    }
    if (typeof retry.backOffFactor !== "undefined") {
        if (!validator.isNumber(retry.backOffFactor) || retry.backOffFactor < 0) {
            throw new Error("backOffFactor must be a non-negative number");
        }
    }
    if (!validator.isNumber(retry.maxDelayInMillis) || retry.maxDelayInMillis < 0) {
        throw new Error("maxDelayInMillis must be a non-negative integer");
    }
    if (typeof retry.statusCodes !== "undefined" && !Array.isArray(retry.statusCodes)) {
        throw new Error("statusCodes must be an array");
    }
    if (typeof retry.ioErrorCodes !== "undefined" && !Array.isArray(retry.ioErrorCodes)) {
        throw new Error("ioErrorCodes must be an array");
    }
}
class DefaultHttpResponse {
    /**
     * Constructs a new HttpResponse from the given LowLevelResponse.
     */
    constructor(resp) {
        this.status = resp.statusCode;
        this.headers = resp.headers;
        let body = resp.body || "";
        this.text = validator.isString(body) ? body : JSON.stringify(body);
        try {
            this.parsedData = validator.isString(body) ? JSON.parse(body) : body;
        }
        catch (err) {
            this.parsedData = undefined;
            this.parseError = err;
        }
        this.request = resp.request;
    }
    get data() {
        if (this.isJson()) {
            return this.parsedData;
        }
        throw new Error(`Error while parsing response data: "${this.parseError.toString()}". Raw server ` +
            `response: "${this.text}". Status code: "${this.status}". Outgoing ` +
            `request: "${this.request}."`);
    }
    isJson() {
        return !!this.parsedData;
    }
}
function createHttpResponse(resp) {
    if (!resp) {
        return;
    }
    return new DefaultHttpResponse(resp);
}
class HttpClient {
    constructor(retry = defaultRetryConfig()) {
        this.retry = retry;
        if (this.retry) {
            validateRetryConfig(this.retry);
        }
    }
    /**
     * Sends an HTTP request to a remote server.
     *
     * @param {HttpRequest} config HTTP request to be sent.
     * @return {Promise<HttpResponse>} A promise that resolves with the response details.
     */
    send(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return send(config)
                .then(resp => {
                return resp;
            })
                .catch(err => {
                if (err.response) {
                    throw new Error(JSON.stringify(createHttpResponse(err.response)));
                }
                if (err.error.code === "ETIMEDOUT") {
                    throw new Error(`Error while making request: ${err.message}.`);
                }
                throw new Error(`Error while making request: ${err.message}. Error code: ${err.error.code}`);
            });
        });
    }
    /**
     * Meet the conditions, repeat the request.
     *
     * @param {HttpRequest} config HTTP request to be sent.
     * @return {Promise<HttpResponse>} A promise that resolves with the response details.
     */
    sendWithRetry(config, retryAttempts = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            return send(config)
                .then(resp => {
                return resp;
            })
                .catch(err => {
                const [delayMillis, canRetry] = this.getRetryDelayMillis(retryAttempts, err);
                if (canRetry && delayMillis <= this.retry.maxDelayInMillis) {
                    return this.waitForRetry(delayMillis).then(() => {
                        return this.sendWithRetry(config, retryAttempts + 1);
                    });
                }
                if (err.response) {
                    throw new Error(JSON.stringify(createHttpResponse(err.response)));
                }
                if (err.error.code === "ETIMEDOUT") {
                    throw new Error(`Error while making request: ${err.message}.`);
                }
                throw new Error(`Error while making request: ${err.message}. Error code: ${err.error.code}`);
            });
        });
    }
    waitForRetry(delayMillis) {
        return __awaiter(this, void 0, void 0, function* () {
            if (delayMillis > 0) {
                return new Promise(resolve => {
                    setTimeout(resolve, delayMillis);
                });
            }
            return Promise.resolve();
        });
    }
    /**
     * Parses the Retry-After HTTP header as a milliseconds value. Return value is negative if the Retry-After header
     * contains an expired timestamp or otherwise malformed.
     */
    parseRetryAfterIntoMillis(retryAfter) {
        const delaySeconds = parseInt(retryAfter, 10);
        if (!isNaN(delaySeconds)) {
            return delaySeconds * 1000;
        }
        const date = new Date(retryAfter);
        if (!isNaN(date.getTime())) {
            return date.getTime() - Date.now();
        }
        return -1;
    }
    backOffDelayMillis(retryAttempts) {
        if (retryAttempts === 0) {
            return 0;
        }
        const backOffFactor = this.retry.backOffFactor || 0;
        const delayInSeconds = Math.pow(2, retryAttempts) * backOffFactor;
        return Math.min(delayInSeconds * 1000, this.retry.maxDelayInMillis);
    }
    /**
     * Checks if a failed request is eligible for a retry, and if so returns the duration to wait before initiating
     * the retry.
     *
     * @param {number} retryAttempts Number of retries completed up to now.
     * @param {LowLevelError} err The last encountered error.
     * @returns {[number, boolean]} A 2-tuple where the 1st element is the duration to wait before another retry, and the
     *     2nd element is a boolean indicating whether the request is eligible for a retry or not.
     */
    getRetryDelayMillis(retryAttempts, err) {
        if (!this.isRetryEligible(retryAttempts, err)) {
            return [0, false];
        }
        let response = err.response;
        let headers = response ? response.headers : undefined;
        if (headers && headers["retry-after"]) {
            const delayMillis = this.parseRetryAfterIntoMillis(headers["retry-after"]);
            if (delayMillis > 0) {
                return [delayMillis, true];
            }
        }
        return [this.backOffDelayMillis(retryAttempts), true];
    }
    isRetryEligible(retryAttempts, err) {
        if (!this.retry) {
            return false;
        }
        if (retryAttempts >= this.retry.maxRetries) {
            return false;
        }
        if (err.response) {
            const statusCodes = this.retry.statusCodes || [];
            return statusCodes.indexOf(err.response.status) !== -1;
        }
        const retryCodes = this.retry.ioErrorCodes || [];
        return retryCodes.indexOf(err.error.code) !== -1;
    }
}
exports.HttpClient = HttpClient;
exports.ENDPOINT = "https://pushtrslftest.hwcloudtest.cn:28446/v1";
exports.TOKENTIMEOUTERR = "80200003";
exports.TOKENFAILEDERR = "80200001";
//# sourceMappingURL=api-request.js.map