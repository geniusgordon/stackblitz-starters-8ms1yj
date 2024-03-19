import ApolloProvider from '@/components/ApolloProvider'
import PaginatedQuery from '@/components/PaginatedQuery'
import { Suspense } from 'react'

export default function Page() {
  return (
    <ApolloProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <PaginatedQuery />
      </Suspense>
    </ApolloProvider>
  )
}
