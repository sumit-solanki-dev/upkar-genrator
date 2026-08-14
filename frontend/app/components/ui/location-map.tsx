import { company } from "~/data/company";

type LocationMapProps = {
  className?: string;
  title: string;
};

export function LocationMap({ className = "", title }: LocationMapProps) {
  return (
    <div
      className={`relative isolate overflow-hidden bg-slate-200 ${className}`}
    >
      <iframe
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
        height="100%"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        src={company.location.mapEmbedUrl}
        title={title}
        width="100%"
      />
    </div>
  );
}
