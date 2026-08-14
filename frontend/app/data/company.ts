export const company = {
  name: "UPKAR Generator",
  tagline: "Power You Can Trust",
  foundedYear: 2013,
  phone: {
    display: "+91 99262 77986",
    href: "tel:+919926277986",
  },
  email: {
    display: "info@upkargenerator.com",
    href: "mailto:info@upkargenerator.com",
  },
  website: "https://upkargenerator.com",
  location: {
    display: "Industrial Area, India",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3694.0073071475617!2d75.4694067!3d22.2018286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39626f9747c05419%3A0x5e733839d4504032!2sUpkar%20generator!5e0!3m2!1sen!2sin!4v1785756048465!5m2!1sen!2sin",
    directionsUrl: "https://maps.google.com/maps?q=Upkar+generator",
  },
  whatsappUrl:
    "https://wa.me/919926277986?text=Hello%20UPKAR%20Generator%2C%20I%20would%20like%20to%20discuss%20a%20generator%20requirement.",
  proofPoints: [
    {
      value: "13+",
      label: "Years of experience",
    },
    {
      value: "1,000+",
      label: "Generators delivered",
    },
  ],
} as const;

export const companyTimeline = [
  {
    year: "2013",
    title: "Company Founded",
    description: "UPKAR Generator established in Industrial Area, India.",
  },
  {
    year: "2016",
    title: "Product Range Expansion",
    description: "Extended capacity range from 15 KVA to 500 KVA models.",
  },
  {
    year: "2019",
    title: "Silent Generator Line",
    description:
      "Launched acoustic enclosure DG sets for noise-sensitive sites.",
  },
  {
    year: "2022",
    title: "Service Network Growth",
    description:
      "Expanded maintenance and AMC coverage across key regions.",
  },
] as const;

export const certifications = [
  "ISO 9001:2015 Quality Management",
  "CE Certification",
  "CPCB II Emission Norms",
] as const;

export const primaryNavigation = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

export const footerNavigation = [
  ...primaryNavigation,
  { label: "Privacy", to: "/privacy" },
] as const;

export const socialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Facebook", href: "https://facebook.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
] as const;
