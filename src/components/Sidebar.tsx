import { useState } from "react";
import { api } from "~/utils/api";
import { z } from "zod";
import Link from "next/link";

export default function Sidebar() {
  const groups = api.groups.getAll.useQuery();
  const { mutateAsync: asyncCreateGroup } = api.groups.create.useMutation();

  const [creatingGroup, setCreatingGroup] = useState(false);
  const [groupTitle, setGroupTitle] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  const [isNameInvalid, setIsNameInvalid] = useState(false);

  const titleSchema = z.object({
    title: z.string().min(1).max(50),
  });

  const createGroup = async (
    title: string,
    description: string | undefined,
  ) => {
    await asyncCreateGroup({
      title,
      description,
    });
    await groups.refetch();

    setCreatingGroup(false);
    setGroupTitle("");
    setGroupDescription("");
  };

  return (
    <>
      <div className="top-20 flex w-64 min-w-[16rem] flex-col gap-3 bg-slate-700 py-8">
        {groups.data?.map((group) => (
          <div key={group.id} className="self-center">
            <Link href={`/${group.id}`}>
              <p>{group.title}</p>
            </Link>
          </div>
        ))}

        {creatingGroup ? (
          <div className="flex flex-col gap-4 px-4 text-black">
            <input
              className={
                "rounded-md px-2" + (isNameInvalid ? " bg-red-300 border-red-500 border-spacing-1" : "")
              }
              type="text"
              placeholder="Title"
              value={groupTitle}
              onChange={(e) => {
                setGroupTitle(e.target.value);
              }}
            />
            <input
              className="rounded-md px-2"
              type="text"
              placeholder="Description"
              value={groupDescription}
              onChange={(e) => {
                setGroupDescription(e.target.value);
              }}
            />
            <div className="flex flex-row justify-evenly text-white">
              <button
                className="rounded-md bg-red-500 px-2 py-1"
                onClick={() => {
                  setCreatingGroup(false);
                  setGroupTitle("");
                  setGroupDescription("");

                  setIsNameInvalid(false);
                }}
              >
                <p>Cancel</p>
              </button>
              <button
                className="rounded-md bg-green-600 px-2 py-1"
                onClick={() => {
                  try {
                    titleSchema.parse({
                      title: groupTitle,
                    });
                  } catch (error) {
                    // console.log(error);
                    setIsNameInvalid(true);

                    return;
                  }
                  setIsNameInvalid(false);

                  void createGroup(groupTitle, groupDescription);
                }}
              >
                Create
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              setCreatingGroup(true);
            }}
          >
            <p>Create List</p>
          </button>
        )}
      </div>
    </>
  );
}
