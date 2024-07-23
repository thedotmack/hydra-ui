export function createNonce() {
    return `${randomString()}${randomString()}${randomString()}`;
}
function randomString() {
    return (Math.random() + 1).toString(36).substring(7);
}
//# sourceMappingURL=nonce.js.map