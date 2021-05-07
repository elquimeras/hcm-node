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
