import { Flex, Input, Select, Text, Textarea } from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdNumbers, MdOutlineDescription, MdOutlineVideoLabel, MdPriorityHigh } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { OnEditTask } from "@/lib/react-query/query-actions";
import { KanbanDataContextHook } from "@/context/KanbanDataContextProvider";
import { queryKeys } from "@/lib/react-query/query-keys";
import { PriorityType, StoryPointType, TaskItem } from "@/types";
import { toast } from "react-toastify";
import { Button } from "@/components/common/Button";

// TODO: Update task dueDate everytime update
// TODO: Update last time edit text render

function TaskTitle({ dataInput }: { dataInput: TaskItem }) {
  const { kanbanDataStore } = KanbanDataContextHook();
  const [editTitle, setEditTitle] = useState(false);
  const { register, handleSubmit, watch, reset } = useForm<{
    taskTitle: string;
  }>();

  const onUserEdit = OnEditTask();

  const onSubmit: SubmitHandler<{
    taskTitle: string;
  }> = async (data) => {
    if (data.taskTitle === "") {
      toast.error("A task can missing a name!");
      return;
    }

    if (kanbanDataStore) {
      const tableItemIndex = kanbanDataStore[dataInput.taskStatus].table
        .map((item) => item.taskId)
        .indexOf(dataInput.taskId);

      let itemTable = kanbanDataStore[dataInput.taskStatus].table;
      if (tableItemIndex >= 0) {
        // condition >= 0 because the logic read 0 is false
        itemTable[tableItemIndex] = {
          ...itemTable[tableItemIndex],
          title: data.taskTitle,
        };
      }

      const rees = await onUserEdit.mutateAsync({
        ...dataInput,
        title: data.taskTitle,
      });

      if (!rees) {
        toast.error("Project have been removed");
      }
      setEditTitle(false);
    }
    reset();
  };

  if (!editTitle) {
    return (
      <Text
        gap={2}
        fontSize="lg"
        display="flex"
        fontWeight="bold"
        alignItems="center"
        onDoubleClick={() => setEditTitle(true)}
      >
        <MdOutlineVideoLabel className="w-6 h-6" /> {dataInput.title}
      </Text>
    );
  } else {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="min-h-[27px] flex items-center gap-2 pr-8">
        <MdOutlineVideoLabel className="w-6 h-6" />
        <Input
          type="text"
          defaultValue={dataInput?.title}
          placeholder="Can't miss the task name"
          className="text-sm font-bold dark:bg-gray-600"
          size="md"
          {...register("taskTitle")}
        />
      </form>
    );
  }
}

function TaskDescription({ dataInput }: { dataInput: TaskItem }) {
  const { kanbanDataStore } = KanbanDataContextHook();
  const { register, handleSubmit, watch, reset } = useForm<{
    taskDescription: string;
  }>();
  const [openEdit, setOpenEdit] = useState(false);
  const descriptionIsEmpty = dataInput?.description?.length === 0;

  const onUserEdit = OnEditTask();

  const onSubmit: SubmitHandler<{
    taskDescription: string;
  }> = async (data) => {
    if (kanbanDataStore) {
      const tableItemIndex = kanbanDataStore[dataInput.taskStatus].table
        .map((item) => item.taskId)
        .indexOf(dataInput.taskId);

      let itemTable = kanbanDataStore[dataInput.taskStatus].table;
      if (tableItemIndex >= 0) {
        // condition >= 0 because the logic read 0 is false
        itemTable[tableItemIndex] = {
          ...itemTable[tableItemIndex],
          description: data.taskDescription,
        };
      }

      const rees = await onUserEdit.mutateAsync({
        ...dataInput,
        description: data.taskDescription,
      });
      if (!rees) {
        toast.error("Project have been removed");
      }

      setOpenEdit(false);
    }
    reset();
  };

  return (
    <Flex flexDirection="column" gap={2}>
      <Flex gap={4} justifyContent="space-between" alignItems="center">
        <Flex gap={2}>
          <MdOutlineDescription className="w-6 h-6" />
          <Text fontWeight={600}>Description</Text>
        </Flex>
        {!openEdit && !descriptionIsEmpty && (
          <Button variant="outline" size="sm" onClick={() => setOpenEdit(true)}>
            Edit
          </Button>
        )}
      </Flex>

      {!openEdit && !descriptionIsEmpty && <Text className="pl-8">{dataInput?.description}</Text>}
      {(openEdit || descriptionIsEmpty) && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex flexDirection="column" gap={2}>
            <Textarea
              defaultValue={dataInput?.description}
              className="dark:bg-gray-600"
              {...register("taskDescription")}
            />
            <Flex gap={2}>
              {!descriptionIsEmpty && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenEdit(false);
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button size="sm" type="submit">
                Save
              </Button>
            </Flex>
          </Flex>
        </form>
      )}
    </Flex>
  );
}

const listStoryPointAccepted = [1, 2, 3, 5, 8, 13, 21];

function TaskStoryPoint({ dataInput }: { dataInput: TaskItem }) {
  const { kanbanDataStore } = KanbanDataContextHook();
  const [currentPoint, setCurrentPoint] = useState(String(dataInput.storyPoint));

  const onUserEdit = OnEditTask();

  const onSelectStoryPoint = async (point: StoryPointType) => {
    if (!listStoryPointAccepted.includes(point)) {
      toast.error("The Story Point is not valid");
      return;
    }

    if (!kanbanDataStore) {
      toast.error("Something wrong at the board! Please restart and do again!");
      return;
    }

    const tableItemIndex = kanbanDataStore[dataInput.taskStatus].table
      .map((item) => item.taskId)
      .indexOf(dataInput.taskId);

    let itemTable = kanbanDataStore[dataInput.taskStatus].table;
    if (tableItemIndex >= 0) {
      // condition >= 0 because the logic read 0 is false
      itemTable[tableItemIndex] = {
        ...itemTable[tableItemIndex],
        storyPoint: point,
      };
    }

    const rees = await onUserEdit.mutateAsync({
      ...dataInput,
      storyPoint: point,
    });

    if (!rees) {
      toast.error("Project have been removed");
    }
  };

  return (
    <Flex gap={4} justifyContent="space-between" alignItems="center">
      <Flex gap={2} className="flex-shrink-0">
        <MdNumbers className="w-6 h-6" />
        <Text fontWeight={600} marginRight={6}>
          Cost <strong className="font-bold">{dataInput.storyPoint}</strong> Story Point
        </Text>
      </Flex>

      <Flex flexDirection="column" gap={2}>
        <Select
          placeholder={currentPoint}
          className="dark:bg-gray-600"
          onChange={async (e) => {
            await onSelectStoryPoint(Number(e.target?.value) as StoryPointType);
            setCurrentPoint(String(e.target?.value));
          }}
        >
          {listStoryPointAccepted.map((point) => {
            return (
              <option value={point} key={point}>
                {point}
              </option>
            );
          })}
        </Select>
      </Flex>
    </Flex>
  );
}

function TaskPriority({ dataInput }: { dataInput: TaskItem }) {
  const { kanbanDataStore } = KanbanDataContextHook();
  const onUserEdit = OnEditTask();

  const onSelectPriority = async (priority: PriorityType) => {
    if (!kanbanDataStore) {
      toast.error("Something wrong at the board! Please restart and do again!");
      return;
    }

    const tableItemIndex = kanbanDataStore[dataInput.taskStatus].table
      .map((item) => item.taskId)
      .indexOf(dataInput.taskId);

    let itemTable = kanbanDataStore[dataInput.taskStatus].table;
    if (tableItemIndex >= 0) {
      // condition >= 0 because the logic read 0 is false
      itemTable[tableItemIndex] = {
        ...itemTable[tableItemIndex],
        priority,
      };
    }

    const rees = await onUserEdit.mutateAsync({
      ...dataInput,
      priority,
    });

    if (!rees) {
      toast.error("Project have been removed");
    }
  };

  return (
    <Flex gap={4} justifyContent="space-between" alignItems="center">
      <Flex gap={2} className="flex-shrink-0">
        <MdPriorityHigh className="w-6 h-6" />
        <Text fontWeight={600} marginRight={6}>
          Current priority is <strong className="font-bold">{dataInput.priority}</strong>{" "}
        </Text>
      </Flex>
      <Select
        onChange={(e) => onSelectPriority(e.target?.value as PriorityType)}
        className="dark:bg-gray-600"
        defaultValue={dataInput.priority}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </Select>
    </Flex>
  );
}

export { TaskDescription, TaskStoryPoint, TaskTitle, TaskPriority };
