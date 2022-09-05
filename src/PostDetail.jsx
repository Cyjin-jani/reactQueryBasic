import { useQuery } from 'react-query'

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  )
  return response.json()
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: 'DELETE' }
  )
  return response.json()
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: 'PATCH', data: { title: 'REACT QUERY FOREVER!!!!' } }
  )
  return response.json()
}

export function PostDetail({ post }) {
  // 쿼리 키 사용의 틀린 예시
  // const { data, isError, error, isLoading } = useQuery(
  //   'postDetail',
  //   () => fetchComments(post.id)
  // )
  /**
   * query key가 위와 같은 경우,comments가 refetch되지 않음
   * WHY??
   * 모든 query가 같은 쿼리를 가지고 있기 때문.
   * 따라서 useQuery에서는 배열로 받음 => deps와 비슷한 로직.
   * 배열의 값들이 모두 같지 않다면 다른 key로 판단하여 refetch!
   *
   * Data for queries with known keys only refetched upon trigger
   * examples of tirggers:
   * - component remount
   * - window refocus
   * - running refetch function
   * - automated refetch
   * - query invalidation after a mutation
   *
   * */
  const { data, isError, error, isLoading } = useQuery(
    ['postDetail', post.id],
    () => fetchComments(post.id)
  )

  if (isError) {
    return (
      <>
        <h3>무언가 잘못되었다..</h3>
        <p>{error.toString()}</p>
      </>
    )
  }

  if (isLoading) {
    return <h3>로딩중....</h3>
  }

  return (
    <>
      <h3 style={{ color: 'blue' }}>{post.title}</h3>
      <button>Delete</button> <button>Update title</button>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map(comment => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  )
}
