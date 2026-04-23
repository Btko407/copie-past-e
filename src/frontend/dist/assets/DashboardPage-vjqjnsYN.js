import { c as createLucideIcon, r as reactExports, u as useNavigate, L as ListingStatus, j as jsxRuntimeExports, m as motion, S as Skeleton, C as Copy, R as RefreshCw, B as Button, X, a as ue, b as useActor, d as useQueryClient, e as useMutation, Z as Zap, f as CircleCheck, g as createActor, P as Platform__1, I as ItemCondition, h as useCheckLowFuelNotification, i as Layout, M as MaintenanceBanner, k as Input } from "./index-lWC1fMpK.js";
import { c as copyText, u as useListingImages, a as useArchiveListing, b as useRestoreListing, d as usePermanentDeleteListing, e as useTogglePin, f as useToggleFavorite, g as useListings, h as useFavoritedListings } from "./copyText-CPCKujva.js";
import { u as useGetMySubscription, a as useGetTiers } from "./useTiers-BWoX94DT.js";
import { C as Check } from "./check-j5UfQD6d.js";
import { A as Archive } from "./archive-CXBoAYxn.js";
import { L as LoaderCircle } from "./loader-circle-IA2cLEZB.js";
import { T as Trash2 } from "./trash-2-BvyAkMKH.js";
import { u as useGetPaymentBanner, a as useDismissPaymentBanner, b as useCreateStripePortalSession } from "./useStripePayments-SmTAHlo5.js";
import { A as AnimatePresence } from "./index-BvC6SmHy.js";
import { C as Calendar, R as RefuelBanner, L as LowFuelWarningBanner } from "./RefuelBanner-IJGHE0Q0.js";
import { T as TimeCircuitsCountdown } from "./TimeCircuitsCountdown-OLMf-AJR.js";
import { U as Upload } from "./upload-Cfz5IfCl.js";
import { c as computeFuelFromExpiry } from "./GasFuelTank-CkdWTC9i.js";
import { P as Plus } from "./plus-BHlKN9JT.js";
import { S as Search } from "./search-CPLNDmov.js";
import "./useBackup-B5GLrNlj.js";
import "./download-CnQb10sO.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
      key: "c3ymky"
    }
  ]
];
const Heart = createLucideIcon("heart", __iconNode);
function toDate(argument) {
  const argStr = Object.prototype.toString.call(argument);
  if (argument instanceof Date || typeof argument === "object" && argStr === "[object Date]") {
    return new argument.constructor(+argument);
  } else if (typeof argument === "number" || argStr === "[object Number]" || typeof argument === "string" || argStr === "[object String]") {
    return new Date(argument);
  } else {
    return /* @__PURE__ */ new Date(NaN);
  }
}
function constructFrom(date, value) {
  if (date instanceof Date) {
    return new date.constructor(value);
  } else {
    return new Date(value);
  }
}
const minutesInMonth = 43200;
const minutesInDay = 1440;
let defaultOptions = {};
function getDefaultOptions() {
  return defaultOptions;
}
function getTimezoneOffsetInMilliseconds(date) {
  const _date = toDate(date);
  const utcDate = new Date(
    Date.UTC(
      _date.getFullYear(),
      _date.getMonth(),
      _date.getDate(),
      _date.getHours(),
      _date.getMinutes(),
      _date.getSeconds(),
      _date.getMilliseconds()
    )
  );
  utcDate.setUTCFullYear(_date.getFullYear());
  return +date - +utcDate;
}
function compareAsc(dateLeft, dateRight) {
  const _dateLeft = toDate(dateLeft);
  const _dateRight = toDate(dateRight);
  const diff = _dateLeft.getTime() - _dateRight.getTime();
  if (diff < 0) {
    return -1;
  } else if (diff > 0) {
    return 1;
  } else {
    return diff;
  }
}
function constructNow(date) {
  return constructFrom(date, Date.now());
}
function differenceInCalendarMonths(dateLeft, dateRight) {
  const _dateLeft = toDate(dateLeft);
  const _dateRight = toDate(dateRight);
  const yearDiff = _dateLeft.getFullYear() - _dateRight.getFullYear();
  const monthDiff = _dateLeft.getMonth() - _dateRight.getMonth();
  return yearDiff * 12 + monthDiff;
}
function getRoundingMethod(method) {
  return (number) => {
    const round = method ? Math[method] : Math.trunc;
    const result = round(number);
    return result === 0 ? 0 : result;
  };
}
function differenceInMilliseconds(dateLeft, dateRight) {
  return +toDate(dateLeft) - +toDate(dateRight);
}
function endOfDay(date) {
  const _date = toDate(date);
  _date.setHours(23, 59, 59, 999);
  return _date;
}
function endOfMonth(date) {
  const _date = toDate(date);
  const month = _date.getMonth();
  _date.setFullYear(_date.getFullYear(), month + 1, 0);
  _date.setHours(23, 59, 59, 999);
  return _date;
}
function isLastDayOfMonth(date) {
  const _date = toDate(date);
  return +endOfDay(_date) === +endOfMonth(_date);
}
function differenceInMonths(dateLeft, dateRight) {
  const _dateLeft = toDate(dateLeft);
  const _dateRight = toDate(dateRight);
  const sign = compareAsc(_dateLeft, _dateRight);
  const difference = Math.abs(
    differenceInCalendarMonths(_dateLeft, _dateRight)
  );
  let result;
  if (difference < 1) {
    result = 0;
  } else {
    if (_dateLeft.getMonth() === 1 && _dateLeft.getDate() > 27) {
      _dateLeft.setDate(30);
    }
    _dateLeft.setMonth(_dateLeft.getMonth() - sign * difference);
    let isLastMonthNotFull = compareAsc(_dateLeft, _dateRight) === -sign;
    if (isLastDayOfMonth(toDate(dateLeft)) && difference === 1 && compareAsc(dateLeft, _dateRight) === 1) {
      isLastMonthNotFull = false;
    }
    result = sign * (difference - Number(isLastMonthNotFull));
  }
  return result === 0 ? 0 : result;
}
function differenceInSeconds(dateLeft, dateRight, options) {
  const diff = differenceInMilliseconds(dateLeft, dateRight) / 1e3;
  return getRoundingMethod(options == null ? void 0 : options.roundingMethod)(diff);
}
const formatDistanceLocale = {
  lessThanXSeconds: {
    one: "less than a second",
    other: "less than {{count}} seconds"
  },
  xSeconds: {
    one: "1 second",
    other: "{{count}} seconds"
  },
  halfAMinute: "half a minute",
  lessThanXMinutes: {
    one: "less than a minute",
    other: "less than {{count}} minutes"
  },
  xMinutes: {
    one: "1 minute",
    other: "{{count}} minutes"
  },
  aboutXHours: {
    one: "about 1 hour",
    other: "about {{count}} hours"
  },
  xHours: {
    one: "1 hour",
    other: "{{count}} hours"
  },
  xDays: {
    one: "1 day",
    other: "{{count}} days"
  },
  aboutXWeeks: {
    one: "about 1 week",
    other: "about {{count}} weeks"
  },
  xWeeks: {
    one: "1 week",
    other: "{{count}} weeks"
  },
  aboutXMonths: {
    one: "about 1 month",
    other: "about {{count}} months"
  },
  xMonths: {
    one: "1 month",
    other: "{{count}} months"
  },
  aboutXYears: {
    one: "about 1 year",
    other: "about {{count}} years"
  },
  xYears: {
    one: "1 year",
    other: "{{count}} years"
  },
  overXYears: {
    one: "over 1 year",
    other: "over {{count}} years"
  },
  almostXYears: {
    one: "almost 1 year",
    other: "almost {{count}} years"
  }
};
const formatDistance$1 = (token, count, options) => {
  let result;
  const tokenValue = formatDistanceLocale[token];
  if (typeof tokenValue === "string") {
    result = tokenValue;
  } else if (count === 1) {
    result = tokenValue.one;
  } else {
    result = tokenValue.other.replace("{{count}}", count.toString());
  }
  if (options == null ? void 0 : options.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return "in " + result;
    } else {
      return result + " ago";
    }
  }
  return result;
};
function buildFormatLongFn(args) {
  return (options = {}) => {
    const width = options.width ? String(options.width) : args.defaultWidth;
    const format = args.formats[width] || args.formats[args.defaultWidth];
    return format;
  };
}
const dateFormats = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
};
const timeFormats = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
const dateTimeFormats = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
const formatLong = {
  date: buildFormatLongFn({
    formats: dateFormats,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats,
    defaultWidth: "full"
  })
};
const formatRelativeLocale = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
};
const formatRelative = (token, _date, _baseDate, _options) => formatRelativeLocale[token];
function buildLocalizeFn(args) {
  return (value, options) => {
    const context = (options == null ? void 0 : options.context) ? String(options.context) : "standalone";
    let valuesArray;
    if (context === "formatting" && args.formattingValues) {
      const defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
      const width = (options == null ? void 0 : options.width) ? String(options.width) : defaultWidth;
      valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
    } else {
      const defaultWidth = args.defaultWidth;
      const width = (options == null ? void 0 : options.width) ? String(options.width) : args.defaultWidth;
      valuesArray = args.values[width] || args.values[defaultWidth];
    }
    const index = args.argumentCallback ? args.argumentCallback(value) : value;
    return valuesArray[index];
  };
}
const eraValues = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
};
const quarterValues = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
};
const monthValues = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ],
  wide: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]
};
const dayValues = {
  narrow: ["S", "M", "T", "W", "T", "F", "S"],
  short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  wide: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]
};
const dayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  }
};
const formattingDayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  }
};
const ordinalNumber = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  const rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
    }
  }
  return number + "th";
};
const localize = {
  ordinalNumber,
  era: buildLocalizeFn({
    values: eraValues,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues,
    defaultFormattingWidth: "wide"
  })
};
function buildMatchFn(args) {
  return (string, options = {}) => {
    const width = options.width;
    const matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
    const matchResult = string.match(matchPattern);
    if (!matchResult) {
      return null;
    }
    const matchedString = matchResult[0];
    const parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
    const key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, (pattern) => pattern.test(matchedString)) : (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I challange you to fix the type
      findKey(parsePatterns, (pattern) => pattern.test(matchedString))
    );
    let value;
    value = args.valueCallback ? args.valueCallback(key) : key;
    value = options.valueCallback ? (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I challange you to fix the type
      options.valueCallback(value)
    ) : value;
    const rest = string.slice(matchedString.length);
    return { value, rest };
  };
}
function findKey(object, predicate) {
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key) && predicate(object[key])) {
      return key;
    }
  }
  return void 0;
}
function findIndex(array, predicate) {
  for (let key = 0; key < array.length; key++) {
    if (predicate(array[key])) {
      return key;
    }
  }
  return void 0;
}
function buildMatchPatternFn(args) {
  return (string, options = {}) => {
    const matchResult = string.match(args.matchPattern);
    if (!matchResult) return null;
    const matchedString = matchResult[0];
    const parseResult = string.match(args.parsePattern);
    if (!parseResult) return null;
    let value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
    value = options.valueCallback ? options.valueCallback(value) : value;
    const rest = string.slice(matchedString.length);
    return { value, rest };
  };
}
const matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
const parseOrdinalNumberPattern = /\d+/i;
const matchEraPatterns = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
};
const parseEraPatterns = {
  any: [/^b/i, /^(a|c)/i]
};
const matchQuarterPatterns = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
};
const parseQuarterPatterns = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
const matchMonthPatterns = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
};
const parseMonthPatterns = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^may/i,
    /^jun/i,
    /^jul/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
const matchDayPatterns = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
};
const parseDayPatterns = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
};
const matchDayPeriodPatterns = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
};
const parseDayPeriodPatterns = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
};
const match = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern,
    parsePattern: parseOrdinalNumberPattern,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns,
    defaultParseWidth: "any"
  })
};
const enUS = {
  code: "en-US",
  formatDistance: formatDistance$1,
  formatLong,
  formatRelative,
  localize,
  match,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function formatDistance(date, baseDate, options) {
  const defaultOptions2 = getDefaultOptions();
  const locale = (options == null ? void 0 : options.locale) ?? defaultOptions2.locale ?? enUS;
  const minutesInAlmostTwoDays = 2520;
  const comparison = compareAsc(date, baseDate);
  if (isNaN(comparison)) {
    throw new RangeError("Invalid time value");
  }
  const localizeOptions = Object.assign({}, options, {
    addSuffix: options == null ? void 0 : options.addSuffix,
    comparison
  });
  let dateLeft;
  let dateRight;
  if (comparison > 0) {
    dateLeft = toDate(baseDate);
    dateRight = toDate(date);
  } else {
    dateLeft = toDate(date);
    dateRight = toDate(baseDate);
  }
  const seconds = differenceInSeconds(dateRight, dateLeft);
  const offsetInSeconds = (getTimezoneOffsetInMilliseconds(dateRight) - getTimezoneOffsetInMilliseconds(dateLeft)) / 1e3;
  const minutes = Math.round((seconds - offsetInSeconds) / 60);
  let months;
  if (minutes < 2) {
    if (options == null ? void 0 : options.includeSeconds) {
      if (seconds < 5) {
        return locale.formatDistance("lessThanXSeconds", 5, localizeOptions);
      } else if (seconds < 10) {
        return locale.formatDistance("lessThanXSeconds", 10, localizeOptions);
      } else if (seconds < 20) {
        return locale.formatDistance("lessThanXSeconds", 20, localizeOptions);
      } else if (seconds < 40) {
        return locale.formatDistance("halfAMinute", 0, localizeOptions);
      } else if (seconds < 60) {
        return locale.formatDistance("lessThanXMinutes", 1, localizeOptions);
      } else {
        return locale.formatDistance("xMinutes", 1, localizeOptions);
      }
    } else {
      if (minutes === 0) {
        return locale.formatDistance("lessThanXMinutes", 1, localizeOptions);
      } else {
        return locale.formatDistance("xMinutes", minutes, localizeOptions);
      }
    }
  } else if (minutes < 45) {
    return locale.formatDistance("xMinutes", minutes, localizeOptions);
  } else if (minutes < 90) {
    return locale.formatDistance("aboutXHours", 1, localizeOptions);
  } else if (minutes < minutesInDay) {
    const hours = Math.round(minutes / 60);
    return locale.formatDistance("aboutXHours", hours, localizeOptions);
  } else if (minutes < minutesInAlmostTwoDays) {
    return locale.formatDistance("xDays", 1, localizeOptions);
  } else if (minutes < minutesInMonth) {
    const days = Math.round(minutes / minutesInDay);
    return locale.formatDistance("xDays", days, localizeOptions);
  } else if (minutes < minutesInMonth * 2) {
    months = Math.round(minutes / minutesInMonth);
    return locale.formatDistance("aboutXMonths", months, localizeOptions);
  }
  months = differenceInMonths(dateRight, dateLeft);
  if (months < 12) {
    const nearestMonth = Math.round(minutes / minutesInMonth);
    return locale.formatDistance("xMonths", nearestMonth, localizeOptions);
  } else {
    const monthsSinceStartOfYear = months % 12;
    const years = Math.trunc(months / 12);
    if (monthsSinceStartOfYear < 3) {
      return locale.formatDistance("aboutXYears", years, localizeOptions);
    } else if (monthsSinceStartOfYear < 9) {
      return locale.formatDistance("overXYears", years, localizeOptions);
    } else {
      return locale.formatDistance("almostXYears", years + 1, localizeOptions);
    }
  }
}
function formatDistanceToNow(date, options) {
  return formatDistance(date, constructNow(date), options);
}
function useClipboard() {
  const [copiedId, setCopiedId] = reactExports.useState(null);
  const copy = reactExports.useCallback(async (text, id) => {
    await copyText(text);
    if (id) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2e3);
    }
  }, []);
  return { copy, copiedId };
}
function buildFullPost(listing) {
  const parts = [listing.title];
  if (listing.description) parts.push(listing.description);
  if (listing.price) parts.push(`Price: ${listing.price}`);
  if (listing.sourceUrl) parts.push(listing.sourceUrl);
  return parts.join("\n");
}
function nsToMs$1(ts) {
  if (typeof ts === "bigint") return Number(ts) / 1e6;
  return ts > 1e15 ? ts / 1e6 : ts;
}
function daysUntilDeletion(archivedAt) {
  const archivedMs = Number(archivedAt) / 1e6;
  const deleteAt = archivedMs + 30 * 24 * 60 * 60 * 1e3;
  return Math.max(
    0,
    Math.floor((deleteAt - Date.now()) / (1e3 * 60 * 60 * 24))
  );
}
function ConfirmOverlay({
  type,
  title,
  onConfirm,
  onCancel,
  isLoading
}) {
  const isDelete = type === "delete";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `absolute inset-0 z-40 flex flex-col items-center justify-center rounded-lg backdrop-blur-sm p-3 ${isDelete ? "bg-card/95 border border-destructive/60" : "bg-card/95 neon-border-yellow"}`,
      children: [
        isDelete ? /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-5 w-5 text-destructive mb-1.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "h-5 w-5 text-accent mb-1.5 text-glow-yellow" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: `font-display text-[11px] font-bold tracking-wide text-center mb-1 ${isDelete ? "text-destructive" : "text-foreground"}`,
            children: isDelete ? "Delete forever?" : "Archive listing?"
          }
        ),
        isDelete && title && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground text-center mb-1 leading-tight truncate w-full px-2", children: [
          '"',
          title,
          '"'
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 w-full mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "ghost",
              className: "flex-1 h-7 text-[11px] border border-border/60 hover:bg-secondary/50 transition-smooth",
              onClick: onCancel,
              disabled: isLoading,
              "data-ocid": "confirm-cancel-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3 mr-1" }),
                " Cancel"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              className: `flex-1 h-7 text-[11px] font-display font-bold transition-smooth ${isDelete ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow-sm"}`,
              onClick: onConfirm,
              disabled: isLoading,
              "data-ocid": "confirm-action-btn",
              children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : isDelete ? "Delete" : "Archive"
            }
          )
        ] })
      ]
    }
  );
}
function ListingCard({ listing, index }) {
  const navigate = useNavigate();
  const { copy, copiedId } = useClipboard();
  const [imageError, setImageError] = reactExports.useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = reactExports.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = reactExports.useState(false);
  const [optimisticPinned, setOptimisticPinned] = reactExports.useState(
    null
  );
  const [optimisticFavorited, setOptimisticFavorited] = reactExports.useState(null);
  const { data: images, isLoading: imagesLoading } = useListingImages(
    listing.id
  );
  const archiveListing = useArchiveListing();
  const restoreListing = useRestoreListing();
  const permanentDeleteListing = usePermanentDeleteListing();
  const togglePin = useTogglePin();
  const toggleFavorite = useToggleFavorite();
  const { data: subscription } = useGetMySubscription();
  const isArchiving = archiveListing.isPending;
  const isRestoring = restoreListing.isPending;
  const isDeleting = permanentDeleteListing.isPending;
  const isArchived = listing.status === ListingStatus.archived;
  const isCopied = copiedId === listing.id.toString();
  const isPinned = optimisticPinned !== null ? optimisticPinned : listing.pinned;
  const isFavorited = optimisticFavorited !== null ? optimisticFavorited : listing.favorited;
  const expirationMs = (subscription == null ? void 0 : subscription.expirationDate) ? nsToMs$1(subscription.expirationDate) : null;
  const isSubscriptionActive = expirationMs !== null && expirationMs > Date.now();
  const deletionDays = isArchived && listing.archivedAt ? daysUntilDeletion(listing.archivedAt) : null;
  const createdAtMs = typeof listing.createdAt === "bigint" ? Number(listing.createdAt) / 1e6 : Number(listing.createdAt) > 1e15 ? Number(listing.createdAt) / 1e6 : Number(listing.createdAt);
  const relativeTime = formatDistanceToNow(new Date(createdAtMs), {
    addSuffix: true
  });
  const thumbnail = images && images.length > 0 && !imageError ? images[0].blob.getDirectURL() : null;
  function handleArchive() {
    archiveListing.mutate(listing.id, {
      onSuccess: () => {
        setShowArchiveConfirm(false);
        ue.success("Listing archived.");
      },
      onError: () => {
        ue.error("Failed to archive listing.");
      }
    });
  }
  function handleRestore() {
    if (!isSubscriptionActive) return;
    restoreListing.mutate(listing.id, {
      onSuccess: () => {
        ue.success("Listing restored!");
      },
      onError: () => {
        ue.error("Failed to restore listing.");
      }
    });
  }
  function handlePermanentDelete() {
    permanentDeleteListing.mutate(listing.id, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        ue.success("Listing permanently deleted.");
      },
      onError: () => {
        ue.error("Failed to delete listing.");
      }
    });
  }
  function handlePinClick(e) {
    e.stopPropagation();
    const next = !isPinned;
    setOptimisticPinned(next);
    togglePin.mutate(listing.id, {
      onError: () => {
        setOptimisticPinned(isPinned);
        ue.error("Failed to update pin.");
      }
    });
  }
  function handleFavoriteClick(e) {
    e.stopPropagation();
    const next = !isFavorited;
    setOptimisticFavorited(next);
    toggleFavorite.mutate(listing.id, {
      onError: () => {
        setOptimisticFavorited(isFavorited);
        ue.error("Failed to update favorite.");
      }
    });
  }
  function handleCardClick() {
    if (showArchiveConfirm || showDeleteConfirm) return;
    navigate({ to: "/listing/$id", params: { id: listing.id.toString() } });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.article,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.35, delay: index * 0.05, ease: "easeOut" },
      className: `group relative rounded-md overflow-hidden cursor-pointer transition-smooth ${isArchived ? "opacity-60" : ""}`,
      "data-ocid": "listing-card",
      onClick: handleCardClick,
      children: [
        showArchiveConfirm && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ConfirmOverlay,
          {
            type: "archive",
            onConfirm: handleArchive,
            onCancel: () => setShowArchiveConfirm(false),
            isLoading: isArchiving
          }
        ),
        showDeleteConfirm && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ConfirmOverlay,
          {
            type: "delete",
            title: listing.title,
            onConfirm: handlePermanentDelete,
            onCancel: () => setShowDeleteConfirm(false),
            isLoading: isDeleting
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-square bg-muted overflow-hidden", children: [
          imagesLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "absolute inset-0 rounded-none" }) : thumbnail ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: thumbnail,
              alt: listing.title,
              onError: () => setImageError(true),
              className: `w-full h-full object-cover transition-smooth group-hover:scale-105 ${isArchived ? "grayscale" : ""}`
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center retro-grid opacity-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", children: "📋" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "absolute top-1.5 left-1.5 w-8 h-8 flex items-center justify-center z-20 rounded-full transition-smooth hover:scale-110 active:scale-95",
              onClick: handlePinClick,
              "aria-label": isPinned ? "Unpin listing" : "Pin listing to top",
              "data-ocid": "pin-listing-btn",
              disabled: togglePin.isPending,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-base leading-none drop-shadow-md transition-all duration-200",
                  style: {
                    opacity: isPinned ? 1 : 0.35,
                    filter: isPinned ? "drop-shadow(0 0 4px #00d4ff)" : "none"
                  },
                  children: "📌"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "absolute top-1.5 right-1.5 w-8 h-8 flex items-center justify-center z-20 rounded-full transition-smooth hover:scale-110 active:scale-95",
              onClick: handleFavoriteClick,
              "aria-label": isFavorited ? "Remove from favorites" : "Add to favorites",
              "data-ocid": "favorite-listing-btn",
              disabled: toggleFavorite.isPending,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-base leading-none drop-shadow-md transition-all duration-200",
                  style: {
                    color: isFavorited ? "#ffd700" : void 0,
                    opacity: isFavorited ? 1 : 0.5,
                    filter: isFavorited ? "drop-shadow(0 0 4px #ffd700)" : "none"
                  },
                  children: isFavorited ? "♥" : "♡"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-1.5 py-1.5 opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none group-hover:pointer-events-auto",
              role: "toolbar",
              "aria-label": "Listing actions",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    className: "h-7 px-2 rounded text-[11px] font-display font-bold bg-primary/80 text-primary-foreground hover:bg-primary transition-smooth glow-blue-sm",
                    onClick: (e) => {
                      e.stopPropagation();
                      copy(buildFullPost(listing), listing.id.toString());
                    },
                    "aria-label": "Copy listing",
                    "data-ocid": "copy-listing-btn",
                    children: [
                      isCopied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 inline mr-0.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3 w-3 inline mr-0.5" }),
                      isCopied ? "✓" : "Copy"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 relative", children: [
                  !isArchived && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "h-7 w-7 rounded flex items-center justify-center bg-black/60 text-muted-foreground hover:text-accent hover:bg-black/80 transition-smooth",
                      onClick: (e) => {
                        e.stopPropagation();
                        setShowArchiveConfirm(true);
                      },
                      "aria-label": "Archive",
                      "data-ocid": "archive-listing-btn",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "h-3.5 w-3.5" })
                    }
                  ),
                  isArchived && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        className: `h-7 px-1.5 rounded text-[11px] flex items-center gap-0.5 transition-smooth ${isSubscriptionActive ? "bg-primary/80 text-primary-foreground hover:bg-primary" : "bg-muted/60 text-muted-foreground/50 cursor-not-allowed"}`,
                        onClick: (e) => {
                          e.stopPropagation();
                          handleRestore();
                        },
                        disabled: !isSubscriptionActive || isRestoring,
                        "aria-label": "Restore",
                        "data-ocid": "restore-listing-btn",
                        children: isRestoring ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3 w-3" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        className: "h-7 w-7 rounded flex items-center justify-center bg-destructive/80 text-destructive-foreground hover:bg-destructive transition-smooth",
                        onClick: (e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(true);
                        },
                        "aria-label": "Delete forever",
                        "data-ocid": "permanent-delete-btn",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                      }
                    )
                  ] })
                ] })
              ]
            }
          ),
          isArchived && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] px-1.5 py-0.5 bg-muted/80 text-muted-foreground border border-border/50 tracking-widest rounded uppercase", children: deletionDays !== null ? `🗑 ${deletionDays}d left` : "ARCHIVED" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 px-2 py-1 bg-gradient-to-t from-black/60 to-transparent text-xs text-gray-200 group-hover:block hidden pointer-events-none z-10", children: [
            "📅 ",
            relativeTime
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-1 pt-1.5 pb-0.5 bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-[11px] font-semibold text-foreground line-clamp-1 leading-tight group-hover:text-primary transition-colors duration-200", children: listing.title }),
          listing.price && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-accent text-glow-yellow leading-tight mt-0.5", children: listing.price })
        ] })
      ]
    }
  );
}
function SuccessBanner({ onDismiss }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: -12, scale: 0.98 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -8, scale: 0.98 },
      transition: { duration: 0.3 },
      className: "flex items-start sm:items-center justify-between gap-3 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 mb-4",
      role: "alert",
      "data-ocid": "payment-success-banner",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.span,
            {
              animate: { scale: [1, 1.2, 1] },
              transition: { duration: 1.5, repeat: Number.POSITIVE_INFINITY },
              className: "text-lg shrink-0",
              children: "⚡"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-widest uppercase text-primary text-glow-blue", children: "DeLorean Refueled!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: "Your subscription has been extended. Time circuits updated." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onDismiss,
            "aria-label": "Dismiss success banner",
            className: "text-muted-foreground hover:text-foreground transition-smooth shrink-0 text-lg leading-none",
            "data-ocid": "dismiss-success-banner-btn",
            children: "×"
          }
        )
      ]
    }
  );
}
function FailureBanner() {
  const portalSession = useCreateStripePortalSession();
  const dismissBanner = useDismissPaymentBanner();
  async function handleFixNow() {
    try {
      await portalSession.mutateAsync();
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to open billing portal."
      );
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: -12, scale: 0.98 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -8 },
      transition: { duration: 0.3 },
      className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 mb-4",
      role: "alert",
      "data-ocid": "payment-failure-banner",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start sm:items-center gap-3 min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg shrink-0 mt-0.5 sm:mt-0", children: "⚠" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-widest uppercase text-destructive", children: "Payment Failed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground leading-relaxed", children: "Update your payment method to avoid losing your listings." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              onClick: handleFixNow,
              disabled: portalSession.isPending,
              className: "font-display text-[10px] tracking-widest uppercase bg-destructive text-destructive-foreground hover:bg-destructive/90 h-7 px-3",
              "data-ocid": "payment-failure-fix-now-btn",
              children: portalSession.isPending ? "Opening..." : "Fix Now"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => dismissBanner.mutate(),
              "aria-label": "Dismiss failure banner",
              className: "text-muted-foreground hover:text-foreground transition-smooth text-lg leading-none",
              "data-ocid": "dismiss-failure-banner-btn",
              children: "×"
            }
          )
        ] })
      ]
    }
  );
}
function PaymentBanners() {
  const { data: backendBanner } = useGetPaymentBanner();
  const [successDismissed, setSuccessDismissed] = reactExports.useState(false);
  const dismissBanner = useDismissPaymentBanner();
  const bannerExpiry = localStorage.getItem("refuel_banner_expiry");
  const showSuccess = !successDismissed && bannerExpiry !== null && Date.now() < Number(bannerExpiry);
  const showFailure = (backendBanner == null ? void 0 : backendBanner.bannerType) === "failure";
  function handleSuccessDismiss() {
    setSuccessDismissed(true);
    localStorage.removeItem("refuel_banner_expiry");
    localStorage.removeItem("refuel_banner_shown");
    dismissBanner.mutate();
  }
  if (!showSuccess && !showFailure) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "payment-banners", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { children: [
    showSuccess && /* @__PURE__ */ jsxRuntimeExports.jsx(SuccessBanner, { onDismiss: handleSuccessDismiss }, "success"),
    showFailure && /* @__PURE__ */ jsxRuntimeExports.jsx(FailureBanner, {}, "failure")
  ] }) });
}
const PLATFORMS = [
  { id: "facebook", emoji: "📘", label: "Facebook Marketplace" },
  { id: "mecari", emoji: "🏯", label: "Mercari" },
  { id: "ebay", emoji: "🔨", label: "eBay" },
  { id: "poshmark", emoji: "👜", label: "Poshmark" },
  { id: "depop", emoji: "🎨", label: "Depop" },
  { id: "etsy", emoji: "🛍️", label: "Etsy" }
];
const PLATFORM_CAPABILITIES = {
  facebook: { maxPhotos: 10, maxTitleLength: 200, maxDescriptionLength: 5e3 },
  mecari: { maxPhotos: 12, maxTitleLength: 80, maxDescriptionLength: 1e3 },
  ebay: { maxPhotos: 12, maxTitleLength: 80, maxDescriptionLength: 4e3 },
  poshmark: { maxPhotos: 11, maxTitleLength: 141, maxDescriptionLength: 2e3 },
  depop: { maxPhotos: 12, maxTitleLength: 70, maxDescriptionLength: 500 },
  etsy: { maxPhotos: 10, maxTitleLength: 140, maxDescriptionLength: 1e4 }
};
const STEP_ORDER = [
  "platforms",
  "details",
  "photos",
  "pricing",
  "schedule",
  "review"
];
const CONDITIONS = [
  { value: "new", label: "🆕 New" },
  { value: "likeNew", label: "✨ Like New" },
  { value: "good", label: "👍 Good" },
  { value: "fair", label: "👌 Fair" },
  { value: "poor", label: "🔧 Poor" }
];
const INITIAL_FORM = {
  title: "",
  description: "",
  price: "",
  category: "",
  condition: "good",
  brand: "",
  quantity: 1,
  photos: [],
  platforms: {
    facebook: true,
    mecari: false,
    ebay: false,
    poshmark: false,
    depop: false,
    etsy: false
  },
  basePrice: "",
  priceMarkupPercent: "0",
  platformPrices: {},
  scheduleType: "immediate",
  scheduledTime: "",
  batchSize: 5,
  fbLocalPickup: true,
  fbShipping: false,
  mecariDeliveryDays: "3",
  mecariShippingType: "normal"
};
const inputCls = "w-full px-3 py-2 bg-secondary/50 border border-border/60 rounded text-foreground text-sm focus:outline-none focus:border-primary/60 transition-colors";
const labelCls = "block text-xs font-semibold text-muted-foreground mb-1.5";
function UniversalListingForm({
  isOpen,
  onClose
}) {
  var _a;
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const [step, setStep] = reactExports.useState("platforms");
  const [formData, setFormData] = reactExports.useState(INITIAL_FORM);
  const selectedPlatforms = Object.entries(formData.platforms).filter(([, enabled]) => enabled).map(([id]) => id);
  const canProceed = {
    platforms: selectedPlatforms.length > 0,
    details: formData.title.trim().length > 0 && formData.description.trim().length > 0,
    photos: formData.photos.length > 0,
    pricing: (formData.basePrice || formData.price).trim().length > 0,
    schedule: true,
    review: true
  };
  function update(key, value) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }
  function togglePlatform(id) {
    setFormData((prev) => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [id]: !prev.platforms[id]
      }
    }));
  }
  function handlePhotoChange(e) {
    const files = e.currentTarget.files;
    if (!files) return;
    const maxPhotos = selectedPlatforms.reduce(
      (max, p) => {
        var _a2;
        return Math.max(max, ((_a2 = PLATFORM_CAPABILITIES[p]) == null ? void 0 : _a2.maxPhotos) ?? 12);
      },
      0
    );
    const remaining = maxPhotos - formData.photos.length;
    const added = Array.from(files).slice(0, remaining);
    setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...added] }));
    e.currentTarget.value = "";
  }
  function removePhoto(idx) {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx)
    }));
  }
  function resetForm() {
    setStep("platforms");
    setFormData(INITIAL_FORM);
  }
  function handleClose() {
    resetForm();
    onClose();
  }
  const stepIndex = STEP_ORDER.indexOf(step);
  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      if (selectedPlatforms.length === 0)
        throw new Error("Select at least one platform");
      const price = formData.basePrice || formData.price;
      const markupNum = Number.parseFloat(formData.priceMarkupPercent);
      const platformPricesEntries = Object.entries(
        formData.platformPrices
      ).filter(([, v]) => v.trim().length > 0);
      return await actor.createUniversalListing(
        formData.title,
        formData.description,
        price,
        formData.category ? [formData.category] : [],
        formData.condition,
        formData.brand ? [formData.brand] : [],
        formData.quantity,
        selectedPlatforms,
        {
          basePrice: price,
          priceMarkupPercent: !Number.isNaN(markupNum) && markupNum > 0 ? [markupNum] : [],
          platformPrices: platformPricesEntries,
          autoRepricing: false
        },
        formData.scheduleType === "scheduled" && formData.scheduledTime ? [
          {
            type: { scheduled: null },
            scheduledTime: [
              BigInt(
                new Date(formData.scheduledTime).getTime() * 1e6
              )
            ],
            batchSize: []
          }
        ] : formData.scheduleType === "batch" ? [
          {
            type: { batch: null },
            scheduledTime: [],
            batchSize: [formData.batchSize]
          }
        ] : [{ type: { immediate: null }, scheduledTime: [], batchSize: [] }],
        {
          facebook: selectedPlatforms.includes("facebook") ? [
            {
              localPickup: formData.fbLocalPickup,
              shipping: formData.fbShipping
            }
          ] : [],
          mecari: selectedPlatforms.includes("mecari") ? [
            {
              deliveryDays: BigInt(
                Number.parseInt(formData.mecariDeliveryDays, 10) || 3
              ),
              shippingType: formData.mecariShippingType
            }
          ] : []
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["universalListings"] });
      ue.success("🚀 Universal listing created!", {
        description: `Publishing to ${selectedPlatforms.length} platform${selectedPlatforms.length > 1 ? "s" : ""}`
      });
      resetForm();
      onClose();
    },
    onError: (err) => {
      ue.error(
        `Failed: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  });
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4",
      "data-ocid": "universal-listing.dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-primary/30 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-primary/20 to-accent/20 px-5 py-4 flex items-center justify-between border-b border-primary/20 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5 text-primary shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-primary font-display truncate", children: "Universal Cross-Listing" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground shrink-0", children: [
              stepIndex + 1,
              "/",
              STEP_ORDER.length
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handleClose,
              className: "p-1 hover:bg-foreground/10 rounded transition-colors ml-2 shrink-0",
              "aria-label": "Close",
              "data-ocid": "universal-listing.close_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5 text-muted-foreground" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 px-5 pt-3 shrink-0", children: STEP_ORDER.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `h-1 flex-1 rounded-full transition-colors ${i <= stepIndex ? "bg-primary" : "bg-border/60"}`
          },
          s
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-5 py-4 space-y-4", children: [
          step === "platforms" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Choose platforms to list on — one form, multiple marketplaces." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "grid grid-cols-2 sm:grid-cols-3 gap-3",
                "data-ocid": "universal-listing.platform.list",
                children: PLATFORMS.map((p) => {
                  const active = formData.platforms[p.id];
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => togglePlatform(p.id),
                      "data-ocid": `universal-listing.platform.${p.id}`,
                      className: `relative p-4 rounded-lg border-2 transition-all text-left ${active ? "border-primary bg-primary/10" : "border-border/40 bg-secondary/20 hover:border-border/70"}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl mb-1", children: p.emoji }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: `text-xs font-semibold ${active ? "text-primary" : "text-muted-foreground"}`,
                            children: p.label
                          }
                        ),
                        active && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "absolute top-2 right-2 h-4 w-4 text-primary" })
                      ]
                    },
                    p.id
                  );
                })
              }
            )
          ] }),
          step === "details" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "ul-title", className: labelCls, children: [
                "Title *",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-normal opacity-60", children: [
                  "(",
                  formData.title.length,
                  "/200)"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "ul-title",
                  type: "text",
                  placeholder: "What are you selling?",
                  value: formData.title,
                  onChange: (e) => update("title", e.target.value),
                  maxLength: 200,
                  className: inputCls,
                  "data-ocid": "universal-listing.title.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "ul-description", className: labelCls, children: [
                "Description *",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-normal opacity-60", children: [
                  "(",
                  formData.description.length,
                  "/1000)"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  id: "ul-description",
                  placeholder: "Describe your item in detail…",
                  value: formData.description,
                  onChange: (e) => update("description", e.target.value),
                  maxLength: 1e3,
                  rows: 4,
                  className: `${inputCls} resize-none`,
                  "data-ocid": "universal-listing.description.textarea"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "ul-price", className: labelCls, children: "Price *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "ul-price",
                    type: "text",
                    placeholder: "$0.00",
                    value: formData.price,
                    onChange: (e) => update("price", e.target.value),
                    className: inputCls,
                    "data-ocid": "universal-listing.price.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "ul-quantity", className: labelCls, children: "Quantity" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "ul-quantity",
                    type: "number",
                    min: 1,
                    value: formData.quantity,
                    onChange: (e) => update(
                      "quantity",
                      Number.parseInt(e.target.value, 10) || 1
                    ),
                    className: inputCls,
                    "data-ocid": "universal-listing.quantity.input"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "ul-category", className: labelCls, children: "Category" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "ul-category",
                    type: "text",
                    placeholder: "e.g. Clothing",
                    value: formData.category,
                    onChange: (e) => update("category", e.target.value),
                    className: inputCls,
                    "data-ocid": "universal-listing.category.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "ul-brand", className: labelCls, children: "Brand" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "ul-brand",
                    type: "text",
                    placeholder: "e.g. Nike",
                    value: formData.brand,
                    onChange: (e) => update("brand", e.target.value),
                    className: inputCls,
                    "data-ocid": "universal-listing.brand.input"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "ul-condition", className: labelCls, children: "Condition" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  id: "ul-condition",
                  value: formData.condition,
                  onChange: (e) => update("condition", e.target.value),
                  className: inputCls,
                  "data-ocid": "universal-listing.condition.select",
                  children: CONDITIONS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.value, children: c.label }, c.value))
                }
              )
            ] })
          ] }),
          step === "photos" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-foreground", children: [
              "📷 Photos",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground font-normal", children: [
                "(",
                formData.photos.length,
                "/12)"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "grid grid-cols-3 sm:grid-cols-4 gap-2",
                "data-ocid": "universal-listing.photos.list",
                children: [
                  formData.photos.map((photo, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "relative aspect-square bg-muted rounded overflow-hidden group",
                      "data-ocid": `universal-listing.photos.item.${idx + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "img",
                          {
                            src: URL.createObjectURL(photo),
                            alt: `Listing item ${idx + 1}`,
                            className: "w-full h-full object-cover"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => removePhoto(idx),
                            className: "absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center",
                            "aria-label": `Remove item ${idx + 1}`,
                            "data-ocid": `universal-listing.photos.delete_button.${idx + 1}`,
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-5 w-5 text-destructive-foreground" })
                          }
                        )
                      ]
                    },
                    `photo-${photo.name}-${photo.lastModified}`
                  )),
                  formData.photos.length < 12 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "label",
                    {
                      htmlFor: "ul-photo-upload",
                      className: "aspect-square bg-secondary/20 border-2 border-dashed border-border/40 rounded cursor-pointer flex flex-col items-center justify-center hover:border-primary/40 transition-colors group",
                      "data-ocid": "universal-listing.photos.upload_button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground mt-1", children: "Add" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            id: "ul-photo-upload",
                            type: "file",
                            multiple: true,
                            accept: "image/*",
                            onChange: handlePhotoChange,
                            className: "hidden"
                          }
                        )
                      ]
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "💡 Tip: Upload 6–12 high-quality files for best visibility across all platforms." })
          ] }),
          step === "pricing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 p-4 bg-accent/5 border border-accent/20 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground", children: "💰 Pricing Strategy" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "ul-base-price", className: labelCls, children: "Base Price * (used for all platforms unless overridden)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "ul-base-price",
                  type: "text",
                  placeholder: formData.price || "$0.00",
                  value: formData.basePrice,
                  onChange: (e) => update("basePrice", e.target.value),
                  className: inputCls,
                  "data-ocid": "universal-listing.base_price.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "ul-markup", className: labelCls, children: "Markup % (applies to all platforms)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "ul-markup",
                  type: "number",
                  placeholder: "0",
                  value: formData.priceMarkupPercent,
                  onChange: (e) => update("priceMarkupPercent", e.target.value),
                  className: inputCls,
                  "data-ocid": "universal-listing.markup.input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "💡 Example: Base $100 + 15% = $115 on all platforms" })
            ] }),
            selectedPlatforms.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/40 pt-3 space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground", children: "Platform-specific prices (optional overrides):" }),
              selectedPlatforms.map((pid) => {
                const p = PLATFORMS.find((x) => x.id === pid);
                const inputId = `ul-platform-price-${pid}`;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: inputId, className: labelCls, children: [
                    p == null ? void 0 : p.emoji,
                    " ",
                    p == null ? void 0 : p.label
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      id: inputId,
                      type: "text",
                      placeholder: "Leave blank to use base price",
                      value: formData.platformPrices[pid] ?? "",
                      onChange: (e) => setFormData((prev) => ({
                        ...prev,
                        platformPrices: {
                          ...prev.platformPrices,
                          [pid]: e.target.value
                        }
                      })),
                      className: inputCls,
                      "data-ocid": `universal-listing.platform_price.${pid}.input`
                    }
                  )
                ] }, pid);
              })
            ] })
          ] }),
          step === "schedule" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 p-4 bg-primary/5 border border-primary/20 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 text-primary" }),
              "When to Publish"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [
              { value: "immediate", label: "🚀 Publish Immediately" },
              { value: "scheduled", label: "📅 Schedule for Later" },
              { value: "batch", label: "📊 Batch Publishing" }
            ].map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  htmlFor: `ul-schedule-${opt.value}`,
                  className: "flex items-center gap-2 cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        id: `ul-schedule-${opt.value}`,
                        type: "radio",
                        checked: formData.scheduleType === opt.value,
                        onChange: () => update("scheduleType", opt.value),
                        className: "w-4 h-4 accent-primary",
                        "data-ocid": `universal-listing.schedule.${opt.value}`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: opt.label })
                  ]
                }
              ),
              opt.value === "scheduled" && formData.scheduleType === "scheduled" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-6 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "ul-scheduled-time",
                    className: labelCls,
                    children: "Publish date & time"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "ul-scheduled-time",
                    type: "datetime-local",
                    value: formData.scheduledTime,
                    onChange: (e) => update("scheduledTime", e.target.value),
                    className: `${inputCls} text-xs`,
                    "data-ocid": "universal-listing.scheduled_time.input"
                  }
                )
              ] }),
              opt.value === "batch" && formData.scheduleType === "batch" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-6 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "ul-batch-size", className: labelCls, children: "Items per batch" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "ul-batch-size",
                    type: "number",
                    min: 1,
                    max: 20,
                    value: formData.batchSize,
                    onChange: (e) => update(
                      "batchSize",
                      Number.parseInt(e.target.value, 10) || 1
                    ),
                    className: `${inputCls} w-24`,
                    "data-ocid": "universal-listing.batch_size.input"
                  }
                )
              ] })
            ] }, opt.value)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "💡 Batch publishing posts ",
              formData.batchSize,
              " items daily to avoid spam detection."
            ] })
          ] }),
          step === "review" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-primary/10 border border-primary/30 rounded-lg space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-primary", children: "📋 Review Before Publishing" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dl", { className: "space-y-1 text-xs", children: [
                ["Title", formData.title],
                ["Price", formData.basePrice || formData.price],
                [
                  "Condition",
                  ((_a = CONDITIONS.find((c) => c.value === formData.condition)) == null ? void 0 : _a.label) ?? formData.condition
                ],
                ["Quantity", String(formData.quantity)],
                [
                  "Files",
                  `${formData.photos.length} file${formData.photos.length !== 1 ? "s" : ""}`
                ],
                [
                  "Platforms",
                  selectedPlatforms.map(
                    (pid) => {
                      var _a2;
                      return (_a2 = PLATFORMS.find((p) => p.id === pid)) == null ? void 0 : _a2.emoji;
                    }
                  ).join(" ")
                ],
                [
                  "Schedule",
                  formData.scheduleType === "immediate" ? "Publish now" : formData.scheduleType === "scheduled" && formData.scheduledTime ? new Date(formData.scheduledTime).toLocaleString() : `${formData.batchSize} items/day (batch)`
                ]
              ].map(([key, val]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("dt", { className: "text-muted-foreground w-20 shrink-0", children: [
                  key,
                  ":"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "text-foreground break-words min-w-0", children: val })
              ] }, key)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-2 p-3 bg-card border border-border/40 rounded-lg text-xs text-muted-foreground",
                "data-ocid": "universal-listing.review.success_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-primary shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "Ready to publish to",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-semibold", children: [
                      selectedPlatforms.length,
                      " platform",
                      selectedPlatforms.length > 1 ? "s" : ""
                    ] })
                  ] })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-t border-border/40 flex gap-2 shrink-0", children: [
          step !== "platforms" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setStep(STEP_ORDER[stepIndex - 1]),
              className: "flex-1 px-4 py-2 bg-secondary/50 hover:bg-secondary/70 rounded text-sm font-semibold transition-colors",
              "data-ocid": "universal-listing.back_button",
              children: "Back"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handleClose,
              className: "flex-1 px-4 py-2 bg-secondary/50 hover:bg-secondary/70 rounded text-sm font-semibold transition-colors",
              "data-ocid": "universal-listing.cancel_button",
              children: "Cancel"
            }
          ),
          step !== "review" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setStep(STEP_ORDER[stepIndex + 1]),
              disabled: !canProceed[step],
              className: "flex-1 px-4 py-2 bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed rounded text-sm font-semibold text-primary-foreground transition-colors",
              "data-ocid": "universal-listing.next_button",
              children: step === "platforms" ? `Next (${selectedPlatforms.length} selected)` : "Next"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => mutation.mutate(),
              disabled: mutation.isPending,
              className: "flex-1 px-4 py-2 bg-accent hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed rounded text-sm font-semibold text-accent-foreground flex items-center justify-center gap-2 transition-colors",
              "data-ocid": "universal-listing.submit_button",
              children: mutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-pulse", children: "Publishing…" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4" }),
                "Publish to ",
                selectedPlatforms.length,
                " Platform",
                selectedPlatforms.length > 1 ? "s" : ""
              ] })
            }
          )
        ] })
      ] })
    }
  );
}
const DEFAULT_FORM = {
  title: "",
  description: "",
  price: "",
  category: "",
  fbCondition: "good",
  fbLocalPickup: true,
  fbShipping: false,
  mecariBrand: "",
  mecariCondition: "3",
  mecariDeliveryDays: "3",
  mecariShippingType: "normal"
};
const PLATFORM_CONFIG = {
  facebook: {
    label: "Facebook Marketplace",
    emoji: "📘",
    titleMax: 200,
    descMax: 5e3,
    headingClass: "text-blue-300",
    sectionClass: "bg-blue-900/10 border-blue-500/20",
    borderActive: "border-blue-500/50",
    borderHover: "hover:border-blue-400",
    bgCard: "bg-blue-900/20"
  },
  mecari: {
    label: "Mercari",
    emoji: "🏯",
    titleMax: 80,
    descMax: 1e3,
    headingClass: "text-pink-300",
    sectionClass: "bg-pink-900/10 border-pink-500/20",
    borderActive: "border-pink-500/50",
    borderHover: "hover:border-pink-400",
    bgCard: "bg-pink-900/20"
  }
};
function mapFbCondition(val) {
  const map = {
    new: ItemCondition.new_,
    likeNew: ItemCondition.likeNew,
    good: ItemCondition.good,
    fair: ItemCondition.fair,
    poor: ItemCondition.poor
  };
  return map[val] ?? ItemCondition.good;
}
function mapMecariCondition(val) {
  const map = {
    "1": ItemCondition.new_,
    "2": ItemCondition.likeNew,
    "3": ItemCondition.good,
    "4": ItemCondition.fair,
    "5": ItemCondition.poor
  };
  return map[val] ?? ItemCondition.good;
}
const INPUT_CLASS = "w-full px-3 py-2 bg-secondary/50 border border-border/60 rounded text-foreground text-sm focus:border-primary/60 focus:outline-none transition-smooth font-mono placeholder:text-muted-foreground/60";
const SELECT_CLASS = "w-full px-3 py-2 bg-secondary/50 border border-border/60 rounded text-foreground text-sm focus:border-primary/60 focus:outline-none transition-smooth";
function NewListingModal({ isOpen, onClose }) {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [step, setStep] = reactExports.useState("platform");
  const [platform, setPlatform] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(DEFAULT_FORM);
  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }
  function resetForm() {
    setStep("platform");
    setPlatform(null);
    setForm(DEFAULT_FORM);
  }
  const createMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !platform) throw new Error("Platform not selected");
      const args = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: form.price.trim() || void 0,
        sourceUrl: void 0,
        category: form.category.trim() || void 0,
        tierLevel: void 0,
        platform: platform === "facebook" ? Platform__1.facebook : Platform__1.mecari,
        // Facebook-specific
        fbCondition: platform === "facebook" ? mapFbCondition(form.fbCondition) : void 0,
        fbLocalPickup: platform === "facebook" ? form.fbLocalPickup : void 0,
        fbShipping: platform === "facebook" ? form.fbShipping : void 0,
        // Mecari-specific
        mecariBrand: platform === "mecari" ? form.mecariBrand.trim() || void 0 : void 0,
        mecariCondition: platform === "mecari" ? mapMecariCondition(form.mecariCondition) : void 0,
        mecariDeliveryDays: platform === "mecari" ? BigInt(Number.parseInt(form.mecariDeliveryDays, 10)) : void 0,
        mecariShippingType: platform === "mecari" ? form.mecariShippingType : void 0
      };
      return actor.createListing(args);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      const cfg2 = PLATFORM_CONFIG[platform];
      ue.success(`✅ ${cfg2.emoji} ${cfg2.label} listing created!`);
      resetForm();
      onClose();
    },
    onError: (err) => ue.error(
      err instanceof Error ? err.message : "Failed to create listing"
    )
  });
  const canSubmit = !!actor && !isFetching && form.title.trim().length > 0 && (platform === "facebook" || platform === "mecari" && form.mecariBrand.trim().length > 0);
  if (!isOpen) return null;
  const cfg = platform ? PLATFORM_CONFIG[platform] : null;
  const titleMax = (cfg == null ? void 0 : cfg.titleMax) ?? 200;
  const descMax = (cfg == null ? void 0 : cfg.descMax) ?? 5e3;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      style: { background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" },
      onClick: onClose,
      onKeyDown: (e) => e.key === "Escape" && onClose(),
      role: "presentation",
      "data-ocid": "new-listing-modal-backdrop",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "w-full max-w-md rounded-xl border border-primary/30 bg-card overflow-hidden max-h-[90vh] overflow-y-auto",
          onClick: (e) => e.stopPropagation(),
          onKeyDown: (e) => e.stopPropagation(),
          "data-ocid": "new-listing-modal",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-primary/20 to-accent/20 px-5 py-4 flex items-center justify-between border-b border-primary/20 sticky top-0 bg-card z-10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-bold tracking-wider text-primary uppercase text-glow-blue", children: "+ New Listing" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    resetForm();
                    onClose();
                  },
                  className: "p-1 hover:bg-secondary/60 rounded transition-smooth",
                  "aria-label": "Close",
                  "data-ocid": "new-listing-modal.close_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-muted-foreground" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5", children: step === "platform" ? (
              /* ── Step 1: Platform selection ── */
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "space-y-4",
                  "data-ocid": "new-listing-modal.platform_step",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono", children: "Choose which platform you want to list on:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: ["facebook", "mecari"].map((p) => {
                      const pc = PLATFORM_CONFIG[p];
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => {
                            setPlatform(p);
                            setStep("details");
                          },
                          className: `w-full p-4 ${pc.bgCard} border-2 ${pc.borderActive} ${pc.borderHover} rounded-lg text-left transition-smooth group hover:scale-[1.01]`,
                          "data-ocid": `new-listing-modal.platform.${p}.button`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "div",
                              {
                                className: `text-base font-bold font-display ${pc.headingClass}`,
                                children: [
                                  pc.emoji,
                                  " ",
                                  pc.label
                                ]
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-mono mt-1", children: p === "facebook" ? "List items for local sale & pickup" : "Sell items online, nationwide shipping" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground/60 font-mono mt-1.5", children: [
                              "Required:",
                              " ",
                              p === "facebook" ? "Title, Description" : "Title, Brand, Condition"
                            ] })
                          ]
                        },
                        p
                      );
                    }) })
                  ]
                }
              )
            ) : (
              /* ── Step 2: Listing details ── */
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "space-y-4",
                  "data-ocid": "new-listing-modal.details_step",
                  children: [
                    cfg && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pb-4 border-b border-border/40", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: cfg.emoji }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground font-mono uppercase tracking-widest", children: "Listing for" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: `font-bold text-sm font-display ${cfg.headingClass}`,
                            children: cfg.label
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setStep("platform"),
                          className: "text-xs px-2.5 py-1 bg-secondary/50 hover:bg-secondary/80 rounded text-muted-foreground font-mono transition-smooth",
                          "data-ocid": "new-listing-modal.change_platform.button",
                          children: "Change"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "label",
                        {
                          htmlFor: "nlm-title",
                          className: "text-xs font-semibold text-muted-foreground font-mono mb-1.5 block",
                          children: "Title *"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          id: "nlm-title",
                          type: "text",
                          placeholder: "Item title",
                          value: form.title,
                          onChange: (e) => set("title", e.target.value),
                          maxLength: titleMax,
                          className: INPUT_CLASS,
                          "data-ocid": "new-listing-modal.title.input"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground/60 font-mono mt-1 text-right", children: [
                        form.title.length,
                        "/",
                        titleMax
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "label",
                        {
                          htmlFor: "nlm-desc",
                          className: "text-xs font-semibold text-muted-foreground font-mono mb-1.5 block",
                          children: "Description"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "textarea",
                        {
                          id: "nlm-desc",
                          placeholder: "Item description...",
                          value: form.description,
                          onChange: (e) => set("description", e.target.value),
                          maxLength: descMax,
                          rows: 3,
                          className: `${INPUT_CLASS} resize-none`,
                          "data-ocid": "new-listing-modal.description.textarea"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground/60 font-mono mt-1 text-right", children: [
                        form.description.length,
                        "/",
                        descMax
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "label",
                          {
                            htmlFor: "nlm-price",
                            className: "text-xs font-semibold text-muted-foreground font-mono mb-1.5 block",
                            children: "Price"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            id: "nlm-price",
                            type: "text",
                            placeholder: "$0.00",
                            value: form.price,
                            onChange: (e) => set("price", e.target.value),
                            className: INPUT_CLASS,
                            "data-ocid": "new-listing-modal.price.input"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "label",
                          {
                            htmlFor: "nlm-category",
                            className: "text-xs font-semibold text-muted-foreground font-mono mb-1.5 block",
                            children: "Category"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            id: "nlm-category",
                            type: "text",
                            placeholder: "Category",
                            value: form.category,
                            onChange: (e) => set("category", e.target.value),
                            className: INPUT_CLASS,
                            "data-ocid": "new-listing-modal.category.input"
                          }
                        )
                      ] })
                    ] }),
                    platform === "facebook" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: `space-y-3 p-3 border rounded-lg ${PLATFORM_CONFIG.facebook.sectionClass}`,
                        "data-ocid": "new-listing-modal.facebook_section",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold font-display text-blue-300 tracking-wide", children: "📘 Facebook Marketplace Options" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "label",
                              {
                                htmlFor: "nlm-fb-condition",
                                className: "text-xs font-semibold text-muted-foreground font-mono mb-1.5 block",
                                children: "Condition"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "select",
                              {
                                id: "nlm-fb-condition",
                                value: form.fbCondition,
                                onChange: (e) => set("fbCondition", e.target.value),
                                className: SELECT_CLASS,
                                "data-ocid": "new-listing-modal.fb_condition.select",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "new", children: "🆕 New" }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "likeNew", children: "✨ Like New" }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "good", children: "👍 Good" }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "fair", children: "👌 Fair" }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "poor", children: "🔧 Poor" })
                                ]
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer select-none", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "input",
                              {
                                type: "checkbox",
                                checked: form.fbLocalPickup,
                                onChange: (e) => set("fbLocalPickup", e.target.checked),
                                className: "w-4 h-4 rounded border border-border/60 accent-primary",
                                "data-ocid": "new-listing-modal.fb_local_pickup.checkbox"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground font-mono", children: "Local Pickup Available" })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer select-none", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "input",
                              {
                                type: "checkbox",
                                checked: form.fbShipping,
                                onChange: (e) => set("fbShipping", e.target.checked),
                                className: "w-4 h-4 rounded border border-border/60 accent-primary",
                                "data-ocid": "new-listing-modal.fb_shipping.checkbox"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground font-mono", children: "Seller Ships" })
                          ] })
                        ]
                      }
                    ),
                    platform === "mecari" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: `space-y-3 p-3 border rounded-lg ${PLATFORM_CONFIG.mecari.sectionClass}`,
                        "data-ocid": "new-listing-modal.mecari_section",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold font-display text-pink-300 tracking-wide", children: "🏯 Mercari Options" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "label",
                              {
                                htmlFor: "nlm-mecari-brand",
                                className: "text-xs font-semibold text-muted-foreground font-mono mb-1.5 block",
                                children: [
                                  "Brand ",
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "* Required" })
                                ]
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "input",
                              {
                                id: "nlm-mecari-brand",
                                type: "text",
                                placeholder: "Brand name",
                                value: form.mecariBrand,
                                onChange: (e) => set("mecariBrand", e.target.value),
                                className: `${INPUT_CLASS} ${!form.mecariBrand.trim() ? "border-destructive/40" : ""}`,
                                "data-ocid": "new-listing-modal.mecari_brand.input"
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "label",
                              {
                                htmlFor: "nlm-mecari-condition",
                                className: "text-xs font-semibold text-muted-foreground font-mono mb-1.5 block",
                                children: "Condition (1–5 scale)"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "select",
                              {
                                id: "nlm-mecari-condition",
                                value: form.mecariCondition,
                                onChange: (e) => set("mecariCondition", e.target.value),
                                className: SELECT_CLASS,
                                "data-ocid": "new-listing-modal.mecari_condition.select",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "1", children: "1️⃣ New" }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2", children: "2️⃣ Like New" }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "3", children: "3️⃣ Good" }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "4", children: "4️⃣ Fair" }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "5", children: "5️⃣ Poor" })
                                ]
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "label",
                              {
                                htmlFor: "nlm-mecari-delivery",
                                className: "text-xs font-semibold text-muted-foreground font-mono mb-1.5 block",
                                children: "Delivery Days (1–7)"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "select",
                              {
                                id: "nlm-mecari-delivery",
                                value: form.mecariDeliveryDays,
                                onChange: (e) => set("mecariDeliveryDays", e.target.value),
                                className: SELECT_CLASS,
                                "data-ocid": "new-listing-modal.mecari_delivery.select",
                                children: [1, 2, 3, 4, 5, 6, 7].map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: String(d), children: [
                                  d,
                                  " day",
                                  d > 1 ? "s" : ""
                                ] }, d))
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "label",
                              {
                                htmlFor: "nlm-mecari-shipping",
                                className: "text-xs font-semibold text-muted-foreground font-mono mb-1.5 block",
                                children: "Shipping Type"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "select",
                              {
                                id: "nlm-mecari-shipping",
                                value: form.mecariShippingType,
                                onChange: (e) => set("mecariShippingType", e.target.value),
                                className: SELECT_CLASS,
                                "data-ocid": "new-listing-modal.mecari_shipping.select",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "normal", children: "📦 Normal (2–4 days)" }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "fast", children: "🚀 Fast (1–2 days)" }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "same-day", children: "⚡ Same Day" })
                                ]
                              }
                            )
                          ] })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2 border-t border-border/40", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "outline",
                          className: "flex-1 font-mono text-xs border-border/60 hover:bg-secondary/60",
                          onClick: () => setStep("platform"),
                          disabled: createMutation.isPending,
                          "data-ocid": "new-listing-modal.back.button",
                          children: "Back"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          className: "flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-display font-bold text-xs gap-1.5 glow-yellow-sm",
                          onClick: () => createMutation.mutate(),
                          disabled: !canSubmit || createMutation.isPending,
                          "data-ocid": "new-listing-modal.submit_button",
                          children: createMutation.isPending ? "Creating…" : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                            "Create Listing"
                          ] })
                        }
                      )
                    ] })
                  ]
                }
              )
            ) })
          ]
        }
      )
    }
  );
}
function nsToMs(ns) {
  if (typeof ns === "bigint") return Number(ns) / 1e6;
  return ns > 1e15 ? ns / 1e6 : ns;
}
function formatCompactTime(msRemaining) {
  if (msRemaining <= 0) return "EXPIRED";
  const totalSecs = Math.floor(msRemaining / 1e3);
  const days = Math.floor(totalSecs / (24 * 3600));
  const rem = totalSecs % (24 * 3600);
  const hours = Math.floor(rem / 3600);
  const mins = Math.floor(rem % 3600 / 60);
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  parts.push(`${mins}m`);
  return parts.join(" ");
}
const DATE_FILTER_META = {
  all: { label: "All Time", icon: "📅" },
  today: { label: "Today", icon: "📍" },
  week: { label: "This Week", icon: "📆" },
  month: { label: "This Month", icon: "📊" }
};
function filterByDateRange(listings, filter) {
  if (filter === "all") return listings;
  const now = Date.now();
  const DAY_MS = 24 * 60 * 60 * 1e3;
  return listings.filter((l) => {
    const ageMs = now - nsToMs(l.createdAt);
    switch (filter) {
      case "today":
        return ageMs <= DAY_MS;
      case "week":
        return ageMs <= 7 * DAY_MS;
      case "month":
        return ageMs <= 30 * DAY_MS;
      default:
        return true;
    }
  });
}
function CompactCountdown({ expirationDate, tierName }) {
  const expMs = nsToMs(expirationDate);
  const [msRemaining, setMsRemaining] = reactExports.useState(() => expMs - Date.now());
  reactExports.useState(() => {
    const tick = () => setMsRemaining(expMs - Date.now());
    const id = setInterval(tick, 6e4);
    return () => clearInterval(id);
  });
  const timeStr = formatCompactTime(msRemaining);
  const isExpired = msRemaining <= 0;
  const isLow = msRemaining > 0 && msRemaining < 7 * 24 * 60 * 60 * 1e3;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-mono ${isExpired ? "border-destructive/60 bg-destructive/10 text-destructive" : isLow ? "border-accent/60 bg-accent/10 text-accent" : "border-primary/40 bg-primary/10 text-primary"}`,
      "data-ocid": "compact-countdown-banner",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "⏱" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `font-bold tracking-wide ${isExpired ? "animate-circuit-pulse" : ""}`,
            children: timeStr
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "remaining" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-1 text-muted-foreground", children: "·" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold tracking-widest uppercase text-[10px]", children: tierName })
      ]
    }
  );
}
function SkeletonGrid() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1.5", "data-ocid": "listings-skeleton", children: Array.from({ length: 9 }, (_, i) => `sk-${i}`).map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square rounded-md overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full h-full rounded-none" }) }, key)) });
}
function EmptyState({ tab, onNewListing }) {
  const config = {
    active: {
      icon: "📋",
      title: "Your archive is empty",
      desc: "Start capturing listings to build your reuse archive. Import once, copy forever.",
      cta: "Create your first listing",
      showCta: true
    },
    archived: {
      icon: "🗃",
      title: "No archived listings",
      desc: "Listings you archive will appear here for 30 days before deletion.",
      cta: "",
      showCta: false
    },
    favorites: {
      icon: "🤍",
      title: "No favorites yet",
      desc: "Tap ♡ on any listing to add it here.",
      cta: "",
      showCta: false
    }
  }[tab];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.4 },
      className: "flex flex-col items-center justify-center py-16 px-6 text-center",
      "data-ocid": `empty-state-${tab}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-5xl mb-4", children: config.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-base font-bold text-foreground text-glow-blue mb-2", children: config.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs leading-relaxed mb-6", children: config.desc }),
        config.showCta && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: onNewListing,
            className: "gap-2 bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow font-display font-bold tracking-wide",
            "data-ocid": "create-first-listing-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              config.cta
            ]
          }
        )
      ]
    }
  );
}
function ListingsGrid({ listings }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1.5", "data-ocid": "listings-grid", children: listings.map((listing, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    ListingCard,
    {
      listing,
      index
    },
    listing.id.toString()
  )) });
}
function TabBar({
  activeTab,
  onTabChange,
  activeCnt,
  archivedCnt,
  favoritesCnt
}) {
  const tabs = [
    {
      key: "active",
      label: "Active",
      count: activeCnt,
      textClass: "text-foreground"
    },
    {
      key: "archived",
      label: "Archived",
      count: archivedCnt,
      textClass: "text-accent"
    },
    {
      key: "favorites",
      label: "Favorites",
      count: favoritesCnt,
      textClass: "text-accent"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "flex border-b border-border/40 mb-4",
      role: "tablist",
      "data-ocid": "tab-bar",
      children: tabs.map(({ key, label, count, textClass }) => {
        const isActive = activeTab === key;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": isActive,
            className: `flex items-center gap-1.5 px-3 py-2.5 text-xs font-display font-bold tracking-wide transition-smooth relative ${isActive ? "text-primary" : `${textClass} opacity-70 hover:opacity-100`}`,
            onClick: () => onTabChange(key),
            "data-ocid": `tab-${key}`,
            children: [
              key === "favorites" && /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-3 w-3" }),
              label,
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `font-mono text-[10px] px-1 py-0.5 rounded ${isActive ? "bg-primary/20 text-primary" : "bg-muted/60 text-muted-foreground"}`,
                  children: count
                }
              ),
              isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  layoutId: "tab-indicator",
                  className: "absolute bottom-0 left-0 right-0 h-0.5 bg-primary glow-blue-sm rounded-t"
                }
              )
            ]
          },
          key
        );
      })
    }
  );
}
const LOW_FUEL_THRESHOLD = 20;
function DashboardPage() {
  const navigate = useNavigate();
  const { data: listings, isLoading: listingsLoading } = useListings();
  const { data: favoritedListings, isLoading: favoritesLoading } = useFavoritedListings();
  const { data: subscription } = useGetMySubscription();
  const { data: tiers } = useGetTiers();
  const checkLowFuel = useCheckLowFuelNotification();
  const [activeTab, setActiveTab] = reactExports.useState("active");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [bannerDismissed, setBannerDismissed] = reactExports.useState(false);
  const [lowFuelBannerDismissed, setLowFuelBannerDismissed] = reactExports.useState(false);
  const [platformFilter, setPlatformFilter] = reactExports.useState("all");
  const [sortOption, setSortOption] = reactExports.useState("newest");
  const [dateFilter, setDateFilter] = reactExports.useState("all");
  const [newListingModalOpen, setNewListingModalOpen] = reactExports.useState(false);
  const [universalListingModalOpen, setUniversalListingModalOpen] = reactExports.useState(false);
  const lowFuelCheckFiredRef = reactExports.useRef(false);
  const allListings = listings ?? [];
  const allFavorited = favoritedListings ?? [];
  const now = Date.now();
  const expirationMs = (subscription == null ? void 0 : subscription.expirationDate) ? nsToMs(subscription.expirationDate) : null;
  const isSubscriptionExpired = expirationMs !== null && expirationMs < now;
  const currentTier = tiers == null ? void 0 : tiers.find(
    (t) => Number(t.tierId) === Number((subscription == null ? void 0 : subscription.tier) ?? 1)
  );
  const tierName = (currentTier == null ? void 0 : currentTier.name) ?? "Time Walker";
  const tierNum = (subscription == null ? void 0 : subscription.tier) ? Math.min(3, Math.max(1, Number(subscription.tier))) : null;
  const fuelData = reactExports.useMemo(() => {
    if (!expirationMs || !tierNum) return null;
    return computeFuelFromExpiry(expirationMs, tierNum);
  }, [expirationMs, tierNum]);
  const fuelPercent = (fuelData == null ? void 0 : fuelData.fuelPercent) ?? 0;
  const isLowFuel = !isSubscriptionExpired && fuelPercent < LOW_FUEL_THRESHOLD && fuelPercent > 0;
  reactExports.useEffect(() => {
    if (isLowFuel && !lowFuelCheckFiredRef.current && expirationMs && subscription) {
      lowFuelCheckFiredRef.current = true;
      const expiryNs = BigInt(Math.round(expirationMs * 1e6));
      checkLowFuel.mutate({
        fuelPercent,
        subscriptionExpirationTimestamp: expiryNs
      });
    }
  }, [isLowFuel, expirationMs, subscription, fuelPercent, checkLowFuel]);
  const sortedActive = reactExports.useMemo(() => {
    let items = allListings.filter((l) => l.status === ListingStatus.active);
    items = filterByDateRange(items, dateFilter);
    if (platformFilter !== "all") {
      items = items.filter((l) => {
        const p = l.platform;
        if (!p) return false;
        const pStr = typeof p === "string" ? p.replace(/^#/, "") : typeof p === "object" ? Object.keys(p)[0] : "";
        return pStr === platformFilter;
      });
    }
    return items.sort((a, b) => {
      const aTime = Number(a.createdAt);
      const bTime = Number(b.createdAt);
      return sortOption === "newest" ? bTime - aTime : aTime - bTime;
    });
  }, [allListings, dateFilter, platformFilter, sortOption]);
  const sortedArchived = reactExports.useMemo(() => {
    return allListings.filter((l) => l.status === ListingStatus.archived).sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
  }, [allListings]);
  const sortedFavorites = reactExports.useMemo(() => {
    return [...allFavorited].sort((a, b) => {
      const aPin = a.pinned ? 1 : 0;
      const bPin = b.pinned ? 1 : 0;
      if (bPin !== aPin) return bPin - aPin;
      return Number(b.createdAt) - Number(a.createdAt);
    });
  }, [allFavorited]);
  function filterBySearch(items) {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (l) => l.title.toLowerCase().includes(q) || (l.description ?? "").toLowerCase().includes(q)
    );
  }
  const visibleListings = filterBySearch(
    activeTab === "active" ? sortedActive : activeTab === "archived" ? sortedArchived : sortedFavorites
  );
  const isLoading = listingsLoading || activeTab === "favorites" && favoritesLoading;
  const daysUntilDeletion2 = isSubscriptionExpired && expirationMs !== null ? Math.max(
    0,
    Math.floor(
      (expirationMs + 30 * 24 * 60 * 60 * 1e3 - now) / (1e3 * 60 * 60 * 24)
    )
  ) : null;
  const showRefuelBanner = !bannerDismissed && isSubscriptionExpired && sortedArchived.length > 0 && daysUntilDeletion2 !== null;
  const showLowFuelBanner = !lowFuelBannerDismissed && isLowFuel && !isSubscriptionExpired;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(MaintenanceBanner, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-screen-xl mx-auto px-3 sm:px-6 py-6",
        "data-ocid": "dashboard-page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground text-glow-blue", children: "Archive" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "ghost",
                  onClick: () => navigate({ to: "/upgrade" }),
                  className: "h-8 px-2 text-xs gap-1 border border-accent/30 text-accent hover:bg-accent/10 glow-yellow-sm font-display font-bold tracking-wide",
                  "data-ocid": "upgrade-tier-btn",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Upgrade" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  onClick: () => setUniversalListingModalOpen(true),
                  className: "h-8 gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow-sm font-display font-bold tracking-wide text-xs",
                  "data-ocid": "new-listing-btn",
                  children: "+ New Listing"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentBanners, {}),
          showRefuelBanner && /* @__PURE__ */ jsxRuntimeExports.jsx(
            RefuelBanner,
            {
              daysUntilDeletion: daysUntilDeletion2,
              onRefuel: () => navigate({ to: "/wallet" }),
              onDismiss: () => setBannerDismissed(true)
            }
          ),
          showLowFuelBanner && /* @__PURE__ */ jsxRuntimeExports.jsx(
            LowFuelWarningBanner,
            {
              onDismiss: () => setLowFuelBannerDismissed(true)
            }
          ),
          (subscription == null ? void 0 : subscription.expirationDate) && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:hidden mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CompactCountdown,
              {
                expirationDate: subscription.expirationDate,
                tierName
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "hidden sm:block mb-4",
                "data-ocid": "active-listings-countdown",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TimeCircuitsCountdown,
                  {
                    expirationDate: subscription.expirationDate,
                    label: "SUBSCRIPTION TIME REMAINING"
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-3", "data-ocid": "search-container", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                placeholder: "Search your listings...",
                className: "pl-8 h-9 bg-background border-border/60 focus:border-primary focus:ring-primary/30 font-mono text-xs placeholder:text-muted-foreground/60 transition-smooth",
                "data-ocid": "search-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TabBar,
            {
              activeTab,
              onTabChange: (tab) => {
                setActiveTab(tab);
                setPlatformFilter("all");
                setSortOption("newest");
                setDateFilter("all");
              },
              activeCnt: sortedActive.length,
              archivedCnt: sortedArchived.length,
              favoritesCnt: allFavorited.length
            }
          ),
          activeTab === "archived" && isSubscriptionExpired && expirationMs !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", "data-ocid": "archive-countdown", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TimeCircuitsCountdown,
              {
                expirationDate: expirationMs + 30 * 24 * 60 * 60 * 1e3,
                label: "⚠ ARCHIVE WINDOW — TIME UNTIL PERMANENT DELETION",
                forceRed: true
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-widest uppercase text-destructive mb-0.5", children: "🚗 Your DeLorean is out of gas!" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground leading-relaxed", children: "Refuel to restore your listings before they're permanently deleted." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  onClick: () => navigate({ to: "/wallet" }),
                  className: "shrink-0 bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow-sm font-display font-bold tracking-wide text-xs",
                  "data-ocid": "refuel-from-archive-btn",
                  children: "⛽ Refuel Now"
                }
              )
            ] })
          ] }),
          activeTab === "active" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex gap-2 flex-wrap",
                "data-ocid": "platform-filter-bar",
                children: ["all", "facebook", "mecari"].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setPlatformFilter(p),
                    className: `px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-smooth ${platformFilter === p ? p === "all" ? "bg-primary/20 text-primary border border-primary/50" : p === "facebook" ? "bg-blue-600/20 text-blue-300 border border-blue-500/50" : "bg-pink-600/20 text-pink-300 border border-pink-500/50" : "bg-muted/40 text-muted-foreground border border-border/40 hover:text-foreground hover:bg-muted/60"}`,
                    "data-ocid": `platform-filter.${p}.tab`,
                    children: p === "all" ? "All" : p === "facebook" ? "📘 Facebook" : "🏯 Mecari"
                  },
                  p
                ))
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 flex-wrap items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-mono uppercase tracking-widest", children: "Sort:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    value: sortOption,
                    onChange: (e) => setSortOption(e.target.value),
                    className: "px-2 py-1.5 rounded-md text-xs font-mono bg-secondary/50 border border-border/40 text-foreground focus:outline-none focus:border-primary/60 transition-smooth",
                    "data-ocid": "sort-select",
                    "aria-label": "Sort order",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "newest", children: "📥 Newest First" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "oldest", children: "📤 Oldest First" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3 text-muted-foreground shrink-0" }),
                ["all", "today", "week", "month"].map((f) => {
                  const { label, icon } = DATE_FILTER_META[f];
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setDateFilter(f),
                      className: `px-2.5 py-1.5 rounded-md text-xs font-mono font-semibold transition-smooth ${dateFilter === f ? "bg-accent/20 text-accent border border-accent/50" : "bg-muted/40 text-muted-foreground border border-border/40 hover:text-foreground hover:bg-muted/60"}`,
                      "data-ocid": `date-filter-${f}`,
                      children: [
                        icon,
                        " ",
                        label
                      ]
                    },
                    f
                  );
                })
              ] })
            ] })
          ] }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonGrid, {}) : visibleListings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              tab: activeTab,
              onNewListing: () => setNewListingModalOpen(true)
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ListingsGrid, { listings: visibleListings })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      NewListingModal,
      {
        isOpen: newListingModalOpen,
        onClose: () => setNewListingModalOpen(false)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      UniversalListingForm,
      {
        isOpen: universalListingModalOpen,
        onClose: () => setUniversalListingModalOpen(false)
      }
    )
  ] });
}
export {
  DashboardPage
};
