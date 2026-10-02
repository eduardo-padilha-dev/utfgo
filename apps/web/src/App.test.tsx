import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('scaffold', () => {
  it('renders the generated app and updates its sample counter', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'count is 0' }))
    expect(screen.getByRole('button', { name: 'count is 1' })).toBeInTheDocument()
  })
})
