const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}`);
const host = [url.host, url.pathname].join('').replace(/\/$/, '');
const IS_HTTPS = url.protocol.replace(':', '') === 'https';

export const API_URL = `${IS_HTTPS ? 'https' : 'http'}://${host}/graphql`;
export const WS_API_URL = `${IS_HTTPS ? 'wss' : 'ws'}://${host}/graphql`;

export const is_git = process.env.GITHUB_PAGES === 'true';
