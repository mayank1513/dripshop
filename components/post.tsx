import Link from "next/link";
import { useQuery } from "react-query";
import { postType } from "utils/apiUtils";

export default function Post({ postId }: { postId: number }) {
  const { data, isLoading, error } = useQuery<postType>(["post", postId], () =>
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`).then((res) =>
      res.json()
    )
  );
  return (
    <div className="p-2 rounded border-2 mb-6 md:w-1/2 overflow-auto md:ml-4 md:mb-1">
      {isLoading ? (
        <h1>Loading...</h1>
      ) : error ? (
        <p>{JSON.stringify(error)}</p>
      ) : (
        <>
          <h1 className="font-bold capitalize mb-4">
            <Link href="/" className="mr-2">
              🔙
            </Link>
            {data?.title}
          </h1>
          <p className="text-justify">{data?.body}</p>
        </>
      )}
    </div>
  );
}
