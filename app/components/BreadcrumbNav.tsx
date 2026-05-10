import Link from 'next/link'

type Crumb = {
  label: string
  href?: string
}

type BreadcrumbNavProps = {
  crumbs: Crumb[]
}

export default function BreadcrumbNav({ crumbs }: BreadcrumbNavProps) {
  return (
    <nav aria-label="Breadcrumb" className="w-full">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1
          return (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && (
                <span className="text-gray-300 select-none" aria-hidden="true">
                  /
                </span>
              )}
              {isLast || !crumb.href ? (
                <span
                  className="font-medium"
                  style={{ color: '#232e4e' }}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="hover:underline transition-colors"
                  style={{ color: '#03989e' }}
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}