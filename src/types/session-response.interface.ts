export interface SessionResponseInterface {
  sessionId: string;
  sessionSecret: string;
  "loginUrls": {
    [provider: string]: string;
  }
}
