import { redirect } from 'next/navigation'
import { ModeToggle } from '~/components/mode-toggle'
import { Button } from '~/components/ui/button'
import { auth, signIn } from '~/server/auth'
import { HydrateClient } from '~/trpc/server'

export default async function Login() {
  const session = await auth()

  if (session) {
    redirect('/')
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center">
        <div className="container flex flex-col items-center gap-6 px-4 pt-16">
          <h1 className="flex items-center gap-1 text-xl font-semibold">
            <span>
              <picture>
                <img src="https://cdn.discordapp.com/emojis/1069542717253758987.png" alt="cathehe" className="size-7" />
              </picture>
            </span>
            <span>貓草窩大賭場</span>
          </h1>

          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center justify-center gap-4">
              <SignIn />
            </div>
          </div>
        </div>
      </main>

      <div className="fixed right-4 top-4">
        <ModeToggle />
      </div>
    </HydrateClient>
  )
}

function SignIn() {
  return (
    <form
      action={async () => {
        'use server'
        await signIn('discord')
      }}
    >
      <Button variant="secondary" type="submit">
        管理員登入 (透過 DC 驗證身份)
      </Button>
    </form>
  )
}
