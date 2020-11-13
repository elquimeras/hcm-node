export interface HcmServiceNamespace<T> {
  [key: string]: T;
}

export interface HcmConfig {
  appId: string;
  appSecret: string;
  authUrl?: string;
  pushUrl?: string;
}
