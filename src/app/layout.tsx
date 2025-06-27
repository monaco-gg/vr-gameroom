import GoogleAdsense from "@components/Ads/GoogleAdsense"

export const metadata = {
  title: 'Monaco - Game Room',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" translate="no" suppressHydrationWarning>
      <body>{children}</body>
      <GoogleAdsense pId="ca-pub-9746054923547036" />
    </html>
  )
}
