'use client'

import { useAtomValue } from 'jotai'
import { Button } from '~/components/ui/button'
import { currentGameAtom } from '~/lib/store'
import { api } from '~/trpc/react'

export function Unlock() {
  const currentGame = useAtomValue(currentGameAtom)

  const { mutate } = api.game.unlockGame.useMutation({
    onSuccess: (data) => {
      console.log('success', { data })
    },
  })

  if (currentGame === null) {
    return null
  }

  return (
    <div className="flex items-center justify-center">
      <Button onClick={() => mutate({ id: currentGame.id })}>允許重新擲骰</Button>
    </div>
  )
}
