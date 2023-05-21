/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from 'antd';
import { UIState } from 'renderer/types/state';

import { MenuFoldOutlined } from '@ant-design/icons';
import c from './Modeler.module.scss';
import Sider from './Sider';
import StateComp from './StateComp';
/* type Props = {}; */

type Point = {
  x: number;
  y: number;
};

function calculateMidPoint(p1: Point, p2: Point) {
  const midX = (p1.x + p2.x) / 2;
  const midY = (p1.y + p2.y) / 2;

  return { x: midX, y: midY };
}

function calculateDegree(p1: Point, p2: Point) {
  const deltaX = p2.x - p1.x;
  const deltaY = p2.y - p1.y;
  const radian = Math.atan2(deltaY, deltaX);
  const degree = radian * (180 / Math.PI);

  return degree;
}

function calculateDistance(p1: Point, p2: Point) {
  const deltaX = p2.x - p1.x;
  const deltaY = p2.y - p1.y;
  const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

  return distance;
}

type MouseState = 'adding' | 'linking' | 'deleting' | 'normal';

const initialAvailableStates = [
  's0',
  's1',
  's2',
  's3',
  's4',
  's5',
  's6',
  's7',
  's8',
  's9',
];
function Modeler(/* props: Props */) {
  const [states, setStates] = React.useState<UIState[]>([]);
  const [tokenNumber, setTokenNumber] = React.useState(3);
  const [availableStates, setAvailableStates] = React.useState<string[]>(
    initialAvailableStates
  );
  const [mouseAction, setMouseAction] = React.useState<MouseState>('normal');
  const [open, setOpen] = React.useState<boolean>(false);
  const [selectedState, setSelectedState] = React.useState('');

  React.useEffect(() => {
    setStates((oldStates) => {
      const newStates = oldStates.map((state) => {
        const newState = { ...state };
        if (state.tokens.length > tokenNumber) {
          newState.tokens = newState.tokens.slice(0, tokenNumber);
        } else if (state.tokens.length < tokenNumber) {
          const array = new Array(tokenNumber - newState.tokens.length).fill(0);
          newState.tokens = [...newState.tokens, ...array];
        }
        return newState;
      });

      return newStates;
    });
  }, [tokenNumber]);

  const addState = (x: number, y: number) => {
    if (availableStates.length)
      setStates((oldStates) => {
        const newAvailableStates = [...availableStates];
        const newStates = [...oldStates];

        const newState: UIState = {
          name: newAvailableStates[0],

          tokens: new Array(tokenNumber).fill(0),
          distinations: [],
          x,
          y,
        };
        newStates.push(newState);

        setAvailableStates(
          newAvailableStates.filter((name) => name !== newState.name)
        );

        return newStates;
      });

    // setMouseAction('normal');
  };

  const deleteState = (deletedName: string) => {
    if (availableStates.length)
      setStates((oldStates) => {
        const oldStateIndex = oldStates.findIndex(
          (state) => state.name === deletedName
        );

        if (oldStateIndex === -1) return oldStates;

        const newStates = oldStates
          .filter((state) => state.name !== deletedName)
          .map((state) => {
            const newState = { ...state };
            newState.distinations = newState.distinations.filter(
              (des) => des !== deletedName
            );
            return newState;
          });
        setAvailableStates((prevAvailableStates) => {
          const newAvailableStates = [
            ...prevAvailableStates,
            deletedName,
          ].sort();

          return newAvailableStates;
        });
        return newStates;
      });

    // setMouseAction('normal');
  };

  const linkStates = (stateName: string) => {
    setStates((oldStates) => {
      const newStates = [...oldStates];

      const otherStateIndex = newStates.findIndex(
        (state) => state.name === selectedState
      );

      if (otherStateIndex === -1) return oldStates;
      const otherState = newStates[otherStateIndex];
      const newState: UIState = { ...otherState };
      let newDestinations = newState.distinations;

      if (newDestinations.find((des) => des === stateName)) {
        newDestinations = newDestinations.filter((des) => des !== stateName);
      } else {
        newDestinations.push(stateName);
      }

      newState.distinations = newDestinations;
      newStates[otherStateIndex] = newState;

      return newStates;
    });
    setSelectedState('');
    setMouseAction('normal');
  };

  const openSlider = () => {
    setOpen(true);
  };
  const isAdding = mouseAction === 'adding';
  const isLinking = mouseAction === 'linking';
  const isDeleting = mouseAction === 'deleting';
  return (
    <div className={c.Modeler}>
      <Button
        className={c.OpenBtn}
        onClick={() => {
          setOpen(true);
        }}
        icon={<MenuFoldOutlined />}
      />

      <div className={c.ActionBar}>
        <Button
          onClick={() => {
            setMouseAction('adding');
          }}
        >
          Add State
        </Button>
        <Button
          onClick={() => {
            setMouseAction('linking');
          }}
        >
          Add Realtion
        </Button>

        <Button
          type="text"
          danger
          onClick={() => {
            setMouseAction('deleting');
          }}
        >
          Delete
        </Button>
      </div>

      <Sider
        setStates={setStates}
        states={states}
        selectedState={selectedState}
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        tokenCount={tokenNumber}
        setTokenCount={(val) => {
          setTokenNumber(val);
        }}
      />
      <div
        className={c.ItemHolder}
        style={{
          cursor: isAdding
            ? 'crosshair'
            : isLinking
            ? 'move'
            : isDeleting
            ? 'not-allowed'
            : 'default',
        }}
        onClick={(e) => {
          if (isAdding) addState(e.clientX, e.clientY);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setMouseAction('normal');
        }}
      >
        {states.map((state) => {
          return (
            <StateComp
              openSlider={openSlider}
              linkStates={linkStates}
              setSelectedState={setSelectedState}
              selectedState={selectedState}
              setStates={setStates}
              key={state.name}
              state={state}
              isLinking={isLinking}
              deleteState={deleteState}
              isDeleting={isDeleting}
            />
          );
        })}
        {states.map((state) => {
          return (
            <div key={state.name}>
              {state.distinations.map((des) => {
                const desState = states.find((ostate) => ostate.name === des);
                if (!desState) return null;
                const isDoubleTrouble = !!desState.distinations.includes(
                  state.name
                );
                const isSuperior = desState.name < state.name;
                const degree = calculateDegree(state, desState);
                const midPoint = calculateMidPoint(desState, state);
                const distance = calculateDistance(desState, state) - 60 * 2;

                const xModifier =
                  10 * (1 - Math.abs(Math.abs(degree) - 90) / 90);
                const yModifier = 10 * (Math.abs(Math.abs(degree) - 90) / 90);
                return (
                  <motion.div
                    key={state.name + des}
                    className={c.Link}
                    style={{
                      width: distance + 5,
                      outline: '1px solid black',
                    }}
                    animate={{
                      x:
                        midPoint.x -
                        (isDoubleTrouble
                          ? isSuperior
                            ? xModifier
                            : -xModifier
                          : 0),
                      y:
                        midPoint.y +
                        (isDoubleTrouble
                          ? isSuperior
                            ? yModifier
                            : -yModifier
                          : 0),
                      rotate: degree,
                      translateX: '-50%',
                      translateY: '-50%',

                      transition: {
                        duration: 0,
                      },
                    }}
                  >
                    <div className={c.ArrowHead} />
                  </motion.div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Modeler;
