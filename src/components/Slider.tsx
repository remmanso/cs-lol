import { useEffect, useRef } from "react";

const PRECISION = 1000;
export const Slider = ({ setValue }: { setValue?: (val: number) => void }) => {

  const containerRef = useRef<HTMLElement>(null);
  const slider = useRef<HTMLDivElement>(null);
  const thumbRatio = useRef<number>(0);
  const x = useRef(0);
  const width = useRef(0);
  const sliderWidth = useRef(0);
  const isDragging = useRef(false);

  const sanitizePosition = (position: number) =>
    Math.min(
      Math.max(
        !isNaN(position) ? position : 0,
        x.current
      ),
      (x.current + width.current)
    );

  const getRatioFromPosition = (position: number) => (position - x.current) * PRECISION / width.current;

  const handleValueChange = useRef((clientX: number) => {

    const position = sanitizePosition(clientX);
    thumbRatio.current = getRatioFromPosition(position);

    if (slider.current)
      slider.current.style.left = position - sliderWidth.current / 2 + "px";

    setValue?.(thumbRatio.current * 100 / PRECISION);
  });

  const updatePosition = useRef(() => {
    containerRef.current = document.getElementById("slider-container");
    if (!containerRef.current) return;

    const { x: newX, width: newWidth } = containerRef.current.getBoundingClientRect();
    const { width: newSliderWidth } = slider.current?.getBoundingClientRect() ?? { width: 0 };

    sliderWidth.current = newSliderWidth;
    x.current = newX;
    width.current = newWidth;

    if (newWidth > 0)
      handleValueChange.current(thumbRatio.current * newWidth / PRECISION + newX);
  });

  useEffect(() => {
    const mouseUp = stopThumb.current;
    const mouseMove = moveThumb.current;
    const updatePos = updatePosition.current;

    requestAnimationFrame(() => {
      updatePosition.current();
    })

    document.addEventListener("mouseup", mouseUp);
    document.addEventListener("mouseleave", mouseUp);
    document.addEventListener("mousemove", mouseMove);
    window.addEventListener("resize", updatePos);

    return () => {
      document.removeEventListener("mouseup", mouseUp);
      document.removeEventListener("mouseleave", mouseUp);
      document.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("resize", updatePos);
    }
  }, [])

  const handleMouseDown = useRef((mouseEvent: MouseEvent) => {
    if (mouseEvent.button !== 0) return;
    isDragging.current = true;
    handleValueChange.current(mouseEvent.clientX);
  });

  const moveThumb = useRef((mouseEvent: MouseEvent) => {
    if (!isDragging.current || mouseEvent.button !== 0) return;
    handleValueChange.current(mouseEvent.clientX);
  });

  const stopThumb = useRef(() => {
    isDragging.current = false;
  })

  return (
    <div
      id="slider-container"
      className="flex shrink overflow-visible items-center h-5 hover:cursor-pointer z-0 p-y-1"
      onMouseDown={(e) => handleMouseDown.current(e.nativeEvent)}
      onDragStart={(e) => e.preventDefault()}
      onDrop={(e) => e.preventDefault()}
    >
      <span className="bg-blue-200 min-h-1 min-w-full rounded-sm shadow-outline"></span>
      <div
        ref={slider}
        className="hover:cursor-pointer flex items-center absolute z-10"
        onMouseDown={(e) => handleMouseDown.current(e.nativeEvent)}
        onDragStart={(e) => e.preventDefault()}
        onDrop={(e) => e.preventDefault()}
      >
        <div className="relative rounded-full h-3.5 w-3.5 drop-shadow-lg border hover:bg-slate-300 bg-slate-200"></div>
      </div>
    </div >);
}