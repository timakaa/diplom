import Link from "next/link";

export default function FooterColumn({ title, links }) {
  return (
    <div className='space-y-4'>
      <h4 className='font-medium text-base'>{title}</h4>
      <ul className='space-y-2 text-sm'>
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className='text-muted-foreground hover:text-foreground'
            >
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
