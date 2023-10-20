import { FunctionComponent } from 'react'
import { Helmet } from 'react-helmet-async'

interface HelmetProps {
  title: string
}

export const Head: FunctionComponent<HelmetProps> = ({ title }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta property='og:title' content={title} />
      <meta name='twitter:title' content={title} />
    </Helmet>
  )
}
