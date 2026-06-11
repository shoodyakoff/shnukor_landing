type Contact = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const CONTACTS: Contact[] = [
  {
    label: "Telegram",
    href: "https://t.me/shnurokshipping",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-3.5 w-3.5">
        <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://api.whatsapp.com/message/DLHETCGMHKVKA1?autoload=1&app_absent=0",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-3.5 w-3.5">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
      </svg>
    ),
  },
  {
    label: "MAX",
    href: "https://max.ru/u/f9LHodD0cOLFvUTkfHci4_o1G4t2nXQbjRTdmGZZGuVd0ENlVUzUw0hvpd0",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="h-3.5 w-3.5">
        <path
          d="M12 2C6.48 2 2 5.86 2 10.62c0 2.55 1.28 4.84 3.3 6.4V22l3.66-2.05c.97.24 1.99.37 3.04.37 5.52 0 10-3.86 10-8.7C22 5.86 17.52 2 12 2z"
          fill="currentColor"
        />
        <path d="M13.2 6.5l-4.2 6.2h3.1l-1.1 4.3 4.4-6.4h-3.2l1-4.1z" fill="var(--lace)" />
      </svg>
    ),
  },
];

export function ContactLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex shrink-0 items-center gap-1.5 sm:gap-2 ${className}`}>
      {CONTACTS.map((contact) => (
        <a
          key={contact.label}
          href={contact.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={contact.label}
          title={contact.label}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-outsole bg-lace text-outsole shadow-[1.5px_1.5px_0_var(--outsole)] transition-all duration-150 hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-mesh hover:shadow-[1px_1px_0_var(--outsole)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mesh md:h-8 md:w-8"
        >
          {contact.icon}
        </a>
      ))}
    </div>
  );
}
