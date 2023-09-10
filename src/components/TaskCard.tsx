import {
  BsCheckCircleFill,
  BsCheckCircle,
  BsFillTrashFill,
} from "react-icons/bs";
import { IconContext } from "react-icons";
import { api } from "~/utils/api";

export default function TaskCard({ taskId }: { taskId: string }) {
  const taskQueryResult = api.tasks.getOne.useQuery(taskId);
  let task = taskQueryResult.data;

  const { mutateAsync: asyncDeleteTask } = api.tasks.delete.useMutation();
  const { mutateAsync: asyncUpdateTask } = api.tasks.updateDone.useMutation();

  const utils = api.useContext();

  console.log(task);

  const deleteTask = async (id: string) => {
    await asyncDeleteTask({ id });
    await taskQueryResult.refetch();
    await utils.tasks.invalidate();
    task = taskQueryResult.data;
  };

  const setTaskComplete = async (id: string) => {
    await asyncUpdateTask({
      id,
      done: true,
    });
    console.log("setTaskComplete");
    await taskQueryResult.refetch();
    await utils.tasks.invalidate();
    task = taskQueryResult.data;
  };

  const setTaskIncomplete = async (id: string) => {
    await asyncUpdateTask({
      id,
      done: false,
    });
    console.log("setTaskIncomplete");
    await taskQueryResult.refetch();
    await utils.tasks.invalidate();
    task = taskQueryResult.data;
  };

  if (task === undefined || task === null) {
    return <></>;
  }

  if (!task.description) {
    return (
      <div className="flex flex-row justify-between gap-2 bg-white rounded-md px-4 py-2">
        <p className="max-w-[85%] flex-1 break-words text-lg">{task.title}</p>
        <div className="flex flex-row gap-3">
          <IconContext.Provider value={{ size: "30px" }}>
            {task.done ? (
              <button onClick={() => void setTaskIncomplete(taskId)}>
                <BsCheckCircleFill className="flex-none self-center" />
              </button>
            ) : (
              <button onClick={() => void setTaskComplete(taskId)}>
                <BsCheckCircle className="flex-none self-center" />
              </button>
            )}
            <button onClick={() => void deleteTask(taskId)}>
              <BsFillTrashFill className="flex-none self-center" />
            </button>
          </IconContext.Provider>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-md bg-white px-4 py-2">
      <div className="flex flex-col gap-3">
        <p className="self-center break-words text-xl">{task.title}</p>
        <hr className="border-y" />
        <div className="flex flex-row justify-between gap-2">
          <p className="max-w-[85%] flex-1 break-words text-lg">
            {task.description}
          </p>
          <div className="flex flex-row gap-3">
            <IconContext.Provider value={{ size: "30px" }}>
              {task.done ? (
                <button onClick={() => void setTaskIncomplete(taskId)}>
                  <BsCheckCircleFill className="flex-none self-center" />
                </button>
              ) : (
                <button onClick={() => void setTaskComplete(taskId)}>
                  <BsCheckCircle className="flex-none self-center" />
                </button>
              )}
              <button onClick={() => void deleteTask(taskId)}>
                <BsFillTrashFill className="flex-none self-center" />
              </button>
            </IconContext.Provider>
          </div>
        </div>
      </div>
    </div>
  );
}
