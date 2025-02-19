import { Create } from '~/app/create'
import { Play } from '~/app/play'
import { Preview } from '~/app/preview'
import { Unlock } from '~/app/unlock'
import { ModeToggle } from '~/components/mode-toggle'
import { Button } from '~/components/ui/button'
import { env } from '~/env'
import { auth, signOut } from '~/server/auth'
import { HydrateClient } from '~/trpc/server'

export default async function Home() {
  const baseUrl = env.BASE_URL

  const session = await auth()

  return (
    <HydrateClient>
      <main className="flex min-h-dvh flex-col items-center">
        <div className="container flex flex-1 flex-col items-center gap-6 px-4 pb-4 pt-16">
          <h1 className="flex items-center gap-1 text-xl font-semibold">
            <span>
              <picture>
                <img src="https://cdn.discordapp.com/emojis/1069542717253758987.png" alt="cathehe" className="size-7" />
              </picture>
            </span>
            <span>貓草窩大賭場</span>
          </h1>

          {session ? (
            <div>
              <Preview />
              <Unlock />
            </div>
          ) : (
            <Play />
          )}

          <div className="flex flex-1 flex-col items-center gap-2">
            <div className="flex flex-1 flex-col items-center justify-center gap-4">
              {session && <Create baseUrl={baseUrl} />}

              {session && (
                <div className="mt-auto flex flex-col gap-y-4">
                  <p>成功以管理員身份登入</p>
                  <p className="flex gap-x-2 text-center text-2xl">
                    <picture className="size-8">
                      <img src={session.user.image ?? ''} alt="" />
                    </picture>
                    <span>{session.user?.name}</span>
                  </p>
                </div>
              )}

              {session ? <SignOut /> : null}
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
