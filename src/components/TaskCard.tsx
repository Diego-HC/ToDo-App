import {
  BsCheckCircleFill,
  BsCheckCircle,
  BsFillTrashFill,
  BsStarFill,
  BsStar,
} from "react-icons/bs";
import { IconContext } from "react-icons";
import { api } from "~/utils/api";

export default function TaskCard({ taskId }: { taskId: string }) {
  const taskQueryResult = api.tasks.getOne.useQuery(taskId);
  let task = taskQueryResult.data;

  const { mutateAsync: asyncDeleteTask } = api.tasks.delete.useMutation();
  const { mutateAsync: asyncUpdateTask } = api.tasks.updateDone.useMutation();
  const { mutateAsync: asyncUpdateStarred } = api.tasks.updateStarred.useMutation();

  const utils = api.useContext();

  // console.log(task);

  const deleteTask = async (id: string) => {
    await asyncDeleteTask({ id });
    await taskQueryResult.refetch();
    await utils.tasks.invalidate();
    task = taskQueryResult.data;
  };

  const setTaskCompleted = async (id: string, completed: boolean) => {
    await asyncUpdateTask({
      id,
      done: completed,
    });
    // console.log("setTaskCompleted", id, completed);
    await taskQueryResult.refetch();
    await utils.tasks.invalidate();
    task = taskQueryResult.data;
  }

  const setStarred = async (id: string, starred: boolean) => {
    await asyncUpdateStarred({
      id,
      starred,
    });
    // console.log("setStarred");
    await taskQueryResult.refetch();
    await utils.tasks.invalidate();
    task = taskQueryResult.data;
  }

  if (task === undefined || task === null) {
    return <></>;
  }

  const icons = () => {
    if (task === undefined || task === null) return (<></>);
    return (
    <IconContext.Provider value={{ size: "30px" }}>
    {task.done ? (
      <button onClick={() => void setTaskCompleted(taskId, false)}>
        <BsCheckCircleFill className="flex-none self-center" />
      </button>
    ) : (
      <button onClick={() => void setTaskCompleted(taskId, true)}>
        <BsCheckCircle className="flex-none self-center" />
      </button>
    )}
    {task.starred ? (
      <button onClick={() => void setStarred(taskId, false)}>
        <BsStarFill className="flex-none self-center" />
      </button>
    ) : (
      <button onClick={() => void setStarred(taskId, true)}>
        <BsStar className="flex-none self-center" />
      </button>
    )}
    <button onClick={() => void deleteTask(taskId)}>
      <BsFillTrashFill className="flex-none self-center" />
    </button>
  </IconContext.Provider>
  )}


  if (!task.description) {
    return (
      <div className="flex flex-row justify-between gap-2 bg-white rounded-md px-4 py-2">
        <p className="max-w-[85%] flex-1 break-words text-lg">{task.title}</p>
        <div className="flex flex-row gap-3">
          {icons()}
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
            {icons()}
          </div>
        </div>
      </div>
    </div>
  );
}
