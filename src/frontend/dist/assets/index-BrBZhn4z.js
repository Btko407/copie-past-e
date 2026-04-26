var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _rawKey, _derKey, _publicKey, _privateKey, _inner, _delegation, _options;
import { t as tslib_es6 } from "./tslib.es6-CQlO25gN.js";
import { aw as getAugmentedNamespace, ax as requireCjs$1, ay as requireEd25519$1, az as requireUtils, aA as cjsExports$1, aB as cjsExports$2, aC as requireCjs$2, ai as commonjsGlobal, aD as requireCjs$3 } from "./index-jL7ZpINP.js";
function _mergeNamespaces(n, m) {
  for (var i = 0; i < m.length; i++) {
    const e = m[i];
    if (typeof e !== "string" && !Array.isArray(e)) {
      for (const k in e) {
        if (k !== "default" && !(k in n)) {
          const d = Object.getOwnPropertyDescriptor(e, k);
          if (d) {
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: () => e[k]
            });
          }
        }
      }
    }
  }
  return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }));
}
var src = {};
const require$$0 = /* @__PURE__ */ getAugmentedNamespace(tslib_es6);
var manager = {};
var makeIframe = {};
var constants = {};
var hasRequiredConstants;
function requireConstants() {
  if (hasRequiredConstants) return constants;
  hasRequiredConstants = 1;
  Object.defineProperty(constants, "__esModule", { value: true });
  constants.IFRAME_ID = void 0;
  constants.IFRAME_ID = "nfid-embed";
  return constants;
}
var getIframe = {};
var hasRequiredGetIframe;
function requireGetIframe() {
  if (hasRequiredGetIframe) return getIframe;
  hasRequiredGetIframe = 1;
  Object.defineProperty(getIframe, "__esModule", { value: true });
  getIframe.getIframe = void 0;
  const constants_1 = requireConstants();
  const getIframe$1 = () => {
    const nfidIframe = document.getElementById(constants_1.IFRAME_ID);
    if (!nfidIframe || !nfidIframe.contentWindow) {
      throw new Error("nfid iframe not initialized");
    }
    return nfidIframe;
  };
  getIframe.getIframe = getIframe$1;
  return getIframe;
}
var hasRequiredMakeIframe;
function requireMakeIframe() {
  if (hasRequiredMakeIframe) return makeIframe;
  hasRequiredMakeIframe = 1;
  (function(exports$1) {
    Object.defineProperty(exports$1, "__esModule", { value: true });
    exports$1.buildIframe = exports$1.baseStyle = void 0;
    const constants_1 = requireConstants();
    const get_iframe_1 = requireGetIframe();
    exports$1.baseStyle = {
      position: "fixed",
      top: "0",
      left: "0",
      border: "none",
      width: "100%",
      height: "100%",
      zIndex: "9999",
      background: "rgba(9,10,19,0.5)",
      display: "none"
    };
    const buildQuery = (params) => {
      console.debug("buildQuery", { params });
      const keys = Object.keys(params).filter((key) => Boolean(params[key]));
      return keys.length ? Object.keys(params).reduce((acc, key, index2) => {
        const prefix = index2 === 0 ? "?" : "&";
        return `${acc}${prefix}${key}=${params[key]}`;
      }, "") : "";
    };
    const buildIframe = ({ origin, applicationLogo, applicationName, onLoad }) => {
      console.debug("buildIframe");
      const QUERY = buildQuery({ applicationLogo, applicationName });
      const PATH = "embed";
      const PROVIDER_URL = new URL(`${origin}/${PATH}${QUERY}`);
      console.debug("buildIframe", { PROVIDER_URL, QUERY, PATH });
      let nfidIframe;
      try {
        nfidIframe = (0, get_iframe_1.getIframe)();
      } catch (e) {
        nfidIframe = document.createElement("iframe");
      }
      nfidIframe.id = constants_1.IFRAME_ID;
      nfidIframe.src = PROVIDER_URL.href;
      nfidIframe.allow = "publickey-credentials-get";
      Object.assign(nfidIframe.style, exports$1.baseStyle);
      nfidIframe.onload = onLoad;
      document.body.appendChild(nfidIframe);
      return nfidIframe;
    };
    exports$1.buildIframe = buildIframe;
  })(makeIframe);
  return makeIframe;
}
var hasRequiredManager;
function requireManager() {
  if (hasRequiredManager) return manager;
  hasRequiredManager = 1;
  Object.defineProperty(manager, "__esModule", { value: true });
  manager.IframeManager = void 0;
  const make_iframe_1 = requireMakeIframe();
  class IframeManager {
    static init({ providerUrl, onLoad }) {
      console.debug("IframeManager.constructor", { providerUrl });
      IframeManager._iframe = (0, make_iframe_1.buildIframe)({ origin: providerUrl, onLoad });
    }
    static show() {
      if (!this._iframe)
        throw new Error("IframeManager not initialized");
      Object.assign(this._iframe.style, Object.assign(Object.assign({}, make_iframe_1.baseStyle), { display: "block" }));
    }
    static hide() {
      if (!this._iframe)
        throw new Error("IframeManager not initialized");
      Object.assign(this._iframe.style, Object.assign(Object.assign({}, make_iframe_1.baseStyle), { display: "none" }));
    }
    static isVisible() {
      return false;
    }
  }
  manager.IframeManager = IframeManager;
  return manager;
}
var nfid = {};
var mountIframe = {};
var hasRequiredMountIframe;
function requireMountIframe() {
  if (hasRequiredMountIframe) return mountIframe;
  hasRequiredMountIframe = 1;
  Object.defineProperty(mountIframe, "__esModule", { value: true });
  mountIframe.hideIframe = mountIframe.showIframe = mountIframe.mountIframe = void 0;
  const tslib_1 = require$$0;
  const get_iframe_1 = requireGetIframe();
  const make_iframe_1 = requireMakeIframe();
  const mountIframe$1 = ({ iframe, onLoad }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    console.debug("mountIframe", { iframe });
    window.document.body.appendChild(iframe);
    iframe.onload = onLoad;
  });
  mountIframe.mountIframe = mountIframe$1;
  const showIframe = () => {
    const iframe = (0, get_iframe_1.getIframe)();
    if (!iframe)
      return;
    console.debug("showIframe", { iframe });
    Object.assign(iframe.style, Object.assign(Object.assign({}, make_iframe_1.baseStyle), { display: "block" }));
  };
  mountIframe.showIframe = showIframe;
  const hideIframe = () => {
    const iframe = (0, get_iframe_1.getIframe)();
    if (!iframe)
      return;
    console.debug("hideIframe", { iframe });
    Object.assign(iframe.style, Object.assign(Object.assign({}, make_iframe_1.baseStyle), { display: "none" }));
  };
  mountIframe.hideIframe = hideIframe;
  return mountIframe;
}
var authentication = {};
var authClient = {};
var cjsExports = requireCjs$1();
var ed25519Exports = requireEd25519$1();
var utilsExports = requireUtils();
function isObject(value) {
  return value !== null && typeof value === "object";
}
const _Ed25519PublicKey = class _Ed25519PublicKey {
  // `fromRaw` and `fromDer` should be used for instantiation, not this constructor.
  constructor(key) {
    __privateAdd(this, _rawKey);
    __privateAdd(this, _derKey);
    if (key.byteLength !== _Ed25519PublicKey.RAW_KEY_LENGTH) {
      throw new Error("An Ed25519 public key must be exactly 32bytes long");
    }
    __privateSet(this, _rawKey, key);
    __privateSet(this, _derKey, _Ed25519PublicKey.derEncode(key));
  }
  /**
   * Construct Ed25519PublicKey from an existing PublicKey
   * @param {unknown} maybeKey - existing PublicKey, ArrayBuffer, DerEncodedPublicKey, or hex string
   * @returns {Ed25519PublicKey} Instance of Ed25519PublicKey
   */
  static from(maybeKey) {
    if (typeof maybeKey === "string") {
      const key = utilsExports.hexToBytes(maybeKey);
      return this.fromRaw(key);
    } else if (isObject(maybeKey)) {
      const key = maybeKey;
      if (isObject(key) && Object.hasOwnProperty.call(key, "__derEncodedPublicKey__")) {
        return this.fromDer(key);
      } else if (ArrayBuffer.isView(key)) {
        const view = key;
        return this.fromRaw(cjsExports.uint8FromBufLike(view.buffer));
      } else if (key instanceof ArrayBuffer) {
        return this.fromRaw(cjsExports.uint8FromBufLike(key));
      } else if ("rawKey" in key && key.rawKey instanceof Uint8Array) {
        return this.fromRaw(key.rawKey);
      } else if ("derKey" in key) {
        return this.fromDer(key.derKey);
      } else if ("toDer" in key) {
        return this.fromDer(key.toDer());
      }
    }
    throw new Error("Cannot construct Ed25519PublicKey from the provided key.");
  }
  static fromRaw(rawKey) {
    return new _Ed25519PublicKey(rawKey);
  }
  static fromDer(derKey) {
    return new _Ed25519PublicKey(this.derDecode(derKey));
  }
  static derEncode(publicKey) {
    const key = cjsExports$1.wrapDER(publicKey, cjsExports$1.ED25519_OID);
    key.__derEncodedPublicKey__ = void 0;
    return key;
  }
  static derDecode(key) {
    const unwrapped = cjsExports$1.unwrapDER(key, cjsExports$1.ED25519_OID);
    if (unwrapped.length !== this.RAW_KEY_LENGTH) {
      throw new Error("An Ed25519 public key must be exactly 32bytes long");
    }
    return unwrapped;
  }
  get rawKey() {
    return __privateGet(this, _rawKey);
  }
  get derKey() {
    return __privateGet(this, _derKey);
  }
  toDer() {
    return this.derKey;
  }
  toRaw() {
    return this.rawKey;
  }
};
_rawKey = new WeakMap();
_derKey = new WeakMap();
_Ed25519PublicKey.RAW_KEY_LENGTH = 32;
let Ed25519PublicKey = _Ed25519PublicKey;
const _Ed25519KeyIdentity = class _Ed25519KeyIdentity extends cjsExports$1.SignIdentity {
  // `fromRaw` and `fromDer` should be used for instantiation, not this constructor.
  constructor(publicKey, privateKey) {
    super();
    __privateAdd(this, _publicKey);
    __privateAdd(this, _privateKey);
    __privateSet(this, _publicKey, Ed25519PublicKey.from(publicKey));
    __privateSet(this, _privateKey, privateKey);
  }
  /**
   * Generate a new Ed25519KeyIdentity.
   * @param seed a 32-byte seed for the private key. If not provided, a random seed will be generated.
   * @returns Ed25519KeyIdentity
   */
  static generate(seed) {
    if (seed && seed.length !== 32) {
      throw new Error("Ed25519 Seed needs to be 32 bytes long.");
    }
    if (!seed)
      seed = ed25519Exports.ed25519.utils.randomPrivateKey();
    if (cjsExports.uint8Equals(seed, new Uint8Array(new Array(32).fill(0)))) {
      console.warn("Seed is all zeros. This is not a secure seed. Please provide a seed with sufficient entropy if this is a production environment.");
    }
    const sk = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      sk[i] = seed[i];
    }
    const pk = ed25519Exports.ed25519.getPublicKey(sk);
    return _Ed25519KeyIdentity.fromKeyPair(pk, sk);
  }
  static fromParsedJson(obj) {
    const [publicKeyDer, privateKeyRaw] = obj;
    return new _Ed25519KeyIdentity(Ed25519PublicKey.fromDer(utilsExports.hexToBytes(publicKeyDer)), utilsExports.hexToBytes(privateKeyRaw));
  }
  static fromJSON(json) {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) {
      if (typeof parsed[0] === "string" && typeof parsed[1] === "string") {
        return this.fromParsedJson([parsed[0], parsed[1]]);
      } else {
        throw new Error("Deserialization error: JSON must have at least 2 items.");
      }
    }
    throw new Error(`Deserialization error: Invalid JSON type for string: ${JSON.stringify(json)}`);
  }
  static fromKeyPair(publicKey, privateKey) {
    return new _Ed25519KeyIdentity(Ed25519PublicKey.fromRaw(publicKey), privateKey);
  }
  static fromSecretKey(secretKey) {
    const publicKey = ed25519Exports.ed25519.getPublicKey(secretKey);
    return _Ed25519KeyIdentity.fromKeyPair(publicKey, secretKey);
  }
  /**
   * Serialize this key to JSON.
   */
  toJSON() {
    return [utilsExports.bytesToHex(__privateGet(this, _publicKey).toDer()), utilsExports.bytesToHex(__privateGet(this, _privateKey))];
  }
  /**
   * Return a copy of the key pair.
   */
  getKeyPair() {
    return {
      secretKey: __privateGet(this, _privateKey),
      publicKey: __privateGet(this, _publicKey)
    };
  }
  /**
   * Return the public key.
   */
  getPublicKey() {
    return __privateGet(this, _publicKey);
  }
  /**
   * Signs a blob of data, with this identity's private key.
   * @param challenge - challenge to sign with this identity's secretKey, producing a signature
   */
  async sign(challenge) {
    const signature = ed25519Exports.ed25519.sign(challenge, __privateGet(this, _privateKey).slice(0, 32));
    Object.defineProperty(signature, "__signature__", {
      enumerable: false,
      value: void 0
    });
    return signature;
  }
  /**
   * Verify
   * @param sig - signature to verify
   * @param msg - message to verify
   * @param pk - public key
   * @returns - true if the signature is valid, false otherwise
   */
  static verify(sig, msg, pk) {
    const [signature, message, publicKey] = [sig, msg, pk].map((x) => {
      if (typeof x === "string") {
        x = utilsExports.hexToBytes(x);
      }
      return cjsExports.uint8FromBufLike(x);
    });
    return ed25519Exports.ed25519.verify(signature, message, publicKey);
  }
};
_publicKey = new WeakMap();
_privateKey = new WeakMap();
let Ed25519KeyIdentity = _Ed25519KeyIdentity;
class CryptoError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    Object.setPrototypeOf(this, CryptoError.prototype);
  }
}
function _getEffectiveCrypto(subtleCrypto) {
  if (typeof global !== "undefined" && global["crypto"] && global["crypto"]["subtle"]) {
    return global["crypto"]["subtle"];
  }
  if (subtleCrypto) {
    return subtleCrypto;
  } else if (typeof crypto !== "undefined" && crypto["subtle"]) {
    return crypto.subtle;
  } else {
    throw new CryptoError("Global crypto was not available and none was provided. Please inlcude a SubtleCrypto implementation. See https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto");
  }
}
class ECDSAKeyIdentity extends cjsExports$1.SignIdentity {
  /**
   * Generates a randomly generated identity for use in calls to the Internet Computer.
   * @param {CryptoKeyOptions} options optional settings
   * @param {CryptoKeyOptions['extractable']} options.extractable - whether the key should allow itself to be used. Set to false for maximum security.
   * @param {CryptoKeyOptions['keyUsages']} options.keyUsages - a list of key usages that the key can be used for
   * @param {CryptoKeyOptions['subtleCrypto']} options.subtleCrypto interface
   * @returns a {@link ECDSAKeyIdentity}
   */
  static async generate(options) {
    const { extractable = false, keyUsages = ["sign", "verify"], subtleCrypto } = options ?? {};
    const effectiveCrypto = _getEffectiveCrypto(subtleCrypto);
    const keyPair = await effectiveCrypto.generateKey({
      name: "ECDSA",
      namedCurve: "P-256"
    }, extractable, keyUsages);
    const derKey = cjsExports.uint8FromBufLike(await effectiveCrypto.exportKey("spki", keyPair.publicKey));
    Object.assign(derKey, {
      __derEncodedPublicKey__: void 0
    });
    return new this(keyPair, derKey, effectiveCrypto);
  }
  /**
   * generates an identity from a public and private key. Please ensure that you are generating these keys securely and protect the user's private key
   * @param keyPair a CryptoKeyPair
   * @param subtleCrypto - a SubtleCrypto interface in case one is not available globally
   * @returns an {@link ECDSAKeyIdentity}
   */
  static async fromKeyPair(keyPair, subtleCrypto) {
    const effectiveCrypto = _getEffectiveCrypto(subtleCrypto);
    const derKey = cjsExports.uint8FromBufLike(await effectiveCrypto.exportKey("spki", keyPair.publicKey));
    Object.assign(derKey, {
      __derEncodedPublicKey__: void 0
    });
    return new ECDSAKeyIdentity(keyPair, derKey, effectiveCrypto);
  }
  // `fromKeyPair` and `generate` should be used for instantiation, not this constructor.
  constructor(keyPair, derKey, subtleCrypto) {
    super();
    this._keyPair = keyPair;
    this._derKey = derKey;
    this._subtleCrypto = subtleCrypto;
  }
  /**
   * Return the internally-used key pair.
   * @returns a CryptoKeyPair
   */
  getKeyPair() {
    return this._keyPair;
  }
  /**
   * Return the public key.
   * @returns an {@link PublicKey & DerCryptoKey}
   */
  getPublicKey() {
    const derKey = this._derKey;
    const key = Object.create(this._keyPair.publicKey);
    key.toDer = function() {
      return derKey;
    };
    return key;
  }
  /**
   * Signs a blob of data, with this identity's private key.
   * @param {Uint8Array} challenge - challenge to sign with this identity's secretKey, producing a signature
   * @returns {Promise<Signature>} signature
   */
  async sign(challenge) {
    const params = {
      name: "ECDSA",
      hash: { name: "SHA-256" }
    };
    const signature = cjsExports.uint8FromBufLike(await this._subtleCrypto.sign(params, this._keyPair.privateKey, challenge));
    Object.assign(signature, {
      __signature__: void 0
    });
    return signature;
  }
}
class PartialIdentity {
  constructor(inner) {
    __privateAdd(this, _inner);
    __privateSet(this, _inner, inner);
  }
  /**
   * The raw public key of this identity.
   */
  get rawKey() {
    return __privateGet(this, _inner).rawKey;
  }
  /**
   * The DER-encoded public key of this identity.
   */
  get derKey() {
    return __privateGet(this, _inner).derKey;
  }
  /**
   * The DER-encoded public key of this identity.
   */
  toDer() {
    return __privateGet(this, _inner).toDer();
  }
  /**
   * The inner {@link PublicKey} used by this identity.
   */
  getPublicKey() {
    return __privateGet(this, _inner);
  }
  /**
   * The {@link Principal} of this identity.
   */
  getPrincipal() {
    if (!__privateGet(this, _inner).rawKey) {
      throw new Error("Cannot get principal from a public key without a raw key.");
    }
    return cjsExports$2.Principal.fromUint8Array(new Uint8Array(__privateGet(this, _inner).rawKey));
  }
  /**
   * Required for the Identity interface, but cannot implemented for just a public key.
   */
  transformRequest() {
    return Promise.reject("Not implemented. You are attempting to use a partial identity to sign calls, but this identity only has access to the public key.To sign calls, use a DelegationIdentity instead.");
  }
}
_inner = new WeakMap();
function safeBytesToHex(data) {
  if (data instanceof Uint8Array) {
    return utilsExports.bytesToHex(data);
  }
  return utilsExports.bytesToHex(new Uint8Array(data));
}
function _parseBlob(value) {
  if (typeof value !== "string" || value.length < 64) {
    throw new Error("Invalid public key.");
  }
  return utilsExports.hexToBytes(value);
}
class Delegation {
  constructor(pubkey, expiration, targets) {
    this.pubkey = pubkey;
    this.expiration = expiration;
    this.targets = targets;
  }
  toCborValue() {
    return {
      pubkey: this.pubkey,
      expiration: this.expiration,
      ...this.targets && {
        targets: this.targets
      }
    };
  }
  toJSON() {
    return {
      expiration: this.expiration.toString(16),
      pubkey: safeBytesToHex(this.pubkey),
      ...this.targets && { targets: this.targets.map((p) => p.toHex()) }
    };
  }
}
async function _createSingleDelegation(from, to, expiration, targets) {
  const delegation2 = new Delegation(
    to.toDer(),
    BigInt(+expiration) * BigInt(1e6),
    // In nanoseconds.
    targets
  );
  const challenge = new Uint8Array([
    ...cjsExports$1.IC_REQUEST_AUTH_DELEGATION_DOMAIN_SEPARATOR,
    ...new Uint8Array(cjsExports$1.requestIdOf({ ...delegation2 }))
  ]);
  const signature = await from.sign(challenge);
  return {
    delegation: delegation2,
    signature
  };
}
class DelegationChain {
  /**
   * Create a delegation chain between two (or more) keys. By default, the expiration time
   * will be very short (15 minutes).
   *
   * To build a chain of more than 2 identities, this function needs to be called multiple times,
   * passing the previous delegation chain into the options argument. For example:
   * @example
   * const rootKey = createKey();
   * const middleKey = createKey();
   * const bottomeKey = createKey();
   *
   * const rootToMiddle = await DelegationChain.create(
   *   root, middle.getPublicKey(), Date.parse('2100-01-01'),
   * );
   * const middleToBottom = await DelegationChain.create(
   *   middle, bottom.getPublicKey(), Date.parse('2100-01-01'), { previous: rootToMiddle },
   * );
   *
   * // We can now use a delegation identity that uses the delegation above:
   * const identity = DelegationIdentity.fromDelegation(bottomKey, middleToBottom);
   * @param from The identity that will delegate.
   * @param to The identity that gets delegated. It can now sign messages as if it was the
   *           identity above.
   * @param expiration The length the delegation is valid. By default, 15 minutes from calling
   *                   this function.
   * @param options A set of options for this delegation. expiration and previous
   * @param options.previous - Another DelegationChain that this chain should start with.
   * @param options.targets - targets that scope the delegation (e.g. Canister Principals)
   */
  static async create(from, to, expiration = new Date(Date.now() + 15 * 60 * 1e3), options = {}) {
    var _a, _b;
    const delegation2 = await _createSingleDelegation(from, to, expiration, options.targets);
    return new DelegationChain([...((_a = options.previous) == null ? void 0 : _a.delegations) || [], delegation2], ((_b = options.previous) == null ? void 0 : _b.publicKey) || from.getPublicKey().toDer());
  }
  /**
   * Creates a DelegationChain object from a JSON string.
   * @param json The JSON string to parse.
   */
  static fromJSON(json) {
    const { publicKey, delegations } = typeof json === "string" ? JSON.parse(json) : json;
    if (!Array.isArray(delegations)) {
      throw new Error("Invalid delegations.");
    }
    const parsedDelegations = delegations.map((signedDelegation) => {
      const { delegation: delegation2, signature } = signedDelegation;
      const { pubkey, expiration, targets } = delegation2;
      if (targets !== void 0 && !Array.isArray(targets)) {
        throw new Error("Invalid targets.");
      }
      return {
        delegation: new Delegation(
          _parseBlob(pubkey),
          BigInt("0x" + expiration),
          // expiration in JSON is an hexa string (See toJSON() below).
          targets && targets.map((t) => {
            if (typeof t !== "string") {
              throw new Error("Invalid target.");
            }
            return cjsExports$2.Principal.fromHex(t);
          })
        ),
        signature: _parseBlob(signature)
      };
    });
    return new this(parsedDelegations, _parseBlob(publicKey));
  }
  /**
   * Creates a DelegationChain object from a list of delegations and a DER-encoded public key.
   * @param delegations The list of delegations.
   * @param publicKey The DER-encoded public key of the key-pair signing the first delegation.
   */
  static fromDelegations(delegations, publicKey) {
    return new this(delegations, publicKey);
  }
  constructor(delegations, publicKey) {
    this.delegations = delegations;
    this.publicKey = publicKey;
  }
  toJSON() {
    return {
      delegations: this.delegations.map((signedDelegation) => {
        const { delegation: delegation2, signature } = signedDelegation;
        const { targets } = delegation2;
        return {
          delegation: {
            expiration: delegation2.expiration.toString(16),
            pubkey: safeBytesToHex(delegation2.pubkey),
            ...targets && {
              targets: targets.map((t) => t.toHex())
            }
          },
          signature: safeBytesToHex(signature)
        };
      }),
      publicKey: safeBytesToHex(this.publicKey)
    };
  }
}
class DelegationIdentity extends cjsExports$1.SignIdentity {
  /**
   * Create a delegation without having access to delegateKey.
   * @param key The key used to sign the requests.
   * @param delegation A delegation object created using `createDelegation`.
   */
  static fromDelegation(key, delegation2) {
    return new this(key, delegation2);
  }
  constructor(_inner2, _delegation2) {
    super();
    this._inner = _inner2;
    this._delegation = _delegation2;
  }
  getDelegation() {
    return this._delegation;
  }
  getPublicKey() {
    return {
      derKey: this._delegation.publicKey,
      toDer: () => this._delegation.publicKey
    };
  }
  sign(blob) {
    return this._inner.sign(blob);
  }
  async transformRequest(request) {
    const { body, ...fields } = request;
    const requestId = await cjsExports$1.requestIdOf(body);
    return {
      ...fields,
      body: {
        content: body,
        sender_sig: await this.sign(new Uint8Array([...cjsExports$1.IC_REQUEST_DOMAIN_SEPARATOR, ...new Uint8Array(requestId)])),
        sender_delegation: this._delegation.delegations,
        sender_pubkey: this._delegation.publicKey
      }
    };
  }
}
const _PartialDelegationIdentity = class _PartialDelegationIdentity extends PartialIdentity {
  constructor(inner, delegation2) {
    super(inner);
    __privateAdd(this, _delegation);
    __privateSet(this, _delegation, delegation2);
  }
  /**
   * The Delegation Chain of this identity.
   */
  get delegation() {
    return __privateGet(this, _delegation);
  }
  /**
   * Create a {@link PartialDelegationIdentity} from a {@link PublicKey} and a {@link DelegationChain}.
   * @param key The {@link PublicKey} to delegate to.
   * @param delegation a {@link DelegationChain} targeting the inner key.
   */
  static fromDelegation(key, delegation2) {
    return new _PartialDelegationIdentity(key, delegation2);
  }
};
_delegation = new WeakMap();
let PartialDelegationIdentity = _PartialDelegationIdentity;
function isDelegationValid(chain, checks) {
  for (const { delegation: delegation2 } of chain.delegations) {
    if (+new Date(Number(delegation2.expiration / BigInt(1e6))) <= +Date.now()) {
      return false;
    }
  }
  const scopes = [];
  for (const s of scopes) {
    const scope = s.toText();
    for (const { delegation: delegation2 } of chain.delegations) {
      if (delegation2.targets === void 0) {
        continue;
      }
      let none = true;
      for (const target of delegation2.targets) {
        if (target.toText() === scope) {
          none = false;
          break;
        }
      }
      if (none) {
        return false;
      }
    }
  }
  return true;
}
const events = ["mousedown", "mousemove", "keydown", "touchstart", "wheel"];
class IdleManager {
  /**
   * @protected
   * @param options {@link IdleManagerOptions}
   */
  constructor(options = {}) {
    __publicField(this, "callbacks", []);
    __publicField(this, "idleTimeout", 10 * 60 * 1e3);
    __publicField(this, "timeoutID");
    const { onIdle, idleTimeout = 10 * 60 * 1e3 } = options || {};
    this.callbacks = onIdle ? [onIdle] : [];
    this.idleTimeout = idleTimeout;
    const _resetTimer = this._resetTimer.bind(this);
    window.addEventListener("load", _resetTimer, true);
    events.forEach(function(name) {
      document.addEventListener(name, _resetTimer, true);
    });
    const debounce = (func, wait) => {
      let timeout;
      return (...args) => {
        const context = this;
        const later = function() {
          timeout = void 0;
          func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = window.setTimeout(later, wait);
      };
    };
    if (options == null ? void 0 : options.captureScroll) {
      const scroll = debounce(_resetTimer, (options == null ? void 0 : options.scrollDebounce) ?? 100);
      window.addEventListener("scroll", scroll, true);
    }
    _resetTimer();
  }
  /**
   * Creates an {@link IdleManager}
   * @param {IdleManagerOptions} options Optional configuration
   * @see {@link IdleManagerOptions}
   * @param options.onIdle Callback once user has been idle. Use to prompt for fresh login, and use `Actor.agentOf(your_actor).invalidateIdentity()` to protect the user
   * @param options.idleTimeout timeout in ms
   * @param options.captureScroll capture scroll events
   * @param options.scrollDebounce scroll debounce time in ms
   */
  static create(options = {}) {
    return new this(options);
  }
  /**
   * @param {IdleCB} callback function to be called when user goes idle
   */
  registerCallback(callback) {
    this.callbacks.push(callback);
  }
  /**
   * Cleans up the idle manager and its listeners
   */
  exit() {
    clearTimeout(this.timeoutID);
    window.removeEventListener("load", this._resetTimer, true);
    const _resetTimer = this._resetTimer.bind(this);
    events.forEach(function(name) {
      document.removeEventListener(name, _resetTimer, true);
    });
    this.callbacks.forEach((cb) => cb());
  }
  /**
   * Resets the timeouts during cleanup
   */
  _resetTimer() {
    const exit = this.exit.bind(this);
    window.clearTimeout(this.timeoutID);
    this.timeoutID = window.setTimeout(exit, this.idleTimeout);
  }
}
const instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
let idbProxyableTypes;
let cursorAdvanceMethods;
function getIdbProxyableTypes() {
  return idbProxyableTypes || (idbProxyableTypes = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
}
function getCursorAdvanceMethods() {
  return cursorAdvanceMethods || (cursorAdvanceMethods = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
}
const cursorRequestMap = /* @__PURE__ */ new WeakMap();
const transactionDoneMap = /* @__PURE__ */ new WeakMap();
const transactionStoreNamesMap = /* @__PURE__ */ new WeakMap();
const transformCache = /* @__PURE__ */ new WeakMap();
const reverseTransformCache = /* @__PURE__ */ new WeakMap();
function promisifyRequest(request) {
  const promise = new Promise((resolve, reject) => {
    const unlisten = () => {
      request.removeEventListener("success", success);
      request.removeEventListener("error", error);
    };
    const success = () => {
      resolve(wrap(request.result));
      unlisten();
    };
    const error = () => {
      reject(request.error);
      unlisten();
    };
    request.addEventListener("success", success);
    request.addEventListener("error", error);
  });
  promise.then((value) => {
    if (value instanceof IDBCursor) {
      cursorRequestMap.set(value, request);
    }
  }).catch(() => {
  });
  reverseTransformCache.set(promise, request);
  return promise;
}
function cacheDonePromiseForTransaction(tx) {
  if (transactionDoneMap.has(tx))
    return;
  const done = new Promise((resolve, reject) => {
    const unlisten = () => {
      tx.removeEventListener("complete", complete);
      tx.removeEventListener("error", error);
      tx.removeEventListener("abort", error);
    };
    const complete = () => {
      resolve();
      unlisten();
    };
    const error = () => {
      reject(tx.error || new DOMException("AbortError", "AbortError"));
      unlisten();
    };
    tx.addEventListener("complete", complete);
    tx.addEventListener("error", error);
    tx.addEventListener("abort", error);
  });
  transactionDoneMap.set(tx, done);
}
let idbProxyTraps = {
  get(target, prop, receiver) {
    if (target instanceof IDBTransaction) {
      if (prop === "done")
        return transactionDoneMap.get(target);
      if (prop === "objectStoreNames") {
        return target.objectStoreNames || transactionStoreNamesMap.get(target);
      }
      if (prop === "store") {
        return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
      }
    }
    return wrap(target[prop]);
  },
  set(target, prop, value) {
    target[prop] = value;
    return true;
  },
  has(target, prop) {
    if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
      return true;
    }
    return prop in target;
  }
};
function replaceTraps(callback) {
  idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
  if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) {
    return function(storeNames, ...args) {
      const tx = func.call(unwrap(this), storeNames, ...args);
      transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
      return wrap(tx);
    };
  }
  if (getCursorAdvanceMethods().includes(func)) {
    return function(...args) {
      func.apply(unwrap(this), args);
      return wrap(cursorRequestMap.get(this));
    };
  }
  return function(...args) {
    return wrap(func.apply(unwrap(this), args));
  };
}
function transformCachableValue(value) {
  if (typeof value === "function")
    return wrapFunction(value);
  if (value instanceof IDBTransaction)
    cacheDonePromiseForTransaction(value);
  if (instanceOfAny(value, getIdbProxyableTypes()))
    return new Proxy(value, idbProxyTraps);
  return value;
}
function wrap(value) {
  if (value instanceof IDBRequest)
    return promisifyRequest(value);
  if (transformCache.has(value))
    return transformCache.get(value);
  const newValue = transformCachableValue(value);
  if (newValue !== value) {
    transformCache.set(value, newValue);
    reverseTransformCache.set(newValue, value);
  }
  return newValue;
}
const unwrap = (value) => reverseTransformCache.get(value);
function openDB(name, version2, { blocked, upgrade, blocking, terminated } = {}) {
  const request = indexedDB.open(name, version2);
  const openPromise = wrap(request);
  if (upgrade) {
    request.addEventListener("upgradeneeded", (event) => {
      upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
    });
  }
  if (blocked) {
    request.addEventListener("blocked", (event) => blocked(
      // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
      event.oldVersion,
      event.newVersion,
      event
    ));
  }
  openPromise.then((db2) => {
    if (terminated)
      db2.addEventListener("close", () => terminated());
    if (blocking) {
      db2.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
    }
  }).catch(() => {
  });
  return openPromise;
}
function deleteDB(name, { blocked } = {}) {
  const request = indexedDB.deleteDatabase(name);
  if (blocked) {
    request.addEventListener("blocked", (event) => blocked(
      // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
      event.oldVersion,
      event
    ));
  }
  return wrap(request).then(() => void 0);
}
const readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
const writeMethods = ["put", "add", "delete", "clear"];
const cachedMethods = /* @__PURE__ */ new Map();
function getMethod(target, prop) {
  if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
    return;
  }
  if (cachedMethods.get(prop))
    return cachedMethods.get(prop);
  const targetFuncName = prop.replace(/FromIndex$/, "");
  const useIndex = prop !== targetFuncName;
  const isWrite = writeMethods.includes(targetFuncName);
  if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))
  ) {
    return;
  }
  const method = async function(storeName, ...args) {
    const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
    let target2 = tx.store;
    if (useIndex)
      target2 = target2.index(args.shift());
    return (await Promise.all([
      target2[targetFuncName](...args),
      isWrite && tx.done
    ]))[0];
  };
  cachedMethods.set(prop, method);
  return method;
}
replaceTraps((oldTraps) => ({
  ...oldTraps,
  get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
  has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
}));
const build = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  deleteDB,
  openDB,
  unwrap,
  wrap
}, Symbol.toStringTag, { value: "Module" }));
const AUTH_DB_NAME = "auth-client-db";
const OBJECT_STORE_NAME = "ic-keyval";
const _openDbStore = async (dbName = AUTH_DB_NAME, storeName = OBJECT_STORE_NAME, version2) => {
  if (isBrowser && (localStorage == null ? void 0 : localStorage.getItem(KEY_STORAGE_DELEGATION))) {
    localStorage.removeItem(KEY_STORAGE_DELEGATION);
    localStorage.removeItem(KEY_STORAGE_KEY);
  }
  return await openDB(dbName, version2, {
    upgrade: (database) => {
      if (database.objectStoreNames.contains(storeName)) {
        database.clear(storeName);
      }
      database.createObjectStore(storeName);
    }
  });
};
async function _getValue(db2, storeName, key) {
  return await db2.get(storeName, key);
}
async function _setValue(db2, storeName, key, value) {
  return await db2.put(storeName, value, key);
}
async function _removeValue(db2, storeName, key) {
  return await db2.delete(storeName, key);
}
class IdbKeyVal {
  // Do not use - instead prefer create
  constructor(_db, _storeName) {
    __publicField(this, "_db");
    __publicField(this, "_storeName");
    this._db = _db;
    this._storeName = _storeName;
  }
  /**
   * @param {DBCreateOptions} options - DBCreateOptions
   * @param {DBCreateOptions['dbName']} options.dbName name for the indexeddb database
   * @default
   * @param {DBCreateOptions['storeName']} options.storeName name for the indexeddb Data Store
   * @default
   * @param {DBCreateOptions['version']} options.version version of the database. Increment to safely upgrade
   */
  static async create(options) {
    const { dbName = AUTH_DB_NAME, storeName = OBJECT_STORE_NAME, version: version2 = DB_VERSION } = options ?? {};
    const db2 = await _openDbStore(dbName, storeName, version2);
    return new IdbKeyVal(db2, storeName);
  }
  /**
   * Basic setter
   * @param {IDBValidKey} key string | number | Date | BufferSource | IDBValidKey[]
   * @param value value to set
   * @returns void
   */
  async set(key, value) {
    return await _setValue(this._db, this._storeName, key, value);
  }
  /**
   * Basic getter
   * Pass in a type T for type safety if you know the type the value will have if it is found
   * @param {IDBValidKey} key string | number | Date | BufferSource | IDBValidKey[]
   * @returns `Promise<T | null>`
   * @example
   * await get<string>('exampleKey') -> 'exampleValue'
   */
  async get(key) {
    return await _getValue(this._db, this._storeName, key) ?? null;
  }
  /**
   * Remove a key
   * @param key {@link IDBValidKey}
   * @returns void
   */
  async remove(key) {
    return await _removeValue(this._db, this._storeName, key);
  }
}
const KEY_STORAGE_KEY = "identity";
const KEY_STORAGE_DELEGATION = "delegation";
const KEY_VECTOR = "iv";
const DB_VERSION = 1;
const isBrowser = typeof window !== "undefined";
class LocalStorage {
  constructor(prefix = "ic-", _localStorage) {
    __publicField(this, "prefix");
    __publicField(this, "_localStorage");
    this.prefix = prefix;
    this._localStorage = _localStorage;
  }
  get(key) {
    return Promise.resolve(this._getLocalStorage().getItem(this.prefix + key));
  }
  set(key, value) {
    this._getLocalStorage().setItem(this.prefix + key, value);
    return Promise.resolve();
  }
  remove(key) {
    this._getLocalStorage().removeItem(this.prefix + key);
    return Promise.resolve();
  }
  _getLocalStorage() {
    if (this._localStorage) {
      return this._localStorage;
    }
    const ls = typeof window === "undefined" ? typeof global === "undefined" ? typeof self === "undefined" ? void 0 : self.localStorage : global.localStorage : window.localStorage;
    if (!ls) {
      throw new Error("Could not find local storage.");
    }
    return ls;
  }
}
class IdbStorage {
  /**
   * @param options - DBCreateOptions
   * @param options.dbName - name for the indexeddb database
   * @param options.storeName - name for the indexeddb Data Store
   * @param options.version - version of the database. Increment to safely upgrade
   * @example
   * ```ts
   * const storage = new IdbStorage({ dbName: 'my-db', storeName: 'my-store', version: 2 });
   * ```
   */
  constructor(options) {
    __privateAdd(this, _options);
    // Initializes a KeyVal on first request
    __publicField(this, "initializedDb");
    __privateSet(this, _options, options ?? {});
  }
  get _db() {
    return new Promise((resolve, reject) => {
      if (this.initializedDb) {
        resolve(this.initializedDb);
        return;
      }
      IdbKeyVal.create(__privateGet(this, _options)).then((db2) => {
        this.initializedDb = db2;
        resolve(db2);
      }).catch(reject);
    });
  }
  async get(key) {
    const db2 = await this._db;
    return await db2.get(key);
  }
  async set(key, value) {
    const db2 = await this._db;
    await db2.set(key, value);
  }
  async remove(key) {
    const db2 = await this._db;
    await db2.remove(key);
  }
}
_options = new WeakMap();
const NANOSECONDS_PER_SECOND = BigInt(1e9);
const SECONDS_PER_HOUR = BigInt(3600);
const NANOSECONDS_PER_HOUR = NANOSECONDS_PER_SECOND * SECONDS_PER_HOUR;
const IDENTITY_PROVIDER_DEFAULT = "https://identity.internetcomputer.org";
const IDENTITY_PROVIDER_ENDPOINT = "#authorize";
const DEFAULT_MAX_TIME_TO_LIVE = BigInt(8) * NANOSECONDS_PER_HOUR;
const ECDSA_KEY_LABEL = "ECDSA";
const ED25519_KEY_LABEL = "Ed25519";
const INTERRUPT_CHECK_INTERVAL = 500;
const ERROR_USER_INTERRUPT = "UserInterrupt";
class AuthClient {
  constructor(_identity, _key, _chain, _storage, idleManager, _createOptions, _idpWindow, _eventHandler) {
    __publicField(this, "_identity");
    __publicField(this, "_key");
    __publicField(this, "_chain");
    __publicField(this, "_storage");
    __publicField(this, "idleManager");
    __publicField(this, "_createOptions");
    __publicField(this, "_idpWindow");
    __publicField(this, "_eventHandler");
    this._identity = _identity;
    this._key = _key;
    this._chain = _chain;
    this._storage = _storage;
    this.idleManager = idleManager;
    this._createOptions = _createOptions;
    this._idpWindow = _idpWindow;
    this._eventHandler = _eventHandler;
    this._registerDefaultIdleCallback();
  }
  /**
   * Create an AuthClient to manage authentication and identity
   * @param {AuthClientCreateOptions} options - Options for creating an {@link AuthClient}
   * @see {@link AuthClientCreateOptions}
   * @param options.identity Optional Identity to use as the base
   * @see {@link SignIdentity}
   * @param options.storage Storage mechanism for delegation credentials
   * @see {@link AuthClientStorage}
   * @param options.keyType Type of key to use for the base key
   * @param {IdleOptions} options.idleOptions Configures an {@link IdleManager}
   * @see {@link IdleOptions}
   * Default behavior is to clear stored identity and reload the page when a user goes idle, unless you set the disableDefaultIdleCallback flag or pass in a custom idle callback.
   * @example
   * const authClient = await AuthClient.create({
   *   idleOptions: {
   *     disableIdle: true
   *   }
   * })
   */
  static async create(options = {}) {
    var _a;
    const storage2 = options.storage ?? new IdbStorage();
    const keyType = options.keyType ?? ECDSA_KEY_LABEL;
    let key = null;
    if (options.identity) {
      key = options.identity;
    } else {
      let maybeIdentityStorage = await storage2.get(KEY_STORAGE_KEY);
      if (!maybeIdentityStorage && isBrowser) {
        try {
          const fallbackLocalStorage = new LocalStorage();
          const localChain = await fallbackLocalStorage.get(KEY_STORAGE_DELEGATION);
          const localKey = await fallbackLocalStorage.get(KEY_STORAGE_KEY);
          if (localChain && localKey && keyType === ECDSA_KEY_LABEL) {
            console.log("Discovered an identity stored in localstorage. Migrating to IndexedDB");
            await storage2.set(KEY_STORAGE_DELEGATION, localChain);
            await storage2.set(KEY_STORAGE_KEY, localKey);
            maybeIdentityStorage = localChain;
            await fallbackLocalStorage.remove(KEY_STORAGE_DELEGATION);
            await fallbackLocalStorage.remove(KEY_STORAGE_KEY);
          }
        } catch (error) {
          console.error("error while attempting to recover localstorage: " + error);
        }
      }
      if (maybeIdentityStorage) {
        try {
          if (typeof maybeIdentityStorage === "object") {
            if (keyType === ED25519_KEY_LABEL && typeof maybeIdentityStorage === "string") {
              key = Ed25519KeyIdentity.fromJSON(maybeIdentityStorage);
            } else {
              key = await ECDSAKeyIdentity.fromKeyPair(maybeIdentityStorage);
            }
          } else if (typeof maybeIdentityStorage === "string") {
            key = Ed25519KeyIdentity.fromJSON(maybeIdentityStorage);
          }
        } catch {
        }
      }
    }
    let identity = new cjsExports$1.AnonymousIdentity();
    let chain = null;
    if (key) {
      try {
        const chainStorage = await storage2.get(KEY_STORAGE_DELEGATION);
        if (typeof chainStorage === "object" && chainStorage !== null) {
          throw new Error("Delegation chain is incorrectly stored. A delegation chain should be stored as a string.");
        }
        if (options.identity) {
          identity = options.identity;
        } else if (chainStorage) {
          chain = DelegationChain.fromJSON(chainStorage);
          if (!isDelegationValid(chain)) {
            await _deleteStorage(storage2);
            key = null;
          } else {
            if ("toDer" in key) {
              identity = PartialDelegationIdentity.fromDelegation(key, chain);
            } else {
              identity = DelegationIdentity.fromDelegation(key, chain);
            }
          }
        }
      } catch (e) {
        console.error(e);
        await _deleteStorage(storage2);
        key = null;
      }
    }
    let idleManager;
    if ((_a = options.idleOptions) == null ? void 0 : _a.disableIdle) {
      idleManager = void 0;
    } else if (chain || options.identity) {
      idleManager = IdleManager.create(options.idleOptions);
    }
    if (!key) {
      if (keyType === ED25519_KEY_LABEL) {
        key = Ed25519KeyIdentity.generate();
        await storage2.set(KEY_STORAGE_KEY, JSON.stringify(key.toJSON()));
      } else {
        if (options.storage && keyType === ECDSA_KEY_LABEL) {
          console.warn(`You are using a custom storage provider that may not support CryptoKey storage. If you are using a custom storage provider that does not support CryptoKey storage, you should use '${ED25519_KEY_LABEL}' as the key type, as it can serialize to a string`);
        }
        key = await ECDSAKeyIdentity.generate();
        await storage2.set(KEY_STORAGE_KEY, key.getKeyPair());
      }
    }
    return new this(identity, key, chain, storage2, idleManager, options);
  }
  _registerDefaultIdleCallback() {
    var _a, _b;
    const idleOptions = (_a = this._createOptions) == null ? void 0 : _a.idleOptions;
    if (!(idleOptions == null ? void 0 : idleOptions.onIdle) && !(idleOptions == null ? void 0 : idleOptions.disableDefaultIdleCallback)) {
      (_b = this.idleManager) == null ? void 0 : _b.registerCallback(() => {
        this.logout();
        location.reload();
      });
    }
  }
  async _handleSuccess(message, onSuccess) {
    var _a, _b;
    const delegations = message.delegations.map((signedDelegation) => {
      return {
        delegation: new Delegation(signedDelegation.delegation.pubkey, signedDelegation.delegation.expiration, signedDelegation.delegation.targets),
        signature: signedDelegation.signature
      };
    });
    const delegationChain = DelegationChain.fromDelegations(delegations, message.userPublicKey);
    const key = this._key;
    if (!key) {
      return;
    }
    this._chain = delegationChain;
    if ("toDer" in key) {
      this._identity = PartialDelegationIdentity.fromDelegation(key, this._chain);
    } else {
      this._identity = DelegationIdentity.fromDelegation(key, this._chain);
    }
    (_a = this._idpWindow) == null ? void 0 : _a.close();
    const idleOptions = (_b = this._createOptions) == null ? void 0 : _b.idleOptions;
    if (!this.idleManager && !(idleOptions == null ? void 0 : idleOptions.disableIdle)) {
      this.idleManager = IdleManager.create(idleOptions);
      this._registerDefaultIdleCallback();
    }
    this._removeEventListener();
    delete this._idpWindow;
    if (this._chain) {
      await this._storage.set(KEY_STORAGE_DELEGATION, JSON.stringify(this._chain.toJSON()));
    }
    onSuccess == null ? void 0 : onSuccess(message);
  }
  getIdentity() {
    return this._identity;
  }
  async isAuthenticated() {
    return !this.getIdentity().getPrincipal().isAnonymous() && this._chain !== null && isDelegationValid(this._chain);
  }
  /**
   * AuthClient Login - Opens up a new window to authenticate with Internet Identity
   * @param {AuthClientLoginOptions} options - Options for logging in, merged with the options set during creation if any. Note: we only perform a shallow merge for the `customValues` property.
   * @param options.identityProvider Identity provider
   * @param options.maxTimeToLive Expiration of the authentication in nanoseconds
   * @param options.allowPinAuthentication If present, indicates whether or not the Identity Provider should allow the user to authenticate and/or register using a temporary key/PIN identity. Authenticating dapps may want to prevent users from using Temporary keys/PIN identities because Temporary keys/PIN identities are less secure than Passkeys (webauthn credentials) and because Temporary keys/PIN identities generally only live in a browser database (which may get cleared by the browser/OS).
   * @param options.derivationOrigin Origin for Identity Provider to use while generating the delegated identity
   * @param options.windowOpenerFeatures Configures the opened authentication window
   * @param options.onSuccess Callback once login has completed
   * @param options.onError Callback in case authentication fails
   * @param options.customValues Extra values to be passed in the login request during the authorize-ready phase. Note: we only perform a shallow merge for the `customValues` property.
   * @example
   * const authClient = await AuthClient.create();
   * authClient.login({
   *  identityProvider: 'http://<canisterID>.127.0.0.1:8000',
   *  maxTimeToLive: BigInt (7) * BigInt(24) * BigInt(3_600_000_000_000), // 1 week
   *  windowOpenerFeatures: "toolbar=0,location=0,menubar=0,width=500,height=500,left=100,top=100",
   *  onSuccess: () => {
   *    console.log('Login Successful!');
   *  },
   *  onError: (error) => {
   *    console.error('Login Failed: ', error);
   *  }
   * });
   */
  async login(options) {
    var _a, _b, _c;
    const loginOptions = mergeLoginOptions((_a = this._createOptions) == null ? void 0 : _a.loginOptions, options);
    const maxTimeToLive = (loginOptions == null ? void 0 : loginOptions.maxTimeToLive) ?? DEFAULT_MAX_TIME_TO_LIVE;
    const identityProviderUrl = new URL(((_b = loginOptions == null ? void 0 : loginOptions.identityProvider) == null ? void 0 : _b.toString()) || IDENTITY_PROVIDER_DEFAULT);
    identityProviderUrl.hash = IDENTITY_PROVIDER_ENDPOINT;
    (_c = this._idpWindow) == null ? void 0 : _c.close();
    this._removeEventListener();
    this._eventHandler = this._getEventHandler(identityProviderUrl, {
      maxTimeToLive,
      ...loginOptions
    });
    window.addEventListener("message", this._eventHandler);
    this._idpWindow = window.open(identityProviderUrl.toString(), "idpWindow", loginOptions == null ? void 0 : loginOptions.windowOpenerFeatures) ?? void 0;
    const checkInterruption = () => {
      if (this._idpWindow) {
        if (this._idpWindow.closed) {
          this._handleFailure(ERROR_USER_INTERRUPT, loginOptions == null ? void 0 : loginOptions.onError);
        } else {
          setTimeout(checkInterruption, INTERRUPT_CHECK_INTERVAL);
        }
      }
    };
    checkInterruption();
  }
  _getEventHandler(identityProviderUrl, options) {
    return async (event) => {
      var _a, _b, _c;
      if (event.origin !== identityProviderUrl.origin) {
        return;
      }
      const message = event.data;
      switch (message.kind) {
        case "authorize-ready": {
          const request = {
            kind: "authorize-client",
            sessionPublicKey: new Uint8Array((_a = this._key) == null ? void 0 : _a.getPublicKey().toDer()),
            maxTimeToLive: options == null ? void 0 : options.maxTimeToLive,
            allowPinAuthentication: options == null ? void 0 : options.allowPinAuthentication,
            derivationOrigin: (_b = options == null ? void 0 : options.derivationOrigin) == null ? void 0 : _b.toString(),
            // Pass any custom values to the IDP.
            ...options == null ? void 0 : options.customValues
          };
          (_c = this._idpWindow) == null ? void 0 : _c.postMessage(request, identityProviderUrl.origin);
          break;
        }
        case "authorize-client-success":
          try {
            await this._handleSuccess(message, options == null ? void 0 : options.onSuccess);
          } catch (err) {
            this._handleFailure(err.message, options == null ? void 0 : options.onError);
          }
          break;
        case "authorize-client-failure":
          this._handleFailure(message.text, options == null ? void 0 : options.onError);
          break;
      }
    };
  }
  _handleFailure(errorMessage, onError) {
    var _a;
    (_a = this._idpWindow) == null ? void 0 : _a.close();
    onError == null ? void 0 : onError(errorMessage);
    this._removeEventListener();
    delete this._idpWindow;
  }
  _removeEventListener() {
    if (this._eventHandler) {
      window.removeEventListener("message", this._eventHandler);
    }
    this._eventHandler = void 0;
  }
  async logout(options = {}) {
    await _deleteStorage(this._storage);
    this._identity = new cjsExports$1.AnonymousIdentity();
    this._chain = null;
    if (options.returnTo) {
      try {
        window.history.pushState({}, "", options.returnTo);
      } catch {
        window.location.href = options.returnTo;
      }
    }
  }
}
async function _deleteStorage(storage2) {
  await storage2.remove(KEY_STORAGE_KEY);
  await storage2.remove(KEY_STORAGE_DELEGATION);
  await storage2.remove(KEY_VECTOR);
}
function mergeLoginOptions(loginOptions, otherLoginOptions) {
  if (!loginOptions && !otherLoginOptions) {
    return void 0;
  }
  const customValues = (loginOptions == null ? void 0 : loginOptions.customValues) || (otherLoginOptions == null ? void 0 : otherLoginOptions.customValues) ? {
    ...loginOptions == null ? void 0 : loginOptions.customValues,
    ...otherLoginOptions == null ? void 0 : otherLoginOptions.customValues
  } : void 0;
  return {
    ...loginOptions,
    ...otherLoginOptions,
    customValues
  };
}
const esm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AuthClient,
  ERROR_USER_INTERRUPT,
  IdbKeyVal,
  IdbStorage,
  IdleManager,
  KEY_STORAGE_DELEGATION,
  KEY_STORAGE_KEY,
  LocalStorage
}, Symbol.toStringTag, { value: "Module" }));
const require$$2 = /* @__PURE__ */ getAugmentedNamespace(esm);
var cjs = {};
var ed25519 = {};
var hasRequiredEd25519;
function requireEd25519() {
  var _rawKey2, _derKey2, _publicKey2, _privateKey2;
  if (hasRequiredEd25519) return ed25519;
  hasRequiredEd25519 = 1;
  Object.defineProperty(ed25519, "__esModule", { value: true });
  ed25519.Ed25519KeyIdentity = ed25519.Ed25519PublicKey = void 0;
  const agent_1 = requireCjs$2();
  const candid_1 = requireCjs$1();
  const ed25519_1 = requireEd25519$1();
  const utils_1 = requireUtils();
  function isObject2(value) {
    return value !== null && typeof value === "object";
  }
  const _Ed25519PublicKey2 = class _Ed25519PublicKey2 {
    // `fromRaw` and `fromDer` should be used for instantiation, not this constructor.
    constructor(key) {
      __privateAdd(this, _rawKey2);
      __privateAdd(this, _derKey2);
      if (key.byteLength !== _Ed25519PublicKey2.RAW_KEY_LENGTH) {
        throw new Error("An Ed25519 public key must be exactly 32bytes long");
      }
      __privateSet(this, _rawKey2, key);
      __privateSet(this, _derKey2, _Ed25519PublicKey2.derEncode(key));
    }
    /**
     * Construct Ed25519PublicKey from an existing PublicKey
     * @param {unknown} maybeKey - existing PublicKey, ArrayBuffer, DerEncodedPublicKey, or hex string
     * @returns {Ed25519PublicKey} Instance of Ed25519PublicKey
     */
    static from(maybeKey) {
      if (typeof maybeKey === "string") {
        const key = (0, utils_1.hexToBytes)(maybeKey);
        return this.fromRaw(key);
      } else if (isObject2(maybeKey)) {
        const key = maybeKey;
        if (isObject2(key) && Object.hasOwnProperty.call(key, "__derEncodedPublicKey__")) {
          return this.fromDer(key);
        } else if (ArrayBuffer.isView(key)) {
          const view = key;
          return this.fromRaw((0, candid_1.uint8FromBufLike)(view.buffer));
        } else if (key instanceof ArrayBuffer) {
          return this.fromRaw((0, candid_1.uint8FromBufLike)(key));
        } else if ("rawKey" in key && key.rawKey instanceof Uint8Array) {
          return this.fromRaw(key.rawKey);
        } else if ("derKey" in key) {
          return this.fromDer(key.derKey);
        } else if ("toDer" in key) {
          return this.fromDer(key.toDer());
        }
      }
      throw new Error("Cannot construct Ed25519PublicKey from the provided key.");
    }
    static fromRaw(rawKey) {
      return new _Ed25519PublicKey2(rawKey);
    }
    static fromDer(derKey) {
      return new _Ed25519PublicKey2(this.derDecode(derKey));
    }
    static derEncode(publicKey) {
      const key = (0, agent_1.wrapDER)(publicKey, agent_1.ED25519_OID);
      key.__derEncodedPublicKey__ = void 0;
      return key;
    }
    static derDecode(key) {
      const unwrapped = (0, agent_1.unwrapDER)(key, agent_1.ED25519_OID);
      if (unwrapped.length !== this.RAW_KEY_LENGTH) {
        throw new Error("An Ed25519 public key must be exactly 32bytes long");
      }
      return unwrapped;
    }
    get rawKey() {
      return __privateGet(this, _rawKey2);
    }
    get derKey() {
      return __privateGet(this, _derKey2);
    }
    toDer() {
      return this.derKey;
    }
    toRaw() {
      return this.rawKey;
    }
  };
  _rawKey2 = new WeakMap();
  _derKey2 = new WeakMap();
  _Ed25519PublicKey2.RAW_KEY_LENGTH = 32;
  let Ed25519PublicKey2 = _Ed25519PublicKey2;
  ed25519.Ed25519PublicKey = Ed25519PublicKey2;
  const _Ed25519KeyIdentity2 = class _Ed25519KeyIdentity2 extends agent_1.SignIdentity {
    // `fromRaw` and `fromDer` should be used for instantiation, not this constructor.
    constructor(publicKey, privateKey) {
      super();
      __privateAdd(this, _publicKey2);
      __privateAdd(this, _privateKey2);
      __privateSet(this, _publicKey2, Ed25519PublicKey2.from(publicKey));
      __privateSet(this, _privateKey2, privateKey);
    }
    /**
     * Generate a new Ed25519KeyIdentity.
     * @param seed a 32-byte seed for the private key. If not provided, a random seed will be generated.
     * @returns Ed25519KeyIdentity
     */
    static generate(seed) {
      if (seed && seed.length !== 32) {
        throw new Error("Ed25519 Seed needs to be 32 bytes long.");
      }
      if (!seed)
        seed = ed25519_1.ed25519.utils.randomPrivateKey();
      if ((0, candid_1.uint8Equals)(seed, new Uint8Array(new Array(32).fill(0)))) {
        console.warn("Seed is all zeros. This is not a secure seed. Please provide a seed with sufficient entropy if this is a production environment.");
      }
      const sk = new Uint8Array(32);
      for (let i = 0; i < 32; i++) {
        sk[i] = seed[i];
      }
      const pk = ed25519_1.ed25519.getPublicKey(sk);
      return _Ed25519KeyIdentity2.fromKeyPair(pk, sk);
    }
    static fromParsedJson(obj) {
      const [publicKeyDer, privateKeyRaw] = obj;
      return new _Ed25519KeyIdentity2(Ed25519PublicKey2.fromDer((0, utils_1.hexToBytes)(publicKeyDer)), (0, utils_1.hexToBytes)(privateKeyRaw));
    }
    static fromJSON(json) {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) {
        if (typeof parsed[0] === "string" && typeof parsed[1] === "string") {
          return this.fromParsedJson([parsed[0], parsed[1]]);
        } else {
          throw new Error("Deserialization error: JSON must have at least 2 items.");
        }
      }
      throw new Error(`Deserialization error: Invalid JSON type for string: ${JSON.stringify(json)}`);
    }
    static fromKeyPair(publicKey, privateKey) {
      return new _Ed25519KeyIdentity2(Ed25519PublicKey2.fromRaw(publicKey), privateKey);
    }
    static fromSecretKey(secretKey) {
      const publicKey = ed25519_1.ed25519.getPublicKey(secretKey);
      return _Ed25519KeyIdentity2.fromKeyPair(publicKey, secretKey);
    }
    /**
     * Serialize this key to JSON.
     */
    toJSON() {
      return [(0, utils_1.bytesToHex)(__privateGet(this, _publicKey2).toDer()), (0, utils_1.bytesToHex)(__privateGet(this, _privateKey2))];
    }
    /**
     * Return a copy of the key pair.
     */
    getKeyPair() {
      return {
        secretKey: __privateGet(this, _privateKey2),
        publicKey: __privateGet(this, _publicKey2)
      };
    }
    /**
     * Return the public key.
     */
    getPublicKey() {
      return __privateGet(this, _publicKey2);
    }
    /**
     * Signs a blob of data, with this identity's private key.
     * @param challenge - challenge to sign with this identity's secretKey, producing a signature
     */
    async sign(challenge) {
      const signature = ed25519_1.ed25519.sign(challenge, __privateGet(this, _privateKey2).slice(0, 32));
      Object.defineProperty(signature, "__signature__", {
        enumerable: false,
        value: void 0
      });
      return signature;
    }
    /**
     * Verify
     * @param sig - signature to verify
     * @param msg - message to verify
     * @param pk - public key
     * @returns - true if the signature is valid, false otherwise
     */
    static verify(sig, msg, pk) {
      const [signature, message, publicKey] = [sig, msg, pk].map((x) => {
        if (typeof x === "string") {
          x = (0, utils_1.hexToBytes)(x);
        }
        return (0, candid_1.uint8FromBufLike)(x);
      });
      return ed25519_1.ed25519.verify(signature, message, publicKey);
    }
  };
  _publicKey2 = new WeakMap();
  _privateKey2 = new WeakMap();
  let Ed25519KeyIdentity2 = _Ed25519KeyIdentity2;
  ed25519.Ed25519KeyIdentity = Ed25519KeyIdentity2;
  return ed25519;
}
var ecdsa = {};
var hasRequiredEcdsa;
function requireEcdsa() {
  if (hasRequiredEcdsa) return ecdsa;
  hasRequiredEcdsa = 1;
  Object.defineProperty(ecdsa, "__esModule", { value: true });
  ecdsa.ECDSAKeyIdentity = ecdsa.CryptoError = void 0;
  const agent_1 = requireCjs$2();
  const candid_1 = requireCjs$1();
  class CryptoError2 extends Error {
    constructor(message) {
      super(message);
      this.message = message;
      Object.setPrototypeOf(this, CryptoError2.prototype);
    }
  }
  ecdsa.CryptoError = CryptoError2;
  function _getEffectiveCrypto2(subtleCrypto) {
    if (typeof commonjsGlobal !== "undefined" && commonjsGlobal["crypto"] && commonjsGlobal["crypto"]["subtle"]) {
      return commonjsGlobal["crypto"]["subtle"];
    }
    if (subtleCrypto) {
      return subtleCrypto;
    } else if (typeof crypto !== "undefined" && crypto["subtle"]) {
      return crypto.subtle;
    } else {
      throw new CryptoError2("Global crypto was not available and none was provided. Please inlcude a SubtleCrypto implementation. See https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto");
    }
  }
  class ECDSAKeyIdentity2 extends agent_1.SignIdentity {
    /**
     * Generates a randomly generated identity for use in calls to the Internet Computer.
     * @param {CryptoKeyOptions} options optional settings
     * @param {CryptoKeyOptions['extractable']} options.extractable - whether the key should allow itself to be used. Set to false for maximum security.
     * @param {CryptoKeyOptions['keyUsages']} options.keyUsages - a list of key usages that the key can be used for
     * @param {CryptoKeyOptions['subtleCrypto']} options.subtleCrypto interface
     * @returns a {@link ECDSAKeyIdentity}
     */
    static async generate(options) {
      const { extractable = false, keyUsages = ["sign", "verify"], subtleCrypto } = options ?? {};
      const effectiveCrypto = _getEffectiveCrypto2(subtleCrypto);
      const keyPair = await effectiveCrypto.generateKey({
        name: "ECDSA",
        namedCurve: "P-256"
      }, extractable, keyUsages);
      const derKey = (0, candid_1.uint8FromBufLike)(await effectiveCrypto.exportKey("spki", keyPair.publicKey));
      Object.assign(derKey, {
        __derEncodedPublicKey__: void 0
      });
      return new this(keyPair, derKey, effectiveCrypto);
    }
    /**
     * generates an identity from a public and private key. Please ensure that you are generating these keys securely and protect the user's private key
     * @param keyPair a CryptoKeyPair
     * @param subtleCrypto - a SubtleCrypto interface in case one is not available globally
     * @returns an {@link ECDSAKeyIdentity}
     */
    static async fromKeyPair(keyPair, subtleCrypto) {
      const effectiveCrypto = _getEffectiveCrypto2(subtleCrypto);
      const derKey = (0, candid_1.uint8FromBufLike)(await effectiveCrypto.exportKey("spki", keyPair.publicKey));
      Object.assign(derKey, {
        __derEncodedPublicKey__: void 0
      });
      return new ECDSAKeyIdentity2(keyPair, derKey, effectiveCrypto);
    }
    // `fromKeyPair` and `generate` should be used for instantiation, not this constructor.
    constructor(keyPair, derKey, subtleCrypto) {
      super();
      this._keyPair = keyPair;
      this._derKey = derKey;
      this._subtleCrypto = subtleCrypto;
    }
    /**
     * Return the internally-used key pair.
     * @returns a CryptoKeyPair
     */
    getKeyPair() {
      return this._keyPair;
    }
    /**
     * Return the public key.
     * @returns an {@link PublicKey & DerCryptoKey}
     */
    getPublicKey() {
      const derKey = this._derKey;
      const key = Object.create(this._keyPair.publicKey);
      key.toDer = function() {
        return derKey;
      };
      return key;
    }
    /**
     * Signs a blob of data, with this identity's private key.
     * @param {Uint8Array} challenge - challenge to sign with this identity's secretKey, producing a signature
     * @returns {Promise<Signature>} signature
     */
    async sign(challenge) {
      const params = {
        name: "ECDSA",
        hash: { name: "SHA-256" }
      };
      const signature = (0, candid_1.uint8FromBufLike)(await this._subtleCrypto.sign(params, this._keyPair.privateKey, challenge));
      Object.assign(signature, {
        __signature__: void 0
      });
      return signature;
    }
  }
  ecdsa.ECDSAKeyIdentity = ECDSAKeyIdentity2;
  ecdsa.default = ECDSAKeyIdentity2;
  return ecdsa;
}
var delegation = {};
var partial = {};
var hasRequiredPartial;
function requirePartial() {
  var _inner2;
  if (hasRequiredPartial) return partial;
  hasRequiredPartial = 1;
  Object.defineProperty(partial, "__esModule", { value: true });
  partial.PartialIdentity = void 0;
  const principal_1 = requireCjs$3();
  class PartialIdentity2 {
    constructor(inner) {
      __privateAdd(this, _inner2);
      __privateSet(this, _inner2, inner);
    }
    /**
     * The raw public key of this identity.
     */
    get rawKey() {
      return __privateGet(this, _inner2).rawKey;
    }
    /**
     * The DER-encoded public key of this identity.
     */
    get derKey() {
      return __privateGet(this, _inner2).derKey;
    }
    /**
     * The DER-encoded public key of this identity.
     */
    toDer() {
      return __privateGet(this, _inner2).toDer();
    }
    /**
     * The inner {@link PublicKey} used by this identity.
     */
    getPublicKey() {
      return __privateGet(this, _inner2);
    }
    /**
     * The {@link Principal} of this identity.
     */
    getPrincipal() {
      if (!__privateGet(this, _inner2).rawKey) {
        throw new Error("Cannot get principal from a public key without a raw key.");
      }
      return principal_1.Principal.fromUint8Array(new Uint8Array(__privateGet(this, _inner2).rawKey));
    }
    /**
     * Required for the Identity interface, but cannot implemented for just a public key.
     */
    transformRequest() {
      return Promise.reject("Not implemented. You are attempting to use a partial identity to sign calls, but this identity only has access to the public key.To sign calls, use a DelegationIdentity instead.");
    }
  }
  _inner2 = new WeakMap();
  partial.PartialIdentity = PartialIdentity2;
  return partial;
}
var hasRequiredDelegation;
function requireDelegation() {
  var _delegation2;
  if (hasRequiredDelegation) return delegation;
  hasRequiredDelegation = 1;
  Object.defineProperty(delegation, "__esModule", { value: true });
  delegation.PartialDelegationIdentity = delegation.DelegationIdentity = delegation.DelegationChain = delegation.Delegation = void 0;
  delegation.isDelegationValid = isDelegationValid2;
  const agent_1 = requireCjs$2();
  const principal_1 = requireCjs$3();
  const partial_ts_1 = requirePartial();
  const utils_1 = requireUtils();
  function safeBytesToHex2(data) {
    if (data instanceof Uint8Array) {
      return (0, utils_1.bytesToHex)(data);
    }
    return (0, utils_1.bytesToHex)(new Uint8Array(data));
  }
  function _parseBlob2(value) {
    if (typeof value !== "string" || value.length < 64) {
      throw new Error("Invalid public key.");
    }
    return (0, utils_1.hexToBytes)(value);
  }
  class Delegation2 {
    constructor(pubkey, expiration, targets) {
      this.pubkey = pubkey;
      this.expiration = expiration;
      this.targets = targets;
    }
    toCborValue() {
      return {
        pubkey: this.pubkey,
        expiration: this.expiration,
        ...this.targets && {
          targets: this.targets
        }
      };
    }
    toJSON() {
      return {
        expiration: this.expiration.toString(16),
        pubkey: safeBytesToHex2(this.pubkey),
        ...this.targets && { targets: this.targets.map((p) => p.toHex()) }
      };
    }
  }
  delegation.Delegation = Delegation2;
  async function _createSingleDelegation2(from, to, expiration, targets) {
    const delegation2 = new Delegation2(
      to.toDer(),
      BigInt(+expiration) * BigInt(1e6),
      // In nanoseconds.
      targets
    );
    const challenge = new Uint8Array([
      ...agent_1.IC_REQUEST_AUTH_DELEGATION_DOMAIN_SEPARATOR,
      ...new Uint8Array((0, agent_1.requestIdOf)({ ...delegation2 }))
    ]);
    const signature = await from.sign(challenge);
    return {
      delegation: delegation2,
      signature
    };
  }
  class DelegationChain2 {
    /**
     * Create a delegation chain between two (or more) keys. By default, the expiration time
     * will be very short (15 minutes).
     *
     * To build a chain of more than 2 identities, this function needs to be called multiple times,
     * passing the previous delegation chain into the options argument. For example:
     * @example
     * const rootKey = createKey();
     * const middleKey = createKey();
     * const bottomeKey = createKey();
     *
     * const rootToMiddle = await DelegationChain.create(
     *   root, middle.getPublicKey(), Date.parse('2100-01-01'),
     * );
     * const middleToBottom = await DelegationChain.create(
     *   middle, bottom.getPublicKey(), Date.parse('2100-01-01'), { previous: rootToMiddle },
     * );
     *
     * // We can now use a delegation identity that uses the delegation above:
     * const identity = DelegationIdentity.fromDelegation(bottomKey, middleToBottom);
     * @param from The identity that will delegate.
     * @param to The identity that gets delegated. It can now sign messages as if it was the
     *           identity above.
     * @param expiration The length the delegation is valid. By default, 15 minutes from calling
     *                   this function.
     * @param options A set of options for this delegation. expiration and previous
     * @param options.previous - Another DelegationChain that this chain should start with.
     * @param options.targets - targets that scope the delegation (e.g. Canister Principals)
     */
    static async create(from, to, expiration = new Date(Date.now() + 15 * 60 * 1e3), options = {}) {
      var _a, _b;
      const delegation2 = await _createSingleDelegation2(from, to, expiration, options.targets);
      return new DelegationChain2([...((_a = options.previous) == null ? void 0 : _a.delegations) || [], delegation2], ((_b = options.previous) == null ? void 0 : _b.publicKey) || from.getPublicKey().toDer());
    }
    /**
     * Creates a DelegationChain object from a JSON string.
     * @param json The JSON string to parse.
     */
    static fromJSON(json) {
      const { publicKey, delegations } = typeof json === "string" ? JSON.parse(json) : json;
      if (!Array.isArray(delegations)) {
        throw new Error("Invalid delegations.");
      }
      const parsedDelegations = delegations.map((signedDelegation) => {
        const { delegation: delegation2, signature } = signedDelegation;
        const { pubkey, expiration, targets } = delegation2;
        if (targets !== void 0 && !Array.isArray(targets)) {
          throw new Error("Invalid targets.");
        }
        return {
          delegation: new Delegation2(
            _parseBlob2(pubkey),
            BigInt("0x" + expiration),
            // expiration in JSON is an hexa string (See toJSON() below).
            targets && targets.map((t) => {
              if (typeof t !== "string") {
                throw new Error("Invalid target.");
              }
              return principal_1.Principal.fromHex(t);
            })
          ),
          signature: _parseBlob2(signature)
        };
      });
      return new this(parsedDelegations, _parseBlob2(publicKey));
    }
    /**
     * Creates a DelegationChain object from a list of delegations and a DER-encoded public key.
     * @param delegations The list of delegations.
     * @param publicKey The DER-encoded public key of the key-pair signing the first delegation.
     */
    static fromDelegations(delegations, publicKey) {
      return new this(delegations, publicKey);
    }
    constructor(delegations, publicKey) {
      this.delegations = delegations;
      this.publicKey = publicKey;
    }
    toJSON() {
      return {
        delegations: this.delegations.map((signedDelegation) => {
          const { delegation: delegation2, signature } = signedDelegation;
          const { targets } = delegation2;
          return {
            delegation: {
              expiration: delegation2.expiration.toString(16),
              pubkey: safeBytesToHex2(delegation2.pubkey),
              ...targets && {
                targets: targets.map((t) => t.toHex())
              }
            },
            signature: safeBytesToHex2(signature)
          };
        }),
        publicKey: safeBytesToHex2(this.publicKey)
      };
    }
  }
  delegation.DelegationChain = DelegationChain2;
  class DelegationIdentity2 extends agent_1.SignIdentity {
    /**
     * Create a delegation without having access to delegateKey.
     * @param key The key used to sign the requests.
     * @param delegation A delegation object created using `createDelegation`.
     */
    static fromDelegation(key, delegation2) {
      return new this(key, delegation2);
    }
    constructor(_inner2, _delegation3) {
      super();
      this._inner = _inner2;
      this._delegation = _delegation3;
    }
    getDelegation() {
      return this._delegation;
    }
    getPublicKey() {
      return {
        derKey: this._delegation.publicKey,
        toDer: () => this._delegation.publicKey
      };
    }
    sign(blob) {
      return this._inner.sign(blob);
    }
    async transformRequest(request) {
      const { body, ...fields } = request;
      const requestId = await (0, agent_1.requestIdOf)(body);
      return {
        ...fields,
        body: {
          content: body,
          sender_sig: await this.sign(new Uint8Array([...agent_1.IC_REQUEST_DOMAIN_SEPARATOR, ...new Uint8Array(requestId)])),
          sender_delegation: this._delegation.delegations,
          sender_pubkey: this._delegation.publicKey
        }
      };
    }
  }
  delegation.DelegationIdentity = DelegationIdentity2;
  const _PartialDelegationIdentity2 = class _PartialDelegationIdentity2 extends partial_ts_1.PartialIdentity {
    constructor(inner, delegation2) {
      super(inner);
      __privateAdd(this, _delegation2);
      __privateSet(this, _delegation2, delegation2);
    }
    /**
     * The Delegation Chain of this identity.
     */
    get delegation() {
      return __privateGet(this, _delegation2);
    }
    /**
     * Create a {@link PartialDelegationIdentity} from a {@link PublicKey} and a {@link DelegationChain}.
     * @param key The {@link PublicKey} to delegate to.
     * @param delegation a {@link DelegationChain} targeting the inner key.
     */
    static fromDelegation(key, delegation2) {
      return new _PartialDelegationIdentity2(key, delegation2);
    }
  };
  _delegation2 = new WeakMap();
  let PartialDelegationIdentity2 = _PartialDelegationIdentity2;
  delegation.PartialDelegationIdentity = PartialDelegationIdentity2;
  function isDelegationValid2(chain, checks) {
    for (const { delegation: delegation2 } of chain.delegations) {
      if (+new Date(Number(delegation2.expiration / BigInt(1e6))) <= +Date.now()) {
        return false;
      }
    }
    const scopes = [];
    const maybeScope = checks == null ? void 0 : checks.scope;
    if (maybeScope) {
      if (Array.isArray(maybeScope)) {
        scopes.push(...maybeScope.map((s) => typeof s === "string" ? principal_1.Principal.fromText(s) : s));
      } else {
        scopes.push(typeof maybeScope === "string" ? principal_1.Principal.fromText(maybeScope) : maybeScope);
      }
    }
    for (const s of scopes) {
      const scope = s.toText();
      for (const { delegation: delegation2 } of chain.delegations) {
        if (delegation2.targets === void 0) {
          continue;
        }
        let none = true;
        for (const target of delegation2.targets) {
          if (target.toText() === scope) {
            none = false;
            break;
          }
        }
        if (none) {
          return false;
        }
      }
    }
    return true;
  }
  return delegation;
}
var webauthn = {};
var hasRequiredWebauthn;
function requireWebauthn() {
  if (hasRequiredWebauthn) return webauthn;
  hasRequiredWebauthn = 1;
  Object.defineProperty(webauthn, "__esModule", { value: true });
  webauthn.WebAuthnIdentity = webauthn.CosePublicKey = void 0;
  const agent_1 = requireCjs$2();
  const utils_1 = requireUtils();
  const candid_1 = requireCjs$1();
  function _coseToDerEncodedBlob(cose) {
    return (0, agent_1.wrapDER)(cose, agent_1.DER_COSE_OID);
  }
  function _authDataToCose(authData) {
    const dataView = new DataView(new ArrayBuffer(2));
    const idLenBytes = authData.slice(53, 55);
    [...new Uint8Array(idLenBytes)].forEach((v, i) => dataView.setUint8(i, v));
    const credentialIdLength = dataView.getUint16(0);
    return authData.slice(55 + credentialIdLength);
  }
  class CosePublicKey {
    constructor(_cose) {
      this._cose = _cose;
      this._encodedKey = _coseToDerEncodedBlob(_cose);
    }
    toDer() {
      return this._encodedKey;
    }
    getCose() {
      return this._cose;
    }
  }
  webauthn.CosePublicKey = CosePublicKey;
  function _createChallengeBuffer(challenge = "<ic0.app>") {
    if (typeof challenge === "string") {
      return Uint8Array.from(challenge, (c) => c.charCodeAt(0));
    } else {
      return challenge;
    }
  }
  async function _createCredential(credentialCreationOptions) {
    const creds = await navigator.credentials.create(credentialCreationOptions ?? {
      publicKey: {
        authenticatorSelection: {
          userVerification: "preferred"
        },
        attestation: "direct",
        challenge: _createChallengeBuffer(),
        pubKeyCredParams: [{ type: "public-key", alg: PubKeyCoseAlgo.ECDSA_WITH_SHA256 }],
        rp: {
          name: "Internet Identity Service"
        },
        user: {
          id: (0, utils_1.randomBytes)(16),
          name: "Internet Identity",
          displayName: "Internet Identity"
        }
      }
    });
    if (creds === null) {
      return null;
    }
    return {
      // do _not_ use ...creds here, as creds is not enumerable in all cases
      id: creds.id,
      response: creds.response,
      type: creds.type,
      authenticatorAttachment: creds.authenticatorAttachment,
      getClientExtensionResults: creds.getClientExtensionResults,
      // Some password managers will return a Uint8Array, so we ensure we return an ArrayBuffer.
      rawId: creds.rawId,
      toJSON: creds.toJSON.bind(creds)
      // Ensure the toJSON method is included
    };
  }
  var PubKeyCoseAlgo;
  (function(PubKeyCoseAlgo2) {
    PubKeyCoseAlgo2[PubKeyCoseAlgo2["ECDSA_WITH_SHA256"] = -7] = "ECDSA_WITH_SHA256";
  })(PubKeyCoseAlgo || (PubKeyCoseAlgo = {}));
  class WebAuthnIdentity extends agent_1.SignIdentity {
    /**
     * Create an identity from a JSON serialization.
     * @param json - json to parse
     */
    static fromJSON(json) {
      const { publicKey, rawId } = JSON.parse(json);
      if (typeof publicKey !== "string" || typeof rawId !== "string") {
        throw new Error("Invalid JSON string.");
      }
      return new this((0, utils_1.hexToBytes)(rawId), (0, utils_1.hexToBytes)(publicKey), void 0);
    }
    /**
     * Create an identity.
     * @param credentialCreationOptions an optional CredentialCreationOptions Challenge
     */
    static async create(credentialCreationOptions) {
      const creds = await _createCredential(credentialCreationOptions);
      if (!creds || creds.type !== "public-key") {
        throw new Error("Could not create credentials.");
      }
      const response = creds.response;
      if (response.attestationObject === void 0) {
        throw new Error("Was expecting an attestation response.");
      }
      const attObject = agent_1.Cbor.decode(new Uint8Array(response.attestationObject));
      return new this((0, candid_1.uint8FromBufLike)(creds.rawId), _authDataToCose(attObject.authData), creds.authenticatorAttachment ?? void 0);
    }
    constructor(rawId, cose, authenticatorAttachment) {
      super();
      this.rawId = rawId;
      this.authenticatorAttachment = authenticatorAttachment;
      this._publicKey = new CosePublicKey(cose);
    }
    getPublicKey() {
      return this._publicKey;
    }
    /**
     * WebAuthn level 3 spec introduces a new attribute on successful WebAuthn interactions,
     * see https://w3c.github.io/webauthn/#dom-publickeycredential-authenticatorattachment.
     * This attribute is already implemented for Chrome, Safari and Edge.
     *
     * Given the attribute is only available after a successful interaction, the information is
     * provided opportunistically and might also be `undefined`.
     */
    getAuthenticatorAttachment() {
      return this.authenticatorAttachment;
    }
    async sign(blob) {
      const result = await navigator.credentials.get({
        publicKey: {
          allowCredentials: [
            {
              type: "public-key",
              id: this.rawId
            }
          ],
          challenge: blob,
          userVerification: "preferred"
        }
      });
      if (result.authenticatorAttachment !== null) {
        this.authenticatorAttachment = result.authenticatorAttachment;
      }
      const response = result.response;
      const encoded = agent_1.Cbor.encode({
        authenticator_data: response.authenticatorData,
        client_data_json: (0, utils_1.bytesToUtf8)(new Uint8Array(response.clientDataJSON)),
        signature: response.signature
      });
      if (!encoded) {
        throw new Error("failed to encode cbor");
      }
      Object.assign(encoded, {
        __signature__: void 0
      });
      return encoded;
    }
    /**
     * Allow for JSON serialization of all information needed to reuse this identity.
     */
    toJSON() {
      return {
        publicKey: (0, utils_1.bytesToHex)(this._publicKey.getCose()),
        rawId: (0, utils_1.bytesToHex)(this.rawId)
      };
    }
  }
  webauthn.WebAuthnIdentity = WebAuthnIdentity;
  return webauthn;
}
var hasRequiredCjs;
function requireCjs() {
  if (hasRequiredCjs) return cjs;
  hasRequiredCjs = 1;
  (function(exports$1) {
    var __createBinding = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = commonjsGlobal && commonjsGlobal.__exportStar || function(m, exports$12) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$12, p)) __createBinding(exports$12, m, p);
    };
    Object.defineProperty(exports$1, "__esModule", { value: true });
    exports$1.Secp256k1KeyIdentity = exports$1.ED25519_OID = exports$1.DER_COSE_OID = exports$1.unwrapDER = exports$1.wrapDER = exports$1.WebAuthnIdentity = void 0;
    __exportStar(requireEd25519(), exports$1);
    __exportStar(requireEcdsa(), exports$1);
    __exportStar(requireDelegation(), exports$1);
    __exportStar(requirePartial(), exports$1);
    var webauthn_ts_1 = requireWebauthn();
    Object.defineProperty(exports$1, "WebAuthnIdentity", { enumerable: true, get: function() {
      return webauthn_ts_1.WebAuthnIdentity;
    } });
    var agent_1 = requireCjs$2();
    Object.defineProperty(exports$1, "wrapDER", { enumerable: true, get: function() {
      return agent_1.wrapDER;
    } });
    Object.defineProperty(exports$1, "unwrapDER", { enumerable: true, get: function() {
      return agent_1.unwrapDER;
    } });
    Object.defineProperty(exports$1, "DER_COSE_OID", { enumerable: true, get: function() {
      return agent_1.DER_COSE_OID;
    } });
    Object.defineProperty(exports$1, "ED25519_OID", { enumerable: true, get: function() {
      return agent_1.ED25519_OID;
    } });
    class Secp256k1KeyIdentity {
      constructor() {
        throw new Error("Secp256k1KeyIdentity has been moved to a new repo: @dfinity/identity-secp256k1");
      }
    }
    exports$1.Secp256k1KeyIdentity = Secp256k1KeyIdentity;
  })(cjs);
  return cjs;
}
var storage = {};
var db = {};
const require$$1 = /* @__PURE__ */ getAugmentedNamespace(build);
var hasRequiredDb;
function requireDb() {
  if (hasRequiredDb) return db;
  hasRequiredDb = 1;
  Object.defineProperty(db, "__esModule", { value: true });
  db.IdbKeyVal = void 0;
  const tslib_1 = require$$0;
  const idb_1 = require$$1;
  const storage_1 = requireStorage();
  const AUTH_DB_NAME2 = "nfid-auth-client-db";
  const OBJECT_STORE_NAME2 = "ic-keyval";
  const _openDbStore2 = (dbName = AUTH_DB_NAME2, storeName = OBJECT_STORE_NAME2, version2) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (storage_1.isBrowser && (localStorage === null || localStorage === void 0 ? void 0 : localStorage.getItem(storage_1.KEY_STORAGE_DELEGATION))) {
      localStorage.removeItem(storage_1.KEY_STORAGE_DELEGATION);
      localStorage.removeItem(storage_1.KEY_STORAGE_KEY);
    }
    return yield (0, idb_1.openDB)(dbName, version2, {
      upgrade: (database) => {
        database.objectStoreNames;
        if (database.objectStoreNames.contains(storeName)) {
          database.clear(storeName);
        }
        database.createObjectStore(storeName);
      }
    });
  });
  function _getValue2(db2, storeName, key) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      return yield db2.get(storeName, key);
    });
  }
  function _setValue2(db2, storeName, key, value) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      return yield db2.put(storeName, value, key);
    });
  }
  function _removeValue2(db2, storeName, key) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      return yield db2.delete(storeName, key);
    });
  }
  class IdbKeyVal2 {
    /**
     *
     * @param {DBCreateOptions} options {@link DbCreateOptions}
     * @param {DBCreateOptions['dbName']} options.dbName name for the indexeddb database
     * @default 'nfid-auth-client-db'
     * @param {DBCreateOptions['storeName']} options.storeName name for the indexeddb Data Store
     * @default 'ic-keyval'
     * @param {DBCreateOptions['version']} options.version version of the database. Increment to safely upgrade
     * @constructs an {@link IdbKeyVal}
     */
    static create(options) {
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { dbName = AUTH_DB_NAME2, storeName = OBJECT_STORE_NAME2, version: version2 = 1 } = options !== null && options !== void 0 ? options : {};
        const db2 = yield _openDbStore2(dbName, storeName, version2);
        return new IdbKeyVal2(db2, storeName);
      });
    }
    // Do not use - instead prefer create
    constructor(_db, _storeName) {
      this._db = _db;
      this._storeName = _storeName;
    }
    /**
     * Basic setter
     * @param {IDBValidKey} key string | number | Date | BufferSource | IDBValidKey[]
     * @param value value to set
     * @returns void
     */
    set(key, value) {
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return yield _setValue2(this._db, this._storeName, key, value);
      });
    }
    /**
     * Basic getter
     * Pass in a type T for type safety if you know the type the value will have if it is found
     * @param {IDBValidKey} key string | number | Date | BufferSource | IDBValidKey[]
     * @returns `Promise<T | null>`
     * @example
     * await get<string>('exampleKey') -> 'exampleValue'
     */
    get(key) {
      var _a;
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return (_a = yield _getValue2(this._db, this._storeName, key)) !== null && _a !== void 0 ? _a : null;
      });
    }
    /**
     * Remove a key
     * @param key {@link IDBValidKey}
     * @returns void
     */
    remove(key) {
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return yield _removeValue2(this._db, this._storeName, key);
      });
    }
  }
  db.IdbKeyVal = IdbKeyVal2;
  return db;
}
var hasRequiredStorage;
function requireStorage() {
  if (hasRequiredStorage) return storage;
  hasRequiredStorage = 1;
  (function(exports$1) {
    Object.defineProperty(exports$1, "__esModule", { value: true });
    exports$1.IdbStorage = exports$1.LocalStorage = exports$1.isBrowser = exports$1.DB_VERSION = exports$1.KEY_VECTOR = exports$1.KEY_STORAGE_DELEGATION = exports$1.KEY_STORAGE_KEY = void 0;
    const tslib_1 = require$$0;
    const db_1 = requireDb();
    exports$1.KEY_STORAGE_KEY = "identity";
    exports$1.KEY_STORAGE_DELEGATION = "delegation";
    exports$1.KEY_VECTOR = "iv";
    exports$1.DB_VERSION = 1;
    exports$1.isBrowser = typeof window !== "undefined";
    class LocalStorage2 {
      constructor(prefix = "ic-", _localStorage) {
        this.prefix = prefix;
        this._localStorage = _localStorage;
      }
      get(key) {
        return Promise.resolve(this._getLocalStorage().getItem(this.prefix + key));
      }
      set(key, value) {
        this._getLocalStorage().setItem(this.prefix + key, value);
        return Promise.resolve();
      }
      remove(key) {
        this._getLocalStorage().removeItem(this.prefix + key);
        return Promise.resolve();
      }
      _getLocalStorage() {
        if (this._localStorage) {
          return this._localStorage;
        }
        const ls = typeof window === "undefined" ? typeof commonjsGlobal === "undefined" ? typeof self === "undefined" ? void 0 : self.localStorage : commonjsGlobal.localStorage : window.localStorage;
        if (!ls) {
          throw new Error("Could not find local storage.");
        }
        return ls;
      }
    }
    exports$1.LocalStorage = LocalStorage2;
    class IdbStorage2 {
      get _db() {
        return new Promise((resolve) => {
          if (this.initializedDb) {
            resolve(this.initializedDb);
            return;
          }
          db_1.IdbKeyVal.create({ version: exports$1.DB_VERSION }).then((db2) => {
            this.initializedDb = db2;
            resolve(db2);
          });
        });
      }
      get(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          const db2 = yield this._db;
          return yield db2.get(key);
        });
      }
      set(key, value) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          const db2 = yield this._db;
          yield db2.set(key, value);
        });
      }
      remove(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          const db2 = yield this._db;
          yield db2.remove(key);
        });
      }
    }
    exports$1.IdbStorage = IdbStorage2;
  })(storage);
  return storage;
}
var postmsgRpc = {};
var commonjsBrowser = {};
var v1 = {};
var rng = {};
var hasRequiredRng;
function requireRng() {
  if (hasRequiredRng) return rng;
  hasRequiredRng = 1;
  Object.defineProperty(rng, "__esModule", {
    value: true
  });
  rng.default = rng$1;
  let getRandomValues;
  const rnds8 = new Uint8Array(16);
  function rng$1() {
    if (!getRandomValues) {
      getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
      if (!getRandomValues) {
        throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
      }
    }
    return getRandomValues(rnds8);
  }
  return rng;
}
var stringify = {};
var validate = {};
var regex = {};
var hasRequiredRegex;
function requireRegex() {
  if (hasRequiredRegex) return regex;
  hasRequiredRegex = 1;
  Object.defineProperty(regex, "__esModule", {
    value: true
  });
  regex.default = void 0;
  var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
  regex.default = _default;
  return regex;
}
var hasRequiredValidate;
function requireValidate() {
  if (hasRequiredValidate) return validate;
  hasRequiredValidate = 1;
  Object.defineProperty(validate, "__esModule", {
    value: true
  });
  validate.default = void 0;
  var _regex = _interopRequireDefault(requireRegex());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function validate$1(uuid) {
    return typeof uuid === "string" && _regex.default.test(uuid);
  }
  var _default = validate$1;
  validate.default = _default;
  return validate;
}
var hasRequiredStringify;
function requireStringify() {
  if (hasRequiredStringify) return stringify;
  hasRequiredStringify = 1;
  Object.defineProperty(stringify, "__esModule", {
    value: true
  });
  stringify.default = void 0;
  stringify.unsafeStringify = unsafeStringify;
  var _validate = _interopRequireDefault(requireValidate());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  const byteToHex = [];
  for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 256).toString(16).slice(1));
  }
  function unsafeStringify(arr, offset = 0) {
    return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
  }
  function stringify$1(arr, offset = 0) {
    const uuid = unsafeStringify(arr, offset);
    if (!(0, _validate.default)(uuid)) {
      throw TypeError("Stringified UUID is invalid");
    }
    return uuid;
  }
  var _default = stringify$1;
  stringify.default = _default;
  return stringify;
}
var hasRequiredV1;
function requireV1() {
  if (hasRequiredV1) return v1;
  hasRequiredV1 = 1;
  Object.defineProperty(v1, "__esModule", {
    value: true
  });
  v1.default = void 0;
  var _rng = _interopRequireDefault(requireRng());
  var _stringify = requireStringify();
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  let _nodeId;
  let _clockseq;
  let _lastMSecs = 0;
  let _lastNSecs = 0;
  function v1$1(options, buf, offset) {
    let i = buf && offset || 0;
    const b = buf || new Array(16);
    options = options || {};
    let node = options.node || _nodeId;
    let clockseq = options.clockseq !== void 0 ? options.clockseq : _clockseq;
    if (node == null || clockseq == null) {
      const seedBytes = options.random || (options.rng || _rng.default)();
      if (node == null) {
        node = _nodeId = [seedBytes[0] | 1, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
      }
      if (clockseq == null) {
        clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 16383;
      }
    }
    let msecs = options.msecs !== void 0 ? options.msecs : Date.now();
    let nsecs = options.nsecs !== void 0 ? options.nsecs : _lastNSecs + 1;
    const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 1e4;
    if (dt < 0 && options.clockseq === void 0) {
      clockseq = clockseq + 1 & 16383;
    }
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === void 0) {
      nsecs = 0;
    }
    if (nsecs >= 1e4) {
      throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
    }
    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq;
    msecs += 122192928e5;
    const tl = ((msecs & 268435455) * 1e4 + nsecs) % 4294967296;
    b[i++] = tl >>> 24 & 255;
    b[i++] = tl >>> 16 & 255;
    b[i++] = tl >>> 8 & 255;
    b[i++] = tl & 255;
    const tmh = msecs / 4294967296 * 1e4 & 268435455;
    b[i++] = tmh >>> 8 & 255;
    b[i++] = tmh & 255;
    b[i++] = tmh >>> 24 & 15 | 16;
    b[i++] = tmh >>> 16 & 255;
    b[i++] = clockseq >>> 8 | 128;
    b[i++] = clockseq & 255;
    for (let n = 0; n < 6; ++n) {
      b[i + n] = node[n];
    }
    return buf || (0, _stringify.unsafeStringify)(b);
  }
  var _default = v1$1;
  v1.default = _default;
  return v1;
}
var v3 = {};
var v35 = {};
var parse = {};
var hasRequiredParse;
function requireParse() {
  if (hasRequiredParse) return parse;
  hasRequiredParse = 1;
  Object.defineProperty(parse, "__esModule", {
    value: true
  });
  parse.default = void 0;
  var _validate = _interopRequireDefault(requireValidate());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function parse$1(uuid) {
    if (!(0, _validate.default)(uuid)) {
      throw TypeError("Invalid UUID");
    }
    let v;
    const arr = new Uint8Array(16);
    arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
    arr[1] = v >>> 16 & 255;
    arr[2] = v >>> 8 & 255;
    arr[3] = v & 255;
    arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
    arr[5] = v & 255;
    arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
    arr[7] = v & 255;
    arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
    arr[9] = v & 255;
    arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 1099511627776 & 255;
    arr[11] = v / 4294967296 & 255;
    arr[12] = v >>> 24 & 255;
    arr[13] = v >>> 16 & 255;
    arr[14] = v >>> 8 & 255;
    arr[15] = v & 255;
    return arr;
  }
  var _default = parse$1;
  parse.default = _default;
  return parse;
}
var hasRequiredV35;
function requireV35() {
  if (hasRequiredV35) return v35;
  hasRequiredV35 = 1;
  Object.defineProperty(v35, "__esModule", {
    value: true
  });
  v35.URL = v35.DNS = void 0;
  v35.default = v35$1;
  var _stringify = requireStringify();
  var _parse = _interopRequireDefault(requireParse());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function stringToBytes(str) {
    str = unescape(encodeURIComponent(str));
    const bytes = [];
    for (let i = 0; i < str.length; ++i) {
      bytes.push(str.charCodeAt(i));
    }
    return bytes;
  }
  const DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
  v35.DNS = DNS;
  const URL2 = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
  v35.URL = URL2;
  function v35$1(name, version2, hashfunc) {
    function generateUUID(value, namespace, buf, offset) {
      var _namespace;
      if (typeof value === "string") {
        value = stringToBytes(value);
      }
      if (typeof namespace === "string") {
        namespace = (0, _parse.default)(namespace);
      }
      if (((_namespace = namespace) === null || _namespace === void 0 ? void 0 : _namespace.length) !== 16) {
        throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
      }
      let bytes = new Uint8Array(16 + value.length);
      bytes.set(namespace);
      bytes.set(value, namespace.length);
      bytes = hashfunc(bytes);
      bytes[6] = bytes[6] & 15 | version2;
      bytes[8] = bytes[8] & 63 | 128;
      if (buf) {
        offset = offset || 0;
        for (let i = 0; i < 16; ++i) {
          buf[offset + i] = bytes[i];
        }
        return buf;
      }
      return (0, _stringify.unsafeStringify)(bytes);
    }
    try {
      generateUUID.name = name;
    } catch (err) {
    }
    generateUUID.DNS = DNS;
    generateUUID.URL = URL2;
    return generateUUID;
  }
  return v35;
}
var md5 = {};
var hasRequiredMd5;
function requireMd5() {
  if (hasRequiredMd5) return md5;
  hasRequiredMd5 = 1;
  Object.defineProperty(md5, "__esModule", {
    value: true
  });
  md5.default = void 0;
  function md5$1(bytes) {
    if (typeof bytes === "string") {
      const msg = unescape(encodeURIComponent(bytes));
      bytes = new Uint8Array(msg.length);
      for (let i = 0; i < msg.length; ++i) {
        bytes[i] = msg.charCodeAt(i);
      }
    }
    return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
  }
  function md5ToHexEncodedArray(input) {
    const output = [];
    const length32 = input.length * 32;
    const hexTab = "0123456789abcdef";
    for (let i = 0; i < length32; i += 8) {
      const x = input[i >> 5] >>> i % 32 & 255;
      const hex = parseInt(hexTab.charAt(x >>> 4 & 15) + hexTab.charAt(x & 15), 16);
      output.push(hex);
    }
    return output;
  }
  function getOutputLength(inputLength8) {
    return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
  }
  function wordsToMd5(x, len) {
    x[len >> 5] |= 128 << len % 32;
    x[getOutputLength(len) - 1] = len;
    let a = 1732584193;
    let b = -271733879;
    let c = -1732584194;
    let d = 271733878;
    for (let i = 0; i < x.length; i += 16) {
      const olda = a;
      const oldb = b;
      const oldc = c;
      const oldd = d;
      a = md5ff(a, b, c, d, x[i], 7, -680876936);
      d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
      b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
      a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = md5gg(b, c, d, a, x[i], 20, -373897302);
      a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
      a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
      d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = md5hh(d, a, b, c, x[i], 11, -358537222);
      c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
      a = md5ii(a, b, c, d, x[i], 6, -198630844);
      d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
      a = safeAdd(a, olda);
      b = safeAdd(b, oldb);
      c = safeAdd(c, oldc);
      d = safeAdd(d, oldd);
    }
    return [a, b, c, d];
  }
  function bytesToWords(input) {
    if (input.length === 0) {
      return [];
    }
    const length8 = input.length * 8;
    const output = new Uint32Array(getOutputLength(length8));
    for (let i = 0; i < length8; i += 8) {
      output[i >> 5] |= (input[i / 8] & 255) << i % 32;
    }
    return output;
  }
  function safeAdd(x, y) {
    const lsw = (x & 65535) + (y & 65535);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return msw << 16 | lsw & 65535;
  }
  function bitRotateLeft(num, cnt) {
    return num << cnt | num >>> 32 - cnt;
  }
  function md5cmn(q, a, b, x, s, t) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  }
  function md5ff(a, b, c, d, x, s, t) {
    return md5cmn(b & c | ~b & d, a, b, x, s, t);
  }
  function md5gg(a, b, c, d, x, s, t) {
    return md5cmn(b & d | c & ~d, a, b, x, s, t);
  }
  function md5hh(a, b, c, d, x, s, t) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5ii(a, b, c, d, x, s, t) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
  }
  var _default = md5$1;
  md5.default = _default;
  return md5;
}
var hasRequiredV3;
function requireV3() {
  if (hasRequiredV3) return v3;
  hasRequiredV3 = 1;
  Object.defineProperty(v3, "__esModule", {
    value: true
  });
  v3.default = void 0;
  var _v = _interopRequireDefault(requireV35());
  var _md = _interopRequireDefault(requireMd5());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  const v3$1 = (0, _v.default)("v3", 48, _md.default);
  var _default = v3$1;
  v3.default = _default;
  return v3;
}
var v4 = {};
var native = {};
var hasRequiredNative;
function requireNative() {
  if (hasRequiredNative) return native;
  hasRequiredNative = 1;
  Object.defineProperty(native, "__esModule", {
    value: true
  });
  native.default = void 0;
  const randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
  var _default = {
    randomUUID
  };
  native.default = _default;
  return native;
}
var hasRequiredV4;
function requireV4() {
  if (hasRequiredV4) return v4;
  hasRequiredV4 = 1;
  Object.defineProperty(v4, "__esModule", {
    value: true
  });
  v4.default = void 0;
  var _native = _interopRequireDefault(requireNative());
  var _rng = _interopRequireDefault(requireRng());
  var _stringify = requireStringify();
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function v4$1(options, buf, offset) {
    if (_native.default.randomUUID && !buf && !options) {
      return _native.default.randomUUID();
    }
    options = options || {};
    const rnds = options.random || (options.rng || _rng.default)();
    rnds[6] = rnds[6] & 15 | 64;
    rnds[8] = rnds[8] & 63 | 128;
    if (buf) {
      offset = offset || 0;
      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = rnds[i];
      }
      return buf;
    }
    return (0, _stringify.unsafeStringify)(rnds);
  }
  var _default = v4$1;
  v4.default = _default;
  return v4;
}
var v5 = {};
var sha1 = {};
var hasRequiredSha1;
function requireSha1() {
  if (hasRequiredSha1) return sha1;
  hasRequiredSha1 = 1;
  Object.defineProperty(sha1, "__esModule", {
    value: true
  });
  sha1.default = void 0;
  function f(s, x, y, z) {
    switch (s) {
      case 0:
        return x & y ^ ~x & z;
      case 1:
        return x ^ y ^ z;
      case 2:
        return x & y ^ x & z ^ y & z;
      case 3:
        return x ^ y ^ z;
    }
  }
  function ROTL(x, n) {
    return x << n | x >>> 32 - n;
  }
  function sha1$1(bytes) {
    const K = [1518500249, 1859775393, 2400959708, 3395469782];
    const H = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
    if (typeof bytes === "string") {
      const msg = unescape(encodeURIComponent(bytes));
      bytes = [];
      for (let i = 0; i < msg.length; ++i) {
        bytes.push(msg.charCodeAt(i));
      }
    } else if (!Array.isArray(bytes)) {
      bytes = Array.prototype.slice.call(bytes);
    }
    bytes.push(128);
    const l = bytes.length / 4 + 2;
    const N = Math.ceil(l / 16);
    const M = new Array(N);
    for (let i = 0; i < N; ++i) {
      const arr = new Uint32Array(16);
      for (let j = 0; j < 16; ++j) {
        arr[j] = bytes[i * 64 + j * 4] << 24 | bytes[i * 64 + j * 4 + 1] << 16 | bytes[i * 64 + j * 4 + 2] << 8 | bytes[i * 64 + j * 4 + 3];
      }
      M[i] = arr;
    }
    M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
    M[N - 1][14] = Math.floor(M[N - 1][14]);
    M[N - 1][15] = (bytes.length - 1) * 8 & 4294967295;
    for (let i = 0; i < N; ++i) {
      const W = new Uint32Array(80);
      for (let t = 0; t < 16; ++t) {
        W[t] = M[i][t];
      }
      for (let t = 16; t < 80; ++t) {
        W[t] = ROTL(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
      }
      let a = H[0];
      let b = H[1];
      let c = H[2];
      let d = H[3];
      let e = H[4];
      for (let t = 0; t < 80; ++t) {
        const s = Math.floor(t / 20);
        const T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[t] >>> 0;
        e = d;
        d = c;
        c = ROTL(b, 30) >>> 0;
        b = a;
        a = T;
      }
      H[0] = H[0] + a >>> 0;
      H[1] = H[1] + b >>> 0;
      H[2] = H[2] + c >>> 0;
      H[3] = H[3] + d >>> 0;
      H[4] = H[4] + e >>> 0;
    }
    return [H[0] >> 24 & 255, H[0] >> 16 & 255, H[0] >> 8 & 255, H[0] & 255, H[1] >> 24 & 255, H[1] >> 16 & 255, H[1] >> 8 & 255, H[1] & 255, H[2] >> 24 & 255, H[2] >> 16 & 255, H[2] >> 8 & 255, H[2] & 255, H[3] >> 24 & 255, H[3] >> 16 & 255, H[3] >> 8 & 255, H[3] & 255, H[4] >> 24 & 255, H[4] >> 16 & 255, H[4] >> 8 & 255, H[4] & 255];
  }
  var _default = sha1$1;
  sha1.default = _default;
  return sha1;
}
var hasRequiredV5;
function requireV5() {
  if (hasRequiredV5) return v5;
  hasRequiredV5 = 1;
  Object.defineProperty(v5, "__esModule", {
    value: true
  });
  v5.default = void 0;
  var _v = _interopRequireDefault(requireV35());
  var _sha = _interopRequireDefault(requireSha1());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  const v5$1 = (0, _v.default)("v5", 80, _sha.default);
  var _default = v5$1;
  v5.default = _default;
  return v5;
}
var nil = {};
var hasRequiredNil;
function requireNil() {
  if (hasRequiredNil) return nil;
  hasRequiredNil = 1;
  Object.defineProperty(nil, "__esModule", {
    value: true
  });
  nil.default = void 0;
  var _default = "00000000-0000-0000-0000-000000000000";
  nil.default = _default;
  return nil;
}
var version = {};
var hasRequiredVersion;
function requireVersion() {
  if (hasRequiredVersion) return version;
  hasRequiredVersion = 1;
  Object.defineProperty(version, "__esModule", {
    value: true
  });
  version.default = void 0;
  var _validate = _interopRequireDefault(requireValidate());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function version$1(uuid) {
    if (!(0, _validate.default)(uuid)) {
      throw TypeError("Invalid UUID");
    }
    return parseInt(uuid.slice(14, 15), 16);
  }
  var _default = version$1;
  version.default = _default;
  return version;
}
var hasRequiredCommonjsBrowser;
function requireCommonjsBrowser() {
  if (hasRequiredCommonjsBrowser) return commonjsBrowser;
  hasRequiredCommonjsBrowser = 1;
  (function(exports$1) {
    Object.defineProperty(exports$1, "__esModule", {
      value: true
    });
    Object.defineProperty(exports$1, "NIL", {
      enumerable: true,
      get: function get() {
        return _nil.default;
      }
    });
    Object.defineProperty(exports$1, "parse", {
      enumerable: true,
      get: function get() {
        return _parse.default;
      }
    });
    Object.defineProperty(exports$1, "stringify", {
      enumerable: true,
      get: function get() {
        return _stringify.default;
      }
    });
    Object.defineProperty(exports$1, "v1", {
      enumerable: true,
      get: function get() {
        return _v.default;
      }
    });
    Object.defineProperty(exports$1, "v3", {
      enumerable: true,
      get: function get() {
        return _v2.default;
      }
    });
    Object.defineProperty(exports$1, "v4", {
      enumerable: true,
      get: function get() {
        return _v3.default;
      }
    });
    Object.defineProperty(exports$1, "v5", {
      enumerable: true,
      get: function get() {
        return _v4.default;
      }
    });
    Object.defineProperty(exports$1, "validate", {
      enumerable: true,
      get: function get() {
        return _validate.default;
      }
    });
    Object.defineProperty(exports$1, "version", {
      enumerable: true,
      get: function get() {
        return _version.default;
      }
    });
    var _v = _interopRequireDefault(requireV1());
    var _v2 = _interopRequireDefault(requireV3());
    var _v3 = _interopRequireDefault(requireV4());
    var _v4 = _interopRequireDefault(requireV5());
    var _nil = _interopRequireDefault(requireNil());
    var _version = _interopRequireDefault(requireVersion());
    var _validate = _interopRequireDefault(requireValidate());
    var _stringify = _interopRequireDefault(requireStringify());
    var _parse = _interopRequireDefault(requireParse());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
  })(commonjsBrowser);
  return commonjsBrowser;
}
var hasRequiredPostmsgRpc;
function requirePostmsgRpc() {
  if (hasRequiredPostmsgRpc) return postmsgRpc;
  hasRequiredPostmsgRpc = 1;
  Object.defineProperty(postmsgRpc, "__esModule", { value: true });
  postmsgRpc.request = postmsgRpc.RPC_BASE = void 0;
  const tslib_1 = require$$0;
  const uuid = requireCommonjsBrowser();
  postmsgRpc.RPC_BASE = { jsonrpc: "2.0" };
  class ProviderRpcError extends Error {
    constructor(message, code, data) {
      super(message);
      this.code = code;
      this.data = data;
    }
  }
  function request(iframe, { method, params }, options = {}) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      const requestId = uuid.v4();
      const req = {
        jsonrpc: "2.0",
        id: requestId,
        method,
        params,
        options
      };
      console.debug("postmsg-rpc request", Object.assign({}, req));
      return new Promise((resolve, reject) => {
        const timeout = options.timeout && setTimeout(() => {
          window.removeEventListener("message", handleEvent);
          reject(new ProviderRpcError("Request timed out", 408));
        }, options.timeout);
        const handleEvent = (event) => {
          if (event.data && event.data.id === requestId) {
            console.debug(`resolve id: ${requestId}`, { event });
            resolve(event.data);
            window.removeEventListener("message", handleEvent);
            timeout && clearTimeout(timeout);
          }
        };
        window.addEventListener("message", handleEvent);
        iframe.contentWindow.postMessage(req, "*");
      });
    });
  }
  postmsgRpc.request = request;
  return postmsgRpc;
}
var hasRequiredAuthClient;
function requireAuthClient() {
  if (hasRequiredAuthClient) return authClient;
  hasRequiredAuthClient = 1;
  Object.defineProperty(authClient, "__esModule", { value: true });
  authClient.NfidAuthClient = authClient.ERROR_USER_INTERRUPT = authClient.DelegationType = void 0;
  const tslib_1 = require$$0;
  const agent_1 = requireCjs$2();
  const auth_client_1 = require$$2;
  const identity_1 = requireCjs();
  const storage_1 = requireStorage();
  const get_iframe_1 = requireGetIframe();
  const postmsg_rpc_1 = requirePostmsgRpc();
  const principal_1 = requireCjs$3();
  var DelegationType;
  (function(DelegationType2) {
    DelegationType2[DelegationType2["GLOBAL"] = 0] = "GLOBAL";
    DelegationType2[DelegationType2["ANONYMOUS"] = 1] = "ANONYMOUS";
  })(DelegationType || (authClient.DelegationType = DelegationType = {}));
  const ECDSA_KEY_LABEL2 = "ECDSA";
  const ED25519_KEY_LABEL2 = "Ed25519";
  authClient.ERROR_USER_INTERRUPT = "UserInterrupt";
  class NfidAuthClient {
    /**
     * Creates a new instance of the NfidAuthClient class.
     * @param options An object containing optional parameters for the authentication client.
     * @param options.identity An optional identity to use for authentication.
     * @param options.storage An optional storage mechanism to use for storing authentication data.
     * @param options.keyType An optional key type to use for authentication.
     * @param options.idleOptions An optional object containing options for idle management.
     * @returns A Promise that resolves to a new instance of the NfidAuthClient class.
     */
    static create(options = {}) {
      var _a, _b, _c;
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.debug("NfidAuthClient.create", { keyType: options.keyType });
        const storage2 = (_a = options.storage) !== null && _a !== void 0 ? _a : new storage_1.IdbStorage();
        const keyType = (_b = options.keyType) !== null && _b !== void 0 ? _b : ECDSA_KEY_LABEL2;
        let key = null;
        if (options.identity) {
          key = options.identity;
        } else {
          let maybeIdentityStorage = yield storage2.get(storage_1.KEY_STORAGE_KEY);
          if (!maybeIdentityStorage && storage_1.isBrowser) {
            try {
              const fallbackLocalStorage = new storage_1.LocalStorage();
              const localChain = yield fallbackLocalStorage.get(storage_1.KEY_STORAGE_DELEGATION);
              const localKey = yield fallbackLocalStorage.get(storage_1.KEY_STORAGE_KEY);
              if (localChain && localKey && keyType === ECDSA_KEY_LABEL2) {
                console.log("Discovered an identity stored in localstorage. Migrating to IndexedDB");
                yield storage2.set(storage_1.KEY_STORAGE_DELEGATION, localChain);
                yield storage2.set(storage_1.KEY_STORAGE_KEY, localKey);
                maybeIdentityStorage = localChain;
                yield fallbackLocalStorage.remove(storage_1.KEY_STORAGE_DELEGATION);
                yield fallbackLocalStorage.remove(storage_1.KEY_STORAGE_KEY);
              }
            } catch (error) {
              console.error("error while attempting to recover localstorage: " + error);
            }
          }
          if (maybeIdentityStorage) {
            try {
              if (typeof maybeIdentityStorage === "object") {
                if (keyType === ED25519_KEY_LABEL2 && typeof maybeIdentityStorage === "string") {
                  key = yield identity_1.Ed25519KeyIdentity.fromJSON(maybeIdentityStorage);
                } else {
                  key = yield identity_1.ECDSAKeyIdentity.fromKeyPair(maybeIdentityStorage);
                }
              } else if (typeof maybeIdentityStorage === "string") {
                key = identity_1.Ed25519KeyIdentity.fromJSON(maybeIdentityStorage);
              }
            } catch (e) {
            }
          }
        }
        let identity = new agent_1.AnonymousIdentity();
        let chain = null;
        if (key) {
          try {
            const chainStorage = yield storage2.get(storage_1.KEY_STORAGE_DELEGATION);
            if (typeof chainStorage === "object" && chainStorage !== null) {
              throw new Error("Delegation chain is incorrectly stored. A delegation chain should be stored as a string.");
            }
            if (options.identity) {
              identity = options.identity;
            } else if (chainStorage) {
              chain = identity_1.DelegationChain.fromJSON(chainStorage);
              if (!(0, identity_1.isDelegationValid)(chain)) {
                yield _deleteStorage2(storage2);
                key = null;
              } else {
                identity = identity_1.DelegationIdentity.fromDelegation(key, chain);
              }
            }
          } catch (e) {
            console.error(e);
            yield _deleteStorage2(storage2);
            key = null;
          }
        }
        let idleManager = void 0;
        if ((_c = options.idleOptions) === null || _c === void 0 ? void 0 : _c.disableIdle) {
          idleManager = void 0;
        } else if (chain || options.identity) {
          idleManager = auth_client_1.IdleManager.create(options.idleOptions);
        }
        if (!key) {
          key = yield getKey(storage2, keyType, options.storage);
        }
        return new this(identity, key, chain, storage2, idleManager, options);
      });
    }
    /**
     * Creates an instance of AuthClient.
     * @param _identity - The Identity object.
     * @param _key - The SignIdentity object or null.
     * @param _chain - The DelegationChain object or null.
     * @param _storage - The AuthClientStorage object.
     * @param idleManager - The IdleManager object or undefined.
     * @param _createOptions - The AuthClientCreateOptions object or undefined.
     */
    constructor(_identity, _key, _chain, _storage, idleManager, _createOptions) {
      var _a;
      this._identity = _identity;
      this._key = _key;
      this._chain = _chain;
      this._storage = _storage;
      this.idleManager = idleManager;
      this._createOptions = _createOptions;
      const logout = this.logout.bind(this);
      const idleOptions = _createOptions === null || _createOptions === void 0 ? void 0 : _createOptions.idleOptions;
      if (!(idleOptions === null || idleOptions === void 0 ? void 0 : idleOptions.onIdle) && !(idleOptions === null || idleOptions === void 0 ? void 0 : idleOptions.disableDefaultIdleCallback)) {
        (_a = this.idleManager) === null || _a === void 0 ? void 0 : _a.registerCallback(() => {
          logout();
          location.reload();
        });
      }
    }
    /**
     * Retrieves the authentication key for the client from .
     * @returns A promise that resolves with an ECDSAKeyIdentity or Ed25519KeyIdentity object.
     */
    getKey() {
      var _a, _b;
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return getKey(this._storage, (_a = this._createOptions) === null || _a === void 0 ? void 0 : _a.keyType, (_b = this._createOptions) === null || _b === void 0 ? void 0 : _b.storage);
      });
    }
    /**
     * Returns the delegation type based on the current chain's delegations.
     * If the chain has at least one target, it is considered a global delegation.
     * Otherwise, it is considered an anonymous delegation.
     * @returns {DelegationType} The delegation type.
     */
    getDelegationType() {
      var _a, _b;
      return ((_b = (_a = this._chain) === null || _a === void 0 ? void 0 : _a.delegations[0].delegation.targets) === null || _b === void 0 ? void 0 : _b.length) ? DelegationType.GLOBAL : DelegationType.ANONYMOUS;
    }
    /**
     * Renews the delegation for the specified targets.
     * @param options - An optional object containing the following properties:
     * @param optionsmaxTimeToLive: The maximum time to live for the delegation, in nanoseconds. Defaults to 8 hours.
     * @param optionstargets: An array of strings representing the targets for which to renew the delegation.
     * @param optionsderivationOrigin: The derivation origin to use for the delegation.
     * @returns A Promise that resolves with the result of the renewed delegation.
     */
    renewDelegation(options) {
      var _a, _b;
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.debug("NfidAuthClient.renewDelegation");
        const defaultTimeToLive = BigInt(8) * BigInt(36e11);
        const iframe = (0, get_iframe_1.getIframe)();
        const response = yield (0, postmsg_rpc_1.request)(iframe, {
          method: "ic_renewDelegation",
          params: [
            {
              sessionPublicKey: new Uint8Array((_a = this._key) === null || _a === void 0 ? void 0 : _a.getPublicKey().toDer()),
              maxTimeToLive: (_b = options === null || options === void 0 ? void 0 : options.maxTimeToLive) !== null && _b !== void 0 ? _b : defaultTimeToLive,
              targets: options === null || options === void 0 ? void 0 : options.targets,
              derivationOrigin: options === null || options === void 0 ? void 0 : options.derivationOrigin
            }
          ]
        });
        if ("error" in response)
          throw new Error(response.error.message);
        return this._handleSuccess(response.result);
      });
    }
    /**
     * Logs in the user and returns an `Identity` object.
     * @param options An optional object containing login options.
     * @param options.maxTimeToLive The maximum time to live for the delegated identity.
     * @param options.targets An array of targets for the delegated identity.
     * @param options.derivationOrigin The origin for the identity provider to use while generating the delegated identity.
     * @see https://github.com/dfinity/internet-identity/blob/main/docs/internet-identity-spec.adoc
     * @returns A Promise that resolves to an `Identity` object.
     */
    login(options) {
      var _a;
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!this._key) {
          this._key = yield this.getKey();
        }
        const defaultTimeToLive = BigInt(8) * BigInt(36e11);
        const targets = options === null || options === void 0 ? void 0 : options.targets;
        const derivationOrigin = options === null || options === void 0 ? void 0 : options.derivationOrigin;
        const iframe = (0, get_iframe_1.getIframe)();
        const response = yield (0, postmsg_rpc_1.request)(iframe, {
          method: "ic_getDelegation",
          params: [
            Object.assign(Object.assign({ sessionPublicKey: new Uint8Array(this._key.getPublicKey().toDer()), maxTimeToLive: (_a = options === null || options === void 0 ? void 0 : options.maxTimeToLive) !== null && _a !== void 0 ? _a : defaultTimeToLive }, targets ? { targets } : {}), derivationOrigin ? { derivationOrigin } : {})
          ]
        });
        if ("error" in response) {
          throw new Error(response.error.message);
        }
        return this._handleSuccess(response.result);
      });
    }
    logout(options = {}) {
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield _deleteStorage2(this._storage);
        this._identity = new agent_1.AnonymousIdentity();
        this._key = null;
        this._chain = null;
        if (options.returnTo) {
          try {
            window.history.pushState({}, "", options.returnTo);
          } catch (e) {
            window.location.href = options.returnTo;
          }
        }
      });
    }
    getIdentity() {
      return this._identity;
    }
    get isAuthenticated() {
      return !this.getIdentity().getPrincipal().isAnonymous() && this._chain !== null;
    }
    _handleSuccess(result) {
      var _a, _b;
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const delegations = result.delegations.map((signedDelegation) => {
          var _a2;
          return {
            delegation: new identity_1.Delegation(signedDelegation.delegation.pubkey, signedDelegation.delegation.expiration, (_a2 = signedDelegation.delegation.targets) === null || _a2 === void 0 ? void 0 : _a2.map((principalId) => principal_1.Principal.fromText(principalId))),
            signature: signedDelegation.signature.buffer
          };
        });
        console.debug("NfidAuthClient._handleSuccess", {
          delegations
        });
        const delegationChain = identity_1.DelegationChain.fromDelegations(delegations, result.userPublicKey.buffer);
        const key = this._key;
        if (!key) {
          throw new Error("missing key");
        }
        this._chain = delegationChain;
        const delegationIdentity = identity_1.DelegationIdentity.fromDelegation(key, this._chain);
        this._identity = delegationIdentity;
        if (!this.idleManager) {
          const idleOptions = (_a = this._createOptions) === null || _a === void 0 ? void 0 : _a.idleOptions;
          this.idleManager = auth_client_1.IdleManager.create(idleOptions);
          if (!(idleOptions === null || idleOptions === void 0 ? void 0 : idleOptions.onIdle) && !(idleOptions === null || idleOptions === void 0 ? void 0 : idleOptions.disableDefaultIdleCallback)) {
            (_b = this.idleManager) === null || _b === void 0 ? void 0 : _b.registerCallback(() => {
              this.logout();
              location.reload();
            });
          }
        }
        if (this._chain) {
          yield this._storage.set(storage_1.KEY_STORAGE_DELEGATION, JSON.stringify(this._chain.toJSON()));
        }
        return delegationIdentity;
      });
    }
  }
  authClient.NfidAuthClient = NfidAuthClient;
  function _deleteStorage2(storage2) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      yield storage2.remove(storage_1.KEY_STORAGE_KEY);
      yield storage2.remove(storage_1.KEY_STORAGE_DELEGATION);
      yield storage2.remove(storage_1.KEY_VECTOR);
    });
  }
  function getKey(storage2, keyType, optionsStorage) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      console.debug("getKey", { keyType });
      let key;
      if (keyType === ED25519_KEY_LABEL2) {
        key = yield identity_1.Ed25519KeyIdentity.generate(null);
        yield storage2.set(storage_1.KEY_STORAGE_KEY, JSON.stringify(key.toJSON()));
      } else {
        if (optionsStorage && keyType === ECDSA_KEY_LABEL2) {
          console.warn(`You are using a custom storage provider that may not support CryptoKey storage. If you are using a custom storage provider that does not support CryptoKey storage, you should use '${ED25519_KEY_LABEL2}' as the key type, as it can serialize to a string`);
        }
        key = yield identity_1.ECDSAKeyIdentity.generate();
        yield storage2.set(storage_1.KEY_STORAGE_KEY, key.getKeyPair());
      }
      return key;
    });
  }
  return authClient;
}
var hasRequiredAuthentication;
function requireAuthentication() {
  if (hasRequiredAuthentication) return authentication;
  hasRequiredAuthentication = 1;
  (function(exports$1) {
    Object.defineProperty(exports$1, "__esModule", { value: true });
    const tslib_1 = require$$0;
    tslib_1.__exportStar(requireAuthClient(), exports$1);
  })(authentication);
  return authentication;
}
var hasRequiredNfid;
function requireNfid() {
  if (hasRequiredNfid) return nfid;
  hasRequiredNfid = 1;
  Object.defineProperty(nfid, "__esModule", { value: true });
  nfid.NFID = void 0;
  const tslib_1 = require$$0;
  const make_iframe_1 = requireMakeIframe();
  const mount_iframe_1 = requireMountIframe();
  const authentication_1 = requireAuthentication();
  const get_iframe_1 = requireGetIframe();
  const postmsg_rpc_1 = requirePostmsgRpc();
  class NFID {
    constructor(_nfidConfig) {
      this._nfidConfig = _nfidConfig;
      console.debug("NFID.constructor", { _nfidConfig });
    }
    static initIframe(nfidConfig) {
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.debug("NFID.initIframe", { nfidConfig });
        return new Promise((resolve) => {
          var _a, _b;
          const nfidIframe = (0, make_iframe_1.buildIframe)({
            origin: nfidConfig.origin,
            applicationName: (_a = nfidConfig.application) === null || _a === void 0 ? void 0 : _a.name,
            applicationLogo: (_b = nfidConfig.application) === null || _b === void 0 ? void 0 : _b.logo,
            onLoad: () => {
              NFID.isIframeInstantiated = true;
              NFID.nfidIframe = nfidIframe;
              console.debug("NFID.initIframe: iframe loaded", { nfidIframe });
              resolve(true);
            }
          });
        });
      });
    }
    static init(params) {
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { origin = "https://nfid.one" } = params, nfidConfig = tslib_1.__rest(params, ["origin"]);
        return yield new Promise((resolve, reject) => {
          const removeEventListener = () => {
            window.removeEventListener("message", handleReadyEvent);
          };
          const timeout = setTimeout(() => {
            removeEventListener();
            reject(new Error("NFID.init iframe did not respond in time"));
          }, 3e4);
          const handleReadyEvent = (event) => {
            if (event.data.type === "nfid_ready") {
              removeEventListener();
              console.debug("NFID.init authClient initiated");
              clearTimeout(timeout);
              resolve(new this(Object.assign({ origin }, nfidConfig)));
            }
          };
          window.addEventListener("message", handleReadyEvent);
          console.debug("NFID.init", Object.assign({ origin }, nfidConfig));
          NFID.initIframe(Object.assign({ origin }, nfidConfig));
          console.debug("NFID.init iframe initiated");
          authentication_1.NfidAuthClient.create({
            identity: nfidConfig.identity,
            storage: nfidConfig.storage,
            keyType: nfidConfig.keyType,
            idleOptions: nfidConfig.idleOptions
          }).then((client) => {
            NFID._authClient = client;
          });
        });
      });
    }
    /**
     * Retrieves a delegation from the NFID iframe.
     * @param options An optional object containing the following properties:
     * @param options.targets An array of target strings.
     * @param options.targets:
     * @param options.maxTimeToLive: The maximum time to live as a BigInt.
     * @param options.derivationOrigin: The derivation origin as a string or URL.
     * @returns A promise that resolves with an Identity object or rejects with an error object.
     * @throws An error if the NFID iframe is not instantiated.
     */
    getDelegation(options) {
      var _a, _b;
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.debug("NFID.connect");
        const derivationOrigin = (options === null || options === void 0 ? void 0 : options.derivationOrigin) || ((_b = (_a = this._nfidConfig) === null || _a === void 0 ? void 0 : _a.ic) === null || _b === void 0 ? void 0 : _b.derivationOrigin);
        if (!NFID.isIframeInstantiated)
          throw new Error("NFID iframe not instantiated");
        (0, mount_iframe_1.showIframe)();
        return new Promise((resolve, reject) => {
          NFID._authClient.login(Object.assign(Object.assign({}, options), { derivationOrigin })).then((identity) => resolve(identity)).catch((e) => reject({ error: e.message })).finally(mount_iframe_1.hideIframe);
        });
      });
    }
    /**
     * Updates the global delegation for the current user.
     * @param options - The options for the delegation update.
     * @param options.targets - The targets for the delegation update.
     * @param options.maxTimeToLive - The maximum time to live for the delegation update.
     * @returns A Promise that resolves with the delegation update response.
     * @throws Any error that occurs during the delegation update.
     */
    updateGlobalDelegation(options) {
      var _a, _b;
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const derivationOrigin = (options === null || options === void 0 ? void 0 : options.derivationOrigin) || ((_b = (_a = this._nfidConfig) === null || _a === void 0 ? void 0 : _a.ic) === null || _b === void 0 ? void 0 : _b.derivationOrigin);
        console.debug("NFID.renewDelegation");
        const delegationType = NFID._authClient.getDelegationType();
        if (delegationType === authentication_1.DelegationType.ANONYMOUS)
          throw new Error("You can not update delegation from anonymous user");
        const response = yield NFID._authClient.renewDelegation(Object.assign(Object.assign({}, options), { derivationOrigin }));
        if ("error" in response)
          throw new Error(response.error.message);
        return response;
      });
    }
    getDelegationType() {
      return NFID._authClient.getDelegationType();
    }
    logout() {
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return NFID._authClient.logout();
      });
    }
    requestTransferFT(options) {
      var _a, _b;
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.debug("NFID.requestTransferFT");
        const derivationOrigin = (options === null || options === void 0 ? void 0 : options.derivationOrigin) || ((_b = (_a = this._nfidConfig) === null || _a === void 0 ? void 0 : _a.ic) === null || _b === void 0 ? void 0 : _b.derivationOrigin);
        const delegationType = NFID._authClient.getDelegationType();
        if (delegationType === authentication_1.DelegationType.ANONYMOUS)
          throw new Error("You can not call requestTransferFT from anonymous user");
        if (!NFID.nfidIframe)
          throw new Error("NFID iframe not instantiated");
        (0, mount_iframe_1.showIframe)();
        const iframe = (0, get_iframe_1.getIframe)();
        const response = yield (0, postmsg_rpc_1.request)(iframe, {
          method: "ic_requestTransfer",
          params: [
            {
              receiver: options.receiver,
              amount: options.amount,
              memo: options.memo,
              derivationOrigin
            }
          ]
        });
        (0, mount_iframe_1.hideIframe)();
        if ("error" in response) {
          throw Error(response.error.message);
        }
        return response.result;
      });
    }
    requestTransferNFT(options) {
      var _a, _b;
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.debug("NFID.requestTransferNFT");
        const derivationOrigin = (options === null || options === void 0 ? void 0 : options.derivationOrigin) || ((_b = (_a = this._nfidConfig) === null || _a === void 0 ? void 0 : _a.ic) === null || _b === void 0 ? void 0 : _b.derivationOrigin);
        const delegationType = NFID._authClient.getDelegationType();
        if (delegationType === authentication_1.DelegationType.ANONYMOUS)
          throw new Error("You can not call requestTransferNFT from anonymous user");
        if (!NFID.nfidIframe)
          throw new Error("NFID iframe not instantiated");
        (0, mount_iframe_1.showIframe)();
        const iframe = (0, get_iframe_1.getIframe)();
        const response = yield (0, postmsg_rpc_1.request)(iframe, {
          method: "ic_requestTransfer",
          params: [
            {
              receiver: options.receiver,
              tokenId: options.tokenId,
              derivationOrigin
            }
          ]
        });
        (0, mount_iframe_1.hideIframe)();
        if ("error" in response) {
          throw Error(response.error.message);
        }
        return response.result;
      });
    }
    /**
     * Sends a request to a 3rd party canister.
     * @param method - The method to call on the canister.
     * @param canisterId - The ID of the canister to call.
     * @param parameters - Optional parameters to pass to the canister method.
     * @param derivationOrigin - Optional derivation origin to use for the request.
     * @returns A Promise that resolves with the result of the canister call.
     */
    requestCanisterCall({ method, canisterId, parameters, derivationOrigin }) {
      var _a, _b;
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.debug("NFID.requestCanisterCall", {
          method,
          canisterId,
          parameters,
          derivationOrigin
        });
        const delegationType = NFID._authClient.getDelegationType();
        if (delegationType === authentication_1.DelegationType.ANONYMOUS)
          throw new Error("You can not call requestCanisterCall from anonymous user");
        if (!NFID.nfidIframe)
          throw new Error("NFID iframe not instantiated");
        (0, mount_iframe_1.showIframe)();
        const iframe = (0, get_iframe_1.getIframe)();
        const response = yield (0, postmsg_rpc_1.request)(iframe, {
          method: "ic_canisterCall",
          params: [
            {
              method,
              canisterId,
              parameters,
              derivationOrigin: derivationOrigin || ((_b = (_a = this._nfidConfig) === null || _a === void 0 ? void 0 : _a.ic) === null || _b === void 0 ? void 0 : _b.derivationOrigin)
            }
          ]
        });
        (0, mount_iframe_1.hideIframe)();
        if ("error" in response) {
          throw Error(response.error.message);
        }
        return response.result;
      });
    }
    get isAuthenticated() {
      return NFID._authClient.isAuthenticated;
    }
    getIdentity() {
      return NFID._authClient.getIdentity();
    }
  }
  nfid.NFID = NFID;
  NFID.isIframeInstantiated = false;
  return nfid;
}
(function(exports$1) {
  Object.defineProperty(exports$1, "__esModule", { value: true });
  const tslib_1 = require$$0;
  tslib_1.__exportStar(requireManager(), exports$1);
  tslib_1.__exportStar(requireNfid(), exports$1);
  tslib_1.__exportStar(requireAuthentication(), exports$1);
})(src);
const index = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null
}, [src]);
export {
  index as i
};
