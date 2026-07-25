import HomeClient from './HomeClient'
import TrendingFlightDeals from '@/app/components/TrendingFlightDeals'

export default function Home() {
  return <HomeClient trendingDeals={<TrendingFlightDeals limit={6} />} />
}