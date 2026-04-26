import './globals.css'

export const metadata = {
  title: 'ProposeAI — Win more clients',
  description: 'AI-powered proposals that convert. Generate personalized, professional proposals in seconds.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
