import { useEffect, useRef } from "react";

const precision = 1000;
export const Slider = ({ setValue }: { setValue?: (val: number) => void }) => {

  const containerRef = useRef<HTMLElement>(null);
  const slider = useRef<HTMLDivElement>(null);
  const sliderPosition = useRef<number>(0);
  const x = useRef(0);
  const width = useRef(0);
  const sliderWidth = useRef(0);
  const isDragging = useRef(false);

  const getPositionFromSliderPercent = (sliderPercent: number) => {
    return sliderPosition.current * width.current / precision - x.current;
  }

  const handleValueChange = useRef((newValue: number) => {
    const value = !isNaN(newValue) ? newValue : 0;
    const position = Math.min(Math.max(value, x.current), (x.current + width.current));

    sliderPosition.current = (position - x.current) * precision / width.current;

    if (slider.current)
      slider.current.style.left = position - sliderWidth.current / 2 + "px";

    setValue?.(sliderPosition.current * 100 / precision);
  });

  const updatePosition = useRef(() => {
    containerRef.current = document.getElementById("slider-container");
    if (!containerRef.current) return;

    const { x: newX, width: newWidth } = containerRef.current.getBoundingClientRect();
    const { width: newSliderWidth } = slider.current?.getBoundingClientRect() ?? { width: 0 };

    const hasChanged = x.current !== newX || newWidth !== width.current || newSliderWidth !== sliderWidth.current;

    if (!x.current || !width.current || !width.current) {
      sliderWidth.current = newSliderWidth;
      x.current = newX;
      width.current = newWidth;
    }

    if (hasChanged) {
      handleValueChange.current(getPositionFromSliderPercent(sliderPosition.current) * newWidth / precision);
      sliderWidth.current = newSliderWidth;
      x.current = newX;
      width.current = newWidth;
    }
  });

  useEffect(() => {
    const mouseUp = handleMouseUp.current;
    const mouseMove = handleMouseMove.current;
    const updatePos = updatePosition.current;

    requestAnimationFrame(() => {
      updatePosition.current();
    })

    document.addEventListener("mouseup", mouseUp);
    document.addEventListener("mousemove", mouseMove);
    window.addEventListener("resize", updatePos);
    document.addEventListener("mouseleave", mouseUp);

    return () => {
      document.removeEventListener("mouseup", mouseUp);
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseleave", mouseUp);
      window.removeEventListener("resize", updatePos);
    }
  }, [])

  const handleMouseDown = useRef((mouseEvent: MouseEvent) => {
    if (mouseEvent.button !== 0) return;
    isDragging.current = true;
  });

  const handleMouseMove = useRef((mouseEvent: MouseEvent) => {
    if (!isDragging.current || mouseEvent.button !== 0) return;
    handleValueChange.current(mouseEvent.clientX);
  });

  const handleMouseUp = useRef(() => {
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