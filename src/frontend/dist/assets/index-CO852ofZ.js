import { r as reactExports, am as React } from "./index-CAvEfu6s.js";
import { u as useLayoutEffect2 } from "./index-6DK8G6wP.js";
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
