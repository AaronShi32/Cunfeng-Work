const { ReactFlow, MiniMap, Controls, Background } = window.ReactFlowRenderer;

const initialNodes = [
  { id: '1', type: 'input', data: { label: 'Start Node' }, position: { x: 250, y: 5 } },
  { id: '2', data: { label: 'Middle Node' }, position: { x: 100, y: 100 } },
  { id: '3', data: { label: 'End Node' }, position: { x: 400, y: 100 } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
];

function FlowDemo() {
  const [nodes, setNodes] = React.useState(initialNodes);
  const [edges, setEdges] = React.useState(initialEdges);
  return React.createElement(
    'div',
    { style: { width: '100vw', height: '100vh' } },
    React.createElement(
      ReactFlow,
      {
        nodes,
        edges,
        fitView: true,
        style: { background: '#f0f0f0' },
      },
      React.createElement(MiniMap, null),
      React.createElement(Controls, null),
      React.createElement(Background, { gap: 16 })
    )
  );
}

ReactDOM.render(
  React.createElement(FlowDemo),
  document.getElementById('root')
);
