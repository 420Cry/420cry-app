import { JSX } from 'react'

export default async function Dashboard(): Promise<JSX.Element> {
  return (
    <div>
      <h1>Welcome, payload.email!</h1>
      <p>User ID: payload.uuid</p>
    </div>
  )
}
