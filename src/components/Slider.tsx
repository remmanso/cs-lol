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
    const mouseUp = stopThumb.current;
    const mouseMove = moveThumb.current;
    const updatePos = updatePosition.current;

    requestAnimationFrame(() => {
      updatePosition.current();
    });

    document.addEventListener("mouseup", mouseUp);
    document.addEventListener("mouseleave", mouseUp);
    document.addEventListener("mousemove", mouseMove);
    window.addEventListener("resize", updatePos);

    return () => {
      document.removeEventListener("mouseup", mouseUp);
      document.removeEventListener("mouseleave", mouseUp);
      document.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("resize", updatePos);
    };
  }, []);

  const handleMouseDown = useRef((mouseEvent: MouseEvent) => {
    if (mouseEvent.button !== 0) return;
    isDragging.current = true;
    handleValueChange.current(mouseEvent.clientX - x.current);
  });

  const moveThumb = useRef((mouseEvent: MouseEvent) => {
    if (!isDragging.current || mouseEvent.button !== 0) return;
    handleValueChange.current(mouseEvent.clientX - x.current);
  });

  const stopThumb = useRef(() => {
    isDragging.current = false;
  });

  return (
    <div tw="px-2 ">
      <div
        id="slider-container"
        tw="relative flex h-5 shrink items-center hover:cursor-pointer"
        onMouseDown={(e) => handleMouseDown.current(e.nativeEvent)}
        onDragStart={(e) => e.preventDefault()}
        onDrop={(e) => e.preventDefault()}
      >
        <span tw="absolute left-0 right-0 h-1.5 rounded-sm bg-lol-accent shadow"></span>
        <div
          ref={slider}
          tw="relative flex items-center hover:cursor-pointer"
          onMouseDown={(e) => handleMouseDown.current(e.nativeEvent)}
          onDragStart={(e) => e.preventDefault()}
          onDrop={(e) => e.preventDefault()}
        >
          <div tw="h-4 w-4 rounded-full border bg-slate-200 drop-shadow-lg hover:bg-slate-400"></div>
        </div>
      </div>
    </div>
  );
};
