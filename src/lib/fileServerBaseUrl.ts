/**
 * Base URL for the HTTP file server (upload + GET /files/{bucket}/{name}).
 * Must match the axios baseURL in `src/app/fileServerApi.js` (REACT_APP_HTTP_FILE_SERVER_API_BASE_URL).
 */
export function getFileServerBaseUrl(): string {
    return (
        process.env.REACT_APP_FILE_SERVER_URL?.trim() ||
        process.env.REACT_APP_HTTP_FILE_SERVER_API_BASE_URL?.trim() ||
        process.env.REACT_APP_API_BASE_URL?.trim() ||
        ''
    );
}
