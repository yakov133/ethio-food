const https = require("https");

require("dotenv").config();

const DEFAULT_ADMIN_EMAILS = [
  "yakov133@walla.com",
  "ofekavi1104@gmail.com",
];

// Runtime envs let production change Firebase/admin settings without editing code.
const firebaseApiKey = process.env.FIREBASE_API_KEY
  || process.env.REACT_APP_FIREBASE_API_KEY
  || "AIzaSyDBeYMdSNAk0KglYfPOg6DygYyinxRfugo";

const adminEmails = (process.env.ADMIN_EMAILS || DEFAULT_ADMIN_EMAILS.join(","))
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

function getBearerToken(req) {
  const header = req.get("authorization") || "";
  const [scheme, token] = header.split(" ");
  return scheme && scheme.toLowerCase() === "bearer" ? token : null;
}

// Uses Node's HTTPS client so the server does not need an extra axios dependency.
function postJson(url, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const parsedUrl = new URL(url);
    const request = https.request(
      {
        method: "POST",
        hostname: parsedUrl.hostname,
        path: `${parsedUrl.pathname}${parsedUrl.search}`,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (response) => {
        let responseBody = "";

        response.on("data", (chunk) => {
          responseBody += chunk;
        });

        response.on("end", () => {
          let data = {};
          if (responseBody) {
            try {
              data = JSON.parse(responseBody);
            } catch (err) {
              err.status = 502;
              reject(err);
              return;
            }
          }

          if (response.statusCode < 200 || response.statusCode >= 300) {
            const err = new Error("Firebase authentication failed");
            err.status = 401;
            reject(err);
            return;
          }

          resolve(data);
        });
      }
    );

    request.setTimeout(10000, () => {
      request.destroy(new Error("Firebase request timed out"));
    });
    request.on("error", reject);
    request.write(payload);
    request.end();
  });
}

async function verifyFirebaseToken(idToken) {
  if (!firebaseApiKey) {
    const err = new Error("Firebase API key is not configured");
    err.status = 500;
    throw err;
  }

  const data = await postJson(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseApiKey}`,
    { idToken }
  );

  const firebaseUser = data && data.users && data.users[0];
  if (!firebaseUser) {
    const err = new Error("Invalid authentication token");
    err.status = 401;
    throw err;
  }

  return {
    localId: firebaseUser.localId,
    email: (firebaseUser.email || "").toLowerCase(),
  };
}

// Required for every route that changes data or exposes user-owned data.
async function requireAuth(req, res, next) {
  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: "Authentication is required" });
  }

  try {
    req.user = await verifyFirebaseToken(token);
    return next();
  } catch (err) {
    return res.status(err.status || 401).json({ error: "Invalid authentication token" });
  }
}

// Allows public reads, while still attaching req.user when a valid token is present.
async function optionalAuth(req, res, next) {
  const token = getBearerToken(req);
  if (!token) {
    return next();
  }

  try {
    req.user = await verifyFirebaseToken(token);
    return next();
  } catch (err) {
    // Public read routes must keep working even if the browser holds an expired Firebase token.
    req.user = null;
    return next();
  }
}

function isAdminUser(user) {
  return Boolean(user && user.email && adminEmails.includes(user.email.toLowerCase()));
}

// Keeps admin decisions on the server; the client-side admin link is only UI.
function requireAdmin(req, res, next) {
  if (!isAdminUser(req.user)) {
    return res.status(403).json({ error: "Admin permission is required" });
  }

  return next();
}

// Protects "my recipes" routes from reading another user's localId.
function requireSelfOrAdmin(req, res, next) {
  if (isAdminUser(req.user) || req.params.localId === req.user.localId) {
    return next();
  }

  return res.status(403).json({ error: "You can only access your own recipes" });
}

module.exports = {
  requireAuth,
  optionalAuth,
  requireAdmin,
  requireSelfOrAdmin,
  isAdminUser,
};
