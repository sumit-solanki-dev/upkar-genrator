import type { ServiceIcon as ServiceIconName } from "~/data/services";

interface ServiceIconProps {
  name: ServiceIconName;
}

export function ServiceIcon({ name }: ServiceIconProps) {
  const commonProps = {
    "aria-hidden": true,
    className: "size-7",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
  };

  switch (name) {
    case "installation":
      return (
        <svg {...commonProps}>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a3 3 0 0 1-4.2 4.2l-.6-.4L8 18H5v-3l8.7-8.7-.4-.6a3 3 0 0 1 4.2-4.2Z" />
          <path d="m3 21 4-4" />
        </svg>
      );
    case "maintenance":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8.5 12 2.2 2.2 4.8-5" />
        </svg>
      );
    case "assessment":
      return (
        <svg {...commonProps}>
          <path d="M4 20V5" />
          <path d="M4 20h16" />
          <path d="M8 16v-3M13 16V8M18 16v-6" />
        </svg>
      );
    case "breakdown":
      return (
        <svg {...commonProps}>
          <path d="m13 2-9 12h8l-1 8 9-12h-8l1-8Z" />
        </svg>
      );
    case "contract":
      return (
        <svg {...commonProps}>
          <path d="M7 3h10a2 2 0 0 1 2 2v16H5V5a2 2 0 0 1 2-2Z" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      );
    case "commissioning":
      return (
        <svg {...commonProps}>
          <path d="M4 5h16v14H4z" />
          <path d="m9 14 3-3 3 3M12 11v6" />
        </svg>
      );
  }
}
