import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signOut,
} from "firebase/auth";

// --- Firebase Configuration ---
let firebaseAuth = null;
let useFirebase = false;

const isFirebaseConfigured =
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_API_KEY !== "YOUR_API_KEY";

if (isFirebaseConfigured) {
  try {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };
    const app = initializeApp(firebaseConfig);
    firebaseAuth = getAuth(app);
    useFirebase = true;
    console.log("🔥 Firebase Auth initialized successfully");
  } catch (error) {
    console.warn("⚠️ Failed to initialize Firebase Auth, falling back to simulation:", error);
  }
} else {
  console.log("ℹ️ No VITE_FIREBASE_API_KEY found, running in simulated popup mode.");
}

// --- Database Operations (LocalStorage Database) ---
export const saveUserToDatabase = (user) => {
  const db = JSON.parse(localStorage.getItem("registered_users") || "[]");
  const exists = db.find((u) => u.uid === user.uid);
  if (!exists) {
    const newUser = {
      uid: user.uid,
      displayName: user.displayName || "Unknown User",
      email: user.email || "No Email",
      photoURL:
        user.photoURL ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
      providerId: user.providerId || "unknown",
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    db.push(newUser);
    localStorage.setItem("registered_users", JSON.stringify(db));
    console.log("📦 Created user in local database:", newUser);
    return newUser;
  } else {
    exists.lastLogin = new Date().toISOString();
    // Maintain profile pic updates if any
    if (user.photoURL) exists.photoURL = user.photoURL;
    localStorage.setItem("registered_users", JSON.stringify(db));
    console.log("📦 Updated user last login in local database:", exists);
    return exists;
  }
};

// --- Mock Popup Simulator ---
const openMockPopup = (provider) => {
  return new Promise((resolve, reject) => {
    const width = 480;
    const height = 580;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      "",
      "_blank",
      `width=${width},height=${height},left=${left},top=${top},scrollbars=no,resizable=no`
    );

    if (!popup) {
      reject(new Error("Popup blocked by browser. Please enable popups."));
      return;
    }

    let accountsHtml = "";
    if (provider === "Google") {
      accountsHtml = `
        <div class="avatar-item" onclick="selectUser('Alex Mercer', 'alex.mercer@gmail.com', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80')">
          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" alt="">
          <div class="info">
            <span class="name">Alex Mercer</span>
            <span class="email">alex.mercer@gmail.com</span>
          </div>
        </div>
        <div class="avatar-item" onclick="selectUser('Sarah Connor', 'sarah.connor@sky.net', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80')">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="">
          <div class="info">
            <span class="name">Sarah Connor</span>
            <span class="email">sarah.connor@sky.net</span>
          </div>
        </div>
      `;
    } else if (provider === "Apple ID") {
      accountsHtml = `
        <div class="avatar-item" onclick="selectUser('Marcus Aurelius', 'marcus.aurelius@icloud.com', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80')">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="">
          <div class="info">
            <span class="name">Marcus Aurelius</span>
            <span class="email">marcus.aurelius@icloud.com</span>
          </div>
        </div>
        <div class="avatar-item" onclick="selectUser('Ada Lovelace', 'ada.lovelace@apple.com', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80')">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="">
          <div class="info">
            <span class="name">Ada Lovelace</span>
            <span class="email">ada.lovelace@apple.com</span>
          </div>
        </div>
      `;
    } else {
      // Facebook
      accountsHtml = `
        <div class="avatar-item" onclick="selectUser('Tony Stark', 'tony.stark@starkindustries.com', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80')">
          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="">
          <div class="info">
            <span class="name">Tony Stark</span>
            <span class="email">tony.stark@starkindustries.com</span>
          </div>
        </div>
        <div class="avatar-item" onclick="selectUser('Diana Prince', 'diana.prince@themiscira.org', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80')">
          <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" alt="">
          <div class="info">
            <span class="name">Diana Prince</span>
            <span class="email">diana.prince@themiscira.org</span>
          </div>
        </div>
      `;
    }

    popup.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sign in with ${provider}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background: #F2EDE4;
            color: #1f2937;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            overflow: hidden;
          }
          .card {
            background: white;
            padding: 2.25rem 2rem;
            border-radius: 1.75rem;
            box-shadow: 0 20px 40px -15px rgba(0,0,0,0.06);
            text-align: center;
            max-width: 380px;
            width: 100%;
            border: 1px solid #f3f4f6;
            animation: slideIn 0.3s ease-out;
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          h2 {
            margin: 0 0 0.5rem 0;
            font-weight: 700;
            font-size: 1.35rem;
            color: #111827;
          }
          p {
            color: #6b7280;
            font-size: 0.85rem;
            margin: 0 0 2rem 0;
            line-height: 1.4;
          }
          .brand-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
            background: #f3f4f6;
            color: #4b5563;
            padding: 0.25rem 0.65rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            margin-bottom: 1.25rem;
          }
          .avatar-list {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }
          .avatar-item {
            display: flex;
            align-items: center;
            gap: 0.85rem;
            padding: 0.85rem 1rem;
            border: 1px solid #e5e7eb;
            border-radius: 1.15rem;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            background: white;
            text-align: left;
          }
          .avatar-item:hover {
            border-color: #FAB915;
            background: #FFFDF9;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(250, 185, 21, 0.08);
          }
          .avatar-item img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #fff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }
          .avatar-item .info {
            display: flex;
            flex-direction: column;
            gap: 0.15rem;
          }
          .avatar-item .info span.name {
            font-size: 0.875rem;
            font-weight: 600;
            color: #111827;
          }
          .avatar-item .info span.email {
            font-size: 0.75rem;
            color: #9ca3af;
            font-weight: 400;
          }
          .cancel-btn {
            background: transparent;
            border: none;
            color: #9ca3af;
            font-size: 0.85rem;
            margin-top: 1.75rem;
            cursor: pointer;
            font-weight: 500;
            transition: color 0.15s;
          }
          .cancel-btn:hover {
            color: #4b5563;
            text-decoration: underline;
          }
          .footer-text {
            font-size: 0.7rem;
            color: #d1d5db;
            margin-top: 2rem;
            font-weight: 500;
            letter-spacing: 0.025em;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="brand-badge">${provider} OAuth 2.0</div>
          <h2>Sign in with ${provider}</h2>
          <p>Choose an account to proceed securely to your <strong>Smart Motor System</strong> dashboard.</p>
          
          <div class="avatar-list">
            ${accountsHtml}
          </div>
          
          <button class="cancel-btn" onclick="cancelLogin()">Cancel</button>
          
          <div class="footer-text">
            SECURE SIMULATION WORKFLOW
          </div>
        </div>
        
        <script>
          function selectUser(name, email, photo) {
            window.opener.postMessage({
              type: 'oauth-success',
              provider: '${provider}',
              user: {
                displayName: name,
                email: email,
                photoURL: photo,
                uid: '${provider.toLowerCase().replace(" ", "")}_' + Math.random().toString(36).substring(2, 11),
                providerId: '${provider}'
              }
            }, window.location.origin);
            window.close();
          }

          function cancelLogin() {
            window.opener.postMessage({
              type: 'oauth-cancel',
              provider: '${provider}'
            }, window.location.origin);
            window.close();
          }
        </script>
      </body>
      </html>
    `);
    popup.document.close();

    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data && event.data.provider === provider) {
        if (event.data.type === "oauth-success") {
          window.removeEventListener("message", handleMessage);
          resolve(event.data.user);
        } else if (event.data.type === "oauth-cancel") {
          window.removeEventListener("message", handleMessage);
          reject(new Error("Authentication cancelled by user."));
        }
      }
    };
    window.addEventListener("message", handleMessage);

    // Watch for direct window close (X button)
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        window.removeEventListener("message", handleMessage);
        setTimeout(() => {
          reject(new Error("Authentication popup was closed before completion."));
        }, 1500); // Allow brief postMessage delay buffer
      }
    }, 500);
  });
};

// --- Google Auth Handler ---
export const authenticateWithGoogle = async () => {
  if (useFirebase && firebaseAuth) {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(firebaseAuth, provider);
    return saveUserToDatabase(result.user);
  } else {
    const user = await openMockPopup("Google");
    return saveUserToDatabase(user);
  }
};

// --- Apple ID Auth Handler ---
export const authenticateWithApple = async () => {
  if (useFirebase && firebaseAuth) {
    const provider = new OAuthProvider("apple.com");
    const result = await signInWithPopup(firebaseAuth, provider);
    return saveUserToDatabase(result.user);
  } else {
    const user = await openMockPopup("Apple ID");
    return saveUserToDatabase(user);
  }
};

// --- Facebook Auth Handler ---
export const authenticateWithFacebook = async () => {
  if (useFirebase && firebaseAuth) {
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(firebaseAuth, provider);
    return saveUserToDatabase(result.user);
  } else {
    const user = await openMockPopup("Facebook");
    return saveUserToDatabase(user);
  }
};

// --- Sign Out ---
export const logout = async () => {
  if (useFirebase && firebaseAuth) {
    await signOut(firebaseAuth);
  }
  localStorage.removeItem("active_user_session");
};

// --- Session Verification ---
export const getSessionUser = () => {
  const session = localStorage.getItem("active_user_session");
  return session ? JSON.parse(session) : null;
};

export const saveSessionUser = (user) => {
  localStorage.setItem("active_user_session", JSON.stringify(user));
};
