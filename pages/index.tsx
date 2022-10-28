import Head from "next/head";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useMutation } from "react-query";
import { fetchPosts, postType } from "utils/apiUtils";
import styles from "../styles/Home.module.css";

export default function Home() {
  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery<postType[]>(
      "repos",
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
  const [selected, setSelected] = useState(-1);
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

  const delMutaion = useMutation((id) =>
    fetch(``, {
      method: "DELETE",
    })
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

  function deletePost(id: number) {
    // write Delete mutaion
    alert("Todo: Delete " + id);
    console.log("delete", id);
  }
  function edit(id: number) {
    alert("Todo: Edit post " + id);
  }

  return (
    <div className="container m-auto p-6 h-screen overflow-hidden">
      <header className="mb-6 flex justify-between">
        <h1 className="font-bold">My Blogs</h1>
        <input
          type="text"
          placeholder="Search"
          className="border-2 rounded w-96 px-4 py-2"
          onChange={(e) => setFilterBy(e.target.value)}
          value={filterBy}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
          onClick={() => {
            setSort(!sortPosts);
          }}
        >
          Sort
        </button>
      </header>
      <div className="flex h-full pb-4">
        <ul className="flex-grow overflow-auto">
          {isSuccess &&
            data.pages
              ?.flat()
              .filter(
                ({ title, body }) => title.includes(filterBy)
                // || body.includes(filterBy)
              )
              .sort((a, b) => (sortPosts ? a.title.localeCompare(b.title) : 0))
              .map(({ id, title }) => (
                <li
                  key={id}
                  className="px-4 py-2 my-4 cursor-pointer border-2 rounded capitalize hover:bg-slate-300 flex"
                  onClick={() => setSelected(id)}
                >
                  {title}
                  <span className="flex-grow"></span>
                  <button
                    className="m-2"
                    onClick={() => {
                      edit(id);
                    }}
                  >
                    🖋
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePost(id);
                    }}
                  >
                    🚮
                  </button>
                </li>
              ))}

          <div className="loader" ref={observerElem}>
            {isFetchingNextPage && hasNextPage
              ? "Loading..."
              : "No search left"}
          </div>
        </ul>
        {selected > -1 &&
          isSuccess &&
          data.pages
            .flat()
            .filter(({ id }) => id == selected)
            .map(({ title, body }) => (
              <div className="p-2 rounded border-2 m-4 mb-10 w-1/2">
                <h1 className="font-bold capitalize mb-4">{title}</h1>
                <p>{body}</p>
              </div>
            ))}
      </div>
    </div>
  );
}
