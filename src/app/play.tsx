'use client'

import { useSearchParams } from 'next/navigation'
import { DiceRoller } from '~/app/dice-roller'
import { api } from '~/trpc/react'

export function Play() {
  const search = useSearchParams()
  const id = search.get('id')
  const code = search.get('code')

  if (id === null || code === null) {
    return <div>等待邀請</div>
  }

  return <Check id={Number(id)} code={code} />
}

function Check({ id, code }: { id: number; code: string }) {
  const { data, isLoading, error } = api.game.check.useQuery({ id, code })

  if (isLoading) {
    return <div>載入遊戲資訊...</div>
  }

  if (error) {
    return <div>找不到該場次，請重新輸入連結</div>
  }

  if (data) {
    return (
      <div>
        <p className="text-center">
          已進入場次 <code>{id}</code>
        </p>

        <DiceRoller id={id} code={code} />
      </div>
    )
  }
}
