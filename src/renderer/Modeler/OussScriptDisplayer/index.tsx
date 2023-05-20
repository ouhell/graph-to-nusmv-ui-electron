import { Input, Modal } from 'antd';
import React from 'react';
import { UIState } from 'renderer/types/state';
import generateOS from 'renderer/utils/generateOS';

type Props = { isOpen: boolean; onClose: () => void; states: UIState[] };

function OSDispalyer({ isOpen, onClose, states }: Props) {
  const [osCode, setOsCode] = React.useState('');

  React.useEffect(() => {
    try {
      const generatedOs = generateOS(states);
      setOsCode(generatedOs);
    } catch (e) {
      setOsCode('Error');
    }
  }, [states]);

  return (
    <Modal title="OS" open={isOpen} onOk={onClose} onCancel={onClose}>
      <Input.TextArea value={osCode} rows={12} />
    </Modal>
  );
}

export default OSDispalyer;
