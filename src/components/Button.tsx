"use client";

export default function Button(
  props: React.ComponentPropsWithoutRef<"button"> & {
    classStyle?: "string";
  }
) {
  const { classStyle = "clickable", ...rest } = props;
  return <button {...rest} className={classStyle}></button>;
}
