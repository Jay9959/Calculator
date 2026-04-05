import React, { useState, useEffect, useCallback } from 'react';
import './Calculator.css'

function Calculator() {
    const [value, setValue] = useState('');
    const [justCalculated, setJustCalculated] = useState(false);
    const [lastOperation, setLastOperation] = useState(null);
    const [error, setError] = useState(null);

    const showError = (msg) => {
        setError(msg);
        setTimeout(() => setError(null), 2000);
    };

    const calculate = (expression) => {
        try {
            return eval(expression).toString();
        } catch {
            return null;
        }
    };

    const extractLastOperation = (expr) => {
        // Match pattern like "2+2", "5*3", "10-4", "8/2"
        const match = expr.match(/(\d+\.?\d*)([+\-*/])(\d+\.?\d*)$/);
        if (match) {
            return { operand: match[3], operator: match[2] };
        }
        return null;
    };

    const MAX_DIGITS = 15;

    const handleKeyPress = useCallback((e) => {
        const key = e.key;
        const operators = ['+', '-', '*', '/'];

        // Ignore function keys F1-F12
        if (key.startsWith('F') && /^F\d+$/.test(key)) {
            return;
        }

        if (/[0-9.]/.test(key)) {
            setValue(prev => {
                const newValue = justCalculated ? key : prev + key;
                if (newValue.length > MAX_DIGITS) {
                    showError('Max 15 characters allowed');
                    return prev;
                }
                return newValue;
            });
            setJustCalculated(false);
        } else if (operators.includes(key)) {
            setValue(prev => {
                const lastChar = prev.slice(-1);
                if (operators.includes(lastChar)) {
                    return prev.slice(0, -1) + key;
                }
                return prev + key;
            });
            setJustCalculated(false);
        } else if (key === 'Enter' || key === '=') {
            e.preventDefault();
            if (justCalculated && lastOperation) {
                setValue(prev => {
                    const newExpr = prev + lastOperation.operator + lastOperation.operand;
                    const result = calculate(newExpr);
                    if (result === null) {
                        showError('Invalid calculation');
                        return prev;
                    }
                    return result;
                });
            } else {
                setValue(prev => {
                    const result = calculate(prev);
                    if (result === null) {
                        showError('Invalid calculation');
                        return prev;
                    }
                    const lastOp = extractLastOperation(prev);
                    if (lastOp) setLastOperation(lastOp);
                    return result;
                });
                setJustCalculated(true);
            }
        } else if (key === 'Backspace' || key === 'Delete') {
            setValue(prev => prev.slice(0, -1));
            setJustCalculated(false);
        } else if (key === 'Escape') {
            setValue('');
            setJustCalculated(false);
            setLastOperation(null);
        }
    }, [justCalculated, lastOperation]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    const handleClick = (val) => {
        const operators = ['+', '-', '*', '/'];

        if (val === '=') {
            if (justCalculated && lastOperation) {
                const newExpr = value + lastOperation.operator + lastOperation.operand;
                const result = calculate(newExpr);
                if (result === null) {
                    showError('Invalid calculation');
                    return;
                }
                setValue(result);
            } else {
                const result = calculate(value);
                if (result === null) {
                    showError('Invalid calculation');
                    return;
                }
                const lastOp = extractLastOperation(value);
                if (lastOp) setLastOperation(lastOp);
                setValue(result);
                setJustCalculated(true);
            }
        } else if (val === 'AC') {
            setValue('');
            setJustCalculated(false);
            setLastOperation(null);
        } else if (val === 'DE') {
            setValue(value.slice(0, -1));
            setJustCalculated(false);
        } else if (operators.includes(val)) {
            const lastChar = value.slice(-1);
            if (operators.includes(lastChar)) {
                setValue(value.slice(0, -1) + val);
            } else {
                setValue(value + val);
            }
            setJustCalculated(false);
        } else {
            // Number input
            if (justCalculated) {
                setValue(val);
                setJustCalculated(false);
            } else {
                const newValue = value + val;
                if (newValue.length > MAX_DIGITS) {
                    showError('Max 15 characters allowed');
                    return;
                }
                setValue(newValue);
            }
        }
    };

    return (
        <div className="container">
            {error && <div className="error-popup">{error}</div>}
            <div className="calculator">
                <form action="" onSubmit={(e) => e.preventDefault()}>
                    <div className='display'>
                        <input type="text" value={value} placeholder='0' readOnly />
                    </div>
                    <div className="buttons">
                        <input type="button" value="AC" onClick={() => handleClick('AC')} className="operator" />
                        <input type="button" value="DE" onClick={() => handleClick('DE')} className="operator" />
                        <input type="button" value="." onClick={() => handleClick('.')} />
                        <input type="button" value="/" onClick={() => handleClick('/')} className="operator" />

                        <input type="button" value="7" onClick={() => handleClick('7')} />
                        <input type="button" value="8" onClick={() => handleClick('8')} />
                        <input type="button" value="9" onClick={() => handleClick('9')} />
                        <input type="button" value="*" onClick={() => handleClick('*')} className="operator" />

                        <input type="button" value="4" onClick={() => handleClick('4')} />
                        <input type="button" value="5" onClick={() => handleClick('5')} />
                        <input type="button" value="6" onClick={() => handleClick('6')} />
                        <input type="button" value="+" onClick={() => handleClick('+')} className="operator" />

                        <input type="button" value="1" onClick={() => handleClick('1')} />
                        <input type="button" value="2" onClick={() => handleClick('2')} />
                        <input type="button" value="3" onClick={() => handleClick('3')} />
                        <input type="button" value="-" onClick={() => handleClick('-')} className="operator" />

                        <input type="button" value="00" onClick={() => handleClick('00')} />
                        <input type="button" value="0" onClick={() => handleClick('0')} />
                        <input type="button" value="=" className='equal' onClick={() => handleClick('=')} />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Calculator;
