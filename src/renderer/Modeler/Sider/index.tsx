/* eslint-disable react/no-array-index-key */
import { Button, Col, Drawer, Form, InputNumber, Row } from 'antd';
import React from 'react';
import { UIState } from 'renderer/types/state';
import OSDispalyer from '../OussScriptDisplayer';
import NusmvDispalyer from '../NusmvDisplayer';

// const { Option } = Select;

export type SliderProps = {
  open: boolean;
  onClose: () => void;

  tokenCount: number;
  setTokenCount: (val: number) => void;
  selectedState: string;
  states: UIState[];
  setStates: React.Dispatch<React.SetStateAction<UIState[]>>;
};

function Sider({
  open,
  onClose,

  tokenCount,
  setTokenCount,
  selectedState,
  states,
  setStates,
}: SliderProps) {
  const [showOS, setShowOS] = React.useState(false);
  const [showNusmv, setShowNusmv] = React.useState(false);
  const selectedStateData = states.find((s) => s.name === selectedState);
  const StateIsSelected = !!selectedState;
  const tokenValues = selectedStateData?.tokens.reduce((prev, curr, i) => {
    return { ...prev, [`p${i}`]: curr };
  }, {});

  return (
    <Drawer
      title="Modifier"
      onClose={onClose}
      // width={Math.min(windowWidth ?? Infinity, 500)}
      open={open}
      mask={false}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <OSDispalyer
        isOpen={showOS}
        onClose={() => {
          setShowOS(false);
        }}
        states={states}
      />
      <NusmvDispalyer
        isOpen={showNusmv}
        onClose={() => {
          setShowNusmv(false);
        }}
        states={states}
      />
      <Row gutter={16}>
        <Col span={12}>
          <Button
            onClick={() => {
              setShowOS(true);
            }}
          >
            show OussScript
          </Button>
        </Col>
        <Col span={12}>
          <Button
            onClick={() => {
              setShowNusmv(true);
            }}
          >
            generate NUSMV
          </Button>
        </Col>
      </Row>
      <Form
        initialValues={{
          count: tokenCount,
        }}
        layout="vertical"
        requiredMark="optional"
        onValuesChange={(changedValues) => {
          if (changedValues.count) setTokenCount(changedValues.count);
        }}
      >
        <Form.Item
          name="count"
          label="Count"
          rules={[{ required: true, message: 'Please select count ' }]}
        >
          <InputNumber
            min={1}
            max={6}
            style={{
              width: '100%',
            }}
          />
        </Form.Item>
      </Form>

      {StateIsSelected && (
        <Form
          key={selectedState}
          initialValues={{
            ...tokenValues,
          }}
          layout="vertical"
          requiredMark="optional"
          onValuesChange={(changedValues, values) => {
            const newTokens = Object.keys(values)
              .sort()
              .map((key) => values[key] ?? 0);

            setStates((oldStates) => {
              const newStates = [...oldStates];

              const selfIndex = newStates.findIndex(
                (state) => state.name === selectedState
              );

              if (selfIndex === -1) return oldStates;
              const self = newStates[selfIndex];

              const newState: UIState = { ...self, tokens: newTokens };

              newStates[selfIndex] = newState;

              return newStates;
            });
          }}
        >
          {selectedStateData?.tokens.map((token, i) => {
            return (
              <Form.Item
                key={`p${i}`}
                name={`p${i}`}
                label={`P${i}`}
                rules={[{ required: true, message: 'Please select count ' }]}
              >
                <InputNumber
                  min={0}
                  max={9}
                  defaultValue={0}
                  style={{
                    width: '100%',
                  }}
                />
              </Form.Item>
            );
          })}
        </Form>
      )}
    </Drawer>
  );
}

export default Sider;
