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



     it ( 'List shortcuts excludes beforeHide and afterShow', async () => {
                     // Regression test: listShortcuts used to destructure the old
                     // 'beforeUnload'/'afterLoad' names, so the real 'beforeHide'/'afterShow'
                     // scene methods leaked into the returned shortcuts list.
                     const script = cuts ()
                     const scenes = [
                                     {
                                           name: 'top'
                                         , scene: {
                                                     show       : ({task}) => task.done(),
                                                     hide       : ({task}) => task.done(),
                                                     beforeHide : ({ done }) => done ( true ),
                                                     afterShow  : () => {},
                                                     'click: left-1' : () => {}
                                             }
                                         }
                                 ];

                     script.setScenes ( scenes )
                     expect ( script.listShortcuts( 'top' ) ).toEqual ( ['click: left-1'] )
         }) // it List shortcuts excludes beforeHide and afterShow



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



     it ( 'Show scene with wildcard parent as the very first scene', async () => {
                     // Regression test: state.currentParents starts as null, and the
                     // wildcard branch used to push into it before it was initialized,
                     // crashing on the first-ever show() call.
                     const script = cuts();
                     const calls = [];
                     const scenes = [
                                     {
                                           name: 'overlay'
                                         , scene: {
                                                     show: ({task}) => { calls.push('show overlay'); task.done() },
                                                     hide: ({task}) => { calls.push('hide overlay'); task.done() },
                                                     parents: ['*']
                                             }
                                         }
                                 ];

                     script.setScenes ( scenes );

                     await script.show ({ scene: 'overlay' });
                     expect ( calls ).toEqual (['show overlay']);
                     expect ( script.getState().scene ).toEqual ( 'overlay' );
                     expect ( script.getState().parents ).toEqual ( [null] ); // No previous scene, saved as null
         }) // it Show scene with wildcard parent as the very first scene



     it ( 'Hide with wildcard steps resets state to the root', async () => {
                     // Regression test: hide('*') used to hide every scene correctly but left
                     // 'currentScene'/'currentParents' stale instead of resetting them to the root.
                     const calls = [];
                     const script = cuts();
                     const scenes = [
                                     { name: 'top' , scene: { show: ({task}) => { calls.push('show top');  task.done() }, hide: ({task}) => { calls.push('hide top');  task.done() } } },
                                     { name: 'mid' , scene: { show: ({task}) => { calls.push('show mid');  task.done() }, hide: ({task}) => { calls.push('hide mid');  task.done() }, parents: ['top'] } },
                                     { name: 'deep', scene: { show: ({task}) => { calls.push('show deep'); task.done() }, hide: ({task}) => { calls.push('hide deep'); task.done() }, parents: ['top', 'mid'] } }
                                 ];

                     script.setScenes ( scenes );
                     await script.show ({ scene: 'deep' });
                     calls.length = 0;

                     await script.hide ( '*' );
                     expect ( calls ).toEqual ([ 'hide deep', 'hide mid', 'hide top' ]);
                     expect ( script.getState() ).toEqual ({ scene: null, parents: [], opened: true });
         }) // it Hide with wildcard steps resets state to the root



     it ( 'emit() passes args through without an injected context object', async () => {
                     // Regression test: shortcuts@4.1.1's own emit() now prepends a
                     // { dependencies, type: 'custom' } object to support event chaining.
                     // cuts.emit() must keep forwarding exactly what the caller passed.
                     const received = [];
                     const script = cuts();
                     const scenes = [
                                     {
                                           name: 'top'
                                         , scene: {
                                                     show : ({task}) => task.done(),
                                                     hide : ({task}) => task.done(),
                                                     '@custom-event' : ( payload ) => received.push ( payload )
                                             }
                                         }
                                 ];

                     script.setScenes ( scenes );
                     await script.show ({ scene: 'top' });

                     script.emit ( '@custom-event', { foo: 'bar' } );
                     expect ( received ).toEqual ([{ foo: 'bar' }]);
         }) // it emit() passes args through without an injected context object



     it ( 'Wildcard overlay scene activates its own shortcuts context', async () => {
                     // Regression test: showing a '*'-parented scene never switched the
                     // shortcuts context to it, so its own shortcut/event handlers never fired.
                     const seen = [];
                     const script = cuts();
                     const scenes = [
                                     {
                                           name: 'base'
                                         , scene: {
                                                     show : ({task}) => task.done(),
                                                     hide : ({task}) => task.done(),
                                                     '@ping' : () => seen.push ( 'base' )
                                             }
                                         },
                                         {
                                           name: 'overlay'
                                         , scene: {
                                                     show : ({task}) => task.done(),
                                                     hide : ({task}) => task.done(),
                                                     parents: ['*'],
                                                     '@ping' : () => seen.push ( 'overlay' )
                                             }
                                         }
                                 ];

                     script.setScenes ( scenes );
                     await script.show ({ scene: 'base' });
                     await script.show ({ scene: 'overlay' });

                     script.emit ( '@ping' );
                     expect ( seen ).toEqual ([ 'overlay' ]);
         }) // it Wildcard overlay scene activates its own shortcuts context



     it ( 'Showing a wildcard overlay does not corrupt the underlying scene, and returning to it works', async () => {
                     // Regression test: state.currentParents used to be aliased directly to a
                     // scene's own 'parents' array, so pushing onto it (done when showing a
                     // wildcard overlay) permanently mutated that scene's 'parents' definition -
                     // which then crashed when navigating back to it.
                     const calls = [];
                     const script = cuts();
                     const baseScene = {
                                           show : ({task}) => { calls.push('show base'); task.done() }
                                         , hide : ({task}) => { calls.push('hide base'); task.done() }
                                     };
                     const scenes = [
                                     { name: 'base', scene: baseScene },
                                     {
                                           name: 'overlay'
                                         , scene: {
                                                     show : ({task}) => { calls.push('show overlay'); task.done() },
                                                     hide : ({task}) => { calls.push('hide overlay'); task.done() },
                                                     parents: ['*']
                                             }
                                         }
                                 ];

                     script.setScenes ( scenes );
                     await script.show ({ scene: 'base' });
                     await script.show ({ scene: 'overlay' });

                     expect ( baseScene.parents ).toEqual ([]); // Not corrupted into ['base']

                     await script.show ({ scene: 'base' }); // Used to throw
                     expect ( script.getState() ).toEqual ({ scene: 'base', parents: [], opened: true });
         }) // it Showing a wildcard overlay does not corrupt the underlying scene, and returning to it works



 }) // describe