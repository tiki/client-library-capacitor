import { Title, Usecase } from '.'

export interface License {
  id: string
  title: Title
  uses: Usecase[]
  terms: string
  timestamp: string
  description: string
  expiry: string
}