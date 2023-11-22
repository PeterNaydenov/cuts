'use strict'

import findInstructions from "../src/findInstructions.js"
import { expect } from 'chai'


describe ( 'Find a Position', () => { 



 it ( 'Switch top level pages', () => {
        let result = []
        let g = findInstructions ( 'old', undefined, 'new', undefined );

        for ( const n of g ) {    result.push ( n )   }

        expect ( result.length ).to.be.equal ( 2 )
        expect ( result[0][0] ).to.be.equal ( 'old' )
        expect ( result[0][1] ).to.be.equal ( 'hide' )

        expect ( result[1][0] ).to.be.equal ( 'new' )
        expect ( result[1][1] ).to.be.equal ( 'show' )
 }) // it switch top level pages



 it ( 'Switch from child page to top level page', () => {
    let result = [];
    let g = findInstructions ( 'old', ['one','two'], 'new', undefined );

    for ( const n of g ) {   result.push ( n )   }

    expect ( result[0]).to.be.deep.equal ( ['old', 'hide'] )
    expect ( result[1]).to.be.deep.equal ( ['two', 'hide'] )
    expect ( result[2]).to.be.deep.equal ( ['one', 'hide'] )
    expect ( result[3]).to.be.deep.equal ( ['new', 'show'] )
}) // it switch from child page to top level page



it ( 'Switch to child page', () => {
    let result = [];
    let g = findInstructions ( 'old', ['bla'], 'new', ['old','two','three'] );
    for ( const n of g ) {   result.push ( n )   }

    expect ( result ).to.have.lengthOf ( 3 )
    expect ( result[0]).to.be.deep.equal ( ['two', 'show'] )
    expect ( result[1]).to.be.deep.equal ( ['three', 'show'] )
    expect ( result[2]).to.be.deep.equal ( ['new', 'show'] )
}) // it switch to child page



it ( 'From child page to other siblings page', () => {
    let result = [];
    let g = findInstructions ( 'old', ['two', 'three'], 'new', ['two','three'] );
    for ( const n of g ) {   result.push ( n )   }

    expect ( result ).to.have.lengthOf ( 2 )
    expect ( result[0]).to.be.deep.equal ( ['old', 'hide'] )
    expect ( result[1]).to.be.deep.equal ( ['new', 'show'] )
}) // it from top level page to not own child page



it ( 'From top level page to not own child page', () => {
    let result = [];
    let g = findInstructions ( 'old', undefined, 'new', ['two','three'] );
    for ( const n of g ) {   result.push ( n )   }

    expect ( result ).to.have.lengthOf ( 3 )
    expect ( result[0]).to.be.deep.equal ( ['old', 'hide'] )
    expect ( result[1]).to.be.deep.equal ( ['two', 'show'] )
    expect ( result[2]).to.be.deep.equal ( ['three', 'show'] )
}) // it from top level page to not own child page



it ( 'Long chain of parents', () => {
    let result = [];
    let g = findInstructions ( 'old', [ 'one', 'branch' ], 'new', [ 'one','two','three'] );
    for ( const n of g ) {   result.push ( n )   }

    expect ( result ).to.have.lengthOf ( 5 )
    expect ( result[0]).to.be.deep.equal ( ['old', 'hide'] )
    expect ( result[1]).to.be.deep.equal ( ['branch', 'hide'] )
    expect ( result[2]).to.be.deep.equal ( ['two', 'show'] )
    expect ( result[3]).to.be.deep.equal ( ['three', 'show'] )
    expect ( result[4]).to.be.deep.equal ( ['new', 'show'] )
}) // it long chain of parents



it ( 'Different branches', () => {
    let result = [];
    let g = findInstructions ( 'old', [ 'something', 'branch' ], 'new', [ 'one','two','three'] );
    for ( const n of g ) {   result.push ( n )   }

    expect ( result ).to.have.lengthOf ( 7 )
    expect ( result[0]).to.be.deep.equal ( ['old', 'hide'] )
    expect ( result[1]).to.be.deep.equal ( ['branch', 'hide'] )
    expect ( result[2]).to.be.deep.equal ( ['something', 'hide'] )
    expect ( result[3]).to.be.deep.equal ( ['one', 'show'] )
    expect ( result[4]).to.be.deep.equal ( ['two', 'show'] )
    expect ( result[5]).to.be.deep.equal ( ['three', 'show'] )
    expect ( result[6]).to.be.deep.equal ( ['new', 'show'] )
}) // it long chain of parents

}) // describe