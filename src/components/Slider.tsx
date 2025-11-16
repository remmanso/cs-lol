import { useEffect, useRef } from "react";
import "twin.macro";
import { PRECISION } from "../utils/utils";

const sanitizePosition = (position: number, width: number) => {
  return Math.min(Math.max(!isNaN(position) ? position : 0, 0), width);
};

const getRatioFromPosition = (position: number, width: number) => (position * PRECISION) / width;

export const Slider = ({ setValue }: { setValue?: (val: number) => void }) => {
  const containerRef = useRef<HTMLElement>(null);
  const slider = useRef<HTMLDivElement>(null);
  const thumbRatio = useRef<number>(0);
  const isDragging = useRef(false);

  const handleValueChange = useRef((clientX: number, isResize?: boolean) => {
    if (!containerRef.current || !slider.current) return;

    const { x, width } = containerRef.current.getBoundingClientRect();
    const { width: sliderWidth } = slider.current.getBoundingClientRect();
    const position = sanitizePosition(clientX - (isResize ? 0 : x), width);

    thumbRatio.current = getRatioFromPosition(position, width);

    if (slider.current) slider.current.style.left = position - sliderWidth / 2 + "px";
    if (!isResize) setValue?.((thumbRatio.current * 100) / PRECISION);
  });

  const updatePosition = useRef(() => {
    if (!containerRef.current || !slider.current) return;

    const { width } = containerRef.current.getBoundingClientRect();
    handleValueChange.current((thumbRatio.current * width) / PRECISION, true);
  });

  useEffect(() => {
    const stopDraging = stopDraggingThumb.current;
    const dragThumb = moveThumb.current;
    const updatePos = updatePosition.current;

    containerRef.current = document.getElementById("slider-container");
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
    handleValueChange.current(mouseEvent.x);
  });

  const moveThumb = useRef((mouseEvent: PointerEvent | DragEvent | MouseEvent) => {
    if (
      !isDragging.current ||
      (mouseEvent instanceof PointerEvent && mouseEvent.pointerType === "mouse" && mouseEvent.button !== 0)
    )
      return;
    handleValueChange.current(mouseEvent.x);
  });

  const stopDraggingThumb = useRef(() => {
    isDragging.current = false;
  });

  return (
    <div tw="px-1 touch-none">
      <div
        id="slider-container"
        tw="relative flex h-5 shrink items-center hover:cursor-pointer"
        onPointerDown={(e) => handlePointerDown.current(e.nativeEvent)}
      >
        <span tw="absolute left-0 right-0 h-1.5 rounded-sm bg-lol-accent shadow"></span>
        <div
          ref={slider}
          tw="relative flex items-center hover:cursor-pointer"
          onPointerDown={(e) => handlePointerDown.current(e.nativeEvent)}
        >
          <div tw="h-4 w-4 rounded-full border bg-slate-200 drop-shadow-lg hover:bg-slate-400"></div>
        </div>
      </div>
    </div>
  );
};
