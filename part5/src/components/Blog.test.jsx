import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Blog from './Blog'

describe('<Blog />', () => {
  let container
  const user = userEvent.setup()
  const updateBlog = vi.fn()

  beforeEach(() => {
    const blog = {
      title: 'this is a blog',
      author: 'lai',
      url: 'an url ...',
      likes: 5,
    }
    container = render(<Blog blog={blog} onUpdateBlog={updateBlog} />).container
  })

  test('by default, only display title and author', async () => {
    const titleElement = screen.queryByText(/this is a blog/)
    const authorElement = screen.queryByText(/lai/)
    const urlElement = screen.queryByText(/an url .../)
    const likesElement = screen.queryByText(/5/)

    expect(titleElement).toBeVisible()
    expect(authorElement).toBeVisible()
    expect(urlElement).not.toBeVisible()
    expect(likesElement).not.toBeVisible()
  })

  test('click `show` button, show all infos', async () => {
    // const user = userEvent.setup()
    const showButton = screen.getByText('show')
    await user.click(showButton)

    const urlElement = screen.queryByText(/an url .../)
    const likesElement = screen.queryByText(/5/)

    expect(urlElement).toBeVisible()
    expect(likesElement).toBeVisible()
  })

  // 不同的代码逻辑，无法进行测试
  // test('click `Like` button twice, likes add 2', async () => {
  //   // const user = userEvent.setup()
  //   const showButton = screen.getByText('show')
  //   await user.click(showButton)

  //   const likeButton = screen.getByText('Like')
  //   await user.click(likeButton)
  //   await user.click(likeButton)

  //   expect(updateBlog.mock.calls).toHaveLength(2)
  // })
})
