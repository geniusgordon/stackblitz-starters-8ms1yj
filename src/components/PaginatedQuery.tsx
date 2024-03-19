'use client';
import { gql } from '@apollo/client';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { useEffect, useTransition } from 'react';

const GET_LAUCHES = gql(`
  query Lauches($limit: Int, $offset: Int) {
    histories(limit: $limit, offset: $offset) {
     details
    }
  }
`);

export default function PaginatedQuery() {
  const [isPending, startTransition] = useTransition();
  const { error, data, fetchMore } = useSuspenseQuery<{
    histories: { details: string }[];
  }>(GET_LAUCHES, {
    variables: { limit: 1, offset: 0 },
  });

  useEffect(() => {
    console.log('Data :', data.histories);
  }, [data]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const fetchMoreData = () => {
    startTransition(() => {
      fetchMore({
        variables: {
          // SpaceX api broken so i have to do this
          limit: data.histories.length + 1,
          offset: data.histories.length,
        },
      });
    });
  };

  return (
    <>
      <button onClick={fetchMoreData}>Fetch more</button>
      {data.histories.map((history: any) => (
        <div
          key={history.details}
          style={{
            marginTop: '1rem',
            padding: '1rem',
            border: isPending ? '1px solid red' : '1px solid black',
          }}
        >
          {history.details}
        </div>
      ))}
    </>
  );
}
