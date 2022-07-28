import { getBuiltGraphSDK, OrderDirection, Pair_filter, Pair_orderBy } from '../.graphclient'
import { ENABLED_NETWORKS } from '../config'

export const getBundles = async () => {
  const sdk = await getBuiltGraphSDK()

  const { crossChainBundles: bundles } = await sdk.CrossChainBundles({
    chainIds: ENABLED_NETWORKS,
  })

  const _bundles = bundles.reduce((acc, cur) => {
    acc[cur.chainId] = cur
    return acc
  }, {})

  return _bundles
}

type GetPoolsQuery = Partial<{
  where: Pair_filter
  orderBy: Pair_orderBy
  orderDirection: OrderDirection
}>

export const getPools = async (query?: GetPoolsQuery) => {
  const sdk = await getBuiltGraphSDK()

  const where = query?.where || {}
  const orderBy = query?.orderBy || 'reserveETH'
  const orderDirection = query?.orderDirection || 'desc'

  const { crossChainPairs: pairs } = await sdk.CrossChainPairs({
    chainIds: ENABLED_NETWORKS,
    first: 10,
    ...(query && { where, orderBy, orderDirection }),
  })

  return pairs
}