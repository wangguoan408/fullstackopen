import { Page } from '@playwright/test'

const loginWith = async (page: Page, username: string, password: string) => {
  await page.locator('#username').fill(username)
  await page.locator('#password').fill(password)
  await page.getByRole('button', { name: 'Login' }).click()
}

const createBlog = async (
  page: Page,
  title: string,
  author: string,
  url: string
) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.locator('#title').fill(title)
  await page.locator('#author').fill(author)
  await page.locator('#url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByText(`${title} ${author}`).waitFor()
}

export { loginWith, createBlog }
