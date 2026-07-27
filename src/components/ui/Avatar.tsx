import Image from "next/image";

type AvatarProps = {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "busy" | null;
  className?: string;
  ring?: boolean;
};

const sizeMap = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-14 w-14",
};

const statusColor = {
  online: "bg-status-online",
  offline: "bg-muted-dark",
  busy: "bg-status-looking",
};

export function Avatar({
  src,
  alt,
  size = "md",
  status = null,
  className = "",
  ring = false,
}: AvatarProps) {
  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div
        className={`${sizeMap[size]} overflow-hidden rounded-full ${
          ring ? "ring-2 ring-status-online ring-offset-2 ring-offset-background" : ""
        }`}
      >
        <Image
          src={src}
          alt={alt}
          width={56}
          height={56}
          className="h-full w-full object-cover"
        />
      </div>
      {status ? (
        <span
          className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-surface ${statusColor[status]}`}
        />
      ) : null}
    </div>
  );
}
