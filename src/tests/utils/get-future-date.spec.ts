import { expect, test } from "vitest"
import { getFutureDate } from './get-future-date'

test('increases date with one year', () => {
    const year = new Date().getFullYear

    expect(getFutureDate('2022-08-10').getFullYear()).toEqual(2023)
})