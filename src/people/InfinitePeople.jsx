import InfiniteScroll from 'react-infinite-scroller'
import { Person } from './Person'
import { useInfiniteQuery } from 'react-query'

const initialUrl = 'https://swapi.dev/api/people/'
const fetchUrl = async url => {
  const response = await fetch(url)
  return response.json()
}

export function InfinitePeople() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isError,
    error,
  } = useInfiniteQuery(
    'sw-people',
    ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    {
      getNextPageParam: lastPage => lastPage.next || undefined,
    }
  )

  if (isLoading) {
    return <div className="isLoading">is Loading...</div>
  }

  if (isError) {
    return <div>ERROR!!! {error.toString()}</div>
  }

  return (
    <>
      {isFetching && <div className="loading">is Fetching...</div>}
      <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
        {data.pages.map(pageData => {
          return pageData.results.map(person => (
            <Person
              key={person.name}
              name={person.name}
              hairColor={person.hair_color}
              eyeColor={person.eye_color}
            />
          ))
        })}
      </InfiniteScroll>
    </>
  )
}
