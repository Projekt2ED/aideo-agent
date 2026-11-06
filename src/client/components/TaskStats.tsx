import { useState, useEffect } from 'react';
import { taskApi } from '../utils/api';
import { BarChart3, TrendingUp, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface TaskStatsData {
  total: number;
  byStatus: Record<string, number>;
  recentCount: number;
}

export function TaskStats() {
  const [stats, setStats] = useState<TaskStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await taskApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('加载统计数据失败:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        <span>加载统计数据...</span>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statusItems = [
    { key: 'completed', label: '已完成', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
    { key: 'processing', label: '处理中', icon: Loader2, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { key: 'pending', label: '等待中', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/20' },
    { key: 'failed', label: '失败', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20' },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* 标题 */}
      <div className="flex items-center gap-2 text-slate-200">
        <BarChart3 className="w-5 h-5 text-violet-400" />
        <h3 className="font-medium">任务统计</h3>
      </div>

      {/* 总任务数 */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-sm">总任务数</span>
          <span className="text-2xl font-bold text-white">{stats.total}</span>
        </div>
        <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
          <TrendingUp className="w-3 h-3" />
          <span>最近 7 天: {stats.recentCount} 个任务</span>
        </div>
      </div>

      {/* 状态分布 */}
      <div className="space-y-2">
        <p className="text-xs text-slate-500 uppercase tracking-wider">状态分布</p>
        {statusItems.map(({ key, label, icon: Icon, color, bg }) => {
          const count = stats.byStatus[key] || 0;
          const percent = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;

          return (
            <div key={key} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
              <div className={`p-2 rounded-lg ${bg}`}>
                <Icon className={`w-4 h-4 ${color} ${key === 'processing' ? 'animate-spin' : ''}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">{label}</span>
                  <span className="text-sm font-medium text-white">{count}</span>
                </div>
                {/* 进度条 */}
                <div className="mt-1.5 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      key === 'completed' ? 'bg-emerald-500' :
                      key === 'processing' ? 'bg-blue-500' :
                      key === 'pending' ? 'bg-amber-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-slate-500 w-10 text-right">{percent}%</span>
            </div>
          );
        })}
      </div>

      {/* 刷新按钮 */}
      <button
        onClick={loadStats}
        className="w-full py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
      >
        刷新统计
      </button>
    </div>
  );
}
