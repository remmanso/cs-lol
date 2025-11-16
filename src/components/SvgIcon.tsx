import type { IconsType } from "../icons/icons";

export default function SvgIcon({
  name,
  prefix = "icon",
  color = "currentColor",
  hasAction = false,
  style,
  ...props
}: {
  [x: string]: unknown;
  name: IconsType;
  prefix?: string | undefined;
  color?: string;
  hasAction?: boolean;
  style?: React.CSSProperties;
}) {
  const symbolId = `#${prefix}-${name}`;
  const fullStyle = hasAction ? { ...style, cursor: "pointer" } : style;

  return (
    <svg {...props} color={color} aria-hidden="true" style={fullStyle} name={name}>
      <use href={symbolId} />
    </svg>
  );
}
