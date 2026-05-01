import { r as reactExports, ar as React } from "./index-B_oOf7NU.js";
import { u as useLayoutEffect2 } from "./index-CIQ3w7QS.js";
var useReactId = React[" useId ".trim().toString()] || (() => void 0);
var count = 0;
function useId(deterministicId) {
  const [id, setId] = reactExports.useState(useReactId());
  useLayoutEffect2(() => {
    setId((reactId) => reactId ?? String(count++));
  }, [deterministicId]);
  return deterministicId || (id ? `radix-${id}` : "");
}
export {
  useId as u
};
