import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Operation = "+" | "-" | "×" | "÷" | null;

export default function App() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<Operation>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: Operation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const result = calculate(previousValue, inputValue, operation);
      setPreviousValue(result);
      setDisplay(String(result));
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (a: number, b: number, op: Operation): number => {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        return b === 0 ? 0 : a / b;
      default:
        return b;
    }
  };

  const equals = () => {
    if (operation === null || previousValue === null) return;
    const inputValue = parseFloat(display);
    const result = calculate(previousValue, inputValue, operation);
    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const toggleSign = () => {
    setDisplay(display.startsWith("-") ? display.slice(1) : "-" + display);
  };

  const percent = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  const buttons: { label: string; onClick: () => void; variant?: "secondary" | "destructive" | "default"; className?: string }[] = [
    { label: "AC", onClick: clear, variant: "secondary" },
    { label: "±", onClick: toggleSign, variant: "secondary" },
    { label: "%", onClick: percent, variant: "secondary" },
    { label: "÷", onClick: () => performOperation("÷"), variant: "destructive" },
    { label: "7", onClick: () => inputDigit("7") },
    { label: "8", onClick: () => inputDigit("8") },
    { label: "9", onClick: () => inputDigit("9") },
    { label: "×", onClick: () => performOperation("×"), variant: "destructive" },
    { label: "4", onClick: () => inputDigit("4") },
    { label: "5", onClick: () => inputDigit("5") },
    { label: "6", onClick: () => inputDigit("6") },
    { label: "-", onClick: () => performOperation("-"), variant: "destructive" },
    { label: "1", onClick: () => inputDigit("1") },
    { label: "2", onClick: () => inputDigit("2") },
    { label: "3", onClick: () => inputDigit("3") },
    { label: "+", onClick: () => performOperation("+"), variant: "destructive" },
    { label: "0", onClick: () => inputDigit("0"), className: "col-span-2" },
    { label: ".", onClick: inputDecimal },
    { label: "=", onClick: equals, variant: "default" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-sm shadow-xl rounded-3xl border-slate-200 bg-white">
        <CardContent className="p-6">
          <div className="mb-6 rounded-2xl bg-slate-900 px-6 py-8 text-right">
            <div className="text-slate-400 text-sm h-5 mb-1">
              {previousValue !== null && operation ? `${previousValue} ${operation}` : "\u00A0"}
            </div>
            <div className="text-4xl font-bold text-white truncate font-mono">
              {display}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {buttons.map((btn, i) => (
              <Button
                key={i}
                onClick={btn.onClick}
                variant={btn.variant || "outline"}
                className={cn(
                  "h-14 text-lg font-semibold rounded-xl shadow-sm",
                  btn.className
                )}
              >
                {btn.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}