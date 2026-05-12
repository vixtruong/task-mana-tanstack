import { Layout } from './components/ui/Layout';
import { KanbanBoard } from './components/board/KanbanBoard';
import { TaskTable } from './components/table/TaskTable';
import { TaskModal } from './components/task/TaskModal';
import { useUIStore } from './store/uiStore';

function App() {
  const viewMode = useUIStore((s) => s.viewMode);

  return (
    <Layout>
      {viewMode === 'board' ? <KanbanBoard /> : <TaskTable />}
      <TaskModal />
    </Layout>
  );
}

export default App;
