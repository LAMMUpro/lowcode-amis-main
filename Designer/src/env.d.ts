import {StoreType} from '@/store/index';

declare global {
  interface Window {
    store: StoreType
  }
}

export {}