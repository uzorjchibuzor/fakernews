import React from 'react';
import ReactDOM from 'react-dom'
import Button from './button';
import renderer from 'react-test-renderer'

describe('Button', () => {

  it('renders', () => {
    const div = document.createElement('div')
    const dummyFunc = () => 1
    ReactDOM.render(<Button  onClick={dummyFunc}>Click Me</Button>, div)
  })

  test('snapshots', () => {
    const dummyFunc = () => 1

    const component = renderer.create(
      <Button onClick={dummyFunc}>Click Me</Button>
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  });
})