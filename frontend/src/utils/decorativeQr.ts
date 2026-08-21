const GRID_SIZE = 21

const FINDERS = [
  [0, 0],
  [0, 14],
  [14, 0],
]

export const qrCells = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
  const row = Math.floor(index / GRID_SIZE)
  const column = index % GRID_SIZE
  const isFinderArea = FINDERS.some(
    ([startRow, startColumn]) =>
      row >= startRow && row < startRow + 7 && column >= startColumn && column < startColumn + 7
  )

  if (isFinderArea) return false
  return (row * 7 + column * 11 + row * column) % 5 < 2
})
