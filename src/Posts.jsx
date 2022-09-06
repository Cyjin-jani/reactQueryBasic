import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'

import { PostDetail } from './PostDetail'
const maxPostPage = 10

async function fetchPosts(pageNum) {
  // 에러를 던지기 위한 잘못된 url
  // const response = await fetch(
  //   'https://jsonplaceholderㅇㅂㅈㅇㅂㅈㅇㅂㅈㄴ.typicode.com/posts?_limit=10&_page=0'
  // )

  // 정상 url
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
  )
  return response.json()
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPost, setSelectedPost] = useState(null)

  /** preFetching을 위한 처리
   *  queryClient의 prefetchQuery메소드를 이용하여 데이터를 미리 가져올 수 있다
   *
   *  Prefetch
   *  - adds data to cache
   *  - automatically stale (configurable)
   *  - shows while re-fetching (cache가 expired되지 않는 한)
   *  - prefetch는 단지 pagination 뿐 아니라 사전에 필요한 (예측된) 데이터의 니즈가 있는 경우에 사용 가능하다
   */
  const queryClient = useQueryClient()
  useEffect(() => {
    if (currentPage < maxPostPage) {
      // 마지막 페이지의 경우 다음 페이지가 존재하지 않으므로 미리 가져올 데이터가 없음
      const nextPage = currentPage + 1
      queryClient.prefetchQuery(['posts', nextPage], () => fetchPosts(nextPage))
    }
  }, [currentPage, queryClient])

  /**
   * StaleTime is for re-fetching
   *
   * Cache is for data that might be re-used later
   *   - query goes into 'cold storage' if there's no active useQuery
   *   - cache data expires after cacheTime (default: 5min)
   *     = how long it's been since the last active useQuery (useQuery가 active되고 나서 얼마나 지났는지)
   *   - after the cache expires, the data is garbage collected
   *
   * Cache is backup data to display while fetching
   *
   */
  const { data, isError, error, isLoading, isFetching } = useQuery(
    ['posts', currentPage],
    () => fetchPosts(currentPage),
    {
      // staleTime: 1000,
      keepPreviousData: true, // 이전 페이지로 이동하더라도 이전의 데이터를 가지고 있어 바로 보여줄 수 있다
    }
  )
  /**
   * isLoading과 isFetching의 차이는??
   * isFetching은 async query function이 아직 resolved 되지 않은 상태를 말함
   * (해당 상태인 경우에, 캐시데이터의 존재 여부와는 상관없이 query function 실행 중이면 true가 된다)
   * isLoading은 cached data도 없고, 거기에 + isFetching인 상태이다
   */

  // if (isFetching) {
  //   return <h3>isFetching...</h3>
  // }
  if (isLoading) {
    // pagination이 추가되어 미리 데이터를 가져오는 prefetch가 생긴 뒤로는
    // 아래 로딩이 뜨지 않는다 왜냐하면 이미 prefetch가 되어 cached된 data가 존재하기 때문이다
    return <h3>Loading...</h3>
  }
  // react-query는 기본적으로 3번 시도한 뒤 최종적으로 실패라고 결론 짓는다.
  // 따라서 현재 코드의 경우 처음에 Loading이 화면에 나타나고, (3번의 시도 + 실패한 뒤)
  // isError라고 판단되어 아래 잘못되었다는 글자가 화면에 표시된다.
  if (isError) {
    return (
      <>
        <h3>무언가 잘못 됨...</h3>
        <p>{error.toString()}</p>
      </>
    )
  }

  return (
    <>
      <ul>
        {data.map(post => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage(prev => prev - 1)
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage(prev => prev + 1)
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  )
}
