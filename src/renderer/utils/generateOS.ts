import { UIState } from 'renderer/types/state';

type StateDeclaration = {
  name: string;
  tokens: string;
};

export default function generateOS(states: UIState[]) {
  const declaredStates: StateDeclaration[] = [];

  let generatedCode = '';

  states.forEach((state) => {
    state.distinations.forEach((destination) => {
      let selfEnd = '';
      let destinationEnd = '';
      const selfDeclartion = declaredStates.find(
        (declaredstate) => declaredstate.name === state.name
      );

      const destinationDeclartion = declaredStates.find(
        (declaredstate) => declaredstate.name === destination
      );

      if (!selfDeclartion) {
        const declaredTokens = `(${state.tokens.join(',')})`;
        declaredStates.push({
          name: state.name,
          tokens: declaredTokens,
        });
        selfEnd = `${state.name}${declaredTokens}`;
      } else {
        selfEnd = state.name;
      }

      if (!destinationDeclartion) {
        const destinationState = states.find(
          (ostate) => ostate.name === destination
        );
        if (!destinationState)
          throw new Error(`invalid destination :${destination}`);

        const declaredTokens = `(${destinationState.tokens.join(',')})`;
        declaredStates.push({
          name: destinationState.name,
          tokens: declaredTokens,
        });
        destinationEnd = `${destination}${declaredTokens}`;
      } else {
        destinationEnd = destination;
      }

      generatedCode += `${selfEnd} -> ${destinationEnd};\n`;
    });
  });

  return generatedCode;
}
