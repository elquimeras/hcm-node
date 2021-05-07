import HcmNode from './src/index';

const hcmAdmin = new HcmNode();
(hcmAdmin as any).default = hcmAdmin;

export = hcmAdmin;
