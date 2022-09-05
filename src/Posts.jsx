import { useState } from 'react'
import { useQuery } from 'react-query'

import { PostDetail } from './PostDetail'
const maxPostPage = 10

async function fetchPosts() {
  // 에러를 던지기 위한 잘못된 url
  // const response = await fetch(
  //   'https://jsonplaceholderㅇㅂㅈㅇㅂㅈㅇㅂㅈㄴ.typicode.com/posts?_limit=10&_page=0'
  // )

  // 정상 url
  const response = await fetch(
    'https://jsonplaceholder.typicode.com/posts?_limit=10&_page=0'
  )
  return response.json()
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedPost, setSelectedPost] = useState(null)

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
  const { data, isError, error, isLoading } = useQuery('posts', fetchPosts, {
    // staleTime: 1000,
  })
  /**
   * isLoading과 isFetching의 차이는??
   * isFetching은 async query function이 아직 resolved 되지 않은 상태를 말함
   * isLoading은 cached data도 없고, 거기에 + isFetching인 상태이다
   */
  if (isLoading) {
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
        <button disabled onClick={() => {}}>
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button disabled onClick={() => {}}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  )
}
