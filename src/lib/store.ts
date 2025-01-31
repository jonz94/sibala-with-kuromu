import { atom } from 'jotai'
import { type SelectAttempt, type SelectGame } from '~/server/db/schema'

export const currentGameAtom = atom<SelectGame | null>(null)

export const latestAttemptAtom = atom<SelectAttempt | null>(null)
