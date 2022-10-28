import Head from "next/head";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import { fetchPosts } from "utils/apiUtils";
import styles from "../styles/Home.module.css";

export default function Home() {
  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery("repos", ({ pageParam = 1 }) => fetchPosts(pageParam), {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages?.length + 1;
        return lastPage?.items?.length !== 0 ? nextPage : undefined;
      },
    });
  const observerElem = useRef(null);
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
  );
  useEffect(() => {
    const element = observerElem.current;
    if (!element) return;
    const option = { threshold: 0 };
    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(element);
    console.log({ data });
    return () => observer.unobserve(element);
  }, [fetchNextPage, hasNextPage, handleObserver]);
  return (
    <div className="container">
      <p className="bg-red-500">Hi Tailwind</p>
      <ul>
        {isSuccess &&
          data.pages?.map((page) =>
            page?.map((item: any, i: number) => (
              <li key={i}>
                <pre>{JSON.stringify(item, null, 2)}</pre>
              </li>
            ))
          )}

        <div className="loader" ref={observerElem}>
          {isFetchingNextPage && hasNextPage ? "Loading..." : "No search left"}
        </div>
      </ul>
    </div>
  );
}
