import { Create } from '~/app/create'
import { Play } from '~/app/play'
import { Preview } from '~/app/preview'
import { Unlock } from '~/app/unlock'
import { ModeToggle } from '~/components/mode-toggle'
import { Button } from '~/components/ui/button'
import { auth, signIn, signOut } from '~/server/auth'
import { HydrateClient } from '~/trpc/server'

export default async function Home() {
  const session = await auth()

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-6 px-4 py-12">
          <h1 className="flex items-center gap-1 text-xl font-semibold">
            <span>貓草窩大賭場</span>
            <span>
              <picture>
                <img src="https://cdn.discordapp.com/emojis/1069542717253758987.png" alt="cathehe" className="size-7" />
              </picture>
            </span>
          </h1>

          {session ? (
            <div>
              <Preview />
              <Unlock />
            </div>
          ) : (
            <Play />
          )}

          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center justify-center gap-4">
              {session && <Create />}

              {session && (
                <div className="flex flex-col gap-y-4">
                  <p>成功以管理員身份登入</p>
                  <p className="flex gap-x-2 text-center text-2xl">
                    <picture className="size-8">
                      <img src={session.user.image ?? ''} alt="" />
                    </picture>
                    <span>{session.user?.name}</span>
                  </p>
                </div>
              )}

              {session ? <SignOut /> : <SignIn />}
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

function SignOut() {
  return (
    <form
      action={async () => {
        'use server'
        await signOut()
      }}
    >
      <Button variant="secondary" type="submit">
        登出
      </Button>
    </form>
  )
}
