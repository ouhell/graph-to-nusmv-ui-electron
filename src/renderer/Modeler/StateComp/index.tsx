/* eslint-disable react/destructuring-assignment */
import { motion } from 'framer-motion';
import React from 'react';
import { UIState } from 'renderer/types/state';
import classNames from 'classnames';
import c from './StateComp.module.scss';

type Props = {
  state: UIState;
  setStates: React.Dispatch<React.SetStateAction<UIState[]>>;
  isLinking: boolean;
  isDeleting: boolean;
  linkStates: (name: string) => void;
  deleteState: (name: string) => void;
  openSlider: () => void;
  selectedState: string;
  setSelectedState: React.Dispatch<React.SetStateAction<string>>;
};

function StateComp({
  state,
  isLinking,
  isDeleting,
  linkStates,
  deleteState,
  openSlider,
  setStates,
  setSelectedState,
  selectedState,
}: Props) {
  return (
    <motion.div
      key={state.name}
      // onDrag={(e: MouseEvent) => {
      //   setStates((oldStates) => {
      //     const newStates = [...oldStates];

      //     const selfIndex = newStates.findIndex(
      //       (ostate) => state.name === ostate.name
      //     );
      //     console.log('selfindex: ', selfIndex);

      //     if (selfIndex === -1) return oldStates;
      //     const self = newStates[selfIndex];

      //     const newState: UIState = { ...self, x: e.pageX, y: e.pageY };

      //     newStates[selfIndex] = newState;

      //     return newStates;
      //   });
      // }}
      onDragEnd={(e: MouseEvent) => {
        setStates((oldStates) => {
          const newStates = [...oldStates];

          const selfIndex = newStates.findIndex(
            (ostate) => state.name === ostate.name
          );
          console.log('selfindex: ', selfIndex);

          if (selfIndex === -1) return oldStates;
          const self = newStates[selfIndex];
          // TODO : fix drag
          const newState: UIState = { ...self, x: e.pageX, y: e.pageY };

          newStates[selfIndex] = newState;

          return newStates;
        });
      }}
      onClick={() => {
        if (isLinking) {
          if (selectedState) {
            if (selectedState === state.name) setSelectedState('');
            else linkStates(state.name);
          } else setSelectedState(state.name);
        }

        if (isDeleting) {
          deleteState(state.name);
        }
      }}
      onDoubleClick={() => {
        if (selectedState === state.name) setSelectedState('');
        else {
          openSlider();
          setSelectedState(state.name);
        }
      }}
      animate={{
        x: state.x,
        y: state.y,
        translateX: '-50%',
        translateY: '-50%',
        transition: {
          duration: 0,
        },
      }}
      //  onMouseDown={startDrag}
      className={classNames({
        [c.State]: true,
        [c.selected]: selectedState === state.name,
      })}
      draggable
      drag
      dragMomentum={false}
    >
      <span>{state.name}</span>
      {`{${state.tokens.join(', ')}}`}
    </motion.div>
  );
}

export default StateComp;
