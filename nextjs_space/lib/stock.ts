/**
 * Whether a book can be sold.
 *
 * `soldOut` is the team's manual switch; `stock` is the count. Either one
 * makes the book unavailable, so setting a stock of 0 needs no second step.
 * A null stock means the count is not tracked, and only the switch applies.
 */
export function isSoldOut(product: { soldOut: boolean; stock: number | null }): boolean {
  return product.soldOut || (product.stock !== null && product.stock <= 0)
}

/** Whether `quantity` copies can be sold right now. */
export function canFulfil(
  product: { soldOut: boolean; stock: number | null },
  quantity: number,
): boolean {
  if (product.soldOut) return false
  return product.stock === null || product.stock >= quantity
}
