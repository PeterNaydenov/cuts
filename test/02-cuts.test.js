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



    it ( 'beforeHide with async function that resolves to false', async () => {
                    // Regression test: beforeHide returning a Promise was ignored — the
                    // return value was never awaited, so async blocking (e.g. confirm dialog)
                    // could not work. Navigation proceeded before the Promise resolved.
                    const script = cuts ();
                    const calls = [];
                    const scenes = [
                                    { 
                                          name: 'top'
                                        , scene: { 
                                                    show: ({task}) => { calls.push('show top'); task.done() }, 
                                                    hide: ({task}) => { calls.push('hide top'); task.done() },
                                                    // Async beforeHide that blocks:
                                                    'beforeHide': ({ done }) => Promise.resolve().then ( () => done ( false ) ),
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

                    script.setScenes ( scenes );
                    await script.show ({ scene: 'top' });
                    expect ( calls ).toEqual (['show top']);

                    await script.show ({ scene: 'other' }); // blocked by async beforeHide
                    expect ( calls ).toEqual (['show top']); // 'show other' never fired
                    expect ( script.getState().scene ).toEqual ( 'top' );
        }) // it beforeHide with async function that resolves to false



    it ( 'beforeHide with async function that resolves to true', async () => {
                    const script = cuts ();
                    const calls = [];
                    const scenes = [
                                    { 
                                          name: 'top'
                                        , scene: { 
                                                    show: ({task}) => { calls.push('show top'); task.done() }, 
                                                    hide: ({task}) => { calls.push('hide top'); task.done() },
                                                    // Async beforeHide that allows navigation:
                                                    'beforeHide': ({ done }) => Promise.resolve().then ( () => done ( true ) ),
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

                    script.setScenes ( scenes );
                    await script.show ({ scene: 'top' });
                    expect ( calls ).toEqual (['show top']);

                    await script.show ({ scene: 'other' }); // allowed by async beforeHide
                    expect ( calls ).toEqual (['show top', 'hide top', 'show other']);
                    expect ( script.getState().scene ).toEqual ( 'other' );
        }) // it beforeHide with async function that resolves to true



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
                     expect ( script.getState().parents ).toEqual ( [] ); // No underlying scene to remember
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



     it ( 'getState() does not leak a mutable reference to internal state', async () => {
                     // Regression test: getState() used to return state.currentParents by
                     // reference, so a caller mutating the returned array corrupted cuts' own state.
                     const script = cuts();
                     script.setScenes ([
                                     { name: 'home', scene: { show: ({task}) => task.done(), hide: ({task}) => task.done() } }
                             ]);

                     await script.show ({ scene: 'home' });
                     const firstRead = script.getState ();
                     firstRead.parents.push ( 'INJECTED' );

                     expect ( script.getState().parents ).toEqual ([]);
         }) // it getState() does not leak a mutable reference to internal state



     it ( 'hide() restores state and shortcuts context after dismissing a wildcard overlay', async () => {
                     // Regression test: hide() on a wildcard-overlay scene left currentScene/currentParents
                     // stale (still pointing at the now-hidden overlay), so the underlying scene's
                     // shortcuts context was never reactivated even though it was still visible.
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

                     await script.hide (); // Dismiss the overlay
                     expect ( script.getState() ).toEqual ({ scene: 'base', parents: [], opened: true });

                     script.emit ( '@ping' );
                     expect ( seen ).toEqual ([ 'base' ]);
         }) // it hide() restores state and shortcuts context after dismissing a wildcard overlay



     it ( 'logLevel: 0 is honored as explicitly silent, and the no-args default stays 1', async () => {
                     // Regression test: 'cfg.logLevel || 1' treated an explicit 0 as falsy and
                     // silently forced logLevel back to 1, so 'silent mode' never actually worked.
                     const silentSeen = [];
                     const silentScript = cuts ({ logLevel: 0 });
                     silentScript.setScenes ([
                                     { name: 'top', scene: { show: ({task}) => task.done(), hide: ({task}) => task.done(), '@app-error': (e) => silentSeen.push(e) } }
                             ]);
                     await silentScript.show ({ scene: 'top' });
                     await silentScript.show ({ scene: 'nope' });
                     expect ( silentSeen ).toEqual ([]);

                     const defaultSeen = [];
                     const defaultScript = cuts (); // No config at all - README default is logLevel 1
                     defaultScript.setScenes ([
                                     { name: 'top', scene: { show: ({task}) => task.done(), hide: ({task}) => task.done(), '@app-error': (e) => defaultSeen.push(e) } }
                             ]);
                     await defaultScript.show ({ scene: 'top' });
                     await defaultScript.show ({ scene: 'nope' });
                     expect ( defaultSeen ).toHaveLength ( 1 );
         }) // it logLevel: 0 is honored as explicitly silent, and the no-args default stays 1



     it ( 'hide() with the default single step climbs to the parent and restores its shortcuts context', async () => {
                     // Regression test: hide() used to leave currentScene/currentParents pointing at
                     // the just-hidden scene instead of climbing to its (still visible) parent, so
                     // NEITHER scene's shortcuts context was active afterward.
                     const seen = [];
                     const script = cuts();
                     const scenes = [
                                     {
                                           name: 'A'
                                         , scene: {
                                                     show : ({task}) => task.done(),
                                                     hide : ({task}) => task.done(),
                                                     '@ping' : () => seen.push ( 'A' )
                                             }
                                         },
                                         {
                                           name: 'B'
                                         , scene: {
                                                     show : ({task}) => task.done(),
                                                     hide : ({task}) => task.done(),
                                                     parents: ['A'],
                                                     '@ping' : () => seen.push ( 'B' )
                                             }
                                         }
                                 ];

                     script.setScenes ( scenes );
                     await script.show ({ scene: 'A' });
                     await script.show ({ scene: 'B' });

                     await script.hide (); // default endSteps = 1
                     expect ( script.getState() ).toEqual ({ scene: 'A', parents: [], opened: true });

                     script.emit ( '@ping' );
                     expect ( seen ).toEqual ([ 'A' ]);
         }) // it hide() with the default single step climbs to the parent and restores its shortcuts context



     it ( 'hide(n) climbs exactly n levels', async () => {
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

                     await script.hide ( 2 );
                     expect ( calls ).toEqual ([ 'hide deep', 'hide mid' ]);
                     expect ( script.getState() ).toEqual ({ scene: 'top', parents: [], opened: true });
         }) // it hide(n) climbs exactly n levels



     it ( 'SSR first load records the scene\'s parents, so leaving it hides them too', async () => {
                     // Regression test: the SSR branch of show() set currentScene but never
                     // currentParents, so navigating away from a deep SSR-loaded scene skipped
                     // hiding its ancestors entirely, leaving them stale in the DOM.
                     const calls = [];
                     const script = cuts();
                     const scenes = [
                                     { name: 'top' , scene: { show: ({task}) => { calls.push('show top');  task.done() }, hide: ({task}) => { calls.push('hide top');  task.done() } } },
                                     { name: 'mid' , scene: { show: ({task}) => { calls.push('show mid');  task.done() }, hide: ({task}) => { calls.push('hide mid');  task.done() }, parents: ['top'] } },
                                     { name: 'deep', scene: { show: ({task}) => { calls.push('show deep'); task.done() }, hide: ({task}) => { calls.push('hide deep'); task.done() }, parents: ['top', 'mid'] } },
                                     { name: 'other', scene: { show: ({task}) => { calls.push('show other'); task.done() }, hide: ({task}) => { calls.push('hide other'); task.done() } } }
                                 ];

                     script.setScenes ( scenes );
                     await script.show ({ scene: 'deep', options: { ssr: true } });
                     expect ( script.getState() ).toEqual ({ scene: 'deep', parents: [ 'top', 'mid' ], opened: true });

                     calls.length = 0;
                     await script.show ({ scene: 'other' });
                     expect ( calls ).toEqual ([ 'hide deep', 'hide mid', 'hide top', 'show other' ]);
         }) // it SSR first load records the scene's parents, so leaving it hides them too



     it ( 'SSR first load + overlay lifts cleanly when navigating away', async () => {
                     // SSR-loads record the scene's state but do not call its 'show' function.
                     // Subsequent normal navigation (including a wildcard overlay) should work
                     // as if the SSR-loaded scene had been shown normally: its 'hide' fires
                     // when navigated away from, and any overlay on top of it lifts correctly.
                     const calls = [];
                     const script = cuts();
                     const scenes = [
                                     { name: 'G',  scene: { show: ({task}) => { calls.push('show G');  task.done() }, hide: ({task}) => { calls.push('hide G');  task.done() } } },
                                     { name: 'OV', scene: { show: ({task}) => { calls.push('show OV'); task.done() }, hide: ({task}) => { calls.push('hide OV'); task.done() }, parents: ['*'] } },
                                     { name: 'D',  scene: { show: ({task}) => { calls.push('show D');  task.done() }, hide: ({task}) => { calls.push('hide D');  task.done() } } }
                                 ];

                     script.setScenes ( scenes );

                     await script.show ({ scene: 'G', options: { ssr: true } });
                     expect ( calls ).toEqual ([]);
                     expect ( script.getState () ).toEqual ({ scene: 'G', parents: [], opened: true });

                     await script.show ({ scene: 'OV' });
                     expect ( calls ).toEqual ([ 'show OV' ]);
                     expect ( script.getState () ).toEqual ({ scene: 'OV', parents: [ 'G' ], opened: true });

                     calls.length = 0;
                     await script.show ({ scene: 'D' });
                     expect ( calls ).toEqual ([ 'hide OV', 'hide G', 'show D' ]);
                     expect ( script.getState () ).toEqual ({ scene: 'D', parents: [], opened: true });
         }) // it SSR first load + overlay lifts cleanly when navigating away



     it ( 'SSR first load + jump stack works for subsequent navigation', async () => {
                     // After SSR-loading the first scene, the jump stack should be
                     // empty and ready to record subsequent jumps. jumpBack should
                     // return to the SSR-loaded scene correctly. Note that the
                     // SSR-loaded scene's 'hide' still fires on navigation away -
                     // only its 'show' is skipped - matching the existing SSR
                     // re-show test (the SSR branch is one-shot, not stateful).
                     const calls = [];
                     const script = cuts();
                     const scenes = [
                                     { name: 'home',     scene: { show: ({task}) => { calls.push('show home');     task.done() }, hide: ({task}) => { calls.push('hide home');     task.done() } } },
                                     { name: 'settings', scene: { show: ({task}) => { calls.push('show settings'); task.done() }, hide: ({task}) => { calls.push('hide settings'); task.done() } } },
                                     { name: 'profile',  scene: { show: ({task}) => { calls.push('show profile');  task.done() }, hide: ({task}) => { calls.push('hide profile');  task.done() } } }
                                 ];

                     script.setScenes ( scenes );

                     await script.show ({ scene: 'home', options: { ssr: true } });
                     expect ( calls ).toEqual ([]);
                     expect ( script.getState () ).toEqual ({ scene: 'home', parents: [], opened: true });

                     await script.jump ({ scene: 'settings' });
                     expect ( calls ).toEqual ([ 'hide home', 'show settings' ]);

                     await script.jump ({ scene: 'profile' });
                     expect ( calls ).toEqual ([ 'hide home', 'show settings', 'hide settings', 'show profile' ]);

                     calls.length = 0;
                     await script.jumpBack ();   // back to 'settings' (top of stack)
                     expect ( calls ).toEqual ([ 'hide profile', 'show settings' ]);
                     expect ( script.getState () ).toEqual ({ scene: 'settings', parents: [], opened: true });

                     calls.length = 0;
                     await script.jumpBack ();   // back to 'home' (next on stack - the SSR-loaded scene)
                     expect ( calls ).toEqual ([ 'hide settings', 'show home' ]);
                     expect ( script.getState () ).toEqual ({ scene: 'home', parents: [], opened: true });

                     calls.length = 0;
                     await script.jumpBack ();   // stack already empty - no-op
                     expect ( calls ).toEqual ([]);
                     expect ( script.getState () ).toEqual ({ scene: 'home', parents: [], opened: true });
         }) // it SSR first load + jump stack works for subsequent navigation



     it ( 'SSR first load + beforeHide guards subsequent navigation', async () => {
                     // The SSR path sets state but does not call 'show' or 'afterShow'.
                     // When the user then tries to navigate away, the current scene's
                     // beforeHide must still be honoured - a navigation guard should
                     // work the same way whether the scene was SSR-loaded or normal-loaded.
                     const calls = [];
                     let block = true;
                     const script = cuts();
                     const scenes = [
                                     {
                                           name: 'home'
                                         , scene: {
                                                     show       : ({task}) => { calls.push('show home'); task.done() },
                                                     hide       : ({task}) => { calls.push('hide home'); task.done() },
                                                     beforeHide : ({ done }) => done ( !block )
                                             }
                                         },
                                     { name: 'about', scene: { show: ({task}) => { calls.push('show about'); task.done() }, hide: ({task}) => { calls.push('hide about'); task.done() } } }
                                 ];

                     script.setScenes ( scenes );

                     await script.show ({ scene: 'home', options: { ssr: true } });
                     expect ( calls ).toEqual ([]);
                     expect ( script.getState () ).toEqual ({ scene: 'home', parents: [], opened: true });

                     // Blocked by beforeHide - navigation is a no-op, no 'about' show, no state change
                     await script.show ({ scene: 'about' });
                     expect ( calls ).toEqual ([]);
                     expect ( script.getState () ).toEqual ({ scene: 'home', parents: [], opened: true });

                     // Unblock and retry - navigation lands normally
                     block = false;
                     await script.show ({ scene: 'about' });
                     expect ( calls ).toEqual ([ 'hide home', 'show about' ]);
                     expect ( script.getState () ).toEqual ({ scene: 'about', parents: [], opened: true });
         }) // it SSR first load + beforeHide guards subsequent navigation



     it ( 'SSR first load + hide() closes the SSR-loaded scene', async () => {
                     // hide() should correctly tear down an SSR-loaded scene:
                     // its 'hide' function fires even though 'show' was never called.
                     const calls = [];
                     const script = cuts();
                     const scenes = [
                                     { name: 'home', scene: { show: ({task}) => { calls.push('show home'); task.done() }, hide: ({task}) => { calls.push('hide home'); task.done() } } }
                                 ];

                     script.setScenes ( scenes );

                     await script.show ({ scene: 'home', options: { ssr: true } });
                     expect ( calls ).toEqual ([]);
                     expect ( script.getState () ).toEqual ({ scene: 'home', parents: [], opened: true });

                     await script.hide ();
                     expect ( calls ).toEqual ([ 'hide home' ]);
                     expect ( script.getState () ).toEqual ({ scene: null, parents: [], opened: true });
         }) // it SSR first load + hide() closes the SSR-loaded scene



     it ( 'SSR first load + hide("*") climbs back through the recorded parent chain', async () => {
                     // The 2.1.4 fix: SSR loads now record the scene's 'parents' so
                     // that subsequent hide("*") can walk back through them. Verify
                     // that the full climb order is correct.
                     const calls = [];
                     const script = cuts();
                     const scenes = [
                                     { name: 'top',  scene: { show: ({task}) => { calls.push('show top');  task.done() }, hide: ({task}) => { calls.push('hide top');  task.done() } } },
                                     { name: 'mid',  scene: { show: ({task}) => { calls.push('show mid');  task.done() }, hide: ({task}) => { calls.push('hide mid');  task.done() }, parents: [ 'top' ] } },
                                     { name: 'deep', scene: { show: ({task}) => { calls.push('show deep'); task.done() }, hide: ({task}) => { calls.push('hide deep'); task.done() }, parents: [ 'top', 'mid' ] } }
                                 ];

                     script.setScenes ( scenes );

                     await script.show ({ scene: 'deep', options: { ssr: true } });
                     expect ( calls ).toEqual ([]);
                     expect ( script.getState () ).toEqual ({ scene: 'deep', parents: [ 'top', 'mid' ], opened: true });

                     await script.hide ( '*' );
                     expect ( calls ).toEqual ([ 'hide deep', 'hide mid', 'hide top' ]);
                     expect ( script.getState () ).toEqual ({ scene: null, parents: [], opened: true });
         }) // it SSR first load + hide("*") climbs back through the recorded parent chain



     it ( 'afterShow return value has no effect on the completed show()', async () => {
                     // Regression test: setScenes.js's typedef documented afterShow as
                     // 'returns false to cancel', but show() never read its return value, so
                     // the scene was always shown regardless. The typedef is now corrected to
                     // describe the actual (README-documented) fire-and-forget behavior.
                     const calls = [];
                     const script = cuts();
                     const scenes = [
                                     {
                                           name: 'top'
                                         , scene: {
                                                     show      : ({task}) => { calls.push('show'); task.done() },
                                                     hide      : ({task}) => task.done(),
                                                     afterShow : () => { calls.push('afterShow'); return false }
                                             }
                                         }
                                 ];

                     script.setScenes ( scenes );
                     await script.show ({ scene: 'top' });

                     expect ( calls ).toEqual ([ 'show', 'afterShow' ]);
                     expect ( script.getState() ).toEqual ({ scene: 'top', parents: [], opened: true });
         }) // it afterShow return value has no effect on the completed show()



     it ( 'hide() honors beforeHide, same as show() does', async () => {
                     // Regression test: hide() used to ignore beforeHide entirely, so it could
                     // never be blocked - even though show() already respected it when navigating
                     // away to a different scene.
                     const calls = [];
                     const script = cuts();
                     const scenes = [
                                     {
                                           name: 'top'
                                         , scene: {
                                                     show       : ({task}) => { calls.push('show top'); task.done() },
                                                     hide       : ({task}) => { calls.push('hide top'); task.done() },
                                                     beforeHide : ({ done }) => { calls.push('beforeHide'); done ( false ) }
                                             }
                                         }
                                 ];

                     script.setScenes ( scenes );
                     await script.show ({ scene: 'top' });
                     calls.length = 0;

                     await script.hide ();
                     expect ( calls ).toEqual ([ 'beforeHide' ]); // hide() never actually ran
                     expect ( script.getState() ).toEqual ({ scene: 'top', parents: [], opened: true });
         }) // it hide() honors beforeHide, same as show() does



     it ( 'jump() does not record a jump-stack entry when the navigation is blocked', async () => {
                     // Regression test: jump() pushed onto the jump stack unconditionally, even when
                     // the underlying show() was blocked (eg. by beforeHide) and nothing actually
                     // changed - leaving a phantom entry that desynced jumpBack() from real history.
                     const calls = [];
                     const script = cuts();
                     let block = true;
                     const scenes = [
                                     {
                                           name: 'home'
                                         , scene: {
                                                     show       : ({task}) => { calls.push('show home'); task.done() },
                                                     hide       : ({task}) => { calls.push('hide home'); task.done() },
                                                     beforeHide : ({ done }) => done ( !block )
                                             }
                                         },
                                         {
                                           name: 'settings'
                                         , scene: {
                                                     show : ({task}) => { calls.push('show settings'); task.done() },
                                                     hide : ({task}) => { calls.push('hide settings'); task.done() }
                                             }
                                         },
                                         {
                                           name: 'other'
                                         , scene: {
                                                     show : ({task}) => { calls.push('show other'); task.done() },
                                                     hide : ({task}) => { calls.push('hide other'); task.done() }
                                             }
                                         }
                                 ];

                     script.setScenes ( scenes );
                     await script.show ({ scene: 'home' });

                     await script.jump ({ scene: 'settings' }); // blocked by beforeHide - no stack entry
                     expect ( script.getState().scene ).toEqual ( 'home' );

                     block = false;
                     await script.jump ({ scene: 'other' }); // succeeds - exactly one real stack entry
                     expect ( script.getState().scene ).toEqual ( 'other' );

                     calls.length = 0;
                     await script.jumpBack ();
                     expect ( calls ).toEqual ([ 'hide other', 'show home' ]);
                     expect ( script.getState().scene ).toEqual ( 'home' );

                     calls.length = 0;
                     await script.jumpBack (); // stack should already be empty - true no-op
                     expect ( calls ).toEqual ([]);
                     expect ( script.getState().scene ).toEqual ( 'home' );
         }) // it jump() does not record a jump-stack entry when the navigation is blocked



     it ( 'Navigating from a wildcard overlay to an unrelated scene hides the scene it was covering', async () => {
                     // Regression test: findInstructions is a lazy generator, and show() passed it
                     // state.currentParents by reference. getStep's wildcard climb (state.currentParents.pop())
                     // mutated that same array mid-iteration, corrupting the generator's still-pending reads
                     // and silently dropping the 'hide' instruction for the scene the overlay was covering -
                     // leaking it as permanently visible.
                     const calls = [];
                     const script = cuts();
                     const scenes = [
                                     { name: 'G', scene: { show: ({task}) => { calls.push('show G'); task.done() }, hide: ({task}) => { calls.push('hide G'); task.done() } } },
                                     { name: 'OV', scene: { show: ({task}) => { calls.push('show OV'); task.done() }, hide: ({task}) => { calls.push('hide OV'); task.done() }, parents: ['*'] } },
                                     { name: 'D', scene: { show: ({task}) => { calls.push('show D'); task.done() }, hide: ({task}) => { calls.push('hide D'); task.done() } } }
                                 ];

                     script.setScenes ( scenes );
                     await script.show ({ scene: 'G' });
                     await script.show ({ scene: 'OV' });
                     calls.length = 0;

                     await script.show ({ scene: 'D' });
                     expect ( calls ).toEqual ([ 'hide OV', 'hide G', 'show D' ]);
                     expect ( script.getState() ).toEqual ({ scene: 'D', parents: [], opened: true });
         }) // it Navigating from a wildcard overlay to an unrelated scene hides the scene it was covering



     it ( 'Showing a wildcard overlay with no underlying scene does not crash later navigation', async () => {
                     // Regression test: showing an overlay when state.currentScene was null recorded a
                     // literal 'null' placeholder in currentParents. Navigating away from it later crashed,
                     // because findInstructions/getStep treated that placeholder as a real scene name to hide.
                     const script = cuts();
                     const scenes = [
                                     { name: 'F', scene: { show: ({task}) => task.done(), hide: ({task}) => task.done() } },
                                     { name: 'OV', scene: { show: ({task}) => task.done(), hide: ({task}) => task.done(), parents: ['*'] } },
                                     { name: 'A', scene: { show: ({task}) => task.done(), hide: ({task}) => task.done() } }
                                 ];

                     script.setScenes ( scenes );
                     await script.show ({ scene: 'F' });
                     await script.hide ( 1 ); // back to nothing - currentScene becomes null
                     await script.show ({ scene: 'OV' }); // overlay with no underlying scene

                     expect ( script.getState() ).toEqual ({ scene: 'OV', parents: [], opened: true });

                     await script.show ({ scene: 'A' }); // used to throw
                     expect ( script.getState() ).toEqual ({ scene: 'A', parents: [], opened: true });
         }) // it Showing a wildcard overlay with no underlying scene does not crash later navigation



     it ( 'Re-showing the same wildcard overlay does not push it onto its own ancestor chain', async () => {
                     // Regression test: showing an overlay while it was ALREADY the current scene pushed
                     // it onto its own currentParents (self-reference). A later hide() would then pop that
                     // self-reference and report the overlay as still current, even though it had just been
                     // hidden - a state/reality desync.
                     const script = cuts();
                     const visible = new Set();
                     const scenes = [
                                     { name: 'C', scene: { show: ({task}) => { visible.add('C'); task.done() }, hide: ({task}) => { visible.delete('C'); task.done() } } },
                                     { name: 'OV', scene: { show: ({task}) => { visible.add('OV'); task.done() }, hide: ({task}) => { visible.delete('OV'); task.done() }, parents: ['*'] } }
                                 ];

                     script.setScenes ( scenes );
                     await script.show ({ scene: 'C' });
                     await script.show ({ scene: 'OV' });
                     await script.show ({ scene: 'OV' }); // show the same overlay again while already current

                     expect ( script.getState() ).toEqual ({ scene: 'OV', parents: [ 'C' ], opened: true });

                     await script.hide ( 1 );
                     expect ( script.getState() ).toEqual ({ scene: 'C', parents: [], opened: true });
                     expect ( [...visible] ).toEqual ([ 'C' ]); // OV must actually be gone, matching reported state
         }) // it Re-showing the same wildcard overlay does not push it onto its own ancestor chain



 }) // describe