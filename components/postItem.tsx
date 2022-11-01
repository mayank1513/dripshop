import Link from "next/link";
import { MouseEvent } from "react";
import { useMutation } from "react-query";
import { postType } from "utils/apiUtils";

export default function PostItem({ id, title }: postType) {
  const delMutaion = useMutation(["posts"], () =>
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: "DELETE",
    })
  );

  const updateMutation = useMutation(["posts"], (title: string) =>
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        title,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((res) => res.json())
  );

  function deletePost(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    delMutaion.mutate();
  }

  function editPost(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const newTitle = prompt("Update Title", title);
    if (newTitle) updateMutation.mutate(newTitle);
    else alert("Title can not be empty.");
  }
  return (
    <li
      key={id}
      className="px-4 py-2 mb-6 cursor-pointer border-2 rounded capitalize hover:bg-slate-300"
      // onClick={() => setSelected(id)}
    >
      <Link href={`/${id}`} className="flex items-center">
        {title}
        <span className="flex-grow"></span>
        <button className="m-2" onClick={editPost}>
          🖋
        </button>
        <button onClick={deletePost}>🚮</button>
      </Link>
    </li>
  );
}
