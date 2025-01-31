'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Button } from '~/components/ui/button'

enum Error {
  Configuration = 'Configuration',
  AccessDenied = 'AccessDenied',
}

const errorMap = {
  [Error.Configuration]: (
    <p>
      There was a problem when trying to authenticate. Please contact us if this error persists. Unique error code:{' '}
      <code className="rounded-sm bg-slate-100 p-1 text-xs">Configuration</code>
    </p>
  ),
  [Error.AccessDenied]: (
    <div className="flex flex-col text-left">
      <h2 className="mb-4 text-center">此帳號沒有在管理員白名單內！</h2>
      <p>如果你是庫庫或是庫庫的管理員，</p>
      <p>請聯絡幽浮幫你把帳號加到白名單上，謝謝～</p>
    </div>
  ),
}

function ErrorCard() {
  const search = useSearchParams()
  const error = search.get('error') as Error

  return (
    <div className="block max-w-sm rounded-lg border bg-muted p-6 text-center shadow">
      <h1 className="mb-2 flex flex-row items-center justify-center gap-2 text-xl font-bold tracking-tight ">
        發生錯誤
      </h1>
      <div className="font-normal">{errorMap[error] || 'QQ'}</div>

      <Button className="mt-4" asChild>
        <Link href="/">返回首頁</Link>
      </Button>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <Suspense>
        <ErrorCard />
      </Suspense>
    </div>
  )
}
