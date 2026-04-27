var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
import { t as tslib_es6 } from "./tslib.es6-CQlO25gN.js";
import { az as JSON_KEY_PRINCIPAL, aA as Principal, aB as base32Decode, aC as base32Encode, aD as getCrc32, aE as Visitor, aF as IDL, aG as PipeArrayBuffer, aH as compare, aI as concat, aJ as idlLabelToId, aK as lebDecode, aL as lebEncode, aM as readIntLE, aN as readUIntLE, aO as safeRead, aP as safeReadUint8, aQ as slebDecode, aR as slebEncode, aS as uint8Equals, aT as uint8FromBufLike, aU as uint8ToDataView, aV as writeIntLE, aW as writeUIntLE, aX as HttpAgent, aY as request, aZ as Actor, a_ as ACTOR_METHOD_WITH_CERTIFICATE, a$ as ACTOR_METHOD_WITH_HTTP_DETAILS, b0 as AgentError, b1 as AnonymousIdentity, b2 as BLS12_381_G2_OID, b3 as index$1, b4 as Cbor, b5 as CborDecodeErrorCode, b6 as CborEncodeErrorCode, b7 as Certificate, b8 as CertificateHasTooManyDelegationsErrorCode, b9 as CertificateNotAuthorizedErrorCode, ba as CertificateOutdatedErrorCode, bb as CertificateTimeErrorCode, bc as CertificateVerificationErrorCode, bd as CertifiedRejectErrorCode, be as CreateHttpAgentErrorCode, bf as DEFAULT_POLLING_OPTIONS, bg as DER_COSE_OID, bh as DerDecodeErrorCode, bi as DerDecodeLengthMismatchErrorCode, bj as DerEncodeErrorCode, bk as DerKeyLengthMismatchErrorCode, bl as DerPrefixMismatchErrorCode, bm as ED25519_OID, bn as Ed25519PublicKey, bo as Endpoint, bp as ErrorKindEnum, bq as Expiry, br as ExpiryJsonDeserializeErrorCode, bs as ExternalError, bt as HashTreeDecodeErrorCode, bu as HashValueErrorCode, bv as HexDecodeErrorCode, bw as HttpDefaultFetchErrorCode, bx as HttpErrorCode, by as HttpFetchErrorCode, bz as HttpV3ApiNotSupportedErrorCode, bA as IC_REQUEST_AUTH_DELEGATION_DOMAIN_SEPARATOR, bB as IC_REQUEST_DOMAIN_SEPARATOR, bC as IC_RESPONSE_DOMAIN_SEPARATOR, bD as IC_ROOT_KEY, bE as IdentityInvalidErrorCode, bF as IngressExpiryInvalidErrorCode, bG as InputError, bH as InvalidReadStateRequestErrorCode, bI as JSON_KEY_EXPIRY, bJ as LimitError, bK as LookupErrorCode, bL as LookupLabelStatus, bM as LookupPathStatus, bN as LookupSubtreeStatus, bO as MANAGEMENT_CANISTER_ID, bP as MalformedLookupFoundValueErrorCode, bQ as MalformedPublicKeyErrorCode, bR as MalformedSignatureErrorCode, bS as MissingCanisterIdErrorCode, bT as MissingLookupValueErrorCode, bU as MissingRootKeyErrorCode, bV as MissingSignatureErrorCode, bW as NodeType, bX as Observable, bY as ObservableLog, bZ as ProtocolError, b_ as QueryResponseStatus, b$ as QuerySignatureVerificationFailedErrorCode, c0 as ReadRequestType, c1 as RejectError, c2 as ReplicaRejectCode, c3 as RequestStatusDoneNoReplyErrorCode, c4 as RequestStatusResponseStatus, c5 as SECP256K1_OID, c6 as SignIdentity, c7 as SubmitRequestType, c8 as TimeoutWaitingForResponseErrorCode, c9 as ToCborValue, ca as TransportError, cb as TrustError, cc as UNREACHABLE_ERROR, cd as UncertifiedRejectErrorCode, ce as UncertifiedRejectUpdateErrorCode, cf as UnexpectedErrorCode, cg as UnknownError, ch as blsVerify, ci as calculateIngressExpiry, cj as check_canister_ranges, ck as constructRequest, cl as createIdentityDescriptor, cm as decodeLen, cn as decodeLenBytes, co as defaultStrategy, cp as domain_sep, cq as encodeLen, cr as encodeLenBytes, cs as find_label, ct as flatten_forks, cu as hashOfMap, cv as hashTreeToString, cw as hashValue, cx as httpHeadersTransform, cy as isV2ResponseBody, cz as isV3ResponseBody, cA as lookupResultToBuffer, cB as lookup_path, cC as lookup_subtree, cD as makeExpiryTransform, cE as makeNonce, cF as makeNonceTransform, cG as pollForResponse, cH as index$2, cI as randomNumber, cJ as reconstruct, cK as requestIdOf, cL as strategy, cM as uint8Equals$1, cN as uint8FromBufLike$1, cO as uint8ToBuf, cP as unwrapDER, cQ as verify, cR as wrapDER, cS as getAugmentedNamespace, cT as esm$3, cU as ed25519$1, cV as utils, al as commonjsGlobal, cW as build, cX as sha2 } from "./index-wfeVo5SS.js";
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
const esm$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  JSON_KEY_PRINCIPAL,
  Principal,
  base32Decode,
  base32Encode,
  getCrc32
}, Symbol.toStringTag, { value: "Module" }));
class InputBox {
  constructor(idl, ui) {
    this.idl = idl;
    this.ui = ui;
    this.label = null;
    this.value = void 0;
    const status = document.createElement("span");
    status.className = "status";
    this.status = status;
    if (ui.input) {
      ui.input.addEventListener("blur", () => {
        if (ui.input.value === "") {
          return;
        }
        this.parse();
      });
      ui.input.addEventListener("input", () => {
        status.style.display = "none";
        ui.input.classList.remove("reject");
      });
    }
  }
  isRejected() {
    return this.value === void 0;
  }
  parse(config = {}) {
    if (this.ui.form) {
      const value = this.ui.form.parse(config);
      this.value = value;
      return value;
    }
    if (this.ui.input) {
      const input = this.ui.input;
      try {
        const value = this.ui.parse(this.idl, config, input.value);
        if (!this.idl.covariant(value)) {
          throw new Error(`${input.value} is not of type ${this.idl.display()}`);
        }
        this.status.style.display = "none";
        this.value = value;
        return value;
      } catch (err) {
        input.classList.add("reject");
        this.status.style.display = "block";
        this.status.innerHTML = "InputError: " + err.message;
        this.value = void 0;
        return void 0;
      }
    }
    return null;
  }
  render(dom) {
    const container = document.createElement("span");
    if (this.label) {
      const label = document.createElement("label");
      label.innerText = this.label;
      container.appendChild(label);
    }
    if (this.ui.input) {
      container.appendChild(this.ui.input);
      container.appendChild(this.status);
    }
    if (this.ui.form) {
      this.ui.form.render(container);
    }
    dom.appendChild(container);
  }
}
class InputForm {
  constructor(ui) {
    this.ui = ui;
    this.form = [];
  }
  renderForm(dom) {
    if (this.ui.container) {
      this.form.forEach((e) => e.render(this.ui.container));
      dom.appendChild(this.ui.container);
    } else {
      this.form.forEach((e) => e.render(dom));
    }
  }
  render(dom) {
    if (this.ui.open && this.ui.event) {
      dom.appendChild(this.ui.open);
      const form = this;
      form.ui.open.addEventListener(form.ui.event, () => {
        if (form.ui.container) {
          form.ui.container.innerHTML = "";
        } else {
          const oldContainer = form.ui.open.nextElementSibling;
          if (oldContainer) {
            oldContainer.parentNode.removeChild(oldContainer);
          }
        }
        form.generateForm();
        form.renderForm(dom);
      });
    } else {
      this.generateForm();
      this.renderForm(dom);
    }
  }
}
class RecordForm extends InputForm {
  constructor(fields, ui) {
    super(ui);
    this.fields = fields;
    this.ui = ui;
  }
  generateForm() {
    this.form = this.fields.map(([key, type]) => {
      const input = this.ui.render(type);
      if (this.ui.labelMap && this.ui.labelMap.hasOwnProperty(key)) {
        input.label = this.ui.labelMap[key] + " ";
      } else {
        input.label = key + " ";
      }
      return input;
    });
  }
  parse(config) {
    const v = {};
    this.fields.forEach(([key, _], i) => {
      const value = this.form[i].parse(config);
      v[key] = value;
    });
    if (this.form.some((input) => input.isRejected())) {
      return void 0;
    }
    return v;
  }
}
class TupleForm extends InputForm {
  constructor(components, ui) {
    super(ui);
    this.components = components;
    this.ui = ui;
  }
  generateForm() {
    this.form = this.components.map((type) => {
      const input = this.ui.render(type);
      return input;
    });
  }
  parse(config) {
    const v = [];
    this.components.forEach((_, i) => {
      const value = this.form[i].parse(config);
      v.push(value);
    });
    if (this.form.some((input) => input.isRejected())) {
      return void 0;
    }
    return v;
  }
}
class VariantForm extends InputForm {
  constructor(fields, ui) {
    super(ui);
    this.fields = fields;
    this.ui = ui;
  }
  generateForm() {
    const index2 = this.ui.open.selectedIndex;
    const [_, type] = this.fields[index2];
    const variant = this.ui.render(type);
    this.form = [variant];
  }
  parse(config) {
    const select = this.ui.open;
    const selected = select.options[select.selectedIndex].value;
    const value = this.form[0].parse(config);
    if (value === void 0) {
      return void 0;
    }
    const v = {};
    v[selected] = value;
    return v;
  }
}
class OptionForm extends InputForm {
  constructor(ty, ui) {
    super(ui);
    this.ty = ty;
    this.ui = ui;
  }
  generateForm() {
    if (this.ui.open.checked) {
      const opt = this.ui.render(this.ty);
      this.form = [opt];
    } else {
      this.form = [];
    }
  }
  parse(config) {
    if (this.form.length === 0) {
      return [];
    } else {
      const value = this.form[0].parse(config);
      if (value === void 0) {
        return void 0;
      }
      return [value];
    }
  }
}
class VecForm extends InputForm {
  constructor(ty, ui) {
    super(ui);
    this.ty = ty;
    this.ui = ui;
  }
  generateForm() {
    const len = +this.ui.open.value;
    this.form = [];
    for (let i = 0; i < len; i++) {
      const t = this.ui.render(this.ty);
      this.form.push(t);
    }
  }
  parse(config) {
    const value = this.form.map((input) => {
      return input.parse(config);
    });
    if (this.form.some((input) => input.isRejected())) {
      return void 0;
    }
    return value;
  }
}
const InputConfig = { parse: parsePrimitive };
const FormConfig = { render: renderInput };
const inputBox = (t, config) => {
  return new InputBox(t, { ...InputConfig, ...config });
};
const recordForm = (fields, config) => {
  return new RecordForm(fields, { ...FormConfig, ...config });
};
const tupleForm = (components, config) => {
  return new TupleForm(components, { ...FormConfig, ...config });
};
const variantForm = (fields, config) => {
  return new VariantForm(fields, { ...FormConfig, ...config });
};
const optForm = (ty, config) => {
  return new OptionForm(ty, { ...FormConfig, ...config });
};
const vecForm = (ty, config) => {
  return new VecForm(ty, { ...FormConfig, ...config });
};
class Render extends Visitor {
  visitType(t, _d) {
    const input = document.createElement("input");
    input.classList.add("argument");
    input.placeholder = t.display();
    return inputBox(t, { input });
  }
  visitNull(t, _d) {
    return inputBox(t, {});
  }
  visitRecord(t, fields, _d) {
    let config = {};
    if (fields.length > 1) {
      const container = document.createElement("div");
      container.classList.add("popup-form");
      config = { container };
    }
    const form = recordForm(fields, config);
    return inputBox(t, { form });
  }
  visitTuple(t, components, _d) {
    let config = {};
    if (components.length > 1) {
      const container = document.createElement("div");
      container.classList.add("popup-form");
      config = { container };
    }
    const form = tupleForm(components, config);
    return inputBox(t, { form });
  }
  visitVariant(t, fields, _d) {
    const select = document.createElement("select");
    for (const [key, _type] of fields) {
      const option = new Option(key);
      select.add(option);
    }
    select.selectedIndex = -1;
    select.classList.add("open");
    const config = { open: select, event: "change" };
    const form = variantForm(fields, config);
    return inputBox(t, { form });
  }
  visitOpt(t, ty, _d) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("open");
    const form = optForm(ty, { open: checkbox, event: "change" });
    return inputBox(t, { form });
  }
  visitVec(t, ty, _d) {
    const len = document.createElement("input");
    len.type = "number";
    len.min = "0";
    len.max = "100";
    len.style.width = "8rem";
    len.placeholder = "len";
    len.classList.add("open");
    const container = document.createElement("div");
    container.classList.add("popup-form");
    const form = vecForm(ty, { open: len, event: "change", container });
    return inputBox(t, { form });
  }
  visitRec(_t, ty, _d) {
    return renderInput(ty);
  }
}
class Parse extends Visitor {
  visitNull(_t, _v) {
    return null;
  }
  visitBool(_t, v) {
    if (v === "true") {
      return true;
    }
    if (v === "false") {
      return false;
    }
    throw new Error(`Cannot parse ${v} as boolean`);
  }
  visitText(_t, v) {
    return v;
  }
  visitFloat(_t, v) {
    return parseFloat(v);
  }
  visitFixedInt(t, v) {
    if (t._bits <= 32) {
      return parseInt(v, 10);
    } else {
      return BigInt(v);
    }
  }
  visitFixedNat(t, v) {
    if (t._bits <= 32) {
      return parseInt(v, 10);
    } else {
      return BigInt(v);
    }
  }
  visitNumber(_t, v) {
    return BigInt(v);
  }
  visitPrincipal(_t, v) {
    return Principal.fromText(v);
  }
  visitService(_t, v) {
    return Principal.fromText(v);
  }
  visitFunc(_t, v) {
    const x = v.split(".", 2);
    return [Principal.fromText(x[0]), x[1]];
  }
}
class Random extends Visitor {
  visitNull(_t, _v) {
    return null;
  }
  visitBool(_t, _v) {
    return Math.random() < 0.5;
  }
  visitText(_t, _v) {
    return Math.random().toString(36).substring(6);
  }
  visitFloat(_t, _v) {
    return Math.random();
  }
  visitInt(_t, _v) {
    return BigInt(this.generateNumber(true));
  }
  visitNat(_t, _v) {
    return BigInt(this.generateNumber(false));
  }
  visitFixedInt(t, v) {
    const x = this.generateNumber(true);
    if (t._bits <= 32) {
      return x;
    } else {
      return BigInt(v);
    }
  }
  visitFixedNat(t, v) {
    const x = this.generateNumber(false);
    if (t._bits <= 32) {
      return x;
    } else {
      return BigInt(v);
    }
  }
  generateNumber(signed) {
    const num = Math.floor(Math.random() * 100);
    if (signed && Math.random() < 0.5) {
      return -num;
    } else {
      return num;
    }
  }
}
function parsePrimitive(t, config, d) {
  if (config.random && d === "") {
    return t.accept(new Random(), d);
  } else {
    return t.accept(new Parse(), d);
  }
}
function renderInput(t) {
  return t.accept(new Render(), null);
}
function renderValue(t, input, value) {
  return t.accept(new RenderValue(), { input, value });
}
class RenderValue extends Visitor {
  visitType(t, d) {
    d.input.ui.input.value = t.valueToString(d.value);
  }
  visitNull(_t, _d) {
  }
  visitText(_t, d) {
    d.input.ui.input.value = d.value;
  }
  visitRec(_t, ty, d) {
    renderValue(ty, d.input, d.value);
  }
  visitOpt(_t, ty, d) {
    if (d.value.length === 0) {
      return;
    } else {
      const form = d.input.ui.form;
      const open = form.ui.open;
      open.checked = true;
      open.dispatchEvent(new Event(form.ui.event));
      renderValue(ty, form.form[0], d.value[0]);
    }
  }
  visitRecord(_t, fields, d) {
    const form = d.input.ui.form;
    fields.forEach(([key, type], i) => {
      renderValue(type, form.form[i], d.value[key]);
    });
  }
  visitTuple(_t, components, d) {
    const form = d.input.ui.form;
    components.forEach((type, i) => {
      renderValue(type, form.form[i], d.value[i]);
    });
  }
  visitVariant(_t, fields, d) {
    const form = d.input.ui.form;
    const selected = Object.entries(d.value)[0];
    fields.forEach(([key, type], i) => {
      if (key === selected[0]) {
        const open = form.ui.open;
        open.selectedIndex = i;
        open.dispatchEvent(new Event(form.ui.event));
        renderValue(type, form.form[0], selected[1]);
      }
    });
  }
  visitVec(_t, ty, d) {
    const form = d.input.ui.form;
    const len = d.value.length;
    const open = form.ui.open;
    open.value = len;
    open.dispatchEvent(new Event(form.ui.event));
    d.value.forEach((v, i) => {
      renderValue(ty, form.form[i], v);
    });
  }
}
const esm$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  IDL,
  InputBox,
  InputForm,
  OptionForm,
  PipeArrayBuffer,
  RecordForm,
  Render,
  TupleForm,
  VariantForm,
  VecForm,
  compare,
  concat,
  idlLabelToId,
  inputBox,
  lebDecode,
  lebEncode,
  optForm,
  readIntLE,
  readUIntLE,
  recordForm,
  renderInput,
  renderValue,
  safeRead,
  safeReadUint8,
  slebDecode,
  slebEncode,
  tupleForm,
  uint8Equals,
  uint8FromBufLike,
  uint8ToDataView,
  variantForm,
  vecForm,
  writeIntLE,
  writeUIntLE
}, Symbol.toStringTag, { value: "Module" }));
async function fetchCandid(canisterId, agent) {
  if (!agent) {
    agent = await HttpAgent.create();
  }
  const status = await request({
    agent,
    canisterId: Principal.fromText(canisterId),
    paths: ["candid"]
  });
  const candid = status.get("candid");
  if (candid) {
    return candid;
  }
  const tmpHackInterface = ({ IDL: IDL2 }) => IDL2.Service({
    __get_candid_interface_tmp_hack: IDL2.Func([], [IDL2.Text], ["query"])
  });
  const actor = Actor.createActor(tmpHackInterface, { agent, canisterId });
  return await actor.__get_candid_interface_tmp_hack();
}
const esm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ACTOR_METHOD_WITH_CERTIFICATE,
  ACTOR_METHOD_WITH_HTTP_DETAILS,
  Actor,
  AgentError,
  AnonymousIdentity,
  BLS12_381_G2_OID,
  CanisterStatus: index$1,
  Cbor,
  CborDecodeErrorCode,
  CborEncodeErrorCode,
  Certificate,
  CertificateHasTooManyDelegationsErrorCode,
  CertificateNotAuthorizedErrorCode,
  CertificateOutdatedErrorCode,
  CertificateTimeErrorCode,
  CertificateVerificationErrorCode,
  CertifiedRejectErrorCode,
  CreateHttpAgentErrorCode,
  DEFAULT_POLLING_OPTIONS,
  DER_COSE_OID,
  DerDecodeErrorCode,
  DerDecodeLengthMismatchErrorCode,
  DerEncodeErrorCode,
  DerKeyLengthMismatchErrorCode,
  DerPrefixMismatchErrorCode,
  ED25519_OID,
  Ed25519PublicKey,
  get Endpoint() {
    return Endpoint;
  },
  get ErrorKindEnum() {
    return ErrorKindEnum;
  },
  Expiry,
  ExpiryJsonDeserializeErrorCode,
  ExternalError,
  HashTreeDecodeErrorCode,
  HashValueErrorCode,
  HexDecodeErrorCode,
  HttpAgent,
  HttpDefaultFetchErrorCode,
  HttpErrorCode,
  HttpFetchErrorCode,
  HttpV3ApiNotSupportedErrorCode,
  IC_REQUEST_AUTH_DELEGATION_DOMAIN_SEPARATOR,
  IC_REQUEST_DOMAIN_SEPARATOR,
  IC_RESPONSE_DOMAIN_SEPARATOR,
  IC_ROOT_KEY,
  IdentityInvalidErrorCode,
  IngressExpiryInvalidErrorCode,
  InputError,
  InvalidReadStateRequestErrorCode,
  JSON_KEY_EXPIRY,
  LimitError,
  LookupErrorCode,
  get LookupLabelStatus() {
    return LookupLabelStatus;
  },
  get LookupPathStatus() {
    return LookupPathStatus;
  },
  get LookupSubtreeStatus() {
    return LookupSubtreeStatus;
  },
  MANAGEMENT_CANISTER_ID,
  MalformedLookupFoundValueErrorCode,
  MalformedPublicKeyErrorCode,
  MalformedSignatureErrorCode,
  MissingCanisterIdErrorCode,
  MissingLookupValueErrorCode,
  MissingRootKeyErrorCode,
  MissingSignatureErrorCode,
  get NodeType() {
    return NodeType;
  },
  Observable,
  ObservableLog,
  ProtocolError,
  get QueryResponseStatus() {
    return QueryResponseStatus;
  },
  QuerySignatureVerificationFailedErrorCode,
  get ReadRequestType() {
    return ReadRequestType;
  },
  RejectError,
  get ReplicaRejectCode() {
    return ReplicaRejectCode;
  },
  RequestStatusDoneNoReplyErrorCode,
  get RequestStatusResponseStatus() {
    return RequestStatusResponseStatus;
  },
  SECP256K1_OID,
  SignIdentity,
  get SubmitRequestType() {
    return SubmitRequestType;
  },
  TimeoutWaitingForResponseErrorCode,
  ToCborValue,
  TransportError,
  TrustError,
  UNREACHABLE_ERROR,
  UncertifiedRejectErrorCode,
  UncertifiedRejectUpdateErrorCode,
  UnexpectedErrorCode,
  UnknownError,
  blsVerify,
  calculateIngressExpiry,
  check_canister_ranges,
  constructRequest,
  createIdentityDescriptor,
  decodeLen,
  decodeLenBytes,
  defaultStrategy,
  domain_sep,
  encodeLen,
  encodeLenBytes,
  fetchCandid,
  find_label,
  flatten_forks,
  hashOfMap,
  hashTreeToString,
  hashValue,
  httpHeadersTransform,
  isV2ResponseBody,
  isV3ResponseBody,
  lookupResultToBuffer,
  lookup_path,
  lookup_subtree,
  makeExpiryTransform,
  makeNonce,
  makeNonceTransform,
  pollForResponse,
  polling: index$2,
  randomNumber,
  reconstruct,
  requestIdOf,
  strategy,
  uint8Equals: uint8Equals$1,
  uint8FromBufLike: uint8FromBufLike$1,
  uint8ToBuf,
  unwrapDER,
  verify,
  wrapDER
}, Symbol.toStringTag, { value: "Module" }));
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
const require$$1$2 = /* @__PURE__ */ getAugmentedNamespace(esm);
const require$$2$3 = /* @__PURE__ */ getAugmentedNamespace(esm$3);
var cjs$1 = {};
var ed25519 = {};
const require$$2$2 = /* @__PURE__ */ getAugmentedNamespace(esm$1);
const require$$2$1 = /* @__PURE__ */ getAugmentedNamespace(ed25519$1);
const require$$3 = /* @__PURE__ */ getAugmentedNamespace(utils);
var hasRequiredEd25519;
function requireEd25519() {
  var _rawKey, _derKey, _publicKey, _privateKey;
  if (hasRequiredEd25519) return ed25519;
  hasRequiredEd25519 = 1;
  Object.defineProperty(ed25519, "__esModule", { value: true });
  ed25519.Ed25519KeyIdentity = ed25519.Ed25519PublicKey = void 0;
  const agent_1 = require$$1$2;
  const candid_1 = require$$2$2;
  const ed25519_1 = require$$2$1;
  const utils_1 = require$$3;
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
        const key = (0, utils_1.hexToBytes)(maybeKey);
        return this.fromRaw(key);
      } else if (isObject(maybeKey)) {
        const key = maybeKey;
        if (isObject(key) && Object.hasOwnProperty.call(key, "__derEncodedPublicKey__")) {
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
      return new _Ed25519PublicKey(rawKey);
    }
    static fromDer(derKey) {
      return new _Ed25519PublicKey(this.derDecode(derKey));
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
  let Ed25519PublicKey2 = _Ed25519PublicKey;
  ed25519.Ed25519PublicKey = Ed25519PublicKey2;
  const _Ed25519KeyIdentity = class _Ed25519KeyIdentity extends agent_1.SignIdentity {
    // `fromRaw` and `fromDer` should be used for instantiation, not this constructor.
    constructor(publicKey, privateKey) {
      super();
      __privateAdd(this, _publicKey);
      __privateAdd(this, _privateKey);
      __privateSet(this, _publicKey, Ed25519PublicKey2.from(publicKey));
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
        seed = ed25519_1.ed25519.utils.randomPrivateKey();
      if ((0, candid_1.uint8Equals)(seed, new Uint8Array(new Array(32).fill(0)))) {
        console.warn("Seed is all zeros. This is not a secure seed. Please provide a seed with sufficient entropy if this is a production environment.");
      }
      const sk = new Uint8Array(32);
      for (let i = 0; i < 32; i++) {
        sk[i] = seed[i];
      }
      const pk = ed25519_1.ed25519.getPublicKey(sk);
      return _Ed25519KeyIdentity.fromKeyPair(pk, sk);
    }
    static fromParsedJson(obj) {
      const [publicKeyDer, privateKeyRaw] = obj;
      return new _Ed25519KeyIdentity(Ed25519PublicKey2.fromDer((0, utils_1.hexToBytes)(publicKeyDer)), (0, utils_1.hexToBytes)(privateKeyRaw));
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
      return new _Ed25519KeyIdentity(Ed25519PublicKey2.fromRaw(publicKey), privateKey);
    }
    static fromSecretKey(secretKey) {
      const publicKey = ed25519_1.ed25519.getPublicKey(secretKey);
      return _Ed25519KeyIdentity.fromKeyPair(publicKey, secretKey);
    }
    /**
     * Serialize this key to JSON.
     */
    toJSON() {
      return [(0, utils_1.bytesToHex)(__privateGet(this, _publicKey).toDer()), (0, utils_1.bytesToHex)(__privateGet(this, _privateKey))];
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
      const signature = ed25519_1.ed25519.sign(challenge, __privateGet(this, _privateKey).slice(0, 32));
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
  _publicKey = new WeakMap();
  _privateKey = new WeakMap();
  let Ed25519KeyIdentity = _Ed25519KeyIdentity;
  ed25519.Ed25519KeyIdentity = Ed25519KeyIdentity;
  return ed25519;
}
var ecdsa = {};
var hasRequiredEcdsa;
function requireEcdsa() {
  if (hasRequiredEcdsa) return ecdsa;
  hasRequiredEcdsa = 1;
  Object.defineProperty(ecdsa, "__esModule", { value: true });
  ecdsa.ECDSAKeyIdentity = ecdsa.CryptoError = void 0;
  const agent_1 = require$$1$2;
  const candid_1 = require$$2$2;
  class CryptoError extends Error {
    constructor(message) {
      super(message);
      this.message = message;
      Object.setPrototypeOf(this, CryptoError.prototype);
    }
  }
  ecdsa.CryptoError = CryptoError;
  function _getEffectiveCrypto(subtleCrypto) {
    if (typeof commonjsGlobal !== "undefined" && commonjsGlobal["crypto"] && commonjsGlobal["crypto"]["subtle"]) {
      return commonjsGlobal["crypto"]["subtle"];
    }
    if (subtleCrypto) {
      return subtleCrypto;
    } else if (typeof crypto !== "undefined" && crypto["subtle"]) {
      return crypto.subtle;
    } else {
      throw new CryptoError("Global crypto was not available and none was provided. Please inlcude a SubtleCrypto implementation. See https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto");
    }
  }
  class ECDSAKeyIdentity extends agent_1.SignIdentity {
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
      const effectiveCrypto = _getEffectiveCrypto(subtleCrypto);
      const derKey = (0, candid_1.uint8FromBufLike)(await effectiveCrypto.exportKey("spki", keyPair.publicKey));
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
      const signature = (0, candid_1.uint8FromBufLike)(await this._subtleCrypto.sign(params, this._keyPair.privateKey, challenge));
      Object.assign(signature, {
        __signature__: void 0
      });
      return signature;
    }
  }
  ecdsa.ECDSAKeyIdentity = ECDSAKeyIdentity;
  ecdsa.default = ECDSAKeyIdentity;
  return ecdsa;
}
var delegation = {};
const require$$1$1 = /* @__PURE__ */ getAugmentedNamespace(esm$2);
var partial = {};
var hasRequiredPartial;
function requirePartial() {
  var _inner;
  if (hasRequiredPartial) return partial;
  hasRequiredPartial = 1;
  Object.defineProperty(partial, "__esModule", { value: true });
  partial.PartialIdentity = void 0;
  const principal_1 = require$$1$1;
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
      return principal_1.Principal.fromUint8Array(new Uint8Array(__privateGet(this, _inner).rawKey));
    }
    /**
     * Required for the Identity interface, but cannot implemented for just a public key.
     */
    transformRequest() {
      return Promise.reject("Not implemented. You are attempting to use a partial identity to sign calls, but this identity only has access to the public key.To sign calls, use a DelegationIdentity instead.");
    }
  }
  _inner = new WeakMap();
  partial.PartialIdentity = PartialIdentity;
  return partial;
}
var hasRequiredDelegation;
function requireDelegation() {
  var _delegation;
  if (hasRequiredDelegation) return delegation;
  hasRequiredDelegation = 1;
  Object.defineProperty(delegation, "__esModule", { value: true });
  delegation.PartialDelegationIdentity = delegation.DelegationIdentity = delegation.DelegationChain = delegation.Delegation = void 0;
  delegation.isDelegationValid = isDelegationValid;
  const agent_1 = require$$1$2;
  const principal_1 = require$$1$1;
  const partial_ts_1 = requirePartial();
  const utils_1 = require$$3;
  function safeBytesToHex(data) {
    if (data instanceof Uint8Array) {
      return (0, utils_1.bytesToHex)(data);
    }
    return (0, utils_1.bytesToHex)(new Uint8Array(data));
  }
  function _parseBlob(value) {
    if (typeof value !== "string" || value.length < 64) {
      throw new Error("Invalid public key.");
    }
    return (0, utils_1.hexToBytes)(value);
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
  delegation.Delegation = Delegation;
  async function _createSingleDelegation(from, to, expiration, targets) {
    const delegation2 = new Delegation(
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
              return principal_1.Principal.fromHex(t);
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
  delegation.DelegationChain = DelegationChain;
  class DelegationIdentity extends agent_1.SignIdentity {
    /**
     * Create a delegation without having access to delegateKey.
     * @param key The key used to sign the requests.
     * @param delegation A delegation object created using `createDelegation`.
     */
    static fromDelegation(key, delegation2) {
      return new this(key, delegation2);
    }
    constructor(_inner, _delegation2) {
      super();
      this._inner = _inner;
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
    async transformRequest(request2) {
      const { body, ...fields } = request2;
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
  delegation.DelegationIdentity = DelegationIdentity;
  const _PartialDelegationIdentity = class _PartialDelegationIdentity extends partial_ts_1.PartialIdentity {
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
  delegation.PartialDelegationIdentity = PartialDelegationIdentity;
  function isDelegationValid(chain, checks) {
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
  const agent_1 = require$$1$2;
  const utils_1 = require$$3;
  const candid_1 = require$$2$2;
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
var hasRequiredCjs$1;
function requireCjs$1() {
  if (hasRequiredCjs$1) return cjs$1;
  hasRequiredCjs$1 = 1;
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
    var agent_1 = require$$1$2;
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
  })(cjs$1);
  return cjs$1;
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
  const AUTH_DB_NAME = "nfid-auth-client-db";
  const OBJECT_STORE_NAME = "ic-keyval";
  const _openDbStore = (dbName = AUTH_DB_NAME, storeName = OBJECT_STORE_NAME, version2) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
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
  function _getValue(db2, storeName, key) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      return yield db2.get(storeName, key);
    });
  }
  function _setValue(db2, storeName, key, value) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      return yield db2.put(storeName, value, key);
    });
  }
  function _removeValue(db2, storeName, key) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      return yield db2.delete(storeName, key);
    });
  }
  class IdbKeyVal {
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
        const { dbName = AUTH_DB_NAME, storeName = OBJECT_STORE_NAME, version: version2 = 1 } = options !== null && options !== void 0 ? options : {};
        const db2 = yield _openDbStore(dbName, storeName, version2);
        return new IdbKeyVal(db2, storeName);
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
        return yield _setValue(this._db, this._storeName, key, value);
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
        return (_a = yield _getValue(this._db, this._storeName, key)) !== null && _a !== void 0 ? _a : null;
      });
    }
    /**
     * Remove a key
     * @param key {@link IDBValidKey}
     * @returns void
     */
    remove(key) {
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return yield _removeValue(this._db, this._storeName, key);
      });
    }
  }
  db.IdbKeyVal = IdbKeyVal;
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
    class LocalStorage {
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
    exports$1.LocalStorage = LocalStorage;
    class IdbStorage {
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
    exports$1.IdbStorage = IdbStorage;
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
  function request2(iframe, { method, params }, options = {}) {
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
  postmsgRpc.request = request2;
  return postmsgRpc;
}
var cjs = {};
var principal = {};
var base32 = {};
var hasRequiredBase32;
function requireBase32() {
  if (hasRequiredBase32) return base32;
  hasRequiredBase32 = 1;
  Object.defineProperty(base32, "__esModule", { value: true });
  base32.base32Encode = base32Encode2;
  base32.base32Decode = base32Decode2;
  const alphabet = "abcdefghijklmnopqrstuvwxyz234567";
  const lookupTable = /* @__PURE__ */ Object.create(null);
  for (let i = 0; i < alphabet.length; i++) {
    lookupTable[alphabet[i]] = i;
  }
  lookupTable["0"] = lookupTable.o;
  lookupTable["1"] = lookupTable.i;
  function base32Encode2(input) {
    let skip = 0;
    let bits = 0;
    let output = "";
    function encodeByte(byte) {
      if (skip < 0) {
        bits |= byte >> -skip;
      } else {
        bits = byte << skip & 248;
      }
      if (skip > 3) {
        skip -= 8;
        return 1;
      }
      if (skip < 4) {
        output += alphabet[bits >> 3];
        skip += 5;
      }
      return 0;
    }
    for (let i = 0; i < input.length; ) {
      i += encodeByte(input[i]);
    }
    return output + (skip < 0 ? alphabet[bits >> 3] : "");
  }
  function base32Decode2(input) {
    let skip = 0;
    let byte = 0;
    const output = new Uint8Array(input.length * 4 / 3 | 0);
    let o = 0;
    function decodeChar(char) {
      let val = lookupTable[char.toLowerCase()];
      if (val === void 0) {
        throw new Error(`Invalid character: ${JSON.stringify(char)}`);
      }
      val <<= 3;
      byte |= val >>> skip;
      skip += 5;
      if (skip >= 8) {
        output[o++] = byte;
        skip -= 8;
        if (skip > 0) {
          byte = val << 5 - skip & 255;
        } else {
          byte = 0;
        }
      }
    }
    for (const c of input) {
      decodeChar(c);
    }
    return output.slice(0, o);
  }
  return base32;
}
var getCrc = {};
var hasRequiredGetCrc;
function requireGetCrc() {
  if (hasRequiredGetCrc) return getCrc;
  hasRequiredGetCrc = 1;
  Object.defineProperty(getCrc, "__esModule", { value: true });
  getCrc.getCrc32 = getCrc322;
  const lookUpTable = new Uint32Array([
    0,
    1996959894,
    3993919788,
    2567524794,
    124634137,
    1886057615,
    3915621685,
    2657392035,
    249268274,
    2044508324,
    3772115230,
    2547177864,
    162941995,
    2125561021,
    3887607047,
    2428444049,
    498536548,
    1789927666,
    4089016648,
    2227061214,
    450548861,
    1843258603,
    4107580753,
    2211677639,
    325883990,
    1684777152,
    4251122042,
    2321926636,
    335633487,
    1661365465,
    4195302755,
    2366115317,
    997073096,
    1281953886,
    3579855332,
    2724688242,
    1006888145,
    1258607687,
    3524101629,
    2768942443,
    901097722,
    1119000684,
    3686517206,
    2898065728,
    853044451,
    1172266101,
    3705015759,
    2882616665,
    651767980,
    1373503546,
    3369554304,
    3218104598,
    565507253,
    1454621731,
    3485111705,
    3099436303,
    671266974,
    1594198024,
    3322730930,
    2970347812,
    795835527,
    1483230225,
    3244367275,
    3060149565,
    1994146192,
    31158534,
    2563907772,
    4023717930,
    1907459465,
    112637215,
    2680153253,
    3904427059,
    2013776290,
    251722036,
    2517215374,
    3775830040,
    2137656763,
    141376813,
    2439277719,
    3865271297,
    1802195444,
    476864866,
    2238001368,
    4066508878,
    1812370925,
    453092731,
    2181625025,
    4111451223,
    1706088902,
    314042704,
    2344532202,
    4240017532,
    1658658271,
    366619977,
    2362670323,
    4224994405,
    1303535960,
    984961486,
    2747007092,
    3569037538,
    1256170817,
    1037604311,
    2765210733,
    3554079995,
    1131014506,
    879679996,
    2909243462,
    3663771856,
    1141124467,
    855842277,
    2852801631,
    3708648649,
    1342533948,
    654459306,
    3188396048,
    3373015174,
    1466479909,
    544179635,
    3110523913,
    3462522015,
    1591671054,
    702138776,
    2966460450,
    3352799412,
    1504918807,
    783551873,
    3082640443,
    3233442989,
    3988292384,
    2596254646,
    62317068,
    1957810842,
    3939845945,
    2647816111,
    81470997,
    1943803523,
    3814918930,
    2489596804,
    225274430,
    2053790376,
    3826175755,
    2466906013,
    167816743,
    2097651377,
    4027552580,
    2265490386,
    503444072,
    1762050814,
    4150417245,
    2154129355,
    426522225,
    1852507879,
    4275313526,
    2312317920,
    282753626,
    1742555852,
    4189708143,
    2394877945,
    397917763,
    1622183637,
    3604390888,
    2714866558,
    953729732,
    1340076626,
    3518719985,
    2797360999,
    1068828381,
    1219638859,
    3624741850,
    2936675148,
    906185462,
    1090812512,
    3747672003,
    2825379669,
    829329135,
    1181335161,
    3412177804,
    3160834842,
    628085408,
    1382605366,
    3423369109,
    3138078467,
    570562233,
    1426400815,
    3317316542,
    2998733608,
    733239954,
    1555261956,
    3268935591,
    3050360625,
    752459403,
    1541320221,
    2607071920,
    3965973030,
    1969922972,
    40735498,
    2617837225,
    3943577151,
    1913087877,
    83908371,
    2512341634,
    3803740692,
    2075208622,
    213261112,
    2463272603,
    3855990285,
    2094854071,
    198958881,
    2262029012,
    4057260610,
    1759359992,
    534414190,
    2176718541,
    4139329115,
    1873836001,
    414664567,
    2282248934,
    4279200368,
    1711684554,
    285281116,
    2405801727,
    4167216745,
    1634467795,
    376229701,
    2685067896,
    3608007406,
    1308918612,
    956543938,
    2808555105,
    3495958263,
    1231636301,
    1047427035,
    2932959818,
    3654703836,
    1088359270,
    936918e3,
    2847714899,
    3736837829,
    1202900863,
    817233897,
    3183342108,
    3401237130,
    1404277552,
    615818150,
    3134207493,
    3453421203,
    1423857449,
    601450431,
    3009837614,
    3294710456,
    1567103746,
    711928724,
    3020668471,
    3272380065,
    1510334235,
    755167117
  ]);
  function getCrc322(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      const byte = buf[i];
      const t = (byte ^ crc) & 255;
      crc = lookUpTable[t] ^ crc >>> 8;
    }
    return (crc ^ -1) >>> 0;
  }
  return getCrc;
}
const require$$2 = /* @__PURE__ */ getAugmentedNamespace(sha2);
var hasRequiredPrincipal;
function requirePrincipal() {
  if (hasRequiredPrincipal) return principal;
  hasRequiredPrincipal = 1;
  (function(exports$1) {
    Object.defineProperty(exports$1, "__esModule", { value: true });
    exports$1.Principal = exports$1.JSON_KEY_PRINCIPAL = void 0;
    const base32_ts_1 = requireBase32();
    const getCrc_ts_1 = requireGetCrc();
    const sha2_1 = require$$2;
    const utils_1 = require$$3;
    exports$1.JSON_KEY_PRINCIPAL = "__principal__";
    const SELF_AUTHENTICATING_SUFFIX = 2;
    const ANONYMOUS_SUFFIX = 4;
    const MANAGEMENT_CANISTER_PRINCIPAL_TEXT_STR = "aaaaa-aa";
    class Principal2 {
      static anonymous() {
        return new this(new Uint8Array([ANONYMOUS_SUFFIX]));
      }
      /**
       * Utility method, returning the principal representing the management canister, decoded from the hex string `'aaaaa-aa'`
       * @returns {Principal} principal of the management canister
       */
      static managementCanister() {
        return this.fromText(MANAGEMENT_CANISTER_PRINCIPAL_TEXT_STR);
      }
      static selfAuthenticating(publicKey) {
        const sha = (0, sha2_1.sha224)(publicKey);
        return new this(new Uint8Array([...sha, SELF_AUTHENTICATING_SUFFIX]));
      }
      static from(other) {
        if (typeof other === "string") {
          return Principal2.fromText(other);
        } else if (Object.getPrototypeOf(other) === Uint8Array.prototype) {
          return new Principal2(other);
        } else if (Principal2.isPrincipal(other)) {
          return new Principal2(other._arr);
        }
        throw new Error(`Impossible to convert ${JSON.stringify(other)} to Principal.`);
      }
      static fromHex(hex) {
        return new this((0, utils_1.hexToBytes)(hex));
      }
      static fromText(text) {
        let maybePrincipal = text;
        if (text.includes(exports$1.JSON_KEY_PRINCIPAL)) {
          const obj = JSON.parse(text);
          if (exports$1.JSON_KEY_PRINCIPAL in obj) {
            maybePrincipal = obj[exports$1.JSON_KEY_PRINCIPAL];
          }
        }
        const canisterIdNoDash = maybePrincipal.toLowerCase().replace(/-/g, "");
        let arr = (0, base32_ts_1.base32Decode)(canisterIdNoDash);
        arr = arr.slice(4, arr.length);
        const principal2 = new this(arr);
        if (principal2.toText() !== maybePrincipal) {
          throw new Error(`Principal "${principal2.toText()}" does not have a valid checksum (original value "${maybePrincipal}" may not be a valid Principal ID).`);
        }
        return principal2;
      }
      static fromUint8Array(arr) {
        return new this(arr);
      }
      static isPrincipal(other) {
        return other instanceof Principal2 || typeof other === "object" && other !== null && "_isPrincipal" in other && other["_isPrincipal"] === true && "_arr" in other && other["_arr"] instanceof Uint8Array;
      }
      constructor(_arr) {
        this._arr = _arr;
        this._isPrincipal = true;
      }
      isAnonymous() {
        return this._arr.byteLength === 1 && this._arr[0] === ANONYMOUS_SUFFIX;
      }
      toUint8Array() {
        return this._arr;
      }
      toHex() {
        return (0, utils_1.bytesToHex)(this._arr).toUpperCase();
      }
      toText() {
        const checksumArrayBuf = new ArrayBuffer(4);
        const view = new DataView(checksumArrayBuf);
        view.setUint32(0, (0, getCrc_ts_1.getCrc32)(this._arr));
        const checksum = new Uint8Array(checksumArrayBuf);
        const array = new Uint8Array([...checksum, ...this._arr]);
        const result = (0, base32_ts_1.base32Encode)(array);
        const matches = result.match(/.{1,5}/g);
        if (!matches) {
          throw new Error();
        }
        return matches.join("-");
      }
      toString() {
        return this.toText();
      }
      /**
       * Serializes to JSON
       * @returns {JsonnablePrincipal} a JSON object with a single key, {@link JSON_KEY_PRINCIPAL}, whose value is the principal as a string
       */
      toJSON() {
        return { [exports$1.JSON_KEY_PRINCIPAL]: this.toText() };
      }
      /**
       * Utility method taking a Principal to compare against. Used for determining canister ranges in certificate verification
       * @param {Principal} other - a {@link Principal} to compare
       * @returns {'lt' | 'eq' | 'gt'} `'lt' | 'eq' | 'gt'` a string, representing less than, equal to, or greater than
       */
      compareTo(other) {
        for (let i = 0; i < Math.min(this._arr.length, other._arr.length); i++) {
          if (this._arr[i] < other._arr[i])
            return "lt";
          else if (this._arr[i] > other._arr[i])
            return "gt";
        }
        if (this._arr.length < other._arr.length)
          return "lt";
        if (this._arr.length > other._arr.length)
          return "gt";
        return "eq";
      }
      /**
       * Utility method checking whether a provided Principal is less than or equal to the current one using the {@link Principal.compareTo} method
       * @param other a {@link Principal} to compare
       * @returns {boolean} boolean
       */
      ltEq(other) {
        const cmp = this.compareTo(other);
        return cmp == "lt" || cmp == "eq";
      }
      /**
       * Utility method checking whether a provided Principal is greater than or equal to the current one using the {@link Principal.compareTo} method
       * @param other a {@link Principal} to compare
       * @returns {boolean} boolean
       */
      gtEq(other) {
        const cmp = this.compareTo(other);
        return cmp == "gt" || cmp == "eq";
      }
    }
    exports$1.Principal = Principal2;
  })(principal);
  return principal;
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
    exports$1.base32Decode = exports$1.base32Encode = exports$1.getCrc32 = void 0;
    __exportStar(requirePrincipal(), exports$1);
    var getCrc_ts_1 = requireGetCrc();
    Object.defineProperty(exports$1, "getCrc32", { enumerable: true, get: function() {
      return getCrc_ts_1.getCrc32;
    } });
    var base32_ts_1 = requireBase32();
    Object.defineProperty(exports$1, "base32Encode", { enumerable: true, get: function() {
      return base32_ts_1.base32Encode;
    } });
    Object.defineProperty(exports$1, "base32Decode", { enumerable: true, get: function() {
      return base32_ts_1.base32Decode;
    } });
  })(cjs);
  return cjs;
}
var hasRequiredAuthClient;
function requireAuthClient() {
  if (hasRequiredAuthClient) return authClient;
  hasRequiredAuthClient = 1;
  Object.defineProperty(authClient, "__esModule", { value: true });
  authClient.NfidAuthClient = authClient.ERROR_USER_INTERRUPT = authClient.DelegationType = void 0;
  const tslib_1 = require$$0;
  const agent_1 = require$$1$2;
  const auth_client_1 = require$$2$3;
  const identity_1 = requireCjs$1();
  const storage_1 = requireStorage();
  const get_iframe_1 = requireGetIframe();
  const postmsg_rpc_1 = requirePostmsgRpc();
  const principal_1 = requireCjs();
  var DelegationType;
  (function(DelegationType2) {
    DelegationType2[DelegationType2["GLOBAL"] = 0] = "GLOBAL";
    DelegationType2[DelegationType2["ANONYMOUS"] = 1] = "ANONYMOUS";
  })(DelegationType || (authClient.DelegationType = DelegationType = {}));
  const ECDSA_KEY_LABEL = "ECDSA";
  const ED25519_KEY_LABEL = "Ed25519";
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
        const keyType = (_b = options.keyType) !== null && _b !== void 0 ? _b : ECDSA_KEY_LABEL;
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
              if (localChain && localKey && keyType === ECDSA_KEY_LABEL) {
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
                if (keyType === ED25519_KEY_LABEL && typeof maybeIdentityStorage === "string") {
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
                yield _deleteStorage(storage2);
                key = null;
              } else {
                identity = identity_1.DelegationIdentity.fromDelegation(key, chain);
              }
            }
          } catch (e) {
            console.error(e);
            yield _deleteStorage(storage2);
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
        yield _deleteStorage(this._storage);
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
  function _deleteStorage(storage2) {
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
      if (keyType === ED25519_KEY_LABEL) {
        key = yield identity_1.Ed25519KeyIdentity.generate(null);
        yield storage2.set(storage_1.KEY_STORAGE_KEY, JSON.stringify(key.toJSON()));
      } else {
        if (optionsStorage && keyType === ECDSA_KEY_LABEL) {
          console.warn(`You are using a custom storage provider that may not support CryptoKey storage. If you are using a custom storage provider that does not support CryptoKey storage, you should use '${ED25519_KEY_LABEL}' as the key type, as it can serialize to a string`);
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
