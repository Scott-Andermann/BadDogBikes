import React, { useRef, useEffect, useState } from 'react';

const ClickAndDrag = () => {
  const canvasRef = useRef(null);
  const [points, setPoints] = useState([{ x: 100, y: 100 }, {x: 200, y: 200}, {x: 200, y: 300}]);
  const [selectedPointIndex, setSelectedPointIndex] = useState(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      points.forEach((point, index) => {
        context.beginPath();
        context.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        context.fillStyle = index === selectedPointIndex ? 'red' : 'black';
        context.fill();
        context.closePath();
        if (index < points.length - 1) {
          context.beginPath();
          context.moveTo(points[index].x, points[index].y)
          context.lineTo(points[index + 1].x, points[index + 1].y)
          context.stroke();
        }
      });
    };

    const handleMouseDown = (event) => {
      const mouseX = event.clientX - canvas.offsetLeft;
      const mouseY = event.clientY - canvas.offsetTop;

      points.forEach((point, index) => {
        const distance = Math.sqrt((point.x - mouseX) ** 2 + (point.y - mouseY) ** 2);
        console.log(distance);
        
        if (distance < 10) {
          setSelectedPointIndex(index);
          setDragging(true);
        }
      });
    };

    const handleMouseMove = (event) => {
      if (dragging && selectedPointIndex !== null) {
        const mouseX = event.clientX - canvas.offsetLeft;
        const mouseY = event.clientY - canvas.offsetTop;
        const newPoints = [...points];
        newPoints[selectedPointIndex] = { x: mouseX, y: mouseY };
        setPoints(newPoints);
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
      setSelectedPointIndex(null);
    };

    draw();

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, points, selectedPointIndex]);

  console.log(points);
  

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      className="bg-white"
      style={{ border: '1px solid black' }}
    ></canvas>
  );
};

export default ClickAndDrag;