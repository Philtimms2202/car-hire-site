import { PortableText } from '@portabletext/react'

type PortableTextRendererProps = {
  content: any[]
}

const components = {
  block: {
    normal: ({ children }: any) => (
      <p className="text-gray-600 leading-relaxed mb-5 text-base">{children}</p>
    ),
    h2: ({ children }: any) => (
      <h2
        className="text-2xl font-bold mt-10 mb-4"
        style={{ color: '#232e4e' }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3
        className="text-xl font-bold mt-8 mb-3"
        style={{ color: '#232e4e' }}
      >
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4
        className="text-lg font-semibold mt-6 mb-2"
        style={{ color: '#232e4e' }}
      >
        {children}
      </h4>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-teal-400 pl-5 italic text-gray-500 my-6">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-semibold" style={{ color: '#232e4e' }}>
        {children}
      </strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-gray-700">{children}</em>
    ),
    link: ({ value, children }: any) => (
      
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline font-medium transition-colors"
        style={{ color: '#03989e' }}
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside space-y-2 mb-5 text-gray-600">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside space-y-2 mb-5 text-gray-600">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li className="leading-relaxed">{children}</li>
    ),
    number: ({ children }: any) => (
      <li className="leading-relaxed">{children}</li>
    ),
  },
}

export default function PortableTextRenderer({ content }: PortableTextRendererProps) {
  return (
    <div className="max-w-none">
      <PortableText value={content} components={components} />
    </div>
  )
}