import { Operator } from "../types";

export function getOperatorFn(operation: string, operators: Operator[], errFn?:(operation:string)=>Error): Operator {
    let operator = operators.find((o) => {
        return o.test(operation);
    });

    if (operator) return operator;

    throw errFn ? errFn(operation) : new Error(`operator "${operation}" not supported`);
}
