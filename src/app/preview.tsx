'use client'

import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { DiceRoller } from '~/app/dice-roller'
import { currentGameAtom, latestAttemptAtom } from '~/lib/store'
import { api } from '~/trpc/react'

export function Preview() {
  const currentGame = useAtomValue(currentGameAtom)

  if (currentGame === null) {
    return <div>等待建立新遊戲</div>
  }

  return (
    <div>
      <p className="text-center">
        目前場次 <code>{currentGame.id}</code>
      </p>

      <DiceRoller id={currentGame.id} code={currentGame.code} />
      <DataRefresher id={currentGame.id} />
    </div>
  )
}

function DataRefresher({ id }: { id: number }) {
  const setLatestAttemptAtom = useSetAtom(latestAttemptAtom)

  const { mutate } = api.game.getLatestAttempt.useMutation({
    onSuccess: (data) => {
      if (!data) {
        return
      }

      setLatestAttemptAtom(data)
    },
  })

  useEffect(() => {
    const interval = setInterval(() => {
      mutate({ gameId: id })
    }, 3000)

    return () => clearInterval(interval)
  }, [id, mutate])

  return null
}
