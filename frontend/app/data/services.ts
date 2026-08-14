export type ServiceIcon =
  | "installation"
  | "maintenance"
  | "assessment"
  | "breakdown"
  | "contract"
  | "commissioning";

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: ServiceIcon;
}

export const services: readonly Service[] = [
  {
    id: "installation",
    title: "Generator installation",
    description:
      "Site review, foundation planning, electrical integration, and commissioning support for a new diesel generator installation.",
    icon: "installation",
  },
  {
    id: "preventive-maintenance",
    title: "Preventive maintenance",
    description:
      "Scheduled inspections and routine service covering fluids, filters, cooling, starting systems, and electrical checks.",
    icon: "maintenance",
  },
  {
    id: "load-assessment",
    title: "Load assessment",
    description:
      "A practical review of connected loads and operating needs to help identify an appropriate generator capacity.",
    icon: "assessment",
  },
  {
    id: "breakdown-support",
    title: "Breakdown support",
    description:
      "Fault assessment and repair support for generator breakdowns, subject to location, technician, and parts availability.",
    icon: "breakdown",
  },
  {
    id: "annual-maintenance",
    title: "Annual maintenance contracts",
    description:
      "Planned service arrangements tailored to equipment, usage, site conditions, and the agreed maintenance scope.",
    icon: "contract",
  },
  {
    id: "commissioning",
    title: "Generator commissioning",
    description:
      "Startup checks, controls review, operating tests, and handover support before a generator enters regular service.",
    icon: "commissioning",
  },
] as const;
