import { notFound } from 'next/navigation'
import { auth } from '~/server/auth'

export default async function Home() {
  const session = await auth()

  if (!session) {
    notFound()
  }

  return <div>hi</div>
}
