import { useResizeObserver } from "../hooks/useResizeObserver";

export function SizeObserver({
  onResize,
  children
}) {
  const {attachResizeObserver, detachResizeObserver} = useResizeObserver(onResize);
  return children(attachResizeObserver, detachResizeObserver);
}
