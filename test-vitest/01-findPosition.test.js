import { describe, it, expect } from 'vitest'
import findInstructions from "../src/findInstructions.js"



describe ( 'Find a Position', () => {



  it ( 'Switch top level pages', () => {
                    let result = []
                    let g = findInstructions ( 'old', undefined, 'new', undefined )

                    for (const n of g) { result.push(n) }

                    expect(result.length).toBe ( 2 )
                    expect(result[0][0]).toBe ( 'old' )
                    expect(result[0][1]).toBe ( 'hide' )

                    expect(result[1][0]).toBe ( 'new' )
                    expect(result[1][1]).toBe ( 'show' )
      }) // it switch top level pages



  it ( 'Switch from child page to top level page', () => {
              let result = []
              let g = findInstructions ( 'old', ['one', 'two'], 'new', undefined )

              for (const n of g) { result.push(n) }

              expect(result[0]).toEqual(['old', 'hide'])
              expect(result[1]).toEqual(['two', 'hide'])
              expect(result[2]).toEqual(['one', 'hide'])
              expect(result[3]).toEqual(['new', 'show'])
      }) // it switch from child page to top level page



  it ( 'Switch to child page', () => {
            let result = []
            let g = findInstructions ( 'old', ['bla'], 'new', ['old', 'two', 'three'])
            for (const n of g) { result.push(n) }

            expect(result).toHaveLength(3)
            expect(result[0]).toEqual(['two', 'show'])
            expect(result[1]).toEqual(['three', 'show'])
            expect(result[2]).toEqual(['new', 'show'])
      }) // it switch to child page



  it ( 'From child page to other siblings page', () => {
            let result = []
            let g = findInstructions('old', ['two', 'three'], 'new', ['two', 'three'])
            for (const n of g) { result.push(n) }

            expect(result).toHaveLength ( 2 )
            expect(result[0]).toEqual(['old', 'hide'])
            expect(result[1]).toEqual(['new', 'show'])
      }) // it from top level page to not own child page



  it ( 'From top level page to not own child page', () => {
            let result = []
            let g = findInstructions('old', undefined, 'new', ['two', 'three'])
            for (const n of g) { result.push(n) }

            expect(result).toHaveLength(3)
            expect(result[0]).toEqual(['old', 'hide'])
            expect(result[1]).toEqual(['two', 'show'])
            expect(result[2]).toEqual(['three', 'show'])
      }) // it from top level page to not own child page



  it ( 'Long chain of parents', () => {
            let result = []
            let g = findInstructions('old', ['one', 'branch'], 'new', ['one', 'two', 'three'])
            for (const n of g) { result.push(n) }

            expect(result).toHaveLength(5)
            expect(result[0]).toEqual(['old', 'hide'])
            expect(result[1]).toEqual(['branch', 'hide'])
            expect(result[2]).toEqual(['two', 'show'])
            expect(result[3]).toEqual(['three', 'show'])
            expect(result[4]).toEqual(['new', 'show'])
      }) // it long chain of parents



  it ( 'Different branches', () => {
            let result = []
            let g = findInstructions('old', ['something', 'branch'], 'new', ['one', 'two', 'three'])
            for (const n of g) { result.push(n) }

            expect(result).toHaveLength(7)
            expect(result[0]).toEqual(['old', 'hide'])
            expect(result[1]).toEqual(['branch', 'hide'])
            expect(result[2]).toEqual(['something', 'hide'])
            expect(result[3]).toEqual(['one', 'show'])
            expect(result[4]).toEqual(['two', 'show'])
            expect(result[5]).toEqual(['three', 'show'])
            expect(result[6]).toEqual(['new', 'show'])
      }) // it long chain of parents

}) // describe