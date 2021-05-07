# hcm-node

Node.js package code encapsulates APIs of the HUAWEI Push Kit server.

## Installation

```bash
$ npm i hcm-node
```

## Usage

```typescript
import HCM from 'hcm-node';
import { Messaging } from 'hcm-node/dist/push/messaging';

const hcm = new HCM();
hcm.init({
  appId: '<YOUR-APP-ID>',
  appSecret: '<YOUR-APP-SECRET>',
  authUrl: 'https://oauth-login.cloud.huawei.com/oauth2/v2/token',
  pushUrl: 'https://push-api.cloud.huawei.com/v1'
);
const hcmDispatcher = hcm.messaging().messaging;

try {
  const response = hcmDispatcher.send(message, false);

  /**
   * HCM Response code for success = 80000000
   * more info @ https://developer.huawei.com/consumer/en/doc/development/HMS-References/push-sendapi
  */
  if (response.code != '80000000') {
    throwError(response);
  }
} catch(error) {
  throwError(error);
}

function throwError(detail: any): void {
  console.error({
      message: 'push notification dispatch failed',
      details: error,
    });

  throw new Error('External error');
}

```

## Configuration

| Initialization Parameter | Description                                                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------------------------------- |
| AppId                    | App ID, which is obtained from app information.                                                               |
| AppSecret                | Secret access key of an app, which is obtained from app information.                                          |
| AuthUrl                  | URL for the Huawei OAuth 2.0 service to obtain a token, please refer to Generating an App-Level Access Token. |
| PushUrl                  | URL for accessing HUAWEI Push Kit, please refer to Sending Messages.                                          |

| Request Parameter | Description                                                         |
| ----------------- | ------------------------------------------------------------------- |
| TargetTopic       | Name of a topic to be subscribed to, unsubscribed from, or queried. |
| TargetCondition   | Combination of condition expressions for a message.                 |
| TargetToken       | Token of a destination device.                                      |
| TargetTokenArray  | Tokens of destination devices.                                      |
