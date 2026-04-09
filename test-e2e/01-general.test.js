import { test, expect } from '@playwright/test'

test('Load a top level page', async ({ page }) => {
  const messages = []
  page.on('console', msg => messages.push(msg.text()))
  page.on('pageerror', err => messages.push(err.message))

  await page.goto('/')
  await page.waitForLoadState('networkidle')

  console.log('Console messages:', messages)

  await page.waitForFunction(() => window.cuts && window.VisualController)

  await page.evaluate(() => {
    const html = new window.VisualController()
    window.testHtml = html
    
    const testScene = {
      show: ({ task, dependencies }) => {
        console.log('show called')
        const { html } = dependencies
        html.publish(window.Red, {}, 'container')
        task.done()
      },
      hide: ({ task, dependencies }) => {
        console.log('hide called')
        const { html } = dependencies
        html.destroy('container')
        task.done()
      }
    }

    const script = window.cuts()
    script.enablePlugin(window.pluginClick)

    const root = document.getElementById('root')
    root.id = 'root2'
    html.publish(window.Dummy, {}, 'root2')

    console.log('Setting up scenes...')
    script.setDependencies({ html })
    script.setScenes([{ name: 'test', scene: testScene }])
    console.log('Calling show...')
    script.show({ scene: 'test' })
  })

  await page.waitForTimeout(200)

  const containerHTML = await page.locator('#container').innerHTML()
  console.log('Container HTML:', containerHTML)
  
  const hasContent = containerHTML.includes('red')
  expect(hasContent).toBe(true)
})

test('Load a deep level page', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await page.waitForFunction(() => window.cuts && window.VisualController)

  await page.evaluate(() => {
    window.render = false
    const html = new window.VisualController()
    window.testHtml = html
    
    const testScene = {
      show: ({ task, dependencies }) => {
        const { html } = dependencies
        html.publish(window.Red, {}, 'container')
        window.render = true
        task.done()
      },
      hide: ({ task, dependencies }) => {
        const { html } = dependencies
        html.destroy('container')
        task.done()
      },
      parents: ['blue'],
      'click:1-left': () => { window.click = true }
    }

    const bluePage = {
      show: ({ task, dependencies }) => {
        const { html } = dependencies
        html.publish(window.Blue, {}, 'blue')
        task.done()
      },
      hide: ({ task, dependencies }) => {
        const { html } = dependencies
        html.destroy('blue')
        task.done()
      },
      'click:left-1': () => {}
    }

    const script = window.cuts()
    script.enablePlugin(window.pluginClick)
    window.script = script

    const root = document.getElementById('root')
    root.id = 'root2'
    html.publish(window.Dummy, {}, 'root2')

    script.setDependencies({ html })
    script.setScenes([ 
      { name: 'test', scene: testScene },
      { name: 'blue', scene: bluePage }
    ])
    script.show({ scene: 'test' })
  })

  await page.waitForTimeout(200)

  const render = await page.evaluate(() => window.render)
  expect(render).toBe(true)

  await page.evaluate(() => window.script.hide('*'))
  await page.waitForTimeout(100)

  const containerHTML = await page.locator('#container').innerHTML()
  expect(containerHTML).toBe('')
})

test('Turn to other branch', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await page.waitForFunction(() => window.cuts && window.VisualController)

  await page.evaluate(() => {
    const html = new window.VisualController()
    window.testHtml = html

    const testScene = {
      show: ({ task, dependencies }) => {
        const { html } = dependencies
        html.publish(window.Red, {}, 'subgray')
        window.render = true
        task.done()
      },
      hide: ({ task, dependencies }) => {
        const { html } = dependencies
        html.destroy('subgray')
        task.done()
      },
      parents: ['blue'],
      'click: left-1': () => { window.click = true }
    }

    const bluePage = {
      show: ({ task, dependencies }) => {
        const { html } = dependencies
        html.publish(window.Blue, {}, 'blue')
        task.done()
      },
      hide: ({ task, dependencies }) => {
        const { html } = dependencies
        html.destroy('blue')
        task.done()
      },
      'click: left-1': () => {}
    }

    const grayPage = {
      show: ({ task, dependencies }) => {
        const { html } = dependencies
        html.publish(window.Gray, {}, 'subgray')
        task.done()
      },
      hide: ({ task, dependencies }) => {
        const { html } = dependencies
        html.destroy('subgray')
        task.done()
      },
      parents: ['blue'],
      'click: left-1': () => {}
    }

    const script = window.cuts()
    script.enablePlugin(window.pluginClick)
    window.script = script

    const root = document.getElementById('root')
    root.id = 'root2'
    html.publish(window.Dummy, {}, 'root2')

    script.setDependencies({ html })
    script.setScenes([ 
      { name: 'test', scene: testScene },
      { name: 'blue', scene: bluePage },
      { name: 'gray', scene: grayPage }
    ])
    script.show({ scene: 'test' })
  })

  await page.waitForTimeout(200)
  await page.locator('#target').click()
  await page.waitForTimeout(100)

  await page.evaluate(() => window.script.show({ scene: 'gray' }))
  await page.waitForTimeout(100)

  const redCount = await page.locator('.red').count()
  const grayCount = await page.locator('.gray').count()

  expect(grayCount).toBe(1)
  expect(redCount).toBe(0)
})

test('Jump and jumpBack', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await page.waitForFunction(() => window.cuts)

  const locations = await page.evaluate(() => {
    const myLocations = []

    const testScene = {
      show: ({ task }) => { myLocations.push('test scene'); task.done() },
      hide: ({ task }) => task.done()
    }
    const bluePage = {
      show: ({ task }) => { myLocations.push('blue scene'); task.done() },
      hide: ({ task }) => task.done()
    }
    const grayPage = {
      show: ({ task }) => { myLocations.push('gray scene'); task.done() },
      hide: ({ task }) => task.done()
    }

    const script = window.cuts()
    script.setScenes([
      { name: 'test', scene: testScene },
      { name: 'blue', scene: bluePage },
      { name: 'gray', scene: grayPage }
    ])

    return script.show({ scene: 'test' })
      .then(() => script.jump({ scene: 'blue' }))
      .then(() => script.jump({ scene: 'gray' }))
      .then(() => script.jumpBack())
      .then(() => script.jumpBack())
      .then(() => myLocations)
  })

  expect(locations).toEqual([
    'test scene', 'blue scene', 'gray scene', 'blue scene', 'test scene'
  ])
})

test('Jump and jumpsReset', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await page.waitForFunction(() => window.cuts)

  const locations = await page.evaluate(() => {
    const myLocations = []

    const testScene = {
      show: ({ task }) => { myLocations.push('test scene'); task.done() },
      hide: ({ task }) => task.done()
    }
    const bluePage = {
      show: ({ task }) => { myLocations.push('blue scene'); task.done() },
      hide: ({ task }) => task.done()
    }
    const grayPage = {
      show: ({ task }) => { myLocations.push('gray scene'); task.done() },
      hide: ({ task }) => task.done()
    }

    const script = window.cuts()
    script.setScenes([
      { name: 'test', scene: testScene },
      { name: 'blue', scene: bluePage },
      { name: 'gray', scene: grayPage }
    ])

    return script.show({ scene: 'test' })
      .then(() => script.jump({ scene: 'blue' }))
      .then(() => script.jump({ scene: 'gray' }))
      .then(() => script.jumpsReset())
      .then(() => script.jumpBack())
      .then(() => myLocations)
  })

  expect(locations).toEqual([
    'test scene', 'blue scene', 'gray scene'
  ])
})