import InfiniteScroll from 'react-infinite-scroller'
import { useInfiniteQuery } from 'react-query'
import { Species } from './Species'

const initialUrl = 'https://swapi.dev/api/species/'
const fetchUrl = async url => {
  const response = await fetch(url)
  return response.json()
}

export function InfiniteSpecies() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isError,
    error,
  } = useInfiniteQuery(
    'sw-species',
    ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    {
      getNextPageParam: lastPage => lastPage.next || undefined,
    }
  )

  if (isLoading) {
    return <div className="isLoading">로딩중...</div>
  }

  if (isError) {
    return <div className="isLoading">에러..{error.toString()}</div>
  }

  return (
    <>
      {isFetching && <div className="loading">패칭중...</div>}
      <InfiniteScroll hasMore={hasNextPage} loadMore={fetchNextPage}>
        {data.pages.map(pageData => {
          return pageData.results.map(spc => (
            <Species
              key={spc.name}
              name={spc.name}
              language={spc.language}
              averageLifespan={spc.average_lifespan}
            />
          ))
        })}
      </InfiniteScroll>
    </>
  )
}
