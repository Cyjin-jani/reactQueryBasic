import { useQuery, useMutation } from 'react-query'

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
  // useMutation은 mutate 함수를 반환함 (구조분해를 하지 않은 이유는 위의 useQuery와 겹치지 않도록 하기 위함)
  const deleteMutation = useMutation(postId => deletePost(postId))
  // 위와 같은 방식이 아닌, 아래와 같이 바로 넘겨주는 것도 가능하나,
  // useMutation에서는 바로 인자값을 받을 수 있는 것을 보여주기 위해 위와 같이 사용
  // const deleteMutation = useMutation(() => deletePost(post.id));

  const updatePostMutation = useMutation(postId => updatePost(postId))

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
      <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
      {deleteMutation.isError && (
        <p style={{ color: 'red' }}>Error deleting the post</p>
      )}
      {deleteMutation.isLoading && (
        <p style={{ color: 'blue' }}>now loading...for delete</p>
      )}
      {deleteMutation.isSuccess && (
        <p style={{ color: 'green' }}>Deleted! (is a fake) </p>
      )}
      <button onClick={() => updatePostMutation.mutate(post.id)}>
        Update title
      </button>
      {updatePostMutation.isLoading && (
        <p style={{ color: 'blue' }}> now loading for update</p>
      )}
      {updatePostMutation.isError && (
        <p style={{ color: 'red' }}> failed for updating the post</p>
      )}
      {updatePostMutation.isSuccess && (
        <p style={{ color: 'green' }}>now updated the title</p>
      )}
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
