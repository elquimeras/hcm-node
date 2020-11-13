import { HcmNamespace } from './src/hcm-namespace';

const hcmAdmin = new HcmNamespace();
(hcmAdmin as any).default = hcmAdmin;

export = hcmAdmin;
