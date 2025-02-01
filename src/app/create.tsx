'use client'

import { useAtom } from 'jotai'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { currentGameAtom } from '~/lib/store'
import { api } from '~/trpc/react'

export function Create({ baseUrl }: { baseUrl: string }) {
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
      toast.success('成功複製網址')
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
