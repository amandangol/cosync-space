import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useBroadcastEvent, useEventListener, useMyPresence } from '@liveblocks/react';
import { motion } from 'framer-motion';
import { Stage, Layer, Line, Circle, Rect, Text } from 'react-konva';
import { 
  Pencil, 
  Square, 
  Circle as CircleIcon, 
  Type, 
  Eraser, 
  Trash2,
  Maximize,
  Minimize
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const tools = [
  { icon: Pencil, name: 'pencil' },
  { icon: Square, name: 'rectangle' },
  { icon: CircleIcon, name: 'circle' },
  { icon: Type, name: 'text' },
  { icon: Eraser, name: 'eraser' },
];

const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

const Whiteboard = ({ params }) => {
  const [shapes, setShapes] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [{ selectedTool, selectedColor }, updateMyPresence] = useMyPresence();
  const broadcast = useBroadcastEvent();
  const { user } = useUser();
  const router = useRouter();

  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#000000');
  const [textInput, setTextInput] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleMouseDown = useCallback((e) => {
    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    const newShape = { tool, color, points: [pos.x, pos.y] };
    setShapes([...shapes, newShape]);
    updateMyPresence({ selectedTool: tool, selectedColor: color });
  }, [shapes, tool, color, updateMyPresence]);

  const handleMouseMove = useCallback((e) => {
    if (!isDrawing) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastShape = shapes[shapes.length - 1];
    
    if (tool === 'eraser') {
      // Implement eraser logic
      const eraserRadius = 10;
      const updatedShapes = shapes.filter(shape => {
        if (shape.tool === 'pencil') {
          return !shape.points.some((p, i) => 
            i % 2 === 0 && 
            Math.hypot(p - point.x, shape.points[i + 1] - point.y) < eraserRadius
          );
        }
        return true;
      });
      setShapes(updatedShapes);
    } else {
      // Update last shape
      if (tool === 'pencil') {
        lastShape.points = lastShape.points.concat([point.x, point.y]);
      } else if (tool === 'rectangle' || tool === 'circle') {
        lastShape.width = point.x - lastShape.points[0];
        lastShape.height = point.y - lastShape.points[1];
      }
      setShapes([...shapes.slice(0, -1), lastShape]);
    }

    broadcast({ type: 'DRAW_SHAPE', shape: lastShape });
  }, [isDrawing, shapes, tool, broadcast]);

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const handleTextSubmit = useCallback((e) => {
    e.preventDefault();
    if (textInput) {
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      const newShape = { tool: 'text', color, points: [point.x, point.y], text: textInput };
      setShapes([...shapes, newShape]);
      setTextInput('');
      broadcast({ type: 'DRAW_SHAPE', shape: newShape });
    }
  }, [textInput, color, shapes, broadcast]);

  useEventListener(({ event }) => {
    if (event.type === 'DRAW_SHAPE') {
      setShapes((prevShapes) => [...prevShapes, event.shape]);
    } else if (event.type === 'CLEAR_WHITEBOARD') {
      setShapes([]);
    }
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'c' && e.ctrlKey) {
        setShapes([]);
        broadcast({ type: 'CLEAR_WHITEBOARD' });
      } else if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [broadcast, isFullScreen]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`w-full h-full bg-white relative ${isFullScreen ? 'fixed inset-0 z-50' : ''}`}
    >
      <div className="absolute top-4 left-4 z-10 flex space-x-2">
        <ToggleGroup type="single" value={tool} onValueChange={(value) => value && setTool(value)}>
          {tools.map((item) => (
            <ToggleGroupItem key={item.name} value={item.name} aria-label={item.name}>
              <item.icon 
                className="h-4 w-4 text-gray-800 hover:text-black transition-colors duration-300"
              />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-8 h-8 p-0" 
              style={{backgroundColor: color}}
            />
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <div className="flex flex-wrap gap-1">
              {colors.map((c) => (
                <Button
                  key={c}
                  className="w-8 h-8 p-0"
                  style={{backgroundColor: c}}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <Button variant="destructive" size="icon" onClick={() => {
          setShapes([]);
          broadcast({ type: 'CLEAR_WHITEBOARD' });
        }}>
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={toggleFullScreen}>
          {isFullScreen ? <Minimize className="h-4 w-4 text-gray-800 " /> : <Maximize className="h-4 w-4 text-gray-800" />}
        </Button>
      </div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer>
          {shapes.map((shape, i) => {
            if (shape.tool === 'pencil') {
              return (
                <Line
                  key={i}
                  points={shape.points}
                  stroke={shape.color}
                  strokeWidth={5}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={shape.tool === 'eraser' ? 'destination-out' : 'source-over'}
                />
              );
            } else if (shape.tool === 'rectangle') {
              return (
                <Rect
                  key={i}
                  x={shape.points[0]}
                  y={shape.points[1]}
                  width={shape.width}
                  height={shape.height}
                  stroke={shape.color}
                  strokeWidth={5}
                />
              );
            } else if (shape.tool === 'circle') {
              return (
                <Circle
                  key={i}
                  x={shape.points[0]}
                  y={shape.points[1]}
                  radius={Math.abs(shape.width + shape.height) / 2}
                  stroke={shape.color}
                  strokeWidth={5}
                />
              );
            } else if (shape.tool === 'text') {
              return (
                <Text
                  key={i}
                  x={shape.points[0]}
                  y={shape.points[1]}
                  text={shape.text}
                  fontSize={20}
                  fill={shape.color}
                />
              );
            }
          })}
        </Layer>
      </Stage>
      {tool === 'text' && (
        <form onSubmit={handleTextSubmit} className="absolute bottom-4 left-4 z-10">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Enter text and click to place"
            className="px-2 py-1 border rounded"
          />
        </form>
      )}
    </motion.div>
  );
};

export default Whiteboard;