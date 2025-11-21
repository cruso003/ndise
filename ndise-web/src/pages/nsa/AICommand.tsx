import { useSearchParams } from 'react-router-dom';
import AICommandCenter from '../../components/AICommandCenter';

export default function AICommand() {
  const [searchParams] = useSearchParams();
  const targetId = searchParams.get('targetId');
  const targetName = searchParams.get('targetName');

  const initialTarget = targetId && targetName
    ? { nationalId: targetId, name: targetName }
    : undefined;

  return (
    <div className="space-y-6">
      <AICommandCenter
        initialTarget={initialTarget}
        onCommandExecuted={(task) => {
          console.log('Command executed:', task);
          // TODO: Integrate with actual backend APIs
          // - LiveKit for voice processing
          // - OpenAI GPT-4 for command understanding
          // - Backend APIs for actual operations
        }}
      />
    </div>
  );
}
