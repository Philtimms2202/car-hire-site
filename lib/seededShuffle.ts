import seedrandom from "seedrandom"

export function seededShuffle<T>(arr: T[], seed: string): T[] {
  const rng = seedrandom(seed)

  return arr
    .map(item => ({ item, sort: rng() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item)
}