import Post from "components/post";
import PostItem from "components/postItem";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useInfiniteQuery } from "react-query";
import { fetchPosts, postType } from "utils/apiUtils";
import { StickySectionHeader } from "@mayank1513/sticky-section-header";

export default function Home() {
  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery<postType[]>(
      "posts",
      ({ pageParam = 1 }) => fetchPosts(pageParam),
      {
        getNextPageParam: (lastPage, allPages) => {
          const nextPage = allPages?.length + 1;
          return lastPage?.length !== 0 ? nextPage : undefined;
        },
      }
    );
  const [filterBy, setFilterBy] = useState("");
  const [sortPosts, setSort] = useState(false);
  const router = useRouter();
  const selected = parseInt((router.query.postId as string) || "");
  const loadMore = useCallback(
    (entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
  );

  return (
    <div className="container m-auto p-6 pb-0 h-screen overflow-hidden flex flex-col">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="font-bold hidden md:block">My Blogs</h1>
        <input
          type="text"
          placeholder="Search"
          className="border-2 rounded w-96 px-4 py-2"
          onChange={(e) => setFilterBy(e.target.value)}
          value={filterBy}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 ml-4 rounded"
          onClick={() => {
            setSort(!sortPosts);
          }}
        >
          Sort
        </button>
      </header>
      <div className="flex overflow-hidden flex-grow">
        <ul
          className={
            "flex-grow overflow-auto pr-4 md:block " +
            (selected > -1 ? "hidden" : "")
          }
        >
          {isSuccess &&
            data.pages
              ?.flat()
              .filter(
                ({ title, body }) => title.includes(filterBy)
                // || body.includes(filterBy)
              )
              .sort((a, b) => (sortPosts ? a.title.localeCompare(b.title) : 0))
              .map((post) => <PostItem key={post.id} {...post} />)}

          <StickySectionHeader
            tag="div"
            stick={false}
            callBack={loadMore}
            className="loader"
          >
            {isFetchingNextPage && hasNextPage
              ? "Loading..."
              : "No search left"}
          </StickySectionHeader>
        </ul>
        {selected > -1 && <Post postId={selected} />}
      </div>
      <footer className="flex justify-center p-4 border-t mt-1">
        Created with 💖 by
        <a
          href="http://mayank-chaudhari.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 underline"
        >
          Mayank
        </a>
      </footer>
    </div>
  );
}
