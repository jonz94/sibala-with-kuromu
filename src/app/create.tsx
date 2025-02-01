'use client'

import { useAtom } from 'jotai'
import { Button } from '~/components/ui/button'
import { currentGameAtom } from '~/lib/store'
import { api } from '~/trpc/react'

export function Create() {
  const [currentGame, setCurrentGame] = useAtom(currentGameAtom)

  const { mutate } = api.game.createGame.useMutation({
    onSuccess: async (data) => {
      console.log('success')

      setCurrentGame(data.at(0) ?? null)
    },
  })

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      alert('複製成功')
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <>
      <Button onClick={() => mutate()}>建立新遊戲</Button>

      {currentGame && (
        <>
          <Button
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              const baseUrl = ((process.env as any)?.VERCEL_URL ?? 'http://localhost:3000') as string

              console.log({ baseUrl })

              const url = `${baseUrl}/?id=${currentGame.id}&code=${currentGame.code}`
              void handleCopy(url)
            }}
          >
            複製網址
          </Button>

          {/* <pre>{JSON.stringify(currentGame, null, 2)}</pre> */}
        </>
      )}
    </>
  )
}
