import { ReactFlow } from '@xyflow/react';

const nodes = [
  { id: '1', type: 'input', data: { label: 'Start Node' }, position: { x: 250, y: 5 } },
  { id: '2', data: { label: 'Middle Node' }, position: { x: 100, y: 100 } },
  { id: '3', data: { label: 'End Node' }, position: { x: 400, y: 100 } },
];

const edges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
];

export default function Microsoft() {
  return (
    <div style={{ width: '100vw', height: '90vh' }}>
      <h2>React Flow Demo</h2>
      <ReactFlow nodes={nodes} edges={edges} fitView style={{ background: '#f0f0f0', height: '80vh' }} />
    </div>
  );
}
