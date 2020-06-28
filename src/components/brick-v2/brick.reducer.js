import { actions } from "./brick.constants";
import { reducerWithLogger } from "./../../utils/reducerWithLogger";
import { getActiveBrick } from "./brick.utils";
import { BOARD_SIZE } from "../../utils/constants";

const getValueAfterCheckingBoundary = (rowOrCol, direction) => {
  if (direction === "left" && rowOrCol > 0) {
    return rowOrCol - 1;
  }
  if (direction === "right" && rowOrCol < BOARD_SIZE.col - 1) {
    return rowOrCol + 1;
  }
  return rowOrCol;
};

const moveBrick = (prevGrid, direction) => {
  const updatedGrid = [...prevGrid];

  const activeBrick = getActiveBrick(updatedGrid);
  const { row: oldRow, col: oldCol } = activeBrick;

  let newRow = oldRow;
  let newCol = oldCol;

  switch (direction) {
    case "left":
      newCol = getValueAfterCheckingBoundary(newCol, direction);
      break;
    case "right":
      newCol = getValueAfterCheckingBoundary(newCol, direction);
      break;
    case "down":
      newRow += 1;
      break;
    default:
      break;
  }

  updatedGrid[oldRow][oldCol] = null;
  updatedGrid[newRow][newCol] = activeBrick;

  if (direction === "down") {
    activeBrick.row = newRow;
  } else {
    activeBrick.col = newCol;
  }

  return updatedGrid;
};

const onMoveLeft = (prevGrid, data) => {
  return moveBrick(prevGrid, "left");
};

const onMoveDown = (prevGrid, data) => {
  return moveBrick(prevGrid, "down");
};

const onMoveRight = (prevGrid, data) => {
  return moveBrick(prevGrid, "right");
};

const onMoveStraightDown = (prevGrid, data) => {
  return [...prevGrid];
};

const onAddBrick = (prevGrid, brickData) => {
  return [...prevGrid].map((brickRows, rowIndex) => {
    return [...brickRows].map((brick, colIndex) => {
      if (brickData.row === rowIndex && brickData.col === colIndex) {
        return {
          ...brickData,
          isActive: true,
        };
      }
      if (!brick) {
        return brick;
      }
      return {
        ...brick,
        isActive: false,
      };
    });
  });
};

export const reducer = reducerWithLogger((prevGrid, action) => {
  const actionToFuncMapping = {
    [actions.ADD_BRICK]: onAddBrick,
    [actions.MOVE_LEFT]: onMoveLeft,
    [actions.MOVE_DOWN]: onMoveDown,
    [actions.MOVE_RIGHT]: onMoveRight,
    [actions.MOVE_STRAIGHT_DOWN]: onMoveStraightDown,
  };

  const func = actionToFuncMapping[action.type];

  if (!func) {
    throw new Error("Action not supported");
  }

  return func(prevGrid, action.data);
});
