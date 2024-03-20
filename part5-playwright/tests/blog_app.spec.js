const { test, expect, beforeEach, describe } = require('@playwright/test')

const helper = require('./helper')
const exp = require('constants')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.locator('#username')).toBeVisible()
    await expect(page.locator('#password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await helper.loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await helper.loginWith(page, 'unknown', '123456')
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await helper.loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.locator('#title').fill('first blog')
      await page.locator('#author').fill('unknown')
      await page.locator('#url').fill('a url ...')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(
        page.getByText('a new blog "first blog" by unknown added')
      ).toBeVisible()
    })

    describe('When there are at least two blogs', () => {
      beforeEach(async ({ page }) => {
        await helper.loginWith(page, 'mluukkai', 'salainen')
        await helper.createBlog(page, 'first blog', 'unknown', 'an url ...')
        await helper.createBlog(page, 'second blog', 'unknown', 'an url ...')
      })

      test('only show title & author by default', async ({ page }) => {
        await expect(page.locator('//*[@id="blogs"]/div[1]')).toBeVisible()
        await expect(
          page.locator('//*[@id="blogs"]/div[1]/div/p[1]')
        ).not.toBeVisible()
        await expect(
          page.locator('//*[@id="blogs"]/div[1]/div/p[2]')
        ).not.toBeVisible()
      })

      test('press `show` to get details', async ({ page }) => {
        await expect(page.locator('//*[@id="blogs"]/div[1]')).toBeVisible()
        await page.locator('//*[@id="blogs"]/div[1]/button').click()

        await expect(
          page.locator('//*[@id="blogs"]/div[1]/div/p[1]')
        ).toBeVisible()
        await expect(
          page.locator('//*[@id="blogs"]/div[1]/div/p[2]')
        ).toBeVisible()
      })

      test('press `Like`, likes add one', async ({ page }) => {
        await page.locator('//*[@id="blogs"]/div[1]/button').click()

        const likesElement = page.locator('//*[@id="blogs"]/div[1]/div/p[2]')
        let likesEleText = await likesElement.innerText()
        const likesBefore = Number(likesEleText.split(' ')[1])

        await page.locator('//*[@id="blogs"]/div[1]/div/p[2]/button').click()
        // 强制等待 300ms
        await page.evaluate(
          () => new Promise((resolve) => setTimeout(resolve, 300))
        )

        likesEleText = await likesElement.innerText()
        const likesAfter = Number(likesEleText.split(' ')[1])

        expect(likesAfter).toBe(likesBefore + 1)
      })

      test('remove blog', async ({ page }) => {
        await page.locator('//*[@id="blogs"]/div[1]/button').click()
        // register a dialog handler before the action that triggers the dialog
        page.on('dialog', (dialog) => dialog.accept())
        await page.locator('//*[@id="blogs"]/div[1]/div/button').click()
        await expect(page.getByText(/first blog/)).not.toBeVisible()
      })

      test('blogs sorted by decreasing likes', async ({ page }) => {
        await page.locator('//*[@id="blogs"]/div[2]/button').click()
        await page.locator('//*[@id="blogs"]/div[2]/div/p[2]/button').click()
        // 强制等待 300ms
        await page.evaluate(
          () => new Promise((resolve) => setTimeout(resolve, 300))
        )

        const firstBlogText = await page
          .locator('//*[@id="blogs"]/div[1]')
          .innerText()
        expect(firstBlogText.split(' ')[0]).toBe('second')
      })
    })
  })
})
