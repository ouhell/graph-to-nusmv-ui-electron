import { Input, Modal } from 'antd';
import React from 'react';
import { UIState } from 'renderer/types/state';
import { generateNusmv } from 'renderer/utils/generateNumv';
import generateOS from 'renderer/utils/generateOS';

type Props = { isOpen: boolean; onClose: () => void; states: UIState[] };

function NusmvDispalyer({ isOpen, onClose, states }: Props) {
  const [nusmvCode, setnusmvCode] = React.useState('');

  React.useEffect(() => {
    const compile = () => {
      try {
        const generatedOs = generateOS(states);
        console.log('generated os', generatedOs);
        const generatedNusmv = generateNusmv(generatedOs.trim());
        setnusmvCode(generatedNusmv);
      } catch (e: any) {
        setnusmvCode(e?.message ?? 'Error');
      }
    };

    compile();
  }, [states]);

  return (
    <Modal title="OS" open={isOpen} onOk={onClose} onCancel={onClose}>
      <Input.TextArea value={nusmvCode} rows={12} />
    </Modal>
  );
}

export default NusmvDispalyer;
