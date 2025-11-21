import { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Terminal,
  Loader,
  CheckCircle,
  AlertCircle,
  Clock,
  Camera,
  CreditCard,
  Phone,
  Eye,
  MapPin,
  Users,
  Radio,
  Activity,
  Zap,
  Shield,
  Play,
  Pause,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CommandTask {
  id: string;
  command: string;
  type: 'surveillance' | 'purchase_check' | 'sim_monitor' | 'cctv_search' | 'network_analysis' | 'border_alert' | 'watchlist' | 'detention';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: string;
  startTime: Date;
  endTime?: Date;
  targetId?: string;
  targetName?: string;
}

interface AICommandCenterProps {
  onCommandExecuted?: (task: CommandTask) => void;
  initialTarget?: {
    nationalId: string;
    name: string;
  };
}

export default function AICommandCenter({ onCommandExecuted, initialTarget }: AICommandCenterProps) {
  const [commandInput, setCommandInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [tasks, setTasks] = useState<CommandTask[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setVoiceSupported(true);
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCommandInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!voiceSupported) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'surveillance':
        return <Camera className="w-5 h-5" />;
      case 'purchase_check':
        return <CreditCard className="w-5 h-5" />;
      case 'sim_monitor':
        return <Phone className="w-5 h-5" />;
      case 'cctv_search':
        return <Eye className="w-5 h-5" />;
      case 'network_analysis':
        return <Users className="w-5 h-5" />;
      case 'border_alert':
        return <MapPin className="w-5 h-5" />;
      case 'watchlist':
        return <Shield className="w-5 h-5" />;
      case 'detention':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Terminal className="w-5 h-5" />;
    }
  };

  const getTaskColor = (type: string) => {
    switch (type) {
      case 'surveillance':
        return 'bg-purple-500';
      case 'purchase_check':
        return 'bg-green-500';
      case 'sim_monitor':
        return 'bg-blue-500';
      case 'cctv_search':
        return 'bg-orange-500';
      case 'network_analysis':
        return 'bg-pink-500';
      case 'border_alert':
        return 'bg-yellow-500';
      case 'watchlist':
        return 'bg-red-500';
      case 'detention':
        return 'bg-red-700';
      default:
        return 'bg-slate-500';
    }
  };

  const parseCommand = (command: string): Omit<CommandTask, 'id' | 'startTime' | 'status' | 'progress'> => {
    const lowerCommand = command.toLowerCase();

    // Surveillance commands
    if (lowerCommand.includes('surveillance') || lowerCommand.includes('monitor') || lowerCommand.includes('watch')) {
      return {
        command,
        type: 'surveillance',
        targetId: initialTarget?.nationalId,
        targetName: initialTarget?.name || 'Unknown Target',
      };
    }

    // Purchase check commands
    if (lowerCommand.includes('purchase') || lowerCommand.includes('transaction') || lowerCommand.includes('financial')) {
      return {
        command,
        type: 'purchase_check',
        targetId: initialTarget?.nationalId,
        targetName: initialTarget?.name || 'Unknown Target',
      };
    }

    // SIM monitoring commands
    if (lowerCommand.includes('sim') || lowerCommand.includes('phone') || lowerCommand.includes('call')) {
      return {
        command,
        type: 'sim_monitor',
        targetId: initialTarget?.nationalId,
        targetName: initialTarget?.name || 'Unknown Target',
      };
    }

    // CCTV search commands
    if (lowerCommand.includes('cctv') || lowerCommand.includes('camera') || lowerCommand.includes('sighting')) {
      return {
        command,
        type: 'cctv_search',
        targetId: initialTarget?.nationalId,
        targetName: initialTarget?.name || 'Unknown Target',
      };
    }

    // Network analysis commands
    if (lowerCommand.includes('network') || lowerCommand.includes('connection') || lowerCommand.includes('associate')) {
      return {
        command,
        type: 'network_analysis',
        targetId: initialTarget?.nationalId,
        targetName: initialTarget?.name || 'Unknown Target',
      };
    }

    // Border alert commands
    if (lowerCommand.includes('border') || lowerCommand.includes('checkpoint') || lowerCommand.includes('alert all')) {
      return {
        command,
        type: 'border_alert',
        targetId: initialTarget?.nationalId,
        targetName: initialTarget?.name || 'Unknown Target',
      };
    }

    // Watchlist commands
    if (lowerCommand.includes('watchlist') || lowerCommand.includes('flag system')) {
      return {
        command,
        type: 'watchlist',
        targetId: initialTarget?.nationalId,
        targetName: initialTarget?.name || 'Unknown Target',
      };
    }

    // Detention commands
    if (lowerCommand.includes('detain') || lowerCommand.includes('arrest') || lowerCommand.includes('immediate action')) {
      return {
        command,
        type: 'detention',
        targetId: initialTarget?.nationalId,
        targetName: initialTarget?.name || 'Unknown Target',
      };
    }

    // Default: CCTV search
    return {
      command,
      type: 'cctv_search',
      targetId: initialTarget?.nationalId,
      targetName: initialTarget?.name || 'Unknown Target',
    };
  };

  const executeCommand = async () => {
    if (!commandInput.trim()) return;

    setIsProcessing(true);

    const parsedCommand = parseCommand(commandInput);
    const newTask: CommandTask = {
      id: `task-${Date.now()}`,
      ...parsedCommand,
      status: 'queued',
      progress: 0,
      startTime: new Date(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setCommandInput('');

    // Simulate task execution with progress
    setTimeout(() => {
      setTasks((prev) =>
        prev.map((t) => (t.id === newTask.id ? { ...t, status: 'processing', progress: 10 } : t))
      );
    }, 500);

    // Simulate OpenAI/LiveKit processing
    const progressInterval = setInterval(() => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === newTask.id && t.status === 'processing') {
            const newProgress = Math.min(t.progress + Math.random() * 30, 95);
            return { ...t, progress: newProgress };
          }
          return t;
        })
      );
    }, 1000);

    // Complete after 3-5 seconds
    setTimeout(() => {
      clearInterval(progressInterval);
      const result = generateTaskResult(newTask.type, newTask.targetName || 'target');
      const completedTask = {
        ...newTask,
        status: 'completed' as const,
        progress: 100,
        endTime: new Date(),
        result,
      };

      setTasks((prev) =>
        prev.map((t) => (t.id === newTask.id ? completedTask : t))
      );

      if (onCommandExecuted) {
        onCommandExecuted(completedTask);
      }

      setIsProcessing(false);
    }, 3000 + Math.random() * 2000);
  };

  const generateTaskResult = (type: string, targetName: string): string => {
    switch (type) {
      case 'surveillance':
        return `Active surveillance initiated on ${targetName}. CCTV feeds from 12 locations now monitoring. Real-time alerts configured.`;
      case 'purchase_check':
        return `Transaction history retrieved: 45 purchases in last 30 days totaling $12,340. 3 flagged transactions detected at border locations.`;
      case 'sim_monitor':
        return `SIM activity tracker deployed. Monitoring 2 active SIMs. 87 calls logged in past week. Unusual contact patterns detected with foreign numbers.`;
      case 'cctv_search':
        return `CCTV search complete: ${targetName} sighted at 4 locations in past 24 hours. Last seen: Paynesville Market, 2 hours ago. Vehicle: Black SUV LBR-8234.`;
      case 'network_analysis':
        return `Network map generated: ${targetName} connected to 23 individuals. 5 high-risk associates identified. Cross-border connections detected with Nigeria, Ghana.`;
      case 'border_alert':
        return `Border alert issued to all 18 checkpoints. Biometric match triggers configured. On-sight detention order activated.`;
      case 'watchlist':
        return `${targetName} added to national watchlist. All agencies notified. System-wide flagging active across NDISE, Immigration, Police databases.`;
      case 'detention':
        return `Immediate detention order issued for ${targetName}. NSA tactical unit dispatched. All law enforcement notified. ETA: 15 minutes.`;
      default:
        return `Command executed successfully for ${targetName}.`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'queued':
        return <Clock className="w-4 h-4 text-slate-500" />;
      case 'processing':
        return <Loader className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const activeTasks = tasks.filter((t) => t.status === 'processing' || t.status === 'queued');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const failedTasks = tasks.filter((t) => t.status === 'failed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">AI Command Center</h2>
            <p className="text-sm text-slate-600">Multimodal operational intelligence system</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg border border-green-300">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-bold">ONLINE</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg border border-blue-300">
            <Radio className="w-4 h-4" />
            <span className="text-xs font-bold">GPT-4 + LiveKit</span>
          </div>
        </div>
      </div>

      {/* Command Input */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-2 border-blue-500 rounded-xl p-6 shadow-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Terminal className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-mono text-blue-400">COMMAND INTERFACE</span>
        </div>

        {initialTarget && (
          <div className="mb-4 p-3 bg-blue-900/30 border border-blue-400 rounded-lg">
            <div className="text-xs font-mono text-blue-300 mb-1">TARGET CONTEXT:</div>
            <div className="text-sm font-bold text-white">
              {initialTarget.name} ({initialTarget.nationalId})
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isProcessing && executeCommand()}
              placeholder="Enter command: 'Check for sighting of target' or 'Monitor purchase records'..."
              className="w-full px-4 py-4 bg-slate-950 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono text-sm"
              disabled={isProcessing}
            />
            {isListening && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="flex items-center gap-2">
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <span className="text-xs text-red-400 font-bold">LISTENING</span>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={toggleVoiceInput}
            disabled={!voiceSupported || isProcessing}
            className={`px-4 py-4 rounded-lg font-bold transition-all ${
              isListening
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={voiceSupported ? 'Voice Command' : 'Voice not supported'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <button
            onClick={executeCommand}
            disabled={!commandInput.trim() || isProcessing}
            className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                EXECUTING
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                EXECUTE
              </>
            )}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-slate-400 font-mono">QUICK COMMANDS:</span>
          <button
            onClick={() => setCommandInput('Check for CCTV sightings of target in last 24 hours')}
            className="text-xs px-3 py-1 bg-slate-700 hover:bg-slate-600 text-blue-300 rounded-lg font-mono transition-colors"
          >
            CCTV Sightings
          </button>
          <button
            onClick={() => setCommandInput('Monitor purchase records and transactions')}
            className="text-xs px-3 py-1 bg-slate-700 hover:bg-slate-600 text-green-300 rounded-lg font-mono transition-colors"
          >
            Purchase Records
          </button>
          <button
            onClick={() => setCommandInput('Track SIM card activity and communications')}
            className="text-xs px-3 py-1 bg-slate-700 hover:bg-slate-600 text-purple-300 rounded-lg font-mono transition-colors"
          >
            SIM Tracking
          </button>
          <button
            onClick={() => setCommandInput('Analyze network connections and associates')}
            className="text-xs px-3 py-1 bg-slate-700 hover:bg-slate-600 text-pink-300 rounded-lg font-mono transition-colors"
          >
            Network Analysis
          </button>
        </div>
      </div>

      {/* Task Overview */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-700 uppercase">Active</span>
            <Loader className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-900">{activeTasks.length}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-green-700 uppercase">Completed</span>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-900">{completedTasks.length}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-red-700 uppercase">Failed</span>
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-900">{failedTasks.length}</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase">Total</span>
            <Terminal className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900">{tasks.length}</div>
        </div>
      </div>

      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Loader className="w-5 h-5 text-blue-600 animate-spin" />
              Active Operations
            </h3>
          </div>
          <div className="divide-y divide-slate-200">
            {activeTasks.map((task) => (
              <div key={task.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 ${getTaskColor(task.type)} rounded-lg text-white`}>
                    {getTaskIcon(task.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-bold text-slate-900 mb-1">{task.command}</div>
                        <div className="text-sm text-slate-600">
                          Target: {task.targetName} • Started {formatDistanceToNow(task.startTime, { addSuffix: true })}
                        </div>
                      </div>
                      {getStatusIcon(task.status)}
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{Math.round(task.progress)}% complete</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 bg-green-50 border-b border-green-200">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Completed Operations
            </h3>
          </div>
          <div className="divide-y divide-slate-200">
            {completedTasks.slice(0, 5).map((task) => (
              <div key={task.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 ${getTaskColor(task.type)} rounded-lg text-white`}>
                    {getTaskIcon(task.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-bold text-slate-900 mb-1">{task.command}</div>
                        <div className="text-sm text-slate-600">
                          Target: {task.targetName} • Completed {formatDistanceToNow(task.endTime!, { addSuffix: true })}
                        </div>
                      </div>
                      {getStatusIcon(task.status)}
                    </div>
                    {task.result && (
                      <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="text-sm text-slate-700">{task.result}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-xl p-12 text-center">
          <Terminal className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">AI Command Center Ready</h3>
          <p className="text-slate-600 mb-4">
            Enter a command or use voice input to execute operational intelligence tasks.
            <br />
            Powered by GPT-4 multimodal processing and LiveKit real-time voice.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
            <Shield className="w-4 h-4" />
            Secured Connection • End-to-End Encrypted
          </div>
        </div>
      )}
    </div>
  );
}
