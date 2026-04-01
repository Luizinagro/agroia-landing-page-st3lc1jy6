import { useEffect } from 'react'

interface SEOProps {
  title: string
  description: string
  url?: string
}

export function SEO({
  title,
  description,
  url = 'https://agroia-landing-page-a72f6.goskip.app',
}: SEOProps) {
  useEffect(() => {
    document.title = `${title} | AgroIA`

    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description)
    }

    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', `${title} | AgroIA`)
    }

    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc) {
      ogDesc.setAttribute('content', description)
    }

    const ogUrl = document.querySelector('meta[property="og:url"]')
    if (ogUrl) {
      ogUrl.setAttribute('content', url)
    }
  }, [title, description, url])

  return null
}
