import { describe, it, expect } from 'vitest'
import cuts from "../src/main.js"



describe ( 'Cuts integration', () => {



    it ( 'Open a scene, and 2 levels deep child', async () => {
                    const calls = [];

                    const scenes = [
                        { name: 'top', scene: { show: ({task}) => { calls.push('show top'); task.done() }, hide: ({task}) => { calls.push('hide top'); task.done() } } },
                        { name: 'mid', scene: { show: ({task}) => { calls.push('show mid'); task.done() }, hide: ({task}) => { calls.push('hide mid'); task.done() }, parents: ['top'] } },
                        { name: 'deep', scene: { show: ({task}) => { calls.push('show deep'); task.done() }, hide: ({task}) => { calls.push('hide deep'); task.done() }, parents: ['top', 'mid'] } }
                    ]

                    const script = cuts();
                    script.setScenes ( scenes )

                    await script.show ({ scene: 'top' })
                    expect ( calls ).toEqual ([ 'show top' ])

                    await script.show ({ scene: 'deep' })
                    expect ( calls ).toEqual ([
                                            'show top', 
                                            'show mid', 
                                            'show deep'
                            ])

                    await script.show ({ scene: 'top' })
                    expect ( calls ).toEqual ([
                                            'show top', 
                                            'show mid', 
                                            'show deep', 
                                            'hide deep', 
                                            'hide mid'
                            ])

                    await script.show ({ scene: 'deep' })
                    expect ( calls ).toEqual ([
                                            'show top', 
                                            'show mid', 
                                            'show deep',
                                            'hide deep', 
                                            'hide mid', 
                                            'show mid',
                                            'show deep'
                            ])
       }) // it Open a scene, and 2 levels deep child



    it ( 'Load plugins', async () => {
                    const script = cuts()
                    const plugins = await script.loadPlugins ( ['Key', 'Click'] )
                    expect ( plugins ).toHaveLength ( 2 )
        }) // it Load plugins




}) // describe