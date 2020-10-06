import React from 'react';
import ReactDOM from 'react-dom'
import Search from './search';
import renderer from 'react-test-renderer'

describe('Search', () => {

  it('renders', () => {
    const div = document.createElement('div')
    const value = 'react'
    const dummyFunc = () => 1
    ReactDOM.render(<Search value={value} onSubmit={dummyFunc} onChange={dummyFunc}>Search</Search>, div)
  })

  test('snapshots', () => {
    const value = 'react'
    const dummyFunc = () => 1

    const component = renderer.create(
      <Search value={value} onSubmit={dummyFunc} onChange={dummyFunc}>Search</Search>
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
    });
})