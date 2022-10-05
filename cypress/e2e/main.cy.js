/// <reference types="cypress" />

const PORT = process.env.PORT || 3000

describe('Pinia demo with counters', () => {
  beforeEach(() => {
    cy.visit(`http://localhost:${PORT}`)
  })

  it('works', () => {
    expect(true).to.eq(true)
  })
})
