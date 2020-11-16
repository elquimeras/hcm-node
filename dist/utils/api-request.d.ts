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
/// <reference types="node" />
/**
 * Specifies how failing HTTP requests should be retried.
 */
export interface RetryConfig {
    /** Maximum number of times to retry a given request. */
    maxRetries: number;
    /** HTTP status codes that should be retried. */
    statusCodes?: number[];
    /** Low-level I/O error codes that should be retried. */
    ioErrorCodes?: string[];
    /**
     * The multiplier for exponential back off. When the backOffFactor is setto 0, retries are not delayed.
     * When the backOffFactor is 1, retry duration is doubled each iteration.
     */
    backOffFactor?: number;
    /** Maximum duration to wait before initiating a retry. */
    maxDelayInMillis: number;
}
/**
 * Default retry configuration for HTTP requests. Retries up to 4 times on connection reset and timeout errors
 * as well as HTTP 503 errors. Exposed as a function to ensure that every HttpClient gets its own RetryConfig
 * instance.
 */
export declare function defaultRetryConfig(): RetryConfig;
/**
 * Represents an HTTP response received from a remote server.
 */
export interface HttpResponse {
    readonly status: number;
    readonly headers: any;
    /** Response data as a raw string. */
    readonly text: string;
    /** Response data as a parsed JSON object. */
    readonly data: any;
    /** For multipart responses, the payloads of individual parts. */
    readonly multipart?: Buffer[];
    /**
     * Indicates if the response content is JSON-formatted or not. If true, data field can be used
     * to retrieve the content as a parsed JSON object.
     */
    isJson(): boolean;
}
export declare class HttpClient {
    private readonly retry;
    constructor(retry?: RetryConfig);
    /**
     * Sends an HTTP request to a remote server.
     *
     * @param {HttpRequest} config HTTP request to be sent.
     * @return {Promise<HttpResponse>} A promise that resolves with the response details.
     */
    send(config: HttpRequestConfig): Promise<HttpResponse>;
    /**
     * Meet the conditions, repeat the request.
     *
     * @param {HttpRequest} config HTTP request to be sent.
     * @return {Promise<HttpResponse>} A promise that resolves with the response details.
     */
    sendWithRetry(config: HttpRequestConfig, retryAttempts?: number): Promise<HttpResponse>;
    private waitForRetry;
    /**
     * Parses the Retry-After HTTP header as a milliseconds value. Return value is negative if the Retry-After header
     * contains an expired timestamp or otherwise malformed.
     */
    private parseRetryAfterIntoMillis;
    private backOffDelayMillis;
    /**
     * Checks if a failed request is eligible for a retry, and if so returns the duration to wait before initiating
     * the retry.
     *
     * @param {number} retryAttempts Number of retries completed up to now.
     * @param {LowLevelError} err The last encountered error.
     * @returns {[number, boolean]} A 2-tuple where the 1st element is the duration to wait before another retry, and the
     *     2nd element is a boolean indicating whether the request is eligible for a retry or not.
     */
    private getRetryDelayMillis;
    private isRetryEligible;
}
export declare type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD";
export interface HttpRequestConfig {
    method: HttpMethod;
    /** Target URL of the request. Should be a well-formed URL including protocol, hostname, port and path. */
    uri: string;
    headers?: {
        [key: string]: string;
    };
    body?: string | object | Buffer;
    /** Connect and read timeout (in milliseconds) for the outgoing request. */
    timeout?: number;
    json?: boolean;
    form?: object;
    resolveWithFullResponse?: boolean;
}
export declare const ENDPOINT = "https://pushtrslftest.hwcloudtest.cn:28446/v1";
export declare const TOKENTIMEOUTERR = "80200003";
export declare const TOKENFAILEDERR = "80200001";
//# sourceMappingURL=api-request.d.ts.map