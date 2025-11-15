import { useEffect, useRef } from "react";
import { PRECISION } from "../utils/utils";
import "twin.macro";

export const Slider = ({ setValue }: { setValue?: (val: number) => void }) => {
  const containerRef = useRef<HTMLElement>(null);
  const slider = useRef<HTMLDivElement>(null);
  const thumbRatio = useRef<number>(0);
  const x = useRef(0);
  const width = useRef(0);
  const sliderWidth = useRef(0);
  const isDragging = useRef(false);

  const sanitizePosition = (position: number) => {
    return Math.min(Math.max(!isNaN(position) ? position : 0, 0), width.current);
  };

  const getRatioFromPosition = (position: number) => (position * PRECISION) / width.current;

  const handleValueChange = useRef((clientX: number) => {
    const position = sanitizePosition(clientX);
    thumbRatio.current = getRatioFromPosition(position);

    if (slider.current) slider.current.style.left = position - sliderWidth.current / 2 + "px";

    setValue?.((thumbRatio.current * 100) / PRECISION);
  });

  const updatePosition = useRef(() => {
    containerRef.current = document.getElementById("slider-container");
    if (!containerRef.current) return;

    const { x: newX, width: newWidth } = containerRef.current.getBoundingClientRect();
    const { width: newSliderWidth } = slider.current?.getBoundingClientRect() ?? { width: 0 };

    sliderWidth.current = newSliderWidth;
    x.current = newX;
    width.current = newWidth;

    if (newWidth > 0) handleValueChange.current((thumbRatio.current * newWidth) / PRECISION);
  });

  useEffect(() => {
    const stopDraging = stopDraggingThumb.current;
    const dragThumb = moveThumb.current;
    const updatePos = updatePosition.current;

    requestAnimationFrame(() => {
      updatePosition.current();
    });

    document.addEventListener("mouseup", stopDraging);
    document.addEventListener("mouseleave", stopDraging);
    document.addEventListener("mousemove", dragThumb);
    document.addEventListener("pointerup", stopDraging);
    document.addEventListener("pointerleave", stopDraging);
    document.addEventListener("pointermove", dragThumb);
    document.addEventListener("focusout", stopDraging);
    window.addEventListener("resize", updatePos);

    return () => {
      document.removeEventListener("pointerup", stopDraging);
      document.removeEventListener("pointerleave", stopDraging);
      document.removeEventListener("pointermove", dragThumb);
      document.removeEventListener("mouseup", stopDraging);
      document.removeEventListener("mouseleave", stopDraging);
      document.removeEventListener("focusout", stopDraging);
      document.removeEventListener("mousemove", dragThumb);
      window.removeEventListener("resize", updatePos);
    };
  }, []);

  const handlePointerDown = useRef((mouseEvent: PointerEvent | DragEvent | MouseEvent) => {
    if (mouseEvent instanceof PointerEvent && mouseEvent.pointerType === "mouse" && mouseEvent.button !== 0) return;
    isDragging.current = true;
    handleValueChange.current(mouseEvent.x - x.current);
  });

  const moveThumb = useRef((mouseEvent: PointerEvent | DragEvent | MouseEvent) => {
    if (
      !isDragging.current ||
      (mouseEvent instanceof PointerEvent && mouseEvent.pointerType === "mouse" && mouseEvent.button !== 0)
    )
      return;
    handleValueChange.current(mouseEvent.x - x.current);
  });

  const stopDraggingThumb = useRef(() => {
    isDragging.current = false;
  });

  return (
    <div tw="px-2 ">
      <div
        id="slider-container"
        tw="relative flex h-5 shrink items-center hover:cursor-pointer"
        onPointerDown={(e) => handlePointerDown.current(e.nativeEvent)}
        // onMouseDown={(e) => handlePointerDown.current(e.nativeEvent)}
        onDragStart={(e) => handlePointerDown.current(e.nativeEvent)}
        onDrop={stopDraggingThumb.current}
      >
        <span tw="absolute left-0 right-0 h-1.5 rounded-sm bg-lol-accent shadow"></span>
        <div
          ref={slider}
          tw="relative flex items-center hover:cursor-pointer"
          // onMouseDown={(e) => handlePointerDown.current(e.nativeEvent)}
          onPointerDown={(e) => handlePointerDown.current(e.nativeEvent)}
          onDragStart={(e) => handlePointerDown.current(e.nativeEvent)}
          onDrop={stopDraggingThumb.current}
        >
          <div tw="h-4 w-4 rounded-full border bg-slate-200 drop-shadow-lg hover:bg-slate-400"></div>
        </div>
      </div>
    </div>
  );
};
