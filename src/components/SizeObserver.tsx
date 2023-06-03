import { useCombinedRef } from "../hooks/useCombinedRef";
import { useResizeObserver } from "../hooks/useResizeObserver";

export function SizeObserver({
  onResize,
  children,
  nodeRef
}) {
  const resizeRef = useResizeObserver(onResize);
  const combinedRef = useCombinedRef(nodeRef, resizeRef);

  return children(combinedRef);
}
