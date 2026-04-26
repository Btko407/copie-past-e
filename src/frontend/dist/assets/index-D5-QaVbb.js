import { r as reactExports, ao as React } from "./index-jL7ZpINP.js";
import { u as useLayoutEffect2 } from "./index-n8xgZv8n.js";
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
