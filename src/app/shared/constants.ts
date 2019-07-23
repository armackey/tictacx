
const SERVER_PORT = 9000;
export const SERVER_HOST = (
  typeof window !== 'undefined' ? (
    window.location.protocol + '//' +
    window.location.hostname
  ) : 'http://localhost'
) + ':' + SERVER_PORT;

// export { SERVER_HOST };
