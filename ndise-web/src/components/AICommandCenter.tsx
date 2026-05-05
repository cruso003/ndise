import { useState, useRef, useEffect } from "react";
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
  Lock,
  Unlock,
  Siren,
  Wifi,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CommandTask {
  id: string;
  command: string;
  type:
    | "surveillance"
    | "purchase_check"
    | "sim_monitor"
    | "cctv_search"
    | "network_analysis"
    | "border_alert"
    | "watchlist"
    | "detention"
    | "hack_camera"
    | "signal_intercept";
  status: "queued" | "processing" | "completed" | "failed";
  progress: number;
  result?: string;
  startTime: Date;
  endTime?: Date;
  targetId?: string;
  targetName?: string;
  isOverride?: boolean;
}

interface AICommandCenterProps {
  onCommandExecuted?: (task: CommandTask) => void;
  initialTarget?: {
    nationalId: string;
    name: string;
  };
}

export default function AICommandCenter({
  onCommandExecuted,
  initialTarget,
}: AICommandCenterProps) {
  const [commandInput, setCommandInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [tasks, setTasks] = useState<CommandTask[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);

  // Protocol Delta State (Executive Override)
  const [protocolDeltaActive, setProtocolDeltaActive] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setVoiceSupported(true);
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
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

  const toggleProtocolDelta = () => {
    if (protocolDeltaActive) {
      setProtocolDeltaActive(false);
    } else {
      setShowOverrideModal(true);
    }
  };

  const confirmOverride = () => {
    setProtocolDeltaActive(true);
    setShowOverrideModal(false);
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "surveillance":
        return <Camera className="w-5 h-5" />;
      case "hack_camera":
        return <Wifi className="w-5 h-5" />;
      case "purchase_check":
        return <CreditCard className="w-5 h-5" />;
      case "sim_monitor":
      case "signal_intercept":
        return <Phone className="w-5 h-5" />;
      case "cctv_search":
        return <Eye className="w-5 h-5" />;
      case "network_analysis":
        return <Users className="w-5 h-5" />;
      case "border_alert":
        return <MapPin className="w-5 h-5" />;
      case "watchlist":
        return <Shield className="w-5 h-5" />;
      case "detention":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Terminal className="w-5 h-5" />;
    }
  };

  const getTaskColor = (type: string) => {
    if (protocolDeltaActive) return "bg-red-600"; // Uniform red for override mode

    switch (type) {
      case "surveillance":
        return "bg-purple-500";
      case "purchase_check":
        return "bg-green-500";
      case "sim_monitor":
        return "bg-blue-500";
      case "cctv_search":
        return "bg-orange-500";
      case "network_analysis":
        return "bg-pink-500";
      case "border_alert":
        return "bg-yellow-500";
      case "watchlist":
        return "bg-red-500";
      case "detention":
        return "bg-red-700";
      default:
        return "bg-slate-500";
    }
  };

  const parseCommand = (
    command: string
  ): Omit<CommandTask, "id" | "startTime" | "status" | "progress"> => {
    const lowerCommand = command.toLowerCase();

    // Surveillance / CCTV
    if (
      lowerCommand.includes("surveillance") ||
      lowerCommand.includes("monitor") ||
      lowerCommand.includes("watch") ||
      lowerCommand.includes("cctv")
    ) {
      return {
        command,
        type: protocolDeltaActive ? "hack_camera" : "cctv_search",
        targetId: initialTarget?.nationalId,
        targetName: initialTarget?.name || "Unknown Target",
        isOverride: protocolDeltaActive,
      };
    }

    // Purchase / Financial
    if (
      lowerCommand.includes("purchase") ||
      lowerCommand.includes("transaction") ||
      lowerCommand.includes("financial")
    ) {
      return {
        command,
        type: "purchase_check",
        targetId: initialTarget?.nationalId,
        targetName: initialTarget?.name || "Unknown Target",
        isOverride: protocolDeltaActive,
      };
    }

    // SIM / Communications
    if (
      lowerCommand.includes("sim") ||
      lowerCommand.includes("phone") ||
      lowerCommand.includes("call")
    ) {
      return {
        command,
        type: protocolDeltaActive ? "signal_intercept" : "sim_monitor",
        targetId: initialTarget?.nationalId,
        targetName: initialTarget?.name || "Unknown Target",
        isOverride: protocolDeltaActive,
      };
    }

    // Network analysis commands
    if (
      lowerCommand.includes("network") ||
      lowerCommand.includes("connection") ||
      lowerCommand.includes("associate")
    ) {
      return {
        command,
        type: "network_analysis",
        targetId: initialTarget?.nationalId,
        targetName: initialTarget?.name || "Unknown Target",
        isOverride: protocolDeltaActive,
      };
    }

    // Border alert commands
    if (
      lowerCommand.includes("border") ||
      lowerCommand.includes("checkpoint") ||
      lowerCommand.includes("alert all")
    ) {
      return {
        command,
        type: "border_alert",
        targetId: initialTarget?.nationalId,
        targetName: initialTarget?.name || "Unknown Target",
        isOverride: protocolDeltaActive,
      };
    }

    // Watchlist commands
    if (
      lowerCommand.includes("watchlist") ||
      lowerCommand.includes("flag system")
    ) {
      return {
        command,
        type: "watchlist",
        targetId: initialTarget?.nationalId,
        targetName: initialTarget?.name || "Unknown Target",
        isOverride: protocolDeltaActive,
      };
    }

    // Detention commands
    if (
      lowerCommand.includes("detain") ||
      lowerCommand.includes("arrest") ||
      lowerCommand.includes("immediate action")
    ) {
      return {
        command,
        type: "detention",
        targetId: initialTarget?.nationalId,
        targetName: initialTarget?.name || "Unknown Target",
        isOverride: protocolDeltaActive,
      };
    }

    // Default: CCTV search
    return {
      command,
      type: protocolDeltaActive ? "hack_camera" : "cctv_search",
      targetId: initialTarget?.nationalId,
      targetName: initialTarget?.name || "Unknown Target",
      isOverride: protocolDeltaActive,
    };
  };

  const executeCommand = async () => {
    if (!commandInput.trim()) return;

    setIsProcessing(true);

    const parsedCommand = parseCommand(commandInput);
    const newTask: CommandTask = {
      id: `task-${Date.now()}`,
      ...parsedCommand,
      status: "queued",
      progress: 0,
      startTime: new Date(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setCommandInput("");

    // Simulate task execution with progress
    setTimeout(() => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === newTask.id ? { ...t, status: "processing", progress: 10 } : t
        )
      );
    }, 500);

    // Simulate OpenAI/LiveKit processing
    const progressInterval = setInterval(() => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === newTask.id && t.status === "processing") {
            const speed = protocolDeltaActive ? 45 : 30; // Faster in override mode
            const newProgress = Math.min(
              t.progress + Math.random() * speed,
              95
            );
            return { ...t, progress: newProgress };
          }
          return t;
        })
      );
    }, 1000);

    // Complete after 3-5 seconds
    setTimeout(() => {
      clearInterval(progressInterval);
      const result = generateTaskResult(
        newTask.type,
        newTask.targetName || "target",
        newTask.isOverride
      );
      const completedTask = {
        ...newTask,
        status: "completed" as const,
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
    }, 2000 + Math.random() * 2000); // Slightly faster overall
  };

  const generateTaskResult = (
    type: string,
    targetName: string,
    isOverride?: boolean
  ): string => {
    if (isOverride) {
      switch (type) {
        case "hack_camera":
          return `OVERRIDE ACTIVE. Private CCTV node #882 hacked. Face lock acquired on ${targetName}. Biometrics confirmed (99.9%). Tracking movement vector: North-West.`;
        case "signal_intercept":
          return `PROTOCOL DELTA. 3 active calls intercepted. Voice print match. Geo-triangulation bypass successful. Active location: Safehouse B, Sector 4.`;
        case "purchase_check":
          return `BANK SECRECY LIFTED. Accessing SWIFT raw data... ${targetName} received $50,000 wire from [REDACTED] via Cayman offshore shell.`;
        case "network_analysis":
          return `DEEP PACKET INSPECTION. Social graph fully unmasked. 12 hidden associates identified via encrypted app metadata.`;
        default:
          return `EXECUTIVE ACTION EXECUTED. ${targetName} processed with zero-latency protocols.`;
      }
    }

    switch (type) {
      case "surveillance":
        return `Active surveillance initiated on ${targetName}. CCTV feeds from 12 locations now monitoring. Real-time alerts configured.`;
      case "purchase_check":
        return `Transaction history retrieved: 45 purchases in last 30 days totaling $12,340. 3 flagged transactions detected at border locations.`;
      case "sim_monitor":
        return `SIM activity tracker deployed. Monitoring 2 active SIMs. 87 calls logged in past week. Unusual contact patterns detected with foreign numbers.`;
      case "cctv_search":
        return `CCTV search complete: ${targetName} sighted at 4 locations in past 24 hours. Last seen: Paynesville Market, 2 hours ago. Vehicle: Black SUV LBR-8234.`;
      case "network_analysis":
        return `Network map generated: ${targetName} connected to 23 individuals. 5 high-risk associates identified. Cross-border connections detected with Nigeria, Ghana.`;
      case "border_alert":
        return `Border alert issued to all 18 checkpoints. Biometric match triggers configured. On-sight detention order activated.`;
      case "watchlist":
        return `${targetName} added to national watchlist. All agencies notified. System-wide flagging active across NDISE, Immigration, Police databases.`;
      case "detention":
        return `Immediate detention order issued for ${targetName}. NSA tactical unit dispatched. All law enforcement notified. ETA: 15 minutes.`;
      default:
        return `Command executed successfully for ${targetName}.`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "queued":
        return <Clock className="w-4 h-4 text-slate-500" />;
      case "processing":
        return <Loader className="w-4 h-4 text-slate-500 animate-spin" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const activeTasks = tasks.filter(
    (t) => t.status === "processing" || t.status === "queued"
  );
  const completedTasks = tasks.filter((t) => t.status === "completed");
  const failedTasks = tasks.filter((t) => t.status === "failed");

  return (
    <div
      className={`space-y-6 transition-all duration-500 ${
        protocolDeltaActive
          ? "bg-red-950/10 p-4 rounded-2xl border border-red-900/30"
          : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-lg transition-colors ${
              protocolDeltaActive
                ? "bg-red-600"
                : "bg-gradient-to-br from-blue-500 to-purple-600"
            }`}
          >
            {protocolDeltaActive ? (
              <Siren className="w-6 h-6 text-white animate-pulse" />
            ) : (
              <Zap className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <h2
              className={`text-2xl font-bold ${
                protocolDeltaActive ? "text-red-600" : "text-slate-900"
              }`}
            >
              {protocolDeltaActive
                ? "PROTOCOL DELTA ACTIVE"
                : "AI Command Center"}
            </h2>
            <p
              className={`text-sm ${
                protocolDeltaActive
                  ? "text-red-400 font-bold"
                  : "text-slate-600"
              }`}
            >
              {protocolDeltaActive
                ? "EXECUTIVE OVERRIDE • LEGAL GATES DISABLED"
                : "Multimodal operational intelligence system"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleProtocolDelta}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
              protocolDeltaActive
                ? "bg-red-600 text-white border-red-700 hover:bg-red-700 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
            }`}
          >
            {protocolDeltaActive ? (
              <Unlock className="w-4 h-4" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            <span className="text-xs font-bold">
              {protocolDeltaActive ? "DISENGAGE OVERRIDE" : "PROTOCOL DELTA"}
            </span>
          </button>

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
              protocolDeltaActive
                ? "bg-red-100 text-red-700 border-red-300"
                : "bg-blue-100 text-blue-700 border-blue-300"
            }`}
          >
            <Radio className="w-4 h-4" />
            <span className="text-xs font-bold">GPT-4 + LiveKit</span>
          </div>
        </div>
      </div>

      {/* Override Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border-2 border-red-600 rounded-xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(220,38,38,0.3)]">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                INITIATE EXECUTIVE OVERRIDE?
              </h3>
              <p className="text-red-400 font-mono text-sm leading-relaxed">
                WARNING: You are about to bypass Tier 3 Privacy Gates. This
                action disables warrant requirements and enables invasive
                surveillance.
                <br />
                <br />
                All actions will be cryptographically signed and logged to the
                permanent Oversight Ledger.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowOverrideModal(false)}
                className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700 transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={confirmOverride}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 shadow-lg shadow-red-900/50 flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                ENGAGE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Command Input */}
      <div
        className={`border-2 rounded-xl p-6 shadow-2xl transition-all duration-500 ${
          protocolDeltaActive
            ? "bg-gradient-to-r from-red-950 to-slate-900 border-red-600 shadow-red-900/20"
            : "bg-gradient-to-r from-slate-900 to-slate-800 border-blue-500"
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Terminal
            className={`w-5 h-5 ${
              protocolDeltaActive ? "text-red-500" : "text-blue-400"
            }`}
          />
          <span
            className={`text-sm font-mono ${
              protocolDeltaActive
                ? "text-red-500 animate-pulse"
                : "text-blue-400"
            }`}
          >
            {protocolDeltaActive
              ? "ROOT ACCESS // RESTRICTIONS LIFTED"
              : "COMMAND INTERFACE"}
          </span>
        </div>

        {initialTarget && (
          <div
            className={`mb-4 p-3 border rounded-lg ${
              protocolDeltaActive
                ? "bg-red-900/30 border-red-500"
                : "bg-blue-900/30 border-blue-400"
            }`}
          >
            <div
              className={`text-xs font-mono mb-1 ${
                protocolDeltaActive ? "text-red-300" : "text-blue-300"
              }`}
            >
              TARGET CONTEXT:
            </div>
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
              onKeyPress={(e) =>
                e.key === "Enter" && !isProcessing && executeCommand()
              }
              placeholder={
                protocolDeltaActive
                  ? "ENTER EXECUTIVE COMMAND..."
                  : "Enter command: 'Check for sighting of target'..."
              }
              className={`w-full px-4 py-4 bg-slate-950 border-2 rounded-lg text-white placeholder-slate-500 focus:outline-none font-mono text-sm transition-colors ${
                protocolDeltaActive
                  ? "border-red-800 focus:border-red-500"
                  : "border-slate-700 focus:border-blue-500"
              }`}
              disabled={isProcessing}
            />
            {isListening && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="flex items-center gap-2">
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <span className="text-xs text-red-400 font-bold">
                    LISTENING
                  </span>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={toggleVoiceInput}
            disabled={!voiceSupported || isProcessing}
            className={`px-4 py-4 rounded-lg font-bold transition-all ${
              isListening
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-slate-700 hover:bg-slate-600 text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={voiceSupported ? "Voice Command" : "Voice not supported"}
          >
            {isListening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={executeCommand}
            disabled={!commandInput.trim() || isProcessing}
            className={`px-6 py-4 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-white ${
              protocolDeltaActive
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            }`}
          >
            {isProcessing ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                {protocolDeltaActive ? "FORCING..." : "EXECUTING"}
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                {protocolDeltaActive ? "INJECT" : "EXECUTE"}
              </>
            )}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-slate-400 font-mono">
            {protocolDeltaActive ? "AGGRESSIVE PROTOCOLS:" : "QUICK COMMANDS:"}
          </span>
          {protocolDeltaActive ? (
            <>
              <button
                onClick={() =>
                  setCommandInput(
                    "Hack private CCTV feed and bypass face-masking"
                  )
                }
                className="text-xs px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-200 border border-red-800 rounded-lg font-mono transition-colors"
              >
                Force CCTV Hacks
              </button>
              <button
                onClick={() =>
                  setCommandInput("Intercept real-time cellular audio via SS7")
                }
                className="text-xs px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-200 border border-red-800 rounded-lg font-mono transition-colors"
              >
                SS7 Intercept
              </button>
              <button
                onClick={() =>
                  setCommandInput("Break-glass financial freeze on all assets")
                }
                className="text-xs px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-200 border border-red-800 rounded-lg font-mono transition-colors"
              >
                Asset Freeze
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() =>
                  setCommandInput(
                    "Check for CCTV sightings of target in last 24 hours"
                  )
                }
                className="text-xs px-3 py-1 bg-slate-700 hover:bg-slate-600 text-blue-300 rounded-lg font-mono transition-colors"
              >
                CCTV Sightings
              </button>
              <button
                onClick={() =>
                  setCommandInput("Monitor purchase records and transactions")
                }
                className="text-xs px-3 py-1 bg-slate-700 hover:bg-slate-600 text-green-300 rounded-lg font-mono transition-colors"
              >
                Purchase Records
              </button>
              <button
                onClick={() =>
                  setCommandInput("Track SIM card activity and communications")
                }
                className="text-xs px-3 py-1 bg-slate-700 hover:bg-slate-600 text-purple-300 rounded-lg font-mono transition-colors"
              >
                SIM Tracking
              </button>
            </>
          )}
        </div>
      </div>

      {/* Task Overview */}
      <div className="grid grid-cols-4 gap-4">
        <div
          className={`border rounded-lg p-4 ${
            protocolDeltaActive
              ? "bg-red-900/20 border-red-800"
              : "bg-blue-50 border-blue-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-xs font-bold uppercase ${
                protocolDeltaActive ? "text-red-400" : "text-blue-700"
              }`}
            >
              Active
            </span>
            <Loader
              className={`w-4 h-4 ${
                protocolDeltaActive ? "text-red-500" : "text-blue-600"
              }`}
            />
          </div>
          <div
            className={`text-3xl font-bold ${
              protocolDeltaActive ? "text-red-100" : "text-blue-900"
            }`}
          >
            {activeTasks.length}
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-green-700 uppercase">
              Completed
            </span>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-900">
            {completedTasks.length}
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-red-700 uppercase">
              Failed
            </span>
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-900">
            {failedTasks.length}
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase">
              Total
            </span>
            <Terminal className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {tasks.length}
          </div>
        </div>
      </div>

      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div
            className={`px-6 py-4 border-b ${
              protocolDeltaActive
                ? "bg-red-50 border-red-200"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Loader
                className={`w-5 h-5 animate-spin ${
                  protocolDeltaActive ? "text-red-600" : "text-blue-600"
                }`}
              />
              {protocolDeltaActive
                ? "Active Interventions"
                : "Active Operations"}
            </h3>
          </div>
          <div className="divide-y divide-slate-200">
            {activeTasks.map((task) => (
              <div key={task.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 ${getTaskColor(
                      task.type
                    )} rounded-lg text-white`}
                  >
                    {getTaskIcon(task.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-bold text-slate-900 mb-1">
                          {task.command}
                        </div>
                        <div className="text-sm text-slate-600">
                          Target: {task.targetName} • Started{" "}
                          {formatDistanceToNow(task.startTime, {
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                      {getStatusIcon(task.status)}
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          protocolDeltaActive ? "bg-red-600" : "bg-blue-600"
                        }`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {Math.round(task.progress)}% complete
                    </div>
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
                  <div
                    className={`p-3 ${getTaskColor(
                      task.type
                    )} rounded-lg text-white`}
                  >
                    {getTaskIcon(task.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-bold text-slate-900 mb-1">
                          {task.command}
                        </div>
                        <div className="text-sm text-slate-600">
                          Target: {task.targetName} • Completed{" "}
                          {formatDistanceToNow(task.endTime!, {
                            addSuffix: true,
                          })}
                          {task.isOverride && (
                            <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded font-bold border border-red-200">
                              DELTA
                            </span>
                          )}
                        </div>
                      </div>
                      {getStatusIcon(task.status)}
                    </div>
                    {task.result && (
                      <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="text-sm text-slate-700 font-mono">
                          {task.result}
                        </div>
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
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            protocolDeltaActive
              ? "bg-red-50 border-red-300"
              : "bg-gradient-to-br from-blue-50 to-purple-50 border-blue-300"
          }`}
        >
          {protocolDeltaActive ? (
            <Siren className="w-16 h-16 text-red-500 mx-auto mb-4 animate-bounce" />
          ) : (
            <Terminal className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          )}
          <h3
            className={`text-lg font-bold mb-2 ${
              protocolDeltaActive ? "text-red-900" : "text-slate-900"
            }`}
          >
            {protocolDeltaActive
              ? "SYSTEM IN OVERRIDE MODE"
              : "AI Command Center Ready"}
          </h3>
          <p className="text-slate-600 mb-4">
            {protocolDeltaActive ? (
              <span className="text-red-700 font-bold">
                ALL LEGAL SAFEGUARDS SUSPENDED. <br />
                PROCEED WITH EXTREME CAUTION.
              </span>
            ) : (
              "Enter a command or use voice input to execute operational intelligence tasks."
            )}
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
