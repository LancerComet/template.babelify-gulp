describe('Print hello to screen.', () => {
  it('Should print hello to screen.', () => {
    const msg = 'Hello!'
    console.log(msg)
    expect(msg).equal('Hello!')
  })
})