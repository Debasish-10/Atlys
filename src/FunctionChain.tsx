import { useState, useEffect } from 'react';
import './FunctionChain.css';

interface FunctionNode {
  id: number;
  equation: string;
  nextFunction: number | null;
  position:
    | 'top-left'
    | 'top-middle'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right';
}

const INITIAL_FUNCTIONS: FunctionNode[] = [
  { id: 1, equation: 'x^2', nextFunction: 2, position: 'top-left' },
  { id: 2, equation: '2x+4', nextFunction: 4, position: 'top-middle' },
  { id: 3, equation: 'x^2+20', nextFunction: null, position: 'top-right' },
  { id: 4, equation: 'x-2', nextFunction: 5, position: 'bottom-left' },
  { id: 5, equation: 'x/2', nextFunction: 3, position: 'bottom-right' },
];

const FunctionChain = () => {
  const [initialValue, setInitialValue] = useState<number>(2);
  const [finalOutput, setFinalOutput] = useState<number>(0);
  const [functions, setFunctions] = useState<FunctionNode[]>(INITIAL_FUNCTIONS);

  const evaluateEquation = (equation: string, x: number): number => {
    try {
      const formattedEquation = equation
        .replace(/(\d)(x)/g, '$1*$2')
        .replace(/\^/g, '**')
        .replace(/x/g, x.toString());
      return Function(`'use strict'; return (${formattedEquation})`)();
    } catch (error) {
      console.error('Error evaluating equation:', equation, error);
      throw new Error(`Invalid equation: ${equation}`);
    }
  };

  const calculateOutput = () => {
    try {
      let currentValue = initialValue;
      const executionOrder = [1, 2, 4, 5, 3];

      for (const functionId of executionOrder) {
        const func = functions.find((f) => f.id === functionId);
        if (func) {
          currentValue = evaluateEquation(func.equation, currentValue);
        } else {
          throw new Error(`Function ID ${functionId} not found`);
        }
      }

      setFinalOutput(currentValue);
    } catch (error) {
      console.error('Error calculating output:', error);
      setFinalOutput(0);
    }
  };

  useEffect(() => {
    calculateOutput();
  }, [initialValue, functions]);

  const handleEquationChange = (id: number, newEquation: string) => {
    if (!/^[x0-9+\-*/^()\s]+$/.test(newEquation)) return;
    setFunctions(
      functions.map((f) => (f.id === id ? { ...f, equation: newEquation } : f))
    );
  };

  const getCardClassName = (position: string) => {
    return `function-card ${position}`;
  };

  return (
    <div className='function-chain'>
      <span className='input-label'>Initial value of x</span>
      <div className='input-box'>
        <input
          type='number'
          value={initialValue}
          onChange={(e) => setInitialValue(Number(e.target.value))}
          className='input-value'
        />
        <div className='input-value-junction'></div>
      </div>
      <span className='output-label'>Final Output y</span>
      <div className='output-box'>
        <div className='output-value-junction'></div>
        <div className='output-value'>{finalOutput}</div>
      </div>

      {functions.map((func) => (
        <div key={func.id} className={getCardClassName(func.position)}>
          <div className='card-header'>Function: {func.id}</div>

          <div className='input-container'>
            <label>Equation</label>
            <input
              type='text'
              value={func.equation}
              onChange={(e) => handleEquationChange(func.id, e.target.value)}
              className='equation-input'
            />
          </div>

          <div className='input-container'>
            <label>Next function</label>
            <select
              disabled
              value={func.nextFunction || ''}
              className='select-input'
            >
              <option value={func.nextFunction || ''}>
                {func.nextFunction ? `Function: ${func.nextFunction}` : '-'}
              </option>
            </select>
          </div>

          <div className='input-junction'>
            <span className='junction-label'>input</span>
          </div>

          <div className='output-junction'>
            <span className='junction-label'>output</span>
          </div>
        </div>
      ))}

      <svg className='connections-svg'>
        <path d='M 170 390 H 247' className='connection-path'></path>
        <path d='M 455 390 H 602' className='connection-path'></path>
        <path
          d='M 815 390 C 735 280, 735 460, 420 760'
          className='connection-path'
        ></path>
        <path
          d='M 626 760 C 626 820, 786 820, 786 760'
          className='connection-path'
        ></path>

        <path
          d='M 955 390 C 935 460, 935 280, 1000 760'
          className='connection-path'
        ></path>
        <path d='M 1172 390 H 1255' className='connection-path'></path>
        <path d='M 855 990 H 702' className='connection-path'></path>
      </svg>
    </div>
  );
};

export default FunctionChain;
