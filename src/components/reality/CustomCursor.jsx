import React, { useEffect, useState } from 'react';

export const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [cursorType, setCursorType] = useState('default'); // 'default' | 'walk' | 'enter' | 'talk' | 'inspect' | 'fight'
  const [cursorLabel, setCursorLabel] = useState('');
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Detect hover target data-action
      const target = document.elementFromPoint(e.clientX, e.clientY);
      if (target) {
        const actionType = target.getAttribute('data-cursor-action') || target.closest('[data-cursor-action]')?.getAttribute('data-cursor-action');
        const label = target.getAttribute('data-cursor-label') || target.closest('[data-cursor-label]')?.getAttribute('data-cursor-label');

        if (actionType) {
          setCursorType(actionType);
          setCursorLabel(label || actionType.toUpperCase());
          setIsPointer(true);
        } else if (target.tagName === 'BUTTON' || target.onclick || target.closest('button')) {
          setCursorType('click');
          setCursorLabel('CLICK');
          setIsPointer(true);
        } else {
          setCursorType('default');
          setCursorLabel('');
          setIsPointer(false);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (pos.x < 0) return null;

  const getCursorColor = () => {
    switch (cursorType) {
      case 'enter':
        return 'border-emerald-400 bg-emerald-500/20 text-emerald-300';
      case 'talk':
        return 'border-blue-400 bg-blue-500/20 text-blue-300';
      case 'fight':
        return 'border-red-500 bg-red-500/20 text-red-300';
      case 'order':
      case 'inspect':
        return 'border-amber-400 bg-amber-500/20 text-amber-300';
      case 'walk':
        return 'border-teal-400 bg-teal-500/20 text-teal-300';
      default:
        return 'border-emerald-400 bg-emerald-400/10 text-emerald-400';
    }
  };

  return (
    <div
      className="fixed pointer-events-none z-[9999] transition-transform duration-75 ease-out hidden sm:block"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Outer Reticle Ring */}
      <div
        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-150 ${
          isPointer ? 'scale-125 ' + getCursorColor() : 'border-emerald-400/70 bg-transparent'
        }`}
      >
        {/* Center Target Dot */}
        <div className="w-1.5 h-1.5 rounded-full bg-white" />
      </div>

      {/* Floating Action Badge Label */}
      {cursorLabel && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md bg-slate-950/90 border border-slate-700 text-[10px] font-bold tracking-wider shadow-lg">
          {cursorLabel}
        </div>
      )}
    </div>
  );
};
