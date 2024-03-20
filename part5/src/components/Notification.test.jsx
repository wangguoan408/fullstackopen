import { render, screen } from '@testing-library/react'
import Notification from './Notification'
import { expect } from 'vitest'

test('renders notification', () => {
  const notification = {
    message: 'notification test',
    type: 'info',
  }

  const { container } = render(<Notification notification={notification} />)

  const div = container.querySelector('.notification')
  expect(div).toHaveTextContent('notification test')
})
