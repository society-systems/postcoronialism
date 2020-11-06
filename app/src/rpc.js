import jaysonBrowserClient from "jayson/lib/client/browser";
import nacl from "tweetnacl";

function getEndpoint() {
  const { protocol, hostname } = window.location;
  if (hostname === "localhost") {
    return `${protocol}//${hostname}:8001`;
  } else {
    return `${protocol}//${hostname}/rpc`;
  }
}

const ENDPOINT = getEndpoint();

const callServer = (keyPair) => (request, callback) => {
  let signatureHeaders = {};
  if (keyPair) {
    signatureHeaders["psst-public-key"] = Buffer.from(
      keyPair.publicKey
    ).toString("hex");
    signatureHeaders["psst-signature"] = Buffer.from(
      nacl.sign.detached(new TextEncoder().encode(request), keyPair.secretKey)
    ).toString("hex");
  }
  const options = {
    method: "POST",
    body: request,
    headers: {
      "Content-Type": "application/json",
      ...signatureHeaders,
    },
  };

  fetch(ENDPOINT, options)
    .then(function (res) {
      return res.text();
    })
    .then(function (val) {
      callback(null, val);
    })
    .catch(function (err) {
      callback(err);
    });
};

export function call(method, ...args) {
  return {
    send: (keyPair) => {
      const client = jaysonBrowserClient(callServer(keyPair), {});
      return new Promise((resolve, reject) => {
        client.request(method, args, (error, result) => {
          if (error) {
            reject(error);
          } else {
            if (result.error) {
              reject(result.error);
            } else {
              resolve(result.result);
            }
          }
        });
      });
    },
  };
}

export function rpcJoinSpace(userName, invite) {
  return call("joinSpace", userName, invite);
}

export function rpcGetSecret() {
  return call("getSecret");
}

export function rpcSetSecret(value, nonce) {
  return call("setSecret", value, nonce);
}

export function rpcGetSpace() {
  return call("getSpace");
}

export function rpcGetInviteDetails(user) {
  return call("getInviteDetails", user);
}

export function rpcHasSpace(spaceName) {
  return call("hasSpace", spaceName);
}

export function rpcCreateSpace(spaceName, userName) {
  return call("createSpace", spaceName, userName);
}
