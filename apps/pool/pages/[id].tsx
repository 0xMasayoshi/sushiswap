import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { FC } from 'react'
import useSWR, { SWRConfig } from 'swr'

import { Pair } from '../.graphclient'
import { Layout, PoolButtons, PoolComposition, PoolHeader, PoolPosition, PoolRewards } from '../components'
import { PoolStats } from '../components'
import { getPool } from '../lib/api'

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const pair = await getPool(query.id as string)
  return {
    props: {
      fallback: {
        [`/pool/api/pool/${query.id}`]: pair,
      },
    },
  }
}

const Pool: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_Pool />
    </SWRConfig>
  )
}

const _Pool = () => {
  const router = useRouter()
  const { data: pair } = useSWR<Pair>(`/pool/api/pool/${router.query.id}`, (url) =>
    fetch(url).then((response) => response.json())
  )

  return (
    <Layout>
      <div className="grid grid-cols-[568px_auto] gap-12">
        <div className="flex flex-col gap-9">
          <PoolHeader pair={pair} />
          <PoolStats pair={pair} />
          <PoolComposition pair={pair} />
          <PoolRewards pair={pair} />
        </div>
        <div className="flex flex-col gap-4">
          <PoolPosition pair={pair} />
          <PoolButtons pair={pair} />
        </div>
      </div>
    </Layout>
  )
}

export default Pool