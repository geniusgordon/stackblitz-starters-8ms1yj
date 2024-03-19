'use client'

import { ApolloLink, HttpLink } from '@apollo/client'
import { offsetLimitPagination } from '@apollo/client/utilities'
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  NextSSRApolloClient,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr'

function makeClient() {
  const httpLink = new HttpLink({
    uri: 'https://spacex-production.up.railway.app/',

    fetchOptions: { cache: 'no-store' },
  })

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            histories: {
              keyArgs: false,
              merge(existing, incoming, { args }) {
                const merged = existing ? existing.slice(0) : [];
          
                if (incoming) {
                  if (args) {
                    // Assume an offset of 0 if args.offset omitted.
                    const { offset = 0 } = args;
                    for (let i = 0; i < incoming.length; ++i) {
                      merged[offset + i] = incoming[i];
                    }
                  } else {
                    // It's unusual (probably a mistake) for a paginated field not
                    // to receive any arguments, so you might prefer to throw an
                    // exception here, instead of recovering by appending incoming
                    // onto the existing array.
                    merged.push(...incoming);
                  }

                  console.log('existing:', existing?.length);
                  console.log('incoming:', incoming?.length);
                  console.log('merged:', merged.length);
                }
          
                return merged;
              },
            }
          },
        },
      },
    }),
    link:
      typeof window === 'undefined'
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : httpLink,
  })
}

export default function ApolloProvider({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  )
}
