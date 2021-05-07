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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Number check.
 *
 * @param {any} value
 * @return {boolean} Whether the value is a number or not.
 */
function isNumber(value) {
    return typeof value === "number" && !isNaN(value);
}
exports.isNumber = isNumber;
/**
 * String check.
 *
 * @param {any} value
 * @return {boolean} Whether the value is a string or not.
 */
function isString(value) {
    return typeof value === "string";
}
exports.isString = isString;
/**
 * Non-empty string check.
 *
 * @param {any} value
 * @return {boolean} Whether the value is a non-empty string or not.
 */
function isNonEmptyString(value) {
    return value !== "" && isString(value);
}
exports.isNonEmptyString = isNonEmptyString;
//# sourceMappingURL=validator.js.map