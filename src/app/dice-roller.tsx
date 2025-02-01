'use client'

import { getDefaultStore, useSetAtom } from 'jotai'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'
import { latestAttemptAtom } from '~/lib/store'
import { cn } from '~/lib/utils'
import { api } from '~/trpc/react'

function getDotPositions(value: number) {
  const positions = {
    center: value === 1 || value === 3 || value === 5,
    topLeft: value >= 4,
    topRight: value >= 2,
    middleLeft: value === 6,
    middleRight: value === 6,
    bottomLeft: value >= 2,
    bottomRight: value >= 4,
  }
  return positions
}

const defaultStore = getDefaultStore()
let previousAttempt = defaultStore.get(latestAttemptAtom)

export function DiceRoller({ id, code }: { id: number; code: string }) {
  const [dice, setDice] = useState([0, 0, 0, 0])
  const [isRolling, setIsRolling] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const setLatestAttempt = useSetAtom(latestAttemptAtom)

  const rollDice = useCallback(
    (finalResults: number[]) => {
      setShowResult(false)
      setIsRolling(true)

      const rolls = 15
      let count = 0

      const rollInterval = setInterval(() => {
        if (count < rolls - 1) {
          // Random rolls for animation
          setDice(dice.map(() => Math.floor(Math.random() * 6) + 1))
        } else {
          setDice(finalResults)
          setShowResult(true)
        }

        count++
        if (count >= rolls) {
          clearInterval(rollInterval)
          setIsRolling(false)
        }
      }, 100)
    },
    [dice],
  )

  useEffect(() => {
    return defaultStore.sub(latestAttemptAtom, () => {
      const currentAttempt = defaultStore.get(latestAttemptAtom)
      if (!currentAttempt) {
        return
      }

      if (previousAttempt?.createdAt === currentAttempt.createdAt) {
        return
      }

      previousAttempt = currentAttempt
      rollDice([currentAttempt.dice1, currentAttempt.dice2, currentAttempt.dice3, currentAttempt.dice4])
      console.count('roll dice')
    })
  }, [rollDice])

  const play = api.game.play.useMutation({
    onSuccess: (data) => {
      console.log('success', { data })
      if (!data) {
        return
      }

      setLatestAttempt(data)
    },
  })

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="grid grid-cols-2 gap-4">
        {dice.map((value, index) => (
          <Die key={index} value={value} />
        ))}
      </div>

      <div className="flex flex-col items-center gap-4">
        <Button onClick={() => play.mutate({ id, code })} disabled={isRolling} className="px-8 py-2 text-lg">
          十八啦！
        </Button>

        {showResult ? (
          <p>本次骰出 {dice.join('、')}</p>
        ) : (
          <p className={(dice.at(0) ?? 0) === 0 ? 'invisible' : ''}>擲骰中...</p>
        )}
      </div>
    </div>
  )
}

function Die({ value }: { value: number }) {
  const dots = getDotPositions(value)

  return (
    <div
      className={cn(
        'relative size-20 rounded-2xl border-2 bg-white',
        // isRolling ? 'animate-bounce' : '',
      )}
    >
      {dots.center && (
        <div
          className={cn(
            `absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full`,
            value === 1 || value === 4 ? 'bg-red-500' : 'bg-black',
            value === 1 && 'size-6',
          )}
        />
      )}
      {dots.topLeft && (
        <div
          className={cn(
            `absolute left-3 top-3 size-4 rounded-full`,
            value === 1 || value === 4 ? 'bg-red-500' : 'bg-black',
          )}
        />
      )}
      {dots.topRight && (
        <div
          className={cn(
            `absolute right-3 top-3 size-4 rounded-full`,
            value === 1 || value === 4 ? 'bg-red-500' : 'bg-black',
          )}
        />
      )}
      {dots.middleLeft && (
        <div
          className={cn(
            `absolute left-3 top-1/2 size-4 -translate-y-1/2 rounded-full`,
            value === 1 || value === 4 ? 'bg-red-500' : 'bg-black',
          )}
        />
      )}
      {dots.middleRight && (
        <div
          className={cn(
            `absolute right-3 top-1/2 size-4 -translate-y-1/2 rounded-full`,
            value === 1 || value === 4 ? 'bg-red-500' : 'bg-black',
          )}
        />
      )}
      {dots.bottomLeft && (
        <div
          className={cn(
            `absolute bottom-3 left-3 size-4 rounded-full`,
            value === 1 || value === 4 ? 'bg-red-500' : 'bg-black',
          )}
        />
      )}
      {dots.bottomRight && (
        <div
          className={cn(
            `absolute bottom-3 right-3 size-4 rounded-full`,
            value === 1 || value === 4 ? 'bg-red-500' : 'bg-black',
          )}
        />
      )}
    </div>
  )
}
