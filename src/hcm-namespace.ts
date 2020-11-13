import { Messaging } from './push/messaging';
import { Topic } from './push/topic';
import { MessagingConfig } from './push/modle/message';
import { TopicConfig } from './push/modle/topic';
import { AuthClient } from './auth/auth';
import { HcmConfig, HcmServiceNamespace } from './types';

export class HcmNamespace {
  private authClient: AuthClient;
  private config: HcmConfig;

  public init(conf: HcmConfig) {
    this.config = conf;
    this.authClient = new AuthClient(conf);
  }

  public async auth() {
    if (!this.checkInit()) {
      return;
    }
    let token = await this.authClient.refreshToken();
    return token;
  }

  public messaging(conf?: MessagingConfig): HcmServiceNamespace<Messaging> {
    if (!this.checkInit()) {
      return;
    }
    if (!conf) {
      conf = {
        devappid: this.config.appId,
      };
    }
    conf.devappid = conf.devappid ? conf.devappid : this.config.appId;
    conf.messagingUrl = conf.messagingUrl
      ? conf.messagingUrl
      : this.config.pushUrl;
    let messaging = new Messaging(conf, this.authClient);

    return { messaging };
  }

  public topic(tconf?: TopicConfig): HcmServiceNamespace<Topic> {
    if (!this.checkInit()) {
      return;
    }
    if (!tconf) {
      tconf = {
        devappid: this.config.appId,
      };
    }
    tconf.devappid = tconf.devappid ? tconf.devappid : this.config.appId;
    tconf.topicUrl = tconf.topicUrl ? tconf.topicUrl : this.config.pushUrl;
    let topic = new Topic(tconf, this.authClient);

    return { topic };
  }

  private checkInit() {
    if (!this.config || !this.config.appId || !this.config.appSecret) {
      throw new Error('appId or appsecret is null, please init Hcm first!');
    }
    return true;
  }
}
