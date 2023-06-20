import {CredentialsInterface} from './types/credentials.interface';
import {isUUID} from "class-validator";
import {SessionResponseInterface} from "./types/session-response.interface";
import request from 'axios';
import {SessionUserDataInterface} from "./types/session-user-data.interface";
// @ts-ignore
import JSCrypto from "jscrypto";

const settings = {
  host: 'https://api.authbird.com',
  api: {
    getEncryptionKey: '/encryption/key',
    session: '/session'
  },
  maxGetSessionDataRetryCount: 20
}

const states: { credentials: CredentialsInterface, initialized: boolean } = {
  credentials: {
    appId: '',
    appSecret: ''
  },
  initialized: false
}

const utils: { [functionName: string]: Function } = {
  resetCredentials: (): void => {
    states.credentials.appId = '';
    states.credentials.appSecret = '';
  },
  wait: (seconds: number): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        return resolve();
      }, 1000 * seconds);
    });
  }
}

export async function init(initData: CredentialsInterface): Promise<boolean> {

  if (!isUUID(initData.appId)) {
    utils.resetCredentials();
    return false;
  }

  if (!isUUID(initData.appSecret)) {
    utils.resetCredentials();
    return false;
  }

  states.credentials.appId = initData.appId;
  states.credentials.appSecret = initData.appSecret;

  states.initialized = true;
  return true;
}

export const session: { [functionName: string]: Function } = {
  create: async (): Promise<SessionResponseInterface> => {
    if (!states.initialized) {
      return Promise.reject('SDK not initialized. Please call the "init" function first');
    }

    const data = JSON.stringify({
      appId: states.credentials.appId,
      appSecret: states.credentials.appSecret,
      timestamp: Date.now()
    });

    const encryptedData = JSCrypto.AES.encrypt(data, states.credentials.appSecret).toString();

    const response = await request.post(settings.host + settings.api.session, {
      appId: states.credentials.appId,
      encryptedData
    });

    return response.data;
  },
  getUserData: async (sessionSecret: string, count: number): Promise<SessionUserDataInterface> => {
    if (!isUUID(sessionSecret)) {
      return Promise.reject('Invalid sessionSecret');
    }

    if (settings.maxGetSessionDataRetryCount >= count) {
      await session.delete(sessionSecret);
      return Promise.reject('Timeout reached. Session deleted. Please try it again');
    }

    try {
      const response = await request.get(settings.host + settings.api.session + '/' + sessionSecret);

      if (response.data && Object.keys(response.data).length === 0 && response.data.constructor === Object) {
        await utils.wait(5);
        return session.getUserData(sessionSecret, count + 1);
      }

      return response.data;
    } catch (e) {
      console.error(e);
      return Promise.reject('Invalid sessionSecret');
    }

  },
  delete: async (sessionSecret: string) => {

    if (!isUUID(sessionSecret)) {
      return Promise.reject('Invalid sessionSecret');
    }

    try {
      const response = await request.delete(settings.host + settings.api.session + '/' + sessionSecret);

      return response.data;
    } catch (e) {
      console.error(e);
      return Promise.reject('Invalid sessionSecret');
    }
  }
}

export const browser: { [functionName: string]: Function } = {
  loginUser: async (provider: string): Promise<SessionUserDataInterface> => {
    const newSession = await session.create();

    const availableProviders = Object.keys(newSession.loginUrls);

    if (!availableProviders.includes(provider)) {
      await session.delete(newSession.sessionSecret);
      return Promise.reject('Invalid provider');
    }

    // @ts-ignore
    window.open(newSession.loginUrls[provider], '_blank');

    await utils.wait(10);

    return session.getUserData(newSession.sessionSecret, 0);
  }
}

export default {
  init,
  session,
  browser
}
