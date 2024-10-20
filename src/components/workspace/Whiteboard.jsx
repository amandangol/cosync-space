  import React, { useCallback, useEffect, useState, useRef } from 'react';
  import { useRouter } from 'next/navigation';
  import { useUser } from '@clerk/nextjs';
  import { useBroadcastEvent, useEventListener, useMyPresence } from '@liveblocks/react';
  import { motion } from 'framer-motion';
  import { Stage, Layer, Line, Circle, Rect, Text, Transformer } from 'react-konva';
  import { 
    Pencil, 
    Square, 
    Circle as CircleIcon, 
    Type, 
    Eraser, 
    Trash2,
    Maximize,
    Minimize,
    Move
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
  import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

  const tools = [
    { icon: Pencil, name: 'pencil' },
    { icon: Square, name: 'rectangle' },
    { icon: CircleIcon, name: 'circle' },
    { icon: Type, name: 'text' },
    { icon: Eraser, name: 'eraser' },
    { icon: Move, name: 'move' },
  ];

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
  const brushSizes = [2, 5, 10, 15, 20];

  const Whiteboard = ({ params }) => {
    const [shapes, setShapes] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [{ selectedTool, selectedColor }, updateMyPresence] = useMyPresence();
    const broadcast = useBroadcastEvent();
    const { user } = useUser();
    const router = useRouter();

    const [tool, setTool] = useState('pencil');
    const [color, setColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(5);
    const [textInput, setTextInput] = useState('');
    const [isFullScreen, setIsFullScreen] = useState(false);
    const stageRef = useRef(null);
    const textRef = useRef(null);
    const [selectedId, selectShape] = useState(null);

    const handleMouseDown = useCallback((e) => {
      if (tool === 'move') {
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
          selectShape(null);
        }
        return;
      }

      setIsDrawing(true);
      const pos = e.target.getStage().getPointerPosition();
      const newShape = { tool, color, points: [pos.x, pos.y], brushSize, id: Date.now().toString() };
      setShapes([...shapes, newShape]);
      updateMyPresence({ selectedTool: tool, selectedColor: color });
    }, [shapes, tool, color, brushSize, updateMyPresence]);

    const handleMouseMove = useCallback((e) => {
      if (!isDrawing) return;

      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      const lastShape = shapes[shapes.length - 1];
      
      if (tool === 'eraser') {
        const eraserRadius = brushSize;
        const updatedShapes = shapes.filter(shape => {
          if (shape.tool === 'pencil') {
            return !shape.points.some((p, i) => 
              i % 2 === 0 && 
              Math.hypot(p - point.x, shape.points[i + 1] - point.y) < eraserRadius
            );
          } else if (shape.tool === 'rectangle' || shape.tool === 'circle') {
            const centerX = shape.points[0] + shape.width / 2;
            const centerY = shape.points[1] + shape.height / 2;
            return Math.hypot(centerX - point.x, centerY - point.y) > eraserRadius;
          } else if (shape.tool === 'text') {
            return Math.hypot(shape.points[0] - point.x, shape.points[1] - point.y) > eraserRadius;
          }
          return true;
        });
        setShapes(updatedShapes);
      } else {
        if (tool === 'pencil') {
          lastShape.points = lastShape.points.concat([point.x, point.y]);
        } else if (tool === 'rectangle' || tool === 'circle') {
          lastShape.width = point.x - lastShape.points[0];
          lastShape.height = point.y - lastShape.points[1];
        }
        setShapes([...shapes.slice(0, -1), lastShape]);
      }

      broadcast({ type: 'DRAW_SHAPE', shape: lastShape });
    }, [isDrawing, shapes, tool, brushSize, broadcast]);

    const handleMouseUp = useCallback(() => {
      setIsDrawing(false);
    }, []);

    const handleTextDblClick = useCallback((e) => {
      const stage = e.target.getStage();
      const position = stage.getPointerPosition();
      setTextInput('');
      textRef.current = {
        x: position.x,
        y: position.y,
      };
      stage.container().style.cursor = 'text';
    }, []);
  
    const handleTextEnter = useCallback((e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        const newShape = { 
          tool: 'text', 
          color: tool === 'text' ? '#000000' : color,
          points: [textRef.current.x, textRef.current.y], 
          text: textInput,
          fontSize: brushSize * 2,
          id: Date.now().toString()
        };
        setShapes([...shapes, newShape]);
        setTextInput('');
        broadcast({ type: 'DRAW_SHAPE', shape: newShape });
        stageRef.current.container().style.cursor = 'default';
        e.preventDefault();
      }
    }, [textInput, brushSize, shapes, broadcast]);

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

    const handleDragStart = (e) => {
      const id = e.target.id();
      setShapes(
        shapes.map((shape) => {
          return {
            ...shape,
            isDragging: shape.id === id,
          };
        })
      );
    };

    const handleDragEnd = (e) => {
      setShapes(
        shapes.map((shape) => {
          return {
            ...shape,
            isDragging: false,
          };
        })
      );
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
          <Select value={brushSize.toString()} onValueChange={(value) => setBrushSize(Number(value))}>
            <SelectTrigger className="w-20 text-black">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              {brushSizes.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}px
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="destructive" size="icon" onClick={() => {
            setShapes([]);
            broadcast({ type: 'CLEAR_WHITEBOARD' });
          }}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={toggleFullScreen}>
            {isFullScreen ? <Minimize className="h-4 w-4 text-gray-800" /> : <Maximize className="h-4 w-4 text-gray-800" />}
          </Button>
        </div>
        <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0,
          backgroundColor: 'white',
        }}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onDblClick={handleTextDblClick}
        ref={stageRef}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            width={window.innerWidth}
            height={window.innerHeight}
            fill="white"
          />
          {shapes.map((shape, i) => {
            if (shape.tool === 'pencil') {
              return (
                <Line
                  key={shape.id}
                  points={shape.points}
                  stroke={shape.color}
                  strokeWidth={shape.brushSize}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={shape.tool === 'eraser' ? 'destination-out' : 'source-over'}
                  draggable={tool === 'move'}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  id={shape.id}
                />
              );
            } else if (shape.tool === 'rectangle') {
              return (
                <Rect
                  key={shape.id}
                  x={shape.points[0]}
                  y={shape.points[1]}
                  width={shape.width}
                  height={shape.height}
                  stroke={shape.color}
                  strokeWidth={shape.brushSize}
                  draggable={tool === 'move'}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  id={shape.id}
                />
              );
            } else if (shape.tool === 'circle') {
              return (
                <Circle
                  key={shape.id}
                  x={shape.points[0]}
                  y={shape.points[1]}
                  radius={Math.abs(shape.width + shape.height) / 2}
                  stroke={shape.color}
                  strokeWidth={shape.brushSize}
                  draggable={tool === 'move'}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  id={shape.id}
                />
              );
            } else if (shape.tool === 'text') {
              return (
                <Text
                  key={shape.id}
                  x={shape.points[0]}
                  y={shape.points[1]}
                  text={shape.text}
                  fontSize={shape.fontSize}
                  fill="black" 
                  draggable={tool === 'move'}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  id={shape.id}
                />
              );
            }
          })}
        </Layer>
      </Stage>
        {tool === 'text' && (
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={handleTextEnter}
            style={{
              position: 'absolute',
              top: textRef.current ? textRef.current.y : 0,
              left: textRef.current ? textRef.current.x : 0,
              zIndex: 1,
              color: 'black',
            }}
          />
        )}
      </motion.div>
    );
  };

  export default Whiteboard;