import React from 'react';
import ReactDOM from 'react-dom'
import Table from './table';
import renderer from 'react-test-renderer'

describe('Table', () => {
  const props = {
    list: [
    { title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y' },
    { title: '2', author: '2', num_comments: 1, points: 2, objectID: 'z' }],
  }

    const dummyFunc = () => 1

  it('renders', () => {
    const div = document.createElement('div')
    ReactDOM.render(<Table  list={props.list} onDismiss={dummyFunc} />, div)
  })

  test('snapshots', () => {

    const component = renderer.create(
      <Table  list={props.list} onDismiss={dummyFunc} />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})