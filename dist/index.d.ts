import { Messaging } from './push/messaging';
import { Topic } from './push/topic';
import { MessagingConfig } from './push/modle/message';
import { TopicConfig } from './push/modle/topic';
import { HcmConfig, HcmService } from './types';
export default class HcmNode {
    private authClient;
    private config;
    init(conf: HcmConfig): void;
    auth(): Promise<string>;
    messaging(conf?: MessagingConfig): HcmService<Messaging>;
    topic(tconf?: TopicConfig): HcmService<Topic>;
    private checkInit;
}
//# sourceMappingURL=index.d.ts.map