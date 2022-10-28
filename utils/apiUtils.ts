const LIMIT = 5;
export function fetchPosts(page: number) {
  return fetch(
    `https://jsonplaceholder.typicode.com/posts?_start=${
      page * LIMIT
    }&_limit=${LIMIT}`
  ).then((res) => res.json());
}
