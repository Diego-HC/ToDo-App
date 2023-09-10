import { useRouter } from "next/router";
import Layout from "~/components/layout";
import { api } from "~/utils/api";
import { z } from "zod";
import { useEffect, useState } from "react";
import TaskCard from "~/components/TaskCard";
import { type Task } from "@prisma/client";

export default function Home() {
  const router = useRouter();

  const { groupId } = router.query;
  const group = api.groups.getOne.useQuery(groupId as string);
  const tasks = api.tasks.getGroupTasks.useQuery(groupId as string);

  const [completedTasks, setCompletedTasks] = useState<Array<Task>>([]);
  const [incompleteTasks, setIncompleteTasks] = useState<Array<Task>>([]);

  const { mutateAsync: asyncCreateTask } = api.tasks.create.useMutation();

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const [isTitleInvalid, setIsTitleInvalid] = useState(false);
  const [isDescriptionInvalid, setIsDescriptionInvalid] = useState(false);

  const titleSchema = z.object({
    title: z.string().min(1).max(80),
  });

  const descriptionSchema = z.object({
    description: z.string().max(500),
  });

  useEffect(() => {
    if (tasks.data) {
      setCompletedTasks(tasks.data.filter((task) => task.done === true));
      setIncompleteTasks(tasks.data.filter((task) => task.done === false));
    }
  }, [tasks.data]);

  const createTask = async (title: string, description: string | undefined) => {
    await asyncCreateTask({
      title,
      description,
      groupId: groupId as string,
    });
    await tasks.refetch();

    setTaskTitle("");
    setTaskDescription("");
  };

  return (
    <>
      <Layout title="Home" description="Home page">
        <div className="flex w-4/5 min-w-[80%] flex-1 flex-col gap-4 overflow-x-hidden">
          <h1 className="my-3 text-4xl">{group.data?.title}</h1>
          <div className="flex w-4/5 flex-wrap justify-center gap-5">
            <input
              className={
                "rounded-md p-2 text-black" +
                (isTitleInvalid
                  ? " border-spacing-1 border-red-500 bg-red-300"
                  : "")
              }
              type="text"
              placeholder="Title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            <input
              className={
                "rounded-md p-2 text-black" +
                (isDescriptionInvalid
                  ? " border-spacing-1 border-red-500 bg-red-300"
                  : "")
              }
              type="text"
              placeholder="Description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
            <button
              className="rounded-md bg-green-600 px-2 py-1 text-white"
              onClick={() => {
                if (!titleSchema.safeParse({ title: taskTitle }).success) {
                  setIsTitleInvalid(true);
                  return;
                }
                setIsTitleInvalid(false);

                if (
                  !descriptionSchema.safeParse({
                    description: taskDescription,
                  }).success
                ) {
                  setIsDescriptionInvalid(true);
                  return;
                }
                setIsDescriptionInvalid(false);

                void createTask(taskTitle, taskDescription);
              }}
            >
              Create Task
            </button>
          </div>
          <div className="flex max-h-[65%] min-w-[80%] max-w-[80%] flex-1 flex-col gap-8 overflow-y-auto px-3">
            {incompleteTasks.map((task) => (
              <div key={task.id} className="text-black">
                <TaskCard taskId={task.id} />
              </div>
            ))}
            {incompleteTasks.length !== 0 && completedTasks.length !== 0 && (
              <hr className="border-y" />
            )}
            {completedTasks.map((task) => (
              <div key={task.id} className="text-black">
                <TaskCard taskId={task.id} />
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
}
