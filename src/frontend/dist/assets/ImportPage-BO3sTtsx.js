import { e as React, f as useActor, g as useQueryClient, h as useMutation, E as ExternalBlob, i as createActor, r as reactExports, j as jsxRuntimeExports, m as motion, X, u as useNavigate, k as useAdminSettingsContext, B as Button, l as Label, I as Input, a as ue, d as Layout } from "./index-D1sD4pLM.js";
import { T as Textarea } from "./textarea-BdY1DhSf.js";
import { e as encodeCategory, S as SUBCATEGORY_MAP, C as CATEGORIES, a as CONDITIONS } from "./categories-5mm-YhKT.js";
import { U as Upload } from "./upload-CtFkt_w3.js";
import { A as AnimatePresence } from "./index-CZkmgfw_.js";
import { I as Image$1 } from "./image-BE1g-X6J.js";
import { C as CarAnimation } from "./CarAnimation-BKizH6u0.js";
import { C as ClockAnimation } from "./ClockAnimation-WPVKZmmc.js";
import { L as LightningAnimation } from "./LightningAnimation-DMtqApGD.js";
var isCheckBoxInput = (element) => element.type === "checkbox";
var isDateObject = (value) => value instanceof Date;
var isNullOrUndefined = (value) => value == null;
const isObjectType = (value) => typeof value === "object";
var isObject = (value) => !isNullOrUndefined(value) && !Array.isArray(value) && isObjectType(value) && !isDateObject(value);
var getEventValue = (event) => isObject(event) && event.target ? isCheckBoxInput(event.target) ? event.target.checked : event.target.value : event;
var getNodeParentName = (name) => name.substring(0, name.search(/\.\d+(\.|$)/)) || name;
var isNameInFieldArray = (names, name) => names.has(getNodeParentName(name));
var isPlainObject = (tempObject) => {
  const prototypeCopy = tempObject.constructor && tempObject.constructor.prototype;
  return isObject(prototypeCopy) && prototypeCopy.hasOwnProperty("isPrototypeOf");
};
var isWeb = typeof window !== "undefined" && typeof window.HTMLElement !== "undefined" && typeof document !== "undefined";
function cloneObject(data) {
  if (data instanceof Date) {
    return new Date(data);
  }
  const isFileListInstance = typeof FileList !== "undefined" && data instanceof FileList;
  if (isWeb && (data instanceof Blob || isFileListInstance)) {
    return data;
  }
  const isArray = Array.isArray(data);
  if (!isArray && !(isObject(data) && isPlainObject(data))) {
    return data;
  }
  const copy = isArray ? [] : Object.create(Object.getPrototypeOf(data));
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      copy[key] = cloneObject(data[key]);
    }
  }
  return copy;
}
var isKey = (value) => /^\w*$/.test(value);
var isUndefined = (val) => val === void 0;
var compact = (value) => Array.isArray(value) ? value.filter(Boolean) : [];
var stringToPath = (input) => compact(input.replace(/["|']|\]/g, "").split(/\.|\[/));
var get = (object, path, defaultValue) => {
  if (!path || !isObject(object)) {
    return defaultValue;
  }
  const result = (isKey(path) ? [path] : stringToPath(path)).reduce((result2, key) => isNullOrUndefined(result2) ? result2 : result2[key], object);
  return isUndefined(result) || result === object ? isUndefined(object[path]) ? defaultValue : object[path] : result;
};
var isBoolean = (value) => typeof value === "boolean";
var isFunction = (value) => typeof value === "function";
var set = (object, path, value) => {
  let index = -1;
  const tempPath = isKey(path) ? [path] : stringToPath(path);
  const length = tempPath.length;
  const lastIndex = length - 1;
  while (++index < length) {
    const key = tempPath[index];
    let newValue = value;
    if (index !== lastIndex) {
      const objValue = object[key];
      newValue = isObject(objValue) || Array.isArray(objValue) ? objValue : !isNaN(+tempPath[index + 1]) ? [] : {};
    }
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      return;
    }
    object[key] = newValue;
    object = object[key];
  }
};
const EVENTS = {
  BLUR: "blur",
  FOCUS_OUT: "focusout",
  SUBMIT: "submit",
  TRIGGER: "trigger",
  VALID: "valid"
};
const VALIDATION_MODE = {
  onBlur: "onBlur",
  onChange: "onChange",
  onSubmit: "onSubmit",
  onTouched: "onTouched",
  all: "all"
};
const INPUT_VALIDATION_RULES = {
  max: "max",
  min: "min",
  maxLength: "maxLength",
  minLength: "minLength",
  pattern: "pattern",
  required: "required",
  validate: "validate"
};
const FORM_ERROR_TYPE = "form";
const ROOT_ERROR_TYPE = "root";
const HookFormControlContext = React.createContext(null);
HookFormControlContext.displayName = "HookFormControlContext";
var getProxyFormState = (formState, control, localProxyFormState, isRoot = true) => {
  const result = {
    defaultValues: control._defaultValues
  };
  for (const key in formState) {
    Object.defineProperty(result, key, {
      get: () => {
        const _key = key;
        if (control._proxyFormState[_key] !== VALIDATION_MODE.all) {
          control._proxyFormState[_key] = !isRoot || VALIDATION_MODE.all;
        }
        return formState[_key];
      }
    });
  }
  return result;
};
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;
var isString = (value) => typeof value === "string";
var generateWatchOutput = (names, _names, formValues, isGlobal, defaultValue) => {
  if (isString(names)) {
    isGlobal && _names.watch.add(names);
    return get(formValues, names, defaultValue);
  }
  if (Array.isArray(names)) {
    return names.map((fieldName) => (isGlobal && _names.watch.add(fieldName), get(formValues, fieldName)));
  }
  isGlobal && (_names.watchAll = true);
  return formValues;
};
var isPrimitive = (value) => isNullOrUndefined(value) || !isObjectType(value);
function deepEqual(object1, object2, _internal_visited = /* @__PURE__ */ new WeakSet()) {
  if (isPrimitive(object1) || isPrimitive(object2)) {
    return Object.is(object1, object2);
  }
  if (isDateObject(object1) && isDateObject(object2)) {
    return Object.is(object1.getTime(), object2.getTime());
  }
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  if (_internal_visited.has(object1) || _internal_visited.has(object2)) {
    return true;
  }
  _internal_visited.add(object1);
  _internal_visited.add(object2);
  for (const key of keys1) {
    const val1 = object1[key];
    if (!keys2.includes(key)) {
      return false;
    }
    if (key !== "ref") {
      const val2 = object2[key];
      if (isDateObject(val1) && isDateObject(val2) || isObject(val1) && isObject(val2) || Array.isArray(val1) && Array.isArray(val2) ? !deepEqual(val1, val2, _internal_visited) : !Object.is(val1, val2)) {
        return false;
      }
    }
  }
  return true;
}
const HookFormContext = React.createContext(null);
HookFormContext.displayName = "HookFormContext";
var appendErrors = (name, validateAllFieldCriteria, errors, type, message) => validateAllFieldCriteria ? {
  ...errors[name],
  types: {
    ...errors[name] && errors[name].types ? errors[name].types : {},
    [type]: message || true
  }
} : {};
var convertToArrayPayload = (value) => Array.isArray(value) ? value : [value];
var createSubject = () => {
  let _observers = [];
  const next = (value) => {
    for (const observer of _observers) {
      observer.next && observer.next(value);
    }
  };
  const subscribe = (observer) => {
    _observers.push(observer);
    return {
      unsubscribe: () => {
        _observers = _observers.filter((o) => o !== observer);
      }
    };
  };
  const unsubscribe = () => {
    _observers = [];
  };
  return {
    get observers() {
      return _observers;
    },
    next,
    subscribe,
    unsubscribe
  };
};
function extractFormValues(fieldsState, formValues) {
  const values = {};
  for (const key in fieldsState) {
    if (fieldsState.hasOwnProperty(key)) {
      const fieldState = fieldsState[key];
      const fieldValue = formValues[key];
      if (fieldState && isObject(fieldState) && fieldValue) {
        const nestedFieldsState = extractFormValues(fieldState, fieldValue);
        if (isObject(nestedFieldsState)) {
          values[key] = nestedFieldsState;
        }
      } else if (fieldsState[key]) {
        values[key] = fieldValue;
      }
    }
  }
  return values;
}
var isEmptyObject = (value) => isObject(value) && !Object.keys(value).length;
var isFileInput = (element) => element.type === "file";
var isHTMLElement = (value) => {
  if (!isWeb) {
    return false;
  }
  const owner = value ? value.ownerDocument : 0;
  return value instanceof (owner && owner.defaultView ? owner.defaultView.HTMLElement : HTMLElement);
};
var isMultipleSelect = (element) => element.type === `select-multiple`;
var isRadioInput = (element) => element.type === "radio";
var isRadioOrCheckbox = (ref) => isRadioInput(ref) || isCheckBoxInput(ref);
var live = (ref) => isHTMLElement(ref) && ref.isConnected;
function baseGet(object, updatePath) {
  const length = updatePath.slice(0, -1).length;
  let index = 0;
  while (index < length) {
    object = isUndefined(object) ? index++ : object[updatePath[index++]];
  }
  return object;
}
function isEmptyArray(obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && !isUndefined(obj[key])) {
      return false;
    }
  }
  return true;
}
function unset(object, path) {
  const paths = Array.isArray(path) ? path : isKey(path) ? [path] : stringToPath(path);
  const childObject = paths.length === 1 ? object : baseGet(object, paths);
  const index = paths.length - 1;
  const key = paths[index];
  if (childObject) {
    delete childObject[key];
  }
  if (index !== 0 && (isObject(childObject) && isEmptyObject(childObject) || Array.isArray(childObject) && isEmptyArray(childObject))) {
    unset(object, paths.slice(0, -1));
  }
  return object;
}
var objectHasFunction = (data) => {
  for (const key in data) {
    if (isFunction(data[key])) {
      return true;
    }
  }
  return false;
};
function isTraversable(value) {
  return Array.isArray(value) || isObject(value) && !objectHasFunction(value);
}
function markFieldsDirty(data, fields = {}) {
  for (const key in data) {
    const value = data[key];
    if (isTraversable(value)) {
      fields[key] = Array.isArray(value) ? [] : {};
      markFieldsDirty(value, fields[key]);
    } else if (!isUndefined(value)) {
      fields[key] = true;
    }
  }
  return fields;
}
function getDirtyFields(data, formValues, dirtyFieldsFromValues) {
  if (!dirtyFieldsFromValues) {
    dirtyFieldsFromValues = markFieldsDirty(formValues);
  }
  for (const key in data) {
    const value = data[key];
    if (isTraversable(value)) {
      if (isUndefined(formValues) || isPrimitive(dirtyFieldsFromValues[key])) {
        dirtyFieldsFromValues[key] = markFieldsDirty(value, Array.isArray(value) ? [] : {});
      } else {
        getDirtyFields(value, isNullOrUndefined(formValues) ? {} : formValues[key], dirtyFieldsFromValues[key]);
      }
    } else {
      const formValue = formValues[key];
      dirtyFieldsFromValues[key] = !deepEqual(value, formValue);
    }
  }
  return dirtyFieldsFromValues;
}
const defaultResult = {
  value: false,
  isValid: false
};
const validResult = { value: true, isValid: true };
var getCheckboxValue = (options) => {
  if (Array.isArray(options)) {
    if (options.length > 1) {
      const values = options.filter((option) => option && option.checked && !option.disabled).map((option) => option.value);
      return { value: values, isValid: !!values.length };
    }
    return options[0].checked && !options[0].disabled ? (
      // @ts-expect-error expected to work in the browser
      options[0].attributes && !isUndefined(options[0].attributes.value) ? isUndefined(options[0].value) || options[0].value === "" ? validResult : { value: options[0].value, isValid: true } : validResult
    ) : defaultResult;
  }
  return defaultResult;
};
var getFieldValueAs = (value, { valueAsNumber, valueAsDate, setValueAs }) => isUndefined(value) ? value : valueAsNumber ? value === "" ? NaN : value ? +value : value : valueAsDate && isString(value) ? new Date(value) : setValueAs ? setValueAs(value) : value;
const defaultReturn = {
  isValid: false,
  value: null
};
var getRadioValue = (options) => Array.isArray(options) ? options.reduce((previous, option) => option && option.checked && !option.disabled ? {
  isValid: true,
  value: option.value
} : previous, defaultReturn) : defaultReturn;
function getFieldValue(_f) {
  const ref = _f.ref;
  if (isFileInput(ref)) {
    return ref.files;
  }
  if (isRadioInput(ref)) {
    return getRadioValue(_f.refs).value;
  }
  if (isMultipleSelect(ref)) {
    return [...ref.selectedOptions].map(({ value }) => value);
  }
  if (isCheckBoxInput(ref)) {
    return getCheckboxValue(_f.refs).value;
  }
  return getFieldValueAs(isUndefined(ref.value) ? _f.ref.value : ref.value, _f);
}
var getResolverOptions = (fieldsNames, _fields, criteriaMode, shouldUseNativeValidation) => {
  const fields = {};
  for (const name of fieldsNames) {
    const field = get(_fields, name);
    field && set(fields, name, field._f);
  }
  return {
    criteriaMode,
    names: [...fieldsNames],
    fields,
    shouldUseNativeValidation
  };
};
var isRegex = (value) => value instanceof RegExp;
var getRuleValue = (rule) => isUndefined(rule) ? rule : isRegex(rule) ? rule.source : isObject(rule) ? isRegex(rule.value) ? rule.value.source : rule.value : rule;
var getValidationModes = (mode) => ({
  isOnSubmit: !mode || mode === VALIDATION_MODE.onSubmit,
  isOnBlur: mode === VALIDATION_MODE.onBlur,
  isOnChange: mode === VALIDATION_MODE.onChange,
  isOnAll: mode === VALIDATION_MODE.all,
  isOnTouch: mode === VALIDATION_MODE.onTouched
});
const ASYNC_FUNCTION = "AsyncFunction";
var hasPromiseValidation = (fieldReference) => !!fieldReference && !!fieldReference.validate && !!(isFunction(fieldReference.validate) && fieldReference.validate.constructor.name === ASYNC_FUNCTION || isObject(fieldReference.validate) && Object.values(fieldReference.validate).find((validateFunction) => validateFunction.constructor.name === ASYNC_FUNCTION));
var hasValidation = (options) => options.mount && (options.required || options.min || options.max || options.maxLength || options.minLength || options.pattern || options.validate);
var isWatched = (name, _names, isBlurEvent) => !isBlurEvent && (_names.watchAll || _names.watch.has(name) || [..._names.watch].some((watchName) => name.startsWith(watchName) && /^\.\w+/.test(name.slice(watchName.length))));
const iterateFieldsByAction = (fields, action, fieldsNames, abortEarly) => {
  for (const key of fieldsNames || Object.keys(fields)) {
    const field = get(fields, key);
    if (field) {
      const { _f, ...currentField } = field;
      if (_f) {
        if (_f.refs && _f.refs[0] && action(_f.refs[0], key) && !abortEarly) {
          return true;
        } else if (_f.ref && action(_f.ref, _f.name) && !abortEarly) {
          return true;
        } else {
          if (iterateFieldsByAction(currentField, action)) {
            break;
          }
        }
      } else if (isObject(currentField)) {
        if (iterateFieldsByAction(currentField, action)) {
          break;
        }
      }
    }
  }
  return;
};
function schemaErrorLookup(errors, _fields, name) {
  const error = get(errors, name);
  if (error || isKey(name)) {
    return {
      error,
      name
    };
  }
  const names = name.split(".");
  while (names.length) {
    const fieldName = names.join(".");
    const field = get(_fields, fieldName);
    const foundError = get(errors, fieldName);
    if (field && !Array.isArray(field) && name !== fieldName) {
      return { name };
    }
    if (foundError && foundError.type) {
      return {
        name: fieldName,
        error: foundError
      };
    }
    if (foundError && foundError.root && foundError.root.type) {
      return {
        name: `${fieldName}.root`,
        error: foundError.root
      };
    }
    names.pop();
  }
  return {
    name
  };
}
var shouldRenderFormState = (formStateData, _proxyFormState, updateFormState, isRoot) => {
  updateFormState(formStateData);
  const { name, ...formState } = formStateData;
  return isEmptyObject(formState) || Object.keys(formState).length >= Object.keys(_proxyFormState).length || Object.keys(formState).find((key) => _proxyFormState[key] === (!isRoot || VALIDATION_MODE.all));
};
var shouldSubscribeByName = (name, signalName, exact) => !name || !signalName || name === signalName || convertToArrayPayload(name).some((currentName) => currentName && (exact ? currentName === signalName : currentName.startsWith(signalName) || signalName.startsWith(currentName)));
var skipValidation = (isBlurEvent, isTouched, isSubmitted, reValidateMode, mode) => {
  if (mode.isOnAll) {
    return false;
  } else if (!isSubmitted && mode.isOnTouch) {
    return !(isTouched || isBlurEvent);
  } else if (isSubmitted ? reValidateMode.isOnBlur : mode.isOnBlur) {
    return !isBlurEvent;
  } else if (isSubmitted ? reValidateMode.isOnChange : mode.isOnChange) {
    return isBlurEvent;
  }
  return true;
};
var unsetEmptyArray = (ref, name) => !compact(get(ref, name)).length && unset(ref, name);
var updateFieldArrayRootError = (errors, error, name) => {
  const fieldArrayErrors = convertToArrayPayload(get(errors, name));
  set(fieldArrayErrors, ROOT_ERROR_TYPE, error[name]);
  set(errors, name, fieldArrayErrors);
  return errors;
};
function getValidateError(result, ref, type = "validate") {
  if (isString(result) || Array.isArray(result) && result.every(isString) || isBoolean(result) && !result) {
    return {
      type,
      message: isString(result) ? result : "",
      ref
    };
  }
}
var getValueAndMessage = (validationData) => isObject(validationData) && !isRegex(validationData) ? validationData : {
  value: validationData,
  message: ""
};
var validateField = async (field, disabledFieldNames, formValues, validateAllFieldCriteria, shouldUseNativeValidation, isFieldArray) => {
  const { ref, refs, required, maxLength, minLength, min, max, pattern, validate, name, valueAsNumber, mount } = field._f;
  const inputValue = get(formValues, name);
  if (!mount || disabledFieldNames.has(name)) {
    return {};
  }
  const inputRef = refs ? refs[0] : ref;
  const setCustomValidity = (message) => {
    if (shouldUseNativeValidation && inputRef.reportValidity) {
      inputRef.setCustomValidity(isBoolean(message) ? "" : message || "");
      inputRef.reportValidity();
    }
  };
  const error = {};
  const isRadio = isRadioInput(ref);
  const isCheckBox = isCheckBoxInput(ref);
  const isRadioOrCheckbox2 = isRadio || isCheckBox;
  const isEmpty = (valueAsNumber || isFileInput(ref)) && isUndefined(ref.value) && isUndefined(inputValue) || isHTMLElement(ref) && ref.value === "" || inputValue === "" || Array.isArray(inputValue) && !inputValue.length;
  const appendErrorsCurry = appendErrors.bind(null, name, validateAllFieldCriteria, error);
  const getMinMaxMessage = (exceedMax, maxLengthMessage, minLengthMessage, maxType = INPUT_VALIDATION_RULES.maxLength, minType = INPUT_VALIDATION_RULES.minLength) => {
    const message = exceedMax ? maxLengthMessage : minLengthMessage;
    error[name] = {
      type: exceedMax ? maxType : minType,
      message,
      ref,
      ...appendErrorsCurry(exceedMax ? maxType : minType, message)
    };
  };
  if (isFieldArray ? !Array.isArray(inputValue) || !inputValue.length : required && (!isRadioOrCheckbox2 && (isEmpty || isNullOrUndefined(inputValue)) || isBoolean(inputValue) && !inputValue || isCheckBox && !getCheckboxValue(refs).isValid || isRadio && !getRadioValue(refs).isValid)) {
    const { value, message } = isString(required) ? { value: !!required, message: required } : getValueAndMessage(required);
    if (value) {
      error[name] = {
        type: INPUT_VALIDATION_RULES.required,
        message,
        ref: inputRef,
        ...appendErrorsCurry(INPUT_VALIDATION_RULES.required, message)
      };
      if (!validateAllFieldCriteria) {
        setCustomValidity(message);
        return error;
      }
    }
  }
  if (!isEmpty && (!isNullOrUndefined(min) || !isNullOrUndefined(max))) {
    let exceedMax;
    let exceedMin;
    const maxOutput = getValueAndMessage(max);
    const minOutput = getValueAndMessage(min);
    if (!isNullOrUndefined(inputValue) && !isNaN(inputValue)) {
      const valueNumber = ref.valueAsNumber || (inputValue ? +inputValue : inputValue);
      if (!isNullOrUndefined(maxOutput.value)) {
        exceedMax = valueNumber > maxOutput.value;
      }
      if (!isNullOrUndefined(minOutput.value)) {
        exceedMin = valueNumber < minOutput.value;
      }
    } else {
      const valueDate = ref.valueAsDate || new Date(inputValue);
      const convertTimeToDate = (time) => /* @__PURE__ */ new Date((/* @__PURE__ */ new Date()).toDateString() + " " + time);
      const isTime = ref.type == "time";
      const isWeek = ref.type == "week";
      if (isString(maxOutput.value) && inputValue) {
        exceedMax = isTime ? convertTimeToDate(inputValue) > convertTimeToDate(maxOutput.value) : isWeek ? inputValue > maxOutput.value : valueDate > new Date(maxOutput.value);
      }
      if (isString(minOutput.value) && inputValue) {
        exceedMin = isTime ? convertTimeToDate(inputValue) < convertTimeToDate(minOutput.value) : isWeek ? inputValue < minOutput.value : valueDate < new Date(minOutput.value);
      }
    }
    if (exceedMax || exceedMin) {
      getMinMaxMessage(!!exceedMax, maxOutput.message, minOutput.message, INPUT_VALIDATION_RULES.max, INPUT_VALIDATION_RULES.min);
      if (!validateAllFieldCriteria) {
        setCustomValidity(error[name].message);
        return error;
      }
    }
  }
  if ((maxLength || minLength) && !isEmpty && (isString(inputValue) || isFieldArray && Array.isArray(inputValue))) {
    const maxLengthOutput = getValueAndMessage(maxLength);
    const minLengthOutput = getValueAndMessage(minLength);
    const exceedMax = !isNullOrUndefined(maxLengthOutput.value) && inputValue.length > +maxLengthOutput.value;
    const exceedMin = !isNullOrUndefined(minLengthOutput.value) && inputValue.length < +minLengthOutput.value;
    if (exceedMax || exceedMin) {
      getMinMaxMessage(exceedMax, maxLengthOutput.message, minLengthOutput.message);
      if (!validateAllFieldCriteria) {
        setCustomValidity(error[name].message);
        return error;
      }
    }
  }
  if (pattern && !isEmpty && isString(inputValue)) {
    const { value: patternValue, message } = getValueAndMessage(pattern);
    if (isRegex(patternValue) && !inputValue.match(patternValue)) {
      error[name] = {
        type: INPUT_VALIDATION_RULES.pattern,
        message,
        ref,
        ...appendErrorsCurry(INPUT_VALIDATION_RULES.pattern, message)
      };
      if (!validateAllFieldCriteria) {
        setCustomValidity(message);
        return error;
      }
    }
  }
  if (validate) {
    if (isFunction(validate)) {
      const result = await validate(inputValue, formValues);
      const validateError = getValidateError(result, inputRef);
      if (validateError) {
        error[name] = {
          ...validateError,
          ...appendErrorsCurry(INPUT_VALIDATION_RULES.validate, validateError.message)
        };
        if (!validateAllFieldCriteria) {
          setCustomValidity(validateError.message);
          return error;
        }
      }
    } else if (isObject(validate)) {
      let validationResult = {};
      for (const key in validate) {
        if (!isEmptyObject(validationResult) && !validateAllFieldCriteria) {
          break;
        }
        const validateError = getValidateError(await validate[key](inputValue, formValues), inputRef, key);
        if (validateError) {
          validationResult = {
            ...validateError,
            ...appendErrorsCurry(key, validateError.message)
          };
          setCustomValidity(validateError.message);
          if (validateAllFieldCriteria) {
            error[name] = validationResult;
          }
        }
      }
      if (!isEmptyObject(validationResult)) {
        error[name] = {
          ref: inputRef,
          ...validationResult
        };
        if (!validateAllFieldCriteria) {
          return error;
        }
      }
    }
  }
  setCustomValidity(true);
  return error;
};
const defaultOptions = {
  mode: VALIDATION_MODE.onSubmit,
  reValidateMode: VALIDATION_MODE.onChange,
  shouldFocusError: true
};
function createFormControl(props = {}) {
  let _options = {
    ...defaultOptions,
    ...props
  };
  let _formState = {
    submitCount: 0,
    isDirty: false,
    isReady: false,
    isLoading: isFunction(_options.defaultValues),
    isValidating: false,
    isSubmitted: false,
    isSubmitting: false,
    isSubmitSuccessful: false,
    isValid: false,
    touchedFields: {},
    dirtyFields: {},
    validatingFields: {},
    errors: _options.errors || {},
    disabled: _options.disabled || false
  };
  let _fields = {};
  let _defaultValues = isObject(_options.defaultValues) || isObject(_options.values) ? cloneObject(_options.defaultValues || _options.values) || {} : {};
  let _formValues = _options.shouldUnregister ? {} : cloneObject(_defaultValues);
  let _state = {
    action: false,
    mount: false,
    watch: false,
    keepIsValid: false
  };
  let _names = {
    mount: /* @__PURE__ */ new Set(),
    disabled: /* @__PURE__ */ new Set(),
    unMount: /* @__PURE__ */ new Set(),
    array: /* @__PURE__ */ new Set(),
    watch: /* @__PURE__ */ new Set()
  };
  let delayErrorCallback;
  let timer = 0;
  const defaultProxyFormState = {
    isDirty: false,
    dirtyFields: false,
    validatingFields: false,
    touchedFields: false,
    isValidating: false,
    isValid: false,
    errors: false
  };
  const _proxyFormState = {
    ...defaultProxyFormState
  };
  let _proxySubscribeFormState = {
    ..._proxyFormState
  };
  const _subjects = {
    array: createSubject(),
    state: createSubject()
  };
  const shouldDisplayAllAssociatedErrors = _options.criteriaMode === VALIDATION_MODE.all;
  const debounce = (callback) => (wait) => {
    clearTimeout(timer);
    timer = setTimeout(callback, wait);
  };
  const _setValid = async (shouldUpdateValid) => {
    if (_state.keepIsValid) {
      return;
    }
    if (!_options.disabled && (_proxyFormState.isValid || _proxySubscribeFormState.isValid || shouldUpdateValid)) {
      let isValid;
      if (_options.resolver) {
        isValid = isEmptyObject((await _runSchema()).errors);
        _updateIsValidating();
      } else {
        isValid = await executeBuiltInValidation({
          fields: _fields,
          onlyCheckValid: true,
          eventType: EVENTS.VALID
        });
      }
      if (isValid !== _formState.isValid) {
        _subjects.state.next({
          isValid
        });
      }
    }
  };
  const _updateIsValidating = (names, isValidating) => {
    if (!_options.disabled && (_proxyFormState.isValidating || _proxyFormState.validatingFields || _proxySubscribeFormState.isValidating || _proxySubscribeFormState.validatingFields)) {
      (names || Array.from(_names.mount)).forEach((name) => {
        if (name) {
          isValidating ? set(_formState.validatingFields, name, isValidating) : unset(_formState.validatingFields, name);
        }
      });
      _subjects.state.next({
        validatingFields: _formState.validatingFields,
        isValidating: !isEmptyObject(_formState.validatingFields)
      });
    }
  };
  const _setFieldArray = (name, values = [], method, args, shouldSetValues = true, shouldUpdateFieldsAndState = true) => {
    if (args && method && !_options.disabled) {
      _state.action = true;
      if (shouldUpdateFieldsAndState && Array.isArray(get(_fields, name))) {
        const fieldValues = method(get(_fields, name), args.argA, args.argB);
        shouldSetValues && set(_fields, name, fieldValues);
      }
      if (shouldUpdateFieldsAndState && Array.isArray(get(_formState.errors, name))) {
        const errors = method(get(_formState.errors, name), args.argA, args.argB);
        shouldSetValues && set(_formState.errors, name, errors);
        unsetEmptyArray(_formState.errors, name);
      }
      if ((_proxyFormState.touchedFields || _proxySubscribeFormState.touchedFields) && shouldUpdateFieldsAndState && Array.isArray(get(_formState.touchedFields, name))) {
        const touchedFields = method(get(_formState.touchedFields, name), args.argA, args.argB);
        shouldSetValues && set(_formState.touchedFields, name, touchedFields);
      }
      if (_proxyFormState.dirtyFields || _proxySubscribeFormState.dirtyFields) {
        const fullDirtyFields = getDirtyFields(_defaultValues, _formValues);
        const rootName = getNodeParentName(name);
        set(_formState.dirtyFields, rootName, get(fullDirtyFields, rootName));
      }
      _subjects.state.next({
        name,
        isDirty: _getDirty(name, values),
        dirtyFields: _formState.dirtyFields,
        errors: _formState.errors,
        isValid: _formState.isValid
      });
    } else {
      set(_formValues, name, values);
    }
  };
  const updateErrors = (name, error) => {
    set(_formState.errors, name, error);
    _subjects.state.next({
      errors: _formState.errors
    });
  };
  const _setErrors = (errors) => {
    _formState.errors = errors;
    _subjects.state.next({
      errors: _formState.errors,
      isValid: false
    });
  };
  const updateValidAndValue = (name, shouldSkipSetValueAs, value, ref) => {
    const field = get(_fields, name);
    if (field) {
      const defaultValue = get(_formValues, name, isUndefined(value) ? get(_defaultValues, name) : value);
      isUndefined(defaultValue) || ref && ref.defaultChecked || shouldSkipSetValueAs ? set(_formValues, name, shouldSkipSetValueAs ? defaultValue : getFieldValue(field._f)) : setFieldValue(name, defaultValue);
      _state.mount && !_state.action && _setValid();
    }
  };
  const updateTouchAndDirty = (name, fieldValue, isBlurEvent, shouldDirty, shouldRender) => {
    let shouldUpdateField = false;
    let isPreviousDirty = false;
    const output = {
      name
    };
    if (!_options.disabled) {
      if (!isBlurEvent || shouldDirty) {
        if (_proxyFormState.isDirty || _proxySubscribeFormState.isDirty) {
          isPreviousDirty = _formState.isDirty;
          _formState.isDirty = output.isDirty = _getDirty();
          shouldUpdateField = isPreviousDirty !== output.isDirty;
        }
        const isCurrentFieldPristine = deepEqual(get(_defaultValues, name), fieldValue);
        isPreviousDirty = !!get(_formState.dirtyFields, name);
        isCurrentFieldPristine ? unset(_formState.dirtyFields, name) : set(_formState.dirtyFields, name, true);
        output.dirtyFields = _formState.dirtyFields;
        shouldUpdateField = shouldUpdateField || (_proxyFormState.dirtyFields || _proxySubscribeFormState.dirtyFields) && isPreviousDirty !== !isCurrentFieldPristine;
      }
      if (isBlurEvent) {
        const isPreviousFieldTouched = get(_formState.touchedFields, name);
        if (!isPreviousFieldTouched) {
          set(_formState.touchedFields, name, isBlurEvent);
          output.touchedFields = _formState.touchedFields;
          shouldUpdateField = shouldUpdateField || (_proxyFormState.touchedFields || _proxySubscribeFormState.touchedFields) && isPreviousFieldTouched !== isBlurEvent;
        }
      }
      shouldUpdateField && shouldRender && _subjects.state.next(output);
    }
    return shouldUpdateField ? output : {};
  };
  const shouldRenderByError = (name, isValid, error, fieldState) => {
    const previousFieldError = get(_formState.errors, name);
    const shouldUpdateValid = (_proxyFormState.isValid || _proxySubscribeFormState.isValid) && isBoolean(isValid) && _formState.isValid !== isValid;
    if (_options.delayError && error) {
      delayErrorCallback = debounce(() => updateErrors(name, error));
      delayErrorCallback(_options.delayError);
    } else {
      clearTimeout(timer);
      delayErrorCallback = null;
      error ? set(_formState.errors, name, error) : unset(_formState.errors, name);
    }
    if ((error ? !deepEqual(previousFieldError, error) : previousFieldError) || !isEmptyObject(fieldState) || shouldUpdateValid) {
      const updatedFormState = {
        ...fieldState,
        ...shouldUpdateValid && isBoolean(isValid) ? { isValid } : {},
        errors: _formState.errors,
        name
      };
      _formState = {
        ..._formState,
        ...updatedFormState
      };
      _subjects.state.next(updatedFormState);
    }
  };
  const _runSchema = async (name) => {
    _updateIsValidating(name, true);
    return await _options.resolver(_formValues, _options.context, getResolverOptions(name || _names.mount, _fields, _options.criteriaMode, _options.shouldUseNativeValidation));
  };
  const executeSchemaAndUpdateState = async (names) => {
    const { errors } = await _runSchema(names);
    _updateIsValidating(names);
    if (names) {
      for (const name of names) {
        const error = get(errors, name);
        error ? set(_formState.errors, name, error) : unset(_formState.errors, name);
      }
    } else {
      _formState.errors = errors;
    }
    return errors;
  };
  const validateForm = async ({ name, eventType }) => {
    if (props.validate) {
      const result = await props.validate({
        formValues: _formValues,
        formState: _formState,
        name,
        eventType
      });
      if (isObject(result)) {
        for (const key in result) {
          const error = result[key];
          if (error) {
            setError(`${FORM_ERROR_TYPE}.${key}`, {
              message: isString(result.message) ? result.message : "",
              type: INPUT_VALIDATION_RULES.validate
            });
          }
        }
      } else if (isString(result) || !result) {
        setError(FORM_ERROR_TYPE, {
          message: result || "",
          type: INPUT_VALIDATION_RULES.validate
        });
      } else {
        clearErrors(FORM_ERROR_TYPE);
      }
      return result;
    }
    return true;
  };
  const executeBuiltInValidation = async ({ fields, onlyCheckValid, name, eventType, context = {
    valid: true,
    runRootValidation: false
  } }) => {
    if (props.validate) {
      context.runRootValidation = true;
      const result = await validateForm({
        name,
        eventType
      });
      if (!result) {
        context.valid = false;
        if (onlyCheckValid) {
          return context.valid;
        }
      }
    }
    for (const name2 in fields) {
      const field = fields[name2];
      if (field) {
        const { _f, ...fieldValue } = field;
        if (_f) {
          const isFieldArrayRoot = _names.array.has(_f.name);
          const isPromiseFunction = field._f && hasPromiseValidation(field._f);
          if (isPromiseFunction && _proxyFormState.validatingFields) {
            _updateIsValidating([_f.name], true);
          }
          const fieldError = await validateField(field, _names.disabled, _formValues, shouldDisplayAllAssociatedErrors, _options.shouldUseNativeValidation && !onlyCheckValid, isFieldArrayRoot);
          if (isPromiseFunction && _proxyFormState.validatingFields) {
            _updateIsValidating([_f.name]);
          }
          if (fieldError[_f.name]) {
            context.valid = false;
            if (onlyCheckValid) {
              break;
            }
          }
          !onlyCheckValid && (get(fieldError, _f.name) ? isFieldArrayRoot ? updateFieldArrayRootError(_formState.errors, fieldError, _f.name) : set(_formState.errors, _f.name, fieldError[_f.name]) : unset(_formState.errors, _f.name));
          if (props.shouldUseNativeValidation && fieldError[_f.name]) {
            break;
          }
        }
        !isEmptyObject(fieldValue) && await executeBuiltInValidation({
          context,
          onlyCheckValid,
          fields: fieldValue,
          name: name2,
          eventType
        });
      }
    }
    return context.valid;
  };
  const _removeUnmounted = () => {
    for (const name of _names.unMount) {
      const field = get(_fields, name);
      field && (field._f.refs ? field._f.refs.every((ref) => !live(ref)) : !live(field._f.ref)) && unregister(name);
    }
    _names.unMount = /* @__PURE__ */ new Set();
  };
  const _getDirty = (name, data) => !_options.disabled && (name && data && set(_formValues, name, data), !deepEqual(getValues(), _defaultValues));
  const _getWatch = (names, defaultValue, isGlobal) => generateWatchOutput(names, _names, {
    ..._state.mount ? _formValues : isUndefined(defaultValue) ? _defaultValues : isString(names) ? { [names]: defaultValue } : defaultValue
  }, isGlobal, defaultValue);
  const _getFieldArray = (name) => compact(get(_state.mount ? _formValues : _defaultValues, name, _options.shouldUnregister ? get(_defaultValues, name, []) : []));
  const setFieldValue = (name, value, options = {}) => {
    const field = get(_fields, name);
    let fieldValue = value;
    if (field) {
      const fieldReference = field._f;
      if (fieldReference) {
        !fieldReference.disabled && set(_formValues, name, getFieldValueAs(value, fieldReference));
        fieldValue = isHTMLElement(fieldReference.ref) && isNullOrUndefined(value) ? "" : value;
        if (isMultipleSelect(fieldReference.ref)) {
          [...fieldReference.ref.options].forEach((optionRef) => optionRef.selected = fieldValue.includes(optionRef.value));
        } else if (fieldReference.refs) {
          if (isCheckBoxInput(fieldReference.ref)) {
            fieldReference.refs.forEach((checkboxRef) => {
              if (!checkboxRef.defaultChecked || !checkboxRef.disabled) {
                if (Array.isArray(fieldValue)) {
                  checkboxRef.checked = !!fieldValue.find((data) => data === checkboxRef.value);
                } else {
                  checkboxRef.checked = fieldValue === checkboxRef.value || !!fieldValue;
                }
              }
            });
          } else {
            fieldReference.refs.forEach((radioRef) => radioRef.checked = radioRef.value === fieldValue);
          }
        } else if (isFileInput(fieldReference.ref)) {
          fieldReference.ref.value = "";
        } else {
          fieldReference.ref.value = fieldValue;
          if (!fieldReference.ref.type) {
            _subjects.state.next({
              name,
              values: cloneObject(_formValues)
            });
          }
        }
      }
    }
    (options.shouldDirty || options.shouldTouch) && updateTouchAndDirty(name, fieldValue, options.shouldTouch, options.shouldDirty, true);
    options.shouldValidate && trigger(name);
  };
  const setValues = (name, value, options) => {
    for (const fieldKey in value) {
      if (!value.hasOwnProperty(fieldKey)) {
        return;
      }
      const fieldValue = value[fieldKey];
      const fieldName = name + "." + fieldKey;
      const field = get(_fields, fieldName);
      (_names.array.has(name) || isObject(fieldValue) || field && !field._f) && !isDateObject(fieldValue) ? setValues(fieldName, fieldValue, options) : setFieldValue(fieldName, fieldValue, options);
    }
  };
  const setValue = (name, value, options = {}) => {
    const field = get(_fields, name);
    const isFieldArray = _names.array.has(name);
    const cloneValue = cloneObject(value);
    set(_formValues, name, cloneValue);
    if (isFieldArray) {
      _subjects.array.next({
        name,
        values: cloneObject(_formValues)
      });
      if ((_proxyFormState.isDirty || _proxyFormState.dirtyFields || _proxySubscribeFormState.isDirty || _proxySubscribeFormState.dirtyFields) && options.shouldDirty) {
        _subjects.state.next({
          name,
          dirtyFields: getDirtyFields(_defaultValues, _formValues),
          isDirty: _getDirty(name, cloneValue)
        });
      }
    } else {
      field && !field._f && !isNullOrUndefined(cloneValue) ? setValues(name, cloneValue, options) : setFieldValue(name, cloneValue, options);
    }
    if (isWatched(name, _names)) {
      _subjects.state.next({
        ..._formState,
        name,
        values: cloneObject(_formValues)
      });
    } else {
      _subjects.state.next({
        name: _state.mount ? name : void 0,
        values: cloneObject(_formValues)
      });
    }
  };
  const onChange = async (event) => {
    _state.mount = true;
    const target = event.target;
    let name = target.name;
    let isFieldValueUpdated = true;
    const field = get(_fields, name);
    const _updateIsFieldValueUpdated = (fieldValue) => {
      isFieldValueUpdated = Number.isNaN(fieldValue) || isDateObject(fieldValue) && isNaN(fieldValue.getTime()) || deepEqual(fieldValue, get(_formValues, name, fieldValue));
    };
    const validationModeBeforeSubmit = getValidationModes(_options.mode);
    const validationModeAfterSubmit = getValidationModes(_options.reValidateMode);
    if (field) {
      let error;
      let isValid;
      const fieldValue = target.type ? getFieldValue(field._f) : getEventValue(event);
      const isBlurEvent = event.type === EVENTS.BLUR || event.type === EVENTS.FOCUS_OUT;
      const shouldSkipValidation = !hasValidation(field._f) && !props.validate && !_options.resolver && !get(_formState.errors, name) && !field._f.deps || skipValidation(isBlurEvent, get(_formState.touchedFields, name), _formState.isSubmitted, validationModeAfterSubmit, validationModeBeforeSubmit);
      const watched = isWatched(name, _names, isBlurEvent);
      set(_formValues, name, fieldValue);
      if (isBlurEvent) {
        if (!target || !target.readOnly) {
          field._f.onBlur && field._f.onBlur(event);
          delayErrorCallback && delayErrorCallback(0);
        }
      } else if (field._f.onChange) {
        field._f.onChange(event);
      }
      const fieldState = updateTouchAndDirty(name, fieldValue, isBlurEvent);
      const shouldRender = !isEmptyObject(fieldState) || watched;
      !isBlurEvent && _subjects.state.next({
        name,
        type: event.type,
        values: cloneObject(_formValues)
      });
      if (shouldSkipValidation) {
        if (_proxyFormState.isValid || _proxySubscribeFormState.isValid) {
          if (_options.mode === "onBlur") {
            if (isBlurEvent) {
              _setValid();
            }
          } else if (!isBlurEvent) {
            _setValid();
          }
        }
        return shouldRender && _subjects.state.next({ name, ...watched ? {} : fieldState });
      }
      if (!_options.resolver && props.validate) {
        await validateForm({
          name,
          eventType: event.type
        });
      }
      !isBlurEvent && watched && _subjects.state.next({ ..._formState });
      if (_options.resolver) {
        const { errors } = await _runSchema([name]);
        _updateIsValidating([name]);
        _updateIsFieldValueUpdated(fieldValue);
        if (isFieldValueUpdated) {
          const previousErrorLookupResult = schemaErrorLookup(_formState.errors, _fields, name);
          const errorLookupResult = schemaErrorLookup(errors, _fields, previousErrorLookupResult.name || name);
          error = errorLookupResult.error;
          name = errorLookupResult.name;
          isValid = isEmptyObject(errors);
        }
      } else {
        _updateIsValidating([name], true);
        error = (await validateField(field, _names.disabled, _formValues, shouldDisplayAllAssociatedErrors, _options.shouldUseNativeValidation))[name];
        _updateIsValidating([name]);
        _updateIsFieldValueUpdated(fieldValue);
        if (isFieldValueUpdated) {
          if (error) {
            isValid = false;
          } else if (_proxyFormState.isValid || _proxySubscribeFormState.isValid) {
            isValid = await executeBuiltInValidation({
              fields: _fields,
              onlyCheckValid: true,
              name,
              eventType: event.type
            });
          }
        }
      }
      if (isFieldValueUpdated) {
        field._f.deps && (!Array.isArray(field._f.deps) || field._f.deps.length > 0) && trigger(field._f.deps);
        shouldRenderByError(name, isValid, error, fieldState);
      }
    }
  };
  const _focusInput = (ref, key) => {
    if (get(_formState.errors, key) && ref.focus) {
      ref.focus();
      return 1;
    }
    return;
  };
  const trigger = async (name, options = {}) => {
    let isValid;
    let validationResult;
    const fieldNames = convertToArrayPayload(name);
    if (_options.resolver) {
      const errors = await executeSchemaAndUpdateState(isUndefined(name) ? name : fieldNames);
      isValid = isEmptyObject(errors);
      validationResult = name ? !fieldNames.some((name2) => get(errors, name2)) : isValid;
    } else if (name) {
      validationResult = (await Promise.all(fieldNames.map(async (fieldName) => {
        const field = get(_fields, fieldName);
        return await executeBuiltInValidation({
          fields: field && field._f ? { [fieldName]: field } : field,
          eventType: EVENTS.TRIGGER
        });
      }))).every(Boolean);
      !(!validationResult && !_formState.isValid) && _setValid();
    } else {
      validationResult = isValid = await executeBuiltInValidation({
        fields: _fields,
        name,
        eventType: EVENTS.TRIGGER
      });
    }
    _subjects.state.next({
      ...!isString(name) || (_proxyFormState.isValid || _proxySubscribeFormState.isValid) && isValid !== _formState.isValid ? {} : { name },
      ..._options.resolver || !name ? { isValid } : {},
      errors: _formState.errors
    });
    options.shouldFocus && !validationResult && iterateFieldsByAction(_fields, _focusInput, name ? fieldNames : _names.mount);
    return validationResult;
  };
  const getValues = (fieldNames, config) => {
    let values = {
      ..._state.mount ? _formValues : _defaultValues
    };
    if (config) {
      values = extractFormValues(config.dirtyFields ? _formState.dirtyFields : _formState.touchedFields, values);
    }
    return isUndefined(fieldNames) ? values : isString(fieldNames) ? get(values, fieldNames) : fieldNames.map((name) => get(values, name));
  };
  const getFieldState = (name, formState) => ({
    invalid: !!get((formState || _formState).errors, name),
    isDirty: !!get((formState || _formState).dirtyFields, name),
    error: get((formState || _formState).errors, name),
    isValidating: !!get(_formState.validatingFields, name),
    isTouched: !!get((formState || _formState).touchedFields, name)
  });
  const clearErrors = (name) => {
    const names = name ? convertToArrayPayload(name) : void 0;
    names === null || names === void 0 ? void 0 : names.forEach((inputName) => unset(_formState.errors, inputName));
    if (names) {
      names.forEach((inputName) => {
        _subjects.state.next({
          name: inputName,
          errors: _formState.errors
        });
      });
    } else {
      _subjects.state.next({
        errors: {}
      });
    }
  };
  const setError = (name, error, options) => {
    const ref = (get(_fields, name, { _f: {} })._f || {}).ref;
    const currentError = get(_formState.errors, name) || {};
    const { ref: currentRef, message, type, ...restOfErrorTree } = currentError;
    set(_formState.errors, name, {
      ...restOfErrorTree,
      ...error,
      ref
    });
    _subjects.state.next({
      name,
      errors: _formState.errors,
      isValid: false
    });
    options && options.shouldFocus && ref && ref.focus && ref.focus();
  };
  const watch = (name, defaultValue) => isFunction(name) ? _subjects.state.subscribe({
    next: (payload) => "values" in payload && name(_getWatch(void 0, defaultValue), payload)
  }) : _getWatch(name, defaultValue, true);
  const _subscribe = (props2) => _subjects.state.subscribe({
    next: (formState) => {
      if (shouldSubscribeByName(props2.name, formState.name, props2.exact) && shouldRenderFormState(formState, props2.formState || _proxyFormState, _setFormState, props2.reRenderRoot)) {
        props2.callback({
          values: { ..._formValues },
          ..._formState,
          ...formState,
          defaultValues: _defaultValues
        });
      }
    }
  }).unsubscribe;
  const subscribe = (props2) => {
    _state.mount = true;
    _proxySubscribeFormState = {
      ..._proxySubscribeFormState,
      ...props2.formState
    };
    return _subscribe({
      ...props2,
      formState: {
        ...defaultProxyFormState,
        ...props2.formState
      }
    });
  };
  const unregister = (name, options = {}) => {
    for (const fieldName of name ? convertToArrayPayload(name) : _names.mount) {
      _names.mount.delete(fieldName);
      _names.array.delete(fieldName);
      if (!options.keepValue) {
        unset(_fields, fieldName);
        unset(_formValues, fieldName);
      }
      !options.keepError && unset(_formState.errors, fieldName);
      !options.keepDirty && unset(_formState.dirtyFields, fieldName);
      !options.keepTouched && unset(_formState.touchedFields, fieldName);
      !options.keepIsValidating && unset(_formState.validatingFields, fieldName);
      !_options.shouldUnregister && !options.keepDefaultValue && unset(_defaultValues, fieldName);
    }
    _subjects.state.next({
      values: cloneObject(_formValues)
    });
    _subjects.state.next({
      ..._formState,
      ...!options.keepDirty ? {} : { isDirty: _getDirty() }
    });
    !options.keepIsValid && _setValid();
  };
  const _setDisabledField = ({ disabled, name }) => {
    if (isBoolean(disabled) && _state.mount || !!disabled || _names.disabled.has(name)) {
      const wasDisabled = _names.disabled.has(name);
      const isDisabled = !!disabled;
      const disabledStateChanged = wasDisabled !== isDisabled;
      disabled ? _names.disabled.add(name) : _names.disabled.delete(name);
      disabledStateChanged && _state.mount && !_state.action && _setValid();
    }
  };
  const register = (name, options = {}) => {
    let field = get(_fields, name);
    const disabledIsDefined = isBoolean(options.disabled) || isBoolean(_options.disabled);
    set(_fields, name, {
      ...field || {},
      _f: {
        ...field && field._f ? field._f : { ref: { name } },
        name,
        mount: true,
        ...options
      }
    });
    _names.mount.add(name);
    if (field) {
      _setDisabledField({
        disabled: isBoolean(options.disabled) ? options.disabled : _options.disabled,
        name
      });
    } else {
      updateValidAndValue(name, true, options.value);
    }
    return {
      ...disabledIsDefined ? { disabled: options.disabled || _options.disabled } : {},
      ..._options.progressive ? {
        required: !!options.required,
        min: getRuleValue(options.min),
        max: getRuleValue(options.max),
        minLength: getRuleValue(options.minLength),
        maxLength: getRuleValue(options.maxLength),
        pattern: getRuleValue(options.pattern)
      } : {},
      name,
      onChange,
      onBlur: onChange,
      ref: (ref) => {
        if (ref) {
          register(name, options);
          field = get(_fields, name);
          const fieldRef = isUndefined(ref.value) ? ref.querySelectorAll ? ref.querySelectorAll("input,select,textarea")[0] || ref : ref : ref;
          const radioOrCheckbox = isRadioOrCheckbox(fieldRef);
          const refs = field._f.refs || [];
          if (radioOrCheckbox ? refs.find((option) => option === fieldRef) : fieldRef === field._f.ref) {
            return;
          }
          set(_fields, name, {
            _f: {
              ...field._f,
              ...radioOrCheckbox ? {
                refs: [
                  ...refs.filter(live),
                  fieldRef,
                  ...Array.isArray(get(_defaultValues, name)) ? [{}] : []
                ],
                ref: { type: fieldRef.type, name }
              } : { ref: fieldRef }
            }
          });
          updateValidAndValue(name, false, void 0, fieldRef);
        } else {
          field = get(_fields, name, {});
          if (field._f) {
            field._f.mount = false;
          }
          (_options.shouldUnregister || options.shouldUnregister) && !(isNameInFieldArray(_names.array, name) && _state.action) && _names.unMount.add(name);
        }
      }
    };
  };
  const _focusError = () => _options.shouldFocusError && iterateFieldsByAction(_fields, _focusInput, _names.mount);
  const _disableForm = (disabled) => {
    if (isBoolean(disabled)) {
      _subjects.state.next({ disabled });
      iterateFieldsByAction(_fields, (ref, name) => {
        const currentField = get(_fields, name);
        if (currentField) {
          ref.disabled = currentField._f.disabled || disabled;
          if (Array.isArray(currentField._f.refs)) {
            currentField._f.refs.forEach((inputRef) => {
              inputRef.disabled = currentField._f.disabled || disabled;
            });
          }
        }
      }, 0, false);
    }
  };
  const handleSubmit = (onValid, onInvalid) => async (e) => {
    let onValidError = void 0;
    if (e) {
      e.preventDefault && e.preventDefault();
      e.persist && e.persist();
    }
    let fieldValues = cloneObject(_formValues);
    _subjects.state.next({
      isSubmitting: true
    });
    if (_options.resolver) {
      const { errors, values } = await _runSchema();
      _updateIsValidating();
      _formState.errors = errors;
      fieldValues = cloneObject(values);
    } else {
      await executeBuiltInValidation({
        fields: _fields,
        eventType: EVENTS.SUBMIT
      });
    }
    if (_names.disabled.size) {
      for (const name of _names.disabled) {
        unset(fieldValues, name);
      }
    }
    unset(_formState.errors, ROOT_ERROR_TYPE);
    if (isEmptyObject(_formState.errors)) {
      _subjects.state.next({
        errors: {}
      });
      try {
        await onValid(fieldValues, e);
      } catch (error) {
        onValidError = error;
      }
    } else {
      if (onInvalid) {
        await onInvalid({ ..._formState.errors }, e);
      }
      _focusError();
      setTimeout(_focusError);
    }
    _subjects.state.next({
      isSubmitted: true,
      isSubmitting: false,
      isSubmitSuccessful: isEmptyObject(_formState.errors) && !onValidError,
      submitCount: _formState.submitCount + 1,
      errors: _formState.errors
    });
    if (onValidError) {
      throw onValidError;
    }
  };
  const resetField = (name, options = {}) => {
    if (get(_fields, name)) {
      if (isUndefined(options.defaultValue)) {
        setValue(name, cloneObject(get(_defaultValues, name)));
      } else {
        setValue(name, options.defaultValue);
        set(_defaultValues, name, cloneObject(options.defaultValue));
      }
      if (!options.keepTouched) {
        unset(_formState.touchedFields, name);
      }
      if (!options.keepDirty) {
        unset(_formState.dirtyFields, name);
        _formState.isDirty = options.defaultValue ? _getDirty(name, cloneObject(get(_defaultValues, name))) : _getDirty();
      }
      if (!options.keepError) {
        unset(_formState.errors, name);
        _proxyFormState.isValid && _setValid();
      }
      _subjects.state.next({ ..._formState });
    }
  };
  const _reset = (formValues, keepStateOptions = {}) => {
    const updatedValues = formValues ? cloneObject(formValues) : _defaultValues;
    const cloneUpdatedValues = cloneObject(updatedValues);
    const isEmptyResetValues = isEmptyObject(formValues);
    const values = isEmptyResetValues ? _defaultValues : cloneUpdatedValues;
    if (!keepStateOptions.keepDefaultValues) {
      _defaultValues = updatedValues;
    }
    if (!keepStateOptions.keepValues) {
      if (keepStateOptions.keepDirtyValues) {
        const fieldsToCheck = /* @__PURE__ */ new Set([
          ..._names.mount,
          ...Object.keys(getDirtyFields(_defaultValues, _formValues))
        ]);
        for (const fieldName of Array.from(fieldsToCheck)) {
          const isDirty = get(_formState.dirtyFields, fieldName);
          const existingValue = get(_formValues, fieldName);
          const newValue = get(values, fieldName);
          if (isDirty && !isUndefined(existingValue)) {
            set(values, fieldName, existingValue);
          } else if (!isDirty && !isUndefined(newValue)) {
            setValue(fieldName, newValue);
          }
        }
      } else {
        if (isWeb && isUndefined(formValues)) {
          for (const name of _names.mount) {
            const field = get(_fields, name);
            if (field && field._f) {
              const fieldReference = Array.isArray(field._f.refs) ? field._f.refs[0] : field._f.ref;
              if (isHTMLElement(fieldReference)) {
                const form = fieldReference.closest("form");
                if (form) {
                  form.reset();
                  break;
                }
              }
            }
          }
        }
        if (keepStateOptions.keepFieldsRef) {
          for (const fieldName of _names.mount) {
            setValue(fieldName, get(values, fieldName));
          }
        } else {
          _fields = {};
        }
      }
      _formValues = _options.shouldUnregister ? keepStateOptions.keepDefaultValues ? cloneObject(_defaultValues) : {} : cloneObject(values);
      _subjects.array.next({
        values: { ...values }
      });
      _subjects.state.next({
        values: { ...values }
      });
    }
    _names = {
      mount: keepStateOptions.keepDirtyValues ? _names.mount : /* @__PURE__ */ new Set(),
      unMount: /* @__PURE__ */ new Set(),
      array: /* @__PURE__ */ new Set(),
      disabled: /* @__PURE__ */ new Set(),
      watch: /* @__PURE__ */ new Set(),
      watchAll: false,
      focus: ""
    };
    _state.mount = !_proxyFormState.isValid || !!keepStateOptions.keepIsValid || !!keepStateOptions.keepDirtyValues || !_options.shouldUnregister && !isEmptyObject(values);
    _state.watch = !!_options.shouldUnregister;
    _state.keepIsValid = !!keepStateOptions.keepIsValid;
    _state.action = false;
    if (!keepStateOptions.keepErrors) {
      _formState.errors = {};
    }
    _subjects.state.next({
      submitCount: keepStateOptions.keepSubmitCount ? _formState.submitCount : 0,
      isDirty: isEmptyResetValues ? false : keepStateOptions.keepDirty ? _formState.isDirty : !!(keepStateOptions.keepDefaultValues && !deepEqual(formValues, _defaultValues)),
      isSubmitted: keepStateOptions.keepIsSubmitted ? _formState.isSubmitted : false,
      dirtyFields: isEmptyResetValues ? {} : keepStateOptions.keepDirtyValues ? keepStateOptions.keepDefaultValues && _formValues ? getDirtyFields(_defaultValues, _formValues) : _formState.dirtyFields : keepStateOptions.keepDefaultValues && formValues ? getDirtyFields(_defaultValues, formValues) : keepStateOptions.keepDirty ? _formState.dirtyFields : {},
      touchedFields: keepStateOptions.keepTouched ? _formState.touchedFields : {},
      errors: keepStateOptions.keepErrors ? _formState.errors : {},
      isSubmitSuccessful: keepStateOptions.keepIsSubmitSuccessful ? _formState.isSubmitSuccessful : false,
      isSubmitting: false,
      defaultValues: _defaultValues
    });
  };
  const reset = (formValues, keepStateOptions) => _reset(isFunction(formValues) ? formValues(_formValues) : formValues, { ..._options.resetOptions, ...keepStateOptions });
  const setFocus = (name, options = {}) => {
    const field = get(_fields, name);
    const fieldReference = field && field._f;
    if (fieldReference) {
      const fieldRef = fieldReference.refs ? fieldReference.refs[0] : fieldReference.ref;
      if (fieldRef.focus) {
        setTimeout(() => {
          fieldRef.focus();
          options.shouldSelect && isFunction(fieldRef.select) && fieldRef.select();
        });
      }
    }
  };
  const _setFormState = (updatedFormState) => {
    _formState = {
      ..._formState,
      ...updatedFormState
    };
  };
  const _resetDefaultValues = () => isFunction(_options.defaultValues) && _options.defaultValues().then((values) => {
    reset(values, _options.resetOptions);
    _subjects.state.next({
      isLoading: false
    });
  });
  const methods = {
    control: {
      register,
      unregister,
      getFieldState,
      handleSubmit,
      setError,
      _subscribe,
      _runSchema,
      _updateIsValidating,
      _focusError,
      _getWatch,
      _getDirty,
      _setValid,
      _setFieldArray,
      _setDisabledField,
      _setErrors,
      _getFieldArray,
      _reset,
      _resetDefaultValues,
      _removeUnmounted,
      _disableForm,
      _subjects,
      _proxyFormState,
      get _fields() {
        return _fields;
      },
      get _formValues() {
        return _formValues;
      },
      get _state() {
        return _state;
      },
      set _state(value) {
        _state = value;
      },
      get _defaultValues() {
        return _defaultValues;
      },
      get _names() {
        return _names;
      },
      set _names(value) {
        _names = value;
      },
      get _formState() {
        return _formState;
      },
      get _options() {
        return _options;
      },
      set _options(value) {
        _options = {
          ..._options,
          ...value
        };
      }
    },
    subscribe,
    trigger,
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    resetField,
    clearErrors,
    unregister,
    setError,
    setFocus,
    getFieldState
  };
  return {
    ...methods,
    formControl: methods
  };
}
function useForm(props = {}) {
  const _formControl = React.useRef(void 0);
  const _values = React.useRef(void 0);
  const [formState, updateFormState] = React.useState({
    isDirty: false,
    isValidating: false,
    isLoading: isFunction(props.defaultValues),
    isSubmitted: false,
    isSubmitting: false,
    isSubmitSuccessful: false,
    isValid: false,
    submitCount: 0,
    dirtyFields: {},
    touchedFields: {},
    validatingFields: {},
    errors: props.errors || {},
    disabled: props.disabled || false,
    isReady: false,
    defaultValues: isFunction(props.defaultValues) ? void 0 : props.defaultValues
  });
  if (!_formControl.current) {
    if (props.formControl) {
      _formControl.current = {
        ...props.formControl,
        formState
      };
      if (props.defaultValues && !isFunction(props.defaultValues)) {
        props.formControl.reset(props.defaultValues, props.resetOptions);
      }
    } else {
      const { formControl, ...rest } = createFormControl(props);
      _formControl.current = {
        ...rest,
        formState
      };
    }
  }
  const control = _formControl.current.control;
  control._options = props;
  useIsomorphicLayoutEffect(() => {
    const sub = control._subscribe({
      formState: control._proxyFormState,
      callback: () => updateFormState({ ...control._formState }),
      reRenderRoot: true
    });
    updateFormState((data) => ({
      ...data,
      isReady: true
    }));
    control._formState.isReady = true;
    return sub;
  }, [control]);
  React.useEffect(() => control._disableForm(props.disabled), [control, props.disabled]);
  React.useEffect(() => {
    if (props.mode) {
      control._options.mode = props.mode;
    }
    if (props.reValidateMode) {
      control._options.reValidateMode = props.reValidateMode;
    }
  }, [control, props.mode, props.reValidateMode]);
  React.useEffect(() => {
    if (props.errors) {
      control._setErrors(props.errors);
      control._focusError();
    }
  }, [control, props.errors]);
  React.useEffect(() => {
    props.shouldUnregister && control._subjects.state.next({
      values: control._getWatch()
    });
  }, [control, props.shouldUnregister]);
  React.useEffect(() => {
    if (control._proxyFormState.isDirty) {
      const isDirty = control._getDirty();
      if (isDirty !== formState.isDirty) {
        control._subjects.state.next({
          isDirty
        });
      }
    }
  }, [control, formState.isDirty]);
  React.useEffect(() => {
    var _a;
    if (props.values && !deepEqual(props.values, _values.current)) {
      control._reset(props.values, {
        keepFieldsRef: true,
        ...control._options.resetOptions
      });
      if (!((_a = control._options.resetOptions) === null || _a === void 0 ? void 0 : _a.keepIsValid)) {
        control._setValid();
      }
      _values.current = props.values;
      updateFormState((state) => ({ ...state }));
    } else {
      control._resetDefaultValues();
    }
  }, [control, props.values]);
  React.useEffect(() => {
    if (!control._state.mount) {
      control._setValid();
      control._state.mount = true;
    }
    if (control._state.watch) {
      control._state.watch = false;
      control._subjects.state.next({ ...control._formState });
    }
    control._removeUnmounted();
  });
  _formControl.current.formState = React.useMemo(() => getProxyFormState(formState, control), [control, formState]);
  return _formControl.current;
}
function useCreateListing() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ listing, files, onImageProgress }) => {
      if (!actor) throw new Error("Actor not available");
      const created = await actor.createListing(listing);
      for (let i = 0; i < files.length; i++) {
        const uploadable = files[i];
        const arrayBuffer = await uploadable.file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        const blob = ExternalBlob.fromBytes(bytes).withUploadProgress(
          (percentage) => {
            onImageProgress(uploadable.id, percentage);
          }
        );
        const addImageArgs = {
          order: BigInt(i),
          blob,
          listingId: created.id,
          altText: uploadable.file.name
        };
        await actor.addImage(addImageArgs);
        onImageProgress(uploadable.id, 100);
      }
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    }
  });
}
const VALID_CATEGORIES = [
  "Appliances",
  "Automotive",
  "Baby & Kids",
  "Books & Magazines",
  "Clothing & Shoes",
  "Collectibles",
  "Electronics & Media",
  "Furniture",
  "Home & Garden",
  "Jewelry & Accessories",
  "Tools & Machinery",
  "Office Supplies",
  "Services"
];
const VALID_CONDITIONS = [
  "New",
  "Used — Good",
  "Used — Fair",
  "Used — Normal Wear"
];
const CONDITION_MAP = {
  new: "New",
  "used — good": "Used — Good",
  "used - good": "Used — Good",
  "used--good": "Used — Good",
  "used -- good": "Used — Good",
  good: "Used — Good",
  "like new": "Used — Good",
  "used — fair": "Used — Fair",
  "used - fair": "Used — Fair",
  "used--fair": "Used — Fair",
  "used -- fair": "Used — Fair",
  fair: "Used — Fair",
  "used — normal wear": "Used — Normal Wear",
  "used - normal wear": "Used — Normal Wear",
  "used--normal wear": "Used — Normal Wear",
  "used -- normal wear": "Used — Normal Wear",
  "normal wear": "Used — Normal Wear",
  worn: "Used — Normal Wear",
  used: "Used — Normal Wear",
  acceptable: "Used — Fair"
};
function normaliseCategory(raw) {
  if (!raw) return "";
  const trimmed = raw.trim();
  const exact = VALID_CATEGORIES.find(
    (c) => c.toLowerCase() === trimmed.toLowerCase()
  );
  if (exact) return exact;
  const lower = trimmed.toLowerCase();
  if (lower.includes("electron") || lower.includes("media") || lower.includes("phone") || lower.includes("computer") || lower.includes("tech"))
    return "Electronics & Media";
  if (lower.includes("appli") || lower.includes("washer") || lower.includes("fridge") || lower.includes("microwave"))
    return "Appliances";
  if (lower.includes("auto") || lower.includes("car") || lower.includes("truck") || lower.includes("vehicle"))
    return "Automotive";
  if (lower.includes("baby") || lower.includes("kid") || lower.includes("child") || lower.includes("toy"))
    return "Baby & Kids";
  if (lower.includes("book") || lower.includes("magazine") || lower.includes("novel"))
    return "Books & Magazines";
  if (lower.includes("cloth") || lower.includes("shoe") || lower.includes("fashion") || lower.includes("wear") || lower.includes("apparel"))
    return "Clothing & Shoes";
  if (lower.includes("collect") || lower.includes("antique") || lower.includes("art") || lower.includes("card"))
    return "Collectibles";
  if (lower.includes("furni") || lower.includes("sofa") || lower.includes("couch") || lower.includes("chair") || lower.includes("table") || lower.includes("desk") || lower.includes("bed"))
    return "Furniture";
  if (lower.includes("garden") || lower.includes("home") || lower.includes("decor"))
    return "Home & Garden";
  if (lower.includes("jewel") || lower.includes("watch") || lower.includes("accessory") || lower.includes("accessories") || lower.includes("bag"))
    return "Jewelry & Accessories";
  if (lower.includes("tool") || lower.includes("machinery") || lower.includes("equipment") || lower.includes("mower"))
    return "Tools & Machinery";
  if (lower.includes("office") || lower.includes("supply") || lower.includes("supplies") || lower.includes("printer"))
    return "Office Supplies";
  if (lower.includes("service")) return "Services";
  return "";
}
function normaliseCondition(raw) {
  if (!raw) return "";
  const lower = raw.trim().toLowerCase();
  if (CONDITION_MAP[lower]) return CONDITION_MAP[lower];
  const exact = VALID_CONDITIONS.find((c) => c.toLowerCase() === lower);
  if (exact) return exact;
  if (lower.includes("new")) return "New";
  if (lower.includes("good")) return "Used — Good";
  if (lower.includes("fair")) return "Used — Fair";
  if (lower.includes("normal") || lower.includes("wear"))
    return "Used — Normal Wear";
  return "";
}
async function resizeImageToBase64(file, maxPx = 1024) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const { width, height } = img;
      const scale = Math.min(1, maxPx / Math.max(width, height));
      const w = Math.round(width * scale);
      const h = Math.round(height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas 2D context unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      const base64 = dataUrl.split(",")[1] ?? "";
      resolve(base64);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image for resizing"));
    };
    img.src = objectUrl;
  });
}
function parseOcrResponse(raw) {
  if (raw && typeof raw === "object" && "__kind__" in raw) {
    if (raw.__kind__ === "ok") {
      return { data: raw.ok, error: null };
    }
    if (raw.__kind__ === "err") {
      return { data: null, error: raw.err };
    }
  }
  if (raw && typeof raw === "object" && "title" in raw) {
    return { data: raw, error: null };
  }
  return { data: null, error: "Unexpected response shape from OCR backend" };
}
function formatOcrError(raw) {
  if (raw.includes("cycles") || raw.includes("http_request")) {
    return `OCR scan failed: ${raw}`;
  }
  if (raw.includes("429") || raw.toLowerCase().includes("quota")) {
    return `OCR rate limit reached — try again in a minute. (${raw})`;
  }
  if (raw.includes("403") || raw.toLowerCase().includes("api key")) {
    return `OCR API key error — check your Gemini key in admin Settings. (${raw})`;
  }
  if (raw.toLowerCase().includes("not configured") || raw.toLowerCase().includes("api key not")) {
    return raw;
  }
  return raw;
}
function usePhotoOCR() {
  const { actor, isFetching } = useActor(createActor);
  const [isProcessing, setIsProcessing] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  async function extractFromImage(file) {
    var _a, _b, _c;
    setIsProcessing(true);
    setError(null);
    const fail = (msg) => {
      const formatted = formatOcrError(msg);
      setError(formatted);
      return { error: formatted };
    };
    try {
      const base64 = await resizeImageToBase64(file, 1024);
      if (!actor || isFetching) {
        return fail("Backend not ready. Please try again in a moment.");
      }
      const raw = await actor.ocrScanImage(base64);
      console.log("[OCR] Backend response:", JSON.stringify(raw));
      const { data, error: backendError } = parseOcrResponse(raw);
      if (backendError || !data) {
        return fail(
          backendError ?? "OCR returned no data. Try a clearer screenshot."
        );
      }
      const allEmpty = !data.title && !data.price && !data.description && !data.category && !data.condition && !data.brand;
      if (allEmpty) {
        return fail(
          "No listing text found in this image. Try a screenshot that shows the full listing."
        );
      }
      const category = normaliseCategory(data.category ?? "");
      const condition = normaliseCondition(data.condition ?? "");
      const rawPrice = (data.price ?? "").replace(/[^0-9.,]/g, "").trim();
      return {
        title: ((_a = data.title) == null ? void 0 : _a.trim()) || void 0,
        price: rawPrice || void 0,
        description: ((_b = data.description) == null ? void 0 : _b.trim()) || void 0,
        category: category || void 0,
        condition: condition || void 0,
        brand: ((_c = data.brand) == null ? void 0 : _c.trim()) || void 0
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to process image";
      return fail(message);
    } finally {
      setIsProcessing(false);
    }
  }
  function reset() {
    setError(null);
  }
  return { extractFromImage, isProcessing, error, reset };
}
const CATEGORY_KEYWORDS = {
  Electronics: [
    "phone",
    "laptop",
    "computer",
    "tv",
    "monitor",
    "tablet",
    "ipad",
    "iphone",
    "android",
    "samsung",
    "apple",
    "xbox",
    "playstation",
    "nintendo",
    "camera",
    "speaker",
    "headphone",
    "airpod",
    "keyboard",
    "mouse",
    "printer",
    "router",
    "gaming",
    "console",
    "charger",
    "cable",
    "electronic",
    "device",
    "tech"
  ],
  Furniture: [
    "sofa",
    "couch",
    "chair",
    "table",
    "desk",
    "bed",
    "dresser",
    "bookshelf",
    "shelf",
    "cabinet",
    "drawer",
    "furniture",
    "ottoman",
    "recliner",
    "mattress",
    "nightstand",
    "wardrobe",
    "bench",
    "stool"
  ],
  Decor: [
    "lamp",
    "rug",
    "art",
    "painting",
    "picture",
    "frame",
    "vase",
    "curtain",
    "mirror",
    "plant",
    "decor",
    "decoration",
    "candle",
    "pillow",
    "throw",
    "wall",
    "vintage",
    "antique"
  ],
  Cars: [
    "car",
    "truck",
    "suv",
    "van",
    "vehicle",
    "auto",
    "honda",
    "toyota",
    "ford",
    "chevy",
    "chevrolet",
    "bmw",
    "mercedes",
    "jeep",
    "dodge",
    "nissan",
    "hyundai",
    "kia",
    "miles",
    "mileage",
    "engine",
    "transmission",
    "sedan",
    "pickup",
    "delorean"
  ],
  Appliances: [
    "washer",
    "dryer",
    "fridge",
    "refrigerator",
    "dishwasher",
    "microwave",
    "oven",
    "stove",
    "blender",
    "vacuum",
    "appliance",
    "freezer",
    "air conditioner",
    "ac unit",
    "heater",
    "fan",
    "toaster",
    "coffee maker"
  ],
  Clothes: [
    "shirt",
    "pants",
    "jeans",
    "dress",
    "jacket",
    "coat",
    "shoes",
    "boots",
    "sneakers",
    "hoodie",
    "sweater",
    "shorts",
    "skirt",
    "clothing",
    "clothes",
    "outfit",
    "wear",
    "size",
    "brand",
    "fashion",
    "handbag",
    "purse",
    "hat",
    "cap"
  ]
};
function guessCategory(text) {
  const lower = text.toLowerCase();
  let bestCat = "";
  let bestScore = 0;
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = keywords.filter((kw) => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestCat = cat;
    }
  }
  return bestScore > 0 ? bestCat : "";
}
function extractPrice(text) {
  const patterns = [
    /\$\s*([0-9,]+(?:\.[0-9]{1,2})?)/,
    /([0-9,]+(?:\.[0-9]{1,2})?)\s*(?:dollars?|usd)/i,
    /price[:\s]+\$?\s*([0-9,]+(?:\.[0-9]{1,2})?)/i,
    /asking[:\s]+\$?\s*([0-9,]+(?:\.[0-9]{1,2})?)/i
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].replace(/,/g, "");
  }
  if (/\bfree\b/i.test(text)) return "Free";
  return "";
}
const SKIP_PREFIXES = [
  "price:",
  "description:",
  "category:",
  "condition:",
  "seller:",
  "location:",
  "posted",
  "listed",
  "facebook",
  "offerup",
  "marketplace",
  "share",
  "save",
  "message",
  "http"
];
function extractTitle(lines) {
  for (const line of lines.slice(0, 6)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const lowerTrimmed = trimmed.toLowerCase();
    if (SKIP_PREFIXES.some((p) => lowerTrimmed.startsWith(p))) continue;
    const titleMatch = trimmed.match(/^(?:title|name|item)[:\s]+(.+)/i);
    if (titleMatch) return titleMatch[1].trim();
    if (trimmed.length >= 3 && trimmed.length <= 120 && !/^\$/.test(trimmed)) {
      return trimmed;
    }
  }
  return "";
}
function extractDescription(text, title, price) {
  let desc = text;
  if (title) desc = desc.replace(title, "").trim();
  if (price && price !== "Free") {
    const escaped = price.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    desc = desc.replace(new RegExp(`\\$?\\s*${escaped}`, "gi"), "").trim();
  }
  desc = desc.replace(
    /^(message|share|save|report|more options?|see more|show more|hide|follow|like|comment).*/gim,
    ""
  ).replace(
    /^(posted|listed|sold|available|pending|price firm|obo|or best offer).*/gim,
    ""
  ).replace(/https?:\/\/\S+/gi, "").replace(/^(seller|buyer|location|category|condition)[:\s].*/gim, "").replace(/\n{3,}/g, "\n\n").trim();
  return desc;
}
function parseListingText(rawText) {
  const text = rawText.trim();
  const lines = text.split(/\r?\n/);
  const title = extractTitle(lines);
  const price = extractPrice(text);
  const category = guessCategory(text);
  const description = extractDescription(text, title, price);
  return {
    title: title || void 0,
    price: price || void 0,
    description: description || void 0,
    category: category || void 0
  };
}
function useSmartPaste() {
  const [state, setState] = reactExports.useState({
    parsedData: null,
    isLoading: false,
    error: null
  });
  async function parse(text) {
    setState({ parsedData: null, isLoading: true, error: null });
    await new Promise((resolve) => setTimeout(resolve, 80));
    const result = parseListingText(text);
    setState({ parsedData: result, isLoading: false, error: null });
    return result;
  }
  function reset() {
    setState({ parsedData: null, isLoading: false, error: null });
  }
  return { ...state, parse, reset };
}
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
function ImageUploadZone({
  files,
  onChange,
  progressMap
}) {
  const [isDragging, setIsDragging] = reactExports.useState(false);
  const inputRef = reactExports.useRef(null);
  const addFiles = reactExports.useCallback(
    (incoming) => {
      const imageFiles = Array.from(incoming).filter(
        (f) => f.type.startsWith("image/")
      );
      const uploadables = imageFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        id: generateId()
      }));
      onChange([...files, ...uploadables]);
    },
    [files, onChange]
  );
  const onDrop = reactExports.useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );
  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const removeFile = (id) => {
    const updated = files.filter((f) => f.id !== id);
    const removed = files.find((f) => f.id === id);
    if (removed) URL.revokeObjectURL(removed.preview);
    onChange(updated);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-ocid": "image-upload-zone", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "aria-label": "Upload images — drag and drop or click to browse",
        onDrop,
        onDragOver,
        onDragLeave,
        onClick: () => {
          var _a;
          return (_a = inputRef.current) == null ? void 0 : _a.click();
        },
        className: [
          "relative cursor-pointer rounded-lg border-2 border-dashed p-8",
          "flex flex-col items-center gap-3 text-center transition-smooth",
          isDragging ? "border-accent bg-accent/5 glow-yellow" : "border-border hover:border-primary/60 hover:bg-primary/5"
        ].join(" "),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: [
                "w-12 h-12 rounded-full flex items-center justify-center transition-smooth",
                isDragging ? "bg-accent/20" : "bg-muted"
              ].join(" "),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Upload,
                {
                  className: isDragging ? "text-accent w-5 h-5" : "text-muted-foreground w-5 h-5"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-foreground text-sm font-medium", children: "Drag & drop images here" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mt-1", children: "or click to browse · PNG, JPG, WEBP supported" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: inputRef,
              type: "file",
              accept: "image/*",
              multiple: true,
              className: "sr-only",
              onChange: (e) => {
                if (e.target.files) addFiles(e.target.files);
                e.target.value = "";
              }
            }
          )
        ]
      }
    ),
    files.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 sm:grid-cols-4 gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: files.map((f) => {
      const prog = progressMap[f.id] ?? 0;
      const isUploading = prog > 0 && prog < 100;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          className: "relative group rounded-md overflow-hidden neon-border-blue aspect-square bg-muted",
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.8 },
          transition: { duration: 0.2 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: f.preview,
                alt: f.file.name,
                className: "w-full h-full object-cover"
              }
            ),
            isUploading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-background/70 flex flex-col items-center justify-center gap-1 p-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-1.5 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  className: "h-full bg-primary rounded-full",
                  initial: { width: 0 },
                  animate: { width: `${prog}%` },
                  transition: { duration: 0.2 }
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary text-xs font-display", children: [
                prog,
                "%"
              ] })
            ] }),
            prog === 100 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded-full bg-primary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { className: "w-3 h-3 text-primary-foreground" }) }) }),
            prog === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "aria-label": `Remove ${f.file.name}`,
                onClick: (e) => {
                  e.stopPropagation();
                  removeFile(f.id);
                },
                className: "absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive/80 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
              }
            )
          ]
        },
        f.id
      );
    }) }) })
  ] });
}
function PanelHeader({ label, icon }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm tracking-widest uppercase text-foreground", children: label })
  ] });
}
function FieldLabel({
  htmlFor,
  children,
  missing
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Label,
    {
      htmlFor,
      className: "font-display text-xs tracking-widest uppercase text-muted-foreground flex items-center gap-2",
      children: [
        children,
        missing && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-destructive tracking-normal normal-case font-normal", children: "← fill in manually" })
      ]
    }
  );
}
function CategoryFields({
  fields,
  onChange,
  showMissing,
  idPrefix
}) {
  const subcategoryOptions = fields.category ? SUBCATEGORY_MAP[fields.category] ?? [] : [];
  const catMissing = showMissing && !fields.category;
  const condMissing = showMissing && !fields.condition;
  function set2(key, val) {
    if (key === "category") {
      onChange({ ...fields, category: val, subcategory: "" });
    } else {
      onChange({ ...fields, [key]: val });
    }
  }
  const selectClass = (missing) => `w-full h-10 rounded-md px-3 text-sm bg-card/50 border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary transition-smooth appearance-none cursor-pointer ${missing ? "border-destructive/70 ring-1 ring-destructive/40" : "border-primary/40"}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(FieldLabel, { htmlFor: `${idPrefix}-category`, missing: catMissing, children: [
        "Category ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "*" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          id: `${idPrefix}-category`,
          value: fields.category,
          onChange: (e) => set2("category", e.target.value),
          required: true,
          "data-ocid": `${idPrefix}-select-category`,
          className: selectClass(catMissing),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", disabled: true, className: "bg-card text-muted-foreground", children: "Select a category…" }),
            CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: cat, className: "bg-card text-foreground", children: cat }, cat))
          ]
        }
      )
    ] }),
    fields.category && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(FieldLabel, { htmlFor: `${idPrefix}-subcategory`, children: [
        "Subcategory",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "(optional)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          id: `${idPrefix}-subcategory`,
          value: fields.subcategory,
          onChange: (e) => set2("subcategory", e.target.value),
          "data-ocid": `${idPrefix}-select-subcategory`,
          className: selectClass(false),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", className: "bg-card text-muted-foreground", children: "Select a subcategory…" }),
            subcategoryOptions.map((sub) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: sub, className: "bg-card text-foreground", children: sub }, sub))
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(FieldLabel, { htmlFor: `${idPrefix}-condition`, missing: condMissing, children: [
        "Condition ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "*" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          id: `${idPrefix}-condition`,
          value: fields.condition,
          onChange: (e) => set2("condition", e.target.value),
          required: true,
          "data-ocid": `${idPrefix}-select-condition`,
          className: selectClass(condMissing),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", disabled: true, className: "bg-card text-muted-foreground", children: "Select condition…" }),
            CONDITIONS.map((cond) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: cond, className: "bg-card text-foreground", children: cond }, cond))
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(FieldLabel, { htmlFor: `${idPrefix}-brand`, children: [
        "Brand ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "(optional)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          id: `${idPrefix}-brand`,
          placeholder: "e.g. Samsung, Nike, Honda",
          value: fields.brand,
          onChange: (e) => set2("brand", e.target.value),
          className: "neon-border-blue bg-card/50 focus:glow-blue-sm transition-smooth",
          "data-ocid": `${idPrefix}-input-brand`
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(FieldLabel, { htmlFor: `${idPrefix}-typeModel`, children: [
        "Type / Model",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "(optional)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          id: `${idPrefix}-typeModel`,
          placeholder: "e.g. Galaxy S24, Air Max 90",
          value: fields.typeModel,
          onChange: (e) => set2("typeModel", e.target.value),
          className: "neon-border-blue bg-card/50 focus:glow-blue-sm transition-smooth",
          "data-ocid": `${idPrefix}-input-type-model`
        }
      )
    ] })
  ] });
}
function PhotoDropZone({ file, preview, onFile }) {
  const inputRef = reactExports.useRef(null);
  const [dragging, setDragging] = reactExports.useState(false);
  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) onFile(dropped);
  }
  function handleChange(e) {
    var _a;
    const picked = (_a = e.target.files) == null ? void 0 : _a[0];
    if (picked) onFile(picked);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      "aria-label": "Upload screenshot",
      onClick: () => {
        var _a;
        return (_a = inputRef.current) == null ? void 0 : _a.click();
      },
      onDragOver: (e) => {
        e.preventDefault();
        setDragging(true);
      },
      onDragLeave: () => setDragging(false),
      onDrop: handleDrop,
      "data-ocid": "photo-drop-zone",
      className: `relative rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-smooth overflow-hidden min-h-[160px] w-full text-left ${dragging ? "border-primary bg-primary/10 glow-blue-sm" : preview ? "border-primary/50 bg-card/30" : "border-primary/30 bg-card/20 hover:border-primary/60 hover:bg-card/40"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: inputRef,
            type: "file",
            accept: "image/*,.pdf,.heic,.heif",
            className: "sr-only",
            onChange: handleChange,
            "data-ocid": "photo-file-input"
          }
        ),
        preview ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: preview,
              alt: "Upload preview",
              className: "w-full h-full object-contain max-h-64 rounded-lg"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-card/60 opacity-0 hover:opacity-100 transition-smooth flex items-center justify-center rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-display tracking-widest uppercase text-primary text-glow-blue", children: "Change Image" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-2 left-2 right-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-mono text-muted-foreground truncate text-center bg-card/80 rounded px-2 py-1", children: file == null ? void 0 : file.name }) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 px-6 py-8 text-center pointer-events-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full border border-primary/40 bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "📸" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs tracking-widest uppercase text-primary text-glow-blue", children: "Take a screenshot of your listing and upload it here" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed max-w-xs", children: "Go to your listing, take a screenshot, then upload it here." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-mono text-muted-foreground/50", children: "Supports JPG, PNG, WebP, HEIC, PDF · Drag & drop or click" })
        ] })
      ]
    }
  );
}
function ParsedPreview({
  title,
  onTitle,
  price,
  onPrice,
  catFields,
  onCatFields,
  description,
  onDescription,
  files,
  onFiles,
  progressMap,
  uploadEnabled,
  isBusy,
  animStep,
  onSave,
  onBack,
  backLabel = "Re-paste",
  successBadge,
  idPrefix
}) {
  const titleMissing = !title.trim();
  const descMissing = !description.trim();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      className: "flex flex-col gap-4",
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
      "data-ocid": "parsed-preview",
      children: [
        successBadge,
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            FieldLabel,
            {
              htmlFor: `${idPrefix}-preview-title`,
              missing: titleMissing,
              children: [
                "Title ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "*" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: `${idPrefix}-preview-title`,
              placeholder: "Enter title…",
              value: title,
              onChange: (e) => onTitle(e.target.value),
              className: `neon-border-blue bg-card/50 focus:glow-blue-sm transition-smooth ${titleMissing ? "border-destructive/70 ring-1 ring-destructive/30" : ""}`,
              "data-ocid": `${idPrefix}-preview-input-title`
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(FieldLabel, { htmlFor: `${idPrefix}-preview-price`, children: [
            "Price ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "(optional)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm pointer-events-none", children: "$" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: `${idPrefix}-preview-price`,
                placeholder: "0.00",
                value: price.replace(/^\$/, ""),
                onChange: (e) => onPrice(
                  e.target.value.replace(/^\$/, "").replace(/[^0-9.,A-Za-z\s]/g, "")
                ),
                className: "neon-border-blue bg-card/50 focus:glow-blue-sm transition-smooth pl-7",
                "data-ocid": `${idPrefix}-preview-input-price`
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CategoryFields,
          {
            fields: catFields,
            onChange: onCatFields,
            showMissing: true,
            idPrefix: `${idPrefix}-preview`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            FieldLabel,
            {
              htmlFor: `${idPrefix}-preview-description`,
              missing: descMissing,
              children: [
                "Description ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "*" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: `${idPrefix}-preview-description`,
              placeholder: "Enter description…",
              rows: 5,
              value: description,
              onChange: (e) => onDescription(e.target.value),
              className: `bg-card/50 focus:glow-blue-sm transition-smooth resize-none text-sm ${descMissing ? "border border-destructive/70 ring-1 ring-destructive/30" : "neon-border-blue"}`,
              "data-ocid": `${idPrefix}-preview-input-description`
            }
          )
        ] }),
        uploadEnabled && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "font-display text-xs tracking-widest uppercase text-muted-foreground", children: [
            "Images ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "(optional)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ImageUploadZone,
            {
              files,
              onChange: onFiles,
              progressMap
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              onClick: onSave,
              disabled: isBusy || !title.trim(),
              "data-ocid": `${idPrefix}-btn-save-preview`,
              className: "flex-1 font-display text-sm py-5 tracking-widest uppercase glow-yellow bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth",
              style: {
                boxShadow: "0 0 16px oklch(0.88 0.19 84 / 0.4), 0 0 32px oklch(0.88 0.19 84 / 0.15)"
              },
              children: animStep === "saving" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-pulse", children: "Saving to timeline…" }) : "Save Listing"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: onBack,
              disabled: isBusy,
              "data-ocid": `${idPrefix}-btn-back-from-preview`,
              className: "px-4 neon-border-blue transition-smooth text-xs font-display tracking-wider uppercase",
              children: backLabel
            }
          )
        ] })
      ]
    }
  );
}
function emptyFields() {
  return {
    category: "",
    subcategory: "",
    condition: "",
    brand: "",
    typeModel: ""
  };
}
function ImportForm({ onCancel }) {
  const navigate = useNavigate();
  const [files, setFiles] = reactExports.useState([]);
  const [progressMap, setProgressMap] = reactExports.useState({});
  const [animStep, setAnimStep] = reactExports.useState("idle");
  const [activeTab, setActiveTab] = reactExports.useState("photo");
  const [photoFile, setPhotoFile] = reactExports.useState(null);
  const [photoPreview, setPhotoPreview] = reactExports.useState(null);
  const [photoShowPreview, setPhotoShowPreview] = reactExports.useState(false);
  const [photoTitle, setPhotoTitle] = reactExports.useState("");
  const [photoPrice, setPhotoPrice] = reactExports.useState("");
  const [photoCatFields, setPhotoCatFields] = reactExports.useState(
    emptyFields()
  );
  const [photoDescription, setPhotoDescription] = reactExports.useState("");
  const [photoOCRError, setPhotoOCRError] = reactExports.useState(null);
  const [pasteText, setPasteText] = reactExports.useState("");
  const [showPreview, setShowPreview] = reactExports.useState(false);
  const [previewTitle, setPreviewTitle] = reactExports.useState("");
  const [previewPrice, setPreviewPrice] = reactExports.useState("");
  const [previewCatFields, setPreviewCatFields] = reactExports.useState(emptyFields());
  const [previewDescription, setPreviewDescription] = reactExports.useState("");
  const [manualPriceDisplay, setManualPriceDisplay] = reactExports.useState("");
  const [manualCatFields, setManualCatFields] = reactExports.useState(
    emptyFields()
  );
  const { uploadEnabled } = useAdminSettingsContext();
  const { mutateAsync: createListingWithImages, isPending } = useCreateListing();
  const { parse: parseText, isLoading: isParsing } = useSmartPaste();
  const {
    extractFromImage,
    isProcessing: isOCRProcessing,
    reset: resetOCR
  } = usePhotoOCR();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      sourceUrl: "",
      category: ""
    }
  });
  function handleManualPriceChange(e) {
    const raw = e.target.value.replace(/^\$/, "").replace(/[^0-9.,]/g, "");
    setManualPriceDisplay(raw);
  }
  function handlePhotoFileSelect(f) {
    setPhotoFile(f);
    setPhotoPreview(URL.createObjectURL(f));
    setPhotoShowPreview(false);
    setPhotoOCRError(null);
    resetOCR();
  }
  const runAnimationSequence = reactExports.useCallback(() => {
    return new Promise((resolve) => {
      setAnimStep("lightning");
      setTimeout(() => {
        setAnimStep("clock");
        setTimeout(() => {
          setAnimStep("car");
          setTimeout(() => {
            setAnimStep("saving");
            resolve();
          }, 600);
        }, 800);
      }, 400);
    });
  }, []);
  async function handlePhotoOCR() {
    if (!photoFile) return;
    setPhotoOCRError(null);
    setAnimStep("lightning");
    setTimeout(() => setAnimStep("clock"), 400);
    setTimeout(() => setAnimStep("idle"), 1100);
    const result = await extractFromImage(photoFile);
    if (result.error) {
      setPhotoOCRError(result.error);
      ue.error(result.error);
      return;
    }
    setPhotoTitle(result.title ?? "");
    setPhotoPrice(result.price ?? "");
    setPhotoCatFields({
      ...emptyFields(),
      category: result.category ?? "",
      condition: result.condition ?? "",
      brand: result.brand ?? ""
    });
    setPhotoDescription(result.description ?? "");
    setPhotoShowPreview(true);
    ue.success("Listing data extracted! Review and save.");
  }
  async function handleSavePhotoPreview() {
    await runAnimationSequence();
    const listingArgs = {
      title: photoTitle,
      description: photoDescription,
      price: photoPrice ? `$${photoPrice.replace(/^\$/, "")}` : void 0,
      sourceUrl: void 0,
      category: encodeCategory(photoCatFields) || void 0
    };
    const onImageProgress = (fileId, progress) => setProgressMap((prev) => ({ ...prev, [fileId]: progress }));
    try {
      const created = await createListingWithImages({
        listing: listingArgs,
        files,
        onImageProgress
      });
      setAnimStep("idle");
      await navigate({ to: `/listing/${created.id.toString()}` });
    } catch {
      setAnimStep("idle");
    }
  }
  async function handleSmartPaste() {
    if (!pasteText.trim()) return;
    setAnimStep("lightning");
    setTimeout(() => setAnimStep("clock"), 400);
    setTimeout(() => setAnimStep("idle"), 1100);
    const result = await parseText(pasteText);
    setPreviewTitle(result.title ?? "");
    setPreviewPrice(result.price ?? "");
    setPreviewCatFields({ ...emptyFields(), category: result.category ?? "" });
    setPreviewDescription(result.description ?? "");
    setShowPreview(true);
  }
  async function handleSavePreview() {
    await runAnimationSequence();
    const listingArgs = {
      title: previewTitle,
      description: previewDescription,
      price: previewPrice ? `$${previewPrice.replace(/^\$/, "")}` : void 0,
      sourceUrl: void 0,
      category: encodeCategory(previewCatFields) || void 0
    };
    const onImageProgress = (fileId, progress) => setProgressMap((prev) => ({ ...prev, [fileId]: progress }));
    try {
      const created = await createListingWithImages({
        listing: listingArgs,
        files,
        onImageProgress
      });
      setAnimStep("idle");
      await navigate({ to: `/listing/${created.id.toString()}` });
    } catch {
      setAnimStep("idle");
    }
  }
  const onManualSubmit = reactExports.useCallback(
    async (values) => {
      await runAnimationSequence();
      const listingArgs = {
        title: values.title,
        description: values.description,
        price: manualPriceDisplay ? `$${manualPriceDisplay}` : void 0,
        sourceUrl: values.sourceUrl || void 0,
        category: encodeCategory(manualCatFields) || void 0
      };
      const onImageProgress = (fileId, progress) => setProgressMap((prev) => ({ ...prev, [fileId]: progress }));
      try {
        const created = await createListingWithImages({
          listing: listingArgs,
          files,
          onImageProgress
        });
        setAnimStep("idle");
        await navigate({ to: `/listing/${created.id.toString()}` });
      } catch {
        setAnimStep("idle");
      }
    },
    [
      runAnimationSequence,
      createListingWithImages,
      files,
      navigate,
      manualPriceDisplay,
      manualCatFields
    ]
  );
  const isBusy = isPending || animStep !== "idle" || isParsing || isOCRProcessing;
  const tabs = [
    { id: "photo", label: "Smart Photo", icon: "📸" },
    { id: "smartpaste", label: "Smart Text", icon: "⚡" },
    { id: "manual", label: "Manual Entry", icon: "✏️" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: animStep === "lightning" && /* @__PURE__ */ jsxRuntimeExports.jsx(LightningAnimation, { active: true }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: animStep === "clock" && /* @__PURE__ */ jsxRuntimeExports.jsx(ClockAnimation, { active: true }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: animStep === "car" && /* @__PURE__ */ jsxRuntimeExports.jsx(CarAnimation, { active: true }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex rounded-lg overflow-hidden border border-primary/20 mb-5",
        role: "tablist",
        "aria-label": "Import method",
        "data-ocid": "import-tab-bar",
        children: tabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": activeTab === tab.id,
            onClick: () => setActiveTab(tab.id),
            "data-ocid": `tab-${tab.id}`,
            className: `flex-1 py-2.5 sm:py-3 text-xs font-display tracking-widest uppercase transition-smooth flex items-center justify-center gap-1.5 border-r border-primary/10 last:border-r-0 ${activeTab === tab.id ? "bg-primary/20 text-primary text-glow-blue" : "bg-card/30 text-muted-foreground hover:bg-card/60 hover:text-foreground"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: tab.icon }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden xs:inline sm:inline", children: tab.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "xs:hidden sm:hidden", children: tab.id === "photo" ? "Photo" : tab.id === "smartpaste" ? "Text" : "Manual" })
            ]
          },
          tab.id
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "import-form", children: [
      activeTab === "photo" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          className: "rounded-xl border border-primary/30 bg-card/60 p-5 flex flex-col gap-4",
          initial: { opacity: 0, y: 6 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3 },
          "data-ocid": "panel-photo",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PanelHeader, { label: "Smart Photo", icon: "📸" }),
            !photoShowPreview ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs leading-relaxed -mt-1", children: "Go to your listing, take a screenshot, then upload it here. Our AI will extract the title, price, description, and category for you." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                PhotoDropZone,
                {
                  file: photoFile,
                  preview: photoPreview,
                  onFile: handlePhotoFileSelect
                }
              ),
              photoOCRError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: -4 },
                  animate: { opacity: 1, y: 0 },
                  className: "flex items-start gap-2 rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive text-sm mt-0.5", children: "⚠" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-destructive text-xs leading-relaxed", children: photoOCRError })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  onClick: handlePhotoOCR,
                  disabled: isBusy || !photoFile,
                  "data-ocid": "btn-photo-ocr",
                  className: "w-full font-display text-sm py-5 tracking-widest uppercase glow-yellow bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth border-accent/70 shadow-lg",
                  style: {
                    boxShadow: "0 0 20px oklch(0.88 0.19 84 / 0.5), 0 0 40px oklch(0.88 0.19 84 / 0.2)"
                  },
                  children: isOCRProcessing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center justify-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-spin text-base", children: "⚙" }),
                    "Reading image…"
                  ] }) : "⚡ Copy Past-e"
                }
              ),
              !photoFile && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-[10px] font-mono text-muted-foreground/50", children: "Upload a screenshot first" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              ParsedPreview,
              {
                title: photoTitle,
                onTitle: setPhotoTitle,
                price: photoPrice,
                onPrice: setPhotoPrice,
                catFields: photoCatFields,
                onCatFields: setPhotoCatFields,
                description: photoDescription,
                onDescription: setPhotoDescription,
                files,
                onFiles: setFiles,
                progressMap,
                uploadEnabled,
                isBusy,
                animStep,
                onSave: handleSavePhotoPreview,
                onBack: () => {
                  setPhotoShowPreview(false);
                  setPhotoFile(null);
                  setPhotoPreview(null);
                },
                backLabel: "New Photo",
                idPrefix: "photo",
                successBadge: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-md bg-accent/10 border border-accent/30 px-3 py-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent text-sm", children: "✓" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-accent text-xs font-display tracking-wide", children: [
                    "Image scanned — review and edit, then save.",
                    (!photoTitle || !photoDescription || !photoCatFields.category) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive ml-2", children: "Fields with red borders need your input." })
                  ] })
                ] })
              }
            )
          ]
        },
        "tab-photo"
      ),
      activeTab === "smartpaste" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          className: "rounded-xl border border-primary/30 bg-card/60 p-5 flex flex-col gap-4",
          initial: { opacity: 0, y: 6 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3 },
          "data-ocid": "panel-smartpaste",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PanelHeader, { label: "Smart Text Paste", icon: "⚡" }),
            !showPreview ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs leading-relaxed -mt-1", children: "Go to your listing, select all text, copy, then paste it here." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "pasteText",
                    className: "font-display text-xs tracking-widest uppercase text-muted-foreground",
                    children: "Paste Listing Text"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "pasteText",
                    placeholder: "Paste the full listing text you copied from Facebook Marketplace, OfferUp, or anywhere else…",
                    rows: 8,
                    value: pasteText,
                    onChange: (e) => setPasteText(e.target.value),
                    className: "neon-border-blue bg-card/40 focus:glow-blue-sm transition-smooth resize-none text-sm",
                    "data-ocid": "input-paste-text"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  onClick: handleSmartPaste,
                  disabled: isBusy || !pasteText.trim(),
                  "data-ocid": "btn-smart-paste",
                  className: "w-full font-display text-sm py-5 tracking-widest uppercase glow-yellow bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth border-accent/70 shadow-lg",
                  style: {
                    boxShadow: "0 0 20px oklch(0.88 0.19 84 / 0.5), 0 0 40px oklch(0.88 0.19 84 / 0.2)"
                  },
                  children: isParsing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center justify-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-spin text-base", children: "⚙" }),
                    "Parsing…"
                  ] }) : "⚡ Copy Past-e"
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              ParsedPreview,
              {
                title: previewTitle,
                onTitle: setPreviewTitle,
                price: previewPrice,
                onPrice: setPreviewPrice,
                catFields: previewCatFields,
                onCatFields: setPreviewCatFields,
                description: previewDescription,
                onDescription: setPreviewDescription,
                files,
                onFiles: setFiles,
                progressMap,
                uploadEnabled,
                isBusy,
                animStep,
                onSave: handleSavePreview,
                onBack: () => {
                  setShowPreview(false);
                  setPasteText("");
                },
                backLabel: "Re-paste",
                idPrefix: "paste",
                successBadge: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-md bg-accent/10 border border-accent/30 px-3 py-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent text-sm", children: "✓" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-accent text-xs font-display tracking-wide", children: "Listing parsed — review and edit, then save." })
                ] })
              }
            )
          ]
        },
        "tab-smartpaste"
      ),
      activeTab === "manual" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          className: "rounded-xl border border-border/40 bg-card/40 p-5 flex flex-col gap-4",
          initial: { opacity: 0, y: 6 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3 },
          "data-ocid": "panel-manual",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PanelHeader, { label: "Manual Entry", icon: "✏️" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "form",
              {
                onSubmit: handleSubmit(onManualSubmit),
                className: "flex flex-col gap-4",
                noValidate: true,
                "data-ocid": "manual-entry-form",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Label,
                      {
                        htmlFor: "manual-title",
                        className: "font-display text-xs tracking-widest uppercase text-muted-foreground",
                        children: [
                          "Title ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "*" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "manual-title",
                        placeholder: "e.g. Vintage 1982 DeLorean — Low Miles",
                        className: "neon-border-blue bg-card/50 focus:glow-blue-sm transition-smooth",
                        "data-ocid": "manual-input-title",
                        ...register("title", {
                          required: "Title is required",
                          minLength: {
                            value: 3,
                            message: "Title must be at least 3 characters"
                          }
                        })
                      }
                    ),
                    errors.title && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-destructive text-xs", role: "alert", children: errors.title.message })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CategoryFields,
                    {
                      fields: manualCatFields,
                      onChange: setManualCatFields,
                      idPrefix: "manual"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Label,
                      {
                        htmlFor: "manual-description",
                        className: "font-display text-xs tracking-widest uppercase text-muted-foreground",
                        children: [
                          "Description ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "*" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Textarea,
                      {
                        id: "manual-description",
                        placeholder: "Full listing description…",
                        rows: 5,
                        className: "neon-border-blue bg-card/50 focus:glow-blue-sm transition-smooth resize-none text-sm",
                        "data-ocid": "manual-input-description",
                        ...register("description", {
                          required: "Description is required",
                          minLength: {
                            value: 10,
                            message: "Description must be at least 10 characters"
                          }
                        })
                      }
                    ),
                    errors.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-destructive text-xs", role: "alert", children: errors.description.message })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Label,
                      {
                        htmlFor: "manual-price",
                        className: "font-display text-xs tracking-widest uppercase text-muted-foreground",
                        children: [
                          "Price",
                          " ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "(optional)" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm pointer-events-none", children: "$" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "manual-price",
                          placeholder: "4,200 or Best Offer",
                          className: "neon-border-blue bg-card/50 focus:glow-blue-sm transition-smooth pl-7",
                          "data-ocid": "manual-input-price",
                          value: manualPriceDisplay,
                          onChange: handleManualPriceChange
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Label,
                      {
                        htmlFor: "manual-sourceUrl",
                        className: "font-display text-xs tracking-widest uppercase text-muted-foreground",
                        children: [
                          "Listing URL",
                          " ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "(optional)" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "manual-sourceUrl",
                        type: "url",
                        placeholder: "https://marketplace.example.com/listing/…",
                        className: "neon-border-blue bg-card/50 focus:glow-blue-sm transition-smooth",
                        "data-ocid": "manual-input-source-url",
                        ...register("sourceUrl", {
                          pattern: {
                            value: /^(https?:\/\/)/,
                            message: "Must be a valid URL starting with http:// or https://"
                          }
                        })
                      }
                    ),
                    errors.sourceUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-destructive text-xs", role: "alert", children: errors.sourceUrl.message })
                  ] }),
                  uploadEnabled && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "font-display text-xs tracking-widest uppercase text-muted-foreground", children: [
                      "Images",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "(optional)" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ImageUploadZone,
                      {
                        files,
                        onChange: setFiles,
                        progressMap
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-1 mt-auto", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "submit",
                        disabled: isBusy,
                        "data-ocid": "btn-submit-manual",
                        className: "flex-1 font-display text-sm py-5 tracking-widest uppercase bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 transition-smooth shadow-md",
                        children: animStep === "saving" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-pulse", children: "Saving to timeline…" }) : "Post Listing"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        variant: "outline",
                        onClick: onCancel,
                        disabled: isBusy,
                        "data-ocid": "btn-cancel-import",
                        className: "px-5 neon-border-blue transition-smooth text-xs font-display tracking-wider uppercase",
                        children: "Cancel"
                      }
                    )
                  ] })
                ]
              }
            )
          ]
        },
        "tab-manual"
      )
    ] })
  ] });
}
function ImportPage() {
  const navigate = useNavigate();
  const { uploadEnabled } = useAdminSettingsContext();
  const handleCancel = () => {
    navigate({ to: "/dashboard" });
  };
  if (!uploadEnabled) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 py-10 w-full text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold text-muted-foreground text-glow-blue mb-3 uppercase tracking-wider", children: "Uploads Disabled" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-muted-foreground", children: "The site administrator has temporarily disabled uploads. Check back later." })
        ]
      }
    ) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full",
      "data-ocid": "import-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            className: "mb-8",
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, ease: "easeOut" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold tracking-wider text-foreground text-glow-blue mb-2", children: "New Listing" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Upload a screenshot, paste listing text, or enter everything manually. Copie Past-e fills in the details. Under 30 seconds." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 h-px w-full bg-gradient-to-r from-primary/60 via-accent/40 to-transparent" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: "bg-card rounded-xl neon-border-blue p-5 sm:p-6 shadow-xl",
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, delay: 0.1, ease: "easeOut" },
            style: {
              boxShadow: "0 0 40px oklch(0.65 0.22 262 / 0.08), 0 8px 32px oklch(0 0 0 / 0.4)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImportForm, { onCancel: handleCancel })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "fixed inset-0 -z-10 opacity-30 pointer-events-none retro-grid",
            style: {
              maskImage: "linear-gradient(to bottom, transparent, oklch(0 0 0 / 0.6))"
            }
          }
        )
      ]
    }
  ) });
}
export {
  ImportPage
};
