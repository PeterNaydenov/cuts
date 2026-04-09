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



    



    it ( 'beforeHide', async () => {
                    const script = cuts ();
                    const calls = [];
                    const scenes = [
                                    { 
                                          name: 'top'
                                        , scene: { 
                                                    show: ({task}) => { calls.push('show top'); task.done() }, 
                                                    hide: ({task}) => { calls.push('hide top'); task.done() } ,
                                                    // Prevent unload event:
                                                    'beforeHide': ({ done }) => done ( false ) ,
                                                    'click: left-1': () => calls.push('click left-1') 
                                            }
                                        },
                                        {
                                          name: 'other'
                                        , scene: {
                                                    show: ({task}) => { calls.push('show other'); task.done() }, 
                                                    hide: ({task}) => { calls.push('hide other'); task.done() }
                                            }
                                        }
                                ];

                    script.setScenes ( scenes )
                    await script.show ({ scene: 'top' })
                    expect ( calls ).toEqual (['show top'])

                    await script.show ({ scene: 'other' })
                    expect ( calls ).toEqual (['show top'])
                    expect ( script.getState().scene ).toEqual ( 'top' )
        }) // it beforeHide



    it ( 'Call no existing scene', async () => {
                    const script = cuts ({ logLevel : 1 });
                    const calls = [];
                    const scenes = [
                                    { 
                                          name: 'top'
                                        , scene: { 
                                                    show: ({task}) => { calls.push('show top'); task.done() }, 
                                                    hide: ({task}) => { calls.push('hide top'); task.done() } ,
                                                    'click: left-1': () => calls.push ( 'click left-1' ),
                                                    '@app-error': ( arg ) => {
                                                                calls.push ( 'app-error' )
                                                                expect ( arg.type ).toBe ( 'error' )
                                                                expect ( arg.message ).toBe ( 'Scene "any" is not available.' )
                                                            }
                                            }
                                        },
                                        {
                                          name: 'other'
                                        , scene: {
                                                    show: ({task}) => { calls.push('show other'); task.done() }, 
                                                    hide: ({task}) => { calls.push('hide other'); task.done() }
                                            }
                                        }
                                ];

                    script.setScenes ( scenes )
                    await script.show ({ scene: 'top' })
                    expect ( calls ).toEqual (['show top'])

                     await script.show ({ scene: 'any' })
                     expect ( calls ).toEqual (['show top', 'app-error'])
                     expect ( script.getState().scene ).toEqual ( 'top' )
        }) // it Call no existing scene



     it ( 'Server side rendering (SSR)', async () => {
                     const script = cuts ();
                     const calls = [];
                     const scenes = [
                         {
                             name: 'home',
                             scene: {
                                        show: ({task}) => { calls.push('show home'); task.done() },
                                        hide: ({task}) => { calls.push('hide home'); task.done() }
                                    }
                            }
                        ];

                    script.setScenes ( scenes )

                    // SSR mode: show without executing the scene's show function
                    await script.show({ scene: 'home', options: { ssr: true } })

                    expect(calls).toEqual([]); // show function should not be called
                    expect(script.getState().scene ).toBe ( 'home' )
                    expect(script.getState().opened ).toBe ( true )

                     // Subsequent show should execute normally
                    await script.show ({ scene: 'home' })
                    expect( calls ).toEqual(['hide home', 'show home'])
         }) // it Server side rendering (SSR)



     it ( 'Non existing parents error', async () => {
                    const script = cuts ();
                    const calls = [];
                    const scenes = [
                                    {
                                          name: 'child'
                                        , scene: {
                                                    show: ({task}) => { calls.push('show child'); task.done() },
                                                    hide: ({task}) => { calls.push('hide child'); task.done() },
                                                    parents: [ 'nonexistent' ]
                                            }
                                        }
                                ];
                    script.setScenes ( scenes )
                    await script.show ({ scene: 'child' })
                    expect ( calls ).toEqual ([])
                    expect ( script.getState().scene ).toBe ( null )
         }) // it Non existing parents error



    it ( 'No name scene', async () => {
                    const script = cuts({ logLevel : 0 });
                    const scenes = [
                                    {
                                      scene: {
                                                  show: ({task}) => task.done(),
                                                  hide: ({task}) => task.done()
                                              }
                                    }
                                ];
                    script.setScenes ( scenes );
                    expect ( script.listScenes() ).toEqual ( [] );
        }) // it No name scene



    it ( 'No scene in definition', async () => {
                    const script = cuts({ logLevel : 0 });
                    const scenes = [ {name: 'top'} ];
                    script.setScenes ( scenes );
                    expect ( script.listScenes() ).toEqual ( [] );
        }) // it No scene in definition



    it ( 'List shortcuts', async () => {
                    const script = cuts ()
                    const calls = [];

                     const scenes = [
                                    { 
                                          name: 'top'
                                        , scene: { 
                                                    show: ({task}) => { calls.push('show top'); task.done() }, 
                                                    hide: ({task}) => { calls.push('hide top'); task.done() } ,
                                                    'click: left-1': () => calls.push('click left-1') 
                                            }
                                        }
                                ];

                     script.setScenes ( scenes )
                     expect ( script.listShortcuts( 'top' ) ).toEqual ( ['click: left-1'] )
        }) // it List shortcuts



     it ( 'List shortcuts', async () => {
                     const script = cuts ()
                     const calls = [];

                      const scenes = [
                                     {
                                           name: 'top'
                                         , scene: {
                                                     show: ({task}) => { calls.push('show top'); task.done() },
                                                     hide: ({task}) => { calls.push('hide top'); task.done() } ,
                                                     'click: left-1': () => calls.push('click left-1')
                                             }
                                         }
                                 ];

                      script.setScenes ( scenes )
                      expect ( script.listShortcuts( 'none' ) ).toEqual ( null )
         }) // it List shortcuts



     it ( 'Jump functionality', async () => {
                     const script = cuts({ logLevel : 0 });
                     const calls = [];
                     const scenes = [
                                     {
                                           name: 'home'
                                         , scene: {
                                                     show: ({task}) => { calls.push('show home'); task.done() },
                                                     hide: ({task}) => { calls.push('hide home'); task.done() }
                                             }
                                         },
                                         {
                                           name: 'settings'
                                         , scene: {
                                                     show: ({task}) => { calls.push('show settings'); task.done() },
                                                     hide: ({task}) => { calls.push('hide settings'); task.done() }
                                             }
                                         }
                                 ];

                     script.setScenes ( scenes );

                     await script.show ({ scene: 'home' });
                     expect ( calls ).toEqual (['show home']);
                     expect ( script.getState().scene ).toEqual ( 'home' );

                     await script.jump ({ scene: 'settings' });
                     expect ( calls ).toEqual (['show home', 'hide home', 'show settings']);
                     expect ( script.getState().scene ).toEqual ( 'settings' );

                     await script.jumpBack ();
                     expect ( calls ).toEqual (['show home', 'hide home', 'show settings', 'hide settings', 'show home']);
                     expect ( script.getState().scene ).toEqual ( 'home' );
          }) // it Jump functionality



     it ( 'Jump with hops', async () => {
                     const script = cuts();
                     const calls = [];
                     const scenes = [
                                     {
                                           name: 'scene1'
                                         , scene: {
                                                     show: ({task}) => { calls.push('show scene1'); task.done() },
                                                     hide: ({task}) => { calls.push('hide scene1'); task.done() }
                                             }
                                         },
                                         {
                                           name: 'scene2'
                                         , scene: {
                                                     show: ({task}) => { calls.push('show scene2'); task.done() },
                                                     hide: ({task}) => { calls.push('hide scene2'); task.done() }
                                             }
                                         },
                                         {
                                           name: 'scene3'
                                         , scene: {
                                                     show: ({task}) => { calls.push('show scene3'); task.done() },
                                                     hide: ({task}) => { calls.push('hide scene3'); task.done() }
                                             }
                                         }
                                 ];

                     script.setScenes ( scenes );

                     await script.show ({ scene: 'scene1' });
                     expect ( script.getState().scene ).toEqual ( 'scene1' );

                     await script.jump ({ scene: 'scene2' });
                     expect ( script.getState().scene ).toEqual ( 'scene2' );

                     await script.jump ({ scene: 'scene3' });
                     expect ( script.getState().scene ).toEqual ( 'scene3' );

                     await script.jumpBack ({ hops: 2 });
                     expect ( script.getState().scene ).toEqual ( 'scene1' );
         }) // it Jump with hops



     it ( 'Jumps reset and jump back on empty stack', async () => {
                     const script = cuts();
                     const scenes = [
                                     {
                                           name: 'scene1'
                                         , scene: {
                                                     show: ({task}) => task.done(),
                                                     hide: ({task}) => task.done()
                                             }
                                         },
                                         {
                                           name: 'scene2'
                                         , scene: {
                                                     show: ({task}) => task.done(),
                                                     hide: ({task}) => task.done()
                                             }
                                         }
                                 ];

                     script.setScenes ( scenes );

                     await script.show ({ scene: 'scene1' });
                     await script.jump ({ scene: 'scene2' });
                     expect ( script.getState().scene ).toEqual ( 'scene2' );

                     script.jumpsReset();

                     const result = await script.jumpBack();
                     expect ( result ).toBeUndefined();
                     expect ( script.getState().scene ).toEqual ( 'scene2' ); // scene should not change
         }) // it Jumps reset and jump back on empty stack



     it ( 'Show scene with wildcard parent', async () => {
                     // Test for scenes with parents: ['*']
                     // The '*' wildcard allows the scene to be shown as an overlay over any current scene
                     // without hiding the underlying scene. The previous scene is preserved in currentParents.
                     const script = cuts();
                     const calls = [];
                     const scenes = [
                                     {
                                           name: 'base'
                                         , scene: {
                                                     show: ({task}) => { calls.push('show base'); task.done() },
                                                     hide: ({task}) => { calls.push('hide base'); task.done() }
                                             }
                                         },
                                         {
                                           name: 'overlay' // This scene uses '*' to indicate it can overlay any scene
                                         , scene: {
                                                     show: ({task}) => {
                                                                    calls.push ( 'show overlay' )
                                                                    task.done ()
                                                        },
                                                     hide: ({task}) => { calls.push('hide overlay'); task.done() },
                                                     parents: ['*'] // '*' means this scene can be shown over any current scene
                                             }
                                         }
                                 ];

                     script.setScenes ( scenes );

                     await script.show ({ scene: 'base' });
                     expect ( calls ).toEqual (['show base']);
                     expect ( script.getState().scene ).toEqual ( 'base' );
                     expect ( script.getState().parents ).toEqual ( [] );

                     await script.show ({ scene: 'overlay' });
                     expect ( calls ).toEqual (['show base', 'show overlay']); // Note: 'hide base' is not called
                     expect ( script.getState().scene ).toEqual ( 'overlay' );
                     expect ( script.getState().parents ).toEqual ( ['base'] ); // Previous scene is saved
         }) // it Show scene with wildcard parent



 }) // describe