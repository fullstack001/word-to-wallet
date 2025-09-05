import Image from "next/image";

export default function PolicyLinks() {
  const links = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Contact Us", href: "/contact" },
    { label: "Subscription Terms", href: "/subscription-terms" },
  ];

  return (
    <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-4 gap-y-2 text-sm">
      {links.map((link, index) => (
        <div key={link.href} className="flex items-center">
          <a href={link.href} className="hover:text-gray-300 transition-colors">
            {link.label}
          </a>
          {index < links.length - 1 && (
            <span className="ml-4 text-gray-400">|</span>
          )}
        </div>
      ))}
    </div>
  );
}
