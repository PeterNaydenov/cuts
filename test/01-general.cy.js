'use strict'

import VisualController from '@peter.naydenov/visual-controller-for-vue3' // Docs : https://github.com/PeterNaydenov/visual-controller-for-vue3
import { expect } from 'chai'
import cuts from '../src/main.js'
import { pluginClick } from '@peter.naydenov/shortcuts'

import Dummy from './dummy.vue'
import Red from './red.vue'
import Blue from './blue.vue'
import Gray from './gray.vue'



describe ( 'General', () => {
    
    it ( 'Start a sreenWriter. ScreenWriter API', () => {
                const script = cuts ();
                expect ( script ).to.have.property ( 'show' )
                expect ( script ).to.have.property ( 'hide' )
                expect ( script ).to.have.property ( 'setScenes' )
                expect ( script ).to.have.property ( 'setNote' )
                expect ( script ).to.have.property ( 'listScenes' )
                expect ( script ).to.have.property ( 'listShortcuts' )
                expect ( script ).to.have.property ( 'setDependencies' )
                expect ( script ).to.have.property ( 'getDependencies' )
        }) // it start a director



    it ( 'Load a top level page', done => {
                let 
                      render = false
                    , click = false
                    , html = new VisualController ()
                    ;
                const 
                      script = cuts ()
                    , d = document.querySelector ('[data-cy-root]')
                    , testScene = { 
                                      show : ({ task, dependencies }) => {
                                                const { html } = dependencies;
                                                html.publish ( Red, {}, 'container' )
                                                render = true
                                                task.done ()
                                            }
                                    , hide : ({task, dependencies}) => {
                                                const { html } = dependencies;
                                                html.destroy ( 'container' )
                                                task.done ()
                                            }
                                    , 'click: left-1' : ({dependencies,target}) => {
                                                    click = true
                                                }
                            }
                    ;
                script.enablePlugin ( pluginClick )
                d.id = 'root'
                html.publish ( Dummy, {}, 'root' ) 

                cy.wait ( 0 )
                    .then ( () => {
                            script.setDependencies ({ html })
                            script.setScenes ([ 
                                                  { name:'test', scene:testScene } 
                                            ])
                            script.show ({ scene : 'test' })
                            // cy.get ( '#target' ).click ()
                        })
                    .then ( () => {
                            expect ( render ).to.be.true
                            // expect ( click ).to.be.true
                            return cy.wait ( 0 )
                        })
                    .then ( () => {
                            return script.hide ()
                        })
                    .then ( () => {
                            const pageContent = document.getElementById('container').innerHTML
                            expect ( pageContent ).to.be.empty
                            done ()
                        })
        }) // it load a top level page



    it ( 'Load a deep level page', done => {
            let 
                  render = false
                , click = false
                , html = new VisualController ()
                ;
            const 
                  script = cuts ()
                , d = document.querySelector ('[data-cy-root]' )
                , testScene = { 
                                  show : ({ task, dependencies }) => {
                                            const { html } = dependencies;
                                            html.publish ( Red, {}, 'container' )
                                            render = true
                                            task.done ()
                                        }
                                , hide : ({task, dependencies}) => {
                                            const { html } = dependencies;
                                            html.destroy ( 'container' )
                                            task.done ()
                                        }
                                , parents : [ 'blue' ]
                                , 'click: 1-left' : ({dependencies,target}) => { // Order in the event name after the prefix is not important
                                                click = true
                                            }
                        }
                , bluePage = {
                                      show : ({ task, dependencies }) => {
                                                const { html } = dependencies;
                                                html.publish ( Blue, {}, 'blue' )
                                                task.done ()
                                            }
                                    , hide : ({task, dependencies}) => {
                                                const { html } = dependencies;
                                                html.destroy ( 'blue' )
                                                task.done ()
                                            }
                                    , 'click: left-1' : ({dependencies,target}) => {}
                        }
                ;
            script.enablePlugin ( pluginClick )
            d.id = 'root'
            html.publish ( Dummy, {}, 'root' )

            cy.wait ( 0 )
                .then ( () => {
                        script.setDependencies ({ html })
                        script.setScenes ([ 
                                              { name:'test' , scene : testScene } 
                                            , { name: 'blue', scene : bluePage  }
                                        ])
                        script.show ({ scene: 'test' })
                        cy.get ( '#target' ).click ()
                    })
                .then ( () => {
                        expect ( render ).to.be.true
                        expect ( click ).to.be.true
                        return cy.wait ( 0 )
                    })
                .then ( () => {
                        return script.hide ( '*' )
                    })
                .then ( () => {
                        const pageContent = document.getElementById('container').innerHTML
                        expect ( pageContent ).to.be.empty
                        done ()
                    })
        }) // it load a deep level page



    it ( 'Turn to other branch', done => {
            let 
                  render = false
                , click = false
                , html = new VisualController ()
                ;
            const 
                  script = cuts ()
                , d = document.querySelector ('[data-cy-root]' )
                , testScene = { 
                                  show : ({ task, dependencies }) => {
                                            const { html } = dependencies;
                                            html.publish ( Red, {}, 'subgray' )   // subgray is inside 'blue' component
                                            render = true
                                            task.done ()
                                        }
                                , hide : ({task, dependencies}) => {
                                            const { html } = dependencies;
                                            html.destroy ( 'subgray' )
                                            task.done ()
                                        }
                                , parents : [ 'blue' ]
                                , 'click: left-1' : ({dependencies,target}) => {
                                                click = true
                                            }
                        }
                , bluePage = {
                                      show : ({ task, dependencies }) => {
                                                const { html } = dependencies;
                                                html.publish ( Blue, {}, 'blue' )
                                                task.done ()
                                            }
                                    , hide : ({task, dependencies}) => {
                                                const { html } = dependencies;
                                                html.destroy ( 'blue' )
                                                task.done ()
                                            }
                                    , 'click: left-1' : ({dependencies,target}) => {}
                        }
                , grayPage = {
                                      show : ({ task, dependencies }) => {
                                                const { html } = dependencies;
                                                html.publish ( Gray, {}, 'subgray' )
                                                task.done ()
                                            }
                                    , hide : ({task, dependencies}) => {
                                                const { html } = dependencies;
                                                html.destroy ( 'subgray' )
                                                task.done ()
                                            }
                                    , parents : [ 'blue' ]
                                    , 'click: left-1' : ({dependencies,target}) => {}
                        }
                ;
            script.enablePlugin ( pluginClick )
            d.id = 'root'
            html.publish ( Dummy, {}, 'root' )

            cy.wait ( 0 )
                .then ( () => {
                        script.setDependencies ({ html })
                        script.setScenes ([ 
                                              { name:'test', scene  : testScene } 
                                            , { name: 'blue', scene : bluePage  }
                                            , { name: 'gray', scene : grayPage  }
                                        ])
                        script.show ({ scene : 'test' })
                        cy.get ( '#target' ).click ()
                    })
                .then ( () => {
                        expect ( render ).to.be.true
                        expect ( click ).to.be.true
                        return cy.wait ( 0 )
                    })
                .then ( () => script.show ({ scene : 'gray' }  ))
                .then ( () => {
                        const 
                              red = document.querySelectorAll ( '.red' )
                            , blue = document.querySelectorAll ( '.gray' )
                            ;
                        expect ( blue.length ).to.be.equal ( 1 )
                        expect ( red.length ).to.be.equal  ( 0 )
                        done ()
                    })
    }) // it turn to other branch
}) // describe